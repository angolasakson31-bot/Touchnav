import { useReducer, useEffect, useRef } from 'react';

// ─── State machine ────────────────────────────────────────────────────────────

function initState(exercise, setIndex) {
  const reps = exercise.repsMin || 1;
  const rest = exercise.restSec || 0;
  const type = exercise.type;
  const tempo = exercise.tempo; // { down, hold, up } or null
  const holdDuration = exercise.holdDuration || 5;

  return {
    phase: 'idle',          // idle | prep | rep-down | rep-hold | rep-up | holding | manual | rest | done
    countdown: 0,
    phaseTotal: 0,
    currentRep: 0,
    totalReps: reps,
    type,
    tempo,
    holdDuration,
    restSec: rest,
    setIndex,
  };
}

function transition(s) {
  const { phase, currentRep, totalReps, tempo, holdDuration, restSec, type } = s;

  const goRest = () =>
    restSec > 0
      ? { ...s, phase: 'rest', countdown: restSec, phaseTotal: restSec }
      : { ...s, phase: 'done' };

  if (phase === 'prep') {
    if (type === 'manual') return { ...s, phase: 'manual', currentRep: 1, countdown: 0, phaseTotal: 0 };
    if (type === 'hold' || type === 'stretch') {
      return { ...s, phase: 'holding', currentRep: 1, countdown: holdDuration, phaseTotal: holdDuration };
    }
    // timed
    return { ...s, phase: 'rep-down', currentRep: 1, countdown: tempo.down, phaseTotal: tempo.down };
  }

  if (phase === 'rep-down') {
    if (tempo.hold > 0)
      return { ...s, phase: 'rep-hold', countdown: tempo.hold, phaseTotal: tempo.hold };
    return { ...s, phase: 'rep-up', countdown: tempo.up, phaseTotal: Math.max(tempo.up, 1) };
  }

  if (phase === 'rep-hold') {
    return { ...s, phase: 'rep-up', countdown: tempo.up, phaseTotal: Math.max(tempo.up, 1) };
  }

  if (phase === 'rep-up') {
    if (currentRep < totalReps)
      return { ...s, phase: 'rep-down', countdown: tempo.down, phaseTotal: tempo.down, currentRep: currentRep + 1 };
    return goRest();
  }

  if (phase === 'holding') {
    if (currentRep < totalReps)
      return { ...s, phase: 'holding', countdown: holdDuration, phaseTotal: holdDuration, currentRep: currentRep + 1 };
    return goRest();
  }

  if (phase === 'rest') return { ...s, phase: 'done' };

  return s;
}

function timerReducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, phase: 'prep', countdown: 3, phaseTotal: 3 };

    case 'TICK': {
      if (!['prep', 'rep-down', 'rep-hold', 'rep-up', 'holding', 'rest'].includes(state.phase)) return state;
      if (state.countdown > 1) return { ...state, countdown: state.countdown - 1 };
      return transition(state);
    }

    case 'MANUAL_NEXT': {
      const next = state.currentRep + 1;
      if (next > state.totalReps) {
        return state.restSec > 0
          ? { ...state, phase: 'rest', countdown: state.restSec, phaseTotal: state.restSec }
          : { ...state, phase: 'done' };
      }
      return { ...state, currentRep: next };
    }

    case 'SKIP_REST':
      return { ...state, phase: 'done' };

    default:
      return state;
  }
}

// ─── Phase config ─────────────────────────────────────────────────────────────

const PHASE_CONFIG = {
  'prep':     { label: 'HAZIRLAN', sub: 'Başlamaya hazır ol', color: '#818cf8', bg: 'rgba(99,102,241,0.2)' },
  'rep-down': { label: 'İNİŞ ↓',   sub: 'Yavaşça indir',     color: '#f97316', bg: 'rgba(249,115,22,0.2)' },
  'rep-hold': { label: 'BEKLE ⏸',  sub: 'Altta tut',         color: '#fbbf24', bg: 'rgba(251,191,36,0.2)' },
  'rep-up':   { label: 'ÇIKIŞ ↑',  sub: 'Kaldır',            color: '#34d399', bg: 'rgba(52,211,153,0.2)' },
  'holding':  { label: 'TUT',       sub: 'Pozisyonu koru',   color: '#fbbf24', bg: 'rgba(251,191,36,0.2)' },
  'manual':   { label: 'TEKRAR',    sub: 'Her tekrarda bas', color: '#a78bfa', bg: 'rgba(167,139,250,0.2)' },
  'rest':     { label: 'DİNLENME', sub: 'Nefesini al',       color: '#6366f1', bg: 'rgba(99,102,241,0.2)' },
  'done':     { label: 'TAMAMLANDI ✓', sub: '',              color: '#34d399', bg: 'rgba(52,211,153,0.2)' },
};

// ─── Circular progress SVG ────────────────────────────────────────────────────

function CircleProgress({ value, total, color }) {
  const r = 72;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? value / total : 1;
  const offset = circ * (1 - pct);

  return (
    <svg className="timer-circle" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle
        cx="80" cy="80" r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 80 80)"
        style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
      />
    </svg>
  );
}

// ─── TimerModal ───────────────────────────────────────────────────────────────

export default function TimerModal({ exercise, setIndex, onDone, onClose }) {
  const [state, dispatch] = useReducer(timerReducer, initState(exercise, setIndex));
  const intervalRef = useRef(null);

  const isActive = ['prep', 'rep-down', 'rep-hold', 'rep-up', 'holding', 'rest'].includes(state.phase);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [state.phase]); // restart interval on phase change

  useEffect(() => {
    if (state.phase === 'done') {
      onDone();
    }
  }, [state.phase]);

  const cfg = PHASE_CONFIG[state.phase] || PHASE_CONFIG['prep'];

  const tempoLabel = exercise.tempoStr && exercise.tempoStr !== '—'
    ? `Tempo ${exercise.tempoStr}`
    : null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="timer-modal">
        {/* Header */}
        <div className="timer-header">
          <div className="timer-exercise-name">{exercise.name}</div>
          <div className="timer-meta">
            <span>Set {setIndex + 1}/{exercise.sets}</span>
            {tempoLabel && <span>{tempoLabel}</span>}
            <span>{exercise.repsStr} tekrar</span>
          </div>
          <button className="timer-close" onClick={onClose}>✕</button>
        </div>

        {/* Main display */}
        <div className="timer-body" style={{ '--phase-color': cfg.color, '--phase-bg': cfg.bg }}>

          {state.phase === 'idle' && (
            <div className="timer-start-area">
              <div className="timer-start-info">
                {exercise.type === 'timed' && (
                  <>
                    <div className="timer-tempo-preview">
                      <TempoVisual tempo={exercise.tempo} />
                    </div>
                    <p className="timer-hint">3 saniyelik hazırlanma sonrası tempo başlar</p>
                  </>
                )}
                {exercise.type === 'manual' && (
                  <p className="timer-hint">Her tamamlanan tekrarda butona bas</p>
                )}
                {(exercise.type === 'hold' || exercise.type === 'stretch') && (
                  <p className="timer-hint">
                    {exercise.holdDuration} saniyelik {exercise.type === 'stretch' ? 'germe' : 'tutma'}
                    {exercise.repsMin > 1 ? ` × ${exercise.repsMin} tekrar` : ''}
                  </p>
                )}
              </div>
              <button
                className="btn-start"
                onClick={() => dispatch({ type: 'START' })}
              >
                Başla
              </button>
            </div>
          )}

          {state.phase === 'manual' && (
            <div className="timer-manual">
              <div className="manual-rep-display">
                <span className="manual-rep-current">{state.currentRep}</span>
                <span className="manual-rep-sep">/</span>
                <span className="manual-rep-total">{state.totalReps}</span>
              </div>
              <p className="phase-sub">Tekrar tamamlandıkça bas</p>
              <button
                className="btn-rep-tap"
                onClick={() => dispatch({ type: 'MANUAL_NEXT' })}
              >
                Tekrar Tamamlandı ✓
              </button>
            </div>
          )}

          {isActive && state.phase !== 'manual' && (
            <>
              <div className="phase-label">{cfg.label}</div>
              <div className="timer-ring-wrap">
                <CircleProgress
                  value={state.countdown}
                  total={state.phaseTotal}
                  color={cfg.color}
                />
                <div className="timer-number">{state.countdown}</div>
              </div>
              <div className="phase-sub">{cfg.sub}</div>

              {state.phase !== 'prep' && state.phase !== 'rest' && (
                <div className="rep-counter">
                  {state.phase === 'holding'
                    ? `Tekrar ${state.currentRep} / ${state.totalReps}`
                    : `Tekrar ${state.currentRep} / ${state.totalReps}`
                  }
                </div>
              )}

              {state.phase === 'rest' && (
                <button
                  className="btn-skip-rest"
                  onClick={() => dispatch({ type: 'SKIP_REST' })}
                >
                  Dinlenmeyi Geç →
                </button>
              )}
            </>
          )}

          {state.phase === 'done' && (
            <div className="timer-done">
              <div className="done-icon">✓</div>
              <div className="done-text">Set Tamamlandı!</div>
              {exercise.restSec === 0 && exercise.group && (
                <p className="done-hint">Süperset — sonraki harekete geç</p>
              )}
            </div>
          )}
        </div>

        {/* RIR reminder */}
        {exercise.rir && state.phase !== 'idle' && state.phase !== 'done' && (
          <div className="rir-badge">Hedef RIR: {exercise.rir}</div>
        )}
      </div>
    </div>
  );
}

function TempoVisual({ tempo }) {
  if (!tempo) return null;
  const phases = [
    { label: 'İniş', val: tempo.down, color: '#f97316' },
    { label: 'Bekle', val: tempo.hold, color: '#fbbf24' },
    { label: 'Çıkış', val: tempo.up, color: '#34d399' },
  ];
  return (
    <div className="tempo-visual">
      {phases.map((p, i) => (
        <div key={i} className="tempo-phase" style={{ '--c': p.color }}>
          <div className="tempo-val">{p.val}<span>sn</span></div>
          <div className="tempo-lbl">{p.label}</div>
        </div>
      ))}
    </div>
  );
}
