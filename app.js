// ===== Firebase / Firestore 設定 =====
firebase.initializeApp({
  apiKey: "AIzaSyC4en4_40m2UFCaqgPyWDr_CVU4Yp4GM-Y",
  authDomain: "gen-lang-client-0000195777.firebaseapp.com",
  projectId: "gen-lang-client-0000195777",
  storageBucket: "gen-lang-client-0000195777.firebasestorage.app",
  messagingSenderId: "153654770920",
  appId: "1:153654770920:web:010755920515b951459d5d"
});
const db = firebase.firestore();

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
let boardUsers = []; // Firestore 已註冊使用者

async function loadBoardUsers() {
  try {
    const snap = await db.collection('board_users').orderBy('name').get();
    boardUsers = [];
    snap.forEach(doc => boardUsers.push({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.warn('載入使用者清單失敗', e);
    boardUsers = [];
  }
  return boardUsers;
}

let boardUsersLoaded = false;

function getSelectedRole() {
  const checked = document.querySelector('input[name="role"]:checked');
  return checked ? checked.value : '';
}

async function onRoleChange() {
  const role = getSelectedRole();
  const select = document.getElementById('login-user-select');
  if (!boardUsersLoaded) {
    await loadBoardUsers();
    boardUsersLoaded = true;
  }
  const filtered = boardUsers.filter(u => u.role === role);
  select.innerHTML = '';
  if (filtered.length > 0) {
    filtered.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.name;
      opt.textContent = u.name;
      select.appendChild(opt);
    });
  }
  // 永遠加上「新成員」選項
  const newOpt = document.createElement('option');
  newOpt.value = '__new__';
  newOpt.textContent = '＋ 我是新成員';
  select.appendChild(newOpt);
  onUserSelect();
}

function onUserSelect() {
  const val = document.getElementById('login-user-select').value;
  document.getElementById('login-new-name').style.display = val === '__new__' ? 'block' : 'none';
}

async function doLogin() {
  const role = getSelectedRole();
  const selectVal = document.getElementById('login-user-select').value;
  let name;

  if (selectVal === '__new__') {
    name = document.getElementById('login-name').value.trim();
    if (!name) {
      document.getElementById('login-name').style.borderColor = '#F44336';
      return;
    }
    // 存到 Firestore（失敗不擋登入）
    try {
      await db.collection('board_users').add({
        name: name,
        role: role,
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (e) {
      console.warn('儲存使用者失敗', e);
    }
    boardUsers.push({ name, role });
  } else {
    name = selectVal;
  }

  if (!name) return;
  currentUser = { name, role };
  localStorage.setItem('vivi-board-user', JSON.stringify(currentUser));
  showApp();
}

function doLogout() {
  localStorage.removeItem('vivi-board-user');
  currentUser = { name: '', role: '' };
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  onRoleChange();
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

  // 從 Firestore 載入資料（任一失敗不影響其他）
  await loadFromFirestore().catch(e => console.warn('載入卡片/留言失敗', e));
  await loadDecisions().catch(e => console.warn('載入決議失敗', e));
  await loadNotes().catch(e => console.warn('載入筆記失敗', e));
  await loadDiscussionState().catch(e => console.warn('載入討論狀態失敗', e));
  await loadCardPositions().catch(e => console.warn('載入卡片位置失敗', e));

  // 載入第一個專案
  switchProject(Object.keys(PROJECTS)[0]);

  // 訂閱即時更新
  subscribeRealtime();
  subscribeDecisions();
  subscribeNotes();
}

// ===== Firestore 資料同步 =====
async function loadFromFirestore() {
  // 載入卡片狀態
  const statusSnap = await db.collection('board_card_status').get();
  statusSnap.forEach(doc => {
    const row = doc.data();
    if (!PROJECTS[row.project_id]) return;
    const card = PROJECTS[row.project_id].cards.find(c => c.id === row.card_id);
    if (card) card.status = row.status;
  });

  // 載入留言
  const commentsSnap = await db.collection('board_comments')
    .orderBy('created_at', 'asc')
    .get();

  // 先清空所有留言
  for (const proj of Object.values(PROJECTS)) {
    proj.cards.forEach(card => { card.comments = []; });
  }
  commentsSnap.forEach(doc => {
    const row = doc.data();
    if (!PROJECTS[row.project_id]) return;
    const card = PROJECTS[row.project_id].cards.find(c => c.id === row.card_id);
    if (card) {
      card.comments.push({
        id: doc.id,
        author: row.author,
        role: row.role,
        text: row.text,
        time: formatTime(row.created_at ? row.created_at.toDate() : new Date())
      });
    }
  });
}

function subscribeRealtime() {
  // 監聽留言新增
  db.collection('board_comments')
    .orderBy('created_at', 'asc')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type !== 'added') return;
        const row = change.doc.data();
        if (!PROJECTS[row.project_id]) return;
        const card = PROJECTS[row.project_id].cards.find(c => c.id === row.card_id);
        if (!card) return;

        // 避免重複
        if (card.comments.some(c => c.id === change.doc.id)) return;

        card.comments.push({
          id: change.doc.id,
          author: row.author,
          role: row.role,
          text: row.text,
          time: formatTime(row.created_at ? row.created_at.toDate() : new Date())
        });

        if (currentProject === row.project_id && currentCardId === row.card_id) {
          renderComments(card);
        }
        renderBoard();
      });
    });

  // 監聽狀態更新
  db.collection('board_card_status')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'removed') return;
        const row = change.doc.data();
        if (!PROJECTS[row.project_id]) return;
        const card = PROJECTS[row.project_id].cards.find(c => c.id === row.card_id);
        if (card) {
          card.status = row.status;
          renderBoard();
          if (currentProject === row.project_id && currentCardId === row.card_id) {
            document.getElementById('panel-status-select').value = row.status;
          }
        }
      });
    });
}

function formatTime(date) {
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// ===== 專案切換 =====
function switchProject(projectId) {
  currentProject = projectId;
  closePanel();
  renderBrief();
  renderBoard();
}

// ===== 渲染白板 =====
function renderBoard() {
  const project = PROJECTS[currentProject];
  const container = document.getElementById('cards-container');
  const svg = document.getElementById('connections');
  container.innerHTML = '';
  svg.innerHTML = '';

  // 渲染白板頂部架構圖
  renderArchBanner(container);

  const archCollapsed = localStorage.getItem('vivi-board-arch-collapsed') === 'true';
  const ARCH_OFFSET_Y = archCollapsed ? 60 : 360;

  const positions = {};
  project.cards.forEach(card => {
    const x = OFFSET_X + card.col * GAP_X;
    const y = ARCH_OFFSET_Y + OFFSET_Y + (card.row + 1.5) * GAP_Y;
    positions[card.id] = { x, y };
  });
  positions_cache = positions;

  project.cards.forEach(card => {
    const { x, y } = positions[card.id];

    const el = document.createElement('div');
    el.className = `card status-${card.status}-bar`;
    el.id = `card-${card.id}`;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.onclick = () => openPanel(card.id);

    const commentCount = card.comments ? card.comments.length : 0;
    const mockupData = card.mockup && MOCKUPS ? MOCKUPS[card.mockup] : null;

    if (mockupData) {
      // 示意畫面卡片：可自由縮放
      el.className = `card-mockup-embed status-${card.status}-bar`;
      el.style.width = '500px';
      el.innerHTML = `
        <div class="mockup-header">
          <div class="card-mockup-label">${card.category}</div>
          <div class="card-mockup-title">${card.title}</div>
        </div>
        <div class="mockup-body">
          ${mockupData.html}
        </div>
        <div class="mockup-resizer" data-card-id="${card.id}"></div>
      `;
      el.onclick = (e) => { if (!e.target.closest('.mockup-resizer')) openPanel(card.id); };
      // 縮放把手
      const resizer = el.querySelector('.mockup-resizer');
      makeResizable(el, resizer);
    } else {
      const commentCount = card.comments ? card.comments.length : 0;
      el.innerHTML = `
        <div class="card-category">${card.category}</div>
        <div class="card-title">${card.title}</div>
        <div class="card-footer">
          <span class="card-status status-${card.status}">${statusLabel(card.status)}</span>
          <span class="card-comments">\u{1F4AC} ${commentCount}</span>
        </div>
      `;
    }
    // 拖曳功能
    makeDraggable(el, card);
    container.appendChild(el);
  });

  // 繪製連接線（智能方向）
  project.cards.forEach(card => {
    if (!card.next) return;
    const from = positions[card.id];
    if (!from) return;
    const fromW = card.mockup ? 500 : CARD_W;

    card.next.forEach(nextId => {
      const to = positions[nextId];
      if (!to) return;
      const toCard = project.cards.find(c => c.id === nextId);
      const toW = (toCard && toCard.mockup) ? 500 : CARD_W;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      let x1, y1, x2, y2;

      if (Math.abs(dy) > CARD_H && Math.abs(dy) > Math.abs(dx) * 0.8) {
        // 往下/上 → 從底部/頂部中央出發
        if (dy > 0) {
          x1 = from.x + fromW / 2; y1 = from.y + CARD_H;
          x2 = to.x + toW / 2; y2 = to.y;
        } else {
          x1 = from.x + fromW / 2; y1 = from.y;
          x2 = to.x + toW / 2; y2 = to.y + CARD_H;
        }
      } else {
        // 往右 → 從右邊中央出發
        x1 = from.x + fromW; y1 = from.y + CARD_H / 2;
        x2 = to.x; y2 = to.y + CARD_H / 2;
      }

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1); line.setAttribute('y1', y1);
      line.setAttribute('x2', x2); line.setAttribute('y2', y2);
      svg.appendChild(line);

      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowLen = 10;
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      arrow.setAttribute('points', `${x2},${y2} ${x2 - arrowLen * Math.cos(angle - 0.4)},${y2 - arrowLen * Math.sin(angle - 0.4)} ${x2 - arrowLen * Math.cos(angle + 0.4)},${y2 - arrowLen * Math.sin(angle + 0.4)}`);
      svg.appendChild(arrow);
    });
  });
}

function makeResizable(el, handle) {
  let startX, startY, startW, startH;

  handle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    startW = el.offsetWidth;
    startH = el.offsetHeight;

    const onMove = (e2) => {
      const dw = (e2.clientX - startX) / zoomLevel;
      const dh = (e2.clientY - startY) / zoomLevel;
      el.style.width = Math.max(200, startW + dw) + 'px';
      el.style.height = Math.max(100, startH + dh) + 'px';
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      const project = PROJECTS[currentProject];
      if (project && positions_cache) {
        redrawConnections(project, positions_cache);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
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

  renderBrief();

  // 寫入 Firestore（用 project_id + card_id 當 doc ID）
  const docId = `${currentProject}_${currentCardId}`;
  await db.collection('board_card_status').doc(docId).set({
    project_id: currentProject,
    card_id: currentCardId,
    status: newStatus,
    updated_by: currentUser.name,
    updated_at: firebase.firestore.FieldValue.serverTimestamp()
  });

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

  // 先更新 UI
  const now = new Date();
  card.comments.push({
    id: 'temp_' + Date.now(),
    author: currentUser.name,
    role: currentUser.role,
    text: text,
    time: formatTime(now)
  });
  renderComments(card);
  renderBoard();
  textarea.value = '';

  // 再寫 Firestore
  try {
    await db.collection('board_comments').add({
      project_id: currentProject,
      card_id: currentCardId,
      author: currentUser.name,
      role: currentUser.role,
      text: text,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.warn('留言寫入失敗', e);
  }
}

// ===== 縮放 + 平移 =====
let panX = 0, panY = 0;

function applyTransform() {
  const board = document.getElementById('board');
  board.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  board.style.transformOrigin = 'top left';
}

function setZoom(level) {
  zoomLevel = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, level));
  applyTransform();
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
  panX = 0;
  panY = 0;
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

// ===== 畫布拖曳平移（Canva 風格）=====
(function initCanvasPan() {
  const container = document.getElementById('board-container');
  let isPanning = false;
  let panStartX, panStartY, panOrigX, panOrigY;

  // 判斷是否點在「背景」上
  function isBackground(target) {
    // 點在卡片或控制元素上 → 不是背景
    if (target.closest('.card, .card-mockup-embed, .arch-banner, .zoom-controls, .brief-panel, .comment-panel, button, input, textarea, select')) {
      return false;
    }
    // 其他都算背景（board-container, board, cards-container, svg 等）
    return container.contains(target);
  }

  container.addEventListener('mousedown', (e) => {
    if (!isBackground(e.target)) return;

    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panOrigX = panX;
    panOrigY = panY;
    container.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    panX = panOrigX + (e.clientX - panStartX);
    panY = panOrigY + (e.clientY - panStartY);
    applyTransform();
  });

  document.addEventListener('mouseup', () => {
    if (isPanning) {
      isPanning = false;
      container.style.cursor = 'grab';
    }
  });
})();

// Enter 送出留言
document.addEventListener('keydown', (e) => {
  // 留言框 Enter 不送出，讓使用者自由換行，只能按「送出」按鈕
  if (e.target.id === 'decision-text' && e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    addDecision();
  }
  if (e.key === 'Escape') {
    closeMockup();
    closePanel();
  }
});

// ===== 決議紀錄 =====
let decisions = [];

async function loadDecisions() {
  const projId = currentProject || Object.keys(PROJECTS)[0];
  const snap = await db.collection('board_decisions')
    .orderBy('created_at', 'desc')
    .get();
  decisions = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (d.project_id !== projId) return;
    decisions.push({
      id: doc.id,
      ...d,
      date: d.date || '',
      text: d.text || '',
      author: d.author || ''
    });
  });
}

function subscribeDecisions() {
  db.collection('board_decisions')
    .orderBy('created_at', 'desc')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type !== 'added') return;
        const row = change.doc.data();
        if (row.project_id !== currentProject) return;
        if (decisions.some(d => d.id === change.doc.id)) return;
        decisions.unshift({ id: change.doc.id, ...row });
        renderDecisionsList();
      });
    });
}

function renderDecisionsList() {
  const list = document.getElementById('decisions-list');
  if (!list) return;

  if (decisions.length === 0) {
    list.innerHTML = '<div class="brief-no-decisions">尚無決議紀錄</div>';
    return;
  }

  list.innerHTML = decisions.map(d => `
    <div class="brief-decision">
      <div class="brief-decision-header">
        <span class="brief-decision-date">${escapeHtml(d.date)}</span>
        <span class="brief-decision-author">${escapeHtml(d.author)}</span>
      </div>
      <div class="brief-decision-text">${escapeHtml(d.text)}</div>
    </div>
  `).join('');
}

async function addDecision() {
  const textarea = document.getElementById('decision-text');
  const text = textarea.value.trim();
  if (!text) return;

  const now = new Date();
  const date = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;

  textarea.value = '';

  // 寫入 Firestore（onSnapshot 會自動更新 UI）
  await db.collection('board_decisions').add({
    project_id: currentProject,
    date: date,
    text: text,
    author: currentUser.name,
    created_at: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// ===== 個人筆記 =====
let myNotes = [];

async function loadNotes() {
  try {
    const projId = currentProject || Object.keys(PROJECTS)[0];
    const snap = await db.collection('board_notes')
      .where('project_id', '==', projId)
      .where('author', '==', currentUser.name)
      .orderBy('created_at', 'desc')
      .get();
    myNotes = [];
    snap.forEach(doc => myNotes.push({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.warn('載入筆記失敗', e);
    myNotes = [];
  }
}

function subscribeNotes() {
  const projId = currentProject || Object.keys(PROJECTS)[0];
  db.collection('board_notes')
    .where('project_id', '==', projId)
    .where('author', '==', currentUser.name)
    .orderBy('created_at', 'desc')
    .onSnapshot(snapshot => {
      myNotes = [];
      snapshot.forEach(doc => myNotes.push({ id: doc.id, ...doc.data() }));
      renderNotesList();
    }, e => console.warn('筆記訂閱失敗', e));
}

function renderNotesList() {
  const list = document.getElementById('notes-list');
  if (!list) return;

  if (myNotes.length === 0) {
    list.innerHTML = '<div class="brief-no-decisions">尚無筆記</div>';
    return;
  }

  list.innerHTML = myNotes.map(n => `
    <div class="brief-decision">
      <div class="brief-decision-header">
        <span class="brief-decision-date">${escapeHtml(n.date || '')}</span>
        <span class="note-delete" onclick="deleteNote('${n.id}')" title="刪除">✕</span>
      </div>
      <div class="brief-decision-text">${escapeHtml(n.text)}</div>
    </div>
  `).join('');
}

async function addNote() {
  const textarea = document.getElementById('note-text');
  const text = textarea.value.trim();
  if (!text) return;

  const now = new Date();
  const date = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
  textarea.value = '';

  try {
    await db.collection('board_notes').add({
      project_id: currentProject,
      date: date,
      text: text,
      author: currentUser.name,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.warn('新增筆記失敗', e);
  }
}

async function deleteNote(noteId) {
  try {
    await db.collection('board_notes').doc(noteId).delete();
  } catch (e) {
    console.warn('刪除筆記失敗', e);
  }
}

// ===== 左側簡報面板 =====
function renderBrief() {
  const project = PROJECTS[currentProject];
  if (!project || !project.brief) {
    document.getElementById('brief-content').innerHTML = '';
    return;
  }
  const b = project.brief;

  let html = '';

  // 狀態儀表板（自動統計）
  const counts = { confirmed: 0, discuss: 0, gap: 0 };
  project.cards.forEach(c => { if (counts[c.status] !== undefined) counts[c.status]++; });

  html += `<div class="brief-section">
    <div class="brief-section-title">進度總覽</div>
    <div class="brief-dashboard">
      <div class="brief-stat stat-confirmed">
        <div class="brief-stat-number">${counts.confirmed}</div>
        <div class="brief-stat-label">流程已確認</div>
      </div>
      <div class="brief-stat stat-discuss">
        <div class="brief-stat-number">${counts.discuss}</div>
        <div class="brief-stat-label">流程待討論</div>
      </div>
      <div class="brief-stat stat-gap">
        <div class="brief-stat-number">${counts.gap}</div>
        <div class="brief-stat-label">API待串接</div>
      </div>
    </div>
  </div>`;

  // 我的筆記（個人）
  html += `<div class="brief-section">
    <div class="brief-section-title">我的筆記 <span class="brief-private-hint">僅個人看到</span></div>
    <div id="notes-list"></div>
    <div class="brief-decision-input">
      <textarea id="note-text" placeholder="記下你的想法或備忘..." rows="2"></textarea>
      <button onclick="addNote()">新增筆記</button>
      <div style="clear:both"></div>
    </div>
  </div>`;

  // 專案背景
  html += `<div class="brief-section">
    <div class="brief-section-title">專案背景</div>
    <div class="brief-text">${escapeHtml(b.background)}</div>
  </div>`;

  // 痛點
  html += `<div class="brief-section">
    <div class="brief-section-title">現況痛點</div>
    ${b.pain_points.map(p => `<div class="brief-pain">${escapeHtml(p)}</div>`).join('')}
  </div>`;

  // 角色
  html += `<div class="brief-section">
    <div class="brief-section-title">參與角色</div>
    ${b.roles.map(r => `
      <div class="brief-role-row">
        <span class="brief-role-name">${escapeHtml(r.name)}</span>
        <span class="brief-role-desc">${escapeHtml(r.desc)}</span>
      </div>
    `).join('')}
  </div>`;

  // 團隊
  html += `<div class="brief-section">
    <div class="brief-section-title">專案團隊</div>
    ${b.team.map(t => `
      <div class="brief-team-row">
        <span class="brief-team-role">${escapeHtml(t.role)}</span>
        <span><span class="brief-team-name">${escapeHtml(t.name)}</span> <span class="brief-team-org">${escapeHtml(t.org)}</span></span>
      </div>
    `).join('')}
  </div>`;

  // 據點
  html += `<div class="brief-section">
    <div class="brief-section-title">據點</div>
    <div class="brief-locations">
      ${b.locations.map(l => `<span class="brief-location-tag">${escapeHtml(l)}</span>`).join('')}
    </div>
  </div>`;

  // Phase 進度
  const phaseLabel = { current: '進行中', planned: '規劃中', blocked: '卡關' };
  html += `<div class="brief-section">
    <div class="brief-section-title">開發階段</div>
    ${b.phases.map(p => `
      <div class="brief-phase">
        <span class="brief-phase-id">${escapeHtml(p.id)}</span>
        <span class="brief-phase-name">${escapeHtml(p.name)}</span>
        <span class="brief-phase-badge phase-${p.status}">${phaseLabel[p.status]}</span>
      </div>
      ${p.note ? `<div class="brief-phase-note">${escapeHtml(p.note)}</div>` : ''}
    `).join('')}
  </div>`;

  // 凱惠 API 狀態表
  if (b.apis) {
    html += `<div class="brief-section">
      <div class="brief-section-title">凱惠 API 狀態</div>
      <table class="brief-api-table">
        <thead><tr><th></th><th>API</th><th>說明</th></tr></thead>
        <tbody>
        ${b.apis.existing.map(a => `
          <tr class="api-ok"><td>\u2705</td><td>${escapeHtml(a.id + ' ' + a.name)}</td><td>${escapeHtml(a.desc)}</td></tr>
        `).join('')}
        ${b.apis.gaps.map(a => `
          <tr class="api-gap"><td>\u274C</td><td>${escapeHtml(a.name)}</td><td>${escapeHtml(a.desc)}<span class="api-phase">${escapeHtml(a.phase)}</span></td></tr>
        `).join('')}
        </tbody>
      </table>
    </div>`;
  }

  // 待討論事項 checklist
  if (b.discussions) {
    html += `<div class="brief-section">
      <div class="brief-section-title">待討論事項 <span class="brief-count">${b.discussions.filter(d=>!d.done).length} 項</span></div>
      <div class="brief-checklist">
        ${b.discussions.map((d, i) => {
          const myChecked = isMyVote(i);
          const votes = discussionVotes[i] || {};
          const voters = Object.entries(votes);
          const confirmedList = voters.filter(([_, v]) => v.checked);
          const allConfirmed = voters.length > 0 && confirmedList.length === voters.length;
          return `
          <div class="brief-check-item ${myChecked ? 'my-checked' : ''} ${allConfirmed ? 'all-confirmed' : ''}">
            <label class="brief-check-label">
              <input type="checkbox" ${myChecked ? 'checked' : ''} onchange="toggleDiscussion(${i})">
              <span>${escapeHtml(d.text)}</span>
            </label>
            ${voters.length > 0 ? `
              <div class="brief-check-votes">
                ${voters.map(([name, v]) => `<span class="vote-tag ${v.checked ? 'vote-yes' : 'vote-no'}">${escapeHtml(name)} ${v.checked ? '\u2713' : '\u2014'}</span>`).join('')}
              </div>
            ` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  // 基礎設施
  if (b.infrastructure) {
    html += `<div class="brief-section">
      <div class="brief-section-title">基礎設施規劃</div>
      ${b.infrastructure.map(inf => `
        <div class="brief-infra">
          <div class="brief-infra-title">${escapeHtml(inf.title)}</div>
          <ul class="brief-infra-list">
            ${inf.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>`;
  }

  document.getElementById('brief-content').innerHTML = html;
  renderDecisionsList();
  renderNotesList();
}

// 每個人的打勾狀態：{ "討論項目index": { "userName": true/false } }
let discussionVotes = {};

async function loadDiscussionState() {
  const projId = currentProject || Object.keys(PROJECTS)[0];
  const snap = await db.collection('board_discussion_votes')
    .where('project_id', '==', projId)
    .get();
  discussionVotes = {};
  snap.forEach(doc => {
    const d = doc.data();
    const key = d.index;
    if (!discussionVotes[key]) discussionVotes[key] = {};
    discussionVotes[key][d.user] = { checked: d.checked, date: d.date || '' };
  });
}

function isMyVote(index) {
  return discussionVotes[index] &&
    discussionVotes[index][currentUser.name] &&
    discussionVotes[index][currentUser.name].checked;
}

function toggleDiscussion(index) {
  const checked = !isMyVote(index);
  const date = new Date().toLocaleDateString('zh-TW');

  // 更新本地
  if (!discussionVotes[index]) discussionVotes[index] = {};
  discussionVotes[index][currentUser.name] = { checked, date };

  // 存到 Firestore（每人每項一筆 doc）
  const docId = `${currentProject}_${index}_${currentUser.name}`;
  db.collection('board_discussion_votes').doc(docId).set({
    project_id: currentProject,
    index: index,
    user: currentUser.name,
    checked: checked,
    date: date
  });

  renderBrief();
}

// ===== 白板頂部架構圖 =====
function toggleArch() {
  const body = document.querySelector('.arch-banner-body');
  const toggle = document.querySelector('.arch-banner-toggle');
  const collapsed = !body.classList.contains('arch-collapsed');
  body.classList.toggle('arch-collapsed');
  toggle.textContent = collapsed ? '\u25B6 展開' : '\u25BC 收合';
  localStorage.setItem('vivi-board-arch-collapsed', collapsed);
  renderBoard();
}

function renderArchBanner(container) {
  const banner = document.createElement('div');
  banner.className = 'arch-banner';
  const collapsed = localStorage.getItem('vivi-board-arch-collapsed') === 'true';
  banner.innerHTML = `
    <div class="arch-banner-label">資料來源層 DATA SOURCES</div>
    <div class="arch-banner-body ${collapsed ? 'arch-collapsed' : ''}">
      <div class="arch-banner-boxes">
        <div class="arch-box">
          <div class="arch-box-title">鼎新公司</div>
          <div class="arch-box-items">
            <span>ERP</span><span>POS</span><span>HRM 人事</span><span>HRM 排班</span><span>BPM 電子表單</span><span>BI 系統</span>
          </div>
        </div>
        <div class="arch-box">
          <div class="arch-box-title">凱惠公司</div>
          <div class="arch-box-items">
            <span>POS 系統</span>
          </div>
        </div>
        <div class="arch-box">
          <div class="arch-box-title">鋒形公司</div>
          <div class="arch-box-items">
            <span>HRM 人事系統</span>
          </div>
        </div>
        <div class="arch-box">
          <div class="arch-box-title">類神經</div>
          <div class="arch-box-items">
            <span>CRM 系統</span><span>Sales Chat</span>
          </div>
        </div>
        <div class="arch-box">
          <div class="arch-box-title">行銷渠道</div>
          <div class="arch-box-items">
            <span>LINE OA</span><span>Facebook</span><span>Instagram</span><span>Google Ads</span>
          </div>
        </div>
      </div>
    </div>
    <div class="arch-banner-collapse" onclick="toggleArch()">
      ${collapsed ? '\u25B6 展開資料來源層' : '\u25BC 收合'}
    </div>
    <div class="arch-banner-emr">
      <div class="arch-banner-emr-title">電子病歷 EMR</div>
      <div class="arch-banner-emr-sub">預約 \u2192 報到 \u2192 諮詢 \u2192 施作 \u2192 核銷 \u2192 追蹤</div>
    </div>
    </div>
  `;
  container.appendChild(banner);
}

// ===== 卡片位置載入 =====
async function loadCardPositions() {
  const userName = currentUser.name;
  const projId = currentProject || Object.keys(PROJECTS)[0];
  const snap = await db.collection('board_card_positions')
    .where('project_id', '==', projId)
    .where('user', '==', userName)
    .get();
  snap.forEach(doc => {
    const d = doc.data();
    const project = PROJECTS[d.project_id];
    if (!project) return;
    const card = project.cards.find(c => c.id === d.card_id);
    if (card) {
      card.col = d.col;
      card.row = d.row;
    }
  });
}

// ===== 拖曳卡片 =====
function makeDraggable(el, card) {
  let startX, startY, origX, origY, dragging = false;

  el.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    startX = e.clientX;
    startY = e.clientY;
    origX = parseInt(el.style.left);
    origY = parseInt(el.style.top);
    dragging = false;

    const onMove = (e2) => {
      const dx = (e2.clientX - startX) / zoomLevel;
      const dy = (e2.clientY - startY) / zoomLevel;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragging = true;
      if (dragging) {
        el.style.left = (origX + dx) + 'px';
        el.style.top = (origY + dy) + 'px';
        el.style.zIndex = 10;
        // 即時更新連線
        const project = PROJECTS[currentProject];
        const pos = positions_cache;
        if (pos) {
          pos[card.id] = { x: origX + dx, y: origY + dy };
          redrawConnections(project, pos);
        }
      }
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      el.style.zIndex = '';
      if (dragging) {
        // 算出新的 col/row
        const newX = parseInt(el.style.left);
        const newY = parseInt(el.style.top);
        card.col = (newX - OFFSET_X) / GAP_X;
        card.row = (newY - OFFSET_Y) / GAP_Y - 1.5;
        // 存到 Firestore（每人獨立位置）
        const docId = `${currentProject}_${card.id}_${currentUser.name}_pos`;
        db.collection('board_card_positions').doc(docId).set({
          project_id: currentProject,
          card_id: card.id,
          user: currentUser.name,
          col: card.col,
          row: card.row
        });
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

let positions_cache = null;

function redrawConnections(project, positions) {
  const svg = document.getElementById('connections');
  svg.innerHTML = '';
  project.cards.forEach(card => {
    if (!card.next) return;
    const from = positions[card.id];
    if (!from) return;
    const fromW = card.mockup ? 500 : CARD_W;

    card.next.forEach(nextId => {
      const to = positions[nextId];
      if (!to) return;
      const toCard = project.cards.find(c => c.id === nextId);
      const toW = (toCard && toCard.mockup) ? 500 : CARD_W;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      let x1, y1, x2, y2;

      if (Math.abs(dy) > CARD_H && Math.abs(dy) > Math.abs(dx) * 0.8) {
        if (dy > 0) {
          x1 = from.x + fromW / 2; y1 = from.y + CARD_H;
          x2 = to.x + toW / 2; y2 = to.y;
        } else {
          x1 = from.x + fromW / 2; y1 = from.y;
          x2 = to.x + toW / 2; y2 = to.y + CARD_H;
        }
      } else {
        x1 = from.x + fromW; y1 = from.y + CARD_H / 2;
        x2 = to.x; y2 = to.y + CARD_H / 2;
      }

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1); line.setAttribute('y1', y1);
      line.setAttribute('x2', x2); line.setAttribute('y2', y2);
      svg.appendChild(line);

      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowLen = 10;
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      arrow.setAttribute('points', `${x2},${y2} ${x2 - arrowLen * Math.cos(angle - 0.4)},${y2 - arrowLen * Math.sin(angle - 0.4)} ${x2 - arrowLen * Math.cos(angle + 0.4)},${y2 - arrowLen * Math.sin(angle + 0.4)}`);
      svg.appendChild(arrow);
    });
  });
}

// ===== 示意畫面 Mockup =====
function showMockup(cardId) {
  const mockup = MOCKUPS[cardId];
  if (!mockup) return;

  // 移除舊的 overlay
  closeMockup();

  const overlay = document.createElement('div');
  overlay.id = 'mockup-overlay';
  overlay.innerHTML = `
    <div class="mockup-backdrop" onclick="closeMockup()"></div>
    <div class="mockup-panel">
      <div class="mockup-panel-header">
        <span class="mockup-panel-title">${mockup.title}</span>
        <button class="mockup-close" onclick="closeMockup()">\u00D7</button>
      </div>
      <div class="mockup-panel-body">
        ${mockup.html}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function closeMockup() {
  const overlay = document.getElementById('mockup-overlay');
  if (overlay) overlay.remove();
}

function toggleBrief() {
  const panel = document.getElementById('brief-panel');
  const board = document.getElementById('board-container');
  const toggle = panel.querySelector('.brief-toggle');
  const isCollapsing = !panel.classList.contains('collapsed');

  panel.classList.toggle('collapsed');

  if (isCollapsing) {
    board.style.left = '0px';
  } else {
    board.style.left = (panel.style.width || '320px');
  }

  toggle.textContent = isCollapsing ? '\u25B6' : '\u25C0';
}

// ===== 左側面板寬度調整 =====
(function initResizer() {
  const resizer = document.getElementById('brief-resizer');
  if (!resizer) return;
  const panel = document.getElementById('brief-panel');
  const board = document.getElementById('board-container');
  let startX, startW;

  resizer.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startW = panel.offsetWidth;
    resizer.classList.add('dragging');

    const onMove = (e2) => {
      const newW = Math.max(200, Math.min(600, startW + e2.clientX - startX));
      panel.style.width = newW + 'px';
      board.style.left = newW + 'px';
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      resizer.classList.remove('dragging');
      localStorage.setItem('vivi-board-panel-width', panel.style.width);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    e.preventDefault();
  });

  // 載入上次寬度
  const saved = localStorage.getItem('vivi-board-panel-width');
  if (saved) {
    panel.style.width = saved;
    board.style.left = saved;
  }
})();

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
  onRoleChange(); // 載入該角色的使用者清單
})();
