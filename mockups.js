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
  }
};
