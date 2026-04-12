import { useState, useMemo } from 'react';
import TimerModal from './TimerModal';

// Group exercises by their superset group
function groupExercises(exercises) {
  const result = [];
  const seen = new Set();

  for (const ex of exercises) {
    if (ex.group && !seen.has(ex.group)) {
      seen.add(ex.group);
      const members = exercises.filter(e => e.group === ex.group)
        .sort((a, b) => a.groupOrder - b.groupOrder);
      result.push({ type: 'superset', id: ex.group, members });
    } else if (!ex.group) {
      result.push({ type: 'solo', id: ex.id, ex });
    }
  }
  return result;
}

export default function WorkoutDay({ day, isSetDone, toggleSet, markSetDone, getDayProgress }) {
  const [timerTarget, setTimerTarget] = useState(null); // { exercise, setIndex }

  const groups = useMemo(() => groupExercises(day.exercises), [day]);
  const prog = getDayProgress(day);

  return (
    <div className="workout-day">
      {/* Day header */}
      <div className="day-header" style={{ '--day-color': day.color, '--day-dim': day.colorDim }}>
        <div className="day-header-top">
          <div>
            <h2 className="day-title">{day.name} — {day.day}</h2>
            <p className="day-focus">{day.focus}</p>
            <p className="day-subtitle">{day.subtitle}</p>
          </div>
          <div className="day-badge">
            <span>{day.duration}</span>
          </div>
        </div>
        <p className="day-target">{day.target}</p>
        <div className="day-progress-bar-wrap">
          <div className="day-progress-bar" style={{ width: `${prog.pct}%`, background: day.color }} />
        </div>
        <div className="day-progress-label">{prog.done}/{prog.total} set · %{prog.pct}</div>
        <p className="day-summary">{day.summary}</p>
      </div>

      {/* Exercise groups */}
      <div className="exercise-list">
        {groups.map(group => (
          group.type === 'superset'
            ? <SupersetGroup
                key={group.id}
                group={group}
                dayColor={day.color}
                isSetDone={isSetDone}
                toggleSet={toggleSet}
                onStartTimer={setTimerTarget}
              />
            : <ExerciseCard
                key={group.id}
                exercise={group.ex}
                dayColor={day.color}
                isSetDone={isSetDone}
                toggleSet={toggleSet}
                onStartTimer={setTimerTarget}
              />
        ))}
      </div>

      {/* Timer modal */}
      {timerTarget && (
        <TimerModal
          exercise={timerTarget.exercise}
          setIndex={timerTarget.setIndex}
          onDone={() => {
            markSetDone(timerTarget.exercise.id, timerTarget.setIndex);
            setTimerTarget(null);
          }}
          onClose={() => setTimerTarget(null)}
        />
      )}
    </div>
  );
}

// ─── Superset group ───────────────────────────────────────────────────────────

function SupersetGroup({ group, dayColor, isSetDone, toggleSet, onStartTimer }) {
  return (
    <div className="superset-group">
      <div className="superset-label" style={{ color: dayColor }}>
        <span className="superset-tag">{group.id}</span>
        <span className="superset-hint">Arka arkaya · aralarında dinlenme yok</span>
      </div>
      <div className="superset-cards">
        {group.members.map((ex, idx) => (
          <div key={ex.id} className="superset-member">
            {idx > 0 && (
              <div className="superset-arrow" style={{ color: dayColor }}>
                ↓ direkt geç
              </div>
            )}
            <ExerciseCard
              exercise={ex}
              dayColor={dayColor}
              isSetDone={isSetDone}
              toggleSet={toggleSet}
              onStartTimer={onStartTimer}
              nested
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Exercise card ────────────────────────────────────────────────────────────

function ExerciseCard({ exercise, dayColor, isSetDone, toggleSet, onStartTimer, nested }) {
  const isStretch = exercise.label === '✦';
  const allDone = Array.from({ length: exercise.sets }, (_, i) => i).every(i => isSetDone(exercise.id, i));

  return (
    <div className={`exercise-card ${nested ? 'nested' : ''} ${allDone ? 'all-done' : ''}`}
         style={{ '--day-color': dayColor }}>
      {/* Label + name */}
      <div className="exercise-top">
        <span className={`exercise-label ${isStretch ? 'stretch-label' : ''}`}
              style={!isStretch ? { background: dayColor + '30', color: dayColor } : {}}>
          {exercise.label}
        </span>
        <div className="exercise-name-wrap">
          <span className="exercise-name">{exercise.name}</span>
          {exercise.note && <span className="exercise-note"> ({exercise.note})</span>}
          {allDone && <span className="all-done-badge">✓</span>}
        </div>
      </div>

      {/* Stats row */}
      <div className="exercise-stats">
        <Chip label={`${exercise.sets}×${exercise.repsStr}`} icon="🔁" />
        {exercise.tempoStr && exercise.tempoStr !== '—' && (
          <Chip label={`Tempo ${exercise.tempoStr}`} icon="⏱" />
        )}
        {exercise.rir && <Chip label={`RIR ${exercise.rir}`} icon="💪" />}
        {exercise.restSec > 0 && <Chip label={`${exercise.restSec}sn dinlen`} icon="⏳" />}
        {exercise.restSec === 0 && exercise.group && (
          <Chip label="Direkt geç →" color="warn" />
        )}
      </div>

      {/* Target */}
      <div className="exercise-target">{exercise.target}</div>

      {/* Set rows */}
      <div className="sets-list">
        {Array.from({ length: exercise.sets }, (_, i) => (
          <SetRow
            key={i}
            exercise={exercise}
            setIndex={i}
            done={isSetDone(exercise.id, i)}
            onToggle={() => toggleSet(exercise.id, i)}
            onTimer={() => onStartTimer({ exercise, setIndex: i })}
            dayColor={dayColor}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Set row ──────────────────────────────────────────────────────────────────

function SetRow({ exercise, setIndex, done, onToggle, onTimer, dayColor }) {
  const perRepSec = exercise.tempo
    ? exercise.tempo.down + exercise.tempo.hold + exercise.tempo.up
    : exercise.holdDuration || 0;

  return (
    <div className={`set-row ${done ? 'set-done' : ''}`}>
      <button
        className="set-check"
        onClick={onToggle}
        style={done ? { background: dayColor, borderColor: dayColor } : {}}
        aria-label={done ? 'Seti geri al' : 'Seti tamamla'}
      >
        {done ? '✓' : ''}
      </button>

      <div className="set-info">
        <span className="set-num">Set {setIndex + 1}</span>
        <span className="set-reps">{exercise.repsStr} tekrar</span>
        {perRepSec > 0 && (
          <span className="set-duration">
            ≈ {Math.round(perRepSec * (exercise.repsMin || 1) / 60 * 10) / 10} dk
          </span>
        )}
      </div>

      <button
        className="btn-timer"
        onClick={onTimer}
        style={{ color: dayColor, borderColor: dayColor + '50' }}
        aria-label="Zamanlayıcıyı başlat"
      >
        ▶
      </button>
    </div>
  );
}

function Chip({ label, icon, color }) {
  return (
    <span className={`chip ${color === 'warn' ? 'chip-warn' : ''}`}>
      {icon && <span>{icon}</span>} {label}
    </span>
  );
}
