import { DESCRIPTIONS } from '../data/descriptions';

export default function ExerciseInfoModal({ exercise, dayColor, onClose }) {
  // Custom exercises store desc inline; built-in ones look up DESCRIPTIONS
  const desc = exercise.desc || DESCRIPTIONS[exercise.name];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="info-modal">
        {/* Handle bar */}
        <div className="info-handle" />

        {/* Header */}
        <div className="info-header" style={{ '--day-color': dayColor }}>
          <div className="info-header-left">
            <span
              className="info-label-badge"
              style={{ background: dayColor + '25', color: dayColor }}
            >
              {exercise.label}
            </span>
            <div>
              <h3 className="info-name">{exercise.name}</h3>
              {exercise.note && <p className="info-note">{exercise.note}</p>}
            </div>
          </div>
          <button className="info-close" onClick={onClose}>✕</button>
        </div>

        {/* Scrollable content */}
        <div className="info-body">
          {/* Quick stats */}
          <div className="info-stats-row">
            <StatBadge icon="🎯" label={exercise.target} />
            <StatBadge icon="🔁" label={`${exercise.sets} × ${exercise.repsStr}`} />
            {exercise.tempoStr && exercise.tempoStr !== '—' && (
              <StatBadge icon="⏱" label={`Tempo ${exercise.tempoStr}`} />
            )}
            {exercise.rir && <StatBadge icon="💪" label={`RIR ${exercise.rir}`} />}
            {exercise.restSec > 0 && <StatBadge icon="⏳" label={`${exercise.restSec}sn dinlen`} />}
          </div>

          {desc ? (
            <>
              {desc.why && (
                <InfoSection title="Neden Bu Hareket?" icon="🔬" color="#818cf8">
                  <p className="info-text">{desc.why}</p>
                </InfoSection>
              )}

              {desc.equipment && (
                <InfoSection title="Ekipman" icon="🏋️" color="#94a3b8">
                  <p className="info-text">{desc.equipment}</p>
                </InfoSection>
              )}

              {desc.prep?.length > 0 && (
                <InfoSection title="Hazırlık" icon="📋" color="#fbbf24">
                  <StepList steps={desc.prep} type="dot" />
                </InfoSection>
              )}

              {desc.steps?.length > 0 && (
                <InfoSection title="Yapılış" icon="▶" color={dayColor}>
                  <StepList steps={desc.steps} type="number" />
                </InfoSection>
              )}

              {desc.errors?.length > 0 && (
                <InfoSection title="Kritik Hatalar" icon="⚠️" color="#f87171">
                  <StepList steps={desc.errors} type="x" color="#f87171" />
                </InfoSection>
              )}

              {desc.tip && (
                <div className="info-tip">
                  <span>💡</span>
                  <p>{desc.tip}</p>
                </div>
              )}

              {desc.warning && (
                <div className="info-warning">
                  <span>⚕️</span>
                  <p>{desc.warning}</p>
                </div>
              )}
            </>
          ) : (
            <div className="info-no-desc">
              <p>Bu hareket için detaylı açıklama mevcut değil.</p>
            </div>
          )}

          {/* Tempo guide if timed */}
          {exercise.tempo && (
            <InfoSection title="Bu Setin Temposu" icon="⏱" color="#34d399">
              <div className="tempo-breakdown">
                <TempoPhase label="İniş (eccentric)" sec={exercise.tempo.down} color="#f97316"
                  hint="Yavaş ve kontrollü — kas hasarı bu fazda oluşur" />
                <TempoPhase label="Bekleme (pause)" sec={exercise.tempo.hold} color="#fbbf24"
                  hint="Altta tut — gerilimi hisset" />
                <TempoPhase label="Çıkış (concentric)" sec={exercise.tempo.up} color="#34d399"
                  hint="Güçlü çıkış" />
                <div className="tempo-total">
                  Tekrar başına toplam:
                  <strong> {exercise.tempo.down + exercise.tempo.hold + exercise.tempo.up} saniye</strong>
                </div>
              </div>
            </InfoSection>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoSection({ title, icon, color, children }) {
  return (
    <div className="info-section">
      <div className="info-section-title" style={{ color }}>
        <span>{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}

function StepList({ steps, type, color }) {
  return (
    <ol className="info-steps">
      {steps.map((s, i) => (
        <li key={i} className="info-step">
          <span
            className="step-marker"
            style={color ? { color, borderColor: color + '40' } : {}}
          >
            {type === 'number' ? i + 1 : type === 'x' ? '✕' : '·'}
          </span>
          <span className="step-text">{s}</span>
        </li>
      ))}
    </ol>
  );
}

function StatBadge({ icon, label }) {
  return (
    <span className="info-stat-badge">
      {icon} {label}
    </span>
  );
}

function TempoPhase({ label, sec, color, hint }) {
  return (
    <div className="tempo-bp-row">
      <div className="tempo-bp-left">
        <span className="tempo-bp-sec" style={{ color }}>{sec}<small>sn</small></span>
        <span className="tempo-bp-label">{label}</span>
      </div>
      <span className="tempo-bp-hint">{hint}</span>
    </div>
  );
}
