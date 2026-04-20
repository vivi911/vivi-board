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

// 匿名登入，確保 Firestore client 有 auth context
const firebaseAuth = firebase.auth();
let firebaseAuthReady = firebaseAuth.signInAnonymously().catch(e => {
  console.warn('Firebase 匿名登入失敗（Firestore 讀寫可能受限）', e);
});

// ===== 全域狀態 =====
let currentUser = { name: '', role: '' };
let currentProject = null;
let currentCardId = null;
let currentTab = 'architecture'; // 預設 Tab
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

// ===== 專案角色設定 =====
const PROJECT_ROLES = {
  "meili-emr": [
    { value: "品牌商", label: "品牌商（美力時尚）" },
    { value: "開發商", label: "開發商（采盟）" },
    { value: "POS商", label: "POS商（凱惠）" }
  ],
  "sean-vending": [
    { value: "客戶", label: "客戶（Sean 團隊）" },
    { value: "開發商", label: "開發商（goaskvivi）" }
  ],
  "asia-pacific": [
    { value: "品牌商", label: "品牌商（亞太資源）" },
    { value: "開發商", label: "開發商（學得力）" }
  ]
};

function initLoginRoles() {
  const urlParams = new URLSearchParams(window.location.search);
  const proj = urlParams.get('project');
  const roles = PROJECT_ROLES[proj] || [
    { value: "品牌商", label: "品牌商" },
    { value: "開發商", label: "開發商" }
  ];
  const container = document.getElementById('role-options');
  container.innerHTML = roles.map((r, i) => `
    <label class="role-option">
      <input type="radio" name="role" value="${r.value}" ${i === 0 ? 'checked' : ''} onchange="onRoleChange()" />
      <span class="role-label">${r.label}</span>
    </label>
  `).join('');
  onRoleChange();
}

// 頁面載入時初始化登入角色
document.addEventListener('DOMContentLoaded', initLoginRoles);

// ===== 登入 =====
let boardUsers = []; // Firestore 已註冊使用者

async function loadBoardUsers() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const project = urlParams.get('project') || '';
    const snap = await db.collection('board_users').orderBy('name').get();
    boardUsers = [];
    snap.forEach(doc => {
      const data = { id: doc.id, ...doc.data() };
      // 只顯示屬於當前專案的使用者（無 project 欄位的舊資料不顯示）
      if (data.project === project) {
        boardUsers.push(data);
      }
    });
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
      const urlParams = new URLSearchParams(window.location.search);
      const project = urlParams.get('project') || '';
      await db.collection('board_users').add({
        name: name,
        role: role,
        project: project,
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

  // 等 Firebase Auth 準備好
  await firebaseAuthReady;

  // 檢查 URL 參數鎖定專案（必須帶 ?project= 才能進入）
  const urlParams = new URLSearchParams(window.location.search);
  const lockedProject = urlParams.get('project');

  // 沒帶正確 project 參數 → 顯示錯誤，不讓進入
  if (!lockedProject || !PROJECTS[lockedProject]) {
    document.getElementById('app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'none';
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#666;">
        <div style="text-align:center;">
          <h2 style="color:#333;">找不到專案</h2>
          <p>請找 Vivi 索取專案看板網址</p>
        </div>
      </div>`;
    return;
  }

  // 填充專案選單（鎖定單一專案）
  const select = document.getElementById('project-select');
  select.innerHTML = '';
  const opt = document.createElement('option');
  opt.value = lockedProject;
  opt.textContent = PROJECTS[lockedProject].name;
  select.appendChild(opt);
  select.style.display = 'none';

  // 讀取 tab URL 參數
  const tabParam = urlParams.get('tab');
  if (tabParam && ['interview', 'research', 'architecture', 'spec'].includes(tabParam)) {
    currentTab = tabParam;
  } else {
    // 依專案設定預設 tab
    const proj = urlParams.get('project');
    currentTab = (proj === 'asia-pacific') ? 'research' : 'architecture';
  }

  // 從 Firestore 載入資料（任一失敗不影響其他）
  await loadFromFirestore().catch(e => console.warn('載入卡片/留言失敗', e));
  await loadDecisions().catch(e => console.warn('載入決議失敗', e));
  await loadNotes().catch(e => console.warn('載入筆記失敗', e));
  await loadDiscussionState().catch(e => console.warn('載入討論狀態失敗', e));
  await loadCardPositions().catch(e => console.warn('載入卡片位置失敗', e));
  await loadStickies().catch(e => console.warn('載入便利貼失敗', e));

  // 載入專案（鎖定或預設第一個）
  switchProject(lockedProject && PROJECTS[lockedProject] ? lockedProject : Object.keys(PROJECTS)[0]);

  // 切到指定 Tab
  switchTab(currentTab);

  // 訂閱即時更新
  subscribeRealtime();
  subscribeDecisions();
  subscribeNotes();
  subscribeStickies();
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

        // 替換 temp 留言（addComment 樂觀更新產生的）
        const tempIdx = card.comments.findIndex(c =>
          c.id.startsWith('temp_') && c.author === row.author && c.text === row.text
        );
        if (tempIdx !== -1) {
          card.comments[tempIdx].id = change.doc.id;
          card.comments[tempIdx].time = formatTime(row.created_at ? row.created_at.toDate() : new Date());
        } else {
          card.comments.push({
            id: change.doc.id,
            author: row.author,
            role: row.role,
            text: row.text,
            time: formatTime(row.created_at ? row.created_at.toDate() : new Date())
          });
        }

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
  renderTabs();
  renderBrief();
  renderBoard();
  loadStickies().catch(e => console.warn('載入便利貼失敗', e));
  // 如果在訪談 Tab，載入訪談資料
  if (currentTab === 'interview') {
    loadInterview().then(renderInterview);
  }
}

// ===== Tab 系統 =====
function renderTabs() {
  const tabs = (PROJECT_TABS[currentProject] || PROJECT_TABS.default);
  const bar = document.getElementById('tab-bar');
  bar.innerHTML = tabs.map(t => `
    <button class="tab-btn ${t.id === currentTab ? 'active' : ''}"
            onclick="switchTab('${t.id}')"
            data-tab="${t.id}">
      <span class="tab-icon">${t.icon}</span>${t.label}
    </button>
  `).join('');
}

function switchTab(tabId) {
  currentTab = tabId;

  // 更新 URL
  const url = new URL(window.location);
  if (tabId === 'architecture') {
    url.searchParams.delete('tab');
  } else {
    url.searchParams.set('tab', tabId);
  }
  history.replaceState(null, '', url);

  // 更新 Tab 按鈕 active 狀態
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  // 切換視圖
  const views = ['architecture', 'interview', 'research', 'spec'];
  views.forEach(v => {
    const el = document.getElementById('view-' + v);
    if (el) el.style.display = (v === tabId) ? '' : 'none';
  });

  // Legend 只在架構 Tab 顯示
  const legend = document.getElementById('board-legend');
  if (legend) legend.style.display = (tabId === 'architecture') ? '' : 'none';

  // 載入對應 Tab 的資料
  if (tabId === 'interview') {
    loadInterview().then(renderInterview);
  } else if (tabId === 'research') {
    loadResearch().then(renderResearch);
  } else if (tabId === 'spec') {
    renderSpec();
  }
}

// ===== 訪談系統 =====
let interviewData = {};
let interviewSaveTimeout = null;

async function loadInterview() {
  const projId = currentProject;
  try {
    const doc = await db.collection('board_interviews').doc(projId).get();
    if (doc.exists) {
      interviewData = doc.data();
    } else {
      // 初始化空白訪談
      interviewData = {
        project_id: projId,
        title: PROJECTS[projId] ? PROJECTS[projId].name : projId,
        date: '',
        meta: '',
        opener: '',
        sections: {}
      };
    }
  } catch (e) {
    console.warn('載入訪談失敗', e);
    interviewData = { project_id: projId, sections: {} };
  }
}

function renderInterview() {
  const header = document.getElementById('interview-header');
  const body = document.getElementById('interview-body');
  const projName = PROJECTS[currentProject] ? PROJECTS[currentProject].name : currentProject;

  // Header
  header.innerHTML = `
    <div class="interview-header-inner">
      <div class="interview-title">${escapeHtml(interviewData.title || projName)} — 需求訪談筆記</div>
      <div class="interview-meta">
        <input type="text" class="interview-meta-input" placeholder="日期 | 會議形式 | 介紹人"
               value="${escapeHtml(interviewData.meta || '')}"
               oninput="updateInterviewField('meta', this.value)">
      </div>
    </div>
  `;

  // Body — 各 section
  const template = INTERVIEW_TEMPLATE.sections;
  body.innerHTML = template.map(sec => {
    const val = (interviewData.sections && interviewData.sections[sec.id]) || '';
    return `
    <div class="interview-section">
      <div class="interview-section-header">
        <div class="interview-section-number">${sec.number}</div>
        <div class="interview-section-title">${escapeHtml(sec.title)}</div>
      </div>
      ${sec.hint ? `<div class="interview-section-hint">${escapeHtml(sec.hint)}</div>` : ''}
      <textarea placeholder="${escapeHtml(sec.placeholder)}"
                oninput="updateInterviewSection('${sec.id}', this.value)">${escapeHtml(val)}</textarea>
    </div>`;
  }).join('') + `
    <div class="interview-save-bar">
      <div class="interview-save-status" id="interview-save-status"></div>
      <button class="interview-save-btn" onclick="saveInterviewNow()">儲存</button>
    </div>
  `;
}

function updateInterviewField(field, value) {
  interviewData[field] = value;
  scheduleInterviewSave();
}

function updateInterviewSection(sectionId, value) {
  if (!interviewData.sections) interviewData.sections = {};
  interviewData.sections[sectionId] = value;
  scheduleInterviewSave();
}

function scheduleInterviewSave() {
  const statusEl = document.getElementById('interview-save-status');
  if (statusEl) {
    statusEl.textContent = '未儲存';
    statusEl.className = 'interview-save-status';
  }
  if (interviewSaveTimeout) clearTimeout(interviewSaveTimeout);
  interviewSaveTimeout = setTimeout(() => saveInterview(), 3000); // 3 秒自動存
}

async function saveInterview() {
  const projId = currentProject;
  try {
    await db.collection('board_interviews').doc(projId).set({
      ...interviewData,
      project_id: projId,
      updated_by: currentUser.name,
      updated_at: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    const statusEl = document.getElementById('interview-save-status');
    if (statusEl) {
      statusEl.textContent = '已儲存';
      statusEl.className = 'interview-save-status saved';
    }
  } catch (e) {
    console.warn('儲存訪談失敗', e);
    const statusEl = document.getElementById('interview-save-status');
    if (statusEl) {
      statusEl.textContent = '儲存失敗';
      statusEl.className = 'interview-save-status';
    }
  }
}

async function saveInterviewNow() {
  if (interviewSaveTimeout) clearTimeout(interviewSaveTimeout);
  await saveInterview();
}

// ===== 研究調研系統 =====
let researchData = {};
let researchSaveTimeout = null;

async function loadResearch() {
  const projId = currentProject;
  try {
    const doc = await db.collection('board_research').doc(projId).get();
    if (doc.exists) {
      researchData = doc.data();
    } else {
      // 用模板初始化，有專案專屬模板就用專屬的
      const template = RESEARCH_TEMPLATE[projId] || RESEARCH_TEMPLATE.default;
      researchData = {
        project_id: projId,
        sections: {}
      };
      // 填入 prefill 內容
      template.forEach(sec => {
        if (sec.prefill) {
          researchData.sections[sec.id] = sec.prefill;
        }
      });
    }
  } catch (e) {
    console.warn('載入研究資料失敗', e);
    researchData = { project_id: projId, sections: {} };
  }
}

function renderResearch() {
  const header = document.getElementById('research-header');
  const body = document.getElementById('research-body');
  const projName = PROJECTS[currentProject] ? PROJECTS[currentProject].name : currentProject;
  const template = RESEARCH_TEMPLATE[currentProject] || RESEARCH_TEMPLATE.default;

  header.innerHTML = `
    <div class="research-header-inner">
      <div class="research-title">${escapeHtml(projName)} — 研究調研</div>
      <div class="research-subtitle">決策前的調研資料：系統調研、法規、資料盤點、待釐清問題</div>
    </div>
  `;

  body.innerHTML = template.map((sec, i) => {
    const val = (researchData.sections && researchData.sections[sec.id]) || '';
    return `
    <div class="research-section">
      <div class="research-section-header">
        <div class="research-section-number">${i + 1}</div>
        <div class="research-section-title">${escapeHtml(sec.title)}</div>
      </div>
      ${sec.hint ? `<div class="research-section-hint">${escapeHtml(sec.hint)}</div>` : ''}
      <textarea placeholder="${escapeHtml(sec.placeholder)}"
                oninput="updateResearchSection('${sec.id}', this.value)">${escapeHtml(val)}</textarea>
    </div>`;
  }).join('') + `
    <div class="research-save-bar">
      <div class="research-save-status" id="research-save-status"></div>
      <button class="research-save-btn" onclick="saveResearchNow()">儲存</button>
    </div>
  `;
}

function updateResearchSection(sectionId, value) {
  if (!researchData.sections) researchData.sections = {};
  researchData.sections[sectionId] = value;
  scheduleResearchSave();
}

function scheduleResearchSave() {
  const statusEl = document.getElementById('research-save-status');
  if (statusEl) {
    statusEl.textContent = '未儲存';
    statusEl.className = 'research-save-status';
  }
  if (researchSaveTimeout) clearTimeout(researchSaveTimeout);
  researchSaveTimeout = setTimeout(() => saveResearch(), 3000);
}

async function saveResearch() {
  const projId = currentProject;
  try {
    await db.collection('board_research').doc(projId).set({
      ...researchData,
      project_id: projId,
      updated_by: currentUser.name,
      updated_at: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    const statusEl = document.getElementById('research-save-status');
    if (statusEl) {
      statusEl.textContent = '已儲存';
      statusEl.className = 'research-save-status saved';
    }
  } catch (e) {
    console.warn('儲存研究資料失敗', e);
    const statusEl = document.getElementById('research-save-status');
    if (statusEl) {
      statusEl.textContent = '儲存失敗';
      statusEl.className = 'research-save-status';
    }
  }
}

async function saveResearchNow() {
  if (researchSaveTimeout) clearTimeout(researchSaveTimeout);
  await saveResearch();
}

// ===== 規格欄位系統 =====
let specFilter = 'all'; // all, yes, no
let specSearch = '';
let specOpenCategories = {};

function renderSpec() {
  const header = document.getElementById('spec-header');
  const toolbar = document.getElementById('spec-toolbar');
  const body = document.getElementById('spec-body');
  const projName = PROJECTS[currentProject] ? PROJECTS[currentProject].name : currentProject;
  const specData = SPEC_FIELDS[currentProject];

  if (!specData) {
    header.innerHTML = '';
    toolbar.innerHTML = '';
    body.innerHTML = '<div class="spec-empty">此專案尚無欄位規格資料</div>';
    return;
  }

  // 比對模式
  if (specData.type === 'comparison') {
    renderSpecComparison(specData, projName, header, toolbar, body);
    return;
  }

  // 統計
  let totalFields = 0, yesCount = 0, noCount = 0;
  specData.categories.forEach(cat => {
    cat.fields.forEach(f => {
      totalFields++;
      if (f.use === 'Yes') yesCount++;
      else noCount++;
    });
  });

  header.innerHTML = `
    <div class="spec-header-inner">
      <div class="spec-title">${escapeHtml(projName)} — 欄位規格</div>
      <div class="spec-subtitle">資料來源：${escapeHtml(specData.source)} ｜ 更新日期：${specData.updated}</div>
      <div class="spec-stats">
        <span class="spec-stat"><span class="spec-stat-num">${totalFields}</span> 總欄位</span>
        <span class="spec-stat stat-yes"><span class="spec-stat-num">${yesCount}</span> 啟用</span>
        <span class="spec-stat stat-no"><span class="spec-stat-num">${noCount}</span> 停用</span>
      </div>
    </div>
  `;

  toolbar.innerHTML = `
    <div class="spec-toolbar-inner">
      <div class="spec-filter-group">
        <button class="spec-filter-btn ${specFilter === 'all' ? 'active' : ''}" onclick="setSpecFilter('all')">全部</button>
        <button class="spec-filter-btn ${specFilter === 'yes' ? 'active' : ''}" onclick="setSpecFilter('yes')">啟用中</button>
        <button class="spec-filter-btn ${specFilter === 'no' ? 'active' : ''}" onclick="setSpecFilter('no')">停用</button>
      </div>
      <input type="text" class="spec-search" placeholder="搜尋欄位名稱或代碼..." value="${escapeHtml(specSearch)}" oninput="setSpecSearch(this.value)">
    </div>
  `;

  // 渲染分類
  body.innerHTML = specData.categories.map(cat => {
    const filtered = cat.fields.filter(f => {
      if (specFilter === 'yes' && f.use !== 'Yes') return false;
      if (specFilter === 'no' && f.use !== 'No') return false;
      if (specSearch) {
        const q = specSearch.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q);
      }
      return true;
    });

    if (filtered.length === 0) return '';

    const isOpen = specOpenCategories[cat.id] !== false; // default open

    return `
    <div class="spec-category">
      <div class="spec-category-header" onclick="toggleSpecCategory('${cat.id}')">
        <span class="spec-category-icon">${cat.icon}</span>
        <span class="spec-category-name">${escapeHtml(cat.name)}</span>
        <span class="spec-category-count">${filtered.length} 欄</span>
        <span class="spec-category-arrow ${isOpen ? 'open' : ''}">▶</span>
      </div>
      <div class="spec-category-body" style="display:${isOpen ? '' : 'none'}">
        <table class="spec-table">
          <thead>
            <tr>
              <th class="spec-th-name">欄位名稱</th>
              <th class="spec-th-code">欄位代碼</th>
              <th class="spec-th-use">啟用</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(f => `
            <tr class="${f.use === 'No' ? 'spec-row-disabled' : ''}">
              <td>${escapeHtml(f.name)}</td>
              <td><code>${escapeHtml(f.code)}</code></td>
              <td><span class="spec-badge ${f.use === 'Yes' ? 'badge-yes' : 'badge-no'}">${f.use}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }).join('');
}

function renderSpecComparison(specData, projName, header, toolbar, body) {
  const v = specData.vendors;

  // 統計
  let total = 0, bothCount = 0, v1OnlyCount = 0, v2OnlyCount = 0, pendingCount = 0;
  specData.categories.forEach(cat => {
    cat.fields.forEach(f => {
      total++;
      const has1 = f.v1.startsWith('✅') || f.v1.startsWith('△');
      const has2 = f.v2.startsWith('✅');
      if (f.pending) pendingCount++;
      if (has1 && has2) bothCount++;
      else if (has1 && !has2) v1OnlyCount++;
      else if (!has1 && has2) v2OnlyCount++;
    });
  });

  header.innerHTML = `
    <div class="spec-header-inner">
      <div class="spec-title">${escapeHtml(projName)} — 功能規格比對表</div>
      <div class="spec-subtitle">資料來源：${escapeHtml(specData.source)} ｜ 更新日期：${specData.updated}</div>
      <div class="spec-subtitle">${escapeHtml(specData.note)}</div>
      <div class="spec-stats">
        <span class="spec-stat"><span class="spec-stat-num">${total}</span> 總功能</span>
        <span class="spec-stat stat-yes"><span class="spec-stat-num">${bothCount}</span> 兩者皆有</span>
        <span class="spec-stat stat-v2"><span class="spec-stat-num">${v2OnlyCount}</span> 僅${v[1]}</span>
        <span class="spec-stat stat-v1"><span class="spec-stat-num">${v1OnlyCount}</span> 僅${v[0]}</span>
        <span class="spec-stat stat-pending"><span class="spec-stat-num">${pendingCount}</span> 待確認</span>
      </div>
    </div>
  `;

  toolbar.innerHTML = `
    <div class="spec-toolbar-inner">
      <div class="spec-filter-group">
        <button class="spec-filter-btn ${specFilter === 'all' ? 'active' : ''}" onclick="setSpecFilter('all')">全部</button>
        <button class="spec-filter-btn ${specFilter === 'v2only' ? 'active' : ''}" onclick="setSpecFilter('v2only')">僅${escapeHtml(v[1])}</button>
        <button class="spec-filter-btn ${specFilter === 'v1only' ? 'active' : ''}" onclick="setSpecFilter('v1only')">僅${escapeHtml(v[0])}</button>
        <button class="spec-filter-btn ${specFilter === 'pending' ? 'active' : ''}" onclick="setSpecFilter('pending')">待確認</button>
      </div>
      <input type="text" class="spec-search" placeholder="搜尋功能名稱或編碼..." value="${escapeHtml(specSearch)}" oninput="setSpecSearch(this.value)">
    </div>
  `;

  let lastParent = '';
  body.innerHTML = specData.categories.map(cat => {
    const filtered = cat.fields.filter(f => {
      const has1 = f.v1.startsWith('✅') || f.v1.startsWith('△');
      const has2 = f.v2.startsWith('✅');
      if (specFilter === 'v2only' && (has1 || !has2)) return false;
      if (specFilter === 'v1only' && (!has1 || has2)) return false;
      if (specFilter === 'pending' && !f.pending) return false;
      if (specSearch) {
        const q = specSearch.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q);
      }
      return true;
    });

    if (filtered.length === 0) return '';

    const isOpen = specOpenCategories[cat.id] !== false;

    // 父分類標題
    let parentHeader = '';
    if (cat.parent && cat.parent !== lastParent) {
      lastParent = cat.parent;
      parentHeader = `<div class="spec-compare-parent">${escapeHtml(cat.parent)}</div>`;
    }

    return `${parentHeader}
    <div class="spec-category">
      <div class="spec-category-header" onclick="toggleSpecCategory('${cat.id}')">
        <span class="spec-category-icon">${cat.icon}</span>
        <span class="spec-category-name">${escapeHtml(cat.name)}</span>
        <span class="spec-category-count">${filtered.length} 項</span>
        <span class="spec-category-arrow ${isOpen ? 'open' : ''}">▶</span>
      </div>
      <div class="spec-category-body" style="display:${isOpen ? '' : 'none'}">
        <table class="spec-table spec-compare-table">
          <thead>
            <tr>
              <th class="spec-th-code">編碼</th>
              <th class="spec-th-name">功能項目</th>
              <th class="spec-th-vendor">${escapeHtml(v[0])}</th>
              <th class="spec-th-vendor">${escapeHtml(v[1])}</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(f => `
            <tr class="${f.pending ? 'spec-row-pending' : ''}">
              <td><code>${escapeHtml(f.code)}</code></td>
              <td>${escapeHtml(f.name)}</td>
              <td class="spec-compare-cell">${renderCompareValue(f.v1)}</td>
              <td class="spec-compare-cell">${renderCompareValue(f.v2)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }).join('')

  // 待確認事項
  + (specData.pendingItems ? `
    <div class="spec-pending-section">
      <div class="spec-pending-title">待確認事項</div>
      <ol class="spec-pending-list">
        ${specData.pendingItems.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ol>
    </div>` : '');
}

function renderCompareValue(val) {
  if (val === '✅') return '<span class="spec-compare-yes">✅</span>';
  if (val === '—') return '<span class="spec-compare-no">—</span>';
  if (val === '待討論') return '<span class="spec-compare-pending">待討論</span>';
  if (val.startsWith('✅')) return '<span class="spec-compare-yes">' + escapeHtml(val) + '</span>';
  if (val.startsWith('△')) return '<span class="spec-compare-partial">' + escapeHtml(val) + '</span>';
  return escapeHtml(val);
}

function setSpecFilter(filter) {
  specFilter = filter;
  renderSpec();
}

function setSpecSearch(value) {
  specSearch = value;
  // debounce
  if (window._specSearchTimeout) clearTimeout(window._specSearchTimeout);
  window._specSearchTimeout = setTimeout(() => renderSpec(), 200);
}

function toggleSpecCategory(catId) {
  specOpenCategories[catId] = specOpenCategories[catId] === false ? true : false;
  renderSpec();
}

// ===== 錄音系統 =====
let mediaRecorder = null;
let audioChunks = [];
let recordingStartTime = null;
let recordingTimer = null;
let speechRecognition = null;
let liveTranscript = '';

// ===== AI 浮動面板 =====
function toggleAIPanel() {
  const panel = document.getElementById('ai-panel');
  const bubble = document.getElementById('ai-bubble');
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'flex';
  bubble.style.display = isOpen ? '' : 'none';
  if (!isOpen) renderAIPanelBody();
}

function renderAIPanelBody() {
  const body = document.getElementById('ai-panel-body');
  const recordings = interviewData.recordings || [];

  if (recordings.length === 0) {
    body.innerHTML = '<div class="ai-panel-empty">按下方麥克風開始錄音<br>錄完後 AI 自動產出重點摘要</div>';
    return;
  }

  body.innerHTML = recordings.slice().reverse().map((r, i) => `
    <div class="ai-card">
      <div class="ai-card-header">
        <span class="ai-card-name">${escapeHtml(r.name)}</span>
        <span class="ai-card-duration">${escapeHtml(r.duration || '')}</span>
      </div>
      <div class="ai-card-player" id="ai-player-${r.docId}">
        <button class="ai-play-btn" onclick="loadAndPlayInPanel('${r.docId}', this)">&#9654; 播放錄音</button>
      </div>
      ${r.summary ? `
        <div class="ai-card-summary">
          <div class="ai-card-summary-label">AI 摘要</div>
          <div class="ai-card-summary-text">${escapeHtml(r.summary)}</div>
        </div>
      ` : (r.transcript && r.transcript.length > 20 ? `
        <div class="ai-card-summary ai-card-pending">分析中...</div>
      ` : '')}
    </div>
  `).join('');
  body.scrollTop = body.scrollHeight;
}

async function loadAndPlayInPanel(docId, btnEl) {
  btnEl.textContent = '載入中...';
  btnEl.disabled = true;
  try {
    const doc = await db.collection('board_recordings').doc(docId).get();
    if (!doc.exists) { btnEl.textContent = '找不到'; return; }
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = doc.data().data;
    audio.style.width = '100%';
    audio.style.height = '32px';
    audio.style.marginTop = '6px';
    btnEl.replaceWith(audio);
    audio.play();
  } catch (e) {
    btnEl.textContent = '失敗';
    btnEl.disabled = false;
  }
}

async function toggleRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    stopRecording();
  } else {
    startRecording();
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    liveTranscript = '';
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      clearInterval(recordingTimer);
      stopSpeechRecognition();
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      await uploadRecording(blob);
    };

    mediaRecorder.start(1000);
    recordingStartTime = Date.now();

    // 更新 UI
    const btn = document.getElementById('ai-rec-btn');
    const dot = document.getElementById('ai-rec-dot');
    const label = document.getElementById('ai-rec-label');
    const timer = document.getElementById('rec-timer');
    const bubbleIcon = document.getElementById('ai-bubble-icon');
    if (btn) btn.classList.add('recording');
    if (dot) dot.classList.add('recording');
    if (label) label.textContent = '停止錄音';
    if (bubbleIcon) { bubbleIcon.textContent = ''; bubbleIcon.classList.add('recording'); }

    recordingTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
      const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const ss = String(elapsed % 60).padStart(2, '0');
      if (timer) timer.textContent = `${mm}:${ss}`;
    }, 1000);

    // 啟動語音辨識
    startSpeechRecognition();

  } catch (e) {
    console.error('錄音失敗', e);
    alert('無法開啟麥克風，請確認瀏覽器權限');
  }
}

function startSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('瀏覽器不支援語音辨識');
    return;
  }

  speechRecognition = new SpeechRecognition();
  speechRecognition.lang = 'zh-TW';
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;

  let finalTranscript = '';

  speechRecognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + '\n';
      }
    }
    liveTranscript = finalTranscript;
  };

  speechRecognition.onerror = (e) => {
    console.warn('語音辨識錯誤', e.error);
    // no-speech 或 network 錯誤時自動重啟
    if (e.error === 'no-speech' || e.error === 'network') {
      try { speechRecognition.start(); } catch (_) {}
    }
  };

  speechRecognition.onend = () => {
    // 錄音還在進行中就自動重啟辨識
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      try { speechRecognition.start(); } catch (_) {}
    }
  };

  speechRecognition.start();
}

function stopSpeechRecognition() {
  if (speechRecognition) {
    try { speechRecognition.stop(); } catch (_) {}
    speechRecognition = null;
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    const btn = document.getElementById('ai-rec-btn');
    const dot = document.getElementById('ai-rec-dot');
    const label = document.getElementById('ai-rec-label');
    const bubbleIcon = document.getElementById('ai-bubble-icon');
    if (btn) btn.classList.remove('recording');
    if (dot) dot.classList.remove('recording');
    if (label) label.textContent = '上傳中...';
    if (bubbleIcon) { bubbleIcon.textContent = 'AI'; bubbleIcon.classList.remove('recording'); }
  }
}

async function uploadRecording(blob) {
  const projId = currentProject;
  const now = new Date();

  try {
    // 轉 base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // 計算時長
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');

    const recName = `${now.getMonth()+1}/${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} 錄音`;

    const transcript = liveTranscript.trim();

    // 錄音存獨立 doc
    const docId = `${projId}_${Date.now()}`;
    await db.collection('board_recordings').doc(docId).set({
      project_id: projId,
      name: recName,
      duration: `${mm}:${ss}`,
      author: currentUser.name,
      data: base64,
      transcript: transcript,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });

    // interview 只存 metadata
    if (!interviewData.recordings) interviewData.recordings = [];
    const recEntry = {
      docId: docId,
      name: recName,
      duration: `${mm}:${ss}`,
      author: currentUser.name,
      transcript: transcript,
      created_at: now.toISOString()
    };

    interviewData.recordings.push(recEntry);

    await saveInterview();
    renderAIPanelBody();
    const label2 = document.getElementById('ai-rec-label');
    if (label2) label2.textContent = '開始錄音';

    // 有逐字稿就呼叫 AI 摘要
    if (transcript.length > 20) {
      requestAISummary(recEntry.docId, transcript);
    }
  } catch (e) {
    console.error('上傳錄音失敗', e);
    alert('上傳錄音失敗：' + e.message);
    const label = document.getElementById('ai-rec-label');
    if (label) label.textContent = '開始錄音';
  }
}

async function requestAISummary(docId, transcript) {
  try {
    const resp = await fetch('https://memory-api-153654770920.asia-east1.run.app/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'JIGqMtFlx_tnblirqiD0yIvAcEMdUczsmH0UmPruokE'
      },
      body: JSON.stringify({ transcript: transcript })
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const summary = data.summary || JSON.stringify(data);

    // 更新 recording entry
    const rec = (interviewData.recordings || []).find(r => r.docId === docId);
    if (rec) {
      rec.summary = summary;
      await saveInterview();
      renderAIPanelBody();
    }
  } catch (e) {
    console.warn('AI 摘要失敗', e);
  }
}

function showTranscript(docId) {
  const rec = (interviewData.recordings || []).find(r => r.docId === docId);
  if (!rec || !rec.transcript) return;
  alert(rec.transcript);
}

// ===== 渲染白板 =====
function renderBoard() {
  const project = PROJECTS[currentProject];
  const container = document.getElementById('cards-container');
  const svg = document.getElementById('connections');
  container.innerHTML = '';
  svg.innerHTML = '';

  // 渲染白板頂部架構圖（僅 EMR 專案顯示）
  const showArchBanner = currentProject === 'meili-emr';
  if (showArchBanner) {
    renderArchBanner(container);
  }

  const archCollapsed = localStorage.getItem('vivi-board-arch-collapsed') === 'true';
  const ARCH_OFFSET_Y = showArchBanner ? (archCollapsed ? 60 : 360) : 20;

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
    case 'gap': return '\u274C 待開發';
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
  list.innerHTML = card.comments.map(c => {
    const isOwn = c.author === currentUser.name;
    return `
    <div class="comment">
      <div class="comment-meta">
        <span class="comment-author">${escapeHtml(c.author)}</span>
        <span class="comment-role">（${escapeHtml(c.role)}）</span>
        <span class="comment-time">${c.time}</span>
        ${isOwn ? `<span class="comment-edit-btn" onclick="startEditComment('${c.id}')">編輯</span><span class="comment-delete-btn" onclick="deleteComment('${c.id}')">刪除</span>` : ''}
      </div>
      <div class="comment-body" id="comment-body-${c.id}">${escapeHtml(c.text)}</div>
    </div>`;
  }).join('');
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

function startEditComment(commentId) {
  const project = PROJECTS[currentProject];
  const card = project.cards.find(c => c.id === currentCardId);
  if (!card) return;
  const comment = card.comments.find(c => c.id === commentId);
  if (!comment) return;

  const bodyEl = document.getElementById('comment-body-' + commentId);
  if (!bodyEl) return;

  bodyEl.innerHTML = `
    <textarea class="comment-edit-textarea" id="comment-edit-${commentId}">${escapeHtml(comment.text)}</textarea>
    <div class="comment-edit-actions">
      <button class="comment-save-btn" onclick="saveEditComment('${commentId}')">儲存</button>
      <button class="comment-cancel-btn" onclick="cancelEditComment()">取消</button>
    </div>`;
  const ta = document.getElementById('comment-edit-' + commentId);
  ta.focus();
  ta.setSelectionRange(ta.value.length, ta.value.length);
}

function cancelEditComment() {
  const project = PROJECTS[currentProject];
  const card = project.cards.find(c => c.id === currentCardId);
  if (card) renderComments(card);
}

async function saveEditComment(commentId) {
  const ta = document.getElementById('comment-edit-' + commentId);
  if (!ta) return;
  const newText = ta.value.trim();
  if (!newText) return;

  const project = PROJECTS[currentProject];
  const card = project.cards.find(c => c.id === currentCardId);
  if (!card) return;
  const comment = card.comments.find(c => c.id === commentId);
  if (!comment) return;

  comment.text = newText;
  renderComments(card);

  try {
    await db.collection('board_comments').doc(commentId).update({ text: newText });
  } catch (e) {
    console.warn('編輯留言失敗', e);
  }
}

async function deleteComment(commentId) {
  if (!confirm('確定刪除這則留言？')) return;
  const project = PROJECTS[currentProject];
  const card = project.cards.find(c => c.id === currentCardId);
  if (!card) return;
  card.comments = card.comments.filter(c => c.id !== commentId);
  renderComments(card);
  renderBoard();
  try {
    await db.collection('board_comments').doc(commentId).delete();
  } catch (e) {
    console.warn('刪除留言失敗', e);
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
    if (target.closest('.card, .card-mockup-embed, .arch-banner, .zoom-controls, .brief-panel, .comment-panel, .sticky-note, button, input, textarea, select')) {
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

// 追蹤 IME 選字狀態
let imeComposing = false;
document.addEventListener('compositionstart', () => { imeComposing = true; });
document.addEventListener('compositionend', () => { setTimeout(() => { imeComposing = false; }, 150); });

// Enter 送出（用 keyup 避免 IME composing 問題）
document.addEventListener('keyup', (e) => {
  if (e.key !== 'Enter' || e.shiftKey || imeComposing || e.isComposing) return;
  if (e.target.id === 'comment-text') { addComment(); }
  if (e.target.id === 'note-text') { addNote(); }
});

// 阻止 Enter 在 textarea 產生換行（keydown 階段）
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !imeComposing && !e.isComposing) {
    if (e.target.id === 'comment-text' || e.target.id === 'note-text') {
      e.preventDefault();
    }
  }
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
  const projId = currentProject || Object.keys(PROJECTS)[0];
  try {
    const snap = await db.collection('board_notes')
      .where('project_id', '==', projId)
      .where('author', '==', currentUser.name)
      .orderBy('created_at', 'desc')
      .get();
    myNotes = [];
    snap.forEach(doc => myNotes.push({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('載入筆記失敗（嘗試無排序查詢）', e);
    // fallback: 不排序，避免缺 composite index 時完全載不到
    try {
      const snap2 = await db.collection('board_notes')
        .where('project_id', '==', projId)
        .where('author', '==', currentUser.name)
        .get();
      myNotes = [];
      snap2.forEach(doc => myNotes.push({ id: doc.id, ...doc.data() }));
      myNotes.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));
    } catch (e2) {
      console.error('筆記 fallback 也失敗', e2);
      myNotes = [];
    }
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
    }, e => console.error('筆記訂閱失敗（可能需要建立 Firestore composite index）', e));
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

  try {
    const docRef = await db.collection('board_notes').add({
      project_id: currentProject,
      date: date,
      text: text,
      author: currentUser.name,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });
    textarea.value = '';
    myNotes.unshift({ id: docRef.id, date, text, author: currentUser.name });
    renderNotesList();
  } catch (e) {
    console.error('新增筆記失敗', e);
    alert('筆記儲存失敗：' + e.message);
  }
}

async function deleteNote(noteId) {
  try {
    await db.collection('board_notes').doc(noteId).delete();
    myNotes = myNotes.filter(n => n.id !== noteId);
    renderNotesList();
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
        <div class="brief-stat-label">待開發</div>
      </div>
    </div>
  </div>`;

  // 我的筆記（個人）
  html += `<div class="brief-section">
    <div class="brief-section-title">我的筆記 <span class="brief-private-hint">僅個人看到</span></div>
    <div id="notes-list"></div>
    <div class="brief-decision-input">
      <input type="text" id="note-text" placeholder="記下你的想法或備忘...">
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

// ===== 便利貼 Sticky Notes =====
let stickies = [];

async function loadStickies() {
  const projId = currentProject || Object.keys(PROJECTS)[0];
  try {
    const snap = await db.collection('board_stickies')
      .where('project_id', '==', projId)
      .where('author', '==', currentUser.name)
      .get();
    stickies = [];
    snap.forEach(doc => stickies.push({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.warn('載入便利貼失敗', e);
    stickies = [];
  }
  renderStickies();
}

function subscribeStickies() {
  const projId = currentProject || Object.keys(PROJECTS)[0];
  db.collection('board_stickies')
    .where('project_id', '==', projId)
    .where('author', '==', currentUser.name)
    .onSnapshot(snapshot => {
      stickies = [];
      snapshot.forEach(doc => stickies.push({ id: doc.id, ...doc.data() }));
      renderStickies();
    }, e => console.warn('便利貼訂閱失敗', e));
}

function renderStickies() {
  const container = document.getElementById('stickies-container');
  if (!container) return;
  container.innerHTML = '';

  stickies.forEach(s => {
    const el = document.createElement('div');
    el.className = 'sticky-note';
    el.style.left = (s.x || 100) + 'px';
    el.style.top = (s.y || 100) + 'px';
    el.style.width = (s.width || 200) + 'px';
    el.style.height = (s.height || 150) + 'px';
    if (s.color) el.style.setProperty('--sticky-bg', s.color);
    el.dataset.id = s.id;

    el.innerHTML = `
      <div class="sticky-header">
        <div class="sticky-colors">
          <span class="sticky-color-dot" style="background:#FFF9C4" onclick="changeStickyColor('${s.id}','#FFF9C4')"></span>
          <span class="sticky-color-dot" style="background:#C8E6C9" onclick="changeStickyColor('${s.id}','#C8E6C9')"></span>
          <span class="sticky-color-dot" style="background:#BBDEFB" onclick="changeStickyColor('${s.id}','#BBDEFB')"></span>
          <span class="sticky-color-dot" style="background:#F8BBD0" onclick="changeStickyColor('${s.id}','#F8BBD0')"></span>
          <span class="sticky-color-dot" style="background:#FFE0B2" onclick="changeStickyColor('${s.id}','#FFE0B2')"></span>
        </div>
        <span class="sticky-delete" onclick="deleteSticky('${s.id}')" title="刪除">✕</span>
      </div>
      <textarea class="sticky-text" placeholder="寫點什麼..."
        onblur="saveStickyText('${s.id}', this.value)">${escapeHtml(s.text || '')}</textarea>
      <div class="sticky-resizer" data-sticky-id="${s.id}"></div>
    `;

    makeStickyDraggable(el, s.id);
    makeStickyResizable(el, el.querySelector('.sticky-resizer'), s.id);
    container.appendChild(el);
  });
}

async function addStickyNote() {
  // Place near center of current viewport
  const boardContainer = document.getElementById('board-container');
  const cx = (boardContainer.scrollLeft + boardContainer.clientWidth / 2 - panX) / zoomLevel;
  const cy = (boardContainer.scrollTop + boardContainer.clientHeight / 2 - panY) / zoomLevel;

  const data = {
    project_id: currentProject,
    author: currentUser.name,
    text: '',
    x: Math.round(cx - 100),
    y: Math.round(cy - 75),
    width: 200,
    height: 150,
    color: '#FFF9C4',
    created_at: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    const docRef = await db.collection('board_stickies').add(data);
    stickies.push({ id: docRef.id, ...data });
    renderStickies();
  } catch (e) {
    console.error('新增便利貼失敗', e);
  }
}

async function saveStickyText(stickyId, text) {
  const s = stickies.find(n => n.id === stickyId);
  if (s) s.text = text;
  try {
    await db.collection('board_stickies').doc(stickyId).update({ text });
  } catch (e) { console.warn('儲存便利貼文字失敗', e); }
}

async function changeStickyColor(stickyId, color) {
  const s = stickies.find(n => n.id === stickyId);
  if (s) s.color = color;
  const el = document.querySelector(`.sticky-note[data-id="${stickyId}"]`);
  if (el) el.style.setProperty('--sticky-bg', color);
  try {
    await db.collection('board_stickies').doc(stickyId).update({ color });
  } catch (e) { console.warn('變更便利貼顏色失敗', e); }
}

async function deleteSticky(stickyId) {
  stickies = stickies.filter(n => n.id !== stickyId);
  renderStickies();
  try {
    await db.collection('board_stickies').doc(stickyId).delete();
  } catch (e) { console.warn('刪除便利貼失敗', e); }
}

function makeStickyDraggable(el, stickyId) {
  let startX, startY, origX, origY, dragging = false;

  const header = el.querySelector('.sticky-header');
  header.addEventListener('mousedown', (e) => {
    if (e.target.closest('.sticky-delete, .sticky-color-dot')) return;
    startX = e.clientX;
    startY = e.clientY;
    origX = parseInt(el.style.left);
    origY = parseInt(el.style.top);
    dragging = false;
    e.stopPropagation();

    const onMove = (e2) => {
      const dx = (e2.clientX - startX) / zoomLevel;
      const dy = (e2.clientY - startY) / zoomLevel;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragging = true;
      if (dragging) {
        el.style.left = (origX + dx) + 'px';
        el.style.top = (origY + dy) + 'px';
        el.style.zIndex = 100;
      }
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      el.style.zIndex = '';
      if (dragging) {
        const newX = parseInt(el.style.left);
        const newY = parseInt(el.style.top);
        const s = stickies.find(n => n.id === stickyId);
        if (s) { s.x = newX; s.y = newY; }
        db.collection('board_stickies').doc(stickyId).update({ x: newX, y: newY })
          .catch(e => console.warn('儲存便利貼位置失敗', e));
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

function makeStickyResizable(el, handle, stickyId) {
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
      el.style.width = Math.max(120, startW + dw) + 'px';
      el.style.height = Math.max(80, startH + dh) + 'px';
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      const newW = parseInt(el.style.width);
      const newH = parseInt(el.style.height);
      const s = stickies.find(n => n.id === stickyId);
      if (s) { s.width = newW; s.height = newH; }
      db.collection('board_stickies').doc(stickyId).update({ width: newW, height: newH })
        .catch(e => console.warn('儲存便利貼大小失敗', e));
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

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
