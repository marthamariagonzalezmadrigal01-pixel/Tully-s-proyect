/* ═══════════════════════════════════════════
   BUROCRAPP — app.js
   Router · Auth · Search · Firestore
═══════════════════════════════════════════ */

let currentUser   = null;
let navStack      = [];
let activePanel   = null;  // current tramite in panel

/* ─────────────────────────────────────────
   BOOT
───────────────────────────────────────── */
window.addEventListener('load', () => {
  buildCats();
  registerSW();

  // Wait for Firebase module to load (it's an ES module)
  const poll = setInterval(() => {
    if (window.$fb && window.$auth) {
      clearInterval(poll);
      window.$fb.onAuthStateChanged(window.$auth, async user => {
        currentUser = user;
        if (user) {
          await refreshUserUI(user);
          show('s-home');
        } else {
          show('s-inicio');
        }
      });
    }
  }, 80);
});

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

/* ─────────────────────────────────────────
   ROUTER
───────────────────────────────────────── */
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  if (navStack[navStack.length - 1] !== id) navStack.push(id);
  // clear search when leaving
  if (id !== 's-buscar') { const q = document.getElementById('q'); if (q) { q.value = ''; search(''); } }
}

function goBack() {
  navStack.pop();
  const prev = navStack[navStack.length - 1] || 's-inicio';
  // don't push again
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(prev);
  if (el) el.classList.add('active');
}

/* ─────────────────────────────────────────
   AUTH — REGISTER
───────────────────────────────────────── */
async function doRegister() {
  const name  = v('r-name');
  const curp  = v('r-curp');
  const email = v('r-email');
  const pass  = v('r-pass');
  const errEl = document.getElementById('reg-err');
  const btn   = document.getElementById('reg-btn');

  hide(errEl);

  if (!name)             return setErr(errEl, 'Ingresa tu nombre completo.');
  if (curp.length !== 18) return setErr(errEl, 'La CURP debe tener exactamente 18 caracteres.');
  if (!email.includes('@')) return setErr(errEl, 'Ingresa un correo electrónico válido.');
  if (pass.length < 8)   return setErr(errEl, 'La contraseña debe tener al menos 8 caracteres.');

  setLoading(btn, true);
  try {
    // Check if CURP already registered
    const q = window.$fb.query(
      window.$fb.collection(window.$db, 'usuarios'),
      window.$fb.where('curp', '==', curp)
    );
    const snap = await window.$fb.getDocs(q);
    if (!snap.empty) return setErr(errEl, 'Esta CURP ya está registrada.');

    const { user } = await window.$fb.createUserWithEmailAndPassword(window.$auth, email, pass);
    await window.$fb.setDoc(window.$fb.doc(window.$db, 'usuarios', user.uid), {
      nombre: name, curp, email, creadoEn: new Date().toISOString()
    });
    currentUser = user;
    await refreshUserUI(user);
    toast(`¡Bienvenido/a, ${name.split(' ')[0]}! 🎉`);
    show('s-home');
  } catch (e) {
    setErr(errEl, fbMsg(e.code));
  } finally {
    setLoading(btn, false);
  }
}

/* ─────────────────────────────────────────
   AUTH — LOGIN
───────────────────────────────────────── */
async function doLogin() {
  const curp  = v('l-curp');
  const pass  = v('l-pass');
  const errEl = document.getElementById('login-err');
  const btn   = document.getElementById('login-btn');

  hide(errEl);

  if (curp.length !== 18) return setErr(errEl, 'CURP debe tener 18 caracteres.');
  if (!pass)              return setErr(errEl, 'Ingresa tu contraseña.');

  setLoading(btn, true);
  try {
    // Look up email by CURP
    const q = window.$fb.query(
      window.$fb.collection(window.$db, 'usuarios'),
      window.$fb.where('curp', '==', curp)
    );
    const snap = await window.$fb.getDocs(q);
    if (snap.empty) throw { code: 'auth/user-not-found' };

    const { email } = snap.docs[0].data();
    const { user }  = await window.$fb.signInWithEmailAndPassword(window.$auth, email, pass);
    currentUser = user;
    await refreshUserUI(user);
    await loadHistorial(user.uid);
    toast('¡Sesión iniciada! 👋');
    show('s-home');
  } catch (e) {
    setErr(errEl, fbMsg(e.code));
  } finally {
    setLoading(btn, false);
  }
}

/* ─────────────────────────────────────────
   AUTH — LOGOUT
───────────────────────────────────────── */
async function doLogout() {
  await window.$fb.signOut(window.$auth);
  currentUser = null;
  navStack = [];
  document.getElementById('docs-container').innerHTML = emptyHtml('📂', 'Sin documentos aún.<br/>Inicia un trámite para comenzar.');
  document.getElementById('historial-body').innerHTML = emptyHtml('📋', 'Sin trámites aún.');
  toast('Sesión cerrada 👋');
  show('s-inicio');
}

/* ─────────────────────────────────────────
   FIRESTORE — Load user profile
───────────────────────────────────────── */
async function refreshUserUI(user) {
  try {
    const snap = await window.$fb.getDoc(window.$fb.doc(window.$db, 'usuarios', user.uid));
    if (snap.exists()) {
      const d = snap.data();
      const fn = (d.nombre || 'Usuario').split(' ')[0];
      document.getElementById('greeting').textContent = `¡Hola, ${fn}!`;
      document.getElementById('p-name').textContent   = d.nombre || '—';
      document.getElementById('p-curp').textContent   = d.curp   || '—';
    }
    await loadHistorial(user.uid);
  } catch (e) { console.warn(e); }
}

/* ─────────────────────────────────────────
   FIRESTORE — Load historial
───────────────────────────────────────── */
async function loadHistorial(uid) {
  try {
    const q = window.$fb.query(
      window.$fb.collection(window.$db, 'tramites'),
      window.$fb.where('uid', '==', uid),
      window.$fb.orderBy('fecha', 'desc')
    );
    const snap  = await window.$fb.getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderDocs(items);
    renderHistorial(items);
  } catch (e) { console.warn(e); }
}

function renderDocs(items) {
  const el = document.getElementById('docs-container');
  if (!items.length) { el.innerHTML = emptyHtml('📂', 'Sin documentos aún.<br/>Inicia un trámite para comenzar.'); return; }
  el.innerHTML = items.slice(0, 6).map(t => {
    const tr = getTramite(t.tramiteId);
    const chipCls = { pendiente:'chip-pend', proceso:'chip-proc', completado:'chip-done' }[t.estado] || 'chip-pend';
    return `
    <div class="doc-card" onclick="openPanel('${t.tramiteId}')">
      <div class="doc-card-top">
        <div class="doc-card-top-icon">${tr?.icon || '📄'}</div>
        <div class="doc-card-top-name">${t.nombre}</div>
      </div>
      <div class="doc-card-info">
        <div class="doc-row"><span class="doc-lbl">Fecha</span><span class="doc-val">${fmtDate(t.fecha)}</span></div>
        <div class="doc-row"><span class="doc-lbl">Estado</span><span class="chip ${chipCls}">${t.estado || 'pendiente'}</span></div>
      </div>
    </div>`;
  }).join('');
}

function renderHistorial(items) {
  const el = document.getElementById('historial-body');
  if (!items.length) { el.innerHTML = emptyHtml('📋', 'Sin trámites aún.'); return; }
  el.innerHTML = items.map(t => {
    const tr = getTramite(t.tramiteId);
    return `
    <div class="h-item" onclick="openPanel('${t.tramiteId}')">
      <div class="h-ico" style="background:${tr?.color || '#eee'}">${tr?.icon || '📄'}</div>
      <div style="flex:1"><div class="h-name">${t.nombre}</div><div class="h-date">${fmtDate(t.fecha)}</div></div>
      <span class="chip ${{ pendiente:'chip-pend',proceso:'chip-proc',completado:'chip-done' }[t.estado]||'chip-pend'}">${t.estado||'pendiente'}</span>
    </div>`;
  }).join('');
}

/* ─────────────────────────────────────────
   FIRESTORE — Save tramite
───────────────────────────────────────── */
async function saveTramite() {
  if (!currentUser) {
    closePanel();
    toast('Inicia sesión para guardar');
    show('s-login');
    return;
  }
  if (!activePanel) return;

  const btn = document.getElementById('cta-btn');
  setLoading(btn, true);
  try {
    await window.$fb.addDoc(window.$fb.collection(window.$db, 'tramites'), {
      uid:       currentUser.uid,
      tramiteId: activePanel.id,
      nombre:    activePanel.name,
      estado:    'pendiente',
      fecha:     new Date().toISOString(),
    });
    await loadHistorial(currentUser.uid);
    closePanel();
    toast('Trámite guardado ✅');
    show('s-home');
  } catch (e) {
    toast('Error al guardar. Intenta de nuevo.');
  } finally {
    setLoading(btn, false);
  }
}

/* ─────────────────────────────────────────
   SEARCH — Fuzzy
───────────────────────────────────────── */
function fuzzy(q, text) {
  q = norm(q); text = norm(text);
  if (text.includes(q)) return 1;
  let qi = 0, sc = 0;
  for (let i = 0; i < text.length && qi < q.length; i++) { if (text[i] === q[qi]) { sc++; qi++; } }
  return qi < q.length ? 0 : sc / text.length;
}

function hl(text, q) {
  if (!q) return text;
  const i = norm(text).indexOf(norm(q));
  return i >= 0 ? text.slice(0,i) + '<mark>' + text.slice(i, i+q.length) + '</mark>' + text.slice(i+q.length) : text;
}

function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }

function search(q) {
  const resEl  = document.getElementById('results');
  const catsEl = document.getElementById('cats');
  const noEl   = document.getElementById('no-results');

  if (!q.trim()) { resEl.style.display='none'; catsEl.style.display='block'; noEl.style.display='none'; return; }
  catsEl.style.display = 'none';

  const res = TRAMITES
    .map(t => ({ ...t, score: Math.max(fuzzy(q,t.name), fuzzy(q,t.cat), fuzzy(q,t.desc)*.6) }))
    .filter(t => t.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, 7);

  if (!res.length) { resEl.style.display='none'; noEl.style.display='flex'; document.getElementById('nq').textContent=q; return; }
  noEl.style.display = 'none';
  resEl.innerHTML = res.map(t => `
    <div class="res-item" onclick="openPanel('${t.id}')">
      <div class="res-ico" style="background:${t.color}">${t.icon}</div>
      <div style="flex:1"><div class="res-name">${hl(t.name,q)}</div><div class="res-cat">${t.cat}</div></div>
      <div class="res-arr">›</div>
    </div>`).join('');
  resEl.style.display = 'block';
}

/* ─────────────────────────────────────────
   CATEGORIES
───────────────────────────────────────── */
function buildCats() {
  document.getElementById('cats-grid').innerHTML = CATS.map(c => `
    <div class="cat-card" onclick="filterCat('${c.label}')">
      <span class="ci" style="background:${c.color}">${c.icon}</span>
      <span class="cn">${c.label}</span>
    </div>`).join('');
}

function filterCat(cat) { document.getElementById('q').value = cat; search(cat); }

/* ─────────────────────────────────────────
   PANEL
───────────────────────────────────────── */
function openPanel(id) {
  const t = getTramite(id);
  if (!t) return;
  activePanel = t;

  document.getElementById('p-title').textContent = t.name;
  document.getElementById('p-icon').textContent  = t.icon;
  document.getElementById('p-desc').textContent  = t.desc;
  document.getElementById('p-body').innerHTML = `
    <div class="p-section">
      <h3>Información general</h3>
      <div class="p-chips">
        <div class="p-chip"><div class="p-chip-lbl">Costo</div><div class="p-chip-val">${t.costo}</div></div>
        <div class="p-chip"><div class="p-chip-lbl">Tiempo</div><div class="p-chip-val">${t.tiempo}</div></div>
      </div>
    </div>
    <div class="p-section">
      <h3>Requisitos</h3>
      ${t.reqs.map(r => `<div class="req-item">✅ ${r}</div>`).join('')}
    </div>
    <div class="p-section">
      <h3>¿Dónde tramitarlo?</h3>
      <div class="where-box">📍 ${t.donde}</div>
    </div>`;

  document.getElementById('cta-btn').querySelector('.btn-label').textContent =
    currentUser ? 'Iniciar trámite' : '🔐 Inicia sesión para tramitar';

  document.getElementById('panel').classList.add('open');
}

function closePanel() {
  document.getElementById('panel').classList.remove('open');
  activePanel = null;
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function getTramite(id)   { return TRAMITES.find(t => t.id === id); }
function v(id)            { return (document.getElementById(id)?.value || '').trim(); }
function hide(el)         { el.style.display = 'none'; }
function setErr(el, msg)  { el.textContent = msg; el.style.display = 'block'; }
function emptyHtml(ico, txt) { return `<div class="empty-state"><div class="empty-icon">${ico}</div><p>${txt}</p></div>`; }

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric' });
}

function setLoading(btn, on) {
  btn.disabled = on;
  btn.querySelector('.btn-label').style.display = on ? 'none' : '';
  btn.querySelector('.btn-spin').style.display  = on ? '' : 'none';
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

function toggleEye(id, btn) {
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function updateCurpBar(inp) {
  document.getElementById('curp-progress').style.width = (inp.value.length / 18 * 100) + '%';
}

function fbMsg(code) {
  return ({
    'auth/email-already-in-use': 'Este correo ya está registrado.',
    'auth/wrong-password':       'Contraseña incorrecta.',
    'auth/user-not-found':       'CURP no encontrada. ¿Tienes cuenta?',
    'auth/weak-password':        'Contraseña muy débil (mín. 8 caracteres).',
    'auth/invalid-email':        'Correo electrónico inválido.',
    'auth/network-request-failed':'Sin conexión. Verifica tu internet.',
    'auth/too-many-requests':    'Demasiados intentos. Espera un momento.',
    'auth/invalid-credential':   'CURP o contraseña incorrectos.',
  })[code] || 'Error inesperado. Intenta de nuevo.';
}

// Expose to window (called from HTML onclick)
Object.assign(window, {
  show, goBack,
  doLogin, doRegister, doLogout,
  search, filterCat,
  openPanel, closePanel, saveTramite,
  toggleEye, updateCurpBar,
});
