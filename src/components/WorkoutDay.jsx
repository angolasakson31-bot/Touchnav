import { useState, useMemo, useRef, useEffect } from 'react';
import TimerModal from './TimerModal';
import ExerciseInfoModal from './ExerciseInfoModal';
import AddExerciseModal from './AddExerciseModal';

// Group merged exercises by superset group (preserving display order)
function groupMerged(exercises) {
  const result = [];
  const seen = new Set();

  for (const ex of exercises) {
    if (ex.group && !seen.has(ex.group)) {
      seen.add(ex.group);
      const members = exercises
        .filter(e => e.group === ex.group)
        .sort((a, b) => a.groupOrder - b.groupOrder);
      result.push({ type: 'superset', id: `group_${ex.group}_${ex.id}`, members });
    } else if (!ex.group) {
      result.push({ type: 'solo', id: ex.id, ex });
    }
  }
  return result;
}

export default function WorkoutDay({
  day,
  mergedExercises,
  isSetDone, toggleSet, markSetDone, getDayProgress,
  onAddExercise, onDeleteExercise, onEditExercise, onMoveExercise, onDeleteDay,
}) {
  const [timerTarget, setTimerTarget] = useState(null);
  const [infoTarget, setInfoTarget] = useState(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // exercise to edit
  const [confirmDelete, setConfirmDelete] = useState(null);

  const groups = useMemo(() => groupMerged(mergedExercises), [mergedExercises]);
  const prog = getDayProgress(day);

  const exIds = mergedExercises.map(e => e.id);
  const isFirst = (id) => exIds[0] === id;
  const isLast = (id) => exIds[exIds.length - 1] === id;

  return (
    <div className="workout-day">
      {/* Day header */}
      <div className="day-header" style={{ '--day-color': day.color, '--day-dim': day.colorDim }}>
        <div className="day-header-top">
          <div>
            <h2 className="day-title">{day.name} — {day.day}</h2>
            <p className="day-focus">{day.focus}</p>
            {day.subtitle && <p className="day-subtitle">{day.subtitle}</p>}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <div className="day-badge"><span>{day.duration}</span></div>
            {onDeleteDay && (
              <button className="btn-delete-day" onClick={onDeleteDay} title="Bu günü sil">🗑</button>
            )}
          </div>
        </div>
        {day.target && <p className="day-target">{day.target}</p>}
        <div className="day-progress-bar-wrap">
          <div className="day-progress-bar" style={{ width: `${prog.pct}%`, background: day.color }} />
        </div>
        <div className="day-progress-label">{prog.done}/{prog.total} set · %{prog.pct}</div>
        {day.summary && <p className="day-summary">{day.summary}</p>}
      </div>

      {/* Empty state */}
      {mergedExercises.length === 0 && (
        <div className="empty-day">
          <div className="empty-day-icon">🏋️</div>
          <p>Henüz egzersiz yok.</p>
          <p>Aşağıdaki butona basarak egzersiz ekle.</p>
        </div>
      )}

      {/* Exercise groups */}
      <div className="exercise-list">
        {groups.map(group =>
          group.type === 'superset'
            ? <SupersetGroup
                key={group.id}
                group={group}
                dayColor={day.color}
                isSetDone={isSetDone}
                toggleSet={toggleSet}
                onStartTimer={setTimerTarget}
                onShowInfo={setInfoTarget}
                onEdit={(ex) => setEditTarget(ex)}
                onMoveUp={(id) => onMoveExercise(id, 'up')}
                onMoveDown={(id) => onMoveExercise(id, 'down')}
                onDelete={(id) => setConfirmDelete(id)}
                isFirst={isFirst}
                isLast={isLast}
              />
            : <ExerciseCard
                key={group.id}
                exercise={group.ex}
                dayColor={day.color}
                isSetDone={isSetDone}
                toggleSet={toggleSet}
                onStartTimer={setTimerTarget}
                onShowInfo={setInfoTarget}
                onEdit={() => setEditTarget(group.ex)}
                onMoveUp={() => onMoveExercise(group.ex.id, 'up')}
                onMoveDown={() => onMoveExercise(group.ex.id, 'down')}
                onDelete={() => setConfirmDelete(group.ex.id)}
                isFirst={isFirst(group.ex.id)}
                isLast={isLast(group.ex.id)}
              />
        )}
      </div>

      {/* Add exercise button */}
      <div className="add-exercise-row">
        <button
          className="btn-add-exercise"
          onClick={() => setShowAddExercise(true)}
          style={{ borderColor: day.color + '60', color: day.color }}
        >
          <span className="add-ex-plus">+</span>
          Egzersiz Ekle
        </button>
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <p>Bu egzersizi silmek istediğine emin misin?</p>
            <div className="confirm-btns">
              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>İptal</button>
              <button className="btn-danger" onClick={() => {
                onDeleteExercise(confirmDelete);
                setConfirmDelete(null);
              }}>Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {timerTarget && (
        <TimerModal
          exercise={timerTarget.exercise}
          setIndex={timerTarget.setIndex}
          onDone={() => { markSetDone(timerTarget.exercise.id, timerTarget.setIndex); setTimerTarget(null); }}
          onClose={() => setTimerTarget(null)}
        />
      )}

      {infoTarget && (
        <ExerciseInfoModal
          exercise={infoTarget}
          dayColor={day.color}
          onClose={() => setInfoTarget(null)}
        />
      )}

      {showAddExercise && (
        <AddExerciseModal
          day={day}
          mergedExercises={mergedExercises}
          dayColor={day.color}
          onAdd={(exerciseData, afterId) => onAddExercise(exerciseData, afterId)}
          onClose={() => setShowAddExercise(false)}
        />
      )}

      {editTarget && (
        <AddExerciseModal
          day={day}
          mergedExercises={mergedExercises}
          dayColor={day.color}
          editingExercise={editTarget}
          onEdit={(newProps) => onEditExercise(editTarget.id, newProps)}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}

// ─── Superset group ───────────────────────────────────────────────────────────

function SupersetGroup({ group, dayColor, isSetDone, toggleSet, onStartTimer, onShowInfo,
  onEdit, onMoveUp, onMoveDown, onDelete, isFirst, isLast }) {
  return (
    <div className="superset-group">
      <div className="superset-label" style={{ color: dayColor }}>
        <span className="superset-tag">{group.members[0]?.group}</span>
        <span className="superset-hint">Arka arkaya · aralarında dinlenme yok</span>
      </div>
      <div className="superset-cards">
        {group.members.map((ex, idx) => (
          <div key={ex.id} className="superset-member">
            {idx > 0 && <div className="superset-arrow" style={{ color: dayColor }}>↓ direkt geç</div>}
            <ExerciseCard
              exercise={ex}
              dayColor={dayColor}
              isSetDone={isSetDone}
              toggleSet={toggleSet}
              onStartTimer={onStartTimer}
              onShowInfo={onShowInfo}
              onEdit={() => onEdit(ex)}
              onMoveUp={() => onMoveUp(ex.id)}
              onMoveDown={() => onMoveDown(ex.id)}
              onDelete={() => onDelete(ex.id)}
              isFirst={isFirst(ex.id)}
              isLast={isLast(ex.id)}
              nested
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Exercise card ────────────────────────────────────────────────────────────

function ExerciseCard({ exercise, dayColor, isSetDone, toggleSet, onStartTimer, onShowInfo,
  onEdit, onMoveUp, onMoveDown, onDelete, isFirst, isLast, nested }) {
  const isStretch = exercise.label === '✦' || exercise.label === '✚';
  const allDone = Array.from({ length: exercise.sets }, (_, i) => i)
    .every(i => isSetDone(exercise.id, i));

  return (
    <div
      className={`exercise-card ${nested ? 'nested' : ''} ${allDone ? 'all-done' : ''} ${exercise._isCustom ? 'custom-exercise' : ''}`}
      style={{ '--day-color': dayColor }}
    >
      <div className="exercise-top">
        <span
          className={`exercise-label ${isStretch ? 'stretch-label' : ''}`}
          style={!isStretch ? { background: dayColor + '30', color: dayColor } : {}}
        >
          {exercise.label}
        </span>
        <div className="exercise-name-wrap">
          <span className="exercise-name">{exercise.name}</span>
          {exercise.note && <span className="exercise-note"> ({exercise.note})</span>}
          {exercise._isCustom && <span className="custom-badge">özel</span>}
          {allDone && <span className="all-done-badge">✓</span>}
        </div>
        <div className="exercise-top-actions">
          <button
            className="btn-info"
            onClick={() => onShowInfo(exercise)}
            style={{ borderColor: dayColor + '50', color: dayColor }}
            aria-label="Hareket detayları"
          >?</button>
          <ExerciseMenu
            exercise={exercise}
            dayColor={dayColor}
            isFirst={isFirst}
            isLast={isLast}
            onEdit={onEdit}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
          />
        </div>
      </div>

      <div className="exercise-stats">
        <Chip label={`${exercise.sets}×${exercise.repsStr}`} icon="🔁" />
        {exercise.tempoStr && exercise.tempoStr !== '—' && (
          <Chip label={`Tempo ${exercise.tempoStr}`} icon="⏱" />
        )}
        {exercise.rir && <Chip label={`RIR ${exercise.rir}`} icon="💪" />}
        {exercise.restSec > 0 && <Chip label={`${exercise.restSec}sn dinlen`} icon="⏳" />}
        {exercise.restSec === 0 && exercise.group && <Chip label="Direkt geç →" color="warn" />}
      </div>

      <div className="exercise-target">{exercise.target}</div>

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

// ─── Exercise context menu ────────────────────────────────────────────────────

function ExerciseMenu({ exercise, dayColor, isFirst, isLast, onEdit, onMoveUp, onMoveDown, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  const act = (fn) => { fn(); setOpen(false); };

  return (
    <div className="ex-menu" ref={ref}>
      <button
        className="btn-ex-menu"
        onClick={() => setOpen(v => !v)}
        style={{ borderColor: dayColor + '50', color: dayColor }}
        aria-label="Egzersiz seçenekleri"
      >⋮</button>

      {open && (
        <div className="ex-menu-popup">
          <button className="ex-menu-item" onClick={() => act(onEdit)}>
            <span>✏</span> Düzenle
          </button>
          <button
            className="ex-menu-item"
            onClick={() => act(onMoveUp)}
            disabled={isFirst}
          >
            <span>↑</span> Yukarı taşı
          </button>
          <button
            className="ex-menu-item"
            onClick={() => act(onMoveDown)}
            disabled={isLast}
          >
            <span>↓</span> Aşağı taşı
          </button>
          <div className="ex-menu-sep" />
          <button className="ex-menu-item ex-menu-danger" onClick={() => act(onDelete)}>
            <span>🗑</span> Sil
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Set row ──────────────────────────────────────────────────────────────────

function SetRow({ exercise, setIndex, done, onToggle, onTimer, dayColor }) {
  const perRepSec = exercise.tempo
    ? exercise.tempo.down + exercise.tempo.hold + exercise.tempo.up
    : exercise.holdDuration || 0;
  const estMin = perRepSec > 0
    ? Math.round(perRepSec * (exercise.repsMin || 1) / 60 * 10) / 10
    : null;

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
        {estMin && <span className="set-duration">≈{estMin}dk</span>}
      </div>
      <button
        className="btn-timer"
        onClick={onTimer}
        style={{ color: dayColor, borderColor: dayColor + '50' }}
        aria-label="Zamanlayıcıyı başlat"
      >▶</button>
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
