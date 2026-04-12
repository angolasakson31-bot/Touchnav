import { useState } from 'react';

const PRESET_COLORS = [
  { hex: '#e11d48', name: 'Kırmızı' },
  { hex: '#f97316', name: 'Turuncu' },
  { hex: '#eab308', name: 'Sarı' },
  { hex: '#22c55e', name: 'Yeşil' },
  { hex: '#0ea5e9', name: 'Mavi' },
  { hex: '#6366f1', name: 'İndigo' },
  { hex: '#a855f7', name: 'Mor' },
  { hex: '#ec4899', name: 'Pembe' },
];

const DAYS_OF_WEEK = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const SHORTS = { Pazartesi: 'Pzt', Salı: 'Sal', Çarşamba: 'Çar', Perşembe: 'Per', Cuma: 'Cum', Cumartesi: 'Cmt', Pazar: 'Paz' };

export default function AddDayModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    name: '',
    day: 'Salı',
    focus: '',
    subtitle: '',
    target: '',
    duration: '~40 dk',
    summary: '',
    color: '#e11d48',
  });
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.name.trim()) { setError('Gün adı gerekli.'); return; }
    setError('');
    const hex = form.color;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    onAdd({
      name: form.name.trim(),
      day: form.day,
      short: SHORTS[form.day] || form.day.slice(0, 3),
      color: form.color,
      colorDim: `rgba(${r},${g},${b},0.15)`,
      focus: form.focus.trim() || form.name.trim(),
      subtitle: form.subtitle.trim(),
      target: form.target.trim(),
      duration: form.duration.trim() || '~40 dk',
      summary: form.summary.trim(),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="form-modal">
        <div className="info-handle" />

        <div className="form-modal-header">
          <h3>Yeni Gün Ekle</h3>
          <button className="info-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-modal-body">
          <Field label="Gün Adı *" hint="örn. Pazar Antrenmanı">
            <input className="finput" value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Gün adı..." maxLength={40} />
          </Field>

          <Field label="Haftanın Günü">
            <select className="finput fselect" value={form.day} onChange={e => set('day', e.target.value)}>
              {DAYS_OF_WEEK.map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>

          <Field label="Odak / Başlık" hint="örn. Metabolik Stres">
            <input className="finput" value={form.focus} onChange={e => set('focus', e.target.value)}
              placeholder="Antrenman odağı..." maxLength={60} />
          </Field>

          <Field label="Alt Başlık" hint="örn. Şekillendirme">
            <input className="finput" value={form.subtitle} onChange={e => set('subtitle', e.target.value)}
              placeholder="Alt başlık..." maxLength={40} />
          </Field>

          <Field label="Hedef / Notlar">
            <input className="finput" value={form.target} onChange={e => set('target', e.target.value)}
              placeholder="Bu günün hedefi..." maxLength={100} />
          </Field>

          <Field label="Süre Tahmini">
            <input className="finput" value={form.duration} onChange={e => set('duration', e.target.value)}
              placeholder="~40 dk" maxLength={20} />
          </Field>

          <Field label="Renk">
            <div className="color-picker">
              {PRESET_COLORS.map(c => (
                <button
                  key={c.hex}
                  className={`color-swatch ${form.color === c.hex ? 'selected' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => set('color', c.hex)}
                  title={c.name}
                />
              ))}
            </div>
          </Field>

          {error && <p className="form-error">{error}</p>}
        </div>

        <div className="form-modal-footer">
          <button className="btn-cancel" onClick={onClose}>İptal</button>
          <button className="btn-confirm" style={{ background: form.color }} onClick={handleSubmit}>
            Gün Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="form-field">
      <label className="flabel">{label}{hint && <span className="fhint"> — {hint}</span>}</label>
      {children}
    </div>
  );
}
