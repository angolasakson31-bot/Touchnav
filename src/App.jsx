import { useState } from 'react';
import { DAYS } from './data/program';
import { useProgress } from './hooks/useProgress';
import { useCustomProgram } from './hooks/useCustomProgram';
import WorkoutDay from './components/WorkoutDay';
import AddDayModal from './components/AddDayModal';
import './App.css';

function getTodayDayIndex() {
  const d = new Date().getDay();
  if (d === 1) return 0;
  if (d === 3) return 1;
  if (d === 5) return 2;
  return 0;
}

export default function App() {
  const [activeDay, setActiveDay] = useState(getTodayDayIndex);
  const [showAddDay, setShowAddDay] = useState(false);

  const { isSetDone, toggleSet, markSetDone, getDayProgress } = useProgress();
  const { allDays, getMerged, addDay, deleteDay, addExercise, deleteExercise, editExercise, moveExercise } = useCustomProgram(DAYS);

  // Keep active index in bounds when days change
  const safeActive = Math.min(activeDay, allDays.length - 1);
  const day = allDays[safeActive];

  const handleAddDay = (cfg) => {
    addDay(cfg);
    // Switch to newly added day
    setActiveDay(allDays.length); // will be the new last
  };

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="header-icon">💪</span>
            <div>
              <div className="header-title">Göğüs Programı</div>
              <div className="header-sub">v3 Final · Özelleştirilebilir</div>
            </div>
          </div>
          <div className="header-week">
            {allDays.map((d) => {
              const prog = getDayProgress(d);
              const done = prog.total > 0 && prog.done === prog.total;
              return (
                <div
                  key={d.id}
                  className={`week-dot ${done ? 'done' : ''}`}
                  style={done ? { background: d.color } : {}}
                  title={d.day}
                />
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Day tabs ── */}
      <nav className="day-tabs-wrap">
        <div className="day-tabs">
          {allDays.map((d, i) => {
            const prog = getDayProgress(d);
            const isActive = i === safeActive;
            return (
              <button
                key={d.id}
                className={`day-tab ${isActive ? 'active' : ''} ${d.isCustom ? 'custom-tab' : ''}`}
                onClick={() => setActiveDay(i)}
                style={isActive ? { '--tab-color': d.color } : {}}
              >
                <span className="tab-short">{d.short}</span>
                <span className="tab-name">{d.isCustom ? d.name : d.day}</span>
                <span className="tab-prog" style={isActive ? { color: d.color } : {}}>
                  {prog.pct}%
                </span>
                {isActive && <div className="tab-indicator" style={{ background: d.color }} />}
              </button>
            );
          })}
          {/* Add day button */}
          <button className="day-tab add-day-tab" onClick={() => setShowAddDay(true)} title="Yeni antrenman günü ekle">
            <span className="tab-add-icon">+</span>
            <span className="tab-name">Gün Ekle</span>
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="app-main">
        {day && (
          <WorkoutDay
            key={day.id}
            day={day}
            mergedExercises={getMerged(day)}
            isSetDone={isSetDone}
            toggleSet={toggleSet}
            markSetDone={markSetDone}
            getDayProgress={getDayProgress}
            onAddExercise={(exerciseData, afterId) => addExercise(day.id, exerciseData, afterId, getMerged(day))}
            onDeleteExercise={(exerciseId) => deleteExercise(day.id, exerciseId, getMerged(day))}
            onEditExercise={(exerciseId, newProps) => editExercise(day.id, exerciseId, newProps)}
            onMoveExercise={(exerciseId, direction) => moveExercise(day.id, exerciseId, direction, getMerged(day))}
            onDeleteDay={day.isCustom ? () => { setActiveDay(0); deleteDay(day.id); } : null}
          />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <div className="info-cards">
          <InfoCard title="Ekipman" items={['Sandalye', 'Zemin', 'Direnç Bandı']} />
          <InfoCard title="Seviye" items={['Orta–İleri']} />
          <InfoCard title="Uygunluk" items={['Kalça sıkışma uyumlu', 'Boyun desteği', 'Postür düzeltici']} />
        </div>
        <div className="reminder-box">
          <span>⚠️</span>
          <p>Boyun düzleşmen için fizyoterapist takibi önerilir. Bu program destek amaçlıdır.</p>
        </div>
      </footer>

      {/* ── Add Day Modal ── */}
      {showAddDay && (
        <AddDayModal
          onAdd={handleAddDay}
          onClose={() => setShowAddDay(false)}
        />
      )}
    </div>
  );
}

function InfoCard({ title, items }) {
  return (
    <div className="info-card">
      <div className="info-card-title">{title}</div>
      {items.map(item => <div key={item} className="info-card-item">{item}</div>)}
    </div>
  );
}
