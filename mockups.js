// ===== 示意畫面 =====
// 每張流程卡片對應一個 wireframe HTML

const MOCKUPS = {
  "flow1": {
    title: "邀約畫面（小編操作）",
    html: `
      <div class="mock-phone mock-desktop">
        <div class="mock-header">電子病歷 — 新增預約</div>
        <div class="mock-body">
          <div class="mock-row">
            <div class="mock-field">
              <label>客戶姓名</label>
              <div class="mock-input">王小美</div>
            </div>
            <div class="mock-field">
              <label>電話</label>
              <div class="mock-input">0912-345-678</div>
            </div>
          </div>
          <div class="mock-row">
            <div class="mock-field">
              <label>店別</label>
              <div class="mock-select">忠孝館 7F <span class="mock-arrow">\u25BC</span></div>
            </div>
            <div class="mock-field">
              <label>預約日期</label>
              <div class="mock-input">2026/04/15</div>
            </div>
          </div>
          <div class="mock-row">
            <div class="mock-field">
              <label>預約時間</label>
              <div class="mock-select">14:00 <span class="mock-arrow">\u25BC</span></div>
            </div>
            <div class="mock-field">
              <label>預約人（自動帶入）</label>
              <div class="mock-input mock-auto">小編 Amy</div>
            </div>
          </div>
          <div class="mock-divider"></div>
          <div class="mock-section-label">行銷歸因</div>
          <div class="mock-row">
            <div class="mock-field">
              <label>來源平台</label>
              <div class="mock-select">LINE <span class="mock-arrow">\u25BC</span></div>
            </div>
            <div class="mock-field">
              <label>行銷通路</label>
              <div class="mock-select">自然流量 <span class="mock-arrow">\u25BC</span></div>
            </div>
          </div>
          <div class="mock-row">
            <div class="mock-field">
              <label>素材歸因</label>
              <div class="mock-select">4月音波活動 <span class="mock-arrow">\u25BC</span></div>
            </div>
            <div class="mock-field">
              <label>KOL（選填）</label>
              <div class="mock-input mock-placeholder">請輸入</div>
            </div>
          </div>
          <div class="mock-row">
            <div class="mock-field full">
              <label>備註</label>
              <div class="mock-textarea">客人說想做音波拉皮，之前在別家做過一次</div>
            </div>
          </div>
          <div class="mock-actions">
            <button class="mock-btn-secondary">取消</button>
            <button class="mock-btn-primary">建立預約</button>
          </div>
        </div>
      </div>`
  },

  "flow2": {
    title: "簡訊確認頁（客人手機）",
    html: `
      <div class="mock-phone">
        <div class="mock-header">美力時尚 — 預約確認</div>
        <div class="mock-body mock-center">
          <div class="mock-logo-text">美力時尚醫美</div>
          <div class="mock-big-text">預約提醒</div>
          <div class="mock-card-box">
            <div class="mock-info-row"><span class="mock-label-sm">姓名</span><span>王小美</span></div>
            <div class="mock-info-row"><span class="mock-label-sm">日期</span><span>2026/04/15（二）</span></div>
            <div class="mock-info-row"><span class="mock-label-sm">時間</span><span>14:00</span></div>
            <div class="mock-info-row"><span class="mock-label-sm">地點</span><span>忠孝館 7F</span></div>
          </div>
          <div class="mock-actions mock-stack">
            <button class="mock-btn-primary mock-full">\u2705 確認報到</button>
            <button class="mock-btn-danger mock-full">\u274C 取消預約</button>
          </div>
          <div class="mock-hint">如需更改時間，請聯繫客服</div>
        </div>
      </div>`
  },

  "flow3": {
    title: "掃碼報到畫面",
    html: `
      <div class="mock-phone">
        <div class="mock-header">美力時尚 — 掃碼報到</div>
        <div class="mock-body mock-center">
          <div class="mock-big-text">歡迎蒞臨</div>
          <div class="mock-subtitle">請掃描 QR Code 完成報到</div>
          <div class="mock-qr">
            <div class="mock-qr-box">QR</div>
          </div>
          <div class="mock-hint">掃碼後將自動判斷新客/舊客</div>
          <div class="mock-divider"></div>
          <div class="mock-status-bar">
            <div class="mock-status-item"><span class="mock-dot green"></span>已報到 12</div>
            <div class="mock-status-item"><span class="mock-dot yellow"></span>待到店 5</div>
            <div class="mock-status-item"><span class="mock-dot red"></span>未到 2</div>
          </div>
          <div class="mock-hint">（下方為控場 Dashboard 視角）</div>
        </div>
      </div>`
  },

  "flow3a": {
    title: "新客填寫基本資料（手機）",
    html: `
      <div class="mock-phone">
        <div class="mock-header">美力時尚 — 基本資料</div>
        <div class="mock-body">
          <div class="mock-progress"><div class="mock-progress-bar" style="width:30%"></div></div>
          <div class="mock-section-label">個人資料</div>
          <div class="mock-field full">
            <label>姓名</label>
            <div class="mock-input">王小美</div>
          </div>
          <div class="mock-field full">
            <label>身分證字號</label>
            <div class="mock-input mock-placeholder">請輸入</div>
          </div>
          <div class="mock-row">
            <div class="mock-field">
              <label>生日</label>
              <div class="mock-input">1990/05/20</div>
            </div>
            <div class="mock-field">
              <label>電話</label>
              <div class="mock-input mock-auto">0912-345-678</div>
            </div>
          </div>
          <div class="mock-divider"></div>
          <div class="mock-section-label">醫療相關</div>
          <div class="mock-field full">
            <label>過敏史</label>
            <div class="mock-chips">
              <span class="mock-chip">無</span>
              <span class="mock-chip active">藥物過敏</span>
              <span class="mock-chip">食物過敏</span>
            </div>
          </div>
          <div class="mock-field full">
            <label>特殊病史（可複選）</label>
            <div class="mock-chips">
              <span class="mock-chip">糖尿病</span>
              <span class="mock-chip">高血壓</span>
              <span class="mock-chip">心臟病</span>
              <span class="mock-chip">肌無力症</span>
              <span class="mock-chip active">無</span>
            </div>
          </div>
          <div class="mock-actions">
            <button class="mock-btn-primary mock-full">下一步</button>
          </div>
        </div>
      </div>`
  },

  "flow4": {
    title: "控場派工面板",
    html: `
      <div class="mock-phone mock-desktop">
        <div class="mock-header">電子病歷 — 今日派工 <span class="mock-badge">忠孝館</span></div>
        <div class="mock-body">
          <div class="mock-tabs">
            <span class="mock-tab active">待指派 (3)</span>
            <span class="mock-tab">進行中 (5)</span>
            <span class="mock-tab">已完成 (8)</span>
          </div>
          <div class="mock-list-item">
            <div class="mock-list-left">
              <div class="mock-list-name">王小美</div>
              <div class="mock-list-sub">14:00 報到 · 新客 · 音波拉皮</div>
            </div>
            <div class="mock-list-right">
              <div class="mock-select mock-sm">指派諮詢師 <span class="mock-arrow">\u25BC</span></div>
            </div>
          </div>
          <div class="mock-list-item">
            <div class="mock-list-left">
              <div class="mock-list-name">李大華</div>
              <div class="mock-list-sub">14:30 報到 · 舊客 · 肉毒回診</div>
            </div>
            <div class="mock-list-right">
              <div class="mock-select mock-sm mock-filled">陳諮詢師 \u2713</div>
            </div>
          </div>
          <div class="mock-list-item">
            <div class="mock-list-left">
              <div class="mock-list-name">張美玲</div>
              <div class="mock-list-sub">15:00 報到 · 舊客 · 填充回診</div>
            </div>
            <div class="mock-list-right">
              <div class="mock-select mock-sm">指派諮詢師 <span class="mock-arrow">\u25BC</span></div>
            </div>
          </div>
        </div>
      </div>`
  },

  "flow5": {
    title: "諮詢師作業畫面",
    html: `
      <div class="mock-phone mock-desktop">
        <div class="mock-header">電子病歷 — 諮詢紀錄</div>
        <div class="mock-body">
          <div class="mock-patient-bar">
            <div><strong>王小美</strong> · 新客 · 女 · 36歲</div>
            <div class="mock-badge green">諮詢中</div>
          </div>
          <div class="mock-tabs">
            <span class="mock-tab active">諮詢紀錄</span>
            <span class="mock-tab">BA 照片</span>
            <span class="mock-tab">消費單</span>
          </div>
          <div class="mock-field full">
            <label>主訴 / 想改善</label>
            <div class="mock-textarea">客人想做音波拉皮，臉頰兩側鬆弛，希望輪廓線更明顯</div>
          </div>
          <div class="mock-field full">
            <label>建議療程</label>
            <div class="mock-chips">
              <span class="mock-chip active">音波拉皮</span>
              <span class="mock-chip">電波拉皮</span>
              <span class="mock-chip active">肉毒小V</span>
            </div>
          </div>
          <div class="mock-divider"></div>
          <div class="mock-section-label">BA 照片上傳</div>
          <div class="mock-photo-grid">
            <div class="mock-photo">正面</div>
            <div class="mock-photo">左側</div>
            <div class="mock-photo">右側</div>
            <div class="mock-photo mock-photo-add">+ 新增</div>
          </div>
          <div class="mock-actions">
            <button class="mock-btn-primary">儲存紀錄</button>
          </div>
        </div>
      </div>`
  },

  "flow5a": {
    title: "初診評估（臉部勾選）",
    html: `
      <div class="mock-phone mock-desktop">
        <div class="mock-header">電子病歷 — 初診評估</div>
        <div class="mock-body">
          <div class="mock-patient-bar">
            <div><strong>王小美</strong> · 初診全面評估</div>
          </div>
          <div class="mock-section-label">臉部區域（點選檢查）</div>
          <div class="mock-face-grid">
            <div class="mock-face-zone active">額頭</div>
            <div class="mock-face-zone">眼周</div>
            <div class="mock-face-zone active">臉頰</div>
            <div class="mock-face-zone">鼻子</div>
            <div class="mock-face-zone">嘴周</div>
            <div class="mock-face-zone active">下巴</div>
            <div class="mock-face-zone active">輪廓線</div>
            <div class="mock-face-zone">頸部</div>
          </div>
          <div class="mock-section-label">臉頰 — 常見問題勾選</div>
          <div class="mock-chips">
            <span class="mock-chip active">鬆弛</span>
            <span class="mock-chip active">毛孔粗大</span>
            <span class="mock-chip">黑斑</span>
            <span class="mock-chip">膚色不均</span>
            <span class="mock-chip">泛紅</span>
            <span class="mock-chip active">皺紋</span>
            <span class="mock-chip">青春痘</span>
          </div>
          <div class="mock-hint">90% 情況用勾選即夠，特殊案例可用 iPad 手繪標註</div>
        </div>
      </div>`
  },

  "flow8": {
    title: "醫師施作紀錄",
    html: `
      <div class="mock-phone mock-desktop">
        <div class="mock-header">電子病歷 — 療程紀錄</div>
        <div class="mock-body">
          <div class="mock-patient-bar">
            <div><strong>王小美</strong> · 音波拉皮</div>
            <div class="mock-badge">施作中</div>
          </div>
          <div class="mock-row">
            <div class="mock-field">
              <label>施作日期</label>
              <div class="mock-input mock-auto">2026/04/15</div>
            </div>
            <div class="mock-field">
              <label>施作醫師</label>
              <div class="mock-input mock-auto">陳醫師</div>
            </div>
          </div>
          <div class="mock-field full">
            <label>施作部位</label>
            <div class="mock-chips">
              <span class="mock-chip active">全臉</span>
              <span class="mock-chip active">下顎線</span>
              <span class="mock-chip">頸部</span>
              <span class="mock-chip">眼周</span>
            </div>
          </div>
          <div class="mock-row">
            <div class="mock-field">
              <label>施作項目</label>
              <div class="mock-select">極線音波 <span class="mock-arrow">\u25BC</span></div>
            </div>
            <div class="mock-field">
              <label>發數</label>
              <div class="mock-input">800 發</div>
            </div>
          </div>
          <div class="mock-field full">
            <label>醫囑備註</label>
            <div class="mock-textarea">術後一週避免高溫環境，兩週後回診</div>
          </div>
          <div class="mock-actions">
            <button class="mock-btn-secondary">暫存</button>
            <button class="mock-btn-primary">完成 + 電子簽名</button>
          </div>
        </div>
      </div>`
  }
};
