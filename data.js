// ===== 專案資料 =====
// 每個專案一份，切換專案就換資料

const PROJECTS = {
  "meili-emr": {
    name: "美力 電子病歷 系統架構",
    cards: [
      {
        id: "overview",
        category: "總覽",
        title: "系統架構",
        status: "confirmed",
        col: 0, row: 0,
        next: ["datasources"],
        content: `專案目標：紙本病歷全面電子化
外包廠商：采盟（Sam）
部署環境：美力自有 GCP
主要串接：凱惠 POS
資料入口：類神經 SalesChat
背景系統：鼎新 ERP
據點：站前4F / 站前11F / 忠孝7F(7FA) / 忠孝健康7F(7FB)`,
        comments: []
      },
      {
        id: "datasources",
        category: "總覽",
        title: "資料來源層",
        status: "confirmed",
        col: 1, row: 0,
        next: ["flow1"],
        content: `鼎新：ERP、POS、HRM人事、HRM排班、BPM電子表單、IMG、IMG行動考勤、BI系統
凱惠：POS系統（主要串接對象）
鋒形：HRM人事系統
類神經：CRM系統、Sales Chat（客人邀約入口）
行銷渠道：LINE OA、Facebook、Instagram、Google Ads
底層：ETL 整合（母公司中台架構）`,
        comments: []
      },
      {
        id: "flow1",
        category: "流程1",
        title: "邀約（小編接客）",
        status: "confirmed",
        col: 2, row: 0,
        next: ["flow2"],
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
        col: 3, row: 0,
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
        col: 4, row: 0,
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
        col: 5, row: -0.5,
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
        col: 5, row: 0.5,
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
        col: 6, row: 0,
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
        col: 7, row: 0,
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
        col: 8, row: -0.5,
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
        col: 8, row: 0.5,
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
        col: 9, row: 0,
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
        col: 10, row: 0,
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
        col: 11, row: 0,
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
        col: 12, row: 0,
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
        col: 13, row: 0,
        next: [],
        content: `對應紙本「追蹤記錄單」
術後追蹤紀錄電子化
追蹤時間點、客戶反饋、恢復狀況
與客人微型頁面串接（客人可查看術後注意事項）`,
        comments: []
      },
      {
        id: "customer-page",
        category: "功能",
        title: "客人微型頁面（LINE OA）",
        status: "confirmed",
        col: 13, row: 1.2,
        next: [],
        content: `客人綁 LINE OA 後可自助查詢：
- 剩餘療程堂數
- 下次預約時間
- 術後注意事項
- 個人基本資料修改

減少客人打電話問堂數的客服負擔
來源：霈方原規格「查看剩餘課程及堂數」功能`,
        comments: []
      },
      {
        id: "report",
        category: "功能",
        title: "總公司跨店報表",
        status: "confirmed",
        col: 13, row: 2.4,
        next: [],
        content: `最高管理者（總公司）可瀏覽所有店點數據
- 各店到店率、預約量、no-show率
- 療程分布、營收統計（僅主管層級）
- 行銷歸因分析（哪個渠道/素材帶來最多客人）
- 醫師治療分配（次數，不含金額）
- 加盟店資料隔離：各店只看自己的數據`,
        comments: []
      },
      {
        id: "api-existing",
        category: "技術",
        title: "凱惠 API 現有 ✅",
        status: "confirmed",
        col: 0, row: 2.4,
        next: [],
        content: `API #1 Read_客戶資料：手機號碼查新舊客
API #2 Create_客戶資料：快速建檔新客（姓名+手機+館別）
API #3 Update_客戶資料：更新完整客戶資料（47欄位）
API #4 Read_客戶預約資料：查詢可預約床位/時段
API #5 Create_客戶預約資料：建立預約
API #6 Update_客戶預約資料：更新狀態 CANCEL/CHECKIN/FINISHED
館別代碼：4F / 11F / 7FA / 7FB`,
        comments: []
      },
      {
        id: "api-gap",
        category: "技術",
        title: "凱惠 API 缺口 ❌",
        status: "gap",
        col: 2, row: 2.4,
        next: [],
        content: `❌ Read_消費單：拉取客戶消費紀錄
❌ Read_耗療項目：拉取未核銷療程清單
❌ Update_耗療核銷：電子病歷 核銷後回寫凱惠
❌ Read_療程堂數：查詢客戶剩餘堂數
❌ Read_排班/床位即時狀態：未來電子病歷顯示排程（非必要）
❓ 簡訊模板自訂：確認能否塞短網址進簡訊內容

以上需與凱惠協商新增`,
        comments: []
      },
      {
        id: "discuss-items",
        category: "待討論",
        title: "📌 待討論事項總覽",
        status: "discuss",
        col: 4, row: 2.4,
        next: [],
        content: `1. 控場→醫師/諮詢師的通知方式（系統內推播？LINE？口頭？）
2. 推車/設備管理（音波儀、電波儀等設備追蹤是否納入？放在哪個流程環節？）
3. 凱惠簡訊模板是否可自訂
4. 電子簽署廠商選定
5. 檢測儀器串接方式（Inbody/皮膚檢測/血值，聽說有API可串，待確認）
6. 處方箋是否納入（醫美多為非侵入，待確認是否有開處方需求）
7. 角色權限細節（待系統完成一定程度後討論）
8. 針劑醫師排班功能需求確認
9. VIP照片分級權限的具體規則`,
        comments: []
      },
      {
        id: "phases",
        category: "規劃",
        title: "分期建議",
        status: "confirmed",
        col: 6, row: 2.4,
        next: [],
        content: `Phase 1：報到+基本資料
- QR掃碼報到、LINE OA綁定、新客填資料、舊客確認、到店dashboard

Phase 2：邀約取代GSheet
- 電子病歷邀約畫面（含行銷歸因欄位）、打API建凱惠預約、GSheet退場

Phase 3：諮詢+療程紀錄
- 初診評估勾選、諮詢紀錄、BA照上傳綁定客戶

Phase 4：耗療核銷
- 從凱惠拉消費單/耗療、護理師在電子病歷核銷、回寫凱惠
- 前提：凱惠新API到位

Phase 5：電子同意書+衛教書
- 串接簽署廠商、同意書模板管理、簽署流程
- 前提：電子簽署廠商選定

Phase 6：醫囑+進階
- 醫師施作紀錄、術後追蹤、檢測儀器串接、Meta歸因自動化、推車管理`,
        comments: []
      }
    ]
  }
};
