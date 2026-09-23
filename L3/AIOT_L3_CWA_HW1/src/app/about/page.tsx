import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <h1 className="text-3xl font-extrabold text-gray-900">
          關於 Taiwan Weather Dashboard
        </h1>
        <p className="text-gray-600 leading-relaxed">
          本專案為全端台灣氣候即時監測儀表板，整合中央氣象署 (CWA) 開放資料平台、Python 資料擷取與 SQLite 資料庫，並以前端 Next.js App Router 進行高響應式與現代化視覺化呈現。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-1">📡 資料來源</h3>
            <p className="text-sm text-blue-800">
              中央氣象署 Open Data API (代號：<code className="bg-blue-100 px-1 rounded">O-A0003-001</code> 氣象觀測站-10分鐘綜觀氣象資料)。
            </p>
          </div>
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-1">⚡ 後端架構</h3>
            <p className="text-sm text-emerald-800">
              Next.js 14 App Router API Routes + SQLite (<code className="bg-emerald-100 px-1 rounded">public/data.db</code>)，配合 Python ETL 自動化管線。
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">🎨 氣溫色彩定義規範</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-800 font-medium">
              &lt; 20°C (藍色 #3B82F6)
            </div>
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-800 font-medium">
              20 ~ 25°C (綠色 #22C55E)
            </div>
            <div className="p-3 rounded-lg bg-amber-100 text-amber-800 font-medium">
              25 ~ 30°C (黃色 #EAB308)
            </div>
            <div className="p-3 rounded-lg bg-red-100 text-red-800 font-medium">
              &gt; 30°C (紅色 #EF4444)
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">🛠️ 台灣六大區域劃分</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li><strong>北部地區</strong>：基隆市、臺北市、新北市、桃園市、新竹市、新竹縣、苗栗縣</li>
            <li><strong>中部地區</strong>：臺中市、彰化縣、南投縣、雲林縣、嘉義市、嘉義縣</li>
            <li><strong>南部地區</strong>：臺南市、高雄市、屏東縣</li>
            <li><strong>東北部地區</strong>：宜蘭縣</li>
            <li><strong>東部地區</strong>：花蓮縣</li>
            <li><strong>東南部地區</strong>：臺東縣</li>
            <li><strong>離島地區</strong>：澎湖縣、金門縣、連江縣</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
