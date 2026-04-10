// ===== Supabase 設定 =====
const SUPABASE_URL = 'https://dfsvbztprtckxgttsprh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmc3ZienRwcnRja3hndHRzcHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzAwMzAsImV4cCI6MjA4NTMwNjAzMH0.NJ0FuF6YF7NHa-gXhyyaFN3IK3AOA00EslJ-Z4Z86dY';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== 全域狀態 =====
let currentUser = { name: '', role: '' };
let currentProject = null;
let currentCardId = null;
let zoomLevel = 1;
const ZOOM_MIN = 0.3;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;
const CARD_W = 220;
const CARD_H = 120;
const GAP_X = 280;
const GAP_Y = 160;
const OFFSET_X = 40;
const OFFSET_Y = 40;

// ===== 登入 =====
function doLogin() {
  const name = document.getElementById('login-name').value.trim();
  const role = document.querySelector('input[name="role"]:checked').value;
  if (!name) {
    document.getElementById('login-name').style.borderColor = '#F44336';
    return;
  }
  currentUser = { name, role };
  localStorage.setItem('vivi-board-user', JSON.stringify(currentUser));
  showApp();
}

async function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('user-badge').textContent = `${currentUser.name}（${currentUser.role}）`;

  // 填充專案選單
  const select = document.getElementById('project-select');
  select.innerHTML = '';
  for (const [key, proj] of Object.entries(PROJECTS)) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = proj.name;
    select.appendChild(opt);
  }

  // 從 Supabase 載入資料
  await loadFromSupabase();

  // 載入第一個專案
  switchProject(Object.keys(PROJECTS)[0]);

  // 訂閱即時更新
  subscribeRealtime();
}

// ===== Supabase 資料同步 =====
async function loadFromSupabase() {
  // 載入卡片狀態
  const { data: statuses } = await sb
    .from('board_card_status')
    .select('*');

  if (statuses) {
    statuses.forEach(row => {
      if (!PROJECTS[row.project_id]) return;
      const card = PROJECTS[row.project_id].cards.find(c => c.id === row.card_id);
      if (card) card.status = row.status;
    });
  }

  // 載入留言
  const { data: comments } = await sb
    .from('board_comments')
    .select('*')
    .order('created_at', { ascending: true });

  if (comments) {
    // 先清空所有留言
    for (const proj of Object.values(PROJECTS)) {
      proj.cards.forEach(card => { card.comments = []; });
    }
    comments.forEach(row => {
      if (!PROJECTS[row.project_id]) return;
      const card = PROJECTS[row.project_id].cards.find(c => c.id === row.card_id);
      if (card) {
        card.comments.push({
          author: row.author,
          role: row.role,
          text: row.text,
          time: formatTime(new Date(row.created_at))
        });
      }
    });
  }
}

function subscribeRealtime() {
  // 監聽留言新增
  sb.channel('board-comments')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'board_comments' }, payload => {
      const row = payload.new;
      if (!PROJECTS[row.project_id]) return;
      const card = PROJECTS[row.project_id].cards.find(c => c.id === row.card_id);
      if (!card) return;

      // 避免重複（自己剛發的）
      const exists = card.comments.some(c =>
        c.author === row.author && c.text === row.text &&
        c.time === formatTime(new Date(row.created_at))
      );
      if (exists) return;

      card.comments.push({
        author: row.author,
        role: row.role,
        text: row.text,
        time: formatTime(new Date(row.created_at))
      });

      // 如果正在看這張卡 → 刷新留言
      if (currentProject === row.project_id && currentCardId === row.card_id) {
        renderComments(card);
      }
      renderBoard();
    })
    .subscribe();

  // 監聽狀態更新
  sb.channel('board-status')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'board_card_status' }, payload => {
      const row = payload.new;
      if (!PROJECTS[row.project_id]) return;
      const card = PROJECTS[row.project_id].cards.find(c => c.id === row.card_id);
      if (card) {
        card.status = row.status;
        renderBoard();
        // 如果正在看這張卡 → 更新面板
        if (currentProject === row.project_id && currentCardId === row.card_id) {
          document.getElementById('panel-status-select').value = row.status;
        }
      }
    })
    .subscribe();
}

function formatTime(date) {
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// ===== 專案切換 =====
function switchProject(projectId) {
  currentProject = projectId;
  closePanel();
  renderBoard();
}

// ===== 渲染白板 =====
function renderBoard() {
  const project = PROJECTS[currentProject];
  const container = document.getElementById('cards-container');
  const svg = document.getElementById('connections');
  container.innerHTML = '';
  svg.innerHTML = '';

  const positions = {};
  project.cards.forEach(card => {
    const x = OFFSET_X + card.col * GAP_X;
    const y = OFFSET_Y + (card.row + 1.5) * GAP_Y;
    positions[card.id] = { x, y };

    const el = document.createElement('div');
    el.className = `card status-${card.status}-bar`;
    el.id = `card-${card.id}`;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.onclick = () => openPanel(card.id);

    const commentCount = card.comments ? card.comments.length : 0;

    el.innerHTML = `
      <div class="card-category">${card.category}</div>
      <div class="card-title">${card.title}</div>
      <div class="card-footer">
        <span class="card-status status-${card.status}">${statusLabel(card.status)}</span>
        <span class="card-comments">\u{1F4AC} ${commentCount}</span>
      </div>
    `;
    container.appendChild(el);
  });

  // 繪製連接線
  project.cards.forEach(card => {
    if (!card.next) return;
    const from = positions[card.id];
    if (!from) return;

    card.next.forEach(nextId => {
      const to = positions[nextId];
      if (!to) return;

      const x1 = from.x + CARD_W;
      const y1 = from.y + CARD_H / 2;
      const x2 = to.x;
      const y2 = to.y + CARD_H / 2;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      svg.appendChild(line);

      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowLen = 10;
      const ax = x2 - arrowLen * Math.cos(angle - 0.4);
      const ay = y2 - arrowLen * Math.sin(angle - 0.4);
      const bx = x2 - arrowLen * Math.cos(angle + 0.4);
      const by = y2 - arrowLen * Math.sin(angle + 0.4);

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      arrow.setAttribute('points', `${x2},${y2} ${ax},${ay} ${bx},${by}`);
      svg.appendChild(arrow);
    });
  });
}

function statusLabel(status) {
  switch (status) {
    case 'confirmed': return '\u2705 已確認';
    case 'discuss': return '\u{1F4CC} 待討論';
    case 'gap': return '\u274C API缺口';
    default: return status;
  }
}

// ===== 面板 =====
function openPanel(cardId) {
  const project = PROJECTS[currentProject];
  const card = project.cards.find(c => c.id === cardId);
  if (!card) return;

  currentCardId = cardId;

  document.querySelectorAll('.card').forEach(el => el.classList.remove('active'));
  document.getElementById(`card-${cardId}`).classList.add('active');

  document.getElementById('panel-title').textContent = `【${card.category}】${card.title}`;
  document.getElementById('panel-status-select').value = card.status;

  let content = escapeHtml(card.content);
  content = content.replace(/\u{1F4CC}[^\n]*/gu, '<span class="highlight-discuss">$&</span>');
  content = content.replace(/\u274C[^\n]*/g, '<span class="highlight-gap">$&</span>');
  content = content.replace(/\u2705[^\n]*/g, '<span class="highlight-confirmed">$&</span>');
  content = content.replace(/\u2753[^\n]*/g, '<span class="highlight-discuss">$&</span>');
  document.getElementById('panel-content').innerHTML = content;

  renderComments(card);
  document.getElementById('panel').classList.remove('panel-hidden');
}

function closePanel() {
  document.getElementById('panel').classList.add('panel-hidden');
  document.querySelectorAll('.card').forEach(el => el.classList.remove('active'));
  currentCardId = null;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== 狀態更新 =====
async function updateCardStatus() {
  if (!currentCardId) return;
  const project = PROJECTS[currentProject];
  const card = project.cards.find(c => c.id === currentCardId);
  if (!card) return;

  const newStatus = document.getElementById('panel-status-select').value;
  card.status = newStatus;

  // upsert 到 Supabase
  await sb.from('board_card_status').upsert({
    project_id: currentProject,
    card_id: currentCardId,
    status: newStatus,
    updated_by: currentUser.name,
    updated_at: new Date().toISOString()
  }, { onConflict: 'project_id,card_id' });

  renderBoard();

  setTimeout(() => {
    const el = document.getElementById(`card-${currentCardId}`);
    if (el) el.classList.add('active');
  }, 10);
}

// ===== 留言 =====
function renderComments(card) {
  const list = document.getElementById('comments-list');
  if (!card.comments || card.comments.length === 0) {
    list.innerHTML = '<div class="no-comments">尚無留言，留下第一則留言吧</div>';
    return;
  }
  list.innerHTML = card.comments.map(c => `
    <div class="comment">
      <div class="comment-meta">
        <span class="comment-author">${escapeHtml(c.author)}</span>
        <span class="comment-role">（${escapeHtml(c.role)}）</span>
        <span class="comment-time">${c.time}</span>
      </div>
      <div class="comment-body">${escapeHtml(c.text)}</div>
    </div>
  `).join('');
  list.scrollTop = list.scrollHeight;
}

async function addComment() {
  if (!currentCardId) return;
  const textarea = document.getElementById('comment-text');
  const text = textarea.value.trim();
  if (!text) return;

  const project = PROJECTS[currentProject];
  const card = project.cards.find(c => c.id === currentCardId);
  if (!card) return;

  if (!card.comments) card.comments = [];

  const now = new Date();
  const time = formatTime(now);

  // 先在本地顯示
  card.comments.push({
    author: currentUser.name,
    role: currentUser.role,
    text: text,
    time: time
  });

  textarea.value = '';
  renderComments(card);
  renderBoard();

  // 寫入 Supabase
  await sb.from('board_comments').insert({
    project_id: currentProject,
    card_id: currentCardId,
    author: currentUser.name,
    role: currentUser.role,
    text: text
  });

  setTimeout(() => {
    const el = document.getElementById(`card-${currentCardId}`);
    if (el) el.classList.add('active');
  }, 10);
}

// ===== 縮放 =====
function setZoom(level) {
  zoomLevel = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, level));
  const board = document.getElementById('board');
  board.style.transform = `scale(${zoomLevel})`;
  board.style.transformOrigin = 'top left';
  document.getElementById('zoom-display').textContent = Math.round(zoomLevel * 100) + '%';
}

function zoomIn() { setZoom(zoomLevel + ZOOM_STEP); }
function zoomOut() { setZoom(zoomLevel - ZOOM_STEP); }
function zoomFit() {
  const project = PROJECTS[currentProject];
  if (!project) return;
  let maxX = 0, maxY = 0;
  project.cards.forEach(card => {
    const x = OFFSET_X + card.col * GAP_X + CARD_W;
    const y = OFFSET_Y + (card.row + 1.5) * GAP_Y + CARD_H;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  });
  const container = document.getElementById('board-container');
  const scaleX = (container.clientWidth - 60) / maxX;
  const scaleY = (container.clientHeight - 60) / maxY;
  setZoom(Math.min(scaleX, scaleY, 1));
  container.scrollLeft = 0;
  container.scrollTop = 0;
}

// Ctrl/Cmd + 滾輪縮放
document.addEventListener('wheel', (e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom(zoomLevel + delta);
  }
}, { passive: false });

// Enter 送出留言
document.addEventListener('keydown', (e) => {
  if (e.target.id === 'comment-text' && e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    addComment();
  }
  if (e.key === 'Escape') {
    closePanel();
  }
});

// ===== 初始化 =====
(function init() {
  const saved = localStorage.getItem('vivi-board-user');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
      if (currentUser.name) {
        showApp();
        return;
      }
    } catch (e) {}
  }
  document.getElementById('login-screen').style.display = 'flex';
})();
