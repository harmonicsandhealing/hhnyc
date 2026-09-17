const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

const app = document.getElementById('app');
let currentClient = null; // {id, name, age}
let pendingParsedClientName = null;

// ---------- boot ----------
(async function init() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) showList();
  else showLogin();
})();

// ---------- view helpers ----------
function render(html) { app.innerHTML = html; }

function showLogin() {
  render(`
    <div class="login-screen">
      <h1>Harmonics &amp; Healing</h1>
      <p class="sub">Client log — sign in</p>
      <label for="email">Email</label>
      <input id="email" type="email" autocomplete="username" />
      <label for="password">Password</label>
      <input id="password" type="password" autocomplete="current-password" />
      <div id="login-error" class="error hidden"></div>
      <button class="primary" id="login-btn">Log in</button>
    </div>
  `);
  document.getElementById('login-btn').onclick = doLogin;
  document.getElementById('password').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
}

async function doLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    errEl.textContent = error.message;
    errEl.classList.remove('hidden');
    return;
  }
  showList();
}

async function doLogout() {
  await sb.auth.signOut();
  showLogin();
}

// ---------- client list ----------
async function showList() {
  render(`
    <header class="top">
      <span class="brand">Client Log</span>
      <button id="logout-btn">Log out</button>
    </header>
    <main>
      <div class="search-row">
        <input id="search" placeholder="Search clients…" />
      </div>
      <div id="client-list"><p class="empty-state">Loading…</p></div>
      <button class="secondary" id="new-client-btn">+ New client</button>
    </main>
  `);
  document.getElementById('logout-btn').onclick = doLogout;
  document.getElementById('new-client-btn').onclick = showNewClientForm;
  document.getElementById('search').oninput = e => renderClientList(allClients, e.target.value);

  const { data: clients, error } = await sb.from('clients').select('id,name,age').order('name');
  const { data: sessions } = await sb.from('sessions').select('client_id,session_date').order('session_date', { ascending: false });

  allClients = (clients || []).map(c => {
    const last = (sessions || []).find(s => s.client_id === c.id);
    return { ...c, lastSession: last ? last.session_date : null };
  });
  renderClientList(allClients, '');
}

let allClients = [];

function renderClientList(clients, filter) {
  const el = document.getElementById('client-list');
  const f = (filter || '').toLowerCase();
  const shown = clients.filter(c => c.name.toLowerCase().includes(f));
  if (!shown.length) {
    el.innerHTML = `<p class="empty-state">No clients yet. Add your first client below.</p>`;
    return;
  }
  el.innerHTML = shown.map(c => `
    <div class="client-item" data-id="${c.id}">
      <span class="name">${escapeHtml(c.name)}</span>
      <span class="meta">${c.age ? c.age + ' yrs<br/>' : ''}${c.lastSession ? 'last: ' + c.lastSession : 'no sessions yet'}</span>
    </div>
  `).join('');
  el.querySelectorAll('.client-item').forEach(node => {
    node.onclick = () => openClient(node.dataset.id);
  });
}

function showNewClientForm() {
  render(`
    <header class="top"><span class="brand">New client</span><button id="cancel-btn">Cancel</button></header>
    <main>
      <label>Name</label>
      <input id="c-name" value="${pendingParsedClientName ? escapeHtml(pendingParsedClientName) : ''}" />
      <label>Age</label>
      <input id="c-age" type="number" />
      <label>Standing notes (optional)</label>
      <textarea id="c-notes" placeholder="Recurring themes, preferences, context…"></textarea>
      <div id="c-error" class="error hidden"></div>
      <button class="primary" id="c-save">Save client</button>
    </main>
  `);
  pendingParsedClientName = null;
  document.getElementById('cancel-btn').onclick = showList;
  document.getElementById('c-save').onclick = async () => {
    const name = document.getElementById('c-name').value.trim();
    const age = document.getElementById('c-age').value || null;
    const notes = document.getElementById('c-notes').value.trim() || null;
    const errEl = document.getElementById('c-error');
    if (!name) { errEl.textContent = 'Name is required.'; errEl.classList.remove('hidden'); return; }
    const { error } = await sb.from('clients').insert({ name, age, notes });
    if (error) { errEl.textContent = error.message; errEl.classList.remove('hidden'); return; }
    showList();
  };
}

// ---------- client detail ----------
async function openClient(clientId) {
  const { data: client } = await sb.from('clients').select('*').eq('id', clientId).single();
  const { data: sessions } = await sb.from('sessions').select('*').eq('client_id', clientId).order('session_date', { ascending: false });
  currentClient = client;

  render(`
    <header class="top"><span class="brand">${escapeHtml(client.name)}</span><button id="logout-btn">Log out</button></header>
    <main>
      <div class="back-link" id="back-link">&larr; All clients</div>
      <div class="client-header">
        <h2>${escapeHtml(client.name)}</h2>
        <div class="meta">${client.age ? client.age + ' yrs' : ''}</div>
        ${client.notes ? `<p class="hint">${escapeHtml(client.notes)}</p>` : ''}
      </div>
      <button class="primary" id="new-session-btn">+ New session</button>
      <div id="sessions">
        ${(sessions || []).length ? sessions.map(renderSessionCard).join('') : '<p class="empty-state">No sessions logged yet.</p>'}
      </div>
    </main>
  `);
  document.getElementById('logout-btn').onclick = doLogout;
  document.getElementById('back-link').onclick = showList;
  document.getElementById('new-session-btn').onclick = () => showNewSessionForm(client);

  document.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => {
      const card = tab.closest('.session-card');
      card.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      card.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      card.querySelector(`.tab-content[data-for="${tab.dataset.tab}"]`).classList.remove('hidden');
    };
  });
}

function renderSessionCard(s) {
  return `
    <div class="session-card">
      <div class="date">${s.session_date}</div>
      <div class="tabs">
        <div class="tab active" data-tab="followup">Client follow-up</div>
        <div class="tab" data-tab="internal">Internal notes</div>
      </div>
      <div class="tab-content" data-for="followup">${escapeHtml(s.client_followup || '—')}</div>
      <div class="tab-content hidden" data-for="internal">${escapeHtml(s.internal_notes || '—')}</div>
    </div>
  `;
}

// ---------- new session ----------
function showNewSessionForm(client) {
  render(`
    <header class="top"><span class="brand">New session</span><button id="cancel-btn">Cancel</button></header>
    <main>
      <p class="hint">For ${escapeHtml(client.name)}</p>
      <div class="mode-switch">
        <button id="mode-paste" class="active">Paste from Claude</button>
        <button id="mode-manual">Type manually</button>
      </div>

      <div id="paste-mode">
        <label>Paste the structured block Claude gave you</label>
        <textarea id="paste-text" placeholder="CLIENT: ...&#10;AGE: ...&#10;DATE: ...&#10;---FOLLOWUP---&#10;...&#10;---INTERNAL---&#10;..."></textarea>
        <button class="secondary" id="parse-btn">Parse</button>
      </div>

      <div id="manual-mode" class="hidden">
        <label>Date</label>
        <input id="s-date" type="date" value="${new Date().toISOString().slice(0,10)}" />
        <label>Client follow-up</label>
        <textarea id="s-followup"></textarea>
        <label>Internal notes</label>
        <textarea id="s-internal"></textarea>
      </div>

      <div id="s-error" class="error hidden"></div>
      <button class="primary" id="s-save">Save session</button>
    </main>
  `);

  document.getElementById('cancel-btn').onclick = () => openClient(client.id);
  document.getElementById('mode-paste').onclick = () => switchMode('paste');
  document.getElementById('mode-manual').onclick = () => switchMode('manual');

  let lastRawPaste = '';

  document.getElementById('parse-btn').onclick = () => {
    const raw = document.getElementById('paste-text').value;
    lastRawPaste = raw;
    const parsed = parsePaste(raw);
    switchMode('manual');
    document.getElementById('s-date').value = parsed.date || new Date().toISOString().slice(0,10);
    document.getElementById('s-followup').value = parsed.followup || '';
    document.getElementById('s-internal').value = parsed.internal || '';
    if (parsed.clientName && parsed.clientName.toLowerCase() !== client.name.toLowerCase()) {
      document.getElementById('s-error').textContent =
        `Note: pasted block says "${parsed.clientName}" — saving under ${client.name} anyway. Open that client instead if this is the wrong one.`;
      document.getElementById('s-error').classList.remove('hidden');
    }
  };

  document.getElementById('s-save').onclick = async () => {
    const date = document.getElementById('s-date').value;
    const followup = document.getElementById('s-followup').value.trim();
    const internal = document.getElementById('s-internal').value.trim();
    const errEl = document.getElementById('s-error');
    if (!date) { errEl.textContent = 'Date is required.'; errEl.classList.remove('hidden'); return; }
    const { error } = await sb.from('sessions').insert({
      client_id: client.id,
      session_date: date,
      client_followup: followup || null,
      internal_notes: internal || null,
      raw_paste: lastRawPaste || null
    });
    if (error) { errEl.textContent = error.message; errEl.classList.remove('hidden'); return; }
    openClient(client.id);
  };

  function switchMode(mode) {
    document.getElementById('mode-paste').classList.toggle('active', mode === 'paste');
    document.getElementById('mode-manual').classList.toggle('active', mode === 'manual');
    document.getElementById('paste-mode').classList.toggle('hidden', mode !== 'paste');
    document.getElementById('manual-mode').classList.toggle('hidden', mode !== 'manual');
  }
}

// ---------- paste parser ----------
// Expected block shape:
// CLIENT: Name
// AGE: 47
// DATE: 2026-09-17
// ---FOLLOWUP---
// <client-facing text>
// ---INTERNAL---
// <internal text>
function parsePaste(raw) {
  const result = { clientName: null, age: null, date: null, followup: '', internal: '' };
  const clientMatch = raw.match(/^CLIENT:\s*(.+)$/mi);
  const ageMatch = raw.match(/^AGE:\s*(\d+)/mi);
  const dateMatch = raw.match(/^DATE:\s*(\d{4}-\d{2}-\d{2})/mi);
  if (clientMatch) result.clientName = clientMatch[1].trim();
  if (ageMatch) result.age = ageMatch[1];
  if (dateMatch) result.date = dateMatch[1];

  const followupMatch = raw.match(/---FOLLOWUP---([\s\S]*?)(?:---INTERNAL---|$)/i);
  const internalMatch = raw.match(/---INTERNAL---([\s\S]*)/i);
  if (followupMatch) result.followup = followupMatch[1].trim();
  if (internalMatch) result.internal = internalMatch[1].trim();
  return result;
}

// ---------- utils ----------
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}
