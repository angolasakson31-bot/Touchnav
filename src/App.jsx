import { useState } from 'react';
import { DAYS } from './data/program';
import { useProgress } from './hooks/useProgress';
import WorkoutDay from './components/WorkoutDay';
import './App.css';

function getTodayDayIndex() {
  const d = new Date().getDay();
  if (d === 1) return 0; // Monday
  if (d === 3) return 1; // Wednesday
  if (d === 5) return 2; // Friday
  return 0;
}

export default function App() {
  const [activeDay, setActiveDay] = useState(getTodayDayIndex);
  const { isSetDone, toggleSet, markSetDone, getDayProgress } = useProgress();

  const day = DAYS[activeDay];

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="header-icon">💪</span>
            <div>
              <div className="header-title">Göğüs Programı</div>
              <div className="header-sub">v3 Final · Pzt / Çar / Cum</div>
            </div>
          </div>
          <div className="header-week">
            {DAYS.map((d) => {
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
      <nav className="day-tabs">
        {DAYS.map((d, i) => {
          const prog = getDayProgress(d);
          const isActive = i === activeDay;
          return (
            <button
              key={d.id}
              className={`day-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveDay(i)}
              style={isActive ? { '--tab-color': d.color } : {}}
            >
              <span className="tab-short">{d.short}</span>
              <span className="tab-name">{d.day}</span>
              <span className="tab-prog" style={isActive ? { color: d.color } : {}}>
                {prog.pct}%
              </span>
              {isActive && (
                <div className="tab-indicator" style={{ background: d.color }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Main content ── */}
      <main className="app-main">
        <WorkoutDay
          key={day.id}
          day={day}
          isSetDone={isSetDone}
          toggleSet={toggleSet}
          markSetDone={markSetDone}
          getDayProgress={getDayProgress}
        />
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
