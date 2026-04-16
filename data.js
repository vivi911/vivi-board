// ===== Tab 設定 =====
const PROJECT_TABS = {
  // 預設 Tab（所有專案都有）
  default: [
    { id: 'interview', label: '訪談', icon: '📋' },
    { id: 'research', label: '研究', icon: '🔍' },
    { id: 'architecture', label: '架構', icon: '🏗' },
    { id: 'spec', label: '規格', icon: '📄' }
  ]
};

// ===== 訪談表單模板 =====
const INTERVIEW_TEMPLATE = {
  sections: [
    {
      id: 'attendees',
      number: 0,
      title: '出席者',
      placeholder: '姓名 / 職稱 / 角色（決策者？使用者？IT？）',
      hint: null
    },
    {
      id: 'pain_points',
      number: 1,
      title: '痛點：現在最卡什麼？',
      placeholder: '記下對方主動提到的問題、抱怨、困擾...\n\n例：居留證到期常漏追、6 據點資料各管各的...',
      hint: '追問：「這件事卡住的時候，通常誰最頭痛？頻率多高？」'
    },
    {
      id: 'current_flow',
      number: 2,
      title: '現況：目前怎麼做的？',
      placeholder: '現在用什麼工具？Excel / 紙本 / 既有系統？\n哪些環節是人工？哪些已經有系統？\n有 IT 人員嗎？',
      hint: '追問：「一個案件從接單到移工到任，可以跟我走一遍流程嗎？」'
    },
    {
      id: 'expectations',
      number: 3,
      title: '期待：你希望變成怎樣？',
      placeholder: '對方心中的理想狀態\n有提到特定功能？還是只是「不要再手動」？\n有沒有預期的時程壓力？',
      hint: '追問：「如果有一個系統，你最希望它先解決哪件事？」'
    },
    {
      id: 'scope',
      number: 4,
      title: '範圍：哪些先做？哪些不急？',
      placeholder: '先做核心流程（MVP），複雜功能後面再加\n可以分幾個 Phase 逐步上線\n系統是否需要與其他平台串接？',
      hint: '追問：「如果第一版只能做三件事，你選哪三件？」'
    },
    {
      id: 'decision',
      number: 5,
      title: '決策：誰拍板？時程？預算？',
      placeholder: '決策者是誰？需要其他人同意嗎？\n希望什麼時候上線？有硬期限嗎？\n預算區間？有其他報價在比較嗎？',
      hint: '追問：「這件事是你可以直接決定，還是需要老闆或董事會同意？」'
    },
    {
      id: 'other',
      number: 6,
      title: '其他備註',
      placeholder: '會議中提到的其他重要資訊...',
      hint: null
    }
  ]
};

// ===== 研究調研模板 =====
const RESEARCH_TEMPLATE = {
  default: [
    {
      id: 'existing_system',
      title: '現有系統調研',
      placeholder: '目前用什麼系統？功能有哪些？哪些不足？\nAPI 是否開放？費用？限制？',
      hint: '重點：釐清能串接什麼、不能串接什麼'
    },
    {
      id: 'competitors',
      title: '競品 / 替代方案',
      placeholder: '市場上有哪些類似產品？\n各自的優缺點？定價？\n為什麼不直接用現成的？',
      hint: '了解客戶為什麼需要客製化'
    },
    {
      id: 'regulations',
      title: '法規 / 合規需求',
      placeholder: '涉及哪些法規？個資法？行業規定？\n資料保存年限？加密要求？',
      hint: null
    },
    {
      id: 'data_inventory',
      title: '資料盤點',
      placeholder: '客戶目前有哪些資料？格式？\n欄位清單、資料量、更新頻率',
      hint: '請客戶提供範例檔案'
    },
    {
      id: 'tech_options',
      title: '技術方案評估',
      placeholder: '架構選型、技術棧評估、成本估算\n為什麼選 A 不選 B？',
      hint: null
    },
    {
      id: 'open_questions',
      title: '待釐清問題',
      placeholder: '還沒有答案的問題、需要客戶回覆的事項',
      hint: '每次會議後更新，追蹤到有答案為止'
    }
  ],
  "asia-pacific": [
    {
      id: 'pinxuan_api',
      title: '聘軒系統 API 調研',
      placeholder: '聘軒是否開放 API？費用？限制？\n若不開放，匯出格式為何？',
      hint: '這是決定「自動同步」或「手動匯入」的關鍵',
      prefill: '待確認事項：\n1. 聘軒是否願意開放 API 供外部串接？\n2. API 開發費用？月租？\n3. 若不開放 API，匯出的 Excel/CSV 欄位有哪些？\n4. 匯出頻率限制？'
    },
    {
      id: 'alert_rules',
      title: '通知規則盤點',
      placeholder: '各項作業需提前幾天通知？',
      hint: '請客戶端列出具體天數',
      prefill: '請客戶確認各項提前通知天數：\n\n| 項目 | 建議天數 | 客戶確認 |\n|------|---------|--------|\n| 出入境 | 30 天前 | |\n| 體檢到期 | 30 天前 | |\n| 居留證展延 | 60 天前 | |\n| 合約到期 | 90 天前 | |\n| 保險到期 | 30 天前 | |\n\n是否需要多層提醒（如 60天 + 30天 + 7天）？'
    },
    {
      id: 'data_inventory',
      title: '資料欄位盤點',
      placeholder: '移工基本資料有哪些欄位？附件？',
      hint: '請客戶提供一份範例 Excel',
      prefill: '預計欄位：\n- 姓名、護照號碼、國籍\n- 所屬仲介、聯絡方式\n- 入境日、出境日\n- 體檢到期日\n- 居留證到期日\n- 合約起訖日\n- 保險到期日\n- 狀態（在職/離境/合約結束）\n\n待確認：\n- 還有哪些欄位？\n- 附件（護照掃描、體檢報告等）需要管理嗎？\n- 資料量：活躍約 3,000-4,000 人，歷史 10,000+ 筆'
    },
    {
      id: 'regulations',
      title: '法規與資安',
      placeholder: '個資法、勞動部規定、罰則',
      hint: null,
      prefill: '涉及法規：\n- 個人資料保護法（移工個資）\n- 勞動部就業服務法相關規定\n- 居留證/體檢逾期罰則\n\n資安措施：\n- GCP 台灣機房（asia-east1）\n- HTTPS + Firestore 靜態加密\n- 帳號權限控管\n- NDA 保密協議（雙方簽署）'
    },
    {
      id: 'competitors',
      title: '競品與現有方案',
      placeholder: '聘軒以外還有什麼選擇？為什麼不用？',
      hint: null,
      prefill: '現有方案：\n- 聘軒系統：行政軟體，無儀表板功能，介面不友善\n- Salesforce / Tableau：功能過重，學習門檻高，成本高\n- Excel 人工管理：目前做法，容易出錯\n\n決策：客製化簡易儀表板，降低學習門檻'
    },
    {
      id: 'open_questions',
      title: '待釐清問題',
      placeholder: '還沒有答案的問題',
      hint: '每次會議後更新',
      prefill: '1. 聘軒 API 開放性？（待客戶詢問）\n2. 各項通知提前天數？（待客戶列出）\n3. 使用者共幾位？仲介分幾組？\n4. 是否需要「唯讀」角色（主管看報表）？\n5. 移工基本資料範例檔？（待客戶提供）\n6. 預算與時程期望？'
    }
  ]
};

// ===== 專案資料 =====

const PROJECTS = {
  "meili-emr": {
    name: "美力 電子病歷 系統架構",
    brief: {
      background: `美力時尚醫美目前以紙本病歷為主，跨店、跨角色的資料流通全靠人工。
電子病歷專案的目標是將「客人從預約到術後追蹤」的完整流程數位化，
取代紙本表單，統一四店資料，並串接現有的凱惠 POS 系統。`,
      pain_points: [
        "小編預約要同時填 Google Sheet + 凱惠，雙重輸入易出錯",
        "紙本病歷跨店無法即時調閱，醫師只能看到當店紀錄",
        "療程堂數靠人工核對，護理師需同時開電子病歷和凱惠比對",
        "行銷歸因斷鏈：不知道哪個廣告帶來哪個客人",
        "同意書/衛教書紙本保存 7 年，佔空間且難查找"
      ],
      roles: [
        { name: "小編", desc: "接預約、填客戶資料、行銷歸因第一線" },
        { name: "控場", desc: "現場派工，指派諮詢師/醫師/美容師" },
        { name: "諮詢師", desc: "客戶評估、拍照、填諮詢紀錄、建消費單" },
        { name: "醫師", desc: "施作療程、填療程紀錄、醫囑" },
        { name: "護理師/美容師", desc: "協助施作、耗療核銷、更新進度" },
        { name: "客人", desc: "填基本資料、簽同意書、查堂數（LINE OA）" },
        { name: "總公司主管", desc: "跨店報表、營收統計、行銷分析" }
      ],
      team: [
        { role: "專案管理", name: "Vivi", org: "goaskvivi" },
        { role: "開發商", name: "Sam Hsu", org: "采盟科技" },
        { role: "POS 廠商", name: "凱惠", org: "凱惠資訊" },
        { role: "業主", name: "美力時尚醫美", org: "bebetterone.com" }
      ],
      locations: ["(微整)站前4F", "(體雕)站前11F", "(微整)忠孝7F", "(微整)忠孝健康7F", "(體雕)忠孝國際3F"],
      phases: [
        { id: "P1", name: "報到+基本資料", status: "current" },
        { id: "P2", name: "邀約取代 GSheet", status: "planned" },
        { id: "P3", name: "諮詢+療程紀錄", status: "planned" },
        { id: "P4", name: "耗療核銷", status: "blocked", note: "等凱惠新 API" },
        { id: "P5", name: "電子同意書", status: "blocked", note: "等簽署廠商" },
        { id: "P6", name: "醫囑+進階功能", status: "planned" }
      ],
      // ===== 以下原本在白板的非流程卡片，改成結構化資料 =====
      apis: {
        existing: [
          { id: "#1", name: "Read_客戶資料", desc: "手機號碼查新舊客" },
          { id: "#2", name: "Create_客戶資料", desc: "快速建檔新客（姓名+手機+館別）" },
          { id: "#3", name: "Update_客戶資料", desc: "更新完整客戶資料（47欄位）" },
          { id: "#4", name: "Read_客戶預約資料", desc: "查詢可預約床位/時段" },
          { id: "#5", name: "Create_客戶預約資料", desc: "建立預約" },
          { id: "#6", name: "Update_客戶預約資料", desc: "更新狀態 CANCEL/CHECKIN/FINISHED" }
        ],
        gaps: [
          { name: "Read_消費單", desc: "拉取客戶消費紀錄", phase: "P4" },
          { name: "Read_耗療項目", desc: "拉取未核銷療程清單", phase: "P4" },
          { name: "Update_耗療核銷", desc: "電子病歷核銷後回寫凱惠", phase: "P4" },
          { name: "Read_療程堂數", desc: "查詢客戶剩餘堂數", phase: "P4" },
          { name: "Read_排班/床位", desc: "即時狀態（非必要）", phase: "-" },
          { name: "簡訊模板自訂", desc: "確認能否塞短網址", phase: "P1" }
        ]
      },
      discussions: [
        { text: "控場→醫師/諮詢師的通知方式（系統內推播？LINE？口頭？）", done: false },
        { text: "推車/設備管理是否納入？放在哪個流程環節？", done: false },
        { text: "凱惠簡訊模板是否可自訂", done: false },
        { text: "電子簽署廠商選定", done: false },
        { text: "檢測儀器串接（Inbody/皮膚檢測/血值）", done: false },
        { text: "處方箋是否納入", done: false },
        { text: "角色權限細節（RBAC 或欄位級控制）", done: false },
        { text: "針劑醫師排班功能需求確認", done: false },
        { text: "VIP 照片分級權限規則", done: false },
        { text: "LINE OA 綁定方案（LINE Login / LIFF）", done: false },
        { text: "試行店別選定", done: false },
        { text: "資安合規要求確認", done: false }
      ],
      infrastructure: [
        {
          title: "LINE OA 綁定機制",
          items: [
            "綁定時機：到店掃碼報到時觸發",
            "綁定方式：LINE Login + 手機號碼比對凱惠客戶ID",
            "綁定後能力：推播提醒、術後注意事項、查堂數、行銷再觸達",
            "待確認：LINE Login 方案、美力是否有 LINE OA、四店共用或各自"
          ]
        },
        {
          title: "角色權限設計",
          items: [
            "小編：邀約畫面、自己負責的店",
            "控場：今日報到清單、派工（僅該店）",
            "諮詢師：被指派客戶、諮詢紀錄、照片",
            "醫師：被指派客戶、療程紀錄（看不到金額）",
            "護理師：耗療核銷、進度更新",
            "主管：全部 + 金額 + 跨店報表",
            "VIP 照片：僅指定角色可查看"
          ]
        },
        {
          title: "資料合規 & 備份",
          items: [
            "病歷保存：自最後就醫日起 7 年；未成年至成年+7年",
            "個資法：蒐集需告知同意、客戶可要求刪除/匯出",
            "備份：每日自動備份、異地備援（GCP 跨區域）",
            "照片/文件存 Cloud Storage"
          ]
        },
        {
          title: "過渡期方案",
          items: [
            "Phase 1 上線：紙本+電子雙軌並行",
            "舊客：到店時逐步完成 LINE 綁定，不需全部掃描",
            "員工分批訓練：小編→控場→諮詢師→醫師",
            "建議先在一家店試行，穩定後推其他店"
          ]
        }
      ]
    },
    // ===== 白板只留主流程卡片 =====
    cards: [
      {
        id: "flow1",
        category: "流程1",
        title: "邀約（小編接客）",
        status: "confirmed",
        col: 0, row: 0,
        next: ["flow2", "flow1-before"],
        content: `現況：小編從 Meta/LINE/電話接預約 → 手動填 Google Sheet + 凱惠（雙重輸入）
小編需即時看凱惠房間/時段表跟客人喬時間 → 凱惠操作不動

電子病歷 優化：建立「邀約畫面」取代 Google Sheet
欄位：
- 來源（行銷通路）→ 下拉選單
- 素材歸因 → 下拉選單
- 預約人 → 自動帶入（登入小編帳號）
- 平台 → 下拉（LINE/IG/FB/電話）
- KOL → 選填
- 客戶姓名、電話
- 店別 → 下拉（忠孝館/站前館/忠孝320）
- 預約日期、時間
- FB/IG名稱 → 選填
- 備註

第二階段：接 Meta Ads API 自動歸因`,
        comments: []
      },
      {
        id: "flow2",
        category: "流程2",
        title: "簡訊通知 & 確認報到",
        status: "discuss",
        col: 1, row: 0,
        next: ["flow3"],
        content: `現況：凱惠串簡訊系統，前一天發純文字簡訊通知客人

電子病歷 優化：
簡訊內附短網址 → 客人點進 電子病歷 確認頁
→ 點「確認報到」或「取消」
→ 電子病歷 打 API #6 回寫凱惠（actionType: CANCEL）

📌 待確認：凱惠簡訊模板可否自訂？
若不行 → 改由 電子病歷 發簡訊（三竹等第三方）`,
        comments: []
      },
      {
        id: "flow3",
        category: "流程3",
        title: "到店掃碼報到",
        status: "confirmed",
        col: 2, row: 0,
        next: ["flow3a", "flow3b"],
        content: `電子病歷 為每筆預約產生唯一 QR code
客人到店掃碼 → 電子病歷 收到報到事件
系統用手機號碼打 API #1 判斷新客/舊客
報到後觸發 LINE OA 綁定
電子病歷 dashboard 即時顯示：今日到店率、未到客人、各店別狀態
打 API #6 回寫凱惠（actionType: CHECKIN）
行銷歸因串接：掃碼時帶入客戶來源渠道

→ 新客走【流程3a】
→ 舊客走【流程3b】`,
        comments: []
      },
      {
        id: "flow3a",
        category: "流程3a",
        title: "新客：填寫基本資料",
        status: "confirmed",
        col: 3, row: -0.5,
        next: ["flow4"],
        content: `掃碼報到 + 綁 LINE OA 後，手機上直接填寫
對應紙本「貴賓基本資料」表所有欄位電子化

個資：姓名、身分證、生日、電話、地址、職業、Email
醫療：用藥習慣、過敏史、懷孕、特殊病史、肌無力症
膚況：膚質、皮膚狀況、欲改善症狀、困擾問題
醫美經驗：雷射/拉皮/微整/抗老/護理/體雕/手術
其他：健保卡確認、緊急聯絡人、術後關心時間偏好

填完後 → API #2 建客戶 + API #3 更新完整資料到凱惠`,
        comments: []
      },
      {
        id: "flow3b",
        category: "流程3b",
        title: "舊客：確認資料",
        status: "confirmed",
        col: 3, row: 0.5,
        next: ["flow4"],
        content: `掃碼報到時，用手機號碼查凱惠（API #1）找到既有資料
顯示「歡迎回來 XXX，請確認您的資料是否正確」
客人可補填或更新（換電話、懷孕狀態等）

系統上線過渡期：舊客第一次來需完成 LINE OA 綁定
已綁定的舊客：掃碼直接報到，不用再填`,
        comments: []
      },
      {
        id: "flow4",
        category: "流程4",
        title: "控場派工",
        status: "discuss",
        col: 4, row: 0,
        next: ["flow5"],
        content: `控場在 電子病歷 看當日報到清單 + 報到狀態
→ 指派諮詢師（確定）+ 指派美容師
客戶結帳後 → 控場確認已結帳 → 指派醫師

📌 待討論：控場指派後如何通知醫師/諮詢師？
- 選項A：電子病歷 系統內推播通知
- 選項B：LINE 推播
- 選項C：其他方式
需確認美力現場目前的通知習慣`,
        comments: []
      },
      {
        id: "flow5",
        category: "流程5",
        title: "諮詢師作業",
        status: "confirmed",
        col: 5, row: 0,
        next: ["flow5a", "flow6"],
        content: `諮詢師在 電子病歷 看被指派的客戶清單
1. 填寫諮詢紀錄
2. 上傳客戶照片（B/A照、Inbody等）
3. 確認客戶購買項目
4. 在凱惠 POS 建立消費單，取得消費單號

BA照片流程：
拍照室單眼拍攝 → 雲端 → 諮詢師在 電子病歷 客戶頁面上傳綁定
建議優化：拍照前掃客戶 QR → 照片自動命名 客戶ID_日期_序號

✅ VIP/明星照片需分級權限，僅指定角色可查看`,
        comments: []
      },
      {
        id: "flow5a",
        category: "流程5a",
        title: "初診評估（臉部/體型）",
        status: "confirmed",
        col: 6, row: -0.5,
        next: [],
        content: `對應紙本「初診第一次全面評估規劃」

建議：結構化勾選為主 + iPad手繪為輔

臉部區域預設：額頭、眼周、臉頰、鼻子、嘴周、下巴、輪廓線、頸部
每個區域點開 → 常見問題勾選：
過敏、脫皮、黑斑、膚色不均、黑眼圈、痘疤、皺紋、鬆弛、毛孔粗大、青春痘、血管、泛紅等

體型評估：漏尿、肥胖、肌肉過少（部位）、皮下脂肪過多（部位）

90% 情況用勾選即夠
特殊案例 → iPad + Apple Pencil 自由標註
結構化資料可做分析（最多客人想改善什麼）`,
        comments: []
      },
      {
        id: "flow6",
        category: "流程6",
        title: "消費結帳",
        status: "gap",
        col: 6, row: 0.5,
        next: ["flow7"],
        content: `消費單在凱惠 POS 建立（維持不動）
凱惠產生消費單號 + 同時產生耗療項目
付款方式：現金/刷卡/匯款

電子病歷 需從凱惠拉取消費紀錄
❌ API 缺口：Read_消費單

醫師在 電子病歷 看到的是次數，看不到金額
金額僅主管可見`,
        comments: []
      },
      {
        id: "flow7",
        category: "流程7",
        title: "施作前：同意書簽署",
        status: "discuss",
        col: 7, row: 0,
        next: ["flow8"],
        content: `客戶在施作前簽署手術同意書
各療程有不同版本：音波拉皮、阿爾發凍脂、肉毒、填充等

電子簽署：串接衛福部認證的電子簽署廠商
電子病歷 負責：
- 同意書模板版本管理
- 在正確流程節點觸發簽署

合規要求：
- IP 位置記錄
- 多裝置簽署（手機/平板）
- 時間戳
- 保存年限：一般 7 年（自最後一次就醫日起），未成年至成年+7年
- 簽署紀錄綁定：客戶ID + 療程 + 時間戳

📌 待確認：電子簽署廠商選定`,
        comments: []
      },
      {
        id: "flow8",
        category: "流程8",
        title: "醫師施作 & 療程紀錄",
        status: "discuss",
        col: 8, row: 0,
        next: ["flow9"],
        content: `醫師在 電子病歷 看被指派的客戶清單
美容師添加更新客戶進度

醫師填寫療程紀錄（對應紙本「療程&醫囑紀錄單」+「耗療單」）

建議結構化輸入：
- 施作日期 → 自動帶入
- 施作部位 → 點選區域
- 施作項目 → 下拉選單（從耗療拉）
- 劑量/發數 → 數字輸入
- 醫囑備註 → 文字輸入
- 醫師電子簽名

如需臉部圖標記 → iPad + Apple Pencil

美容師完成後更新客戶進度

📌 待討論：針劑醫師排班功能需求確認`,
        comments: []
      },
      {
        id: "flow9",
        category: "流程9",
        title: "耗療核銷",
        status: "gap",
        col: 9, row: 0,
        next: ["flow10"],
        content: `消費單在凱惠 POS 產生 → 同時產生耗療項目

電子病歷 從凱惠拉取耗療資料
❌ API 缺口：Read_耗療項目

護理師在 電子病歷 上核銷（不用再開凱惠）

核銷後 電子病歷 打 API 回寫凱惠
❌ API 缺口：Update_耗療核銷

堂數管理：電子病歷 顯示客戶剩餘堂數
❌ API 缺口：Read_療程堂數`,
        comments: []
      },
      {
        id: "flow10",
        category: "流程10",
        title: "施作後：衛教書簽署",
        status: "confirmed",
        col: 10, row: 0,
        next: ["flow11"],
        content: `施作完成後，客戶簽署衛教書
確認客人已了解術後注意事項
與施作前同意書拆開，分兩個時間點簽署

諮詢師發送術後恢復文件
同樣透過電子簽署廠商處理`,
        comments: []
      },
      {
        id: "flow11",
        category: "流程11",
        title: "術後追蹤",
        status: "confirmed",
        col: 11, row: 0,
        next: [],
        content: `對應紙本「追蹤記錄單」
術後追蹤紀錄電子化
追蹤時間點、客戶反饋、恢復狀況`,
        comments: []
      },
      // ===== 邀約 Before / After 示意 =====
      {
        id: "flow1-before",
        category: "BEFORE",
        title: "現況：Google Sheet",
        status: "discuss",
        col: 0, row: 2,
        next: ["flow1-after"],
        mockup: "flow1-before",
        content: `現況痛點：
- 小編手動填 Google Sheet + 凱惠雙重輸入
- 欄位不統一，每個小編填法不同
- 行銷歸因靠人工填寫，常漏填
- 無法即時看凱惠房間/時段
- 資料散落在多個 Sheet 分頁`,
        comments: []
      },
      {
        id: "flow1-after",
        category: "AFTER",
        title: "電子病歷：邀約表",
        status: "confirmed",
        col: 2, row: 2,
        next: [],
        mockup: "flow1-after",
        content: `對應紙本「追蹤記錄單」
術後追蹤紀錄電子化
追蹤時間點、客戶反饋、恢復狀況
與客人微型頁面串接（客人可查看術後注意事項）`,
        comments: []
      },
    ]
  },

  "sean-vending": {
    name: "Sean 販賣機業績自動化",
    brief: {
      background: `Sean 經營販賣機事業，機台 50+ 台分布各商場（秀泰、微風、中正紀念堂等）。
目前司機巡機後在 LINE 群組回報業績，會計逐筆手動建鼎新 A1 銷貨單，耗時且易錯。
目標：默默小幫手自動監聽 LINE 回報 → AI 解析 → 產出 A1 匯入格式 Excel → 會計批次匯入。`,
      pain_points: [
        "司機每次回報一大段文字，會計要肉眼找出數量和金額",
        "每筆都要手動開 A1 → 選客戶 → 選業務 → 選品號 → 輸入數量金額 → 儲存",
        "50+ 機台，每月可能數百筆，全靠人工逐筆建單",
        "容易看錯數字、選錯客戶，出錯後難追溯",
        "會計時間花在低價值的資料搬運上"
      ],
      roles: [
        { name: "司機", desc: "巡機、補貨、回報業績（LINE 群組固定格式）" },
        { name: "會計", desc: "讀 LINE 訊息 → 建 A1 銷貨單 → 對帳" },
        { name: "Sean", desc: "老闆，掌握整體營收數據" }
      ],
      team: [
        { role: "客戶", name: "Sean", org: "販賣機事業" },
        { role: "開發", name: "Vivi", org: "goaskvivi" }
      ],
      locations: ["微風松高", "秀泰文心6F", "台中秀泰S1館2F", "中正紀念堂", "...共 50+ 點位"],
      phases: [
        { id: "P0", name: "合約簽訂", status: "done", note: "2026/04/13 雙方用印" },
        { id: "P1", name: "建置開發", status: "current", note: "LINE Bot + AI 解析 + Excel 產出" },
        { id: "P2", name: "測試驗收", status: "planned", note: "7 天驗收期" },
        { id: "P3", name: "正式上線", status: "planned", note: "驗收通過後月訂閱起算" }
      ],
      apis: { existing: [], gaps: [] },
      discussions: [
        { text: "客戶代碼對照表（地點 → V 編號）—— 等 Sean 提供", done: false },
        { text: "業務代碼對照表（司機 → A/B 編號）—— 等 Sean 提供", done: false },
        { text: "會計多久上傳一次 A1？每天 / 每週？", done: false },
        { text: "司機回報格式是否所有司機都一致？", done: false },
        { text: "A1 電商匯入中心「販賣機」自訂商店的欄位確認", done: false },
        { text: "Excel 放雲端 vs 儀表板勾選匯出，會計偏好哪種？", done: false },
        { text: "一則訊息可能包含多台機器回報（如同時報兩個地點），AI 需拆成多筆銷貨單 —— 確認是否常見", done: false },
        { text: "品號是否永遠用 RAN00003？還是有些回報需用 RAN00001 盲玩(24)、RAN00002 盲玩(30)、RAN00004 入金、RAN00005 電子支付？", done: false },
        { text: "司機回報群組有幾個？Bot 需加入幾個群？", done: false },
        { text: "LINE OA 帳號：使用默默小幫手", done: true },
        { text: "Google Drive 共用資料夾用誰的帳號？goaskvivi 還是 Sean 公司？", done: false }
      ],
      infrastructure: [
        {
          title: "報價摘要",
          items: [
            "系統建置費：NT$8,000（一次性，未稅）",
            "月維護訂閱費：NT$1,200/月（驗收後起算，未稅）",
            "合約日期：2026/04/12，已雙方用印簽回"
          ]
        },
        {
          title: "技術架構",
          items: [
            "LINE Bot（默默小幫手）加入司機回報群組",
            "Webhook 接收訊息 → Claude Haiku 解析",
            "解析結果存 Firestore + 產出 Excel",
            "Excel 存 Google Drive 共用資料夾",
            "部署：GCP Cloud Run（與默默共用）"
          ]
        },
        {
          title: "交付項目",
          items: [
            "AI 小幫手 LINE Bot（加入群組自動辨識）",
            "自動 Excel 產出（A1 匯入格式）",
            "Google Drive 共用資料夾",
            "A1 自訂格式設定（販賣機商店）",
            "操作 SOP 文件"
          ]
        }
      ]
    },
    cards: [
      {
        id: "s-flow1",
        category: "流程1",
        title: "司機 LINE 回報",
        status: "confirmed",
        col: 0, row: 0,
        next: ["s-flow2"],
        content: `司機巡機後在 LINE 群組發固定格式回報：

📌 訊息結構：
第1行：日期區間 + 地點名稱（如「0409-(0413) 微風松高」）
第2行：機台型號（3627史努比藍 F8CAU）
中間：國稅局號碼、設備編號、收款讀數（不需要）
關鍵行：「本次實收 268 罐 11340 元」→ 數量 + 金額
尾部：司機英文名（Gary / LAI / RJ / Jeffry）

每則回報 = 一台機器在一個地點的銷售彙總`,
        comments: []
      },
      {
        id: "s-flow2",
        category: "流程2",
        title: "默默靜默監聽 + Reply 確認",
        status: "confirmed",
        col: 1, row: 0,
        next: ["s-flow3"],
        content: `默默在司機群組靜默監聽所有訊息
收到回報後 AI（Haiku）即時解析，30 秒內 Reply：

✅ 收到
📍 微風松高｜268 罐｜$11,340
👤 Gary

▸ Reply 不吃 LINE 推播額度（免費）
▸ 司機和會計都看得到，確認沒漏
▸ 解析失敗時回覆「⚠️ 這筆看不懂，請會計確認」`,
        comments: []
      },
      {
        id: "s-flow3",
        category: "流程3",
        title: "AI 解析 → 寫入資料庫",
        status: "discuss",
        col: 2, row: 0,
        next: ["s-flow4a", "s-flow4b"],
        content: `AI 從訊息抓出 3 個關鍵欄位：

1. 地點 → 查對照表 → 客戶代碼（V10067）
2.「本次實收 X 罐 Y 元」→ 數量 + 金額
3. 司機名 → 查對照表 → 業務代碼（A06）

固定欄位（不需解析）：
・品號：RAN00003（販賣機混和產品）
・收款方式：月結/未收款/貨到付款
・發票聯式：不開
・課稅別：無

解析結果寫入 Firestore`,
        comments: []
      },
      {
        id: "s-flow4a",
        category: "路徑A",
        title: "方案 A：Excel 放 Google Drive",
        status: "discuss",
        col: 4, row: 0,
        next: ["s-flow5"],
        mockup: "sean-option-a",
        content: `每日自動產出一份 A1 格式 Excel 存 Google Drive

會計流程：
1. 打開 Google Drive 共用資料夾
2. 下載今天的 Excel（如 2026-04-13.xlsx）
3. 上傳 A1 電商匯入中心
4. 批次轉銷貨單

✅ 優點：簡單、成本低、在報價範圍內
⚠️ 缺點：沒有即時總覽、不知道哪些已入帳`,
        comments: []
      },
      {
        id: "s-flow4b",
        category: "路徑B",
        title: "方案 B：儀表板勾選匯出",
        status: "discuss",
        col: 6, row: 0,
        next: ["s-flow5"],
        mockup: "sean-option-b",
        content: `會計打開網頁儀表板，即時看到所有銷貨：

☑️ 微風松高｜268罐｜$11,340｜Gary  → 反灰
☑️ 秀泰文心｜332罐｜$13,230｜LAI   → 反灰
☐ 台中秀泰｜141罐｜$5,880｜RJ
☐ 中正紀念堂｜293罐｜$11,875｜Jeffry

勾選完 → 按「匯出 Excel」→ 上傳 A1

✅ 優點：即時可見、勾過反灰不怕漏、可改錯
⚠️ 缺點：開發量較大，可能需額外報價`,
        comments: []
      },
      {
        id: "s-flow5",
        category: "流程5",
        title: "會計上傳 A1 → 批次轉銷貨單",
        status: "confirmed",
        col: 8, row: 0,
        next: [],
        content: `會計拿到 Excel 後：

1. 登入鼎新 A1
2. 進「電商匯入中心」→「販賣機」自訂商店
3. 上傳 Excel
4. 系統自動比對欄位 → 批次建立銷貨單
5. 檢查無誤 → 確認

📌 「電商匯入中心」雖然叫電商，但官方支援任何外部來源
📌 需一次性設定「販賣機」自訂商店的欄位對應`,
        comments: []
      },
      // Before/After 示意
      {
        id: "s-before",
        category: "BEFORE",
        title: "現況：手動建銷貨單",
        status: "confirmed",
        col: 0, row: 6,
        next: ["s-after"],
        mockup: "sean-before",
        content: `會計現在的痛苦流程：
1. 看 LINE 群組司機回報（一大段文字）
2. 肉眼找出地點、數量、金額
3. 開 A1 → 選客戶（V10067 微風松高香堤）
4. 選業務（B01 陳翔）
5. 選品號（RAN00003 販賣機混和產品）
6. 手動輸入數量 268、金額 11,340
7. 儲存 → 再開下一筆
每筆約 2-3 分鐘 × 每月數百筆 = 大量時間`,
        comments: []
      },
      {
        id: "s-after",
        category: "AFTER",
        title: "自動化後：批次匯入",
        status: "confirmed",
        col: 3, row: 6,
        next: [],
        mockup: "sean-after",
        content: `自動化後會計只需：
1. 打開 Google Drive（或儀表板）
2. 下載/匯出今日 Excel
3. 上傳 A1 電商匯入中心
4. 一鍵批次轉銷貨單

每天只花 2 分鐘，不再逐筆手建`,
        comments: []
      }
    ]
  },

  "asia-pacific": {
    name: "亞太資源管理顧問 — 外籍移工管理系統",
    brief: {
      background: `亞太資源管理顧問（股）公司，2002 年成立，6 據點、50 人、資本額 1,600 萬，AAAA 評鑑、ISO 9001。
主營外籍移工仲介一條龍服務：需求接單→海外招募→文件申報→入台安置→在職管理→續約/轉換→離境返鄉。
目前多數環節仰賴 Excel / 紙本 / 人工追蹤，需要系統化管理。`,
      pain_points: [],
      roles: [
        { name: "管理層", desc: "營運決策、跨據點管理" },
        { name: "業務", desc: "接單、雇主端需求對接" },
        { name: "文件專員", desc: "勞動部申報、體檢/護照/簽證追蹤" },
        { name: "翻譯/安置", desc: "入台接機、住宿安排、職前訓練" },
        { name: "在職管理", desc: "定期訪視、問題處理、居留證追蹤" }
      ],
      team: [
        { role: "品牌商", name: "亞太資源", org: "亞太資源管理顧問（股）" },
        { role: "開發商", name: "Sam Hsu", org: "采盟科技" },
        { role: "專案管理", name: "Vivi", org: "goaskvivi" }
      ],
      locations: ["台北總公司", "桃園", "台中", "台南", "高雄", "花蓮"],
      phases: [
        { id: "P0", name: "需求訪談", status: "current", note: "2026/04/16 第一次訪談" },
        { id: "P1", name: "規格確認", status: "planned" },
        { id: "P2", name: "開發建置", status: "planned" },
        { id: "P3", name: "測試上線", status: "planned" }
      ],
      apis: { existing: [], gaps: [] },
      discussions: [],
      infrastructure: []
    },
    cards: [
      // === Row 0: 資料來源 ===
      {
        id: "data-source",
        category: "資料來源",
        title: "聘軒系統 / CSV 匯入",
        status: "discuss",
        col: 0, row: 0,
        next: ["data-parse"],
        content: `首選：串接聘軒 API 自動同步移工資料
備案：人工從聘軒匯出 Excel/CSV，上傳至系統

待確認：
- 聘軒是否開放 API？費用？
- 若手動匯入，匯出格式為何？欄位對應？
- 匯入頻率：每日？每週？即時？`,
        comments: []
      },
      {
        id: "data-parse",
        category: "資料處理",
        title: "資料解析與匯入模組",
        status: "gap",
        col: 1, row: 0,
        next: ["db-store"],
        content: `功能：
- API 模式：排程自動拉取聘軒資料，比對差異後更新
- CSV 模式：上傳後自動解析欄位、驗證格式、錯誤提示
- 重複偵測：依護照號碼判斷新增 or 更新
- 匯入紀錄：每次匯入留 log（時間、筆數、錯誤）

欄位對應：
姓名、護照號碼、國籍、所屬仲介、聯絡方式
入境日、出境日、體檢到期日、居留證到期日
合約起訖日、保險到期日、狀態`,
        comments: []
      },
      {
        id: "db-store",
        category: "資料儲存",
        title: "Firestore 移工資料庫",
        status: "gap",
        col: 2, row: 0,
        next: ["alert-engine", "dashboard-overview"],
        content: `Collection: workers
Document 結構：
{
  name, passport_no, nationality,
  agent_name (所屬仲介),
  entry_date, exit_date,
  health_check_expiry,
  residence_permit_expiry,
  contract_start, contract_end,
  insurance_expiry,
  status: "active" | "departed" | "expired",
  created_at, updated_at
}

資料規模：3,000-4,000 活躍 + 10,000+ 歷史
部署：GCP asia-east1（台灣機房）
加密：HTTPS + Firestore 靜態加密`,
        comments: []
      },

      // === Row 1: Alert 引擎 ===
      {
        id: "alert-engine",
        category: "核心引擎",
        title: "Alert 警示引擎",
        status: "gap",
        col: 1, row: 1,
        next: ["alert-rules"],
        content: `每日自動掃描全部活躍移工，計算各項到期剩餘天數

5 大警示類型：
1. 出入境警示 — 出境前提醒準備文件
2. 體檢到期警示 — 逾期受罰
3. 居留證展延警示 — 到期前辦理
4. 合約到期警示 — 續約或離境決策
5. 保險到期警示 — 續保提醒

燈號邏輯：
🔴 逾期 或 ≤ 7 天
🟡 8-30 天
🟢 > 30 天（安全）`,
        comments: []
      },
      {
        id: "alert-rules",
        category: "核心引擎",
        title: "自定義通知規則",
        status: "discuss",
        col: 2, row: 1,
        next: ["dashboard-overview"],
        content: `管理員可設定各類警示的提前通知天數

預設值（待客戶確認）：
- 出入境：30 天前
- 體檢：30 天前
- 居留證展延：60 天前（需提前送件）
- 合約到期：90 天前（需決策時間）
- 保險：30 天前

待確認：
- 各項目實際需提前幾天？
- 是否需要多層提醒（如 60天 + 30天 + 7天）？`,
        comments: []
      },

      // === Row 2: 儀表板 UI ===
      {
        id: "dashboard-overview",
        category: "儀表板",
        title: "總覽頁",
        status: "gap",
        col: 0, row: 2,
        next: ["dashboard-category", "dashboard-list"],
        content: `一眼掌握全局：

顯示內容：
- 各類 Alert 數量統計（紅/黃/綠）
- 今日待處理總筆數
- 逾期未處理筆數（紅色醒目）
- 本週即將到期筆數

互動：
- 點擊各類別可跳轉至分類檢視
- 點擊數字可直接看清單`,
        comments: []
      },
      {
        id: "dashboard-category",
        category: "儀表板",
        title: "分類檢視",
        status: "gap",
        col: 1, row: 2,
        next: ["dashboard-list"],
        content: `依 5 大 Alert 類型分頁切換：

Tab：出入境 | 體檢 | 居留證 | 合約 | 保險

每個分類頁顯示：
- 該類別紅/黃/綠統計
- 待處理清單（依剩餘天數排序）
- 可依仲介篩選`,
        comments: []
      },
      {
        id: "dashboard-list",
        category: "儀表板",
        title: "清單列表 & 篩選",
        status: "gap",
        col: 2, row: 2,
        next: [],
        content: `每位移工一行，欄位：
燈號 | 姓名 | 護照號 | 國籍 | 所屬仲介 | 到期項目 | 到期日 | 剩餘天數

功能：
- 排序：依剩餘天數、仲介、國籍
- 篩選：依仲介、國籍、狀態、燈號
- 搜尋：姓名、護照號碼快搜
- 響應式：桌面表格 / 手機卡片式`,
        comments: []
      },

      // === Row 3: 系統 ===
      {
        id: "auth",
        category: "系統",
        title: "登入與權限",
        status: "gap",
        col: 0, row: 3,
        next: ["dashboard-overview"],
        content: `角色權限：
- 管理員：看全部移工、設定通知規則、管理帳號
- 仲介：只看自己負責的移工

登入方式：
帳號密碼（由管理員建立）

待確認：
- 共幾位使用者？
- 仲介分幾組？各負責幾位移工？
- 是否需要「唯讀」角色（如主管只看報表）？`,
        comments: []
      },
      {
        id: "infra",
        category: "系統",
        title: "GCP 部署 & 資安",
        status: "gap",
        col: 1, row: 3,
        next: [],
        content: `架構：
- 前端：靜態網頁（Cloud Storage / Firebase Hosting）
- 後端：Cloud Run（API + Alert 引擎）
- 資料庫：Firestore
- 機房：asia-east1（台灣）

資安：
- HTTPS 全程加密
- Firestore 靜態加密
- 帳號權限控管
- NDA 保密協議（雙方簽署）

維運：
- 預估月費 $3,000（Cloud Run + Firestore）
- 含系統監控 & 小幅調整`,
        comments: []
      }
    ]
  }
};
