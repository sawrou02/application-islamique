const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000/api'
  : '/api';

let token = localStorage.getItem('admin_token');

function showMsg(text, type = 'success') {
  const c = document.getElementById('msg-container');
  const d = document.createElement('div');
  d.className = `msg ${type}`;
  d.textContent = text;
  c.appendChild(d);
  setTimeout(() => d.remove(), 4000);
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (res.status === 401) { logout(); return null; }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────
document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errEl = document.getElementById('login-error');
  errEl.style.display = 'none';
  try {
    const data = await fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json());
    if (!data.success) throw new Error(data.message || 'Erreur');
    token = data.data.token;
    localStorage.setItem('admin_token', token);
    document.getElementById('user-info').textContent = data.data.user.pseudo;
    showApp();
  } catch (e) {
    errEl.textContent = e.message || 'Identifiants incorrects';
    errEl.style.display = 'block';
  }
});

document.getElementById('logout-btn').addEventListener('click', logout);
function logout() {
  localStorage.removeItem('admin_token');
  token = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'block';
}

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  loadSignalements();
}

// ── Tabs ──────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const id = tab.dataset.tab;
    document.getElementById(`panel-${id}`).classList.add('active');
    if (id === 'signalements') loadSignalements();
    else if (id === 'questions') loadQuestions();
    else if (id === 'users') loadUsers();
  });
});

// ── Signalements ─────────────────────────────────────────────────────────
async function loadSignalements() {
  const tbody = document.getElementById('tbody-signalements');
  tbody.innerHTML = '<tr><td colspan="5" class="empty">Chargement...</td></tr>';
  try {
    const data = await apiFetch('/admin/signalements');
    if (!data) return;
    const rows = data.data || [];

    const statsEl = document.getElementById('stats-signalements');
    statsEl.innerHTML = `
      <div class="stat-card"><div class="num">${rows.length}</div><div class="label">En attente</div></div>
      <div class="stat-card"><div class="num">${rows.filter(r=>r.motif==='erreur_contenu').length}</div><div class="label">Erreur contenu</div></div>
      <div class="stat-card"><div class="num">${rows.filter(r=>r.motif==='dalil_incorrect').length}</div><div class="label">Dalil incorrect</div></div>
    `;

    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">Aucun signalement en attente 🎉</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(r => `
      <tr>
        <td class="q-text" title="${escHtml(r.question_texte || '')}">${escHtml(r.question_texte || r.question_id)}</td>
        <td><span class="badge badge-orange">${escHtml(r.motif)}</span></td>
        <td style="max-width:200px;font-size:12px;color:#555">${escHtml(r.detail || '—')}</td>
        <td style="white-space:nowrap;font-size:11px;color:#888">${fmtDate(r.created_at)}</td>
        <td>
          <div class="actions">
            <button onclick="traiterSignalement('${r.id}','valider')">✓ Valider</button>
            <button class="warning" onclick="traiterSignalement('${r.id}','suspendre')">⏸ Suspendre</button>
            <button class="danger" onclick="traiterSignalement('${r.id}','rejeter')">✕ Rejeter</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty" style="color:#C62828">Erreur : ${e.message}</td></tr>`;
  }
}

async function traiterSignalement(id, action) {
  try {
    await apiFetch(`/admin/signalements/${id}/traiter`, { method: 'POST', body: { action } });
    showMsg(`Signalement ${action === 'valider' ? 'validé' : action === 'suspendre' ? 'suspendu' : 'rejeté'} avec succès`);
    loadSignalements();
  } catch (e) {
    showMsg('Erreur : ' + e.message, 'error');
  }
}

// ── Questions en attente ──────────────────────────────────────────────────
async function loadQuestions() {
  const tbody = document.getElementById('tbody-questions');
  tbody.innerHTML = '<tr><td colspan="5" class="empty">Chargement...</td></tr>';
  try {
    const data = await apiFetch('/admin/questions/en-attente');
    if (!data) return;
    const rows = data.data || [];
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">Aucune question en attente 🎉</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(q => `
      <tr>
        <td class="q-text" title="${escHtml(q.texte_fr)}">${escHtml(q.texte_fr)}</td>
        <td><span class="badge badge-green">${escHtml(q.domaine)}</span></td>
        <td style="text-align:center">${q.niveau}</td>
        <td>${escHtml(q.madhab || '—')}</td>
        <td>
          <div class="actions">
            <button onclick="validerQuestion('${q.id}')">✓ Valider</button>
            <button class="danger" onclick="rejeterQuestion('${q.id}')">✕ Rejeter</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty" style="color:#C62828">Erreur : ${e.message}</td></tr>`;
  }
}

async function validerQuestion(id) {
  try {
    await apiFetch(`/admin/questions/${id}/valider`, { method: 'POST' });
    showMsg('Question validée avec succès');
    loadQuestions();
  } catch (e) {
    showMsg('Erreur : ' + e.message, 'error');
  }
}

async function rejeterQuestion(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette question définitivement ?')) return;
  try {
    await apiFetch(`/admin/questions/${id}/rejeter`, { method: 'POST' });
    showMsg('Question supprimée');
    loadQuestions();
  } catch (e) {
    showMsg('Erreur : ' + e.message, 'error');
  }
}

// ── Utilisateurs ──────────────────────────────────────────────────────────
async function loadUsers() {
  const tbody = document.getElementById('tbody-users');
  tbody.innerHTML = '<tr><td colspan="6" class="empty">Chargement...</td></tr>';
  try {
    const data = await apiFetch('/admin/users');
    if (!data) return;
    const rows = data.data || [];
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">Aucun utilisateur trouvé</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(u => `
      <tr>
        <td style="font-weight:600">${escHtml(u.pseudo)}</td>
        <td style="font-size:12px;color:#666">${escHtml(u.email)}</td>
        <td>${u.niveau || 1}</td>
        <td style="color:#1B5E20;font-weight:600">${u.xp_total || 0} XP</td>
        <td><span class="badge ${u.role === 'admin' ? 'badge-red' : 'badge-green'}">${u.role || 'user'}</span></td>
        <td style="font-size:11px;color:#888">${fmtDate(u.created_at)}</td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty" style="color:#C62828">Erreur : ${e.message}</td></tr>`;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────
function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmtDate(s) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
}

// ── Init ──────────────────────────────────────────────────────────────────
if (token) showApp();
