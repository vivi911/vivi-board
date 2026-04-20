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
        { role: "開發商", name: "Sam Hsu", org: "學得力" },
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
        specCodes: ["A1", "A2", "A4"],
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
        specCodes: ["A5", "A6"],
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
        specCodes: ["B1-3", "B1-4", "B2-1"],
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
        specCodes: ["B1-1", "B1-2", "B1-5"],
        status: "confirmed",
        col: 3, row: -0.5,
        next: ["flow4", "flow3a-mock"],
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
        specCodes: ["B2-2", "B2-3"],
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
        specCodes: ["B3-1", "B3-2"],
        status: "discuss",
        col: 4, row: 0,
        next: ["flow5", "flow4-mock"],
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
        specCodes: ["B3-3", "B3-4", "B3-5"],
        status: "confirmed",
        col: 5, row: 0,
        next: ["flow5a", "flow6", "flow5-mock"],
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
        specCodes: ["C2"],
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
        specCodes: ["B3-6", "D1-1", "D1-2", "D1-3", "D1-4"],
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
        specCodes: ["B4-1", "B4-2", "B4-3", "B4-4", "B4-5", "B4-6", "B5-1", "B5-2", "B5-3", "B5-4"],
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
        specCodes: ["C3"],
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
        specCodes: ["B3-6"],
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
        specCodes: ["C1"],
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
      // ===== 示意圖：新客報到 =====
      {
        id: "flow3a-mock",
        category: "示意圖",
        title: "新客報到（手機畫面）",
        status: "confirmed",
        col: 3, row: 2,
        next: [],
        mockup: "flow3a-mockup",
        content: `客人掃 QR code 後在手機上填寫基本資料
對應紙本「貴賓基本資料」表電子化
填完自動寫入凱惠（API #2 + #3）`,
        comments: []
      },
      // ===== 示意圖：控場派工 =====
      {
        id: "flow4-mock",
        category: "示意圖",
        title: "控場派工看板",
        status: "discuss",
        col: 5, row: 2,
        next: [],
        mockup: "flow4-mockup",
        content: `控場即時看今日報到清單
一鍵指派諮詢師和醫師
新客/舊客、等候/諮詢中/施作中 狀態一目了然`,
        comments: []
      },
      // ===== 示意圖：諮詢師作業 =====
      {
        id: "flow5-mock",
        category: "示意圖",
        title: "諮詢師紀錄畫面",
        status: "confirmed",
        col: 7, row: 2,
        next: [],
        mockup: "flow5-mockup",
        content: `諮詢師填寫評估紀錄、推薦療程
自動帶入客戶過敏史
確認後直接建凱惠消費單`,
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
        { text: "客戶代碼對照表（地點 → V 編號）—— 247 筆已匯入 Firestore", done: true },
        { text: "業務代碼對照表（司機 → A/B 編號）—— 10 位已硬編碼", done: true },
        { text: "會計每天上傳 A1", done: true },
        { text: "司機回報格式全員一致", done: true },
        { text: "A1 電商匯入中心「販賣機」自訂商店的欄位確認", done: false },
        { text: "Excel 放雲端 vs 儀表板勾選匯出 —— 已採用儀表板方案", done: true },
        { text: "一則訊息一台機器，不需拆分", done: true },
        { text: "品號判斷已實作：一般 → RAN00003（混和產品/瓶），含「入金」→ RAN00004（產品入金/個）。電子支付 RAN00005 待後續。", done: true },
        { text: "司機回報群組只有一個，Bot 加入一個群即可", done: true },
        { text: "LINE OA 帳號：使用默默小幫手", done: true },
        { text: "不需 Google Drive，改用儀表板匯出", done: true }
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
        next: ["s-flow4b"],
        mockup: "sean-driver-report",
        content: `AI 從訊息抓出 3 個關鍵欄位：

1. 地點 → 查對照表 → 客戶代碼（V10067）
2.「本次實收 X 罐 Y 元」→ 數量 + 金額
3. 司機名 → 查對照表 → 業務代碼（A06）

固定欄位（不需解析）：
・收款方式：月結/未收款/貨到付款
・發票聯式：不開
・課稅別：無

品號自動判斷（已實作）：
・一般回報 → RAN00003 販賣機混和產品（單位：瓶）
・文字含「入金」→ RAN00004 販賣機產品入金（單位：個）

解析結果寫入 Firestore`,
        comments: []
      },
      {
        id: "s-flow4b",
        category: "流程4",
        title: "儀表板勾選匯出",
        status: "confirmed",
        col: 4, row: 0,
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
5. 選品號（RAN00003 混和產品 或 RAN00004 產品入金）
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
        { role: "開發商", name: "Sam Hsu", org: "學得力" },
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
        title: "聘軒系統 / Excel 匯入",
        status: "discuss",
        col: 0, row: 0,
        next: ["data-parse"],
        content: `資料從哪裡來？

方案 A（最佳）：直接串接聘軒，資料自動同步，不用人工操作
方案 B（備案）：從聘軒匯出 Excel，上傳到新系統

待確認：
- 聘軒是否願意開放串接？費用多少？
- 如果用 Excel，目前匯出的格式長怎樣？
- 多久需要更新一次資料？`,
        comments: []
      },
      {
        id: "data-parse",
        category: "資料處理",
        title: "資料匯入與比對",
        status: "gap",
        col: 1, row: 0,
        next: ["db-store"],
        content: `上傳 Excel 後系統自動處理：

1. 自動讀取欄位，不用手動對應
2. 同一個護照號碼 → 更新，不會重複建檔
3. 格式有錯會提示哪幾筆有問題
4. 每次匯入都有紀錄，可以回查

需要管理的欄位：
姓名、護照號碼、國籍、所屬仲介、聯絡方式
入境日、出境日、體檢到期日、居留證到期日
合約起訖日、保險到期日、目前狀態`,
        comments: []
      },
      {
        id: "db-store",
        category: "資料儲存",
        title: "移工資料庫",
        status: "gap",
        col: 2, row: 0,
        next: [],
        content: `所有移工資料集中管理在雲端資料庫

容量：
- 約 3,000～4,000 位活躍移工
- 保留過往 10,000+ 筆歷史紀錄

安全：
- 存放在 Google 台灣機房
- 傳輸全程加密
- 只有登入的人才能看到資料`,
        comments: []
      },

      // === Row 1: Alert 引擎 ===
      {
        id: "alert-engine",
        category: "核心功能",
        title: "自動警示提醒",
        status: "gap",
        col: 1, row: 1,
        next: ["alert-rules"],
        content: `系統每天自動檢查所有移工，哪些快到期了

5 大提醒項目：
1. 出入境 — 出境前提醒準備文件
2. 體檢 — 逾期會被罰款
3. 居留證 — 到期前要辦展延
4. 合約 — 要決定續約還是離境
5. 保險 — 到期前要續保

一看就懂的燈號：
🔴 紅燈：已逾期 或 7 天內到期（緊急）
🟡 黃燈：30 天內到期（注意）
🟢 綠燈：還早，安全`,
        comments: []
      },
      {
        id: "alert-rules",
        category: "核心功能",
        title: "提前天數設定",
        status: "discuss",
        col: 2, row: 1,
        next: [],
        content: `每個項目可以自己設定「提前幾天」開始提醒

建議值（請確認或調整）：
- 出入境：30 天前
- 體檢：30 天前
- 居留證展延：60 天前（送件需要時間）
- 合約到期：90 天前（要提早決定）
- 保險：30 天前

待確認：
- 以上天數 OK 嗎？
- 需不需要分層提醒？（例如 60天提醒一次、30天再提醒、7天緊急通知）`,
        comments: []
      },

      // === Row 2: 儀表板 UI ===
      {
        id: "dashboard-overview",
        category: "儀表板",
        title: "總覽頁",
        status: "gap",
        col: 0, row: 2,
        next: ["dashboard-category"],
        content: `打開就知道今天要處理什麼

畫面上會看到：
- 紅燈幾個、黃燈幾個、綠燈幾個
- 今天有幾筆需要處理
- 已經逾期的有幾筆（紅色醒目提示）

點數字就能直接看名單`,
        comments: []
      },
      {
        id: "dashboard-category",
        category: "儀表板",
        title: "分類檢視",
        status: "gap",
        col: 1, row: 2,
        next: ["dashboard-list"],
        content: `用 Tab 切換不同項目：

出入境 ｜ 體檢 ｜ 居留證 ｜ 合約 ｜ 保險

每個分類會顯示：
- 該項目紅/黃/綠各幾筆
- 按「剩幾天到期」排序
- 可以只看某位仲介負責的`,
        comments: []
      },
      {
        id: "dashboard-list",
        category: "儀表板",
        title: "名單與搜尋",
        status: "gap",
        col: 2, row: 2,
        next: [],
        content: `每位移工一行：
燈號 ｜ 姓名 ｜ 護照號 ｜ 仲介 ｜ 到期項目 ｜ 剩餘天數

可以做的事：
- 按剩餘天數、仲介、國籍排序
- 篩選：只看紅燈、只看某仲介
- 搜尋：打姓名或護照號碼就能找到
- 電腦看是表格，手機看是卡片`,
        comments: []
      },

      // === Row 3: 系統 ===
      {
        id: "auth",
        category: "系統",
        title: "登入與權限",
        status: "gap",
        col: 0, row: 3,
        next: ["infra"],
        content: `誰可以看什麼：
- 管理員：看全部移工、設定規則、管理帳號
- 仲介：只看自己負責的移工

帳號由管理員建立，用帳號密碼登入

待確認：
- 總共幾位使用者要用？
- 仲介分幾組？各負責幾位移工？
- 需不需要「只能看、不能改」的角色？`,
        comments: []
      },
      {
        id: "infra",
        category: "系統",
        title: "資料安全 & 主機",
        status: "gap",
        col: 1, row: 3,
        next: [],
        content: `資料安全措施：
- 存放在 Google 台灣機房（不出國）
- 傳輸全程加密，外人無法攔截
- 帳號密碼控管，只有授權的人能看
- 雙方簽署保密協議（NDA）

維運：
- 主機月費約 $3,000
- 含系統監控與日常維護`,
        comments: []
      }
    ]
  }
};

// ===== 規格欄位資料 =====
const SPEC_FIELDS = {
  "meili-emr": {
    type: "comparison",
    source: "霈方電子病歷報價單-回簽.pdf vs 白板需求規劃",
    updated: "2026-04-20",
    vendors: ["類神經", "采盟（Sam）"],
    note: "據點：(微整)站前4F ／(體雕)站前11F ／(微整)忠孝7F ／(微整)忠孝健康7F ／(體雕)忠孝國際3F",
    pendingItems: [
      "B3-2：控場指派醫師的時機——報到時就定？還是諮詢確認項目後才派？",
      "C2/C3：凱惠消費單／耗療 API——凱惠表示複雜，需另行討論",
      "忠孝國際 3F 的凱惠館別代碼——4 月新開，API 規格書尚未納入"
    ],
    categories: [
      {
        id: "pre_visit",
        name: "A. 到院前（預約階段）",
        icon: "📅",
        fields: [
          { name: "邀約管理／取代 GSheet（小編）", code: "A1", v1: "—", v2: "✅" },
          { name: "預約／掛號管理（小編）", code: "A2", v1: "✅", v2: "✅" },
          { name: "醫師班表管理（小編/主管）", code: "A3", v1: "✅", v2: "✅" },
          { name: "行銷歸因追蹤（投手）", code: "A4", v1: "—", v2: "✅" },
          { name: "查詢凱惠可預約床位與時段（凱惠 API）", code: "A5", v1: "✅", v2: "✅" },
          { name: "預約建立與更新寫入凱惠（凱惠 API）", code: "A6", v1: "✅", v2: "✅" }
        ]
      },
      {
        id: "new_checkin",
        name: "B1. 新客報到",
        icon: "🆕",
        parent: "B. 到院中（臨床流程）",
        fields: [
          { name: "客人填寫完整基本資料（客人）", code: "B1-1", v1: "✅", v2: "✅" },
          { name: "過敏史／用藥習慣／醫美經驗問卷（客人）", code: "B1-2", v1: "✅", v2: "✅" },
          { name: "QR code 綁定病歷（客人）", code: "B1-3", v1: "✅", v2: "✅" },
          { name: "查詢凱惠判斷新客／舊客（凱惠 API）", code: "B1-4", v1: "✅", v2: "✅" },
          { name: "新客建檔寫入凱惠（凱惠 API）", code: "B1-5", v1: "✅", v2: "✅" }
        ]
      },
      {
        id: "return_checkin",
        name: "B2. 舊客報到",
        icon: "🔄",
        fields: [
          { name: "QR code 報到（客人）", code: "B2-1", v1: "✅", v2: "✅" },
          { name: "確認／更新基本資料（客人）", code: "B2-2", v1: "✅", v2: "✅" },
          { name: "更新客戶資料寫入凱惠（凱惠 API）", code: "B2-3", v1: "✅", v2: "✅" }
        ]
      },
      {
        id: "consultation",
        name: "B3. 諮詢（確認項目 → 消費單 → 簽同意書）",
        icon: "💬",
        fields: [
          { name: "控場指派諮詢師（控場／報到時）", code: "B3-1", v1: "—", v2: "✅" },
          { name: "控場指派醫師（控場／待確認指派時機）", code: "B3-2", v1: "—", v2: "✅", pending: true },
          { name: "諮詢師評估 + 填諮詢紀錄（諮詢師）", code: "B3-3", v1: "—", v2: "✅" },
          { name: "推薦療程計畫（諮詢師）", code: "B3-4", v1: "—", v2: "✅" },
          { name: "術前／術後照片 Before/After（諮詢師/護理師）", code: "B3-5", v1: "✅", v2: "✅" },
          { name: "電子同意書簽署（客人／確認項目後、施作前）", code: "B3-6", v1: "✅", v2: "✅" }
        ]
      },
      {
        id: "treatment",
        name: "B4. 施作",
        icon: "💉",
        fields: [
          { name: "療程施作紀錄——部位、劑量（醫師）", code: "B4-1", v1: "✅", v2: "✅" },
          { name: "醫囑填寫（醫師）", code: "B4-2", v1: "✅", v2: "✅" },
          { name: "電子處方箋（醫師）", code: "B4-3", v1: "✅", v2: "✅" },
          { name: "醫生輸入治療建議與藥物資訊（醫師）", code: "B4-4", v1: "✅", v2: "✅" },
          { name: "產出列印醫囑單並數位存檔（醫師）", code: "B4-5", v1: "✅", v2: "✅" },
          { name: "醫師電子簽章（醫師）", code: "B4-6", v1: "✅", v2: "✅" }
        ]
      },
      {
        id: "upload",
        name: "B5. 紀錄上傳",
        icon: "📤",
        fields: [
          { name: "皮膚檢測 BA 照——欄位上傳（護理師）", code: "B5-1", v1: "✅", v2: "✅" },
          { name: "Inbody 數據紀錄——欄位上傳（護理師）", code: "B5-2", v1: "✅", v2: "✅" },
          { name: "血值紀錄——欄位上傳（護理師）", code: "B5-3", v1: "✅", v2: "✅" },
          { name: "體雕紀錄（醫師/護理師）", code: "B5-4", v1: "—", v2: "✅" }
        ]
      },
      {
        id: "post_visit",
        name: "C. 離院後（追蹤與核銷）",
        icon: "📋",
        fields: [
          { name: "醫師術後追蹤紀錄（醫師）", code: "C1", v1: "✅", v2: "✅" },
          { name: "讀取凱惠消費單與耗療紀錄（凱惠 API 待討論）", code: "C2", v1: "—", v2: "待討論", pending: true },
          { name: "耗療核銷與堂數進度（凱惠 API 待討論）", code: "C3", v1: "—", v2: "待討論", pending: true }
        ]
      },
      {
        id: "compliance",
        name: "D1. 同意書合規",
        icon: "📜",
        parent: "D. 幕後管理",
        fields: [
          { name: "IP 位置記錄（系統）", code: "D1-1", v1: "✅", v2: "✅" },
          { name: "多裝置簽署——手機/平板/電腦（客人）", code: "D1-2", v1: "✅", v2: "✅" },
          { name: "簽名時間戳（系統）", code: "D1-3", v1: "✅", v2: "✅" },
          { name: "衛福部規範保存 7 年（系統）", code: "D1-4", v1: "✅", v2: "✅" }
        ]
      },
      {
        id: "admin",
        name: "D2. 後台與報表",
        icon: "📊",
        fields: [
          { name: "角色權限管理（主管）", code: "D2-1", v1: "✅（4 種）", v2: "✅（6 種）" },
          { name: "跨店病歷即時調閱（醫師/主管）", code: "D2-2", v1: "✅（僅主管）", v2: "✅（醫師也可）" },
          { name: "凱惠 POS 整合（雙向 API 串接）", code: "D2-3", v1: "△ 未指名", v2: "✅ 深度串接" },
          { name: "跨店營收統計報表（總公司主管）", code: "D2-4", v1: "—", v2: "✅" },
          { name: "行銷分析報表（總公司主管）", code: "D2-5", v1: "—", v2: "✅" }
        ]
      },
      {
        id: "ops",
        name: "D3. 維運",
        icon: "🔧",
        fields: [
          { name: "年度維護更新（系統）", code: "D3-1", v1: "✅（$200,000/年）", v2: "✅" },
          { name: "資料備份（系統）", code: "D3-2", v1: "✅", v2: "✅" },
          { name: "資安與隱私管理（系統）", code: "D3-3", v1: "✅", v2: "✅" }
        ]
      }
    ]
  },
  "asia-pacific": {
    source: "聘軒系統報表 xml816 / MGT08",
    file: "報表欄位.xlsx",
    updated: "2026-04-20",
    categories: [
      {
        id: "worker_basic",
        name: "移工基本資料",
        icon: "👤",
        fields: [
          { name: "序號", code: "CC", use: "Yes" },
          { name: "員工編號", code: "LA66", use: "Yes" },
          { name: "英文姓名", code: "LA02", use: "No" },
          { name: "英文姓", code: "LA123", use: "Yes" },
          { name: "OP_NO", code: "LA202", use: "Yes" },
          { name: "英文名", code: "LA124", use: "Yes" },
          { name: "姓名(中)", code: "LA33", use: "No" },
          { name: "出生日期", code: "LA03", use: "Yes" },
          { name: "護照號碼", code: "LA06", use: "Yes" },
          { name: "舊護照號碼", code: "LA209", use: "Yes" },
          { name: "護照期限", code: "LA11", use: "Yes" },
          { name: "護照期限(年)", code: "LA11Y", use: "Yes" },
          { name: "護照期限(月)", code: "LA11M", use: "Yes" },
          { name: "護照期限(日)", code: "LA11D", use: "Yes" },
          { name: "國籍", code: "LA04", use: "No" },
          { name: "性別", code: "LA05", use: "No" },
          { name: "移工年齡", code: "LA03G_YY", use: "Yes" },
          { name: "體重", code: "LA105", use: "Yes" },
          { name: "身高", code: "LA104", use: "Yes" },
          { name: "血型", code: "LA201", use: "Yes" },
          { name: "外勞序號", code: "LA00", use: "No" },
          { name: "宗教", code: "LA199", use: "Yes" },
          { name: "教育程度", code: "LA200", use: "Yes" },
          { name: "外勞出生地點", code: "LA111", use: "Yes" },
          { name: "外勞電話(台)", code: "LA87", use: "Yes" },
          { name: "外勞電話(外)", code: "LA40", use: "Yes" },
          { name: "外勞Email", code: "LA191", use: "Yes" },
          { name: "國外地址", code: "LA39", use: "Yes" },
          { name: "國外連絡人", code: "LA41", use: "Yes" },
          { name: "外勞編號", code: "LA125", use: "Yes" },
          { name: "外勞狀態", code: "MMO", use: "Yes" },
          { name: "母國身分證", code: "LA154", use: "Yes" },
          { name: "外勞稅籍編號", code: "LA187", use: "Yes" },
          { name: "移工手機載具條碼", code: "LA189", use: "No" },
          { name: "移工類別", code: "LA198", use: "No" }
        ]
      },
      {
        id: "employer",
        name: "雇主/客戶資料",
        icon: "🏢",
        fields: [
          { name: "客戶中文名稱", code: "CU01", use: "No" },
          { name: "客戶簡稱", code: "CU44", use: "Yes" },
          { name: "客戶英文名稱", code: "CU01_E", use: "Yes" },
          { name: "雇主編號", code: "CU00", use: "Yes" },
          { name: "公司統編", code: "CU04", use: "Yes" },
          { name: "公司地址", code: "CU05", use: "Yes" },
          { name: "公司電話", code: "CU06", use: "Yes" },
          { name: "公司傳真", code: "CU07", use: "Yes" },
          { name: "負責人姓名", code: "CU02", use: "Yes" },
          { name: "負責人英文姓名", code: "CU02_E", use: "Yes" },
          { name: "負責人身份證字號", code: "CU13", use: "Yes" },
          { name: "負責人出生日期", code: "CU12", use: "Yes" },
          { name: "負責人戶籍地", code: "CU78", use: "Yes" },
          { name: "聯絡人姓名", code: "CU24", use: "Yes" },
          { name: "聯絡人電話", code: "CU25", use: "Yes" },
          { name: "聯絡人行動", code: "CU34", use: "Yes" },
          { name: "受顧者姓名", code: "LBM02", use: "Yes" },
          { name: "受顧者身分證字號", code: "LBM03", use: "Yes" },
          { name: "受顧者出生日期", code: "LBM04", use: "Yes" },
          { name: "受顧者往生日", code: "LBM26", use: "Yes" },
          { name: "居住地址", code: "LA64", use: "Yes" },
          { name: "居住地址(英)", code: "LA64_E", use: "Yes" },
          { name: "居住地電話", code: "LA88", use: "Yes" },
          { name: "工作地址", code: "CU05_W", use: "Yes" },
          { name: "英文工作地址", code: "CU05_EW", use: "Yes" },
          { name: "工作地聯絡人", code: "CU24", use: "Yes" },
          { name: "工作地電話", code: "CU25", use: "Yes" },
          { name: "帳單地址", code: "CU87", use: "Yes" },
          { name: "廠別", code: "CU054", use: "Yes" },
          { name: "就安費地址", code: "CU053_1", use: "Yes" },
          { name: "郵遞區號", code: "CU09_W", use: "Yes" },
          { name: "稅籍編號", code: "CU95", use: "Yes" },
          { name: "行業別", code: "CU28", use: "Yes" },
          { name: "雇主Email", code: "CU82", use: "Yes" },
          { name: "雇主手機載具條碼", code: "CU142", use: "No" }
        ]
      },
      {
        id: "permit",
        name: "聘僱許可與函件",
        icon: "📜",
        fields: [
          { name: "公告專案別", code: "LBE24", use: "Yes" },
          { name: "承接日期", code: "LA21L", use: "Yes" },
          { name: "年資", code: "LA03H", use: "Yes" },
          { name: "聘僱起始日", code: "LA21", use: "Yes" },
          { name: "聘僱期滿日", code: "LA22", use: "Yes" },
          { name: "聘僱期滿日(年)", code: "LA22_3Y", use: "Yes" },
          { name: "聘僱期滿日(月)", code: "LA22_3M", use: "Yes" },
          { name: "聘僱期滿日(日)", code: "LA22_3D", use: "Yes" },
          { name: "招募別", code: "LBE10A", use: "Yes" },
          { name: "核准函發文日", code: "LBE03", use: "Yes" },
          { name: "核准函號", code: "LBE05", use: "Yes" },
          { name: "核准函人數", code: "LBE08", use: "Yes" },
          { name: "核准函地址", code: "CU05_W", use: "Yes" },
          { name: "核准函聯絡人", code: "CU24", use: "Yes" },
          { name: "核准函聯絡電話", code: "CU25", use: "Yes" },
          { name: "簽證函發文日", code: "LBO03", use: "Yes" },
          { name: "簽證函號", code: "LBO05", use: "Yes" },
          { name: "簽證函人數", code: "LBO09", use: "Yes" },
          { name: "前任外勞", code: "LAV03", use: "Yes" },
          { name: "(專案)廠別", code: "LA324", use: "Yes" },
          { name: "遞補函發文日", code: "LBI03", use: "Yes" },
          { name: "遞補函號", code: "LBI05", use: "Yes" },
          { name: "(專案)廠區", code: "LA323", use: "Yes" },
          { name: "遞補函人數", code: "LBI13", use: "Yes" },
          { name: "剩餘工期", code: "LBI10_12", use: "Yes" },
          { name: "可否展延", code: "LBI18", use: "Yes" },
          { name: "遞補前外勞", code: "LBI08", use: "Yes" },
          { name: "引進函種", code: "LBE", use: "Yes" },
          { name: "引進函地址", code: "CU05_W", use: "Yes" },
          { name: "可否循環", code: "LBE20", use: "Yes" },
          { name: "初聘送件日", code: "LBF03S", use: "Yes" },
          { name: "初聘發文日", code: "LBF03", use: "Yes" },
          { name: "聘可收文日", code: "LA132", use: "Yes" },
          { name: "初次聘僱許可函號", code: "LBF05", use: "Yes" },
          { name: "補行否", code: "LAJ10", use: "Yes" },
          { name: "初次聘僱起日", code: "LA21", use: "Yes" },
          { name: "初次聘僱迄日", code: "LA22_2", use: "Yes" },
          { name: "展聘發文日", code: "LBG03", use: "Yes" },
          { name: "展延聘僱許可函號", code: "LBG05", use: "Yes" },
          { name: "展延聘僱起日", code: "LA22_2A", use: "Yes" },
          { name: "展延聘僱迄日", code: "LA22_3A", use: "Yes" },
          { name: "備查函發文日", code: "LA57A2", use: "Yes" },
          { name: "備查函號", code: "LA57A", use: "Yes" },
          { name: "轉出函號", code: "LA57", use: "Yes" },
          { name: "衍生遞補函發文日", code: "LBI03L", use: "Yes" },
          { name: "廢聘函號", code: "LA144", use: "Yes" },
          { name: "衍生遞補函號", code: "LBI05L", use: "Yes" },
          { name: "衍生簽證函發文日", code: "LBO03L", use: "Yes" },
          { name: "衍生簽證函號", code: "LBO05L", use: "Yes" },
          { name: "工期", code: "LA22YMD", use: "Yes" },
          { name: "已工作天數", code: "LA22_A", use: "Yes" },
          { name: "剩餘天數", code: "LA22_B", use: "Yes" },
          { name: "回鍋", code: "LA10", use: "Yes" },
          { name: "工種", code: "LBJ02", use: "No" },
          { name: "任用來源", code: "LA155", use: "No" },
          { name: "轉入委任日", code: "LA86", use: "Yes" },
          { name: "續聘轉換認證日", code: "LA180", use: "Yes" },
          { name: "廢聘日期", code: "LA137", use: "Yes" },
          { name: "承接再提高5%", code: "LBE71", use: "No" }
        ]
      },
      {
        id: "residence",
        name: "居留證與出入境",
        icon: "✈️",
        fields: [
          { name: "入境日", code: "LA08", use: "No" },
          { name: "入境講習序號", code: "LA205", use: "Yes" },
          { name: "交工日", code: "LA70", use: "Yes" },
          { name: "最近入境日", code: "LA156", use: "Yes" },
          { name: "入境日(年)", code: "LA08Y", use: "Yes" },
          { name: "入境日(月)", code: "LA08M", use: "Yes" },
          { name: "入境日(日)", code: "LA08D", use: "Yes" },
          { name: "接管代碼", code: "LA20", use: "No" },
          { name: "離管代碼", code: "LA30", use: "Yes" },
          { name: "二年到期日(年)", code: "LA22_2Y", use: "Yes" },
          { name: "二年到期日(月)", code: "LA22_2M", use: "Yes" },
          { name: "二年到期日(日)", code: "LA22_2D", use: "Yes" },
          { name: "居留證號", code: "LA12", use: "Yes" },
          { name: "居留證可多次重出入", code: "LA212", use: "Yes" },
          { name: "居留期限", code: "LA13", use: "Yes" },
          { name: "居留期限(年)", code: "LA13Y", use: "Yes" },
          { name: "居留期限(月)", code: "LA13M", use: "Yes" },
          { name: "居留期限(日)", code: "LA13D", use: "Yes" },
          { name: "居留證地", code: "LA64_1", use: "Yes" },
          { name: "舊居證號", code: "LA190", use: "Yes" },
          { name: "出境日期", code: "LA31", use: "Yes" },
          { name: "出境日期(年)", code: "LA31Y", use: "Yes" },
          { name: "出境日期(月)", code: "LA31M", use: "Yes" },
          { name: "出境日期(日)", code: "LA31D", use: "Yes" },
          { name: "出境原因", code: "LA28", use: "No" },
          { name: "轉出日期", code: "LA31_4", use: "Yes" },
          { name: "轉出日期(年)", code: "LA31_4Y", use: "Yes" },
          { name: "轉出日期(月)", code: "LA31_4M", use: "Yes" },
          { name: "轉出日期(日)", code: "LA31_4D", use: "Yes" },
          { name: "逃跑日期", code: "LA31_3", use: "Yes" },
          { name: "逃跑日期(年)", code: "LA31_3Y", use: "Yes" },
          { name: "逃跑日期(月)", code: "LA31_3M", use: "Yes" },
          { name: "逃跑日期(日)", code: "LA31_3D", use: "Yes" },
          { name: "逃跑報案日期", code: "LAJ11_3", use: "Yes" },
          { name: "逃跑報備函發文日", code: "LAJ03_3", use: "Yes" },
          { name: "逃跑報備函號", code: "LAJ05_3", use: "Yes" },
          { name: "入境通報勞工局", code: "LBD04_0002", use: "Yes" },
          { name: "按指紋", code: "LBD04_0003", use: "Yes" },
          { name: "預定離境日", code: "LA110", use: "Yes" },
          { name: "解約日期", code: "LA31_C", use: "Yes" },
          { name: "抵台航班", code: "LA47", use: "Yes" },
          { name: "接送地址", code: "LA27", use: "Yes" },
          { name: "首次抵台日", code: "LA101", use: "Yes" },
          { name: "來台年限", code: "LA181", use: "No" }
        ]
      },
      {
        id: "health",
        name: "體檢紀錄",
        icon: "🏥",
        fields: [
          { name: "初入境體檢日", code: "LBH09_1", use: "Yes" },
          { name: "報告日(初)", code: "LBH10_1", use: "Yes" },
          { name: "體檢醫院(初)", code: "LBH08_1", use: "Yes" },
          { name: "是否合格(初)", code: "LBH11_1", use: "Yes" },
          { name: "不合格原因(初)", code: "LBH15_1", use: "Yes" },
          { name: "複檢日(初)", code: "LBH16_1", use: "Yes" },
          { name: "複檢是否合格(初)", code: "LBH17_1", use: "Yes" },
          { name: "管理中心", code: "LBH18_1", use: "Yes" },
          { name: "常用醫院", code: "LA24", use: "Yes" },
          { name: "最近體檢日", code: "LA25", use: "Yes" },
          { name: "6個月體檢日", code: "LBH09_6", use: "Yes" },
          { name: "報告日(6月)", code: "LBH10_6", use: "Yes" },
          { name: "衛生局發文日(6月)", code: "LBH03_6", use: "Yes" },
          { name: "衛生局函號(6月)", code: "LBH05_6", use: "Yes" },
          { name: "體檢醫院(6月)", code: "LBH08_6", use: "Yes" },
          { name: "是否合格(6月)", code: "LBH11_6", use: "Yes" },
          { name: "不合格原因(6月)", code: "LBH15_6", use: "Yes" },
          { name: "複檢日(6月)", code: "LBH16_6", use: "Yes" },
          { name: "複檢是否合格(6月)", code: "LBH17_6", use: "Yes" },
          { name: "18個月體檢日", code: "LBH09_18", use: "Yes" },
          { name: "報告日(18月)", code: "LBH10_18", use: "Yes" },
          { name: "衛生局發文日(18月)", code: "LBH03_18", use: "Yes" },
          { name: "衛生局函號(18月)", code: "LBH05_18", use: "Yes" },
          { name: "體檢醫院(18月)", code: "LBH08_18", use: "Yes" },
          { name: "是否合格(18月)", code: "LBH11_18", use: "Yes" },
          { name: "不合格原因(18月)", code: "LBH15_18", use: "Yes" },
          { name: "複檢日(18月)", code: "LBH16_18", use: "Yes" },
          { name: "複檢是否合格(18月)", code: "LBH17_18", use: "Yes" },
          { name: "30個月體檢日", code: "LBH09_30", use: "Yes" },
          { name: "報告日(30月)", code: "LBH10_30", use: "Yes" },
          { name: "衛生局發文日(30月)", code: "LBH03_30", use: "Yes" },
          { name: "衛生局函號(30月)", code: "LBH05_30", use: "Yes" },
          { name: "體檢醫院(30月)", code: "LBH08_30", use: "Yes" },
          { name: "是否合格(30月)", code: "LBH11_30", use: "Yes" },
          { name: "不合格原因(30月)", code: "LBH15_30", use: "Yes" },
          { name: "複檢日(30月)", code: "LBH16_30", use: "Yes" },
          { name: "複檢是否合格(30月)", code: "LBH17_30", use: "Yes" }
        ]
      },
      {
        id: "agency",
        name: "仲介與業務",
        icon: "🤝",
        fields: [
          { name: "仲介代號", code: "CO01", use: "Yes" },
          { name: "國外仲介", code: "LA37", use: "Yes" },
          { name: "國外仲介(簡稱)", code: "LBN04", use: "Yes" },
          { name: "國內仲介", code: "CO02", use: "Yes" },
          { name: "開發業務1", code: "CU27A", use: "Yes" },
          { name: "開發業務2", code: "CU27B", use: "Yes" },
          { name: "行政", code: "CU62", use: "No" },
          { name: "業務員", code: "CU27", use: "No" },
          { name: "移工業務員", code: "LA170", use: "Yes" },
          { name: "客服員", code: "CU102", use: "Yes" },
          { name: "雙語人員", code: "LA58", use: "Yes" },
          { name: "開發業務1分群", code: "LBR20A", use: "No" },
          { name: "開發業務2分群", code: "LBR20B", use: "No" },
          { name: "業務員分群", code: "LBR20", use: "No" },
          { name: "移工業務員分群", code: "LA170A", use: "No" }
        ]
      },
      {
        id: "insurance",
        name: "保險與財務",
        icon: "💰",
        fields: [
          { name: "銀行代號", code: "LA53", use: "Yes" },
          { name: "貸款銀行", code: "LA65", use: "Yes" },
          { name: "健保卡號", code: "LA203", use: "Yes" },
          { name: "帳轉帳扣帳號", code: "LA54", use: "Yes" },
          { name: "虛擬帳號", code: "LA192", use: "Yes" },
          { name: "代辦意外險", code: "CU99", use: "Yes" },
          { name: "意外險加保日", code: "LA129", use: "Yes" },
          { name: "意外險退保日", code: "LA130", use: "Yes" },
          { name: "意外險到期日", code: "LA85", use: "Yes" },
          { name: "國外保險加保日", code: "LA178", use: "Yes" },
          { name: "國外保險到期日", code: "LA179", use: "Yes" },
          { name: "代領退稅人", code: "TAX23", use: "Yes" },
          { name: "代辦勞保加保", code: "CU101", use: "No" },
          { name: "代辦勞保退保", code: "CU147", use: "No" },
          { name: "代辦健保加保", code: "CU101A", use: "No" },
          { name: "代辦健保退保", code: "CU147A", use: "No" }
        ]
      },
      {
        id: "other",
        name: "其他",
        icon: "📋",
        fields: [
          { name: "工作部門", code: "LA126", use: "Yes" },
          { name: "工作組別", code: "LA127", use: "Yes" },
          { name: "工作班別", code: "LA67", use: "Yes" },
          { name: "備註(移工)", code: "LA56", use: "Yes" },
          { name: "備註(客戶)", code: "CU43", use: "Yes" },
          { name: "代辦勞保加保", code: "CU101", use: "No" },
          { name: "代辦勞保退保", code: "CU147", use: "No" },
          { name: "代辦健保退保", code: "CU147A", use: "No" },
          { name: "代辦健保加保", code: "CU101A", use: "No" },
          { name: "移工宿舍", code: "LA92", use: "No" }
        ]
      }
    ]
  }
};
