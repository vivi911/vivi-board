// ===== 示意畫面（嵌入白板） =====
// Before/After 對照用

const MOCKUPS = {
  "flow1-before": {
    title: "現況：Google Sheet 預約統計表",
    html: `
      <div class="mock-spreadsheet before">
        <div class="mock-sheet-header">
          <span class="mock-sheet-icon">\u{1F4CA}</span>
          2025美力線上客服 | 預約統計表 | 4樓新客
        </div>
        <div class="mock-sheet-toolbar">
          <span class="mock-toolbar-btn">檔案</span>
          <span class="mock-toolbar-btn">編輯</span>
          <span class="mock-toolbar-btn">檢視</span>
          <span class="mock-toolbar-btn">插入</span>
        </div>
        <table class="mock-sheet-table">
          <thead>
            <tr>
              <th class="col-narrow">A</th>
              <th>B 預約人</th>
              <th>C 平台</th>
              <th>D 日期</th>
              <th>E 星期</th>
              <th>F 真實姓名</th>
              <th>G 電話</th>
              <th>H KOL</th>
              <th>I 店別</th>
              <th>J 顧客諮詢內容</th>
              <th>K 預約日期</th>
              <th>L 預約時間</th>
              <th>M 到店</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-narrow">1</td>
              <td><span class="mock-editor-tag km">KM</span></td>
              <td><span class="mock-editor-tag fb">FB</span></td>
              <td>4/1</td>
              <td>3</td>
              <td>楊雅晴</td>
              <td>0976166738</td>
              <td></td>
              <td><span class="mock-store">站前館</span></td>
              <td>蕎雅露</td>
              <td>4/2</td>
              <td>13:00</td>
              <td><span class="mock-arrive">O</span></td>
            </tr>
            <tr>
              <td class="col-narrow">2</td>
              <td><span class="mock-editor-tag nm">9M</span></td>
              <td><span class="mock-editor-tag line">LINE</span></td>
              <td>4/1</td>
              <td>3</td>
              <td>詹玉馨</td>
              <td>0930541110</td>
              <td></td>
              <td><span class="mock-store zx">忠孝館</span></td>
              <td>電音雙波</td>
              <td>5/5</td>
              <td>17:00</td>
              <td><span class="mock-arrive">O</span></td>
            </tr>
            <tr>
              <td class="col-narrow">3</td>
              <td><span class="mock-editor-tag nm">9M</span></td>
              <td><span class="mock-editor-tag line">LINE</span></td>
              <td>4/1</td>
              <td>3</td>
              <td>楊惠祺</td>
              <td>0976977128</td>
              <td></td>
              <td><span class="mock-store">站前館</span></td>
              <td>仙女玻尿膠</td>
              <td>4/15</td>
              <td>13:00</td>
              <td><span class="mock-arrive">O</span></td>
            </tr>
            <tr>
              <td class="col-narrow">4</td>
              <td><span class="mock-editor-tag tt">TT</span></td>
              <td><span class="mock-editor-tag ig">IG</span></td>
              <td>4/1</td>
              <td>3</td>
              <td>連珮含</td>
              <td>0912209063</td>
              <td></td>
              <td><span class="mock-store zx3">忠孝320</span></td>
              <td>雙皮秒</td>
              <td>4/7</td>
              <td>19:00</td>
              <td><span class="mock-arrive">O</span></td>
            </tr>
            <tr>
              <td class="col-narrow">5</td>
              <td><span class="mock-editor-tag ada">ADA</span></td>
              <td><span class="mock-editor-tag line">LINE</span></td>
              <td>4/1</td>
              <td>3</td>
              <td>吳祐閎</td>
              <td>0972916817</td>
              <td></td>
              <td><span class="mock-store zx3">忠孝320</span></td>
              <td>雙皮秒</td>
              <td>4/11</td>
              <td>17:00</td>
              <td><span class="mock-arrive">O</span></td>
            </tr>
          </tbody>
        </table>
        <div class="mock-sheet-problems">
          <div class="mock-problem">\u26A0 手動雙重輸入（GSheet + 凱惠）</div>
          <div class="mock-problem">\u26A0 行銷歸因欄位常漏填</div>
          <div class="mock-problem">\u26A0 無法看凱惠即時時段</div>
        </div>
      </div>`
  },

  "flow1-after": {
    title: "電子病歷：邀約管理",
    html: `
      <div class="mock-spreadsheet after">
        <div class="mock-emr-header">
          <span>電子病歷</span>
          <span class="mock-emr-nav">邀約管理</span>
          <span class="mock-emr-user">小編 Amy</span>
        </div>
        <div class="mock-emr-toolbar">
          <button class="mock-emr-btn-add">+ 新增預約</button>
          <div class="mock-emr-filters">
            <span class="mock-emr-filter">店別：<strong>忠孝館</strong> \u25BC</span>
            <span class="mock-emr-filter">日期：<strong>2026/04</strong> \u25BC</span>
            <span class="mock-emr-filter">狀態：<strong>全部</strong> \u25BC</span>
          </div>
        </div>
        <table class="mock-sheet-table emr">
          <thead>
            <tr>
              <th>預約人</th>
              <th>來源平台</th>
              <th>客戶姓名</th>
              <th>電話</th>
              <th>店別</th>
              <th>諮詢內容</th>
              <th>預約日期</th>
              <th>時間</th>
              <th>行銷通路</th>
              <th>素材歸因</th>
              <th>到店</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="mock-auto-tag">Amy</span></td>
              <td><span class="mock-platform fb">FB</span></td>
              <td>楊雅晴</td>
              <td>0976-166-738</td>
              <td><span class="mock-store-emr">站前館</span></td>
              <td>蕎雅露</td>
              <td>4/2</td>
              <td>13:00</td>
              <td><span class="mock-dropdown-tag">自然流量</span></td>
              <td><span class="mock-dropdown-tag">4月音波</span></td>
              <td><span class="mock-status-dot green"></span></td>
            </tr>
            <tr>
              <td><span class="mock-auto-tag">Amy</span></td>
              <td><span class="mock-platform line">LINE</span></td>
              <td>詹玉馨</td>
              <td>0930-541-110</td>
              <td><span class="mock-store-emr zx">忠孝館</span></td>
              <td>電音雙波</td>
              <td>5/5</td>
              <td>17:00</td>
              <td><span class="mock-dropdown-tag">LINE 廣告</span></td>
              <td><span class="mock-dropdown-tag">雙波促銷</span></td>
              <td><span class="mock-status-dot green"></span></td>
            </tr>
            <tr>
              <td><span class="mock-auto-tag">Amy</span></td>
              <td><span class="mock-platform line">LINE</span></td>
              <td>楊惠祺</td>
              <td>0976-977-128</td>
              <td><span class="mock-store-emr">站前館</span></td>
              <td>仙女玻尿膠</td>
              <td>4/15</td>
              <td>13:00</td>
              <td><span class="mock-dropdown-tag">自然流量</span></td>
              <td><span class="mock-dropdown-tag">—</span></td>
              <td><span class="mock-status-dot green"></span></td>
            </tr>
            <tr>
              <td><span class="mock-auto-tag">Bella</span></td>
              <td><span class="mock-platform ig">IG</span></td>
              <td>連珮含</td>
              <td>0912-209-063</td>
              <td><span class="mock-store-emr zx3">忠孝320</span></td>
              <td>雙皮秒</td>
              <td>4/7</td>
              <td>19:00</td>
              <td><span class="mock-dropdown-tag">IG 廣告</span></td>
              <td><span class="mock-dropdown-tag">皮秒活動</span></td>
              <td><span class="mock-status-dot yellow"></span></td>
            </tr>
            <tr>
              <td><span class="mock-auto-tag">Bella</span></td>
              <td><span class="mock-platform line">LINE</span></td>
              <td>吳祐閎</td>
              <td>0972-916-817</td>
              <td><span class="mock-store-emr zx3">忠孝320</span></td>
              <td>雙皮秒</td>
              <td>4/11</td>
              <td>17:00</td>
              <td><span class="mock-dropdown-tag">KOL 推薦</span></td>
              <td><span class="mock-dropdown-tag">—</span></td>
              <td><span class="mock-status-dot gray"></span></td>
            </tr>
          </tbody>
        </table>
        <div class="mock-sheet-improvements">
          <div class="mock-improve">\u2705 自動帶入預約人（登入即知）</div>
          <div class="mock-improve">\u2705 行銷歸因為必填下拉選單</div>
          <div class="mock-improve">\u2705 一鍵同步凱惠，不用雙重輸入</div>
          <div class="mock-improve">\u2705 即時查看凱惠可用時段</div>
        </div>
      </div>`
  },

  // ===== EMR 新客報到 =====
  "flow3a-mockup": {
    title: "電子病歷：新客報到（手機畫面）",
    html: `
      <div class="mock-spreadsheet after" style="max-width:360px; margin:0 auto;">
        <div class="mock-emr-header" style="text-align:center;">
          <span>美力時尚診所</span>
        </div>
        <div style="padding:16px; background:#fff;">
          <div style="text-align:center; margin-bottom:16px;">
            <div style="font-size:18px; font-weight:600; color:#333;">歡迎蒞臨！</div>
            <div style="font-size:13px; color:#888; margin-top:4px;">請填寫以下基本資料</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:12px; font-size:13px;">
            <div>
              <div style="color:#666; margin-bottom:4px;">姓名 <span style="color:red">*</span></div>
              <div style="border:1px solid #ddd; border-radius:6px; padding:8px 10px; color:#333;">王小美</div>
            </div>
            <div>
              <div style="color:#666; margin-bottom:4px;">手機號碼 <span style="color:red">*</span></div>
              <div style="border:1px solid #ddd; border-radius:6px; padding:8px 10px; color:#333;">0912-345-678</div>
            </div>
            <div>
              <div style="color:#666; margin-bottom:4px;">身分證字號 <span style="color:red">*</span></div>
              <div style="border:1px solid #ddd; border-radius:6px; padding:8px 10px; color:#333;">A123456789</div>
            </div>
            <div>
              <div style="color:#666; margin-bottom:4px;">生日</div>
              <div style="border:1px solid #ddd; border-radius:6px; padding:8px 10px; color:#333;">1990/05/15</div>
            </div>
            <div style="border-top:1px solid #eee; padding-top:12px; margin-top:4px;">
              <div style="color:#333; font-weight:600; margin-bottom:8px;">醫療問卷</div>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <span style="background:#FFF3E0; color:#E65100; padding:4px 10px; border-radius:12px; font-size:12px;">✅ 藥物過敏</span>
                <span style="background:#f5f5f5; color:#999; padding:4px 10px; border-radius:12px; font-size:12px;">懷孕中</span>
                <span style="background:#f5f5f5; color:#999; padding:4px 10px; border-radius:12px; font-size:12px;">肌無力症</span>
                <span style="background:#FFF3E0; color:#E65100; padding:4px 10px; border-radius:12px; font-size:12px;">✅ 蟹足腫</span>
              </div>
            </div>
            <div>
              <div style="color:#666; margin-bottom:4px;">過敏說明</div>
              <div style="border:1px solid #ddd; border-radius:6px; padding:8px 10px; color:#333;">對磺胺類藥物過敏</div>
            </div>
            <div style="text-align:center; margin-top:8px;">
              <div style="background:#8D6E63; color:#fff; padding:12px; border-radius:8px; font-weight:600; cursor:pointer;">送出資料</div>
            </div>
          </div>
        </div>
        <div class="mock-sheet-improvements">
          <div class="mock-improve">\\u2705 手機直接填寫，取代紙本貴賓資料表</div>
          <div class="mock-improve">\\u2705 過敏史/用藥勾選，結構化存檔</div>
          <div class="mock-improve">\\u2705 填完自動寫入凱惠（API #2 + #3）</div>
        </div>
      </div>`
  },

  // ===== EMR 控場派工 =====
  "flow4-mockup": {
    title: "電子病歷：控場派工看板",
    html: `
      <div class="mock-spreadsheet after">
        <div class="mock-emr-header">
          <span>電子病歷</span>
          <span class="mock-emr-nav">控場派工</span>
          <span class="mock-emr-user">控場 Linda</span>
        </div>
        <div style="padding:12px; background:#FAFAFA; display:flex; gap:8px; font-size:12px;">
          <span style="background:#E8F5E9; color:#2E7D32; padding:4px 12px; border-radius:12px; font-weight:600;">今日到店 12</span>
          <span style="background:#FFF3E0; color:#E65100; padding:4px 12px; border-radius:12px;">等候中 3</span>
          <span style="background:#E3F2FD; color:#1565C0; padding:4px 12px; border-radius:12px;">諮詢中 5</span>
          <span style="background:#F3E5F5; color:#7B1FA2; padding:4px 12px; border-radius:12px;">施作中 4</span>
        </div>
        <table class="mock-sheet-table emr">
          <thead>
            <tr>
              <th>報到時間</th>
              <th>客戶</th>
              <th>類型</th>
              <th>諮詢項目</th>
              <th>諮詢師</th>
              <th>醫師</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>09:30</td>
              <td>王小美</td>
              <td><span style="background:#E3F2FD; color:#1565C0; padding:2px 8px; border-radius:8px; font-size:11px;">新客</span></td>
              <td>音波拉皮</td>
              <td><span style="background:#E8F5E9; color:#2E7D32; padding:2px 8px; border-radius:8px; font-size:11px;">Amy ✓</span></td>
              <td><span style="background:#f5f5f5; color:#999; padding:2px 8px; border-radius:8px; font-size:11px;">待指派</span></td>
              <td><span style="background:#FFF3E0; color:#E65100; padding:2px 8px; border-radius:8px; font-size:11px;">等候中</span></td>
            </tr>
            <tr>
              <td>09:45</td>
              <td>陳美華</td>
              <td><span style="background:#F3E5F5; color:#7B1FA2; padding:2px 8px; border-radius:8px; font-size:11px;">舊客</span></td>
              <td>肉毒 第2次</td>
              <td><span style="background:#E8F5E9; color:#2E7D32; padding:2px 8px; border-radius:8px; font-size:11px;">Bella ✓</span></td>
              <td><span style="background:#E8F5E9; color:#2E7D32; padding:2px 8px; border-radius:8px; font-size:11px;">張醫師 ✓</span></td>
              <td><span style="background:#E3F2FD; color:#1565C0; padding:2px 8px; border-radius:8px; font-size:11px;">諮詢中</span></td>
            </tr>
            <tr>
              <td>10:00</td>
              <td>林雅琪</td>
              <td><span style="background:#F3E5F5; color:#7B1FA2; padding:2px 8px; border-radius:8px; font-size:11px;">舊客</span></td>
              <td>玻尿酸 回診</td>
              <td><span style="background:#E8F5E9; color:#2E7D32; padding:2px 8px; border-radius:8px; font-size:11px;">Cathy ✓</span></td>
              <td><span style="background:#E8F5E9; color:#2E7D32; padding:2px 8px; border-radius:8px; font-size:11px;">李醫師 ✓</span></td>
              <td><span style="background:#F3E5F5; color:#7B1FA2; padding:2px 8px; border-radius:8px; font-size:11px;">施作中</span></td>
            </tr>
            <tr>
              <td>10:15</td>
              <td>張雅芳</td>
              <td><span style="background:#E3F2FD; color:#1565C0; padding:2px 8px; border-radius:8px; font-size:11px;">新客</span></td>
              <td>皮秒雷射</td>
              <td><span style="background:#f5f5f5; color:#999; padding:2px 8px; border-radius:8px; font-size:11px;">待指派</span></td>
              <td><span style="background:#f5f5f5; color:#999; padding:2px 8px; border-radius:8px; font-size:11px;">—</span></td>
              <td><span style="background:#FFF3E0; color:#E65100; padding:2px 8px; border-radius:8px; font-size:11px;">等候中</span></td>
            </tr>
          </tbody>
        </table>
        <div class="mock-sheet-improvements">
          <div class="mock-improve">\\u2705 即時看今日報到清單與狀態</div>
          <div class="mock-improve">\\u2705 一鍵指派諮詢師/醫師</div>
          <div class="mock-improve">\\u2705 新客/舊客一眼區分</div>
        </div>
      </div>`
  },

  // ===== EMR 諮詢師作業 =====
  "flow5-mockup": {
    title: "電子病歷：諮詢師紀錄",
    html: `
      <div class="mock-spreadsheet after">
        <div class="mock-emr-header">
          <span>電子病歷</span>
          <span class="mock-emr-nav">諮詢紀錄</span>
          <span class="mock-emr-user">諮詢師 Amy</span>
        </div>
        <div style="padding:12px 16px; background:#FAFAFA; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:16px; font-weight:600; color:#333;">王小美 <span style="font-size:12px; color:#888; font-weight:400;">新客 · 1990/05/15 · 站前4F</span></div>
            <div style="font-size:12px; color:#999; margin-top:2px;">過敏：磺胺類藥物 ｜ 蟹足腫體質</div>
          </div>
          <div style="display:flex; gap:6px;">
            <span style="background:#E3F2FD; color:#1565C0; padding:4px 10px; border-radius:8px; font-size:11px;">查看病歷</span>
            <span style="background:#FCE4EC; color:#C62828; padding:4px 10px; border-radius:8px; font-size:11px;">上傳照片</span>
          </div>
        </div>
        <div style="padding:16px; display:flex; flex-direction:column; gap:14px; font-size:13px; background:#fff;">
          <div>
            <div style="color:#666; margin-bottom:6px; font-weight:600;">諮詢項目</div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <span style="background:#8D6E63; color:#fff; padding:4px 12px; border-radius:12px; font-size:12px;">音波拉皮</span>
              <span style="background:#f5f5f5; color:#666; padding:4px 12px; border-radius:12px; font-size:12px;">＋ 加入項目</span>
            </div>
          </div>
          <div>
            <div style="color:#666; margin-bottom:6px; font-weight:600;">客戶主訴 / 需求</div>
            <div style="border:1px solid #ddd; border-radius:6px; padding:10px; min-height:40px; color:#333;">下顎線鬆弛，想要 V 臉效果，朋友推薦音波</div>
          </div>
          <div>
            <div style="color:#666; margin-bottom:6px; font-weight:600;">諮詢師評估</div>
            <div style="border:1px solid #ddd; border-radius:6px; padding:10px; min-height:40px; color:#333;">下顎線明顯鬆弛，雙頰輕微凹陷。建議音波拉皮全臉 800 條，搭配下巴玻尿酸 1cc 加強輪廓線。</div>
          </div>
          <div>
            <div style="color:#666; margin-bottom:6px; font-weight:600;">推薦療程計畫</div>
            <table style="width:100%; border-collapse:collapse; font-size:12px;">
              <thead>
                <tr style="background:#f9f9f9;">
                  <th style="padding:6px 8px; text-align:left; border-bottom:1px solid #eee;">項目</th>
                  <th style="padding:6px 8px; text-align:left; border-bottom:1px solid #eee;">規格</th>
                  <th style="padding:6px 8px; text-align:center; border-bottom:1px solid #eee;">確認</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:6px 8px; border-bottom:1px solid #f0f0f0;">音波拉皮</td>
                  <td style="padding:6px 8px; border-bottom:1px solid #f0f0f0;">全臉 800 條</td>
                  <td style="padding:6px 8px; text-align:center; border-bottom:1px solid #f0f0f0;">\\u2705</td>
                </tr>
                <tr>
                  <td style="padding:6px 8px; border-bottom:1px solid #f0f0f0;">玻尿酸</td>
                  <td style="padding:6px 8px; border-bottom:1px solid #f0f0f0;">下巴 1cc</td>
                  <td style="padding:6px 8px; text-align:center; border-bottom:1px solid #f0f0f0;">\\u2705</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:4px;">
            <div style="background:#f5f5f5; color:#666; padding:10px 20px; border-radius:8px; font-size:13px; cursor:pointer;">暫存</div>
            <div style="background:#8D6E63; color:#fff; padding:10px 20px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer;">確認 → 建凱惠消費單</div>
          </div>
        </div>
        <div class="mock-sheet-improvements">
          <div class="mock-improve">\\u2705 自動帶入客戶過敏史，諮詢師一眼看到</div>
          <div class="mock-improve">\\u2705 諮詢紀錄結構化，方便日後查詢分析</div>
          <div class="mock-improve">\\u2705 確認後直接建凱惠消費單</div>
        </div>
      </div>`
  },

  // ===== Sean 販賣機專案 =====
  "sean-before": {
    title: "現況：會計手動建 A1 銷貨單",
    html: `
      <div class="mock-spreadsheet before">
        <div class="mock-sheet-header">
          <span class="mock-sheet-icon">\u{1F4CB}</span>
          鼎新 A1 ｜ 銷貨單 ｜ 手動逐筆建立
        </div>
        <div style="padding: 12px; font-size: 13px; color: #666; background: #f8f8f8; border-bottom: 1px solid #e0e0e0;">
          <div style="margin-bottom: 8px;"><strong>步驟 1</strong> — 看 LINE 群組，找到司機回報</div>
          <div style="margin-bottom: 8px;"><strong>步驟 2</strong> — 肉眼找出地點、數量、金額</div>
          <div style="margin-bottom: 8px;"><strong>步驟 3</strong> — 開 A1 選客戶 V10067 微風松高香堤</div>
          <div style="margin-bottom: 8px;"><strong>步驟 4</strong> — 選業務 A02 鄭銘翔</div>
          <div style="margin-bottom: 8px;"><strong>步驟 5</strong> — 選品號 RAN00003 販賣機混和產品</div>
          <div style="margin-bottom: 8px;"><strong>步驟 6</strong> — 輸入數量 268、金額 11,340</div>
          <div><strong>步驟 7</strong> — 儲存 → 再開下一筆（重複步驟 1~7）</div>
        </div>
        <table class="mock-sheet-table">
          <thead>
            <tr>
              <th>客戶</th>
              <th>業務</th>
              <th>品號</th>
              <th>品名</th>
              <th>數量</th>
              <th>單價</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>V10067 微風松高</td>
              <td>A02 鄭銘翔</td>
              <td>RAN00003</td>
              <td>販賣機混和產品</td>
              <td>268</td>
              <td>42.31</td>
              <td>11,340</td>
            </tr>
          </tbody>
        </table>
        <div class="mock-sheet-problems">
          <div class="mock-problem">\u26A0 每筆 2-3 分鐘 \u00D7 每月數百筆 = 大量人工</div>
          <div class="mock-problem">\u26A0 容易看錯數字、選錯客戶</div>
          <div class="mock-problem">\u26A0 會計時間全花在低價值資料搬運</div>
        </div>
      </div>`
  },

  "sean-after": {
    title: "自動化後：默默解析 → 批次匯入",
    html: `
      <div class="mock-spreadsheet after">
        <div class="mock-emr-header">
          <span>\u{1F916} 默默小幫手</span>
          <span class="mock-emr-nav">自動產出 Excel → A1 批次匯入</span>
        </div>
        <div style="padding: 12px; font-size: 13px; color: #666; background: #f0f8f0; border-bottom: 1px solid #c8e6c9;">
          <div style="margin-bottom: 8px;"><strong>步驟 1</strong> — 司機照常在 LINE 群組回報（不改變習慣）</div>
          <div style="margin-bottom: 8px;"><strong>步驟 2</strong> — 默默自動回覆確認 \u2705</div>
          <div style="margin-bottom: 8px;"><strong>步驟 3</strong> — 會計下載 Excel（或從儀表板匯出）</div>
          <div><strong>步驟 4</strong> — 上傳 A1 → 一鍵批次轉銷貨單 \u{1F389}</div>
        </div>
        <table class="mock-sheet-table emr">
          <thead>
            <tr>
              <th>平台訂單號</th>
              <th>日期</th>
              <th>客戶代碼</th>
              <th>業務代碼</th>
              <th>品號</th>
              <th>數量</th>
              <th>金額</th>
              <th>地點</th>
              <th>司機</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>VM-0413-001</td>
              <td>2026/04/13</td>
              <td>V10067</td>
              <td>A06</td>
              <td>RAN00003</td>
              <td>268</td>
              <td>11,340</td>
              <td>微風松高</td>
              <td>Gary</td>
            </tr>
            <tr>
              <td>VM-0413-002</td>
              <td>2026/04/13</td>
              <td>V20045</td>
              <td>A06</td>
              <td>RAN00003</td>
              <td>332</td>
              <td>13,230</td>
              <td>秀泰文心6F</td>
              <td>LAI</td>
            </tr>
            <tr>
              <td>VM-0413-003</td>
              <td>2026/04/13</td>
              <td>V20088</td>
              <td>A02</td>
              <td>RAN00003</td>
              <td>141</td>
              <td>5,880</td>
              <td>台中秀泰S1館2F</td>
              <td>RJ</td>
            </tr>
            <tr>
              <td>VM-0413-004</td>
              <td>2026/04/13</td>
              <td>V30012</td>
              <td>A02</td>
              <td>RAN00003</td>
              <td>293</td>
              <td>11,875</td>
              <td>中正紀念堂</td>
              <td>Jeffry</td>
            </tr>
          </tbody>
        </table>
        <div class="mock-sheet-improvements">
          <div class="mock-improve">\u2705 司機不改變習慣，照常回報</div>
          <div class="mock-improve">\u2705 AI 自動解析，30 秒內回覆確認</div>
          <div class="mock-improve">\u2705 每天只花 2 分鐘下載 + 上傳</div>
          <div class="mock-improve">\u2705 數百筆全自動，不再逐筆手建</div>
        </div>
      </div>`
  },

  "sean-option-a": {
    title: "方案 A：Google Drive 每日 Excel",
    html: `
      <div class="mock-spreadsheet after">
        <div class="mock-emr-header">
          <span>\u{1F4C1} Google Drive</span>
          <span class="mock-emr-nav">Sean 販賣機 / 銷貨單</span>
        </div>
        <div style="padding: 16px;">
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px 16px; background: #fff; width: 160px;">
              <div style="font-size: 24px; text-align: center;">\u{1F4C4}</div>
              <div style="font-size: 12px; text-align: center; margin-top: 4px; color: #333;">2026-04-13.xlsx</div>
              <div style="font-size: 11px; text-align: center; color: #888;">5 筆 | $42,325</div>
            </div>
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px 16px; background: #fff; width: 160px;">
              <div style="font-size: 24px; text-align: center;">\u{1F4C4}</div>
              <div style="font-size: 12px; text-align: center; margin-top: 4px; color: #333;">2026-04-12.xlsx</div>
              <div style="font-size: 11px; text-align: center; color: #888;">8 筆 | $67,120</div>
            </div>
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px 16px; background: #fff; width: 160px; opacity: 0.5;">
              <div style="font-size: 24px; text-align: center;">\u{1F4C4}</div>
              <div style="font-size: 12px; text-align: center; margin-top: 4px; color: #333;">2026-04-11.xlsx</div>
              <div style="font-size: 11px; text-align: center; color: #888;">6 筆 | $51,890</div>
            </div>
          </div>
          <div style="margin-top: 16px; padding: 12px; background: #fff3e0; border-radius: 6px; font-size: 12px;">
            \u{1F4CC} 會計每天來這裡下載當日 Excel → 上傳 A1
          </div>
        </div>
      </div>`
  },

  "sean-option-b": {
    title: "方案 B：儀表板勾選匯出",
    html: `
      <div class="mock-spreadsheet after">
        <div class="mock-emr-header">
          <span>\u{1F4CA} 販賣機銷貨儀表板</span>
          <span class="mock-emr-nav">2026/04/13</span>
          <span class="mock-emr-user">會計 欣潔</span>
        </div>
        <div style="padding: 8px 16px; background: #e8f5e9; font-size: 13px; display: flex; gap: 24px;">
          <span>今日 <strong>5</strong> 筆</span>
          <span>總數量 <strong>1,034</strong> 罐</span>
          <span>總金額 <strong>$42,325</strong></span>
          <span style="margin-left: auto; color: #2e7d32;">已勾 2 / 5</span>
        </div>
        <table class="mock-sheet-table emr">
          <thead>
            <tr>
              <th style="width:30px;">\u2610</th>
              <th>地點</th>
              <th>司機</th>
              <th>數量</th>
              <th>金額</th>
              <th>時間</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr style="opacity: 0.4; text-decoration: line-through;">
              <td>\u2611</td>
              <td>微風松高</td>
              <td>Gary</td>
              <td>268</td>
              <td>$11,340</td>
              <td>14:32</td>
              <td><span style="color:#2e7d32;">已入帳</span></td>
            </tr>
            <tr style="opacity: 0.4; text-decoration: line-through;">
              <td>\u2611</td>
              <td>秀泰文心6F</td>
              <td>LAI</td>
              <td>332</td>
              <td>$13,230</td>
              <td>15:10</td>
              <td><span style="color:#2e7d32;">已入帳</span></td>
            </tr>
            <tr>
              <td>\u2610</td>
              <td>台中秀泰S1館2F</td>
              <td>RJ</td>
              <td>141</td>
              <td>$5,880</td>
              <td>16:05</td>
              <td><span style="color:#1565c0;">待處理</span></td>
            </tr>
            <tr>
              <td>\u2610</td>
              <td>中正紀念堂</td>
              <td>Jeffry</td>
              <td>293</td>
              <td>$11,875</td>
              <td>16:42</td>
              <td><span style="color:#1565c0;">待處理</span></td>
            </tr>
            <tr style="background: #fff8e1;">
              <td>\u26A0</td>
              <td>台中秀泰3F</td>
              <td>RJ</td>
              <td>???</td>
              <td>???</td>
              <td>17:01</td>
              <td><span style="color:#e65100;">需確認</span></td>
            </tr>
          </tbody>
        </table>
        <div style="padding: 12px 16px; display: flex; gap: 12px;">
          <button style="background: #2e7d32; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer;">\u2B07 匯出勾選項目 (Excel)</button>
          <button style="background: #fff; color: #666; border: 1px solid #ddd; padding: 8px 20px; border-radius: 6px; cursor: pointer;">全選今日</button>
        </div>
      </div>`
  },

  "sean-driver-report": {
    title: "司機回報：兩種品號判斷",
    html: `
      <div style="display: flex; gap: 16px; padding: 12px;">
        <div style="flex: 1; background: #e8f5e9; border-radius: 10px; padding: 14px; font-size: 12px; line-height: 1.7; border: 2px solid #4caf50;">
          <div style="font-weight: bold; color: #2e7d32; margin-bottom: 8px; font-size: 13px;">\u2705 一般回報 \u2192 RAN00003 混和產品（瓶）</div>
          <div style="background: #fff; border-radius: 8px; padding: 10px; color: #333;">
            0327-0415 中正紀念堂 2號機<br>
            4243 汪汪隊天天<br>
            國稅局單照號碼<br>
            AY0008557<br>
            0415本次收款 3880/85005<br>
            0327前次收款 3708/76830<br>
            本次實收172罐8175元<br>
            銷售未歸零。Gary<br>
            趙結已完成。
          </div>
          <div style="margin-top: 8px; text-align: center; color: #2e7d32; font-weight: bold;">
            \u2192 品號 RAN00003・單位：瓶
          </div>
        </div>
        <div style="flex: 1; background: #fff3e0; border-radius: 10px; padding: 14px; font-size: 12px; line-height: 1.7; border: 2px solid #ff9800;">
          <div style="font-weight: bold; color: #e65100; margin-bottom: 8px; font-size: 13px;">\u26A0 含「入金」\u2192 RAN00004 產品入金（個）</div>
          <div style="background: #fff; border-radius: 8px; padding: 10px; color: #333;">
            0323-0415 遠百高雄B1<br>
            3007 吹泡泡 F7CAU<br>
            國稅局單照號碼<br>
            EY0002251<br>
            0415本次收款 15216/64390<br>
            0323前次收款 14980/54990<br>
            本次收款236罐9400元<br>
            銷量沒有歸零。<span style="background: #ffeb3b; padding: 1px 4px; border-radius: 3px; font-weight: bold;">需入金</span>。Paul<br>
            分項沒有列印
          </div>
          <div style="margin-top: 8px; text-align: center; color: #e65100; font-weight: bold;">
            \u2192 品號 RAN00004・單位：個
          </div>
        </div>
      </div>`
  }
};
