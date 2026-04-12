import { useState, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'custom_program_v2';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { customDays: [], perDay: {} };
  } catch { return { customDays: [], perDay: {} }; }
}
function save(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} }

// perDay[dayId] = {
//   extras   : [...],           // user-added exercises
//   hidden   : [...],           // IDs of hidden (deleted) base exercises
//   overrides: { [exId]: {} },  // partial edits for any exercise
//   order    : [...] | null     // explicit ID order (null = default)
// }

function getPerDay(data, dayId) {
  return data.perDay[dayId] || { extras: [], hidden: [], overrides: {}, order: null };
}

// Build merged, ordered, overridden exercise list
function buildMerged(day, pd) {
  const hidden = new Set(pd.hidden || []);
  const overrides = pd.overrides || {};
  const extras = (pd.extras || []).filter(e => !hidden.has(e.id));

  const base = (day.exercises || [])
    .filter(ex => !hidden.has(ex.id))
    .map(ex => ({ ...ex, ...overrides[ex.id], _isCustom: false }));

  const all = [...base, ...extras];

  if (pd.order && pd.order.length) {
    const byId = Object.fromEntries(all.map(e => [e.id, e]));
    const inOrderSet = new Set(pd.order);
    const ordered = pd.order.filter(id => byId[id]).map(id => byId[id]);
    // Append any exercises not yet in the saved order
    all.filter(e => !inOrderSet.has(e.id)).forEach(e => ordered.push(e));
    return ordered;
  }

  return [...base, ...extras.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))];
}

export function useCustomProgram(baseDays) {
  const [data, setData] = useState(load);

  const update = useCallback((fn) => {
    setData(prev => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const allDays = useMemo(
    () => [...baseDays, ...data.customDays],
    [baseDays, data.customDays]
  );

  // Get merged exercises for a day (pass to components)
  const getMerged = useCallback((day) => {
    return buildMerged(day, getPerDay(data, day.id));
  }, [data]);

  // ── Days ──────────────────────────────────────────────────────────────────
  const addDay = useCallback((cfg) => {
    const newDay = {
      ...cfg,
      id: `cday_${Date.now()}`,
      isCustom: true,
      exercises: [],
    };
    update(prev => ({ ...prev, customDays: [...prev.customDays, newDay] }));
    return newDay;
  }, [update]);

  const deleteDay = useCallback((dayId) => {
    update(prev => {
      const perDay = { ...prev.perDay };
      delete perDay[dayId];
      return { ...prev, customDays: prev.customDays.filter(d => d.id !== dayId), perDay };
    });
  }, [update]);

  // ── Exercises ─────────────────────────────────────────────────────────────

  // Add exercise. afterId: null/'__END__' = end | '__START__' = beginning | exerciseId = after that
  const addExercise = useCallback((dayId, exerciseData, afterId, currentMerged) => {
    const newEx = {
      ...exerciseData,
      id: `cex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      _isCustom: true,
      createdAt: Date.now(),
    };

    update(prev => {
      const pd = getPerDay(prev, dayId);
      const curOrder = (pd.order && pd.order.length)
        ? pd.order
        : (currentMerged || []).map(e => e.id);

      let newOrder;
      if (!afterId || afterId === '__END__') {
        newOrder = [...curOrder, newEx.id];
      } else if (afterId === '__START__') {
        newOrder = [newEx.id, ...curOrder];
      } else {
        const idx = curOrder.indexOf(afterId);
        newOrder = idx === -1
          ? [...curOrder, newEx.id]
          : [...curOrder.slice(0, idx + 1), newEx.id, ...curOrder.slice(idx + 1)];
      }

      return {
        ...prev,
        perDay: {
          ...prev.perDay,
          [dayId]: { ...pd, extras: [...pd.extras, newEx], order: newOrder },
        },
      };
    });

    return newEx;
  }, [update]);

  // Delete exercise (any)
  const deleteExercise = useCallback((dayId, exerciseId, currentMerged) => {
    update(prev => {
      const pd = getPerDay(prev, dayId);
      const isCustom = pd.extras.some(e => e.id === exerciseId);
      const curOrder = (pd.order && pd.order.length)
        ? pd.order
        : (currentMerged || []).map(e => e.id);

      return {
        ...prev,
        perDay: {
          ...prev.perDay,
          [dayId]: {
            ...pd,
            extras: isCustom ? pd.extras.filter(e => e.id !== exerciseId) : pd.extras,
            hidden: isCustom ? pd.hidden : [...(pd.hidden || []), exerciseId],
            order: curOrder.filter(id => id !== exerciseId),
          },
        },
      };
    });
  }, [update]);

  // Edit exercise properties (any — base gets stored in overrides, custom updated in extras)
  const editExercise = useCallback((dayId, exerciseId, newProps) => {
    update(prev => {
      const pd = getPerDay(prev, dayId);
      const isCustom = pd.extras.some(e => e.id === exerciseId);

      if (isCustom) {
        return {
          ...prev,
          perDay: {
            ...prev.perDay,
            [dayId]: {
              ...pd,
              extras: pd.extras.map(e =>
                e.id === exerciseId ? { ...e, ...newProps } : e
              ),
            },
          },
        };
      } else {
        return {
          ...prev,
          perDay: {
            ...prev.perDay,
            [dayId]: {
              ...pd,
              overrides: {
                ...pd.overrides,
                [exerciseId]: { ...(pd.overrides[exerciseId] || {}), ...newProps },
              },
            },
          },
        };
      }
    });
  }, [update]);

  // Reset base exercise overrides back to original
  const resetExercise = useCallback((dayId, exerciseId) => {
    update(prev => {
      const pd = getPerDay(prev, dayId);
      const newOverrides = { ...pd.overrides };
      delete newOverrides[exerciseId];
      return {
        ...prev,
        perDay: { ...prev.perDay, [dayId]: { ...pd, overrides: newOverrides } },
      };
    });
  }, [update]);

  // Move exercise up or down
  const moveExercise = useCallback((dayId, exerciseId, direction, currentMerged) => {
    update(prev => {
      const pd = getPerDay(prev, dayId);
      const order = (pd.order && pd.order.length)
        ? [...pd.order]
        : (currentMerged || []).map(e => e.id);

      const idx = order.indexOf(exerciseId);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === order.length - 1) return prev;

      const newOrder = [...order];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];

      return {
        ...prev,
        perDay: { ...prev.perDay, [dayId]: { ...pd, order: newOrder } },
      };
    });
  }, [update]);

  // Check if exercise has overrides
  const hasOverrides = useCallback((dayId, exerciseId) => {
    const pd = getPerDay(data, dayId);
    return !!(pd.overrides && pd.overrides[exerciseId] && Object.keys(pd.overrides[exerciseId]).length);
  }, [data]);

  return {
    allDays,
    customDays: data.customDays,
    getMerged,
    addDay, deleteDay,
    addExercise, deleteExercise, editExercise, resetExercise, moveExercise,
    hasOverrides,
  };
}
