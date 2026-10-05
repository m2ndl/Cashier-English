/* Retail English — app logic. Plain JavaScript, no build step, no dependencies.
   All program content comes from js/program.js (window.PROGRAM). */
(function () {
  'use strict';

  const P = window.PROGRAM;
  if (!P) return;

  // =====================================================================
  // Utilities
  // =====================================================================
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);

  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (key, n) => { const d = new Date(key + 'T00:00:00'); d.setDate(d.getDate() + n); return dayKey(d); };
  const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  function fmtDate(v) {
    if (!v) return '—';
    const d = typeof v === 'number' ? new Date(v) : new Date(String(v).length === 10 ? v + 'T00:00:00' : v);
    try { return d.toLocaleDateString('ar', { day: 'numeric', month: 'long', year: 'numeric', calendar: 'gregory', numberingSystem: 'latn' }); }
    catch (e) { return dayKey(d); }
  }

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function shuffle(arr, rand = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const pick = (arr, rand = Math.random) => arr[Math.floor(rand() * arr.length)];
  const uniq = arr => Array.from(new Set(arr));

  // =====================================================================
  // Icons (24px line icons)
  // =====================================================================
  const IC = {
    home: '<path d="M3 11 12 4l9 7"/><path d="M5.5 9.5V20H10v-5.5h4V20h4.5V9.5"/>',
    book: '<path d="M12 6.5c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5z"/><path d="M12 6.5V20.5"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    chart: '<path d="M4 20h16"/><path d="M7 16v-5"/><path d="M12 16V7"/><path d="M17 16V9"/>',
    back: '<path d="M9 5l7 7-7 7"/>',
    next: '<path d="M15 5l-7 7 7 7"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    help: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/><path d="M6 6l3.5 3.5M14.5 14.5 18 18M18 6l-3.5 3.5M9.5 14.5 6 18"/>',
    settings: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    volume: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    slow: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l-4-4.5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
    stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor" stroke="none"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4.5V9h-4.5"/>',
    lock: '<rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    download: '<path d="M12 4v11"/><path d="M7.5 10.5 12 15l4.5-4.5"/><path d="M5 19.5h14"/>',
    upload: '<path d="M12 15V4"/><path d="M7.5 8.5 12 4l4.5 4.5"/><path d="M5 19.5h14"/>',
    print: '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v6H7z"/>',
    share: '<circle cx="17.5" cy="5.5" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/><path d="M8.7 10.8l6.6-4M8.7 13.2l6.6 4"/>',
    shareIOS: '<path d="M12 14.5V3.5"/><path d="M8 7l4-4 4 4"/><path d="M8.5 10H6.5a1 1 0 0 0-1 1v8.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1h-2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4"/><path d="M17.5 14.2A6 6 0 0 1 21 20"/>',
    chat: '<path d="M4 5.5h16v10H10l-4.5 4v-4H4z"/>',
    complaint: '<path d="M4 5.5h16v10H10l-4.5 4v-4H4z"/><path d="M12 8v3.5M12 13.5h.01"/>',
    list: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="4.5" cy="6.5" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="17.5" r="1" fill="currentColor"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6" rx="1.5"/><rect x="16.5" y="14" width="4" height="6" rx="1.5"/>',
    layers: '<path d="M12 4 21 8.5l-9 4.5-9-4.5z"/><path d="M3 13l9 4.5 9-4.5"/>',
    bolt: '<path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z"/>',
    clipboard: '<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="M8.5 13l2.5 2.5 4.5-4.5"/>',
    briefcase: '<rect x="3" y="7.5" width="18" height="12.5" rx="2"/><path d="M9 7.5v-2A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2"/><path d="M3 13h18"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><path d="M12 7.5h.01"/>',
    alert: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.5"/><path d="M12 17.2h.01"/>',
    hash: '<path d="M5 9h15M4 15h15M10 3.5 8 20.5M16 3.5l-2 17"/>',
    cards: '<rect x="3.5" y="7" width="13" height="13" rx="2"/><path d="M8 3.5h10.5a2 2 0 0 1 2 2V16"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4.5h12l-2.5 4 2.5 4H5"/>',
    grid: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M3.5 9.5h17M3.5 14.5h17M9.5 3.5v17M14.5 3.5v17"/>',
    pen: '<path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14.5 7.5l3 3"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.8 13.5 7.5 21l4.5-2.5 4.5 2.5-1.3-7.5"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    wave: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>',
    map: '<path d="M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5z"/><path d="M9 4.5v13M15 6.5v13"/>',
    tag: '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.4 6.4a1.5 1.5 0 0 1-2.1 0z"/><circle cx="8" cy="8" r="1.5"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/>',
    swap: '<path d="M4 8h14l-3.5-3.5"/><path d="M20 16H6l3.5 3.5"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
    trash: '<path d="M4.5 7h15"/><path d="M9.5 7V4.5h5V7"/><path d="M6.5 7l1 13h9l1-13"/>',
    copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V5A1.5 1.5 0 0 0 14 3.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5"/>',
    expand: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>'
  };
  // The size attributes are a fallback: CSS sizes each icon where it is used.
  const icon = (name, cls = '') => `<svg class="${cls}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[name] || IC.info}</svg>`;

  // =====================================================================
  // Content lookups
  // =====================================================================
  const UNITS = P.units;
  const PH = Object.create(null);
  UNITS.forEach(u => u.phrases.forEach(p => { p.unit = u.id; PH[p.id] = p; }));
  const PLO = Object.create(null);
  P.outcomes.forEach(o => { PLO[o.id] = o; });
  const ASSESS = Object.create(null);
  P.assessments.forEach(a => { ASSESS[a.id] = a; });
  const unitById = id => UNITS.find(u => u.id === id);
  const unitIndex = id => UNITS.findIndex(u => u.id === id);

  const STEPS = [
    { id: 'context', hint: 'الموقف والكلمات الجديدة', min: 3, ar: 'السياق والكلمات', en: 'Context and words', icon: 'info', strand: 'lfl', cycle: 'field' },
    { id: 'model', hint: 'استمع إلى حوار كامل ثم رتّبه', min: 4, ar: 'الحوار النموذجي', en: 'Model conversation', icon: 'chat', strand: 'mfi', cycle: 'model' },
    { id: 'phrases', hint: 'عبارات العميل وردودك عليها', min: 8, ar: 'العبارات المفتاحية', en: 'Key phrases', icon: 'list', strand: 'lfl', cycle: 'model' },
    { id: 'listen', hint: 'ماذا يقصد العميل؟ 8 أسئلة', min: 4, ar: 'افهم العميل', en: 'Understand the customer', icon: 'headphones', strand: 'mfi', cycle: 'model' },
    { id: 'build', hint: 'اختر جملتك في كل دور', min: 3, ar: 'ابنِ الحوار', en: 'Build the conversation', icon: 'layers', strand: 'mfo', cycle: 'joint' },
    { id: 'roleplay', hint: 'قل جملتك بنفسك', min: 4, ar: 'تقمّص الدور', en: 'Role-play', icon: 'mic', strand: 'mfo', cycle: 'independent' },
    { id: 'speed', hint: 'دقيقة واحدة بأسرع ما يمكن', min: 1, ar: 'جولة السرعة', en: 'Speed round', icon: 'bolt', strand: 'flu', cycle: 'independent' },
    { id: 'check', hint: '10 أسئلة لتعرف مستواك', min: 5, ar: 'اختبار الوحدة', en: 'Unit check', icon: 'clipboard', strand: 'assess', cycle: 'assess' },
    { id: 'mission', hint: 'جرّب العبارات مع عملاء حقيقيين', min: 0, ar: 'مهمة في العمل', en: 'Mission at work', icon: 'briefcase', strand: 'mfo', cycle: 'transfer' }
  ];
  const STRAND = {
    mfi: { ar: 'مدخلات ذات معنى', en: 'Meaning-focused input' },
    mfo: { ar: 'مخرجات ذات معنى', en: 'Meaning-focused output' },
    lfl: { ar: 'تعلّم لغوي مركّز', en: 'Language-focused learning' },
    flu: { ar: 'تنمية الطلاقة', en: 'Fluency development' },
    assess: { ar: 'تقييم تكويني', en: 'Formative assessment' }
  };
  const CYCLE = {
    field: { ar: 'بناء السياق', en: 'Building the field' },
    model: { ar: 'النموذج والتحليل', en: 'Modelling and deconstruction' },
    joint: { ar: 'البناء المشترك', en: 'Joint construction' },
    independent: { ar: 'البناء المستقل', en: 'Independent construction' },
    assess: { ar: 'التحقق من التعلّم', en: 'Checking learning' },
    transfer: { ar: 'النقل إلى العمل', en: 'Transfer to work' }
  };
  const AGREE_SCALE = [
    { v: 1, ar: 'لا أوافق بشدة' },
    { v: 2, ar: 'لا أوافق' },
    { v: 3, ar: 'محايد' },
    { v: 4, ar: 'أوافق' },
    { v: 5, ar: 'أوافق بشدة' }
  ];

  // =====================================================================
  // Storage (this device only)
  // =====================================================================
  const KEY = 'retail-english.v2';
  function fresh() {
    return {
      v: 2,
      profile: { name: '', store: '', startedAt: null },
      settings: { ar: true, rate: 1, accent: 'mix', theme: 'auto', mic: true },
      lc: { entry: null, exit: null },
      steps: {},
      checks: {},
      srs: {},
      time: {},
      missions: {},
      pulses: {},
      survey: null,
      best: {},
      trainer: { ratings: [], pending: null, align: { A: null, B: null }, unlocked: false },
      backupAt: 0,     // when the learner last exported or shared a copy of their data
      installLater: 0  // the install card stays hidden until this time
    };
  }
  // Saved and imported data is rebuilt field by field: only known keys, checked types and
  // ranges. Anything else is dropped, so a bad file can neither break the app nor inject markup.
  const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const num = v => (typeof v === 'number' && isFinite(v) ? v : 0);
  const int = (v, lo, hi) => (Number.isInteger(v) && v >= lo && v <= hi ? v : null);
  const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');
  const DATE = /^\d{4}-\d{2}-\d{2}$/;
  const isDate = v => typeof v === 'string' && DATE.test(v);
  function sanitize(r) {
    const d = fresh();
    if (!isObj(r) || r.v !== 2) return d;
    if (isObj(r.profile)) {
      d.profile.name = str(r.profile.name, 60);
      d.profile.store = str(r.profile.store, 80);
      d.profile.startedAt = isDate(r.profile.startedAt) ? r.profile.startedAt : null;
    }
    if (isObj(r.settings)) {
      const t = r.settings;
      if (typeof t.ar === 'boolean') d.settings.ar = t.ar;
      if (typeof t.mic === 'boolean') d.settings.mic = t.mic;
      if (typeof t.rate === 'number' && t.rate >= 0.5 && t.rate <= 1.5) d.settings.rate = t.rate;
      if (['mix', 'us', 'gb'].includes(t.accent)) d.settings.accent = t.accent;
      if (['auto', 'light', 'dark'].includes(t.theme)) d.settings.theme = t.theme;
    }
    ['entry', 'exit'].forEach(f => {
      const lc = isObj(r.lc) ? r.lc[f] : null;
      if (isObj(lc) && int(lc.total, 1, 100) && int(lc.score, 0, lc.total) !== null) {
        d.lc[f] = {
          score: lc.score, total: lc.total, at: num(lc.at),
          partA: int(lc.partA, 0, 100) || 0, partATotal: int(lc.partATotal, 0, 100) || 0,
          partB: int(lc.partB, 0, 100) || 0, partBTotal: int(lc.partBTotal, 0, 100) || 0,
          answers: Array.isArray(lc.answers) ? lc.answers.filter(isObj).map(a => ({
            t: str(a.t, 12), plo: str(a.plo, 12), ok: a.ok === true,
            ans: typeof a.ans === 'number' && isFinite(a.ans) ? a.ans : (str(a.ans, 200) || null)
          })) : []
        };
      }
    });
    UNITS.forEach(u => {
      const st = isObj(r.steps) ? r.steps[u.id] : null;
      if (isObj(st)) STEPS.forEach(s => {
        const rec = st[s.id];
        if (!isObj(rec)) return;
        const o = { at: num(rec.at) };
        if (typeof rec.last === 'number' && isFinite(rec.last)) o.last = clamp(Math.round(rec.last), 0, 999);
        if (typeof rec.best === 'number' && isFinite(rec.best)) o.best = clamp(Math.round(rec.best), 0, 999);
        (d.steps[u.id] = d.steps[u.id] || {})[s.id] = o;
      });
      const ch = isObj(r.checks) ? r.checks[u.id] : null;
      if (Array.isArray(ch)) {
        const list = ch.filter(c => isObj(c) && int(c.pct, 0, 100) !== null).map(c => ({ pct: c.pct, at: num(c.at) }));
        if (list.length) d.checks[u.id] = list;
      }
      const m = isObj(r.missions) ? r.missions[u.id] : null;
      if (isObj(m)) d.missions[u.id] = { count: int(m.count, 0, 999), note: str(m.note, 2000), at: num(m.at) };
      const pu = isObj(r.pulses) ? r.pulses[u.id] : null;
      if (isObj(pu) && int(pu.useful, 1, 5) && ['easy', 'right', 'hard'].includes(pu.level)) {
        d.pulses[u.id] = { useful: pu.useful, level: pu.level, comment: str(pu.comment, 500), at: num(pu.at) };
      }
      const b = isObj(r.best) ? int(r.best['speed-' + u.id], 0, 999) : null;
      if (b !== null) d.best['speed-' + u.id] = b;
    });
    if (isObj(r.srs)) Object.keys(r.srs).forEach(id => {
      const c = r.srs[id];
      if (PH[id] && isObj(c) && int(c.box, 1, 5) && isDate(c.due)) d.srs[id] = { box: c.box, due: c.due };
    });
    if (isObj(r.time)) Object.keys(r.time).forEach(k => {
      if (isDate(k) && typeof r.time[k] === 'number' && r.time[k] > 0) d.time[k] = Math.min(Math.round(r.time[k]), 86400);
    });
    if (isObj(r.survey) && P.feedback.survey.every(q => int(r.survey[q.id], 1, 5))) {
      d.survey = { at: num(r.survey.at) };
      P.feedback.survey.forEach(q => { d.survey[q.id] = r.survey[q.id]; });
      P.feedback.open.forEach(q => { d.survey[q.id] = str(r.survey[q.id], 1000); });
    }
    if (isObj(r.trainer)) {
      const T = r.trainer;
      const R = P.rubric, lo = R.scale[0], hi = R.scale[R.scale.length - 1];
      const tasks = P.roleplayCards.map(c => c.id);
      const rater = x => {
        if (!isObj(x) || !isObj(x.scores) || !R.criteria.every(c => int(x.scores[c.id], lo, hi))) return null;
        const scores = {};
        R.criteria.forEach(c => { scores[c.id] = x.scores[c.id]; });
        return { name: str(x.name, 60), scores };
      };
      if (Array.isArray(T.ratings)) {
        d.trainer.ratings = T.ratings.map((x, i) => {
          if (!isObj(x) || !tasks.includes(x.task)) return null;
          const r1 = rater(x.r1), r2 = rater(x.r2);
          if (!r1 || !r2) return null;
          return { id: str(x.id, 40) || 'r' + i + Date.now().toString(36), learner: str(x.learner, 80), task: x.task, r1, r2, at: num(x.at) };
        }).filter(Boolean);
      }
      if (isObj(T.pending) && tasks.includes(T.pending.task) && rater(T.pending.r1)) {
        d.trainer.pending = { learner: str(T.pending.learner, 80), task: T.pending.task, r1: rater(T.pending.r1), at: num(T.pending.at) };
      }
      if (isObj(T.align)) ['A', 'B'].forEach(w => {
        const a = T.align[w];
        if (!isObj(a) || !isObj(a.map)) return;
        const map = {};
        P.assessments.filter(x => x.summative).forEach(t => { map[t.id] = Array.isArray(a.map[t.id]) ? uniq(a.map[t.id].filter(id => PLO[id])) : []; });
        d.trainer.align[w] = { name: str(a.name, 60), map, at: num(a.at) };
      });
      d.trainer.unlocked = T.unlocked === true;
    }
    d.backupAt = num(r.backupAt);
    d.installLater = num(r.installLater);
    return d;
  }
  function load() {
    let data = null;
    try { data = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { data = null; }
    return sanitize(data);
  }
  let S = load();
  let saveTimer = null;
  let saveFailed = false;
  function save() {
    clearTimeout(saveTimer); saveTimer = null;
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) {
      // Storage is full or blocked: say so once, so the learner doesn't lose work unknowingly.
      if (!saveFailed) { saveFailed = true; setTimeout(warnSaveFailed, 0); }
    }
  }
  function saveSoon() { if (!saveTimer) saveTimer = setTimeout(save, 2000); }
  window.addEventListener('pagehide', save);
  // Another tab saved: adopt its state so this tab does not overwrite it later.
  // The current screen keeps showing; fresh data appears on the next navigation.
  window.addEventListener('storage', e => {
    if (e.key !== KEY && e.key !== null) return;
    clearTimeout(saveTimer); saveTimer = null;
    S = load();
    applySettings();
  });

  // Study time: counts 15-second ticks while the page is visible and in use.
  let lastActive = Date.now();
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, () => { lastActive = Date.now(); }, { passive: true }));
  setInterval(() => {
    if (document.visibilityState === 'visible' && Date.now() - lastActive < 90000) {
      const k = dayKey();
      S.time[k] = (S.time[k] || 0) + 15;
      saveSoon();
    }
  }, 15000);

  // =====================================================================
  // Progress model
  // =====================================================================
  const stepRec = (u, st) => (S.steps[u] || {})[st] || null;
  const stepDone = (u, st) => !!stepRec(u, st);
  function markStep(u, st, score) {
    S.steps[u] = S.steps[u] || {};
    const rec = S.steps[u][st] || {};
    rec.at = Date.now();
    if (typeof score === 'number') { rec.last = score; rec.best = Math.max(rec.best || 0, score); }
    S.steps[u][st] = rec;
    save();
    keepStorage();
  }
  function checkBest(u) {
    const list = S.checks[u] || [];
    return list.length ? Math.max(...list.map(c => c.pct)) : null;
  }
  const unitPassed = u => (checkBest(u) || 0) >= P.meta.passMark;
  // A step counts as complete when it was done; the unit check, when it was passed.
  const stepComplete = (u, id) => (id === 'check' ? unitPassed(u) : stepDone(u, id));
  const unitStepsDone = u => STEPS.filter(s => stepDone(u, s.id)).length;
  const overallPct = () => pct(UNITS.reduce((n, u) => n + unitStepsDone(u.id), 0), UNITS.length * STEPS.length);
  function currentWeek() {
    if (!S.profile.startedAt) return 1;
    return clamp(Math.floor(daysBetween(S.profile.startedAt, dayKey()) / 7) + 1, 1, P.meta.weeks);
  }
  function nextStep() {
    for (const u of UNITS) for (const s of STEPS) {
      if (s.id === 'mission') continue;
      if (s.id === 'check' ? !unitPassed(u.id) : !stepDone(u.id, s.id)) return { unit: u, step: s };
    }
    return null;
  }
  function secondsBetween(fromKey, toKey) {
    return Object.keys(S.time).filter(k => k >= fromKey && k <= toKey).reduce((n, k) => n + S.time[k], 0);
  }
  const minutesTotal = () => Math.round(Object.values(S.time).reduce((a, b) => a + b, 0) / 60);
  const daysActive = () => Object.keys(S.time).filter(k => S.time[k] >= 60).length;

  // Spaced review (Leitner boxes)
  const BOX_DAYS = [0, 1, 3, 7, 14, 30];
  function srsAdd(ids) {
    const t = dayKey();
    ids.forEach(id => { if (!S.srs[id]) S.srs[id] = { box: 1, due: addDays(t, 1) }; });
    save();
  }
  const srsDue = () => { const t = dayKey(); return Object.keys(S.srs).filter(id => PH[id] && S.srs[id].due <= t); };
  function srsGrade(id, grade) {
    const c = S.srs[id]; if (!c) return;
    const t = dayKey();
    if (grade === 0) { c.box = 1; c.due = addDays(t, 1); }
    else if (grade === 1) { c.due = addDays(t, Math.max(1, Math.floor(BOX_DAYS[c.box] / 2))); }
    else { c.box = Math.min(5, c.box + 1); c.due = addDays(t, BOX_DAYS[c.box]); }
    save();
  }

  // =====================================================================
  // Numbers and prices (riyals and halalas)
  // =====================================================================
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const u100 = n => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''));
  function u1000(n) {
    const h = Math.floor(n / 100), r = n % 100;
    let s = h ? ONES[h] + ' hundred' : '';
    if (r) s += (h ? ' and ' : '') + u100(r);
    return s || 'zero';
  }
  function intWords(n) {
    n = Math.floor(n);
    if (n === 0) return 'zero';
    if (n >= 1000000) return String(n);
    const th = Math.floor(n / 1000), r = n % 1000;
    let s = th ? u1000(th) + ' thousand' : '';
    if (r) s += (th ? (r < 100 ? ' and ' : ' ') : '') + u1000(r);
    return s;
  }
  function priceWords(h) {
    const r = Math.floor(h / 100), c = h % 100, parts = [];
    if (r) parts.push(intWords(r) + (r === 1 ? ' riyal' : ' riyals'));
    if (c) parts.push(intWords(c) + (c === 1 ? ' halala' : ' halalas'));
    return parts.join(' and ') || 'zero riyals';
  }
  function priceShort(h) {
    const r = Math.floor(h / 100), c = h % 100;
    if (!c || !r || r % 100 === 0) return priceWords(h);
    return intWords(r) + ' ' + (c < 10 ? 'oh ' + ONES[c] : u100(c));
  }
  const fmtPrice = h => Math.floor(h / 100).toLocaleString('en-US') + '.' + pad(h % 100);
  function parsePrice(s) {
    s = String(s || '').trim()
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/٫/g, '.').replace(/٬/g, '')
      .replace(/[^\d.,]/g, '');
    if (!s.includes('.') && /,\d{1,2}$/.test(s)) s = s.replace(/,(\d{1,2})$/, '.$1');
    s = s.replace(/,/g, '');
    if (!s || isNaN(+s)) return null;
    return Math.round(+s * 100);
  }
  function randomPrice(rand = Math.random) {
    const kind = rand();
    let riyals;
    if (kind < 0.35) riyals = pick([13, 14, 15, 16, 17, 18, 19, 30, 40, 50, 60, 70, 80, 90], rand);
    else if (kind < 0.75) riyals = 1 + Math.floor(rand() * 99);
    else riyals = 100 + Math.floor(rand() * 900);
    return riyals * 100 + pick([0, 0, 0, 25, 50, 75, 95, 99, 10, 5, 40, 60], rand);
  }

  // =====================================================================
  // Speech: text-to-speech with a mix of English accents for customers
  // =====================================================================
  const TTS = (() => {
    const ok = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
    let voices = [];
    let keepAlive = null;
    let current = null; // keeps the utterance alive until it ends
    let loaded = false;  // the device has reported its voices (or had time to)
    let reported = false; // the device listed at least one voice, in any language
    let heard = false;   // at least one utterance has played on this device
    const loc = v => String(v.lang || '').replace('_', '-').toLowerCase();
    const changed = () => document.dispatchEvent(new Event('voices'));
    function refresh() {
      if (!ok) return;
      const all = speechSynthesis.getVoices() || [];
      voices = all.filter(v => /^en(-|$)/.test(loc(v)));
      if (all.length) loaded = reported = true;
      changed();
    }
    if (ok) {
      refresh();
      if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', refresh);
      else speechSynthesis.onvoiceschanged = refresh;
      setTimeout(() => { if (!loaded) { loaded = true; changed(); } }, 2000);
    }
    // Devices often list their oldest, most robotic voices first: Windows' desktop voices
    // (Microsoft David) ahead of Google's, and Apple's novelty voices (Albert, Fred, Grandpa)
    // ahead of Samantha or Daniel. So voices are ranked by quality rather than taken in order.
    // Apple names are matched from the start, so other platforms' voices ("Microsoft …",
    // "Google …") never collide with them.
    const ROBOTIC = /^(agnes|albert|bad news|bahh|bells|boing|bruce|bubbles|cellos|deranged|eddy|flo|fred|good news|grandma|grandpa|hysterical|jester|junior|kathy|organ|pipe organ|princess|ralph|reed|rocko|sandy|shelley|superstar|trinoids|vicki|victoria|whisper|wobble|zarvox)\b|espeak|^microsoft (ana|maisie)\b/i; // Ana, Maisie: child voices
    function score(v) {
      const n = v.name || '';
      if (ROBOTIC.test(n)) return -10;
      let s = v.localService ? 0.5 : 0; // starts at once and works offline
      if (/natural|neural|premium|enhanced/i.test(n)) s += 4;
      else if (/^microsoft\b/i.test(n)) s -= /^microsoft david\b/i.test(n) ? 3 : 2; // Windows desktop voices; David is the oldest
      return s;
    }
    const good = v => score(v) >= 0;
    const id = v => v.voiceURI || v.name;
    const failed = new Set(); // voices that failed this session
    // An online voice failed: use the device's own voices for a few minutes, or until reconnected.
    let onlineFailedAt = 0;
    const onlineFailed = () => { onlineFailedAt = Date.now(); };
    window.addEventListener('online', () => { onlineFailedAt = 0; });
    function usable() {
      const list = voices.filter(v => !failed.has(id(v)));
      const offline = navigator.onLine === false || Date.now() - onlineFailedAt < 5 * 60000;
      const local = offline ? list.filter(v => v.localService) : list;
      return local.length ? local : list;
    }
    // The voices of one accent, best first.
    const ranked = (list, prefix) => list.filter(v => loc(v).startsWith(prefix)).sort((a, b) => score(b) - score(a));
    let scene = null; // the conversation on screen, if any
    const CUSTOMER_ACCENTS = ['en-in', 'en-gb', 'en-au', 'en-us', 'en-ie', 'en-za', 'en-ph', 'en-ng', 'en-ca', 'en-nz', 'en-sg'];
    function voiceFor(role, text) {
      const list = usable();
      if (!list.length) return null;
      const acc = S.settings.accent;
      const order = acc === 'gb' ? ['en-gb', 'en-us'] : ['en-us', 'en-gb'];
      // The learner's own lines: one voice, the best of the chosen accent.
      // A good voice of another accent beats a robotic voice of the chosen one.
      const tops = order.map(p => ranked(list, p)[0]).filter(Boolean);
      const best = list.slice().sort((a, b) => score(b) - score(a))[0];
      const own = tops.find(good) || (good(best) ? best : tops[0] || best);
      if (role !== 'c') return own;
      // Customers: a spread of accents and voices, each line always in the same voice, and
      // one customer keeps one voice for a whole conversation (the scene).
      // The best voices the device has, and not the learner's voice when there is a choice.
      let groups = (acc === 'mix' ? CUSTOMER_ACCENTS : order).map(p => ranked(list, p)).filter(g => g.length);
      if (acc !== 'mix') groups = groups.slice(0, 1);
      for (const keep of [v => score(v) > -10, good, v => v !== own]) {
        const g = groups.map(x => x.filter(keep)).filter(x => x.length);
        if (g.length) groups = g;
      }
      if (!groups.length) return own;
      // An accent with no good voice keeps only its least robotic ones.
      groups = groups.map(g => g.some(good) ? g : g.filter(v => score(v) > score(g[0]) - 1));
      const h = hash(scene || text), g = groups[h % groups.length];
      return g[Math.floor(h / groups.length) % g.length];
    }
    // Errors that point at the voice itself. Others (blocked without a tap, audio busy) are no
    // reason to drop a voice.
    const VOICE_ERROR = /network|synthesis-failed|synthesis-unavailable|voice-unavailable|language-unavailable/;
    const activated = () => !navigator.userActivation || navigator.userActivation.hasBeenActive;
    let gen = 0; // bumped by every new line and by stop(), so an old line never comes back
    function speak(text, opts = {}) {
      const my = ++gen;
      return new Promise(resolve => {
        if (!ok || !text) { resolve(false); return; }
        const busy = speechSynthesis.speaking || speechSynthesis.pending;
        if (busy) speechSynthesis.cancel();
        const start = retry => {
          if (my !== gen) { resolve(null); return; }
          const u = new SpeechSynthesisUtterance(text);
          const v = voiceFor(opts.role || 'k', text);
          if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
          u.rate = clamp((S.settings.rate || 1) * (opts.slow ? 0.7 : 1), 0.5, 1.5);
          let done = false, started = false;
          const fin = r => { if (done) return; done = true; clearInterval(keepAlive); resolve(r); };
          u.onstart = () => { started = heard = true; };
          u.onend = () => { heard = true; fin(true); };
          u.onerror = e => {
            const err = (e && e.error) || '';
            // Cancelled by the next tap: not a failure (null).
            if (/interrupted|canceled/.test(err) || my !== gen) { fin(null); return; }
            // The voice failed: set it aside (an online voice: all online voices, since the
            // connection is the likely cause) and try the line once more with the next best.
            if (v && !retry && !done && VOICE_ERROR.test(err)) {
              if (v.localService) failed.add(id(v)); else onlineFailed();
              done = true; clearInterval(keepAlive); setTimeout(() => start(true), 80); return;
            }
            fin(false);
          };
          current = u;
          speechSynthesis.resume();
          speechSynthesis.speak(u);
          clearInterval(keepAlive);
          keepAlive = setInterval(() => {
            if (speechSynthesis.speaking) { started = heard = true; speechSynthesis.resume(); }
            else if (!speechSynthesis.pending && started) fin(true);
          }, 500);
          setTimeout(() => {
            // An online voice that never started, after the learner has tapped (so the browser
            // was not just blocking sound): most likely no connection.
            if (!done && !started && my === gen && v && !v.localService && activated()) onlineFailed();
            fin(my === gen ? false : null); // a line replaced by a newer one has not failed
          }, 4000 + (text.length * 160) / u.rate);
        };
        if (busy) setTimeout(() => start(false), 80); else start(false);
      });
    }
    function stop() { gen++; if (ok) { speechSynthesis.cancel(); clearInterval(keepAlive); } }
    return {
      ok, speak, stop,
      // Set by a conversation's screen so its customer keeps one voice; cleared on navigation.
      scene: k => { scene = k || null; },
      voiceCount: () => voices.length,
      ownVoice: () => (voiceFor('k', '') || {}).name || '',
      locales: () => uniq(voices.map(loc)),
      // The device lists voices but none is English: English is read by another language's
      // voice, or not at all.
      noEnglish: () => ok && reported && !voices.length,
      // The device listed no voices at all, so only a failed attempt tells us anything.
      unknown: () => ok && loaded && !reported,
      heard: () => heard
    };
  })();

  // When audio cannot work, say why and how to fix it, instead of failing silently.
  const voiceFixHtml = () => `
    <div class="voice-warn">
      <p>لا يجد التطبيق صوتًا إنجليزيًا في جهازك، لذلك لا تعمل أزرار «استمع» كما ينبغي. ثبّت صوتًا إنجليزيًا مرة واحدة، وهو مجاني، ثم أعد فتح التطبيق.</p>
      <div><strong>أندرويد</strong>
        <ol class="small">
          <li>افتح الإعدادات وابحث عن «تحويل النص إلى كلام».</li>
          <li>اختر محرك ${enSpan('Google')}، ثم افتح إعداداته واختر «تثبيت بيانات الصوت».</li>
          <li>نزّل الإنجليزية، ويُفضّل أكثر من لهجة.</li>
        </ol></div>
      <div><strong>آيفون</strong>
        <ol class="small">
          <li>الإعدادات › تسهيلات الاستخدام › المحتوى المنطوق › الأصوات.</li>
          <li>اختر الإنجليزية ونزّل صوتًا واحدًا على الأقل.</li>
        </ol></div>
      <p class="muted small">إن لم ينجح ذلك، افتح التطبيق في متصفح ${enSpan('Chrome')} أو ${enSpan('Safari')}.</p>
    </div>`;
  const voiceStatusHtml = () =>
    !TTS.ok ? `<div class="note voice-warn"><strong>الصوت غير مدعوم في هذا المتصفح</strong><p class="small">افتح التطبيق في ${enSpan('Chrome')} أو ${enSpan('Safari')}.</p></div>`
    : TTS.noEnglish() ? `<div class="note">${voiceFixHtml()}</div>`
    : TTS.voiceCount() ? `<p class="small">${icon('check', 'inline-ico')} الأصوات الإنجليزية في جهازك: <span class="num">${TTS.voiceCount()}</span>${TTS.ownVoice() ? ` · صوتك: ${enSpan(TTS.ownVoice())}` : ''}</p>`
    : TTS.unknown() ? `<details class="acc"><summary>اضغط «جرّب الصوت». لم تسمع شيئًا؟ <span class="chev">${icon('down')}</span></summary><div class="acc-body">${voiceFixHtml()}</div></details>`
    : '<p class="muted small">جارٍ البحث عن الأصوات…</p>';
  // Settings shows the voice status; voices can arrive after the page is drawn.
  document.addEventListener('voices', () => { const el = $('#voiceStatus'); if (el) el.innerHTML = voiceStatusHtml(); });
  let voiceWarned = false;
  function voiceProblem(failed) {
    if (!failed && !TTS.noEnglish()) return;
    if (voiceWarned) return;
    voiceWarned = true;
    if ($('.sheet-backdrop')) { toast('لا يوجد صوت إنجليزي في جهازك. انظر الإعدادات.'); return; }
    openSheet('الصوت لا يعمل؟', voiceFixHtml());
  }
  // A modal bottom sheet with a close button; closes on Escape, a tap outside, or navigation.
  let closeSheet = null;
  function openSheet(title, body, opts = {}) {
    if ($('.sheet-backdrop')) return null;
    const back = document.activeElement;
    const wrap = document.createElement('div');
    wrap.className = 'sheet-backdrop';
    wrap.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
        <div class="grabber"></div>
        <div class="row" style="margin-bottom:10px">
          <h2 id="sheetTitle" class="grow" style="margin:0;font-size:1.1rem">${esc(title)}</h2>
          <button class="btn ghost small" type="button" data-close>إغلاق</button>
        </div>
        <div class="stack">${body}</div>
      </div>`;
    // The page behind can't be reached while the sheet is open (inert where supported,
    // and Tab wraps around inside the sheet).
    const behind = $$('.skip, .app-bar, #view, .tab-bar');
    const close = (refocus = true) => {
      wrap.remove();
      behind.forEach(el => { el.inert = false; });
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      closeSheet = null;
      stopAll();
      const to = opts.focus ? $(opts.focus) : back;
      if (refocus && to && to.isConnected) to.focus();
    };
    const onKey = e => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') trapTab(e, wrap);
    };
    wrap.addEventListener('click', e => { if (e.target === wrap || e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(wrap);
    behind.forEach(el => { el.inert = true; });
    document.body.style.overflow = 'hidden';
    $('[data-close]', wrap).focus();
    closeSheet = close;
    return wrap;
  }
  // Keep keyboard focus inside a dialog.
  function trapTab(e, box) {
    const f = $$('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), summary, [tabindex="0"]', box)
      .filter(el => el.getClientRects().length);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!box.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  // A phrase in large type, to turn the phone toward a customer.
  function showBig(text) {
    const back = document.activeElement;
    const wrap = document.createElement('div');
    wrap.className = 'big-phrase';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', 'العبارة بخط كبير');
    wrap.innerHTML = `
      <p class="say" lang="en" dir="ltr">${esc(text)}</p>
      <div class="row wrap" style="justify-content:center">
        <button class="btn" type="button" data-say="${esc(text)}" data-role="k">${icon('volume')} استمع</button>
        <button class="btn ghost" type="button" data-close-big>إغلاق</button>
      </div>`;
    const behind = $$('.skip, .app-bar, #view, .tab-bar, .sheet-backdrop');
    const was = behind.map(el => el.inert);
    const close = () => {
      wrap.remove();
      behind.forEach((el, i) => { el.inert = was[i]; });
      document.removeEventListener('keydown', onKey, true);
      if (back && back.isConnected) back.focus();
    };
    // Captured first, so Escape closes only this view and not the sheet under it.
    const onKey = e => {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); }
      else if (e.key === 'Tab') { e.stopImmediatePropagation(); trapTab(e, wrap); }
    };
    wrap.addEventListener('click', e => { if (e.target === wrap || e.target.closest('[data-close-big]')) close(); });
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(wrap);
    behind.forEach(el => { el.inert = true; });
    $('[data-close-big]', wrap).focus();
  }

  let seqId = 0;
  function stopAll() { seqId++; TTS.stop(); Mic.stop(); }
  async function playLines(lines, onLine) {
    const my = ++seqId;
    for (let i = 0; i < lines.length; i++) {
      if (my !== seqId) return false;
      if (onLine) onLine(i);
      const r = await TTS.speak(lines[i].en, { role: lines[i].s });
      voiceProblem(r === false && !TTS.heard());
      if (my !== seqId) return false;
      await wait(300);
    }
    if (onLine) onLine(-1);
    return true;
  }
  async function say(text, role, slow) {
    seqId++;
    if (!TTS.ok) { toast('الصوت غير مدعوم في هذا المتصفح. جرّب Chrome أو Safari.'); return false; }
    const r = await TTS.speak(text, { role, slow });
    voiceProblem(r === false && !TTS.heard());
    return r;
  }

  // =====================================================================
  // Speech recognition (optional; Chrome and Safari)
  // =====================================================================
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const Mic = {
    ok: !!SR,
    current: null,
    listen() {
      return new Promise((resolve, reject) => {
        let r;
        try { r = new SR(); } catch (e) { reject('unsupported'); return; }
        r.lang = 'en-US';
        r.interimResults = false;
        r.maxAlternatives = 4;
        r.continuous = false;
        let got = [];
        r.onresult = e => { got = Array.from(e.results[0] || []).map(a => a.transcript); };
        r.onerror = e => reject(e.error || 'error');
        r.onend = () => { Mic.current = null; resolve(got); };
        TTS.stop();
        try { r.start(); Mic.current = r; } catch (e) { reject('start'); }
      });
    },
    stop() { try { if (Mic.current) Mic.current.abort(); } catch (e) { /* ignore */ } Mic.current = null; }
  };
  const micOn = () => Mic.ok && S.settings.mic;

  const CONTRACTIONS = {
    "i'm": 'i am', "it's": 'it is', "you're": 'you are', "we're": 'we are', "they're": 'they are', "that's": 'that is',
    "here's": 'here is', "there's": 'there is', "what's": 'what is', "where's": 'where is', "let's": 'let us',
    "i'll": 'i will', "we'll": 'we will', "you'll": 'you will', "it'll": 'it will', "don't": 'do not', "doesn't": 'does not',
    "didn't": 'did not', "can't": 'can not', cannot: 'can not', "won't": 'will not', "isn't": 'is not', "aren't": 'are not',
    "i've": 'i have', "we've": 'we have', "haven't": 'have not', "i'd": 'i would', "you've": 'you have',
    ok: 'okay', colour: 'color', colours: 'colors', grey: 'gray', centre: 'center'
  };
  function tokens(s) {
    s = String(s).toLowerCase().replace(/[’‘`]/g, "'");
    s = s.replace(/(\d+)[.,](\d{1,2})\b/g, (m, a, b) => intWords(+a) + ' ' + intWords(+b));
    s = s.replace(/\d+/g, m => intWords(+m));
    s = s.replace(/-/g, ' ').replace(/[^a-z' ]+/g, ' ');
    return s.split(/\s+/).filter(Boolean).flatMap(w => (CONTRACTIONS[w] || w.replace(/'/g, '')).split(' '));
  }
  // Longest common subsequence: which target words were heard, in order.
  function lcsMarks(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const marks = new Array(m).fill(false);
    let i = 0, j = 0;
    while (i < m && j < n) {
      if (a[i] === b[j]) { marks[i] = true; i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
      else j++;
    }
    return marks;
  }
  function compareSpeech(target, heardList) {
    const t = tokens(target);
    let best = { score: 0, heard: heardList[0] || '', marks: t.map(() => false), words: t };
    heardList.forEach(h => {
      const marks = lcsMarks(t, tokens(h));
      const score = t.length ? marks.filter(Boolean).length / t.length : 0;
      if (score > best.score) best = { score, heard: h, marks, words: t };
    });
    return best;
  }

  // =====================================================================
  // UI helpers
  // =====================================================================
  const view = $('#view');
  let cleanups = [];
  const onLeave = fn => cleanups.push(fn);

  function setBar(title, sub) {
    $('#barTitle').textContent = title;
    $('#barSub').textContent = sub || '';
    document.title = title.includes(P.meta.title.en) ? title : `${title} · ${P.meta.title.en}`;
  }
  function toast(msg) {
    $$('.toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }
  // Counted nouns in Arabic: 1 → "عبارة واحدة", 2 → "عبارتان", 3–10 → "3 عبارات", 11+ → "11 عبارة".
  // Each word lists the forms for one, two, 3–10 and the rest; the dual changes with the case,
  // so words used after a preposition or another noun have their own (genitive) entry.
  const PLURAL = (() => { try { return new Intl.PluralRules('ar'); } catch (e) { return null; } })();
  const W = {
    phrase: ['عبارة واحدة', 'عبارتان', 'عبارات', 'عبارة'],
    phraseGen: ['عبارة واحدة', 'عبارتين', 'عبارات', 'عبارة'],
    attempt: ['محاولة واحدة', 'محاولتان', 'محاولات', 'محاولة'],
    minute: ['دقيقة واحدة', 'دقيقتان', 'دقائق', 'دقيقة'],
    day: ['يوم واحد', 'يومان', 'أيام', 'يومًا']
  };
  function countAr(n, w) {
    const c = PLURAL ? PLURAL.select(n) : n === 1 ? 'one' : n === 2 ? 'two' : n >= 3 && n <= 10 ? 'few' : 'many';
    if (c === 'one') return w[0];
    if (c === 'two') return w[1];
    return `${n} ${c === 'few' ? w[2] : w[3]}`;
  }
  // Arabic text from program.js may mark English fragments with backticks.
  const rich = s => esc(s).replace(/`([^`]+)`/g, '<bdi class="en" lang="en" dir="ltr">$1</bdi>');
  const plain = s => String(s || '').replace(/`/g, '');
  // A short preview that ends on a whole word.
  function preview(s, max) {
    const t = plain(s);
    if (t.length <= max) return t;
    return t.slice(0, max).replace(/\s+\S*$/, '').replace(/[\s:،,.؛;]+$/, '') + '…';
  }
  const enSpan = (s, cls = '') => `<span class="en ${cls}" lang="en" dir="ltr">${esc(s)}</span>`;
  // Watch-out examples: the English on its own line (tap to hear), the Arabic meaning below it.
  const watchList = items => !items || !items.length ? '' : `<ul class="watch-list">${items.map(x => `
    <li><button class="say-line" type="button" data-say="${esc(x.say || x.en)}" data-role="k">${icon('volume')}<span lang="en" dir="ltr">${esc(x.en)}</span></button><span class="m">${esc(x.ar)}</span></li>`).join('')}</ul>`;
  const audioBtns = (text, role = 'k', slow = true) =>
    `<button class="audio-btn" type="button" data-say="${esc(text)}" data-role="${role}">${icon('volume')}استمع</button>` +
    (slow ? `<button class="audio-btn" type="button" data-say="${esc(text)}" data-role="${role}" data-slow="1">${icon('slow')}ببطء</button>` : '');
  const ploChips = ids => ids.map(id => `<span class="pill brand" title="${esc(PLO[id] ? PLO[id].en : id)}">${esc(id)}</span>`).join(' ');
  // A score as a ring that fills to v percent; the text inside is what is read out.
  const scoreRing = (v, text, tone = '') => `<div class="ring ${tone}" style="--p:${v}"><span class="v" dir="ltr">${esc(text)}</span></div>`;
  const progressBar = (v, label = 'التقدّم') => `<div class="progress" role="progressbar" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}"><span style="width:${v}%"></span></div>`;
  // A table that may scroll sideways: reachable and named for keyboard and screen-reader users.
  const scrollBox = label => `<div class="table-scroll" tabindex="0" role="region" aria-label="${esc(label)}">`;
  // Scrolling. Activities replace their content in place, so each new item starts at the top,
  // and anything that appears below the fold (feedback, the next button) is scrolled into view.
  const motionOK = () => !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  let scrollSeq = 0;
  // Chrome can commit one more frame of a smooth scroll that was still running, so the jump
  // to the top is repeated on the next frame unless another scroll was asked for since.
  function toTop() {
    const my = ++scrollSeq;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => { if (my === scrollSeq && window.scrollY) window.scrollTo(0, 0); });
  }
  // Scroll just enough to show el in full: below the app bar, above the tab bar, and above
  // an activity's sticky action bar unless el is inside it.
  function showEl(el) {
    scrollSeq++;
    if (!el || !el.isConnected) return;
    const r = el.getBoundingClientRect();
    if (!r.height) return;
    const top = $('.app-bar').getBoundingClientRect().bottom + 8;
    const bar = Math.max(0, ...$$('.action-bar', view).filter(b => !b.contains(el)).map(b => b.offsetHeight));
    const tabs = $('.tab-bar'); // hidden during lessons
    const bottom = (tabs.getClientRects().length ? tabs.getBoundingClientRect().top : window.innerHeight) - 8 - bar;
    let dy = r.bottom > bottom ? r.bottom - bottom : 0;
    if (r.top - dy < top) dy = r.top - top; // never push its top out of view
    if (Math.abs(dy) > 2) window.scrollTo({ top: window.scrollY + dy, behavior: motionOK() ? 'smooth' : 'auto' });
  }
  // Navigating to the current hash fires no hashchange, so re-render directly.
  const go = hash => { if (location.hash === hash) render(); else location.hash = hash; };
  // For invalid links: move on without leaving the bad address in the history.
  const redirect = hash => { if (location.hash === hash) { render(); return; } replacing = true; location.replace(hash); };

  // Tap-to-hear anywhere: any element with data-say.
  document.addEventListener('click', async e => {
    // A link away from an activity in progress asks first, before the address changes.
    const away = e.target.closest('a[href^="#"]');
    if (away && away.getAttribute('href') !== location.hash && !okToLeave()) { e.preventDefault(); return; }
    const b = e.target.closest('[data-say]');
    if (b) {
      e.preventDefault();
      $$('.audio-btn.playing, .phrase-btn.playing').forEach(x => x.classList.remove('playing'));
      b.classList.add('playing');
      await say(b.dataset.say, b.dataset.role || 'k', b.dataset.slow === '1');
      b.classList.remove('playing');
      return;
    }
    if (e.target.closest('[data-help]')) { e.preventDefault(); openHelp(); return; }
    const big = e.target.closest('[data-big]');
    if (big) { e.preventDefault(); showBig(big.dataset.big); return; }
    const link = e.target.closest('a[href^="#"]');
    if (link && link.getAttribute('href') === location.hash) { e.preventDefault(); render(); }
  });

  function openHelp() {
    openSheet('عبارات سريعة', `
      <p class="muted small" style="margin-bottom:4px">اضغط على العبارة لتسمعها، أو على ${icon('expand', 'inline-ico')} لتعرضها للعميل بخط كبير.</p>
      <div class="stack-lg">
        ${P.quickHelp.map(g => `
          <section class="stack">
            <h3>${esc(g.group.ar)}</h3>
            ${g.items.map(i => `
              <div class="phrase-row">
                <button class="phrase-btn" type="button" data-say="${esc(i.en)}" data-role="k">
                  <span class="play">${icon('play')}</span>
                  <span class="grow"><span class="say" lang="en" dir="ltr" style="display:block">${esc(i.en)}</span><span class="gloss">${esc(i.ar)}</span></span>
                </button>
                <button class="show-btn" type="button" data-big="${esc(i.en)}" aria-label="اعرض «${esc(i.ar)}» بخط كبير">${icon('expand')}</button>
              </div>`).join('')}
          </section>`).join('')}
      </div>`, { focus: '#helpBtn' });
  }

  function applySettings() {
    const t = S.settings.theme;
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
    document.body.classList.toggle('no-ar', !S.settings.ar);
  }

  // Shared option button list
  function optionButtons(options, isEn) {
    return `<div class="options">${options.map((o, i) => `
      <button class="option" type="button" data-opt="${i}">
        ${isEn ? `<span class="say" lang="en" dir="ltr">${esc(o)}</span>` : `<span class="grow">${esc(o)}</span>`}
      </button>`).join('')}</div>`;
  }
  function markOptions(root, chosen, correct) {
    $$('.option', root).forEach((b, i) => {
      b.disabled = true;
      if (i === correct) { b.classList.add('correct'); b.insertAdjacentHTML('beforeend', icon('check', 'mark')); }
      else if (i === chosen) { b.classList.add('wrong'); b.insertAdjacentHTML('beforeend', icon('x', 'mark')); }
    });
  }
  const feedback = (ok, title, detail) => `<div class="feedback ${ok ? 'good' : 'bad'}" role="status">${icon(ok ? 'check' : 'x')}<div>${title}${detail ? `<span class="detail">${detail}</span>` : ''}</div></div>`;

  // Distractors drawn from the same unit first, then the rest of the program.
  function distractors(correct, pool, n, rand = Math.random) {
    const seen = new Set([correct]);
    const out = [];
    shuffle(pool, rand).forEach(x => { if (out.length < n && !seen.has(x)) { seen.add(x); out.push(x); } });
    return out;
  }
  function allCAr() { return uniq(UNITS.flatMap(u => u.phrases.map(p => p.cAr))); }
  // Wrong replies for "choose the reply" items: never a generic reply and never one from
  // the same function group (see the tags in program.js), same unit first.
  function respDistractors(target, f, unitId, n, rand = Math.random) {
    const ok = p => !p.gen && p.f !== f && p.k !== target;
    const same = shuffle(unitById(unitId).phrases.filter(ok), rand);
    const other = shuffle(UNITS.filter(u => u.id !== unitId).flatMap(u => u.phrases).filter(ok), rand);
    return uniq(same.concat(other).map(p => p.k)).slice(0, n);
  }

  function makeMeaningItem(p, rand = Math.random) {
    const unit = unitById(p.unit);
    const text = pick(p.c, rand);
    let ds = distractors(p.cAr, unit.phrases.map(x => x.cAr), 3, rand);
    if (ds.length < 3) ds = ds.concat(distractors(p.cAr, allCAr().filter(x => !ds.includes(x)), 3 - ds.length, rand));
    const options = shuffle([p.cAr, ...ds], rand);
    return { t: 'meaning', text, role: 'c', options, correct: options.indexOf(p.cAr), phrase: p };
  }
  function makeRespondItem(p, rand = Math.random) {
    const text = pick(p.c, rand);
    const options = shuffle([p.k, ...respDistractors(p.k, p.f, p.unit, 3, rand)], rand);
    return { t: 'respond', text, role: 'c', options, correct: options.indexOf(p.k), phrase: p };
  }
  function makePriceItem(amount, rand = Math.random) {
    return { t: 'price', amount, text: rand() < 0.5 ? priceWords(amount) : priceShort(amount) };
  }

  // =====================================================================
  // Keeping progress safe. Progress lives only in this browser's storage, which Safari on
  // iPhone clears after seven days of use without a visit (Home Screen apps are exempt)
  // and which other browsers may evict when the device is short of space.
  // =====================================================================
  const UA = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(UA);
  const installed = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  const hasProgress = () => Object.keys(S.steps).length > 0 || !!S.lc.entry;
  // Anything a restore would overwrite, the trainer's ratings included.
  const hasData = () => hasProgress() || !!S.lc.exit || Object.keys(S.srs).length > 0 || Object.keys(S.missions).length > 0 ||
    !!S.survey || S.trainer.ratings.length > 0 || !!S.trainer.align.A;

  let persistAsked = false;
  // Ask the browser not to evict the data. Chrome and Safari decide silently; Firefox may ask.
  function keepStorage() {
    if (persistAsked) return;
    persistAsked = true;
    try {
      if (navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(p => p || navigator.storage.persist()).catch(() => {});
    } catch (e) { /* not supported */ }
  }
  function warnSaveFailed() {
    const sheet = openSheet('لم يُحفظ تقدّمك', `
      <p>لا يستطيع المتصفح حفظ تقدّمك على هذا الجهاز، لذلك قد يضيع عند إغلاق التطبيق.</p>
      <p class="small muted">قد يكون السبب التصفح الخاص أو امتلاء ذاكرة الجهاز. احفظ نسخة من تقدّمك الآن، ثم افتح التطبيق في نافذة عادية.</p>
      <button class="btn" type="button" data-act="export-now">${icon('download')} احفظ نسخة من تقدّمي</button>`);
    if (!sheet) { toast('تعذّر حفظ تقدّمك على هذا الجهاز'); return; }
    $('[data-act="export-now"]', sheet).addEventListener('click', exportData);
  }

  // Backups: a file the learner can keep or send to the trainer, and import again later.
  const backupObj = () => ({ program: P.meta.id, version: P.meta.version, exportedAt: new Date().toISOString(), data: S });
  const backupName = () => `${P.meta.id}-${(S.profile.name || 'learner').replace(/[^\w؀-ۿ-]+/g, '-')}-${dayKey()}`;
  const markBackup = () => { S.backupAt = Date.now(); save(); };
  // Shared as .txt because Chrome only shares a fixed list of file types; the import accepts both.
  function backupFile() {
    try { return new File([JSON.stringify(backupObj())], `${backupName()}.txt`, { type: 'text/plain' }); } catch (e) { return null; }
  }
  function readBackup(text) {
    try {
      const obj = JSON.parse(String(text || '').trim());
      return isObj(obj) && isObj(obj.data) && obj.data.v === 2 ? obj.data : isObj(obj) && obj.v === 2 ? obj : null;
    } catch (e) { return null; }
  }
  function restoreBackup(data, done) {
    if (hasData() && !confirm('سيستبدل هذا بياناتك الحالية. هل تريد المتابعة؟')) return;
    S = sanitize(data);
    save(); applySettings();
    toast(done);
    render();
  }
  // Remind once a week to send the learning record, which carries a backup file.
  const backupDue = () => {
    if (!hasProgress()) return false;
    const since = S.backupAt || (S.profile.startedAt ? new Date(S.profile.startedAt + 'T00:00:00').getTime() : Date.now());
    return Date.now() - since >= 7 * 864e5;
  };

  // Installing. Chrome offers a one-tap install prompt; iPhone needs Share › Add to Home Screen.
  // A Home Screen app on iPhone does not see the progress kept in Safari, so learners who have
  // started copy it over first and paste it into the installed app.
  let installEvent = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    installEvent = e;
    const card = $('#installCard');
    if (card) card.outerHTML = installCardHtml();
  });
  window.addEventListener('appinstalled', () => { installEvent = null; const c = $('#installCard'); if (c) c.remove(); });
  const showInstall = () => !installed() && !!(installEvent || isIOS || isAndroid) && !(S.installLater > Date.now());
  function installCardHtml() {
    let how;
    if (installEvent) how = `<button class="btn block" type="button" data-act="install">${icon('download')} ثبّت التطبيق</button>`;
    else if (isIOS) {
      how = `
        <ol class="steps-list small">
          ${hasProgress() ? `<li>التطبيق المثبّت يبدأ فارغًا، فانسخ تقدّمك أولًا:<br><button class="btn soft small" type="button" data-act="copy-progress">${icon('copy')} انسخ تقدّمي</button></li>` : ''}
          <li>اضغط زر المشاركة ${icon('shareIOS', 'inline-ico')} في المتصفح.</li>
          <li>اختر «إضافة إلى الشاشة الرئيسية».</li>
          <li>افتح التطبيق من الشاشة الرئيسية${hasProgress() ? '، واضغط فيه «الصق تقدّمي»' : '، وتدرّب منه دائمًا'}.</li>
        </ol>`;
    } else how = '<p class="small">افتح قائمة المتصفح ⋮ واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p>';
    return `
      <div class="card stack" id="installCard">
        <div class="row" style="align-items:flex-start"><span class="unit-badge">${icon('download')}</span>
          <span class="grow"><strong>ثبّت التطبيق على هاتفك</strong><br><span class="muted small">${isIOS
            ? 'يفتح بلمسة واحدة ويحفظ تقدّمك. أما في المتصفح فقد يُحذف تقدّمك إذا لم تفتح التطبيق أسبوعًا.'
            : 'يفتح بلمسة واحدة، ويعمل دون إنترنت، ويحفظ تقدّمك بأمان أكبر.'}</span></span>
        </div>
        ${how}
        <button class="btn ghost small" type="button" data-act="install-later" style="align-self:flex-start">لاحقًا</button>
      </div>`;
  }
  // Shown in a freshly installed iPhone app, until progress exists.
  const moveCardHtml = () => `
    <div class="card stack" id="moveCard">
      <div class="row" style="align-items:flex-start"><span class="unit-badge">${icon('copy')}</span>
        <span class="grow"><strong>بدأت التدريب في المتصفح؟</strong><br><span class="muted small">انقل تقدّمك إلى هنا: افتح التطبيق في المتصفح واضغط «انسخ تقدّمي»، ثم ارجع إلى هنا.</span></span>
      </div>
      <button class="btn soft" type="button" data-act="paste-progress">${icon('copy')} الصق تقدّمي</button>
    </div>`;
  async function doInstall() {
    const ev = installEvent;
    if (!ev) return;
    installEvent = null;
    try {
      ev.prompt();
      const choice = await ev.userChoice;
      if (choice && choice.outcome === 'accepted') { const c = $('#installCard'); if (c) c.remove(); return; }
    } catch (e) { /* show the manual steps instead */ }
    const c = $('#installCard');
    if (c) c.outerHTML = installCardHtml();
  }
  async function copyProgress() {
    save();
    try {
      await navigator.clipboard.writeText(JSON.stringify(backupObj()));
      toast('نُسخ تقدّمك. أضف التطبيق الآن إلى الشاشة الرئيسية.');
    } catch (e) {
      exportData();
      toast('تعذّر النسخ، فحُفظ تقدّمك في ملف. استورده من الإعدادات في التطبيق.');
    }
  }
  async function pasteProgress() {
    let text = null;
    try { text = await navigator.clipboard.readText(); } catch (e) { text = null; }
    if (text === null) { pasteSheet(); return; } // no clipboard access: paste by hand
    const data = readBackup(text);
    if (data) restoreBackup(data, 'نُقل تقدّمك');
    else toast('لم أجد تقدّمًا منسوخًا. اضغط «انسخ تقدّمي» في المتصفح أولًا، ثم حاول مرة أخرى.');
  }
  function pasteSheet() {
    const sheet = openSheet('الصق تقدّمك', `
      <p class="small">المس المربع مطولًا واختر «لصق»، ثم اضغط «نقل».</p>
      <textarea class="input" id="pasteBox" rows="4" dir="ltr" lang="en" autocomplete="off" aria-label="النص المنسوخ"></textarea>
      <button class="btn" type="button" data-act="paste-go">نقل</button>`);
    if (!sheet) return;
    $('[data-act="paste-go"]', sheet).addEventListener('click', () => {
      const data = readBackup($('#pasteBox', sheet).value);
      if (data) restoreBackup(data, 'نُقل تقدّمك');
      else toast('هذا ليس تقدّمًا منسوخًا من التطبيق');
    });
  }
  const safeActs = {
    install: doInstall,
    'install-later': () => { S.installLater = Date.now() + 3 * 864e5; save(); const c = $('#installCard'); if (c) c.remove(); },
    'copy-progress': copyProgress,
    'paste-progress': pasteProgress
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (b && safeActs[b.dataset.act]) safeActs[b.dataset.act]();
  });

  // =====================================================================
  // Router
  // =====================================================================
  const ROUTES = [
    ['', viewHome], ['units', viewUnits], ['outcomes', viewOutcomes], ['unit/:u', viewUnit], ['unit/:u/:step', viewStep],
    ['practice', viewPractice], ['numbers', viewNumbers], ['review', viewReview], ['dialogues', viewDialogues],
    ['dialogue/:u/:which', viewDialogue], ['watch', viewWatch],
    ['progress', viewProgress], ['record', viewRecord], ['settings', viewSettings],
    ['final', viewFinal], ['lc/:form', viewListeningCheck], ['survey', viewSurvey],
    ['trainer', viewTrainer], ['trainer/design', viewDesign], ['trainer/matrix', viewMatrix], ['trainer/guide/:u', viewGuide],
    ['trainer/cards', viewCards], ['trainer/rate', viewRate], ['trainer/ratings', viewRatings], ['trainer/align', viewAlign]
  ];
  const PARENT = {
    units: '', outcomes: 'units', unit: 'units', practice: '', numbers: 'practice', review: 'practice', dialogues: 'practice',
    dialogue: 'dialogues', watch: 'practice', progress: '', record: 'progress', settings: '', final: 'units',
    lc: 'final', survey: 'final', trainer: 'settings'
  };
  function parentOf(path) {
    const parts = path.split('/');
    if (parts[0] === 'unit' && parts.length === 3) return 'unit/' + parts[1];
    if (parts[0] === 'trainer' && parts.length > 1) return 'trainer';
    return PARENT[parts[0]] != null ? PARENT[parts[0]] : '';
  }
  function tabOf(path) {
    const p = path.split('/')[0];
    if (!p) return 'home';
    if (['units', 'outcomes', 'unit', 'final', 'lc', 'survey'].includes(p)) return 'units';
    if (['practice', 'numbers', 'review', 'dialogues', 'dialogue', 'watch'].includes(p)) return 'practice';
    if (['progress', 'record'].includes(p)) return 'progress';
    return '';
  }
  function match(path) {
    const parts = path.split('/').filter(Boolean);
    for (const [pat, fn] of ROUTES) {
      const pp = pat.split('/').filter(Boolean);
      if (pp.length !== parts.length) continue;
      const params = {};
      let ok = true;
      pp.forEach((p, i) => {
        if (p[0] === ':') { try { params[p.slice(1)] = decodeURIComponent(parts[i]); } catch (e) { ok = false; } }
        else if (p !== parts[i]) ok = false;
      });
      if (ok) return { fn, params };
    }
    return null;
  }

  const navStack = [];
  let currentPath = '';
  let replacing = false;
  let restoring = false; // putting the address back after the learner chose to stay
  let popping = 0;       // history entries skipped at once when a lesson is closed
  // While an activity is under way, the question to ask before leaving it.
  let leaveMsg = null;
  const LEAVE = 'لم تُنهِ هذا التمرين بعد، وسيضيع ما أنجزته فيه. هل تريد الخروج؟';
  const guardLeave = (msg = LEAVE) => { leaveMsg = msg; };
  const releaseLeave = () => { leaveMsg = null; };
  const okToLeave = () => { if (leaveMsg && !confirm(leaveMsg)) return false; leaveMsg = null; return true; };
  window.addEventListener('beforeunload', e => { if (leaveMsg) { e.preventDefault(); e.returnValue = ''; } });
  // Unit steps are lessons: no tab bar, and the header button closes the lesson.
  const isLesson = path => /^unit\/[^/]+\/[^/]+$/.test(path);
  function render() {
    const asked = location.hash.replace(/^#\/?/, '').replace(/\/+$/, '');
    if (restoring) { restoring = false; if (asked === currentPath) return; }
    // Leaving an activity part-way with the phone's back (or forward) button: ask first. If the
    // learner stays, put the address back without redrawing, so the activity keeps its state.
    // (Links ask before they navigate; see the click handler.)
    if (asked !== currentPath && !okToLeave()) {
      restoring = true;
      if (navStack.length > 1 && navStack[navStack.length - 2] === asked) history.forward(); else history.back();
      return;
    }
    stopAll();
    TTS.scene(null);
    cleanups.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
    cleanups = [];
    if (closeSheet) closeSheet(false);

    let path = asked;
    let m = match(path);
    if (!m) { path = ''; m = match(''); }
    // Trainer pages hold the exit assessments: they open only after the trainer code.
    if (path.split('/')[0] === 'trainer' && !trainerOpen()) m = { fn: viewTrainerCode, params: {} };
    currentPath = path;

    if (popping) {
      navStack.length = Math.max(1, navStack.length - popping);
      popping = 0;
      if (navStack[navStack.length - 1] !== path) navStack.push(path);
    }
    else if (replacing) { navStack[navStack.length - 1] = path; replacing = false; }
    else if (navStack.length > 1 && navStack[navStack.length - 2] === path) navStack.pop();
    else if (navStack[navStack.length - 1] !== path) navStack.push(path);

    const top = ['', 'units', 'practice', 'progress'].includes(path);
    const lesson = isLesson(path);
    document.documentElement.classList.toggle('lesson', lesson);
    const backBtn = $('#backBtn');
    backBtn.hidden = top;
    backBtn.innerHTML = icon(lesson ? 'x' : 'back');
    backBtn.setAttribute('aria-label', lesson ? 'إغلاق الدرس' : 'رجوع');
    const tab = tabOf(path);
    $$('.tab-bar a').forEach(a => { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });

    view.innerHTML = '';
    view.removeAttribute('dir');
    view.removeAttribute('lang');
    view.classList.remove('trainer');
    // Start at the top before the view draws, so a view can scroll to what it shows next.
    toTop();
    try { m.fn(m.params); }
    catch (err) {
      console.error(err);
      view.innerHTML = `
        <div class="empty stack">${icon('alert')}<p>حدث خطأ غير متوقع.</p>
          <a class="btn" href="#/">الرئيسية</a>
          <button class="btn ghost" type="button" data-act="hard-reset">مسح البيانات والبدء من جديد</button>
        </div>`;
      $('[data-act="hard-reset"]', view).addEventListener('click', () => {
        if (!confirm('سيُحذف كل تقدمك على هذا الجهاز نهائيًا. هل أنت متأكد؟')) return;
        try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
        S = fresh(); applySettings(); go('#/');
      });
    }
    view.focus({ preventScroll: true });
  }
  function goBack() {
    if (!okToLeave()) return;
    if (isLesson(currentPath)) { exitLesson(); return; }
    if (navStack.length > 1) { history.back(); return; }
    // Opened directly on an inner page: go up without leaving a history entry behind.
    replacing = true;
    location.replace('#/' + parentOf(currentPath));
  }
  // Closing a lesson returns to its unit page, skipping the steps visited on the way.
  function exitLesson() {
    if (!okToLeave()) return;
    const target = 'unit/' + currentPath.split('/')[1];
    const i = navStack.lastIndexOf(target);
    if (i >= 0 && i < navStack.length - 1) { popping = navStack.length - 1 - i; history.go(-popping); return; }
    replacing = true;
    location.replace('#/' + target);
  }

  // =====================================================================
  // Views: Home
  // =====================================================================
  function viewHome() {
    setBar(P.meta.title.en, P.meta.subtitle.ar);
    const wk = currentWeek();
    const nx = nextStep();
    const due = srsDue().length;
    const passed = UNITS.filter(u => unitPassed(u.id)).length;
    const weekUnit = UNITS.find(u => u.week === wk) || UNITS[0];
    const started = Object.keys(S.steps).length > 0;
    // The mission is offered once the week's unit is under way, not before any learning.
    const missionDue = !S.missions[weekUnit.id] && STEPS.some(st => st.id !== 'mission' && stepDone(weekUnit.id, st.id));
    const allPassed = passed === UNITS.length;
    const goal = P.meta.dailyMinutes || 20;
    const today = Math.round((S.time[dayKey()] || 0) / 60);
    const card = (href, ic, title, sub, tint = '') => `
        <a class="card unit-card" href="${href}">
          <span class="unit-badge ${tint}">${icon(ic)}</span>
          <span class="grow"><strong>${title}</strong><br><span class="muted small">${sub}</span></span>
          <span class="chev">${icon('next')}</span>
        </a>`;
    const entryCard = card('#/lc/entry', 'headphones', 'اختبار الاستماع الأولي', '10 أسئلة قصيرة لقياس نقطة البداية');

    // The one next thing to do is the welcome card's button: the entry listening check before
    // anything else, then the next unfinished step, then the final assessment.
    const next = !S.lc.entry && !started
      ? { href: '#/lc/entry', label: 'ابدأ باختبار استماع قصير', sub: '10 أسئلة قصيرة لقياس نقطة البداية' }
      : nx ? { href: `#/unit/${nx.unit.id}/${nx.step.id}`, label: `${started ? 'تابع' : 'ابدأ'}: ${nx.step.ar}`, sub: `الوحدة ${unitIndex(nx.unit.id) + 1} · ${nx.unit.title.ar}` }
      : allPassed && !S.lc.exit ? { href: '#/final', label: 'التقييم الختامي', sub: 'أنهيت الوحدات! بقي اختبار الاستماع الختامي والاستبانة' }
      : null;

    // On iPhone, installing comes before anything else: progress made in the browser has to be
    // moved by hand. Elsewhere it follows the next step.
    const install = showInstall() ? installCardHtml() : '';
    const installFirst = isIOS && !hasProgress();
    let cards = installFirst ? install : '';
    // A new learner's button opens the listening check; the first lesson is offered next to it.
    if (nx && !started && next && next.href === '#/lc/entry') {
      cards += card(`#/unit/${nx.unit.id}/${nx.step.id}`, nx.unit.icon, `أو ابدأ الوحدة ${unitIndex(nx.unit.id) + 1} مباشرة`, `${esc(nx.step.ar)} — ${esc(nx.unit.title.ar)}`);
    }
    if (!installFirst) cards += install;
    if (due) cards += card('#/review', 'cards', `مراجعة اليوم: ${countAr(due, W.phrase)}`, 'التكرار المتباعد يثبّت العبارات في الذاكرة', 't-blue');
    if (missionDue) cards += card(`#/unit/${weekUnit.id}/mission`, 'briefcase', 'مهمة هذا الأسبوع في العمل', esc(weekUnit.mission.short || preview(weekUnit.mission.ar, 90)), 't-amber');
    if (!S.lc.entry && started) cards += entryCard;
    if (backupDue()) cards += card('#/record', 'share', 'أرسل سجلّك إلى المدرب', 'مرة كل أسبوع: يرى مدربك تقدّمك، وتبقى عنده نسخة منه إن ضاع هاتفك.');
    if (isIOS && installed() && !hasProgress()) cards += moveCardHtml();

    // New learners are asked their name once, here; it goes on the learning record.
    const askName = !started && !S.profile.name;
    view.innerHTML = `
      <div class="stack-lg">
        <section class="hero stack">
          <p class="small">الأسبوع ${wk} من ${P.meta.weeks} · ${esc(weekUnit.title.ar)}</p>
          <h2>مرحبًا${S.profile.name ? '، ' + esc(S.profile.name) : ''}!</h2>
          ${started ? `
          ${progressBar(overallPct(), 'تقدّمك في البرنامج')}
          <div class="stat-grid">
            <div class="stat"><div class="v">${passed}/${UNITS.length}</div><div class="l">وحدات مجتازة</div></div>
            <div class="stat ${today >= goal ? 'met' : ''}"><div class="v">${today >= goal ? `${icon('check', 'inline-ico')} ` : ''}${today}/${goal}</div><div class="l">${today >= goal ? 'أنجزت هدف اليوم' : 'دقيقة اليوم'}</div></div>
            <div class="stat"><div class="v">${due}</div><div class="l">للمراجعة</div></div>
          </div>` : `
          <p>${P.meta.weeks} وحدات، وحدة لكل أسبوع. كل يوم نحو ${goal} دقيقة من الخطوات القصيرة، ثم مهمة تطبّقها في عملك.</p>`}
          ${askName ? `
          <form class="stack" id="nameForm" style="gap:6px">
            <label class="small" for="heroName">ما اسمك؟ يظهر في سجل تعلّمك الذي ترسله إلى المدرب.</label>
            <div class="hero-name">
              <input class="input" id="heroName" placeholder="الاسم" autocomplete="given-name" maxlength="60">
              <button class="btn on-hero" type="submit">حفظ</button>
            </div>
          </form>` : ''}
          ${next ? `<a class="btn hero-btn" href="${next.href}">${esc(next.label)} ${icon('next')}</a>
          <p class="small hero-sub">${esc(next.sub)}</p>` : ''}
        </section>
        <div class="stack">${cards || `<div class="card empty">${icon('check')}<p>لا شيء مطلوب الآن. أحسنت!</p></div>`}</div>
      </div>`;
    const nameForm = $('#nameForm');
    if (nameForm) nameForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#heroName').value.trim().slice(0, 60);
      if (!name) { $('#heroName').focus(); return; }
      S.profile.name = name;
      save();
      render();
    });
  }

  // Listening check runner (entry and exit forms). Test conditions: two plays per item, no feedback until the end.
  function lcRunner(host, form, done) {
    const items = P.listeningCheck[form].map((it, i) => {
      if (it.t === 'price') return { ...it, text: priceWords(it.amount) };
      const rand = rng(hash(form + ':' + i));
      const options = shuffle(it.options, rand);
      return { ...it, options, correct: options.indexOf(it.options[0]) };
    });
    let idx = 0, plays = 0, answered = false;
    const answers = [];
    function draw() {
      stopAll();
      const it = items[idx];
      plays = 0;
      answered = false;
      const part = it.t === 'price' ? 'الجزء أ: اكتب السعر الذي تسمعه (بالريال)' : 'الجزء ب: ماذا يريد العميل؟';
      host.innerHTML = `
        <div class="stack">
          <div class="activity-head">${progressBar(pct(idx, items.length))}<span class="counter num">${idx + 1} / ${items.length}</span></div>
          <p class="muted small">${part}</p>
          <div class="card prompt-card stack">
            <button class="big-play" type="button" data-act="play" aria-label="استمع">${icon('play')}</button>
            <p class="muted small" id="playsLeft">اضغط للاستماع. يمكنك الاستماع مرتين.</p>
          </div>
          ${it.t === 'price'
            ? `<input class="num-input" id="ans" inputmode="decimal" autocomplete="off" placeholder="0.00" aria-label="السعر">
               <button class="btn block" type="button" data-act="submit">التالي</button>`
            : optionButtons(it.options, false)}
          <button class="btn ghost small" type="button" data-act="skip" style="align-self:center">لا أعرف</button>
        </div>`;
      toTop();
      $('[data-act="play"]', host).addEventListener('click', play);
      if (it.t === 'price') {
        const submit = () => {
          const v = parsePrice($('#ans', host).value);
          if (v == null) { toast('اكتب السعر بالأرقام، مثل 47.75'); return; }
          record(v);
        };
        $('[data-act="submit"]', host).addEventListener('click', submit);
        $('#ans', host).addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
      } else {
        $$('.option', host).forEach(b => b.addEventListener('click', () => record(+b.dataset.opt)));
      }
      // "Don't know" is recorded as a wrong answer with no response, rather than a guess.
      $('[data-act="skip"]', host).addEventListener('click', () => record(null));
      // No automatic play: the learner starts each item when ready, and both plays are theirs.
    }
    async function play() {
      const btn = $('[data-act="play"]', host);
      if (!btn || plays >= 2) return;
      plays++;
      btn.classList.add('playing');
      $('#playsLeft', host).textContent = plays >= 2 ? 'انتهت مرات الاستماع' : 'يمكنك الاستماع مرة أخرى';
      await say(items[idx].text || items[idx].en, 'c');
      if (btn.isConnected) { btn.classList.remove('playing'); if (plays >= 2) btn.disabled = true; }
    }
    function record(ans) {
      if (answered) return;
      answered = true;
      guardLeave('لم تُنهِ اختبار الاستماع بعد، وستضيع إجاباتك. هل تريد الخروج؟');
      const it = items[idx];
      const ok = ans !== null && (it.t === 'price' ? ans === it.amount : ans === it.correct);
      answers.push({ t: it.t, plo: it.plo, ok, ans: ans === null ? null : it.t === 'price' ? ans : (it.options[ans] || null) });
      idx++;
      if (idx < items.length) draw(); else finish();
    }
    function finish() {
      stopAll();
      releaseLeave();
      const score = answers.filter(a => a.ok).length;
      const partA = answers.filter(a => a.t === 'price');
      const partB = answers.filter(a => a.t !== 'price');
      S.lc[form] = {
        score, total: answers.length, at: Date.now(),
        partA: partA.filter(a => a.ok).length, partATotal: partA.length,
        partB: partB.filter(a => a.ok).length, partBTotal: partB.length,
        answers
      };
      save();
      const prev = form === 'exit' && S.lc.entry ? S.lc.entry : null;
      host.innerHTML = `
        <div class="stack-lg">
          <div class="card stack center">
            <p class="muted">نتيجتك</p>
            ${scoreRing(pct(score, answers.length), `${score}/${answers.length}`)}
            <p>الأسعار: ${S.lc[form].partA}/${partA.length} · فهم الطلبات: ${S.lc[form].partB}/${partB.length}</p>
            ${prev ? `<p class="pill ${score >= prev.score ? 'good' : 'amber'}">في البداية: ${prev.score}/${prev.total}</p>` : ''}
          </div>
          <button class="btn block" type="button" data-act="done">متابعة</button>
        </div>`;
      toTop();
      $('[data-act="done"]', host).addEventListener('click', done);
    }
    draw();
  }

  // =====================================================================
  // Views: Units, outcomes, unit page
  // =====================================================================
  function viewUnits() {
    setBar('الوحدات', `${P.meta.weeks} أسابيع · ${P.meta.hours} ساعة`);
    const wk = currentWeek();
    view.innerHTML = `
      <div class="stack-lg">
        <a class="card unit-card" href="#/outcomes">
          <span class="unit-badge">${icon('flag')}</span>
          <span class="grow"><strong>ماذا ستتعلم؟</strong><br><span class="muted small">ما ستستطيع فعله في نهاية البرنامج، وكيف يُقيَّم</span></span>
          <span class="chev">${icon('next')}</span>
        </a>
        ${S.lc.entry ? '' : `
        <a class="card unit-card" href="#/lc/entry">
          <span class="unit-badge">${icon('headphones')}</span>
          <span class="grow"><strong>اختبار الاستماع الأولي</strong><br><span class="muted small">10 أسئلة قصيرة لقياس نقطة البداية</span></span>
          <span class="chev">${icon('next')}</span>
        </a>`}
        <div class="stack">
          ${UNITS.map((u, i) => {
            const done = unitPassed(u.id);
            const best = checkBest(u.id);
            const now = u.week === wk;
            return `
            <a class="card unit-card ${now ? 'current' : ''}" href="#/unit/${u.id}">
              <span class="unit-badge ${done ? 'done' : ''}">${done ? icon('check') : icon(u.icon)}</span>
              <span class="grow stack" style="gap:4px">
                <span class="unit-meta"><span class="muted small">الوحدة ${i + 1} · الأسبوع ${u.week}</span>${now ? '<span class="pill tag">هذا الأسبوع</span>' : ''}</span>
                <strong>${esc(u.title.ar)}</strong>
                ${progressBar(pct(unitStepsDone(u.id), STEPS.length), `تقدّم الوحدة ${i + 1}`)}
                <span class="muted small">${unitStepsDone(u.id)}/${STEPS.length} خطوات${best != null ? ` · اختبار الوحدة ${best}%` : ''}</span>
              </span>
              <span class="chev">${icon('next')}</span>
            </a>`;
          }).join('')}
        </div>
        <a class="card unit-card" href="#/final">
          <span class="unit-badge">${icon('award')}</span>
          <span class="grow"><strong>التقييم الختامي</strong><br><span class="muted small">الأسبوع ${P.meta.weeks}: اختبار الاستماع والاستبانة ولعب الأدوار مع المدربين</span></span>
          <span class="chev">${icon('next')}</span>
        </a>
      </div>`;
  }

  function viewOutcomes() {
    setBar('ماذا ستتعلم؟', 'في نهاية البرنامج');
    const howAssessed = o => {
      const ways = [];
      if (P.assessments.some(a => a.summative && a.type === 'performance' && a.plos.includes(o.id))) ways.push('لعب أدوار مع المدربين في الأسبوع ' + P.meta.weeks);
      if (P.assessments.some(a => a.summative && a.type === 'objective' && a.plos.includes(o.id))) ways.push('اختبار الاستماع');
      return ways.join('، و');
    };
    view.innerHTML = `
      <div class="stack-lg">
        <p class="muted">في نهاية البرنامج ستستطيع أن تفعل ما يلي بالإنجليزية مع عملائك:</p>
        ${P.outcomes.map(o => {
          const units = UNITS.filter(u => u.plos.includes(o.id)).map(u => unitIndex(u.id) + 1);
          return `
          <div class="card stack">
            <div class="row" style="align-items:flex-start">${icon('check', 'row-ico')}<strong class="grow">${esc(o.can ? o.can.ar : o.ar)}</strong></div>
            <p class="small muted">تتدرب عليه في ${units.length > 1 ? 'الوحدات' : 'الوحدة'} ${units.join('، ')}</p>
            <p class="small muted">يُقيَّم في: ${esc(howAssessed(o))}</p>
          </div>`;
        }).join('')}
      </div>`;
  }

  function viewUnit({ u }) {
    const unit = unitById(u);
    if (!unit) { redirect('#/units'); return; }
    const i = unitIndex(u);
    setBar(`الوحدة ${i + 1}`, unit.title.ar);
    const best = checkBest(u);
    const isDone = st => stepComplete(u, st.id);
    const doneCount = STEPS.filter(isDone).length;
    const nextS = STEPS.find(st => !isDone(st));
    view.innerHTML = `
      <div class="stack-lg">
        <section class="hero stack">
          <p class="small">الوحدة ${i + 1} · الأسبوع ${unit.week}</p>
          <h2>${esc(unit.title.ar)}</h2>
          ${progressBar(pct(doneCount, STEPS.length), 'تقدّم الوحدة')}
          ${nextS
            ? `<a class="btn hero-btn" href="#/unit/${u}/${nextS.id}">${doneCount ? 'تابع' : 'ابدأ'}: ${esc(nextS.ar)} ${icon('next')}</a>`
            : `<p class="small">${icon('check', 'inline-ico')} أكملت كل خطوات الوحدة</p>`}
        </section>
        <ol class="tl" aria-label="خطوات الوحدة">
          ${STEPS.map((st, n) => {
            const done = isDone(st);
            const cur = nextS && st.id === nextS.id;
            const extra = st.id === 'check' && best != null ? ` · أفضل نتيجة ${best}%` : '';
            const time = st.min ? ` · ${st.min}&nbsp;د` : ' · في العمل'; // the unit stays with its number
            return `
            <li class="${done ? 'done' : ''}">
              <a class="step ${done ? 'done' : ''} ${cur ? 'current' : ''}" href="#/unit/${u}/${st.id}">
                <span class="ico">${done ? icon('check') : icon(st.icon)}</span>
                <span class="grow">
                  <span class="title">${n + 1}. ${esc(st.ar)}</span><span class="sr-only">${done ? '، أنجزتها' : cur ? '، الخطوة التالية' : ''}</span><br>
                  <span class="strand">${esc(st.hint)}${time}${extra}</span>
                </span>
                <span class="chev">${icon('next')}</span>
              </a>
            </li>`;
          }).join('')}
        </ol>
        <details class="acc">
          <summary>أهداف الوحدة <span class="chev">${icon('down')}</span></summary>
          <div class="acc-body">
            <ul class="outcomes">${unit.objectives.map(o => `<li>${icon('check')}<span>${esc(o.ar)}</span></li>`).join('')}</ul>
          </div>
        </details>
        <div class="note stack" style="gap:6px"><strong>انتبه</strong>${unit.watchOut.note ? `<p class="small">${rich(unit.watchOut.note)}</p>` : ''}${watchList(unit.watchOut.items)}</div>
      </div>`;
  }

  // =====================================================================
  // Unit steps
  // =====================================================================
  function viewStep({ u, step }) {
    const unit = unitById(u);
    const sIdx = STEPS.findIndex(s => s.id === step);
    if (!unit || sIdx < 0) { redirect('#/units'); return; }
    const s = STEPS[sIdx];
    setBar(s.ar, `الوحدة ${unitIndex(u) + 1}: ${unit.title.ar}`);
    view.innerHTML = `
      <div class="stack-lg">
        <div class="step-progress" role="img" aria-label="الخطوة ${sIdx + 1} من ${STEPS.length}، أنجزت ${STEPS.filter(x => stepComplete(u, x.id)).length} من ${STEPS.length}">
          ${STEPS.map((x, n) => `<span class="${n === sIdx ? 'now' : ''} ${stepComplete(u, x.id) ? 'done' : ''}"></span>`).join('')}
        </div>
        <p class="small muted" style="margin-top:-8px">الخطوة ${sIdx + 1} من ${STEPS.length} · ${esc(s.hint)}</p>
        <div id="stepBody" class="stack-lg"></div>
      </div>`;
    const host = $('#stepBody');
    const next = STEPS[sIdx + 1];
    const nextBtn = () => next
      ? `<a class="btn block" href="#/unit/${u}/${next.id}">التالي: ${esc(next.ar)} ${icon('next')}</a>`
      : `<a class="btn block" href="#/unit/${u}">العودة إلى الوحدة</a>`;
    const ctx = { unit, u, host, nextBtn, step: s };
    ({ context: stepContext, model: stepModel, phrases: stepPhrases, listen: stepListen, build: stepBuild,
      roleplay: stepRoleplay, speed: stepSpeed, check: stepCheck, mission: stepMission })[step](ctx);
  }

  function stepContext({ unit, u, host }) {
    host.innerHTML = `
      <div class="card"><p>${rich(unit.context.ar)}</p></div>
      <h2 class="section">كلمات مهمة</h2>
      <div class="stack">
        ${unit.words.map(w => `
          <button class="phrase-btn" type="button" data-say="${esc(w.en)}" data-role="k">
            <span class="play">${icon('play')}</span>
            <span class="grow"><span class="say" lang="en" dir="ltr" style="display:block">${esc(w.en)}</span><span class="gloss">${esc(w.ar)}</span></span>
          </button>`).join('')}
      </div>
      <button class="btn block" type="button" data-act="done">فهمت، التالي ${icon('next')}</button>`;
    $('[data-act="done"]', host).addEventListener('click', () => { markStep(u, 'context'); go(`#/unit/${u}/model`); });
  }

  // Bubble header: who speaks, and what a tap does (hear the line, or show a hidden one).
  const bubbleHead = (s, ic = 'volume') => `<span class="b-head"><span class="speaker ${s}">${s === 'c' ? 'العميل' : 'أنت'}</span>${icon(ic, 'b-ico')}</span>`;
  function dialogueHtml(lines, stages, opts = {}) {
    let lastSt = null;
    return `<div class="dialogue">${lines.map((l, i) => {
      let chip = '';
      if (stages && l.st && l.st !== lastSt) {
        const st = stages.find(x => x.id === l.st);
        if (st) chip = `<div class="stage-chip">${esc(st.ar)}</div>`;
        lastSt = l.st;
      }
      const hide = opts.hideK && l.s === 'k';
      return `${chip}
        <button class="bubble ${l.s} ${hide ? 'hidden-line' : ''}" type="button" data-line="${i}" ${hide ? '' : `data-say="${esc(l.en)}" data-role="${l.s}"`}>
          ${bubbleHead(l.s, hide ? 'eye' : 'volume')}
          <span class="say" lang="en" dir="ltr" style="display:block">${esc(l.en)}</span>
          <span class="gloss">${esc(l.ar)}</span>
        </button>`;
    }).join('')}</div>`;
  }
  function wirePlayAll(root, lines) {
    const btn = $('[data-act="play-all"]', root);
    if (!btn) return;
    btn.addEventListener('click', async () => {
      if (btn.dataset.state === 'on') { stopAll(); return; }
      btn.dataset.state = 'on';
      btn.innerHTML = `${icon('stop')} إيقاف`;
      await playLines(lines, i => {
        $$('.bubble', root).forEach(b => b.classList.remove('active'));
        if (i >= 0) { const b = $(`.bubble[data-line="${i}"]`, root); if (b) { b.classList.add('active'); showEl(b); } }
      });
      $$('.bubble', root).forEach(b => b.classList.remove('active'));
      if (btn.isConnected) { btn.dataset.state = ''; btn.innerHTML = `${icon('play')} استمع للحوار كاملًا`; }
    });
  }

  function stepModel({ unit, u, host, nextBtn }) {
    const m = unit.model;
    TTS.scene(u + ':model');
    // One line from each stage of the conversation, in the order they were said.
    const picks = uniq(m.lines.map(l => l.st).filter(Boolean)).map(st => m.lines.find(l => l.st === st));
    let shuffled = shuffle(picks);
    for (let k = 0; k < 5 && shuffled.every((l, n) => l === picks[n]); k++) shuffled = shuffle(picks);
    // The learner first reads and hears the model. The ordering task then hides the text, so it
    // checks what they took in rather than what they can copy; the text comes back afterwards.
    host.innerHTML = `
      <div class="card stack">
        <h2 class="h-card">${esc(m.title.ar)}</h2>
        <p class="muted small">${esc(m.setting.ar)}</p>
        <p class="small" id="modelHint">استمع إلى الحوار واقرأه. ثم رتّب جمله دون النظر إلى النص.</p>
        <button class="btn" type="button" data-act="play-all">${icon('play')} استمع للحوار كاملًا</button>
      </div>
      <div id="modelText">${dialogueHtml(m.lines, unit.stages)}</div>
      <div class="card stack" id="orderTask" hidden>
        <h2 class="h-card">رتّب الحوار</h2>
        <p class="muted small">اضغط على الجمل بالترتيب الذي قيلت به.</p>
        <ol class="order-list" id="orderAnswer"></ol>
        <div class="options" id="orderChoices">
          ${shuffled.map(l => `
            <button class="option" type="button" data-pick="${picks.indexOf(l)}">
              <span class="speaker ${l.s}">${l.s === 'c' ? 'العميل' : 'أنت'}</span>
              <span class="say" lang="en" dir="ltr">${esc(l.en)}</span>
            </button>`).join('')}
        </div>
        <div id="orderFb"></div>
      </div>
      <div id="modelNext" class="action-bar"><button class="btn block" type="button" data-act="order">جاهز؟ رتّب الحوار ${icon('next')}</button></div>`;
    wirePlayAll(host, m.lines);
    $('[data-act="order"]', host).addEventListener('click', () => {
      stopAll();
      $('#modelText', host).hidden = true;
      $('#orderTask', host).hidden = false;
      $('#modelHint', host).textContent = 'رتّب جمل الحوار من الذاكرة. يمكنك أن تستمع إليه مرة أخرى.';
      $('#modelNext', host).innerHTML = '';
      toTop();
    });
    let pos = 0, mistakes = 0;
    $('#orderChoices', host).addEventListener('click', e => {
      const b = e.target.closest('[data-pick]');
      if (!b || b.disabled) return;
      guardLeave();
      if (+b.dataset.pick === pos) {
        const l = picks[pos];
        b.remove();
        $('#orderAnswer', host).insertAdjacentHTML('beforeend', `<li><span class="say" lang="en" dir="ltr">${esc(l.en)}</span><span class="gloss">${esc(l.ar)}</span></li>`);
        $('#orderFb', host).innerHTML = '';
        pos++;
        if (pos === picks.length) {
          releaseLeave();
          markStep(u, 'model', pct(picks.length, picks.length + mistakes));
          $('#orderFb', host).innerHTML = feedback(true, 'أحسنت! رتّبت الحوار.', 'ستقول جملك بنفسك في خطوة لعب الأدوار.');
          $('#modelText', host).outerHTML = `
            <details class="acc" id="modelText">
              <summary>نص الحوار كاملًا <span class="chev">${icon('down')}</span></summary>
              <div class="acc-body">${dialogueHtml(m.lines, unit.stages)}</div>
            </details>`;
          $('#modelNext', host).innerHTML = nextBtn();
          showEl($('#orderFb', host));
        }
      } else {
        mistakes++;
        b.classList.add('shake');
        setTimeout(() => b.classList.remove('shake'), 400);
        $('#orderFb', host).innerHTML = feedback(false, 'ليست هذه الجملة التالية. استمع إلى الحوار مرة أخرى إن احتجت.');
        showEl($('#orderFb', host));
      }
    });
  }

  function phraseCard(p) {
    return `
      <div class="card stack">
        <div class="stack" style="gap:4px">
          <span class="speaker c">العميل يقول</span>
          <p class="say" lang="en" dir="ltr">${esc(p.c[0])}</p>
          <p class="say small muted" lang="en" dir="ltr" style="font-weight:500">${esc(p.c[1])}</p>
          <p class="gloss">${esc(p.cAr)}</p>
          <div class="row wrap">${audioBtns(p.c[0], 'c', false)}</div>
        </div>
        <hr style="border:0;border-top:1px solid var(--line);margin:4px 0">
        <div class="stack" style="gap:4px">
          <span class="speaker k">أنت تقول</span>
          <p class="say" lang="en" dir="ltr">${esc(p.k)}</p>
          <p class="gloss">${esc(p.kAr)}</p>
          <div class="row wrap">${audioBtns(p.k, 'k')}</div>
        </div>
        ${p.tip ? `<div class="note brand small"><strong>نصيحة:</strong> ${esc(p.tip.ar)}</div>` : ''}
      </div>`;
  }

  function stepPhrases({ unit, u, host, nextBtn }) {
    const list = unit.phrases;
    let i = 0;
    function draw() {
      stopAll();
      const p = list[i];
      host.innerHTML = `
        <div class="activity-head">${progressBar(pct(i, list.length))}<span class="counter num">${i + 1} / ${list.length}</span></div>
        ${i === 0 ? '<div class="note brand"><strong>طريقة التدريب:</strong> استمع إلى كل عبارة ثم كررها بصوت عالٍ. استخدم «ببطء» إذا احتجت.</div>' : ''}
        ${phraseCard(p)}
        <div class="action-bar"><div class="grid-2">
          <button class="btn ghost" type="button" data-act="prev" ${i === 0 ? 'disabled' : ''}>${icon('back')} السابق</button>
          <button class="btn" type="button" data-act="next">${i + 1 < list.length ? 'التالي' : 'إنهاء'} ${icon('next')}</button>
        </div></div>`;
      toTop();
      $('[data-act="prev"]', host).addEventListener('click', () => { if (i > 0) { i--; draw(); } });
      $('[data-act="next"]', host).addEventListener('click', () => { i++; if (i < list.length) draw(); else finish(); });
      say(p.c[0], 'c');
    }
    function finish() {
      stopAll();
      srsAdd(list.map(p => p.id));
      markStep(u, 'phrases');
      host.innerHTML = `
        <div class="card stack center">
          <div class="empty" style="padding:4px;color:var(--good)">${icon('check')}</div>
          <h2 class="h-card">أحسنت! تدربت على ${countAr(list.length, W.phraseGen)}.</h2>
          <p class="muted small">أُضيفت إلى مراجعتك اليومية لتراها مرة أخرى في الوقت المناسب.</p>
        </div>
        <button class="btn ghost block" type="button" data-act="again">${icon('refresh')} من البداية</button>
        ${nextBtn()}`;
      toTop();
      $('[data-act="again"]', host).addEventListener('click', () => { i = 0; draw(); });
    }
    draw();
  }

  // Generic quiz runner used by "Understand the customer" and the unit check.
  function runQuiz(host, items, { showText = 'toggle', onFinish, title }) {
    let idx = 0;
    const results = [];
    function draw() {
      stopAll();
      const it = items[idx];
      let body;
      if (it.t === 'price') {
        body = `
          <div class="card prompt-card stack">
            <button class="big-play" type="button" data-act="play" aria-label="استمع">${icon('play')}</button>
            <p class="muted small">اكتب السعر الذي تسمعه (بالريال)</p>
          </div>
          <input class="num-input" id="ans" inputmode="decimal" autocomplete="off" placeholder="0.00" aria-label="السعر">
          <button class="btn block" type="button" data-act="submit">تحقق</button>`;
      } else {
        const prompt = it.t === 'meaning' ? 'استمع: ماذا يقصد العميل؟' : 'العميل يقول… ماذا ترد؟';
        // The "show text" toggle shares a line with the prompt so four options fit on small phones.
        const toggle = it.t !== 'respond' && showText === 'toggle';
        body = `
          <div class="card prompt-card stack">
            <button class="big-play" type="button" data-act="play" aria-label="استمع">${icon('play')}</button>
            ${toggle ? `<div class="prompt-row"><p class="muted small">ماذا يقصد العميل؟</p><button class="btn ghost small" type="button" data-act="show">${icon('eye')} إظهار النص</button></div>
              <p class="say" lang="en" dir="ltr" id="hiddenText" hidden>${esc(it.text)}</p>`
              : `<p class="muted small">${prompt}</p>`}
            ${it.t === 'respond' ? `<p class="say big" lang="en" dir="ltr">${esc(it.text)}</p>` : ''}
          </div>
          ${optionButtons(it.options, it.t === 'respond')}`;
      }
      host.innerHTML = `
        <div class="stack">
          ${title ? `<h2 class="h-card">${title}</h2>` : ''}
          <div class="activity-head">${progressBar(pct(idx, items.length))}<span class="counter num">${idx + 1} / ${items.length}</span></div>
          ${body}
          <div id="qfb"></div>
          <div id="qnext" class="action-bar"></div>
        </div>`;
      toTop();
      const playBtn = $('[data-act="play"]', host);
      const play = async () => { playBtn.classList.add('playing'); await say(it.text, it.t === 'price' ? 'c' : it.role); if (playBtn.isConnected) playBtn.classList.remove('playing'); };
      playBtn.addEventListener('click', play);
      const show = $('[data-act="show"]', host);
      if (show) show.addEventListener('click', () => { $('#hiddenText', host).hidden = false; show.remove(); });
      if (it.t === 'price') {
        const submit = () => {
          const v = parsePrice($('#ans', host).value);
          if (v == null) { toast('اكتب رقمًا'); return; }
          answer(v === it.amount, v);
        };
        $('[data-act="submit"]', host).addEventListener('click', submit);
        $('#ans', host).addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
      } else {
        $$('.option', host).forEach(b => b.addEventListener('click', () => {
          const i = +b.dataset.opt;
          markOptions(host, i, it.correct);
          answer(i === it.correct, i);
        }));
      }
      play();
    }
    function answer(ok, given) {
      const it = items[idx];
      results.push({ ok, it, given });
      guardLeave();
      let detail = '';
      if (it.t === 'price') {
        $('[data-act="submit"]', host).disabled = true;
        $('#ans', host).disabled = true;
        detail = `<span class="say" lang="en" dir="ltr" style="display:block">${esc(fmtPrice(it.amount))} — ${esc(priceWords(it.amount))}</span>`;
      } else {
        detail = `<span class="say" lang="en" dir="ltr" style="display:block">${esc(it.text)}</span>` +
          (it.t === 'respond' ? `<span class="gloss">${esc(it.phrase.kAr)}</span>` : `<span class="gloss">${esc(it.phrase.cAr)}</span>`);
      }
      $('#qfb', host).innerHTML = feedback(ok, ok ? 'صحيح!' : 'ليست هذه الإجابة.', detail);
      $('#qnext', host).innerHTML = `<button class="btn block" type="button" data-act="next">${idx + 1 < items.length ? 'التالي' : 'النتيجة'} ${icon('next')}</button>`;
      $('[data-act="next"]', host).addEventListener('click', () => { idx++; if (idx < items.length) draw(); else { releaseLeave(); onFinish(results); toTop(); } });
      $('[data-act="next"]', host).focus({ preventScroll: true });
      showEl($('#qfb', host));
    }
    draw();
  }

  function stepListen({ unit, u, host, nextBtn }) {
    function start() {
      const items = shuffle(unit.phrases).slice(0, 8).map(p => makeMeaningItem(p));
      runQuiz(host, items, {
        onFinish(results) {
          const score = pct(results.filter(r => r.ok).length, results.length);
          markStep(u, 'listen', score);
          host.innerHTML = `
            <div class="card stack center">
              <p class="muted">النتيجة</p>
              ${scoreRing(score, `${results.filter(r => r.ok).length}/${results.length}`, score >= 75 ? 'good' : 'amber')}
              <p>${score >= 75 ? 'فهمٌ ممتاز للعميل!' : 'استمع إلى العبارات مرة أخرى ثم أعد المحاولة.'}</p>
            </div>
            <button class="btn ghost block" type="button" data-act="again">${icon('refresh')} أعد المحاولة</button>
            ${nextBtn()}`;
          $('[data-act="again"]', host).addEventListener('click', start);
        }
      });
    }
    start();
  }

  // Joint construction: choose each of your turns, with support.
  function stepBuild({ unit, u, host, nextBtn }) {
    const lines = unit.roleplay.lines;
    TTS.scene(u + ':roleplay');
    let idx = 0, mistakes = 0, turns = 0;
    host.innerHTML = `
      <div class="card stack">
        <h2 class="h-card">${esc(unit.roleplay.title.ar)}</h2>
        <p class="muted small">${esc(unit.roleplay.setting.ar)} — ابنِ الحوار معنا: في كل دور لك، اختر الجملة المناسبة.</p>
      </div>
      <div class="dialogue" id="built"></div>
      <div id="choice"></div>
      <div id="buildEnd"></div>`;
    const built = $('#built', host);
    const addBubble = l => {
      built.insertAdjacentHTML('beforeend', `
        <button class="bubble ${l.s}" type="button" data-say="${esc(l.en)}" data-role="${l.s}">
          ${bubbleHead(l.s)}
          <span class="say" lang="en" dir="ltr" style="display:block">${esc(l.en)}</span>
          <span class="gloss">${esc(l.ar)}</span>
        </button>`);
      showEl(built.lastElementChild);
    };
    async function advance() {
      const custLines = [];
      while (idx < lines.length && lines[idx].s === 'c') { addBubble(lines[idx]); custLines.push(lines[idx]); idx++; }
      if (idx >= lines.length) { finish(); playLines(custLines); return; }
      const line = lines[idx];
      turns++;
      const opts = shuffle([line.en, ...respDistractors(line.en, line.f, unit.id, 2)]);
      const correct = opts.indexOf(line.en);
      $('#choice', host).innerHTML = `
        <div class="card stack">
          <p class="small muted">دورك: اختر ما تقوله</p>
          ${optionButtons(opts, true)}
          <div id="bfb"></div>
        </div>`;
      showEl($('#choice .card', host));
      $$('#choice .option', host).forEach(b => b.addEventListener('click', () => {
        const i = +b.dataset.opt;
        guardLeave();
        if (i === correct) {
          $('#choice', host).innerHTML = '';
          addBubble(line);
          idx++;
          say(line.en, 'k').then(() => { if (host.isConnected) advance(); });
        } else {
          mistakes++;
          b.classList.add('wrong');
          b.disabled = true;
          $('#bfb', host).innerHTML = feedback(false, 'ليست الأنسب هنا. جرّب مرة أخرى.', `تلميح: ${esc(line.ar)}`);
          showEl($('#bfb', host));
        }
      }));
      if (custLines.length) await playLines(custLines);
    }
    function finish() {
      releaseLeave();
      const score = pct(turns, turns + mistakes);
      markStep(u, 'build', score);
      $('#choice', host).innerHTML = '';
      $('#buildEnd', host).innerHTML = `
        <div class="stack">
          ${feedback(true, 'بنيت الحوار كاملًا!', 'في الخطوة التالية ستقوله بنفسك دون خيارات.')}
          <button class="btn ghost block" type="button" data-act="play-all">${icon('play')} استمع للحوار كاملًا</button>
          ${nextBtn()}
        </div>`;
      wirePlayAll(host, lines);
      showEl($('#buildEnd', host));
    }
    advance();
  }

  // Independent construction: say your turns with only an Arabic cue.
  function stepRoleplay({ unit, u, host, nextBtn }) {
    const lines = unit.roleplay.lines;
    TTS.scene(u + ':roleplay');
    const kTurns = lines.filter(l => l.s === 'k').length;
    let idx = 0, said = 0, micDisabled = false;
    host.innerHTML = `
      <div class="card stack">
        <h2 class="h-card">${esc(unit.roleplay.title.ar)}</h2>
        <p class="muted small">الآن دون خيارات: يتكلم العميل، وتقول أنت جملتك بالإنجليزية. ${micOn() ? 'اضغط الميكروفون وتكلم.' : 'قلها بصوت عالٍ ثم أظهر الإجابة.'}</p>
      </div>
      <div class="dialogue" id="rpLog"></div>
      <div id="turn"></div>`;
    const log = $('#rpLog', host);
    const addBubble = l => {
      log.insertAdjacentHTML('beforeend', `
        <button class="bubble ${l.s}" type="button" data-say="${esc(l.en)}" data-role="${l.s}">
          ${bubbleHead(l.s)}
          <span class="say" lang="en" dir="ltr" style="display:block">${esc(l.en)}</span>
        </button>`);
      showEl(log.lastElementChild);
    };
    async function advance() {
      const turnBox = $('#turn', host);
      if (!turnBox) return;
      turnBox.innerHTML = '';
      while (idx < lines.length && lines[idx].s === 'c') {
        const l = lines[idx];
        addBubble(l);
        idx++;
        await say(l.en, 'c');
        if (!host.isConnected) return;
      }
      if (idx >= lines.length) { finish(); return; }
      const line = lines[idx];
      const words = line.en.split(' ');
      turnBox.innerHTML = `
        <div class="card stack">
          <p class="small muted">دورك. قل بالإنجليزية:</p>
          <p class="prompt-ar" style="font-size:1.08rem;font-weight:600">${esc(line.ar)}</p>
          ${micOn() && !micDisabled ? `<button class="mic-btn" type="button" data-act="mic" aria-label="تكلم">${icon('mic')}</button><p class="heard" id="heard" aria-live="polite"></p>` : ''}
          <div class="row wrap" style="justify-content:center">
            <button class="btn ghost small" type="button" data-act="hint">${icon('eye')} تلميح</button>
            <button class="btn soft small" type="button" data-act="reveal">أظهر الإجابة</button>
          </div>
          <p class="say small muted" lang="en" dir="ltr" id="hint" hidden>${esc(words.slice(0, 2).join(' '))} …</p>
          <div id="rpfb"></div>
        </div>`;
      showEl($('.card', turnBox));
      $('[data-act="hint"]', turnBox).addEventListener('click', e => { $('#hint', turnBox).hidden = false; e.currentTarget.remove(); });
      $('[data-act="reveal"]', turnBox).addEventListener('click', () => reveal(line, null));
      const mic = $('[data-act="mic"]', turnBox);
      if (mic) mic.addEventListener('click', () => listenFor(line, mic));
    }
    async function listenFor(line, btn) {
      if (btn.classList.contains('listening')) { Mic.stop(); return; }
      btn.classList.add('listening');
      $('#heard', host).textContent = 'أستمع…';
      try {
        const alts = await Mic.listen();
        if (!btn.isConnected) return; // the turn moved on while listening
        btn.classList.remove('listening');
        if (!alts.length) { $('#heard', host).textContent = 'لم أسمع شيئًا. حاول مرة أخرى.'; return; }
        const r = compareSpeech(line.en, alts);
        $('#heard', host).textContent = `سمعت: “${r.heard}”`;
        if (r.score >= 0.75) reveal(line, true);
        else {
          const marked = r.words.map((w, i) => r.marks[i] ? esc(w) : `<mark>${esc(w)}</mark>`).join(' ');
          $('#rpfb', host).innerHTML = feedback(false, r.score >= 0.5 ? 'قريب! حاول مرة أخرى.' : 'حاول مرة أخرى، أو اضغط «تلميح».',
            r.score >= 0.5 ? `<span class="say small" lang="en" dir="ltr" style="display:block">${marked}</span>` : '');
          showEl($('#rpfb', host));
        }
      } catch (err) {
        btn.classList.remove('listening');
        if (!btn.isConnected || err === 'aborted') return; // stopped on purpose
        const msg = err === 'not-allowed' || err === 'service-not-allowed' ? 'اسمح للمتصفح باستخدام الميكروفون، أو تابع دونه.'
          : err === 'network' ? 'التعرّف على الصوت يحتاج إلى اتصال بالإنترنت.'
          : err === 'no-speech' ? 'لم أسمع شيئًا. حاول مرة أخرى.' : 'تعذّر استخدام الميكروفون.';
        if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'network' || err === 'unsupported') { micDisabled = true; btn.remove(); }
        const heard = $('#heard', host);
        if (heard) heard.textContent = msg; else toast(msg);
      }
    }
    async function reveal(line, ok) {
      Mic.stop();
      guardLeave();
      const turnBox = $('#turn', host);
      if (ok) said++;
      addBubble(line);
      idx++;
      if (ok) {
        turnBox.innerHTML = feedback(true, 'ممتاز! قلتها بشكل صحيح.');
        showEl(turnBox);
        await say(line.en, 'k');
        if (host.isConnected) advance();
        return;
      }
      turnBox.innerHTML = `
        <div class="card stack">
          <p class="small muted">هذه الجملة النموذجية. هل قلتها هكذا تقريبًا؟</p>
          <div class="row wrap" style="justify-content:center">
            <button class="btn small" type="button" data-act="yes">${icon('check')} نعم</button>
            <button class="btn ghost small" type="button" data-act="no">أحتاج تدريبًا</button>
          </div>
        </div>`;
      showEl(turnBox);
      say(line.en, 'k');
      $('[data-act="yes"]', turnBox).addEventListener('click', () => { said++; advance(); });
      $('[data-act="no"]', turnBox).addEventListener('click', () => advance());
    }
    function finish() {
      releaseLeave();
      const score = pct(said, kTurns);
      markStep(u, 'roleplay', score);
      $('#turn', host).innerHTML = `
        <div class="stack">
          ${feedback(true, `انتهى الحوار! قلت ${said} من ${kTurns} جمل بشكل صحيح.`, 'كرره مع زميل في الورشة أو في استراحة العمل.')}
          <button class="btn ghost block" type="button" data-act="again">${icon('refresh')} من البداية</button>
          ${nextBtn()}
        </div>`;
      showEl($('#turn', host));
      $('[data-act="again"]', host).addEventListener('click', () => { toTop(); stepRoleplay({ unit, u, host, nextBtn }); });
    }
    advance();
  }

  // Fluency: 60 seconds with familiar material, two choices, fast.
  function stepSpeed({ unit, u, host, nextBtn }) {
    const key = 'speed-' + u;
    const usable = p => !p.noR;
    const current = unit.phrases.filter(usable);
    const earlier = UNITS.slice(0, unitIndex(u)).flatMap(x => x.phrases).filter(usable);
    function intro() {
      host.innerHTML = `
        <div class="card stack center">
          <div class="empty" style="padding:8px">${icon('bolt')}</div>
          <h2 class="h-card">60 ثانية</h2>
          <p>اقرأ ما يقوله العميل واختر ردك بأسرع ما يمكن. العبارات مألوفة لك، والهدف هو السرعة والطلاقة.</p>
          ${S.best[key] ? `<p class="pill good">أفضل نتيجة: ${S.best[key]}</p>` : ''}
          <button class="btn block" type="button" data-act="go">ابدأ</button>
        </div>`;
      $('[data-act="go"]', host).addEventListener('click', run);
    }
    function run() {
      const total = 60;
      const t0 = Date.now();
      guardLeave('جولة السرعة لم تنتهِ بعد. هل تريد الخروج؟');
      let score = 0, answered = 0, item;
      host.innerHTML = `
        <div class="stack">
          <div class="activity-head">${progressBar(100, 'الوقت المتبقي')}<span class="counter num" id="tleft">60</span></div>
          <div class="card prompt-card"><p class="say big" lang="en" dir="ltr" id="sq"></p></div>
          <div id="sopts"></div>
          <p class="center muted">النقاط: <span class="num" id="sscore">0</span></p>
        </div>`;
      toTop();
      const bar = $('.progress > span', host);
      function nextItem() {
        const p = earlier.length && Math.random() < 0.3 ? pick(earlier) : pick(current);
        const wrong = respDistractors(p.k, p.f, p.unit, 1)[0];
        const options = shuffle([p.k, wrong]);
        item = { correct: options.indexOf(p.k) };
        $('#sq', host).textContent = pick(p.c);
        $('#sopts', host).innerHTML = optionButtons(options, true);
        $$('#sopts .option', host).forEach(b => b.addEventListener('click', () => {
          const ok = +b.dataset.opt === item.correct;
          answered++;
          if (ok) score++;
          b.classList.add(ok ? 'correct' : 'wrong');
          $('#sscore', host).textContent = score;
          $$('#sopts .option', host).forEach(x => { x.disabled = true; });
          setTimeout(() => { if (host.isConnected && Date.now() - t0 < total * 1000) nextItem(); }, ok ? 180 : 450);
        }));
      }
      nextItem();
      const timer = setInterval(() => {
        const left = Math.max(0, total - (Date.now() - t0) / 1000);
        bar.style.width = (100 * left) / total + '%';
        $('#tleft', host).textContent = Math.ceil(left);
        if (left <= 0) { clearInterval(timer); end(score, answered); }
      }, 200);
      onLeave(() => clearInterval(timer));
    }
    function end(score, answered) {
      releaseLeave();
      const best = Math.max(S.best[key] || 0, score);
      const isBest = score > (S.best[key] || 0);
      S.best[key] = best;
      markStep(u, 'speed', score);
      host.innerHTML = `
        <div class="card stack center">
          <p class="muted">إجابات صحيحة في دقيقة</p>
          <div class="big-num">${score}</div>
          <p class="muted small">من ${answered} محاولة</p>
          ${isBest ? '<p class="pill good">رقم قياسي جديد!</p>' : `<p class="pill">أفضل نتيجة: ${best}</p>`}
        </div>
        <button class="btn ghost block" type="button" data-act="again">${icon('refresh')} جولة أخرى</button>
        ${nextBtn()}`;
      toTop();
      $('[data-act="again"]', host).addEventListener('click', run);
    }
    intro();
  }

  function stepCheck({ unit, u, host, nextBtn }) {
    const priceCount = unit.plos.includes('PLO4') ? (u === 'u4' ? 3 : 2) : 0;
    function start() {
      const ps = shuffle(unit.phrases);
      const respond = ps.filter(p => !p.noR).slice(0, 5 - priceCount);
      const meaning = ps.filter(p => !respond.includes(p)).slice(0, 5);
      const items = [];
      meaning.forEach(p => items.push(makeMeaningItem(p)));
      respond.forEach(p => items.push(makeRespondItem(p)));
      for (let k = 0; k < priceCount; k++) items.push(makePriceItem(randomPrice()));
      runQuiz(host, shuffle(items), { showText: 'none', onFinish: finish });
    }
    function finish(results) {
      const correct = results.filter(r => r.ok).length;
      const score = pct(correct, results.length);
      const passed = score >= P.meta.passMark;
      S.checks[u] = (S.checks[u] || []).concat([{ pct: score, at: Date.now() }]);
      if (passed) markStep(u, 'check', score); else save();
      const wrong = results.filter(r => !r.ok);
      const pulse = S.pulses[u] || {};
      // The next action comes straight after the score: move on after a pass; after a
      // fail, review the phrases or retake. Mistakes and the optional pulse follow.
      host.innerHTML = `
        <div class="card stack center">
          <p class="muted">نتيجة اختبار الوحدة</p>
          ${scoreRing(score, `${score}%`, passed ? 'good' : 'amber')}
          <p class="pill ${passed ? 'good' : 'amber'}">${passed ? 'اجتزت الوحدة!' : `تحتاج ${P.meta.passMark}% لاجتياز الوحدة`}</p>
        </div>
        <div class="stack">
          ${passed ? nextBtn() : `<a class="btn block" href="#/unit/${u}/phrases">${icon('list')} راجع العبارات</a>`}
          <button class="btn ghost block" type="button" data-act="again">${icon('refresh')} أعد الاختبار</button>
        </div>
        ${wrong.length ? `
        <details class="acc">
          <summary>راجع الأخطاء (${wrong.length}) <span class="chev">${icon('down')}</span></summary>
          <div class="acc-body">${wrong.map(r => r.it.t === 'price'
            ? `<div class="card tight"><p class="say" lang="en" dir="ltr">${esc(fmtPrice(r.it.amount))} — ${esc(priceWords(r.it.amount))}</p></div>`
            : `<div class="card tight stack" style="gap:4px"><p class="say" lang="en" dir="ltr">${esc(r.it.text)}</p>
                ${r.it.t === 'respond' ? `<p class="say small" lang="en" dir="ltr" style="color:var(--good)">${esc(r.it.phrase.k)}</p>` : ''}
                <p class="gloss">${esc(r.it.t === 'respond' ? r.it.phrase.kAr : r.it.phrase.cAr)}</p></div>`).join('')}</div>
        </details>` : ''}
        <div class="card stack">
          <h2 class="h-card">رأيك في الوحدة</h2>
          <p class="small">ما مدى فائدة هذه الوحدة لعملك؟</p>
          <div class="scale" id="pUseful">${[1, 2, 3, 4, 5].map(v => `<label><input type="radio" name="useful" value="${v}" ${pulse.useful === v ? 'checked' : ''}><span class="num">${v}</span></label>`).join('')}</div>
          <p class="muted small" style="display:flex;justify-content:space-between"><span>قليلة</span><span>كبيرة جدًا</span></p>
          <p class="small">مستوى الصعوبة:</p>
          <div class="scale">${[['easy', 'سهلة جدًا'], ['right', 'مناسبة'], ['hard', 'صعبة جدًا']].map(([v, l]) => `<label><input type="radio" name="level" value="${v}" ${pulse.level === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>
          <label class="field">تعليق (اختياري)<textarea class="input" id="pComment" rows="2">${esc(pulse.comment || '')}</textarea></label>
          <button class="btn soft" type="button" data-act="pulse">إرسال الرأي</button>
        </div>`;
      $('[data-act="again"]', host).addEventListener('click', start);
      $('[data-act="pulse"]', host).addEventListener('click', e => {
        const useful = $('input[name="useful"]:checked', host);
        const level = $('input[name="level"]:checked', host);
        if (!useful || !level) { toast('اختر الفائدة والصعوبة من فضلك'); return; }
        S.pulses[u] = { useful: +useful.value, level: level.value, comment: $('#pComment', host).value.trim().slice(0, 500), at: Date.now() };
        save();
        e.currentTarget.disabled = true;
        e.currentTarget.textContent = 'شكرًا لرأيك';
      });
    }
    host.innerHTML = `
      <div class="card stack">
        <h2 class="h-card">اختبار الوحدة</h2>
        <p>10 أسئلة: فهم العميل واختيار الرد المناسب${priceCount ? ' وكتابة الأسعار' : ''}. تحتاج ${P.meta.passMark}% لاجتياز الوحدة، ويمكنك الإعادة.</p>
        <p class="muted small">هذا اختبار للتدريب يساعدك على معرفة مستواك. أما التحدث فيقيّمه المدربون في لعب الأدوار.</p>
        ${checkBest(u) != null ? `<p class="pill">أفضل نتيجة سابقة: ${checkBest(u)}%</p>` : ''}
        <button class="btn block" type="button" data-act="start">ابدأ</button>
      </div>`;
    $('[data-act="start"]', host).addEventListener('click', start);
  }

  function stepMission({ unit, u, host }) {
    const m = S.missions[u];
    host.innerHTML = `
      <div class="card stack">
        <div class="row"><span class="unit-badge">${icon('briefcase')}</span><h2 class="h-card grow">مهمة هذا الأسبوع</h2></div>
        <p>${rich(unit.mission.ar)}</p>
        ${watchList(unit.mission.items)}
        <p class="en small muted ltr" lang="en">${esc(unit.mission.en)}</p>
      </div>
      <div class="card stack">
        <h2 class="h-card">سجل المهمة</h2>
        <label class="field">كم مرة استخدمت الإنجليزية مع عملاء هذا الأسبوع؟
          <input class="input num" id="mCount" type="number" inputmode="numeric" min="0" max="999" value="${m && m.count != null ? esc(m.count) : ''}">
        </label>
        <label class="field">ماذا حدث؟ ماذا قلت؟ ما الذي كان صعبًا؟ (بالعربية أو الإنجليزية)
          <textarea class="input" id="mNote" rows="4">${esc(m ? m.note : '')}</textarea>
        </label>
        <button class="btn" type="button" data-act="save">${m ? 'تحديث السجل' : 'أنجزت المهمة'}</button>
        ${m ? `<p class="muted small">آخر تحديث: ${fmtDate(m.at)}</p>` : ''}
        <p class="muted small">يراجع المدرب سجلات المهام في ورشة الأسبوع.</p>
      </div>
      <a class="btn ghost block" href="#/unit/${u}">العودة إلى الوحدة</a>`;
    $('[data-act="save"]', host).addEventListener('click', () => {
      const c = $('#mCount', host).value;
      S.missions[u] = { count: c === '' ? null : clamp(parseInt(c, 10) || 0, 0, 999), note: $('#mNote', host).value.trim().slice(0, 2000), at: Date.now() };
      markStep(u, 'mission');
      toast('حُفظ سجل المهمة');
      stepMission({ unit, u, host });
    });
  }

  // =====================================================================
  // Practice
  // =====================================================================
  function viewPractice() {
    setBar('التدريب', 'تمارين قصيرة لأي وقت');
    const due = srsDue().length;
    const tile = (href, ic, title, sub, tint = '') => `
      <a class="card unit-card" href="${href}">
        <span class="unit-badge ${tint}">${icon(ic)}</span>
        <span class="grow"><strong>${title}</strong><br><span class="muted small">${sub}</span></span>
        <span class="chev">${icon('next')}</span>
      </a>`;
    view.innerHTML = `
      <div class="stack">
        ${tile('#/review', 'cards', `المراجعة اليومية${due ? ` <span class="pill blue">${countAr(due, W.phrase)}</span>` : ''}`, 'العبارات التي تعلمتها، في الوقت المناسب لتثبيتها', 't-blue')}
        ${tile('#/numbers', 'hash', 'الأرقام والأسعار', 'استمع واكتب، اقرأ وقل، و13 أم 30؟', 't-good')}
        ${tile('#/dialogues', 'chat', 'الحوارات', 'كل حوارات الوحدات، مع إخفاء دورك للتدريب')}
        ${tile('#/watch', 'alert', 'انتبه!', 'كلمات خادعة وأرقام متشابهة', 't-amber')}
        <button class="card unit-card" type="button" data-help>
          <span class="unit-badge t-red">${icon('help')}</span>
          <span class="grow"><strong>عبارات سريعة</strong><br><span class="muted small">عبارات تحتاجها أثناء العمل: اسمعها، أو اعرضها للعميل بخط كبير</span></span>
        </button>
      </div>`;
  }

  function viewNumbers() {
    const SUB = { listen: 'اسمع السعر واكتبه', say: 'اقرأ السعر وقله بالإنجليزية', pairs: 'ميّز 13 من 30، و14 من 40…' };
    setBar('الأرقام والأسعار', SUB.listen);
    let mode = 'listen', right = 0, total = 0;
    view.innerHTML = `
      <div class="stack-lg">
        <div class="seg" role="group" aria-label="نوع التدريب">
          <button type="button" data-mode="listen" aria-pressed="true">استمع واكتب</button>
          <button type="button" data-mode="say" aria-pressed="false">اقرأ وقل</button>
          <button type="button" data-mode="pairs" aria-pressed="false">13 أم 30؟</button>
        </div>
        <p class="center muted small">الجلسة: <span class="num" id="nScore">0/0</span></p>
        <div id="nBody" class="stack"></div>
      </div>`;
    const body = $('#nBody');
    const setScore = () => { $('#nScore').textContent = `${right}/${total}`; };
    $$('.seg button').forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.mode;
      setBar('الأرقام والأسعار', SUB[mode]);
      $$('.seg button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      right = 0; total = 0; setScore();
      draw();
    }));
    function draw() {
      stopAll();
      if (mode === 'listen') drawListen(); else if (mode === 'say') drawSay(); else drawPairs();
      toTop();
    }
    function drawListen() {
      const amount = randomPrice();
      const text = Math.random() < 0.5 ? priceWords(amount) : priceShort(amount);
      body.innerHTML = `
        <div class="card prompt-card stack">
          <button class="big-play" type="button" data-say="${esc(text)}" data-role="c" aria-label="استمع">${icon('play')}</button>
          <p class="muted small">اكتب السعر الذي تسمعه</p>
        </div>
        <input class="num-input" id="nAns" inputmode="decimal" autocomplete="off" placeholder="0.00" aria-label="السعر">
        <button class="btn block" type="button" data-act="check">تحقق</button>
        <div id="nFb"></div>`;
      const check = () => {
        const v = parsePrice($('#nAns').value);
        if (v == null) { toast('اكتب رقمًا'); return; }
        const ok = v === amount;
        total++; if (ok) right++; setScore();
        $('#nAns').disabled = true;
        $('#nFb').innerHTML = feedback(ok, ok ? 'صحيح!' : `الصحيح: ${fmtPrice(amount)}`, `<span class="say" lang="en" dir="ltr" style="display:block">${esc(text)}</span>`) +
          `<button class="btn block" type="button" data-act="next" style="margin-top:10px">التالي ${icon('next')}</button>`;
        $('[data-act="check"]', body).remove();
        $('[data-act="next"]', body).addEventListener('click', draw);
        $('[data-act="next"]', body).focus({ preventScroll: true });
        showEl($('#nFb'));
      };
      $('[data-act="check"]', body).addEventListener('click', check);
      $('#nAns').addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
      say(text, 'c');
    }
    function drawSay() {
      const amount = randomPrice();
      const full = priceWords(amount), short = priceShort(amount);
      body.innerHTML = `
        <div class="card prompt-card stack">
          <div class="price-tag">${esc(fmtPrice(amount))}<small>SAR</small></div>
          <p class="muted">قل السعر بالإنجليزية</p>
          ${micOn() ? `<button class="mic-btn" type="button" data-act="mic" aria-label="تكلم">${icon('mic')}</button><p class="heard" id="heard" aria-live="polite"></p>` : ''}
          <button class="btn soft" type="button" data-act="reveal">أظهر الإجابة</button>
        </div>
        <div id="nAnswer" class="stack" hidden>
          <div class="card stack">
            <p class="small muted">الصيغة الكاملة</p>
            <p class="say" lang="en" dir="ltr">${esc(full)}</p>
            <div class="row">${audioBtns(full, 'k')}</div>
            ${short !== full ? `<p class="small muted">الصيغة القصيرة (شائعة في الكلام)</p><p class="say" lang="en" dir="ltr">${esc(short)}</p><div class="row">${audioBtns(short, 'k', false)}</div>` : ''}
          </div>
          <div class="row wrap" style="justify-content:center">
            <button class="btn small" type="button" data-act="yes">${icon('check')} قلتها صحيحة</button>
            <button class="btn ghost small" type="button" data-act="no">أخطأت</button>
          </div>
        </div>`;
      const reveal = () => { $('#nAnswer').hidden = false; const r = $('[data-act="reveal"]', body); if (r) r.remove(); showEl($('#nAnswer')); };
      $('[data-act="reveal"]', body).addEventListener('click', reveal);
      $('[data-act="yes"]', body).addEventListener('click', () => { total++; right++; setScore(); draw(); });
      $('[data-act="no"]', body).addEventListener('click', () => { total++; setScore(); draw(); });
      const mic = $('[data-act="mic"]', body);
      if (mic) mic.addEventListener('click', async () => {
        if (mic.classList.contains('listening')) { Mic.stop(); return; }
        mic.classList.add('listening');
        const heard = $('#heard', body);
        heard.textContent = 'أستمع…';
        try {
          const alts = await Mic.listen();
          if (!mic.isConnected) return; // a new price is showing
          mic.classList.remove('listening');
          if (!alts.length) { heard.textContent = 'لم أسمع شيئًا.'; return; }
          const r1 = compareSpeech(full, alts), r2 = compareSpeech(short, alts);
          const r = r1.score >= r2.score ? r1 : r2;
          heard.textContent = `سمعت: “${r.heard}”` + (r.score >= 0.8 ? ' ✓' : '');
          if (r.score >= 0.8) {
            total++; right++; setScore();
            $('[data-act="yes"]', body).parentElement.outerHTML = `<button class="btn block" type="button" data-act="nx">التالي ${icon('next')}</button>`;
            $('[data-act="nx"]', body).addEventListener('click', draw);
            reveal();
          }
        } catch (err) {
          mic.classList.remove('listening');
          if (!mic.isConnected || err === 'aborted') return;
          heard.textContent = err === 'network' ? 'التعرّف على الصوت يحتاج إلى اتصال بالإنترنت.' : 'تعذّر استخدام الميكروفون.';
        }
      });
    }
    function drawPairs() {
      const pair = pick(P.confusables);
      const target = pick(pair);
      const text = `${intWords(target)} riyals`;
      body.innerHTML = `
        <div class="card prompt-card stack">
          <button class="big-play" type="button" data-say="${esc(text)}" data-role="c" aria-label="استمع">${icon('play')}</button>
          <p class="muted small">أي رقم سمعت؟ انتبه للضغط: thir-TEEN أم THIR-ty</p>
        </div>
        <div class="grid-2">${pair.map(n => `<button class="option center" type="button" data-n="${n}" style="justify-content:center"><span class="price-tag" style="font-size:2rem">${n}</span></button>`).join('')}</div>
        <div id="nFb"></div>`;
      $$('[data-n]', body).forEach(b => b.addEventListener('click', () => {
        const ok = +b.dataset.n === target;
        total++; if (ok) right++; setScore();
        $$('[data-n]', body).forEach(x => { x.disabled = true; if (+x.dataset.n === target) x.classList.add('correct'); else if (x === b) x.classList.add('wrong'); });
        $('#nFb').innerHTML = feedback(ok, ok ? 'صحيح!' : `سمعت ${target}`, `<span class="say" lang="en" dir="ltr" style="display:block">${esc(text)}</span>`) +
          `<button class="btn block" type="button" data-act="next" style="margin-top:10px">التالي ${icon('next')}</button>`;
        $('[data-act="next"]', body).addEventListener('click', draw);
        showEl($('#nFb'));
      }));
      say(text, 'c');
    }
    draw();
  }

  function viewReview() {
    setBar('المراجعة اليومية', 'العبارات التي حان وقت مراجعتها');
    const due = shuffle(srsDue()).slice(0, 20);
    const learned = Object.keys(S.srs).filter(id => PH[id]);
    if (!due.length) {
      const next = learned.map(id => S.srs[id].due).sort()[0];
      view.innerHTML = `
        <div class="empty">${icon('check')}<p>${learned.length ? 'لا توجد عبارات للمراجعة اليوم.' : 'لم تضف عبارات بعد. ابدأ خطوة «العبارات المفتاحية» في أي وحدة.'}</p>
          ${next ? `<p class="small">المراجعة القادمة: ${fmtDate(next)}</p>` : ''}</div>
        ${learned.length ? `<button class="btn ghost block" type="button" data-act="extra">تدرّب على 10 عبارات عشوائية</button>` : `<a class="btn block" href="#/unit/${UNITS[0].id}/phrases">ابدأ</a>`}`;
      const extra = $('[data-act="extra"]');
      if (extra) extra.addEventListener('click', () => run(shuffle(learned).slice(0, 10), false));
      return;
    }
    run(due, true);
    // graded: false for extra practice, which must not move cards that are not due yet.
    function run(queue, graded) {
      queue = queue.slice();
      const requeued = new Set();
      let done = 0;
      const total = queue.length;
      function draw() {
        stopAll();
        if (!queue.length) {
          view.innerHTML = `
            <div class="empty" style="color:var(--good)">${icon('award')}<p>أنهيت مراجعة ${countAr(total, W.phraseGen)}. أحسنت!</p></div>
            <a class="btn block" href="#/">الرئيسية</a>`;
          toTop();
          return;
        }
        const id = queue[0];
        const p = PH[id];
        const c = pick(p.c);
        view.innerHTML = `
          <div class="stack-lg">
            <div class="activity-head">${progressBar(pct(done, total))}<span class="counter num">${done}/${total}</span></div>
            <div class="card flash">
              <span class="speaker c" style="align-self:center">العميل يقول</span>
              <p class="say big" lang="en" dir="ltr">${esc(c)}</p>
              <p class="gloss">${esc(p.cAr)}</p>
              <div class="row" style="justify-content:center">${audioBtns(c, 'c', false)}</div>
            </div>
            <div id="back" hidden class="card flash">
              <span class="speaker k" style="align-self:center">أنت تقول</span>
              <p class="say big" lang="en" dir="ltr">${esc(p.k)}</p>
              <p class="gloss">${esc(p.kAr)}</p>
              <div class="row" style="justify-content:center">${audioBtns(p.k, 'k')}</div>
            </div>
            <div class="action-bar">
              <button class="btn block" type="button" data-act="flip">ماذا تقول؟ أظهر الرد</button>
              <div id="grades" hidden class="grid-2" style="grid-template-columns:repeat(3,1fr)">
                <button class="btn ghost" type="button" data-g="0">مرة أخرى</button>
                <button class="btn ghost" type="button" data-g="1">صعبة</button>
                <button class="btn ghost" type="button" data-g="2">سهلة</button>
              </div>
            </div>
          </div>`;
        toTop();
        say(c, 'c');
        $('[data-act="flip"]').addEventListener('click', e => {
          $('#back').hidden = false; $('#grades').hidden = false; e.currentTarget.remove();
          showEl($('#back'));
          say(p.k, 'k');
        });
        $$('[data-g]').forEach(b => b.addEventListener('click', () => {
          $$('[data-g]').forEach(x => { x.disabled = true; });
          const g = +b.dataset.g;
          if (graded && !requeued.has(id)) srsGrade(id, g);
          queue.shift();
          if (g === 0 && !requeued.has(id)) { requeued.add(id); queue.push(id); }
          else done++;
          draw();
        }));
      }
      draw();
    }
  }

  function viewDialogues() {
    setBar('الحوارات', 'استمع إلى حوارات الوحدات كاملة');
    view.innerHTML = `<div class="stack">${UNITS.map((u, i) => `
      <div class="card stack">
        <p class="muted small">الوحدة ${i + 1}: ${esc(u.title.ar)}</p>
        <a class="step" href="#/dialogue/${u.id}/model"><span class="ico">${icon('chat')}</span><span class="grow"><span class="title">${esc(u.model.title.ar)}</span><br><span class="strand">الحوار النموذجي · ${esc(u.model.setting.ar)}</span></span></a>
        <a class="step" href="#/dialogue/${u.id}/roleplay"><span class="ico">${icon('mic')}</span><span class="grow"><span class="title">${esc(u.roleplay.title.ar)}</span><br><span class="strand">حوار لعب الأدوار · ${esc(u.roleplay.setting.ar)}</span></span></a>
      </div>`).join('')}</div>`;
  }

  function viewDialogue({ u, which }) {
    const unit = unitById(u);
    const d = unit && (which === 'model' ? unit.model : which === 'roleplay' ? unit.roleplay : null);
    if (!d) { redirect('#/dialogues'); return; }
    TTS.scene(u + ':' + which);
    setBar(d.title.ar, `الوحدة ${unitIndex(u) + 1} · ${d.setting.ar}`);
    let hideK = false;
    function draw() {
      view.innerHTML = `
        <div class="stack-lg">
          <div class="card stack">
            <h2 class="h-card">${esc(d.title.ar)}</h2>
            <div class="row wrap">
              <button class="btn" type="button" data-act="play-all">${icon('play')} استمع للحوار كاملًا</button>
              <button class="btn ghost" type="button" data-act="hide" aria-pressed="${hideK}">${icon('eye')} ${hideK ? 'أظهر دوري' : 'أخفِ دوري'}</button>
            </div>
            ${hideK ? '<p class="muted small">قل دورك بصوت عالٍ، ثم اضغط على السطر لتراه وتسمعه.</p>' : ''}
          </div>
          ${dialogueHtml(d.lines, which === 'model' ? unit.stages : null, { hideK })}
        </div>`;
      wirePlayAll(view, d.lines);
      $('[data-act="hide"]').addEventListener('click', () => { hideK = !hideK; draw(); });
      $$('.bubble.hidden-line').forEach(b => b.addEventListener('click', () => {
        const l = d.lines[+b.dataset.line];
        b.classList.remove('hidden-line');
        b.dataset.say = l.en; b.dataset.role = 'k';
        $('.b-ico', b).outerHTML = icon('volume', 'b-ico');
        say(l.en, 'k');
      }, { once: true }));
    }
    draw();
  }

  function viewWatch() {
    setBar('انتبه!', 'كلمات يسهل الخلط بينها');
    view.innerHTML = `
      <div class="stack">
        <p class="muted">كلمات تتشابه في النطق أو الشكل لكنها تختلف في المعنى، أو كلمات تُفهم خطأ عند الترجمة.</p>
        ${P.watchOut.map(w => `
          <div class="card stack">
            <div class="row wrap">
              <div class="word-pair">
                <button class="word-btn amber" type="button" data-say="${esc(w.a)}" data-role="k">${icon('volume')}<span class="w" lang="en" dir="ltr">${esc(w.a)}</span><span class="m">${esc(w.aAr)}</span></button>
                ${w.b ? `<span class="neq" aria-hidden="true">≠</span>
                <button class="word-btn" type="button" data-say="${esc(w.b)}" data-role="k">${icon('volume')}<span class="w" lang="en" dir="ltr">${esc(w.b)}</span><span class="m">${esc(w.bAr)}</span></button>` : ''}
              </div>
            </div>
            ${w.note ? `<p class="small">${rich(w.note)}</p>` : ''}
            ${watchList(w.ex)}
          </div>`).join('')}
      </div>`;
  }

  // =====================================================================
  // Progress, record, final assessment, survey
  // =====================================================================
  function viewProgress() {
    setBar('تقدّمي', '');
    const passed = UNITS.filter(u => unitPassed(u.id)).length;
    const wkMinutes = [];
    const start = S.profile.startedAt || addDays(dayKey(), -7 * (P.meta.weeks - 1));
    for (let w = 0; w < P.meta.weeks; w++) {
      const a = addDays(start, w * 7), b = addDays(start, w * 7 + 6);
      wkMinutes.push(Math.round(secondsBetween(a, b) / 60));
    }
    const maxMin = Math.max(30, ...wkMinutes);
    view.innerHTML = `
      <div class="stack-lg">
        <div class="stat-grid">
          <div class="stat"><div class="v">${passed}/${UNITS.length}</div><div class="l">وحدات مجتازة</div></div>
          <div class="stat"><div class="v">${minutesTotal()}</div><div class="l">دقيقة دراسة</div></div>
          <div class="stat"><div class="v">${Object.keys(S.missions).length}</div><div class="l">مهام عمل</div></div>
        </div>

        <div class="card stack">
          <h2 class="h-card">اختبار الاستماع</h2>
          <div class="compare">
            <div class="box"><div class="small muted">البداية</div><div class="v">${S.lc.entry ? `${S.lc.entry.score}/${S.lc.entry.total}` : '—'}</div></div>
            <div class="arrow">${icon('next')}</div>
            <div class="box"><div class="small muted">النهاية</div><div class="v">${S.lc.exit ? `${S.lc.exit.score}/${S.lc.exit.total}` : '—'}</div></div>
          </div>
          ${!S.lc.entry ? '<a class="btn soft small" href="#/lc/entry">أجرِ اختبار البداية</a>' : ''}
        </div>

        <section class="stack">
          <h2 class="h-card">الوحدات</h2>
          ${UNITS.map((u, i) => {
            const best = checkBest(u.id);
            const tries = (S.checks[u.id] || []).length;
            const pulse = S.pulses[u.id];
            return `
            <a class="card unit-card" href="#/unit/${u.id}">
              <span class="unit-badge ${unitPassed(u.id) ? 'done' : ''}">${unitPassed(u.id) ? icon('check') : icon(u.icon)}</span>
              <span class="grow stack" style="gap:6px">
                <strong>${i + 1}. ${esc(u.title.ar)}</strong>
                ${progressBar(pct(unitStepsDone(u.id), STEPS.length), `تقدّم الوحدة ${i + 1}`)}
                <span class="unit-facts small">
                  <span>الخطوات <b class="num">${unitStepsDone(u.id)}/${STEPS.length}</b></span>
                  <span>الاختبار ${best != null ? `<span class="pill ${unitPassed(u.id) ? 'good' : 'amber'} num">${best}%</span>` : '<b>—</b>'}${tries ? ` <span class="muted">(${countAr(tries, W.attempt)})</span>` : ''}</span>
                  ${pulse ? `<span>الفائدة <b class="num">${pulse.useful}/5</b></span>` : ''}
                  <span>المهمة <b>${S.missions[u.id] ? '✓' : '—'}</b></span>
                </span>
              </span>
              <span class="chev">${icon('next')}</span>
            </a>`;
          }).join('')}
        </section>

        <div class="card stack">
          <h2 class="h-card">دقائق الدراسة في كل أسبوع</h2>
          <div class="bars">${wkMinutes.map((m, i) => `<div class="bar-row"><span>الأسبوع ${i + 1}</span>${progressBar(pct(m, maxMin), `دقائق الأسبوع ${i + 1}`)}<span class="v">${m}</span></div>`).join('')}</div>
          <p class="muted small">الهدف: نحو ${P.meta.weeklyPattern[1].hours * 60} دقيقة أسبوعيًا على التطبيق. أيام النشاط: ${daysActive()}.</p>
        </div>

        <div class="stack">
          <a class="btn block" href="#/record">${icon('award')} سجل التعلّم</a>
          <a class="btn ghost block" href="#/final">التقييم الختامي</a>
        </div>
      </div>`;
  }

  function recordSummaryText() {
    const lines = [];
    lines.push(`${P.meta.title.en} — Learning record`);
    lines.push(`Learner: ${S.profile.name || '—'}${S.profile.store ? ' (' + S.profile.store + ')' : ''}`);
    lines.push(`Started: ${S.profile.startedAt || '—'} · Today: ${dayKey()}`);
    UNITS.forEach((u, i) => lines.push(`Unit ${i + 1} ${u.title.en}: steps ${unitStepsDone(u.id)}/${STEPS.length}, check ${checkBest(u.id) != null ? checkBest(u.id) + '%' : '—'}, mission ${S.missions[u.id] ? 'done' : '—'}`));
    lines.push(`Listening check: entry ${S.lc.entry ? S.lc.entry.score + '/' + S.lc.entry.total : '—'}, exit ${S.lc.exit ? S.lc.exit.score + '/' + S.lc.exit.total : '—'}`);
    lines.push(`Study time: ${minutesTotal()} min over ${daysActive()} days`);
    return lines.join('\n');
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(backupObj(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${backupName()}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    markBackup();
  }

  function viewRecord() {
    setBar('سجل التعلّم', 'اعرضه على مدربك أو مشرفك');
    // Without a name the trainer can't tell whose record this is, so ask for it here.
    view.innerHTML = `
      <div class="stack-lg">
        ${S.profile.name ? '' : `
        <form class="card stack no-print" id="recNameForm">
          <label class="field" for="recName">اكتب اسمك ليعرف المدرب سجلّ من هذا</label>
          <div class="row"><input class="input grow" id="recName" autocomplete="name" maxlength="60" placeholder="الاسم">
            <button class="btn" type="submit">حفظ</button></div>
        </form>`}
        <div class="card stack" id="record">
          <div class="center stack" style="gap:2px">
            <strong style="font-size:1.15rem">سجل التعلّم</strong>
            <span class="muted small">${esc(P.meta.subtitle.ar)}</span>
          </div>
          <table class="plain">
            <tr><th>المتدرب</th><td>${esc(S.profile.name || '—')}</td></tr>
            <tr><th>المتجر</th><td>${esc(S.profile.store || '—')}</td></tr>
            <tr><th>بداية البرنامج</th><td>${fmtDate(S.profile.startedAt)}</td></tr>
            <tr><th>تاريخ السجل</th><td>${fmtDate(dayKey())}</td></tr>
          </table>
          ${scrollBox('جدول الوحدات')}<table class="plain">
            <thead><tr><th>الوحدة</th><th>الخطوات</th><th>الاختبار</th><th>المهمة</th></tr></thead>
            <tbody>${UNITS.map((u, i) => `<tr><td>${i + 1}. ${esc(u.title.ar)}</td><td class="num">${unitStepsDone(u.id)}/${STEPS.length}</td>
              <td class="num">${checkBest(u.id) != null ? checkBest(u.id) + '%' : '—'}</td><td>${S.missions[u.id] ? '✓' : '—'}</td></tr>`).join('')}</tbody>
          </table></div>
          <table class="plain">
            <tr><th>اختبار الاستماع</th><td class="num">البداية ${S.lc.entry ? `${S.lc.entry.score}/${S.lc.entry.total}` : '—'} · النهاية ${S.lc.exit ? `${S.lc.exit.score}/${S.lc.exit.total}` : '—'}</td></tr>
            <tr><th>وقت الدراسة</th><td class="num">${countAr(minutesTotal(), W.minute)} · ${countAr(daysActive(), W.day)}</td></tr>
          </table>
          <p class="muted small">يوضح هذا السجل نشاط التطبيق فقط. تحقق المخرجات الشفهية يُقرَّر في لعب الأدوار الختامي الذي يقيّمه مدربان.</p>
        </div>
        <div class="grid-2 no-print">
          <button class="btn" type="button" data-act="share">${icon('share')} مشاركة</button>
          <button class="btn ghost" type="button" data-act="print">${icon('print')} طباعة</button>
        </div>
        <p class="muted small no-print">ترسل «مشاركة» السجل مع ملف فيه تقدّمك إن سمح هاتفك بذلك. احتفظ به أنت ومدربك: إذا ضاع تقدّمك فاستورده من الإعدادات.</p>
        <button class="btn ghost block no-print" type="button" data-act="export">${icon('download')} تنزيل البيانات (JSON)</button>
      </div>`;
    $('[data-act="print"]').addEventListener('click', () => window.print());
    $('[data-act="export"]').addEventListener('click', exportData);
    const nameForm = $('#recNameForm');
    if (nameForm) nameForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#recName').value.trim().slice(0, 60);
      if (!name) { $('#recName').focus(); return; }
      S.profile.name = name;
      save();
      render();
    });
    let askedName = false;
    $('[data-act="share"]').addEventListener('click', async () => {
      // Ask once for a name before sharing a record without one; a second tap shares anyway.
      if (!S.profile.name && !askedName) {
        askedName = true;
        toast('اكتب اسمك أولًا ليعرف المدرب سجلّ من هذا');
        $('#recName').focus();
        return;
      }
      const text = recordSummaryText();
      const title = `${P.meta.title.en} — Learning record`;
      try {
        if (navigator.share) {
          // Attach the data as a backup the trainer can keep, where the phone can share files.
          const file = backupFile();
          const withFile = !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
          await navigator.share(withFile ? { title, text, files: [file] } : { title, text });
          if (withFile) markBackup();
          return;
        }
      } catch (e) { if (e && e.name === 'AbortError') return; }
      try { await navigator.clipboard.writeText(text); toast('نُسخ السجل. الصقه في رسالة إلى المدرب.'); }
      catch (e) { toast('تعذّرت المشاركة'); }
    });
  }

  function viewFinal() {
    setBar('التقييم الختامي', `الأسبوع ${P.meta.weeks}`);
    const item = (href, ic, title, sub, done) => `
      <a class="step ${done ? 'done' : ''}" href="${href}">
        <span class="ico">${done ? icon('check') : icon(ic)}</span>
        <span class="grow"><span class="title">${title}</span><br><span class="strand">${sub}</span></span>
        <span class="chev muted">${icon('next')}</span>
      </a>`;
    view.innerHTML = `
      <div class="stack-lg">
        <div class="card stack">
          <p>في نهاية البرنامج تؤدي اختبار الاستماع الختامي وتجيب عن الاستبانة في التطبيق، ثم تؤدي لعب الأدوار الختامي مع مدربين اثنين.</p>
          ${UNITS.every(u => unitPassed(u.id)) ? '' : `<p class="pill amber">أكمل اختبارات الوحدات أولًا إن أمكن (${UNITS.filter(u => unitPassed(u.id)).length}/${UNITS.length})</p>`}
        </div>
        <div class="stack">
          ${item('#/lc/exit', 'headphones', '1. اختبار الاستماع الختامي', 'نموذج موازٍ بجمل جديدة', !!S.lc.exit)}
          ${item('#/survey', 'star', '2. استبانة نهاية البرنامج', 'رأيك يساعدنا على تطوير البرنامج', !!S.survey)}
          ${item('#/record', 'award', '3. سجل التعلّم', 'شاركه مع المدرب', false)}
        </div>
        <div class="note brand"><strong>لعب الأدوار الختامي:</strong> ثلاثة مواقف جديدة لم تتدرب عليها حرفيًا، يقيّمها مدربان بالمعايير الأربعة نفسها التي استُخدمت في التقييم التشخيصي.</div>
        <p class="muted small">${P.rubric.criteria.map(c => esc(c.ar)).join(' · ')}</p>
      </div>`;
  }

  function viewListeningCheck({ form }) {
    if (!['entry', 'exit'].includes(form)) { redirect('#/final'); return; }
    setBar('اختبار الاستماع', form === 'entry' ? 'نموذج البداية' : 'نموذج النهاية');
    const prev = S.lc[form];
    const intro = () => {
      view.innerHTML = `
        <div class="stack-lg">
          <div class="card stack">
            <p>عشرة أسئلة. الجزء أ: اكتب السعر الذي تسمعه. الجزء ب: اختر ما يريده العميل.</p>
            <p class="muted small">اضغط زر التشغيل لتسمع كل سؤال، ويمكنك الاستماع مرتين. لا تظهر الإجابات الصحيحة حتى النهاية. إن لم تعرف الإجابة فاضغط «لا أعرف» بدل التخمين.</p>
            ${prev ? `<p class="pill">نتيجتك السابقة: ${prev.score}/${prev.total} (${fmtDate(prev.at)})</p><p class="muted small">إعادة الاختبار تستبدل النتيجة السابقة.</p>` : ''}
          </div>
          <button class="btn block" type="button" data-act="start">${prev ? 'أعد الاختبار' : 'ابدأ'}</button>
        </div>`;
      $('[data-act="start"]').addEventListener('click', () => lcRunner(view, form, () => go(form === 'entry' ? '#/units' : '#/final')));
    };
    intro();
  }

  function viewSurvey() {
    setBar('استبانة نهاية البرنامج', 'رأيك يساعدنا على تحسين البرنامج');
    const prev = S.survey || {};
    view.innerHTML = `
      <div class="stack-lg">
        <p class="muted">إجاباتك تساعد فريق البرنامج على تطويره. لا توجد إجابة صحيحة أو خاطئة.</p>
        ${P.feedback.survey.map(q => `
          <fieldset class="card stack" style="border:1px solid var(--line)">
            <legend class="sr-only">${esc(q.id)}</legend>
            <p>${esc(q.ar)}</p>
            <div class="scale">${AGREE_SCALE.map(s => `<label><input type="radio" name="${q.id}" value="${s.v}" ${prev[q.id] === s.v ? 'checked' : ''}><span>${esc(s.ar)}</span></label>`).join('')}</div>
          </fieldset>`).join('')}
        ${P.feedback.open.map(q => `
          <label class="card field">${esc(q.ar)}<textarea class="input" id="${q.id}" rows="3">${esc(prev[q.id] || '')}</textarea></label>`).join('')}
        <button class="btn block" type="button" data-act="save">إرسال</button>
      </div>`;
    $('[data-act="save"]').addEventListener('click', () => {
      const out = { at: Date.now() };
      let missing = 0;
      P.feedback.survey.forEach(q => { const c = $(`input[name="${q.id}"]:checked`); if (c) out[q.id] = +c.value; else missing++; });
      if (missing) { toast('أجب عن جميع العبارات من فضلك'); return; }
      P.feedback.open.forEach(q => { out[q.id] = $('#' + q.id).value.trim().slice(0, 1000); });
      S.survey = out;
      save();
      toast('شكرًا لك!');
      go('#/final');
    });
  }

  // =====================================================================
  // Settings
  // =====================================================================
  function viewSettings() {
    setBar('الإعدادات', '');
    const st = S.settings;
    const seg = (name, opts, cur) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button type="button" data-set="${name}" data-v="${v}" aria-pressed="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`;
    view.innerHTML = `
      <div class="stack-lg">
        <div class="card stack">
          <h2 class="h-card">الملف الشخصي</h2>
          <label class="field">الاسم<input class="input" id="sName" value="${esc(S.profile.name)}"></label>
          <label class="field">المتجر أو القسم<input class="input" id="sStore" value="${esc(S.profile.store)}"></label>
          <label class="field">تاريخ بداية البرنامج<input class="input num" id="sStart" type="date" value="${esc(S.profile.startedAt || '')}"></label>
        </div>
        <div class="card stack">
          <h2 class="h-card">اللغة والصوت</h2>
          <label class="switch-row"><span>إظهار الترجمة العربية</span><span class="switch"><input type="checkbox" id="sAr" ${st.ar ? 'checked' : ''}><span></span></span></label>
          <p class="small">سرعة الكلام</p>
          ${seg('rate', [[0.8, 'أبطأ'], [1, 'عادية'], [1.15, 'أسرع']], st.rate)}
          <p class="small">لهجات العملاء</p>
          ${seg('accent', [['mix', 'متنوعة'], ['us', 'أمريكية'], ['gb', 'بريطانية']], st.accent)}
          <p class="muted small">«متنوعة» تستخدم ما يتوفر في جهازك من لهجات (هندية، بريطانية، أسترالية…) لأن عملاءك من بلدان كثيرة.</p>
          <div id="voiceStatus">${voiceStatusHtml()}</div>
          <button class="btn ghost small" type="button" data-say="Hello! Welcome. How can I help you?" data-role="c">${icon('volume')} جرّب الصوت</button>
          <label class="switch-row"><span>التدريب بالميكروفون ${Mic.ok ? '' : '<span class="muted small">(غير مدعوم في هذا المتصفح)</span>'}</span><span class="switch"><input type="checkbox" id="sMic" ${st.mic && Mic.ok ? 'checked' : ''} ${Mic.ok ? '' : 'disabled'}><span></span></span></label>
        </div>
        <div class="card stack">
          <h2 class="h-card">المظهر</h2>
          ${seg('theme', [['auto', 'تلقائي'], ['light', 'فاتح'], ['dark', 'داكن']], st.theme)}
        </div>
        <div class="card stack">
          <h2 class="h-card">البيانات</h2>
          <p class="muted small">تُحفظ بياناتك على هذا الجهاز فقط. صدّرها لإرسالها إلى المدرب أو لنقلها إلى جهاز آخر.</p>
          <div class="grid-2">
            <button class="btn ghost" type="button" data-act="export">${icon('download')} تصدير</button>
            <label class="btn ghost" style="cursor:pointer">${icon('upload')} استيراد<input type="file" accept="application/json,.json,text/plain,.txt" id="sImport" hidden></label>
          </div>
          <button class="btn danger" type="button" data-act="reset">${icon('trash')} مسح كل البيانات</button>
        </div>
        <div class="center stack" style="gap:0">
          <a class="link-btn" href="#/trainer" style="align-self:center">${icon('lock', 'inline-ico')} للمدربين</a>
          <p class="muted small">${esc(P.meta.title.en)} v${esc(P.meta.version)}</p>
        </div>
      </div>`;
    const saveProfile = () => {
      S.profile.name = $('#sName').value.trim().slice(0, 60);
      S.profile.store = $('#sStore').value.trim().slice(0, 80);
      const d = $('#sStart').value;
      S.profile.startedAt = /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : S.profile.startedAt;
      save();
    };
    ['#sName', '#sStore', '#sStart'].forEach(id => $(id).addEventListener('change', saveProfile));
    $('#sAr').addEventListener('change', e => { S.settings.ar = e.target.checked; save(); applySettings(); });
    $('#sMic').addEventListener('change', e => { S.settings.mic = e.target.checked; save(); });
    $$('[data-set]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.set;
      S.settings[k] = k === 'rate' ? +b.dataset.v : b.dataset.v;
      save(); applySettings();
      $$(`[data-set="${k}"]`).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      if (k === 'accent') { const el = $('#voiceStatus'); if (el) el.innerHTML = voiceStatusHtml(); }
    }));
    $('[data-act="export"]').addEventListener('click', exportData);
    $('#sImport').addEventListener('change', e => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        const data = readBackup(r.result);
        if (data) restoreBackup(data, 'تم الاستيراد'); else toast('الملف غير صالح');
      };
      r.readAsText(f);
      e.target.value = '';
    });
    $('[data-act="reset"]').addEventListener('click', () => {
      if (!confirm('سيُحذف كل تقدمك على هذا الجهاز نهائيًا. هل أنت متأكد؟')) return;
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      S = fresh();
      applySettings();
      go('#/');
    });
  }

  // =====================================================================
  // Trainer area
  // =====================================================================
  // Trainer pages are written for the program team in English, so they render left to right.
  function trainerMode() { view.dir = 'ltr'; view.lang = 'en'; view.classList.add('trainer'); }
  const fmtDateEn = v => new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const ltr = (s, cls = '') => `<span class="ltr ${cls}" lang="en" dir="ltr">${esc(s)}</span>`;
  const biBlock = o => `<div class="stack" style="gap:2px">${ltr(o.en)}<span class="gloss small" dir="rtl" lang="ar">${rich(o.ar)}</span></div>`;

  const trainerOpen = () => !P.meta.trainerCode || S.trainer.unlocked === true;
  function viewTrainerCode() {
    setBar('للمدربين', 'Trainers and program team');
    view.innerHTML = `
      <div class="stack-lg">
        <div class="card stack">
          <div class="row"><span class="unit-badge">${icon('lock')}</span><h2 class="grow" style="margin:0;font-size:1.05rem">صفحات المدربين</h2></div>
          <p class="small">فيها مواقف التقييم الختامي، لذلك تُفتح برمز يعطيه فريق البرنامج للمدربين.</p>
          <label class="field">رمز المدرب<input class="input num" id="tCode" inputmode="numeric" autocomplete="off" dir="ltr"></label>
          <button class="btn" type="button" data-act="unlock">فتح</button>
        </div>
        <a class="btn ghost block" href="#/">الرجوع إلى الرئيسية</a>
      </div>`;
    const tryCode = () => {
      if ($('#tCode').value.trim() === String(P.meta.trainerCode)) { S.trainer.unlocked = true; save(); render(); }
      else { toast('الرمز غير صحيح'); $('#tCode').select(); }
    };
    $('[data-act="unlock"]').addEventListener('click', tryCode);
    $('#tCode').addEventListener('keydown', e => { if (e.key === 'Enter') tryCode(); });
  }

  function viewTrainer() {
    setBar('للمدربين', 'Trainers and program team');
    // Arabic title, then the English one on its own line (mixed on one line, they wrap badly).
    const tile = (href, ic, ar, en, sub) => `
      <a class="card unit-card" href="${href}">
        <span class="unit-badge">${icon(ic)}</span>
        <span class="grow"><strong>${ar}</strong><br><bdi class="en small muted" lang="en">${en}</bdi><br><span class="muted small">${sub}</span></span>
        <span class="chev">${icon('next')}</span>
      </a>`;
    view.innerHTML = `
      <div class="stack">
        ${tile('#/trainer/design', 'book', 'تصميم البرنامج', 'Program design', 'البيئة، الاحتياجات، المبادئ، المخرجات، المنهج، التقييم، التقويم')}
        ${tile('#/trainer/matrix', 'grid', 'مصفوفة المواءمة', 'Alignment matrix', 'كل مخرج ومهمة تقيسه، وكل مهمة ومخرج تقيسه')}
        ${tile('#/trainer/guide/' + UNITS[0].id, 'users', 'أدلة الورش', 'Workshop guides', 'خطة ساعتين لكل وحدة وفق دورة التعليم والتعلّم')}
        ${tile('#/trainer/cards', 'cards', 'بطاقات لعب الأدوار', 'Role-play cards', 'التشخيصي والختامي، مع سلم التقدير')}
        ${tile('#/trainer/rate', 'pen', 'تقييم لعب الأدوار', 'Rate a role-play', 'مقيّمان، أربعة معايير، وحساب الاتفاق')}
        ${tile('#/trainer/ratings', 'chart', 'النتائج والاتفاق', 'Ratings and agreement', `التقييمات المحفوظة على هذا الجهاز: ${S.trainer.ratings.length}`)}
        ${tile('#/trainer/align', 'clipboard', 'فحص المواءمة', 'Alignment check', 'مراجعان يربطان التقييم الختامي بالمخرجات قبل التجربة')}
        ${P.meta.trainerCode ? `<button class="btn ghost block" type="button" data-act="lock">${icon('lock')} أغلق صفحات المدربين على هذا الجهاز</button>` : ''}
      </div>`;
    const lock = $('[data-act="lock"]');
    if (lock) lock.addEventListener('click', () => { S.trainer.unlocked = false; save(); go('#/settings'); });
  }

  function viewDesign() {
    setBar('تصميم البرنامج', 'Program design');
    trainerMode();
    const D = P.design;
    const list = arr => `<ul class="plain-list">${arr.map(x => `<li>${biBlock(x)}</li>`).join('')}</ul>`;
    view.innerHTML = `
      <div class="stack-lg">
        <section class="hero stack">
          <h2 class="ltr" lang="en">${esc(P.meta.title.en)}: ${esc(P.meta.subtitle.en)}</h2>
          <p dir="rtl" lang="ar">${esc(P.meta.subtitle.ar)}</p>
          <div class="meta">
            <span class="pill">${P.meta.weeks} weeks</span><span class="pill">${P.meta.hours} hours</span>
            <span class="pill">${esc(P.meta.mode.en)}</span><span class="pill">${esc(P.meta.entryLevel)} → ${esc(P.meta.exitLevel)}</span>
          </div>
          ${P.meta.designer || P.meta.context ? `<p class="small ltr" lang="en">${esc([P.meta.designer, P.meta.context].filter(Boolean).join(' · '))}</p>` : ''}
        </section>

        <details class="acc" open><summary>Approach · المنهج <span class="chev">${icon('down')}</span></summary>
          <div class="acc-body">${biBlock(D.approach)}
            ${scrollBox('App steps by cycle and strand')}<table class="plain">
              <thead><tr><th>App step</th><th>Teaching-learning cycle</th><th>Strand (Nation)</th></tr></thead>
              <tbody>${STEPS.map((s, i) => `<tr><td>${i + 1}. ${ltr(s.en)}</td><td>${ltr(CYCLE[s.cycle].en)}</td><td>${ltr(STRAND[s.strand].en)}</td></tr>`).join('')}</tbody>
            </table></div>
          </div></details>

        <details class="acc"><summary>Environment analysis · تحليل البيئة <span class="chev">${icon('down')}</span></summary><div class="acc-body">${list(D.environment)}</div></details>
        <details class="acc"><summary>Needs analysis · تحليل الاحتياجات <span class="chev">${icon('down')}</span></summary><div class="acc-body">${list(D.needs)}</div></details>
        <details class="acc"><summary>Principles · المبادئ <span class="chev">${icon('down')}</span></summary><div class="acc-body">${list(D.principles)}</div></details>

        <details class="acc" open><summary>Program learning outcomes · المخرجات <span class="chev">${icon('down')}</span></summary>
          <div class="acc-body">${P.outcomes.map(o => `
            <div class="card tight stack" style="gap:6px">
              <div class="row"><span class="pill brand">${esc(o.id)}</span>${ltr(o.short.en, 'small muted')}</div>
              ${biBlock(o)}
              <p class="small ltr" lang="en"><strong>Assessed by:</strong> ${esc(P.assessments.filter(a => a.summative && a.plos.includes(o.id)).map(a => a.en).join('; '))}</p>
            </div>`).join('')}</div></details>

        <details class="acc"><summary>Syllabus · الخطة الدراسية <span class="chev">${icon('down')}</span></summary>
          <div class="acc-body">${scrollBox('Syllabus')}<table class="plain">
            <thead><tr><th>Week</th><th>Unit</th><th>Genre stages</th><th>PLOs</th><th>Hours</th></tr></thead>
            <tbody>${UNITS.map((u, i) => `<tr><td class="num">${u.week}</td><td>${ltr(`${i + 1}. ${u.title.en}`)}<br><span class="gloss small" dir="rtl" lang="ar">${esc(u.title.ar)}</span></td>
              <td>${ltr(uniq(u.model.lines.map(l => l.st)).map(id => (u.stages.find(s => s.id === id) || {}).en).join(' → '), 'small')}</td>
              <td>${u.plos.join(', ')}</td><td class="num">${P.meta.hours / P.meta.weeks}</td></tr>`).join('')}</tbody>
          </table></div>
          <p class="small ltr" lang="en">Each week: ${esc(P.meta.weeklyPattern.map(w => `${w.hours} h ${w.en.toLowerCase()}`).join(' + '))}. Exit role-plays at the end of week ${P.meta.weeks}.</p>
          </div></details>

        <details class="acc"><summary>Assessment plan · خطة التقييم <span class="chev">${icon('down')}</span></summary>
          <div class="acc-body">${P.assessments.map(a => `
            <div class="card tight stack" style="gap:4px">
              <div class="row wrap"><span class="pill ${a.summative ? 'good' : ''}">${a.summative ? 'Summative' : a.id === 'DX' ? 'Diagnostic' : 'Formative'}</span>${ltr(a.en)}</div>
              <p class="small ltr" lang="en">${esc(a.when.en)} · ${esc(a.plos.join(', '))} · ${esc(a.note.en)}</p>
            </div>`).join('')}
            <a class="btn soft small" href="#/trainer/cards">Rubric and role-play cards</a></div></details>

        <details class="acc"><summary>Evaluation plan · خطة التقويم <span class="chev">${icon('down')}</span></summary>
          <div class="acc-body">${scrollBox('Evaluation plan')}<table class="plain">
            <thead><tr><th>Who</th><th>With what</th><th>When</th></tr></thead>
            <tbody>${P.evaluation.map(e => `<tr><td>${ltr(e.who.en)}</td><td>${ltr(e.what.en)}<br><span class="gloss small" dir="rtl" lang="ar">${esc(e.what.ar)}</span></td><td>${ltr(e.when.en)}</td></tr>`).join('')}</tbody>
          </table></div></div></details>

        <details class="acc"><summary>References <span class="chev">${icon('down')}</span></summary>
          <div class="acc-body">${D.references.map(r => `<p class="small ltr" lang="en">${esc(r)}</p>`).join('')}</div></details>
      </div>`;
  }

  function viewMatrix() {
    setBar('مصفوفة المواءمة', 'Alignment matrix');
    trainerMode();
    const A = P.assessments;
    const cell = (a, o) => a.plos.includes(o.id) ? (a.summative ? '<span class="dot full" title="Summative">●</span>' : '<span class="dot" title="Formative or diagnostic">○</span>') : '';
    const noSummative = P.outcomes.filter(o => !A.some(a => a.summative && a.plos.includes(o.id)));
    const noOutcome = A.filter(a => !a.plos.length);
    const lcItems = P.listeningCheck.exit;
    view.innerHTML = `
      <div class="stack-lg">
        <p class="small ltr" lang="en">Each program learning outcome is written with the task that assesses it. Read across a row to see how an outcome is assessed; read down a column to see what a task tests.</p>
        <div class="card">${scrollBox('Alignment matrix')}<table class="plain matrix">
          <thead><tr><th>PLO</th>${A.map(a => `<th title="${esc(a.en)}">${esc(a.id)}</th>`).join('')}</tr></thead>
          <tbody>${P.outcomes.map(o => `<tr><th title="${esc(o.en)}">${esc(o.id)}<br><span class="muted small">${esc(o.short.en)}</span></th>${A.map(a => `<td>${cell(a, o)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>
        <ul class="plain-list small" style="margin-top:10px">${A.map(a => `<li>${ltr(`${a.id}: ${a.en} (${a.when.en}${a.where === 'app' ? ', in the app' : ', trainers'})`)}</li>`).join('')}</ul>
        <p class="small muted ltr" lang="en">● summative (decides whether the outcome is met) · ○ diagnostic or formative</p></div>

        <div class="card stack">
          <h2 class="h-card ltr" lang="en">Alignment checks</h2>
          ${feedback(!noSummative.length, noSummative.length ? `Outcomes with no summative task: ${noSummative.map(o => o.id).join(', ')}` : 'Every outcome has at least one summative task.')}
          ${feedback(!noOutcome.length, noOutcome.length ? `Tasks that test no outcome: ${noOutcome.map(a => a.id).join(', ')}` : 'Every task tests at least one outcome.')}
          ${feedback(true, 'Spoken outcomes are certified by performance: exit role-plays, two raters, the diagnostic’s four criteria.')}
        </div>

        <div class="card stack">
          <h2 class="h-card ltr" lang="en">Where each outcome is practised</h2>
          ${scrollBox('Where each outcome is practised')}<table class="plain matrix">
            <thead><tr><th>PLO</th>${UNITS.map((u, i) => `<th title="${esc(u.title.en)}">U${i + 1}</th>`).join('')}</tr></thead>
            <tbody>${P.outcomes.map(o => `<tr><th>${esc(o.id)}</th>${UNITS.map(u => `<td>${u.plos.includes(o.id) ? '<span class="dot full">●</span>' : ''}</td>`).join('')}</tr>`).join('')}</tbody>
          </table></div>
        </div>

        <div class="card stack">
          <h2 class="h-card ltr" lang="en">Listening check (exit form): item to outcome</h2>
          ${scrollBox('Listening check items')}<table class="plain">
            <thead><tr><th>#</th><th>Item</th><th>PLO</th></tr></thead>
            <tbody>${lcItems.map((it, i) => `<tr><td class="num">${i + 1}</td><td>${ltr(it.t === 'price' ? `Type the price: ${fmtPrice(it.amount)} (${priceWords(it.amount)})` : it.en, 'small')}</td><td>${esc(it.plo)}</td></tr>`).join('')}</tbody>
          </table></div>
        </div>
      </div>`;
  }

  function viewGuide({ u }) {
    const unit = unitById(u);
    if (!unit) { redirect('#/trainer'); return; }
    const i = unitIndex(u);
    setBar(`دليل الورشة: الوحدة ${i + 1}`, unit.title.en);
    trainerMode();
    const stages = uniq(unit.model.lines.map(l => l.st)).map(id => unit.stages.find(s => s.id === id)).filter(Boolean);
    const phases = [
      { min: 15, t: CYCLE.field, body: biBlock(unit.workshop.field) },
      { min: 25, t: CYCLE.model, body: `${biBlock({ en: `Play the model conversation “${unit.model.title.en}”. Learners label the stages: ${stages.map(s => s.en).join(' → ')}. Point out the key phrases for each stage.`, ar: `شغّل الحوار النموذجي «${unit.model.title.ar}». يحدد المتدربون مراحله: ${stages.map(s => s.ar).join(' ← ')}. أبرز العبارات المفتاحية لكل مرحلة.` })}
          <a class="btn soft small" href="#/dialogue/${u}/model">${icon('play')} Model conversation</a>` },
      { min: 25, t: CYCLE.joint, body: biBlock(unit.workshop.joint) },
      { min: 35, t: CYCLE.independent, body: `${biBlock(unit.workshop.pairs)}${biBlock({ en: 'Peer feedback with the four role-play criteria, in simple words.', ar: 'تغذية راجعة بين الزملاء بالمعايير الأربعة بلغة بسيطة.' })}` },
      { min: 20, t: { en: 'Review and mission', ar: 'المراجعة والمهمة' }, body: `${biBlock({ en: 'Review last week\'s mission logs and app progress. Set this week\'s mission:', ar: 'راجع سجلات مهمة الأسبوع الماضي وتقدم التطبيق. ثم حدد مهمة هذا الأسبوع:' })}${biBlock(unit.mission)}${(unit.mission.items || []).length ? `<ul class="ltr small" lang="en" style="margin:0;padding-left:1.4em">${unit.mission.items.map(x => `<li>${esc(x.en)}</li>`).join('')}</ul>` : ''}` }
    ];
    view.innerHTML = `
      <div class="stack-lg">
        <div class="row wrap">${UNITS.map((x, n) => `<a class="pill nav-pill ${x.id === u ? 'brand' : ''}" href="#/trainer/guide/${x.id}" ${x.id === u ? 'aria-current="page"' : ''}>U${n + 1}</a>`).join('')}</div>
        <section class="hero stack">
          <p class="small">Week ${unit.week} · 120 minutes</p>
          <h2 class="ltr" lang="en">${esc(unit.title.en)}</h2>
          <p dir="rtl" lang="ar">${esc(unit.title.ar)}</p>
          <div class="meta">${unit.plos.map(id => `<span class="pill">${esc(id)}</span>`).join('')}</div>
        </section>
        <div class="card stack"><h3 class="ltr" lang="en">Objectives</h3>${unit.objectives.map(biBlock).join('')}</div>
        ${phases.map((p, n) => `
          <div class="card stack">
            <div class="row"><span class="pill brand num">${p.min} min</span><strong class="grow ltr" lang="en">${n + 1}. ${esc(p.t.en)}</strong></div>
            <span class="gloss small" dir="rtl" lang="ar">${esc(p.t.ar)}</span>
            ${p.body}
          </div>`).join('')}
        <div class="note stack" style="gap:4px"><strong>Watch out</strong><p>${esc(unit.watchOut.en)}</p><ul class="ltr">${unit.watchOut.items.map(x => `<li>${esc(x.en)} <span class="gloss" dir="rtl" lang="ar">${esc(x.ar)}</span></li>`).join('')}</ul></div>
        ${i === UNITS.length - 1 ? `<div class="note brand"><strong>Exit role-plays:</strong> <span class="ltr" lang="en">run X1–X3 at the end of this week with two raters.</span> <a href="#/trainer/cards">Cards</a> · <a href="#/trainer/rate">Rate</a></div>` : ''}
      </div>`;
  }

  function rubricTable() {
    const R = P.rubric;
    return `${scrollBox('Rubric')}<table class="plain rubric">
      <thead><tr><th>Criterion</th>${R.scale.map(v => `<th class="num">${v}<br><span class="muted small">${esc(R.scaleLabels[v].en)}</span></th>`).join('')}</tr></thead>
      <tbody>${R.criteria.map(c => `<tr><th>${ltr(c.en)}<br><span class="gloss small" dir="rtl" lang="ar">${esc(c.ar)}</span></th>${R.scale.map(v => `<td class="small">${ltr(c.d[v].en)}<br><span class="gloss" dir="rtl" lang="ar">${esc(c.d[v].ar)}</span></td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
    <p class="small ltr" lang="en">Outcome met when the mean of both raters' totals is at least ${R.passTotal}/${R.criteria.length * R.scale[R.scale.length - 1]} and no criterion mean is below ${R.minCriterion}. Raters who differ by more than ${R.maxGap} on a criterion discuss, or a third rater decides.</p>`;
  }

  function viewCards() {
    setBar('بطاقات لعب الأدوار', 'Role-play cards and rubric');
    trainerMode();
    view.innerHTML = `
      <div class="stack-lg">
        <p class="small ltr" lang="en">The diagnostic and exit role-plays use the same four criteria. Exit scenarios use products and problems the units do not rehearse, so the measure does not depend on the exact sentences taught.</p>
        ${P.roleplayCards.map(c => {
          const a = ASSESS[c.id];
          return `
          <div class="card stack">
            <div class="row wrap"><span class="pill ${a.summative ? 'good' : ''}">${esc(c.id)}</span><strong class="ltr" lang="en">${esc(a.en)}</strong></div>
            <span class="gloss small" dir="rtl" lang="ar">${esc(a.ar)}</span>
            <p class="small"><strong>Setting:</strong> ${ltr(c.setting.en)}</p>
            <div class="note brand small"><strong>Learner task:</strong> ${ltr(c.learner.en)}<br><span dir="rtl" lang="ar">${esc(c.learner.ar)}</span></div>
            <p class="small"><strong>Interlocutor (plays the customer):</strong></p>
            <ol class="ltr small prompt-lines" lang="en" style="margin:0;padding-left:1.4em">${c.prompts.map(p => `<li><div class="row"><span>${esc(p)}</span><button class="audio-btn icon-only" type="button" data-say="${esc(p)}" data-role="c" aria-label="Play this line">${icon('volume')}</button></div></li>`).join('')}</ol>
            <p class="small"><strong>What raters look for:</strong></p>
            <ul class="plain-list small">${c.look.map(l => `<li><span class="pill brand">${esc(l.plo)}</span> ${ltr(l.en)} <span class="gloss" dir="rtl" lang="ar">— ${esc(l.ar)}</span></li>`).join('')}</ul>
          </div>`;
        }).join('')}
        <div class="card stack"><h2 class="h-card ltr" lang="en">Rubric (four criteria)</h2>${rubricTable()}</div>
        <a class="btn block" href="#/trainer/rate">${icon('pen')} Rate a role-play</a>
      </div>`;
  }

  function ratingResult(r) {
    const R = P.rubric;
    const per = R.criteria.map(c => {
      const a = r.r1.scores[c.id], b = r.r2.scores[c.id];
      return { id: c.id, a, b, mean: (a + b) / 2, gap: Math.abs(a - b) };
    });
    const t1 = per.reduce((n, x) => n + x.a, 0), t2 = per.reduce((n, x) => n + x.b, 0);
    const mean = (t1 + t2) / 2;
    const met = mean >= R.passTotal && per.every(x => x.mean >= R.minCriterion);
    const flagged = per.filter(x => x.gap > R.maxGap).map(x => x.id);
    return { per, t1, t2, mean, met, flagged, exact: per.filter(x => x.gap === 0).length, adjacent: per.filter(x => x.gap <= 1).length };
  }

  function viewRate() {
    setBar('تقييم لعب الأدوار', 'Rate a role-play');
    trainerMode();
    const R = P.rubric;
    function form(phase) {
      const pend = S.trainer.pending;
      const header = phase === 1
        ? `<label class="field">Learner name or ID<input class="input" id="rLearner" value="${esc(pend ? pend.learner : '')}"></label>
           <label class="field">Role-play<select class="input" id="rTask">${P.roleplayCards.map(c => `<option value="${c.id}">${esc(c.id)}: ${esc(ASSESS[c.id].en)}</option>`).join('')}</select></label>`
        : `<div class="note brand"><strong>Rater 2</strong> <span class="ltr" lang="en">— rate independently. Rater 1's scores stay hidden until you save.</span><br>${esc(pend.learner)} · ${esc(pend.task)}</div>`;
      view.innerHTML = `
        <div class="stack-lg">
          <div class="card stack">
            ${header}
            <label class="field">Rater ${phase} name<input class="input" id="rName"></label>
          </div>
          ${R.criteria.map(c => `
            <fieldset class="card stack" style="border:1px solid var(--line)">
              <legend class="sr-only">${esc(c.en)}</legend>
              <strong class="ltr" lang="en">${esc(c.id)} ${esc(c.en)}</strong>
              <span class="gloss small" dir="rtl" lang="ar">${esc(c.ar)}</span>
              <div class="scale">${R.scale.map(v => `<label><input type="radio" name="${c.id}" value="${v}"><span class="num">${v}</span></label>`).join('')}</div>
              <p class="small muted ltr" lang="en" id="d-${c.id}">Choose a level to see its descriptor.</p>
            </fieldset>`).join('')}
          <button class="btn block" type="button" data-act="save">Save rater ${phase}</button>
          ${phase === 2 ? '<button class="btn ghost block" type="button" data-act="cancel">Cancel this rating</button>' : ''}
        </div>`;
      R.criteria.forEach(c => $$(`input[name="${c.id}"]`).forEach(inp => inp.addEventListener('change', () => {
        $('#d-' + c.id).textContent = `${inp.value}: ${c.d[inp.value].en}`;
      })));
      const cancel = $('[data-act="cancel"]');
      if (cancel) cancel.addEventListener('click', () => { S.trainer.pending = null; save(); form(1); });
      $('[data-act="save"]').addEventListener('click', e => {
        const scores = {};
        const missing = R.criteria.filter(c => { const x = $(`input[name="${c.id}"]:checked`); if (x) scores[c.id] = +x.value; return !x; });
        if (missing.length) { toast('Score all four criteria'); return; }
        const rater = { name: $('#rName').value.trim().slice(0, 60), scores };
        if (phase === 1) {
          const learner = $('#rLearner').value.trim().slice(0, 80);
          if (!learner) { toast('Enter the learner name or ID'); return; }
          e.currentTarget.disabled = true;
          S.trainer.pending = { learner, task: $('#rTask').value, r1: rater, at: Date.now() };
          save();
          form(2);
        } else {
          e.currentTarget.disabled = true;
          const rec = { id: 'r' + Date.now().toString(36), learner: pend.learner, task: pend.task, r1: pend.r1, r2: rater, at: Date.now() };
          S.trainer.ratings.push(rec);
          S.trainer.pending = null;
          save();
          showResult(rec);
        }
        window.scrollTo(0, 0);
      });
    }
    function showResult(rec) {
      const res = ratingResult(rec);
      view.innerHTML = `
        <div class="stack-lg">
          <div class="card stack">
            <strong>${esc(rec.learner)} · ${esc(rec.task)}: ${ltr(ASSESS[rec.task].en)}</strong>
            ${scrollBox('Rating by criterion')}<table class="plain">
              <thead><tr><th>Criterion</th><th>R1</th><th>R2</th><th>Mean</th><th>Gap</th></tr></thead>
              <tbody>${res.per.map(x => `<tr><td>${ltr(P.rubric.criteria.find(c => c.id === x.id).en)}</td><td class="num">${x.a}</td><td class="num">${x.b}</td><td class="num">${x.mean.toFixed(1)}</td>
                <td class="num">${x.gap > P.rubric.maxGap ? `<span class="pill bad">${x.gap}</span>` : x.gap}</td></tr>`).join('')}
                <tr><th>Total</th><th class="num">${res.t1}</th><th class="num">${res.t2}</th><th class="num">${res.mean.toFixed(1)}</th><th></th></tr></tbody>
            </table></div>
            <p class="pill ${res.met ? 'good' : 'amber'}">${res.met ? 'Meets the standard' : 'Not yet at the standard'}</p>
            ${res.flagged.length ? feedback(false, `Raters differ by more than ${P.rubric.maxGap} on ${res.flagged.join(', ')}.`, 'Discuss the evidence, or ask a third rater.') : feedback(true, 'Raters agree within one point on every criterion.')}
          </div>
          <a class="btn block" href="#/trainer/rate">Rate another</a>
          <a class="btn ghost block" href="#/trainer/ratings">All ratings and agreement</a>
        </div>`;
    }
    const pending = S.trainer.pending;
    if (pending && pending.r1) form(2); else form(1);
  }

  function viewRatings() {
    setBar('النتائج والاتفاق', 'Ratings and agreement');
    trainerMode();
    const list = S.trainer.ratings;
    if (!list.length) {
      view.innerHTML = `<div class="empty">${icon('chart')}<p>No ratings saved on this device yet.</p></div><a class="btn block" href="#/trainer/rate">Rate a role-play</a>`;
      return;
    }
    const results = list.map(r => ({ r, res: ratingResult(r) }));
    const n = results.length * P.rubric.criteria.length;
    const exact = results.reduce((s, x) => s + x.res.exact, 0);
    const adj = results.reduce((s, x) => s + x.res.adjacent, 0);
    const flagged = results.filter(x => x.res.flagged.length).length;
    // Diagnostic → exit per learner
    const learners = uniq(list.map(r => r.learner));
    const growth = learners.map(name => {
      const mine = results.filter(x => x.r.learner === name);
      const dx = mine.filter(x => x.r.task === 'DX').map(x => x.res.mean);
      const exits = mine.filter(x => x.r.task !== 'DX');
      return {
        name,
        dx: dx.length ? dx[dx.length - 1] : null,
        exit: exits.length ? exits.reduce((s, x) => s + x.res.mean, 0) / exits.length : null,
        met: exits.length ? exits.filter(x => x.res.met).length + '/' + exits.length : '—'
      };
    });
    view.innerHTML = `
      <div class="stack-lg">
        <div class="stat-grid">
          <div class="stat"><div class="v">${pct(exact, n)}%</div><div class="l ltr" lang="en">exact agreement</div></div>
          <div class="stat"><div class="v">${pct(adj, n)}%</div><div class="l ltr" lang="en">within 1 point</div></div>
          <div class="stat"><div class="v">${flagged}</div><div class="l ltr" lang="en">need discussion</div></div>
        </div>
        <p class="small muted ltr" lang="en">Agreement is computed per criterion across ${results.length} double-rated role-play${results.length === 1 ? '' : 's'} (${n} criterion ratings).</p>
        <div class="card stack">
          <h2 class="h-card ltr" lang="en">Diagnostic → exit, per learner (mean total of two raters, out of ${P.rubric.criteria.length * 4})</h2>
          ${scrollBox('Diagnostic and exit per learner')}<table class="plain">
            <thead><tr><th>Learner</th><th>DX</th><th>Exit mean</th><th>Exit met</th></tr></thead>
            <tbody>${growth.map(g => `<tr><td>${esc(g.name)}</td><td class="num">${g.dx != null ? g.dx.toFixed(1) : '—'}</td><td class="num">${g.exit != null ? g.exit.toFixed(1) : '—'}</td><td class="num">${g.met}</td></tr>`).join('')}</tbody>
          </table></div>
        </div>
        <div class="card stack">
          <h2 class="h-card ltr" lang="en">All ratings</h2>
          ${scrollBox('All ratings')}<table class="plain">
            <thead><tr><th>Learner</th><th>Task</th><th>R1</th><th>R2</th><th>Mean</th><th></th><th></th></tr></thead>
            <tbody>${results.map(({ r, res }) => `<tr>
              <td>${esc(r.learner)}<br><span class="muted small">${fmtDateEn(r.at)}</span></td><td>${esc(r.task)}</td>
              <td class="num">${res.t1}</td><td class="num">${res.t2}</td><td class="num">${res.mean.toFixed(1)}</td>
              <td>${res.met ? '<span class="pill good">met</span>' : '<span class="pill amber">not yet</span>'}${res.flagged.length ? ' <span class="pill bad">gap</span>' : ''}</td>
              <td><button class="btn ghost small" type="button" data-del="${esc(r.id)}" aria-label="Delete">${icon('trash')}</button></td></tr>`).join('')}</tbody>
          </table></div>
        </div>
        <button class="btn block" type="button" data-act="csv">${icon('download')} Export CSV</button>
        <a class="btn ghost block" href="#/trainer/rate">Rate another</a>
      </div>`;
    $$('[data-del]').forEach(b => b.addEventListener('click', () => {
      if (!confirm('Delete this rating?')) return;
      S.trainer.ratings = S.trainer.ratings.filter(r => r.id !== b.dataset.del);
      save(); render();
    }));
    $('[data-act="csv"]').addEventListener('click', () => {
      const C = P.rubric.criteria.map(c => c.id);
      const head = ['learner', 'task', 'date', 'rater1', ...C.map(c => 'r1_' + c), 'rater2', ...C.map(c => 'r2_' + c), 'r1_total', 'r2_total', 'mean_total', 'met'];
      const q = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
      const rows = results.map(({ r, res }) => [r.learner, r.task, new Date(r.at).toISOString(), r.r1.name, ...C.map(c => r.r1.scores[c]), r.r2.name, ...C.map(c => r.r2.scores[c]), res.t1, res.t2, res.mean, res.met ? 1 : 0].map(q).join(','));
      const blob = new Blob(['﻿' + [head.join(','), ...rows].join('\n')], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${P.meta.id}-roleplay-ratings-${dayKey()}.csv`;
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    });
  }

  // Two reviewers map the exit assessment to the outcomes independently; report agreement.
  function viewAlign() {
    setBar('فحص المواءمة', 'Alignment check');
    trainerMode();
    const tasks = P.assessments.filter(a => a.summative);
    const al = S.trainer.align; // read again after each save: S may be replaced by another tab
    function grid(who) {
      view.innerHTML = `
        <div class="stack-lg">
          <div class="note brand"><strong>Reviewer ${who}</strong> <span class="ltr" lang="en">— for each exit task, tick every outcome you think it assesses. Work alone; ${who === 'B' ? 'Reviewer A\'s answers stay hidden.' : 'Reviewer B goes next.'}</span></div>
          <div class="card stack">
            <label class="field">Reviewer ${who} name<input class="input" id="aName"></label>
          </div>
          ${tasks.map(t => {
            const card = P.roleplayCards.find(c => c.id === t.id);
            return `
            <div class="card stack">
              <strong class="ltr" lang="en">${esc(t.id)}: ${esc(t.en)}</strong>
              <p class="small ltr" lang="en">${esc(card ? card.learner.en : t.note.en)}</p>
              <div class="row wrap">${P.outcomes.map(o => `
                <label class="pill" style="cursor:pointer" title="${esc(o.en)}"><input type="checkbox" data-t="${t.id}" data-o="${o.id}"> ${esc(o.id)}</label>`).join('')}</div>
            </div>`;
          }).join('')}
          <details class="acc"><summary>Outcomes <span class="chev">${icon('down')}</span></summary>
            <div class="acc-body">${P.outcomes.map(o => `<p class="small ltr" lang="en"><strong>${esc(o.id)}</strong> ${esc(o.en)}</p>`).join('')}</div></details>
          <button class="btn block" type="button" data-act="save">Save reviewer ${who}</button>
        </div>`;
      // Reviewer B's form appears where A's button was: ignore clicks for a moment so a
      // double click cannot submit it.
      const saveBtn = $('[data-act="save"]');
      saveBtn.disabled = true;
      setTimeout(() => { if (saveBtn.isConnected) saveBtn.disabled = false; }, 600);
      saveBtn.addEventListener('click', e => {
        const map = {};
        tasks.forEach(t => { map[t.id] = P.outcomes.filter(o => $(`input[data-t="${t.id}"][data-o="${o.id}"]`).checked).map(o => o.id); });
        if (tasks.some(t => !map[t.id].length)) { toast('Tick at least one outcome for each task'); return; }
        e.currentTarget.disabled = true;
        S.trainer.align[who] = { name: $('#aName').value.trim().slice(0, 60), map, at: Date.now() };
        save();
        if (who === 'A') grid('B'); else results();
        window.scrollTo(0, 0);
      });
    }
    function kappa(xs, ys) {
      const n = xs.length;
      const po = xs.filter((x, i) => x === ys[i]).length / n;
      const pa = xs.filter(Boolean).length / n, pb = ys.filter(Boolean).length / n;
      const pe = pa * pb + (1 - pa) * (1 - pb);
      return { po, k: pe === 1 ? null : (po - pe) / (1 - pe) };
    }
    function results() {
      const al = S.trainer.align;
      const cells = [];
      tasks.forEach(t => P.outcomes.forEach(o => cells.push({ t: t.id, o: o.id })));
      const vec = m => cells.map(c => (m[c.t] || []).includes(c.o));
      const A = vec(al.A.map), B = vec(al.B.map), D = vec(Object.fromEntries(tasks.map(t => [t.id, t.plos])));
      const ab = kappa(A, B), ad = kappa(A, D), bd = kappa(B, D);
      const dis = cells.filter((c, i) => A[i] !== B[i]);
      const fmtK = k => (k == null ? '—' : k.toFixed(2));
      view.innerHTML = `
        <div class="stack-lg">
          <div class="stat-grid">
            <div class="stat"><div class="v">${Math.round(ab.po * 100)}%</div><div class="l ltr" lang="en">agreement A–B</div></div>
            <div class="stat"><div class="v">${fmtK(ab.k)}</div><div class="l ltr" lang="en">Cohen's kappa</div></div>
            <div class="stat"><div class="v">${dis.length}</div><div class="l ltr" lang="en">cells differ</div></div>
          </div>
          <p class="small muted ltr" lang="en">${cells.length} task-by-outcome decisions (${tasks.length} exit tasks × ${P.outcomes.length} outcomes). Reviewer A: ${esc(al.A.name || '—')}; Reviewer B: ${esc(al.B.name || '—')}.</p>
          <div class="card stack">
            <h2 class="h-card ltr" lang="en">Each reviewer against the design matrix</h2>
            <table class="plain"><tbody>
              <tr><th>Reviewer A</th><td class="num">${Math.round(ad.po * 100)}% · κ ${fmtK(ad.k)}</td></tr>
              <tr><th>Reviewer B</th><td class="num">${Math.round(bd.po * 100)}% · κ ${fmtK(bd.k)}</td></tr>
            </tbody></table>
          </div>
          ${dis.length ? `<div class="card stack"><h2 class="h-card ltr" lang="en">Where the reviewers differ</h2>
            <ul class="plain-list small">${dis.map(c => `<li>${ltr(`${c.t} × ${c.o}: A ${(al.A.map[c.t] || []).includes(c.o) ? 'yes' : 'no'}, B ${(al.B.map[c.t] || []).includes(c.o) ? 'yes' : 'no'}; design ${ASSESS[c.t].plos.includes(c.o) ? 'yes' : 'no'}`)}</li>`).join('')}</ul></div>` : feedback(true, 'The reviewers agree on every cell.')}
          <p class="small muted ltr" lang="en">Report this agreement before the pilot. If a task is changed, change only the alignment, using equated tasks and a second rater.</p>
          <button class="btn ghost block" type="button" data-act="reset">Start a new check</button>
        </div>`;
      $('[data-act="reset"]').addEventListener('click', () => { if (!confirm('Clear both reviewers?')) return; S.trainer.align = { A: null, B: null }; save(); render(); });
    }
    if (al.A && al.B) results();
    else if (al.A) grid('B');
    else grid('A');
  }

  // =====================================================================
  // Boot
  // =====================================================================
  function boot() {
    $('#backBtn').innerHTML = icon('back');
    $('#settingsBtn').innerHTML = icon('settings');
    $$('.tab-bar [data-icon]').forEach(a => { a.insertAdjacentHTML('afterbegin', icon(a.dataset.icon)); });
    $('#backBtn').addEventListener('click', goBack);
    $('.skip').addEventListener('click', e => { e.preventDefault(); view.focus(); });
    $('#helpBtn').addEventListener('click', openHelp);
    applySettings();
    if (!S.profile.startedAt) { S.profile.startedAt = dayKey(); save(); }
    if (hasProgress()) keepStorage();
    window.addEventListener('hashchange', render);
    // iOS Safari applies :active (the pressed look of cards) only when a touch listener exists.
    document.addEventListener('touchstart', () => {}, { passive: true });
    render();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
    }
  }
  boot();
})();
