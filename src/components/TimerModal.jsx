import { useReducer, useEffect, useRef } from 'react';

// ─── State machine ────────────────────────────────────────────────────────────

function initState(exercise) {
  return {
    phase: 'idle',
    countdown: 0,
    phaseTotal: 0,
    currentRep: 0,
    totalReps: exercise.repsMin || 1,
    type: exercise.type,
    tempo: exercise.tempo,
    holdDuration: exercise.holdDuration || 5,
    restSec: exercise.restSec || 0,
  };
}

function transition(s) {
  const { phase, currentRep, totalReps, tempo, holdDuration, restSec, type } = s;

  const goRest = () =>
    restSec > 0
      ? { ...s, phase: 'rest', countdown: restSec, phaseTotal: restSec }
      : { ...s, phase: 'done' };

  if (phase === 'prep') {
    if (type === 'manual')
      return { ...s, phase: 'manual', currentRep: 1, countdown: 0, phaseTotal: 0 };
    if (type === 'hold' || type === 'stretch')
      return { ...s, phase: 'holding', currentRep: 1, countdown: holdDuration, phaseTotal: holdDuration };
    return { ...s, phase: 'rep-down', currentRep: 1, countdown: tempo.down, phaseTotal: tempo.down };
  }
  if (phase === 'rep-down') {
    if (tempo.hold > 0)
      return { ...s, phase: 'rep-hold', countdown: tempo.hold, phaseTotal: tempo.hold };
    return { ...s, phase: 'rep-up', countdown: tempo.up, phaseTotal: Math.max(tempo.up, 1) };
  }
  if (phase === 'rep-hold')
    return { ...s, phase: 'rep-up', countdown: tempo.up, phaseTotal: Math.max(tempo.up, 1) };
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

    case 'SET_REPS':
      if (state.phase !== 'idle') return state;
      return { ...state, totalReps: Math.max(1, action.reps) };

    case 'TICK': {
      const active = ['prep', 'rep-down', 'rep-hold', 'rep-up', 'holding', 'rest'];
      if (!active.includes(state.phase)) return state;
      if (state.countdown > 1) return { ...state, countdown: state.countdown - 1 };
      return transition(state);
    }

    case 'MANUAL_NEXT': {
      const next = state.currentRep + 1;
      if (next > state.totalReps)
        return state.restSec > 0
          ? { ...state, phase: 'rest', countdown: state.restSec, phaseTotal: state.restSec }
          : { ...state, phase: 'done' };
      return { ...state, currentRep: next };
    }

    case 'SKIP_REST':
      return { ...state, phase: 'done' };

    default:
      return state;
  }
}

// ─── Phase config ─────────────────────────────────────────────────────────────

const PHASE_CFG = {
  prep:     { label: 'HAZIRLAN',       sub: 'Başlamaya hazır ol',   color: '#818cf8', bg: 'rgba(99,102,241,0.15)' },
  'rep-down':{ label: 'İNİŞ ↓',        sub: 'Yavaşça indir',        color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  'rep-hold':{ label: 'BEKLE ⏸',       sub: 'Altta tut',            color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  'rep-up':  { label: 'ÇIKIŞ ↑',       sub: 'Güçlü çık',            color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
  holding:   { label: 'TUT',            sub: 'Pozisyonu koru',       color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  manual:    { label: 'TEKRAR',         sub: 'Her tekrarda bas',     color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  rest:      { label: 'DİNLENME',      sub: 'Nefesini topla',       color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
  done:      { label: 'TAMAMLANDI ✓',  sub: '',                     color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
};

// ─── Circular progress ────────────────────────────────────────────────────────

function CircleProgress({ value, total, color }) {
  const r = 72;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - (total > 0 ? value / total : 1));
  return (
    <svg className="timer-circle" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 80 80)"
        style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
      />
    </svg>
  );
}

// ─── TimerModal ───────────────────────────────────────────────────────────────

export default function TimerModal({ exercise, setIndex, onDone, onClose }) {
  const [s, dispatch] = useReducer(timerReducer, initState(exercise));
  const intervalRef = useRef(null);

  const activePhrases = ['prep', 'rep-down', 'rep-hold', 'rep-up', 'holding', 'rest'];
  const isActive = activePhrases.includes(s.phase);

  // Restart interval on every phase change
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [s.phase]);

  useEffect(() => {
    if (s.phase === 'done') onDone();
  }, [s.phase]);

  const cfg = PHASE_CFG[s.phase] || PHASE_CFG.prep;
  const tempoLabel = exercise.tempoStr && exercise.tempoStr !== '—' ? `Tempo ${exercise.tempoStr}` : null;
  const perRepSec = exercise.tempo
    ? exercise.tempo.down + exercise.tempo.hold + exercise.tempo.up
    : exercise.holdDuration || 0;
  const estTotal = perRepSec > 0
    ? Math.round(perRepSec * s.totalReps)
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
            {exercise.rir && <span>RIR {exercise.rir}</span>}
          </div>
          <button className="timer-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="timer-body" style={{ '--phase-color': cfg.color, '--phase-bg': cfg.bg }}>

          {/* ── IDLE ── */}
          {s.phase === 'idle' && (
            <div className="timer-start-area">
              {/* Tempo preview for timed exercises */}
              {exercise.type === 'timed' && exercise.tempo && (
                <TempoVisual tempo={exercise.tempo} />
              )}

              {/* Rep adjuster */}
              <div className="rep-adjuster-wrap">
                <p className="rep-adj-label">
                  Hedef: <strong>{exercise.repsStr}</strong> tekrar
                </p>
                <div className="rep-adjuster">
                  <button
                    className="rep-adj-btn"
                    onClick={() => dispatch({ type: 'SET_REPS', reps: s.totalReps - 1 })}
                    disabled={s.totalReps <= 1}
                  >−</button>
                  <div className="rep-adj-display">
                    <span className="rep-adj-num">{s.totalReps}</span>
                    <span className="rep-adj-unit">tekrar</span>
                  </div>
                  <button
                    className="rep-adj-btn"
                    onClick={() => dispatch({ type: 'SET_REPS', reps: s.totalReps + 1 })}
                  >+</button>
                </div>
                {estTotal && (
                  <p className="rep-adj-est">≈ {estTotal} saniye + {exercise.restSec > 0 ? `${exercise.restSec}sn dinlenme` : 'dinlenme yok'}</p>
                )}
              </div>

              {exercise.type === 'manual' && (
                <p className="timer-hint">Her tamamlanan tekrarda butona bas</p>
              )}
              {(exercise.type === 'hold' || exercise.type === 'stretch') && (
                <p className="timer-hint">
                  {exercise.holdDuration} sn tutma
                  {s.totalReps > 1 ? ` × ${s.totalReps} tekrar` : ''}
                </p>
              )}

              <button className="btn-start" onClick={() => dispatch({ type: 'START' })}>
                Başla
              </button>
            </div>
          )}

          {/* ── MANUAL ── */}
          {s.phase === 'manual' && (
            <div className="timer-manual">
              <div className="manual-rep-display">
                <span className="manual-rep-current">{s.currentRep}</span>
                <span className="manual-rep-sep">/</span>
                <span className="manual-rep-total">{s.totalReps}</span>
              </div>
              <p className="phase-sub">Tekrar tamamlandıkça bas</p>
              <button className="btn-rep-tap" onClick={() => dispatch({ type: 'MANUAL_NEXT' })}>
                Tekrar Tamamlandı ✓
              </button>
            </div>
          )}

          {/* ── ACTIVE TIMER ── */}
          {isActive && s.phase !== 'manual' && (
            <>
              <div className="phase-label" style={{ color: cfg.color }}>{cfg.label}</div>
              <div className="timer-ring-wrap">
                <CircleProgress value={s.countdown} total={s.phaseTotal} color={cfg.color} />
                <div className="timer-number">{s.countdown}</div>
              </div>
              <div className="phase-sub">{cfg.sub}</div>

              {s.phase !== 'prep' && s.phase !== 'rest' && (
                <div className="rep-counter">
                  Tekrar {s.currentRep} / {s.totalReps}
                </div>
              )}

              {s.phase === 'rest' && (
                <button className="btn-skip-rest" onClick={() => dispatch({ type: 'SKIP_REST' })}>
                  Dinlenmeyi Geç →
                </button>
              )}
            </>
          )}

          {/* ── DONE ── */}
          {s.phase === 'done' && (
            <div className="timer-done">
              <div className="done-icon">✓</div>
              <div className="done-text">Set Tamamlandı!</div>
              {exercise.restSec === 0 && exercise.group && (
                <p className="done-hint">Süperset — sonraki harekete geç</p>
              )}
            </div>
          )}
        </div>

        {/* RIR reminder during active */}
        {exercise.rir && isActive && s.phase !== 'prep' && (
          <div className="rir-badge">Hedef RIR: {exercise.rir}</div>
        )}
      </div>
    </div>
  );
}

function TempoVisual({ tempo }) {
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
