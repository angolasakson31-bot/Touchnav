// Tempo parser: "3-1-1" → { down: 3, hold: 1, up: 1 }
export function parseTempo(str) {
  if (!str || str === '—' || str === 'kontrollü') return null;
  const parts = str.split('-').map(Number);
  if (parts.length === 3 && parts.every(n => !isNaN(n))) {
    return { down: parts[0], hold: parts[1], up: parts[2] };
  }
  return null;
}

// Exercise types:
// 'timed'   → use tempo for each rep
// 'manual'  → user taps to advance reps (no auto-timer per rep)
// 'hold'    → each rep is a hold of holdDuration seconds
// 'stretch' → single hold per side

export const DAYS = [
  // ─────────────────────────────────────────────
  // GÜN 1 — PAZARTESİ
  // ─────────────────────────────────────────────
  {
    id: 1,
    name: 'Gün 1',
    day: 'Pazartesi',
    short: 'Pzt',
    color: '#6366f1',
    colorDim: 'rgba(99,102,241,0.15)',
    focus: 'Mekanik Gerilim',
    subtitle: 'Güç Odaklı',
    target: 'Maksimum tork · ağır yükleme · RIR 0-1',
    duration: '~40 dk',
    summary: 'Göğüs 6 · Pull 8 · Omuz 3 · Core 3',
    exercises: [
      {
        id: 'd1_ss1a', label: 'SS1A', group: 'SS1', groupOrder: 0,
        name: 'Decline Push-Up', note: 'ayaklar sandalyede',
        sets: 3, repsStr: '8-10', repsMin: 8, repsMax: 10,
        tempoStr: '3-1-1', tempo: { down: 3, hold: 1, up: 1 },
        restSec: 0, rir: '0-1', target: 'Üst göğüs', type: 'timed',
      },
      {
        id: 'd1_ss1b', label: 'SS1B', group: 'SS1', groupOrder: 1,
        name: 'Band Row', note: 'çift kol',
        sets: 3, repsStr: '10-12', repsMin: 10, repsMax: 12,
        tempoStr: '2-1-2', tempo: { down: 2, hold: 1, up: 2 },
        restSec: 75, rir: '1-2', target: 'Sırt kütlesi', type: 'timed',
      },
      {
        id: 'd1_ss2a', label: 'SS2A', group: 'SS2', groupOrder: 0,
        name: 'Chest Dip', note: '2 sandalye, öne eğik 30°',
        sets: 3, repsStr: '8-10', repsMin: 8, repsMax: 10,
        tempoStr: '3-1-1', tempo: { down: 3, hold: 1, up: 1 },
        restSec: 0, rir: '0-1', target: 'Alt göğüs', type: 'timed',
      },
      {
        id: 'd1_ss2b', label: 'SS2B', group: 'SS2', groupOrder: 1,
        name: 'Band Pull-Apart', note: null,
        sets: 3, repsStr: '15', repsMin: 15, repsMax: 15,
        tempoStr: '2-1-2', tempo: { down: 2, hold: 1, up: 2 },
        restSec: 75, rir: '2', target: 'Arka omuz · rhomboid', type: 'timed',
      },
      {
        id: 'd1_3', label: '3', group: null, groupOrder: 0,
        name: 'Pike Push-Up', note: null,
        sets: 3, repsStr: '10-12', repsMin: 10, repsMax: 12,
        tempoStr: '2-0-1', tempo: { down: 2, hold: 0, up: 1 },
        restSec: 60, rir: '1-2', target: 'Ön omuz', type: 'timed',
      },
      {
        id: 'd1_4', label: '4', group: null, groupOrder: 0,
        name: 'Band Face Pull', note: null,
        sets: 2, repsStr: '12', repsMin: 12, repsMax: 12,
        tempoStr: '2-1-2', tempo: { down: 2, hold: 1, up: 2 },
        restSec: 45, rir: '2', target: 'Alt trapez', type: 'timed',
      },
      {
        id: 'd1_5', label: '5', group: null, groupOrder: 0,
        name: 'Dead Bug', note: null,
        sets: 3, repsStr: '12', repsMin: 12, repsMax: 12,
        tempoStr: 'kontrollü', tempo: null,
        restSec: 45, rir: null, target: 'Core · pelvik kontrol', type: 'manual',
      },
      {
        id: 'd1_6', label: '6', group: null, groupOrder: 0,
        name: 'Chin Tuck', note: 'duvara yaslanarak',
        sets: 3, repsStr: '10 (5 sn)', repsMin: 10, repsMax: 10,
        tempoStr: '—', tempo: null,
        restSec: 0, rir: null, target: 'Boyun düzleşmesi', type: 'hold',
        holdDuration: 5,
      },
      {
        id: 'd1_s', label: '✦', group: null, groupOrder: 0,
        name: 'Kapı Eşiği Göğüs Germe', note: null,
        sets: 2, repsStr: '30 sn/yan', repsMin: 1, repsMax: 1,
        tempoStr: '—', tempo: null,
        restSec: 0, rir: null, target: 'Göğüs germe', type: 'stretch',
        holdDuration: 30,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // GÜN 2 — ÇARŞAMBA
  // ─────────────────────────────────────────────
  {
    id: 2,
    name: 'Gün 2',
    day: 'Çarşamba',
    short: 'Çar',
    color: '#f97316',
    colorDim: 'rgba(249,115,22,0.15)',
    focus: 'Metabolik Stres · Adduksiyon',
    subtitle: 'Şekillendirme',
    target: 'İç göğüs aktivasyonu · kalça sağlığı · RIR 0-1',
    duration: '~42 dk',
    summary: 'Göğüs 7 · Pull 7 · Omuz 2 · Core/Kalça 4',
    exercises: [
      {
        id: 'd2_ss1a', label: 'SS1A', group: 'SS1', groupOrder: 0,
        name: 'Banded Chest Fly', note: null,
        sets: 3, repsStr: '12-15', repsMin: 12, repsMax: 15,
        tempoStr: '2-2-2', tempo: { down: 2, hold: 2, up: 2 },
        restSec: 0, rir: '0-1', target: 'İç göğüs · adduksiyon', type: 'timed',
      },
      {
        id: 'd2_ss1b', label: 'SS1B', group: 'SS1', groupOrder: 1,
        name: 'Band Face Pull', note: null,
        sets: 3, repsStr: '12', repsMin: 12, repsMax: 12,
        tempoStr: '2-1-2', tempo: { down: 2, hold: 1, up: 2 },
        restSec: 60, rir: '2', target: 'Alt trapez · arka omuz', type: 'timed',
      },
      {
        id: 'd2_ss2a', label: 'SS2A', group: 'SS2', groupOrder: 0,
        name: 'Pseudo Planche Push-Up', note: null,
        sets: 2, repsStr: '6-10', repsMin: 6, repsMax: 10,
        tempoStr: '2-1-1', tempo: { down: 2, hold: 1, up: 1 },
        restSec: 0, rir: '0-1', target: 'Alt göğüs · ön omuz', type: 'timed',
      },
      {
        id: 'd2_ss2b', label: 'SS2B', group: 'SS2', groupOrder: 1,
        name: 'Band Pull-Apart', note: null,
        sets: 2, repsStr: '15', repsMin: 15, repsMax: 15,
        tempoStr: '2-1-2', tempo: { down: 2, hold: 1, up: 2 },
        restSec: 75, rir: '2', target: 'Arka omuz', type: 'timed',
      },
      {
        id: 'd2_ss3a', label: 'SS3A', group: 'SS3', groupOrder: 0,
        name: 'Push-Up to T-Rotation', note: null,
        sets: 2, repsStr: '6-8/yan', repsMin: 6, repsMax: 8,
        tempoStr: '2-0-1', tempo: { down: 2, hold: 0, up: 1 },
        restSec: 0, rir: '1-2', target: 'Orta göğüs · core', type: 'timed',
      },
      {
        id: 'd2_ss3b', label: 'SS3B', group: 'SS3', groupOrder: 1,
        name: 'Band Row', note: 'çift kol',
        sets: 2, repsStr: '10-12', repsMin: 10, repsMax: 12,
        tempoStr: '2-1-2', tempo: { down: 2, hold: 1, up: 2 },
        restSec: 60, rir: '1-2', target: 'Sırt', type: 'timed',
      },
      {
        id: 'd2_4', label: '4', group: null, groupOrder: 0,
        name: 'Pike Push-Up', note: null,
        sets: 2, repsStr: '10-12', repsMin: 10, repsMax: 12,
        tempoStr: '2-0-1', tempo: { down: 2, hold: 0, up: 1 },
        restSec: 60, rir: '1-2', target: 'Ön omuz', type: 'timed',
      },
      {
        id: 'd2_5', label: '5', group: null, groupOrder: 0,
        name: 'Bird Dog', note: '3 sn bekleme',
        sets: 2, repsStr: '10/yan', repsMin: 10, repsMax: 10,
        tempoStr: '—', tempo: null,
        restSec: 45, rir: null, target: 'Core · kalça stabilite', type: 'hold',
        holdDuration: 3,
      },
      {
        id: 'd2_6', label: '6', group: null, groupOrder: 0,
        name: 'Glute Bridge', note: 'sığ açı',
        sets: 2, repsStr: '15', repsMin: 15, repsMax: 15,
        tempoStr: '2-2-1', tempo: { down: 2, hold: 2, up: 1 },
        restSec: 45, rir: '2', target: 'Kalça sağlığı', type: 'timed',
      },
      {
        id: 'd2_7', label: '7', group: null, groupOrder: 0,
        name: 'Chin Tuck', note: 'duvara yaslanarak',
        sets: 3, repsStr: '10 (5 sn)', repsMin: 10, repsMax: 10,
        tempoStr: '—', tempo: null,
        restSec: 0, rir: null, target: 'Boyun düzleşmesi', type: 'hold',
        holdDuration: 5,
      },
      {
        id: 'd2_s', label: '✦', group: null, groupOrder: 0,
        name: 'Kapı Eşiği Göğüs Germe', note: null,
        sets: 2, repsStr: '30 sn/yan', repsMin: 1, repsMax: 1,
        tempoStr: '—', tempo: null,
        restSec: 0, rir: null, target: 'Göğüs germe', type: 'stretch',
        holdDuration: 30,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // GÜN 3 — CUMA
  // ─────────────────────────────────────────────
  {
    id: 3,
    name: 'Gün 3',
    day: 'Cuma',
    short: 'Cum',
    color: '#10b981',
    colorDim: 'rgba(16,185,129,0.15)',
    focus: 'Hacim · İzolasyon',
    subtitle: 'Bitirici',
    target: 'Unilateral güç · kol izolasyonu · RIR 1-2',
    duration: '~42 dk',
    summary: 'Göğüs 7 · Triceps 3 · Pull 9 · Core 4',
    exercises: [
      {
        id: 'd3_ss1a', label: 'SS1A', group: 'SS1', groupOrder: 0,
        name: 'Archer Push-Up', note: null,
        sets: 3, repsStr: '6-8/yan', repsMin: 6, repsMax: 8,
        tempoStr: '2-1-1', tempo: { down: 2, hold: 1, up: 1 },
        restSec: 0, rir: '1', target: 'Orta göğüs (unilateral)', type: 'timed',
      },
      {
        id: 'd3_ss1b', label: 'SS1B', group: 'SS1', groupOrder: 1,
        name: 'Band Row', note: 'çift kol',
        sets: 3, repsStr: '10-12', repsMin: 10, repsMax: 12,
        tempoStr: '2-1-2', tempo: { down: 2, hold: 1, up: 2 },
        restSec: 75, rir: '1-2', target: 'Sırt kütlesi', type: 'timed',
      },
      {
        id: 'd3_ss2a', label: 'SS2A', group: 'SS2', groupOrder: 0,
        name: 'Decline Push-Up', note: 'ayaklar sandalyede',
        sets: 2, repsStr: '10-12', repsMin: 10, repsMax: 12,
        tempoStr: '3-1-1', tempo: { down: 3, hold: 1, up: 1 },
        restSec: 0, rir: '1', target: 'Üst göğüs', type: 'timed',
      },
      {
        id: 'd3_ss2b', label: 'SS2B', group: 'SS2', groupOrder: 1,
        name: 'Band Pull-Apart', note: null,
        sets: 3, repsStr: '15', repsMin: 15, repsMax: 15,
        tempoStr: '2-1-2', tempo: { down: 2, hold: 1, up: 2 },
        restSec: 60, rir: '2', target: 'Arka omuz', type: 'timed',
      },
      {
        id: 'd3_ss3a', label: 'SS3A', group: 'SS3', groupOrder: 0,
        name: 'Diamond Push-Up', note: null,
        sets: 2, repsStr: '10-12', repsMin: 10, repsMax: 12,
        tempoStr: '2-1-1', tempo: { down: 2, hold: 1, up: 1 },
        restSec: 0, rir: '1', target: 'İç göğüs · üst', type: 'timed',
      },
      {
        id: 'd3_ss3b', label: 'SS3B', group: 'SS3', groupOrder: 1,
        name: 'Band Face Pull', note: null,
        sets: 3, repsStr: '12', repsMin: 12, repsMax: 12,
        tempoStr: '2-1-2', tempo: { down: 2, hold: 1, up: 2 },
        restSec: 60, rir: '2', target: 'Alt trapez', type: 'timed',
      },
      {
        id: 'd3_4', label: '4', group: null, groupOrder: 0,
        name: 'Tricep Dip', note: 'eller arkada sandalyede',
        sets: 3, repsStr: '10-12', repsMin: 10, repsMax: 12,
        tempoStr: '2-1-1', tempo: { down: 2, hold: 1, up: 1 },
        restSec: 60, rir: '1', target: 'Triceps', type: 'timed',
      },
      {
        id: 'd3_5', label: '5', group: null, groupOrder: 0,
        name: 'Superman Hold', note: null,
        sets: 2, repsStr: '30 sn', repsMin: 1, repsMax: 1,
        tempoStr: '—', tempo: null,
        restSec: 45, rir: null, target: 'Alt sırt · arka zincir', type: 'hold',
        holdDuration: 30,
      },
      {
        id: 'd3_6', label: '6', group: null, groupOrder: 0,
        name: 'Hollow Body Hold', note: null,
        sets: 2, repsStr: '30 sn', repsMin: 1, repsMax: 1,
        tempoStr: '—', tempo: null,
        restSec: 45, rir: null, target: 'Core · pelvik kontrol', type: 'hold',
        holdDuration: 30,
      },
      {
        id: 'd3_7', label: '7', group: null, groupOrder: 0,
        name: 'Chin Tuck', note: 'duvara yaslanarak',
        sets: 3, repsStr: '10 (5 sn)', repsMin: 10, repsMax: 10,
        tempoStr: '—', tempo: null,
        restSec: 0, rir: null, target: 'Boyun düzleşmesi', type: 'hold',
        holdDuration: 5,
      },
      {
        id: 'd3_s', label: '✦', group: null, groupOrder: 0,
        name: 'Kapı Eşiği Göğüs Germe', note: null,
        sets: 2, repsStr: '30 sn/yan', repsMin: 1, repsMax: 1,
        tempoStr: '—', tempo: null,
        restSec: 0, rir: null, target: 'Göğüs germe', type: 'stretch',
        holdDuration: 30,
      },
    ],
  },
];
