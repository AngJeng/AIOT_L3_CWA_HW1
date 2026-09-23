# 台灣氣象儀表板 (Taiwan Weather Dashboard)

整合「中央氣象署 Open Data API」、「Python 資料處理與 SQLite」、「Next.js 14 前後端」並可直接部署於 Vercel 的現代化台灣即時天氣觀測與預報儀表板。

---

## 🌟 核心特色與技術規格

1. **純 Next.js 全端架構**：完全不依賴 Streamlit 或 Docker，採用 Next.js 14 (App Router) + React + Tailwind CSS。
2. **中央氣象署 CWA API 整合**：
   - 觀測資料集：`O-A0003-001` (氣象觀測站-10分鐘綜觀氣象資料)
   - 包含測站即時氣溫 (AirTemperature)、當日最高溫 (DailyHigh)、當日最低溫 (DailyLow)、相對濕度與天氣狀況。
3. **台灣六大區域劃分**：統計並自動歸類北部、中部、南部、東北部、東部、東南部及離島地區之測站氣象數值。
4. **SQLite 本地資料庫**：Python ETL 自動將解析後的觀測數據存入 `public/data.db` (`TemperatureForecasts` 資料表)。
5. **直觀視覺化與互動功能**：
   - **區域 / 縣市下拉選單 (`RegionSelect`)**：動態聯動切換各地區與縣市。
   - **趨勢折線圖 (`WeatherChart`)**：使用 Recharts 繪製即時氣溫、今日最高溫與最低溫之對比折線圖。
   - **數據呈現表格 (`WeatherTable`)**：支援即時關鍵字搜尋、分頁切換與溫度區間徽章標示。
   - **互動式地圖 (`TaiwanMap`)**：使用 React-Leaflet 標繪各測站地理位置，並根據溫度自動變色：
     * `< 20°C`：藍色 (`#3B82F6`)
     * `20 ~ 25°C`：綠色 (`#22C55E`)
     * `25 ~ 30°C`：黃色 (`#EAB308`)
     * `> 30°C`：紅色 (`#EF4444`)

---

## 📁 專案目錄結構

```text
AIOT_L3_CWA_HW1/
├── scripts/                    # Python ETL 資料管線
│   ├── fetch_weather.py        # 串接 CWA API (O-A0003-001) 下載 raw JSON
│   ├── parse_weather.py        # 縣市區域映射、氣候數值與座標解析
│   ├── database.py             # SQLite 資料表建立與批量寫入
│   └── run_pipeline.py         # 端到端自動化 ETL 腳本
├── src/
│   ├── app/
│   │   ├── api/weather/route.ts# Next.js API Route (查詢 SQLite 返回 JSON)
│   │   ├── layout.tsx          # 全站共用導覽列與頁首頁尾
│   │   ├── page.tsx            # 儀表板首頁 (整合地圖、圖表、統計卡片與表格)
│   │   ├── forecast/page.tsx   # 區域趨勢預報頁面
│   │   ├── stations/page.tsx   # 全台測站地圖導覽頁面
│   │   ├── about/page.tsx      # 系統說明與規格頁面
│   │   └── globals.css         # Tailwind & Leaflet 樣式
│   ├── components/
│   │   ├── RegionSelect.tsx    # 區域與縣市聯動下拉選單
│   │   ├── WeatherChart.tsx    # Recharts 氣溫趨勢折線圖
│   │   ├── WeatherTable.tsx    # 卡片式測站數據表格
│   │   └── TaiwanMap.tsx       # React-Leaflet 互動地圖
│   └── lib/
│       └── db.ts               # better-sqlite3 查詢資料庫模組
├── public/
│   └── data.db                 # SQLite 氣候觀測資料庫
├── .env.example                # 環境變數範例
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vercel.json                 # Vercel 部署設定
└── README.md
```

---

## 🚀 本地開發與執行步驟

### 1. 安裝環境與套件

```bash
# 安裝 Node.js 依賴套件
npm install

# 安裝 Python 必要套件
pip install -r requirements.txt
```

### 2. 設定環境變數

建立 `.env` 檔案並填入中央氣象署 API 金鑰：
```env
CWA_API_KEY=CWA-55FDA6D3-A43C-4AE0-BB30-E62D5F684FB2
```

### 3. 執行 Python ETL 擷取氣象資料

```bash
python3 -m scripts.run_pipeline
# 或使用 npm script:
npm run etl
```
> 執行後將於 `public/data.db` 建立 `TemperatureForecasts` 資料表並填入全台最新 300+ 個測站之即時觀測數據。

### 4. 啟動 Next.js 開發伺服器

```bash
npm run dev
```
開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000) 即可瀏覽台灣氣象儀表板。

---

## 🚢 Vercel 部署指南

1. **建立 GitHub Repository 並推送程式碼**：
   ```bash
   git init
   git add .
   git commit -m "feat: complete Taiwan Weather Dashboard with Next.js and SQLite"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/taiwan-weather-dashboard.git
   git push -u origin main
   ```

2. **登入 Vercel 平台**：
   - 點擊 **Add New Project** -> **Import Git Repository**。
   - 選取剛才推送的專案。

3. **設定環境變數 (Environment Variables)**：
   - 在專案設定中新增：
     * Key: `CWA_API_KEY`
     * Value: `CWA-55FDA6D3-A43C-4AE0-BB30-E62D5F684FB2`

4. **點擊 Deploy**：
   - Vercel 將根據 `vercel.json` 執行 `python3 -m scripts.run_pipeline && next build`，自動抓取最新氣象資料並完成構建。
