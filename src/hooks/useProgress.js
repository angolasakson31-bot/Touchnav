import { useState, useCallback } from 'react';

function getWeekKey() {
  const now = new Date();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return `week_${monday.toISOString().slice(0, 10)}`;
}

function loadProgress() {
  try {
    const key = getWeekKey();
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(getWeekKey(), JSON.stringify(data));
  } catch {}
}

// progress shape: { [exerciseId]: { [setIndex]: true } }
export function useProgress() {
  const [progress, setProgress] = useState(() => loadProgress());

  const isSetDone = useCallback(
    (exerciseId, setIndex) => !!progress[exerciseId]?.[setIndex],
    [progress]
  );

  const toggleSet = useCallback((exerciseId, setIndex) => {
    setProgress(prev => {
      const ex = prev[exerciseId] || {};
      const updated = { ...prev, [exerciseId]: { ...ex, [setIndex]: !ex[setIndex] } };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const markSetDone = useCallback((exerciseId, setIndex) => {
    setProgress(prev => {
      const ex = prev[exerciseId] || {};
      if (ex[setIndex]) return prev; // already done
      const updated = { ...prev, [exerciseId]: { ...ex, [setIndex]: true } };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const isDayDone = useCallback(
    (day) => {
      return day.exercises.every(ex =>
        Array.from({ length: ex.sets }, (_, i) => i).every(i => !!progress[ex.id]?.[i])
      );
    },
    [progress]
  );

  const getDayProgress = useCallback(
    (day) => {
      const total = day.exercises.reduce((s, ex) => s + ex.sets, 0);
      const done = day.exercises.reduce(
        (s, ex) => s + Object.values(progress[ex.id] || {}).filter(Boolean).length,
        0
      );
      return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    },
    [progress]
  );

  return { isSetDone, toggleSet, markSetDone, isDayDone, getDayProgress };
}
