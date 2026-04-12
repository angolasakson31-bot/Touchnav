import { useState } from 'react';

const TYPES = [
  { id: 'timed',   icon: '⏱', label: 'Tempo',  desc: 'İniş/Bekle/Çıkış süreli' },
  { id: 'manual',  icon: '👆', label: 'Manuel', desc: 'Elle tekrar say' },
  { id: 'hold',    icon: '⏸', label: 'Tutma',  desc: 'İsometrik tutma' },
  { id: 'stretch', icon: '🤸', label: 'Germe',  desc: 'Pozisyon tut' },
];

function exerciseToForm(ex) {
  if (!ex) return {
    name: '', note: '', target: '', type: 'timed',
    sets: 3, repsMin: 10, repsMax: 12,
    tempoDown: 2, tempoHold: 1, tempoUp: 1,
    holdDuration: 30, restSec: 60, rir: '1-2',
    group: '', groupOrder: 0,
    why: '', equipment: '', prep: [], steps: [], errors: [], tip: '', warning: '',
  };
  const tp = ex.tempo || {};
  return {
    name: ex.name || '', note: ex.note || '', target: ex.target || '',
    type: ex.type || 'timed',
    sets: ex.sets || 3, repsMin: ex.repsMin || 10, repsMax: ex.repsMax || 12,
    tempoDown: tp.down ?? 2, tempoHold: tp.hold ?? 1, tempoUp: tp.up ?? 1,
    holdDuration: ex.holdDuration || 30, restSec: ex.restSec ?? 60, rir: ex.rir || '',
    group: ex.group || '', groupOrder: ex.groupOrder || 0,
    why: ex.desc?.why || '', equipment: ex.desc?.equipment || '',
    prep: ex.desc?.prep || [], steps: ex.desc?.steps || [],
    errors: ex.desc?.errors || [], tip: ex.desc?.tip || '', warning: ex.desc?.warning || '',
  };
}

// isEditMode: true when editing existing exercise (hides position tab)
export default function AddExerciseModal({
  day, mergedExercises = [], dayColor,
  editingExercise = null,   // non-null = edit mode
  onAdd, onEdit, onClose,
}) {
  const isEdit = !!editingExercise;
  const [form, setForm] = useState(() => exerciseToForm(editingExercise));
  const [afterId, setAfterId] = useState('__END__');
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setNum = (k, v) => set(k, Math.max(0, parseInt(v) || 0));

  const buildResult = () => {
    const tempo = form.type === 'timed'
      ? { down: form.tempoDown, hold: form.tempoHold, up: form.tempoUp }
      : null;
    const tempoStr = form.type === 'timed'
      ? `${form.tempoDown}-${form.tempoHold}-${form.tempoUp}` : '—';
    const repsStr = form.repsMin === form.repsMax
      ? `${form.repsMin}` : `${form.repsMin}-${form.repsMax}`;
    const desc = (form.why || form.equipment || form.prep.length || form.steps.length ||
      form.errors.length || form.tip || form.warning)
      ? {
          why: form.why || undefined, equipment: form.equipment || undefined,
          prep: form.prep.filter(Boolean), steps: form.steps.filter(Boolean),
          errors: form.errors.filter(Boolean),
          tip: form.tip || undefined, warning: form.warning || undefined,
        }
      : undefined;
    const label = form.group
      ? `${form.group.trim()}${'ABCD'[form.groupOrder] || 'A'}` : '✚';
    return {
      label, name: form.name.trim(), note: form.note.trim() || null,
      target: form.target.trim() || 'Belirtilmemiş',
      type: form.type, sets: form.sets,
      repsStr, repsMin: form.repsMin, repsMax: form.repsMax,
      tempoStr, tempo,
      holdDuration: (form.type === 'hold' || form.type === 'stretch') ? form.holdDuration : null,
      restSec: form.restSec, rir: form.rir || null,
      group: form.group.trim() || null, groupOrder: form.group ? form.groupOrder : 0,
      desc,
    };
  };

  const handleSubmit = () => {
    if (!form.name.trim()) { setErrors({ name: 'Gerekli' }); setActiveTab('basic'); return; }
    setErrors({});
    const result = buildResult();
    if (isEdit) { onEdit(result); }
    else { onAdd(result, afterId); }
    onClose();
  };

  const TABS = [
    { id: 'basic',    icon: '📝', label: 'Temel' },
    { id: 'setrep',   icon: '🔁', label: 'Set/Tekrar' },
    { id: 'timing',   icon: '⏱', label: 'Tempo' },
    ...(!isEdit ? [{ id: 'position', icon: '📍', label: 'Pozisyon' }] : []),
    { id: 'desc',     icon: '📖', label: 'Yapılış' },
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="form-modal form-modal-lg">
        <div className="info-handle" />
        <div className="form-modal-header">
          <h3>{isEdit ? 'Egzersizi Düzenle' : 'Egzersiz Ekle'}</h3>
          <div className="form-modal-header-sub" style={{ color: dayColor }}>
            {day.name} — {day.day}
            {isEdit && !editingExercise._isCustom && (
              <span className="edit-base-note"> · orijinal program</span>
            )}
          </div>
          <button className="info-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-section-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`fsec-tab ${activeTab === t.id ? 'active' : ''} ${t.id === 'basic' && errors.name ? 'has-error' : ''}`}
              onClick={() => setActiveTab(t.id)}
              style={activeTab === t.id ? { '--tab-color': dayColor } : {}}
            >
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="form-modal-body">
          {/* ── BASIC ── */}
          {activeTab === 'basic' && (
            <div className="fsection">
              <Field label="Hareket Adı *" error={errors.name}>
                <input className={`finput ${errors.name ? 'finput-error' : ''}`}
                  value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Hareket adı..." maxLength={60} autoFocus />
              </Field>
              <Field label="Not / Parantez içi">
                <input className="finput" value={form.note}
                  onChange={e => set('note', e.target.value)}
                  placeholder="örn. ayaklar sandalyede..." maxLength={60} />
              </Field>
              <Field label="Hedef Kas">
                <input className="finput" value={form.target}
                  onChange={e => set('target', e.target.value)}
                  placeholder="örn. Üst göğüs + ön deltoid" maxLength={80} />
              </Field>
              <Field label="Hareket Tipi">
                <div className="type-grid">
                  {TYPES.map(t => (
                    <button key={t.id}
                      className={`type-card ${form.type === t.id ? 'selected' : ''}`}
                      onClick={() => set('type', t.id)}
                      style={form.type === t.id ? { borderColor: dayColor, background: dayColor + '15' } : {}}>
                      <span className="type-icon">{t.icon}</span>
                      <span className="type-label">{t.label}</span>
                      <span className="type-desc">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {/* ── SET & REP ── */}
          {activeTab === 'setrep' && (
            <div className="fsection">
              <Field label="Set Sayısı">
                <NumberInput value={form.sets} onChange={v => setNum('sets', v)} min={1} max={10} />
              </Field>
              <Field label="Tekrar Aralığı" hint="min — max">
                <div className="rep-range-row">
                  <div className="rep-range-col">
                    <span className="rep-range-lbl">Min</span>
                    <NumberInput value={form.repsMin} onChange={v => {
                      const n = Math.max(1, parseInt(v) || 1);
                      set('repsMin', n);
                      if (form.repsMax < n) set('repsMax', n);
                    }} min={1} max={100} />
                  </div>
                  <span className="rep-range-dash">—</span>
                  <div className="rep-range-col">
                    <span className="rep-range-lbl">Max</span>
                    <NumberInput value={form.repsMax}
                      onChange={v => set('repsMax', Math.max(form.repsMin, parseInt(v) || 1))}
                      min={form.repsMin} max={100} />
                  </div>
                </div>
                <p className="fhint-inline">
                  → {form.repsMin === form.repsMax ? form.repsMin : `${form.repsMin}-${form.repsMax}`} tekrar
                </p>
              </Field>
            </div>
          )}

          {/* ── TIMING ── */}
          {activeTab === 'timing' && (
            <div className="fsection">
              {form.type === 'timed' && (
                <Field label="Tempo  İniş — Bekle — Çıkış" hint="saniye">
                  <div className="tempo-inputs">
                    <TempoInput label="İniş ↓" color="#f97316" value={form.tempoDown}
                      onChange={v => setNum('tempoDown', v)} />
                    <span className="tempo-sep">—</span>
                    <TempoInput label="Bekle ⏸" color="#fbbf24" value={form.tempoHold}
                      onChange={v => setNum('tempoHold', v)} />
                    <span className="tempo-sep">—</span>
                    <TempoInput label="Çıkış ↑" color="#34d399" value={form.tempoUp}
                      onChange={v => setNum('tempoUp', v)} />
                  </div>
                  <p className="fhint-inline">
                    Tekrar başı: {form.tempoDown + form.tempoHold + form.tempoUp}sn ·
                    {form.repsMin} tekrar ≈ {(form.tempoDown + form.tempoHold + form.tempoUp) * form.repsMin}sn
                  </p>
                </Field>
              )}
              {(form.type === 'hold' || form.type === 'stretch') && (
                <Field label={form.type === 'stretch' ? 'Germe Süresi (sn)' : 'Tutma Süresi (sn)'}>
                  <NumberInput value={form.holdDuration} onChange={v => setNum('holdDuration', v)} min={1} max={300} />
                  <p className="fhint-inline">{form.repsMin} × {form.holdDuration}sn = {form.repsMin * form.holdDuration}sn</p>
                </Field>
              )}
              {form.type === 'manual' && (
                <div className="finfo-box">Manuel modda zamanlayıcı çalışmaz — her tekrarı tamamladıkça butona basırsın.</div>
              )}
              <Field label="Dinlenme Süresi (sn)" hint="0 = dinlenme yok">
                <NumberInput value={form.restSec} onChange={v => setNum('restSec', v)} min={0} max={600} />
                {form.restSec === 0 && <p className="fhint-inline fhint-warn">⚠ Dinlenme yok — süperset geçişi için uygundur.</p>}
              </Field>
              <Field label="RIR">
                <select className="finput fselect" value={form.rir} onChange={e => set('rir', e.target.value)}>
                  <option value="">Belirtme</option>
                  {['0', '1', '2', '0-1', '1-2'].map(v => <option key={v} value={v}>RIR {v}</option>)}
                </select>
              </Field>
              <Field label="Süperset Grubu" hint="boş = bağımsız">
                <input className="finput" value={form.group}
                  onChange={e => set('group', e.target.value.toUpperCase())}
                  placeholder="SS4, SS5... veya boş" maxLength={10} />
                {form.group && (
                  <div className="superset-order-pick">
                    <span className="flabel" style={{ marginBottom: 0 }}>Sıra:</span>
                    {'ABCD'.split('').map((l, i) => (
                      <button key={l}
                        className={`superset-order-btn ${form.groupOrder === i ? 'active' : ''}`}
                        onClick={() => set('groupOrder', i)}
                        style={form.groupOrder === i ? { background: dayColor, borderColor: dayColor } : {}}>
                        {form.group}{l}
                      </button>
                    ))}
                  </div>
                )}
              </Field>
            </div>
          )}

          {/* ── POSITION (add only) ── */}
          {activeTab === 'position' && !isEdit && (
            <div className="fsection">
              <Field label="Nereye Eklensin?" hint="hangi egzersizden sonra">
                <select className="finput fselect" value={afterId}
                  onChange={e => setAfterId(e.target.value)}>
                  <option value="__START__">↑ En başa</option>
                  {mergedExercises.map((ex, i) => (
                    <option key={ex.id} value={ex.id}>
                      {i + 1}. {ex.name}'den sonra
                    </option>
                  ))}
                  <option value="__END__">↓ En sona (varsayılan)</option>
                </select>
              </Field>

              <div className="position-preview">
                <div className="position-preview-title">Önizleme</div>
                <PositionPreview
                  mergedExercises={mergedExercises}
                  afterId={afterId}
                  newName={form.name || '(Yeni Egzersiz)'}
                  dayColor={dayColor}
                />
              </div>
            </div>
          )}

          {/* ── DESCRIPTION ── */}
          {activeTab === 'desc' && (
            <div className="fsection">
              <p className="fdesc-hint">Opsiyonel — ? butonunda gösterilir.</p>
              <Field label="Neden Bu Hareket?">
                <textarea className="finput ftextarea" value={form.why}
                  onChange={e => set('why', e.target.value)}
                  placeholder="Hareketin amacı..." rows={3} />
              </Field>
              <Field label="Ekipman">
                <input className="finput" value={form.equipment}
                  onChange={e => set('equipment', e.target.value)}
                  placeholder="örn. Zemin + sandalye" maxLength={80} />
              </Field>
              <StepListEditor label="Hazırlık Adımları" icon="📋"
                items={form.prep} onChange={v => set('prep', v)}
                placeholder="Hazırlık adımı..." />
              <StepListEditor label="Yapılış Adımları" icon="▶"
                items={form.steps} onChange={v => set('steps', v)}
                placeholder="Yapılış adımı..." />
              <StepListEditor label="Kritik Hatalar" icon="⚠️"
                items={form.errors} onChange={v => set('errors', v)}
                placeholder="Kaçınılması gereken..." />
              <Field label="İpucu">
                <textarea className="finput ftextarea" value={form.tip}
                  onChange={e => set('tip', e.target.value)}
                  placeholder="Önemli ipucu..." rows={2} />
              </Field>
              <Field label="Uyarı">
                <textarea className="finput ftextarea" value={form.warning}
                  onChange={e => set('warning', e.target.value)}
                  placeholder="Dikkat edilmesi gereken..." rows={2} />
              </Field>
            </div>
          )}
        </div>

        <div className="form-modal-footer">
          <button className="btn-cancel" onClick={onClose}>İptal</button>
          <button className="btn-confirm" style={{ background: dayColor }}
            onClick={handleSubmit} disabled={!form.name.trim()}>
            {isEdit ? 'Kaydet' : 'Egzersiz Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, hint, error, children }) {
  return (
    <div className="form-field">
      <label className="flabel">{label}{hint && <span className="fhint"> — {hint}</span>}</label>
      {children}
      {error && <span className="ferror">{error}</span>}
    </div>
  );
}

function NumberInput({ value, onChange, min = 0, max = 999 }) {
  return (
    <div className="number-input">
      <button className="ni-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
      <input className="ni-val" type="number" value={value}
        onChange={e => { const n = parseInt(e.target.value); if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n))); }}
        min={min} max={max} />
      <button className="ni-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
    </div>
  );
}

function TempoInput({ label, color, value, onChange }) {
  return (
    <div className="tempo-input-col">
      <div className="tempo-input-val" style={{ color }}>
        <button className="tempo-adj" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
        <span className="tempo-num">{value}</span>
        <button className="tempo-adj" onClick={() => onChange(value + 1)}>+</button>
      </div>
      <span className="tempo-input-lbl" style={{ color }}>{label}</span>
    </div>
  );
}

function StepListEditor({ label, icon, items, onChange, placeholder }) {
  return (
    <div className="form-field">
      <div className="step-editor-header">
        <label className="flabel">{icon} {label}</label>
        <button className="step-add-btn" onClick={() => onChange([...items, ''])}>+ Ekle</button>
      </div>
      {items.length === 0 && <p className="step-empty">Henüz adım yok.</p>}
      <div className="step-list-edit">
        {items.map((item, i) => (
          <div key={i} className="step-edit-row">
            <span className="step-edit-num">{i + 1}</span>
            <input className="finput step-edit-input" value={item}
              onChange={e => onChange(items.map((x, j) => j === i ? e.target.value : x))}
              placeholder={placeholder} maxLength={200} />
            <button className="step-remove-btn" onClick={() => onChange(items.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PositionPreview({ mergedExercises, afterId, newName, dayColor }) {
  const items = [];
  if (afterId === '__START__') {
    items.push({ name: newName, isNew: true });
    mergedExercises.forEach(e => items.push({ name: e.name, isNew: false }));
  } else if (afterId === '__END__') {
    mergedExercises.forEach(e => items.push({ name: e.name, isNew: false }));
    items.push({ name: newName, isNew: true });
  } else {
    mergedExercises.forEach(e => {
      items.push({ name: e.name, isNew: false });
      if (e.id === afterId) items.push({ name: newName, isNew: true });
    });
  }

  const newIdx = items.findIndex(x => x.isNew);
  const start = Math.max(0, newIdx - 2);
  const end = Math.min(items.length, newIdx + 3);
  const visible = items.slice(start, end);

  return (
    <div className="pos-preview-list">
      {start > 0 && <div className="pos-more">↑ {start} egzersiz yukarıda</div>}
      {visible.map((item, i) => (
        <div key={i} className={`pos-preview-item ${item.isNew ? 'new-item' : ''}`}
          style={item.isNew ? { borderColor: dayColor, background: dayColor + '12' } : {}}>
          {item.isNew && <span className="pos-new-badge" style={{ background: dayColor }}>YENİ</span>}
          <span className="pos-item-name">{item.name}</span>
        </div>
      ))}
      {end < items.length && <div className="pos-more">↓ {items.length - end} egzersiz aşağıda</div>}
    </div>
  );
}
