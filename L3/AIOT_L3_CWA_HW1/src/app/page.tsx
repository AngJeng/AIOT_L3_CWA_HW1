"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import RegionSelect from "@/components/RegionSelect";
import WeatherChart from "@/components/WeatherChart";
import WeatherTable, { getTempBadge } from "@/components/WeatherTable";
import { StationRecord, RegionSummary } from "@/lib/db";

// Dynamically import TaiwanMap with SSR disabled to prevent Leaflet window reference errors
const TaiwanMap = dynamic(() => import("@/components/TaiwanMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
      載入地圖元件中...
    </div>
  ),
});

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("全部地區");
  const [selectedCounty, setSelectedCounty] = useState("全部縣市");
  const [regions, setRegions] = useState<string[]>(["全部地區"]);
  const [counties, setCounties] = useState<string[]>(["全部縣市"]);
  const [stations, setStations] = useState<StationRecord[]>([]);
  const [summaries, setSummaries] = useState<RegionSummary[]>([]);

  // Fetch data from /api/weather
  const fetchData = async (region?: string, county?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (region && region !== "全部地區") params.set("region", region);
      if (county && county !== "全部縣市") params.set("county", county);

      const res = await fetch(`/api/weather?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setStations(data.stations || []);
        if (data.regions) setRegions(data.regions);
        if (data.counties) setCounties(data.counties);
        if (data.summaries) setSummaries(data.summaries);
      }
    } catch (err) {
      console.error("Failed to load weather data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedRegion, selectedCounty);
  }, [selectedRegion, selectedCounty]);

  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    setSelectedCounty("全部縣市"); // reset county on region change
  };

  // Compute key metrics
  const totalStations = stations.length;
  const avgTemp =
    totalStations > 0
      ? (stations.reduce((acc, s) => acc + s.temperature, 0) / totalStations).toFixed(1)
      : "--";
  const highestStation = stations.reduce(
    (max, s) => (!max || s.temperature > max.temperature ? s : max),
    null as StationRecord | null
  );
  const lowestStation = stations.reduce(
    (min, s) => (!min || s.temperature < min.temperature ? s : min),
    null as StationRecord | null
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm mb-3">
              <span>🌤️ 中央氣象署 (CWA) Open Data API</span>
              <span>•</span>
              <span>O-A0003-001 綜觀氣象資料</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              台灣即時氣候觀測儀表板
            </h1>
            <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-2xl">
              整合全台觀測站 10 分鐘即時觀測數據，提供六大區域氣溫分佈、趨勢圖表與互動式地理點位監測。
            </p>
          </div>
          {stations[0] && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-right border border-white/20">
              <span className="text-xs text-blue-200">最新觀測時間</span>
              <p className="text-lg font-bold">{stations[0].obsTime}</p>
            </div>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-medium text-gray-500 uppercase">監測測站總數</span>
          <div className="text-3xl font-extrabold text-gray-900 mt-2">
            {totalStations} <span className="text-sm font-normal text-gray-500">個</span>
          </div>
          <span className="text-xs text-blue-600 mt-1 inline-block">涵蓋全台各主要觀測點</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-medium text-gray-500 uppercase">目前平均氣溫</span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">
            {avgTemp} <span className="text-sm font-normal text-gray-500">°C</span>
          </div>
          <span className="text-xs text-gray-500 mt-1 inline-block">
            {selectedRegion === "全部地區" ? "全台測站平均" : `${selectedRegion} 平均`}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-medium text-gray-500 uppercase">最高氣溫測站</span>
          <div className="text-3xl font-extrabold text-red-500 mt-2">
            {highestStation ? `${highestStation.temperature}°C` : "--"}
          </div>
          <span className="text-xs text-gray-600 mt-1 inline-block truncate max-w-full">
            {highestStation ? `${highestStation.stationName} (${highestStation.countyName})` : "--"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-medium text-gray-500 uppercase">最低氣溫測站</span>
          <div className="text-3xl font-extrabold text-cyan-600 mt-2">
            {lowestStation ? `${lowestStation.temperature}°C` : "--"}
          </div>
          <span className="text-xs text-gray-600 mt-1 inline-block truncate max-w-full">
            {lowestStation ? `${lowestStation.stationName} (${lowestStation.countyName})` : "--"}
          </span>
        </div>
      </div>

      {/* Six Regions Quick Cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">📍 台灣六大區域氣象概況</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {summaries.map((s) => {
            const isSelected = selectedRegion === s.regionName;
            return (
              <button
                key={s.regionName}
                onClick={() => handleRegionChange(isSelected ? "全部地區" : s.regionName)}
                className={`p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? "bg-blue-50 border-blue-500 shadow-sm ring-2 ring-blue-400"
                    : "bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <div className="text-xs font-semibold text-gray-600">{s.regionName}</div>
                <div className="text-xl font-bold text-gray-900 mt-1">{s.avgTemp} °C</div>
                <div className="text-[11px] text-gray-500 mt-1">
                  高 {s.maxHigh}° / 低 {s.minLow}°
                </div>
                <div className="text-[10px] text-blue-600 font-medium mt-1">
                  {s.stationCount} 個測站
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Selector */}
      <RegionSelect
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
        counties={counties}
        selectedCounty={selectedCounty}
        onCountyChange={setSelectedCounty}
        disabled={loading}
      />

      {/* Interactive Map and Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-800">
              🗺️ 測站分佈互動式地圖
            </h2>
            <span className="text-xs text-gray-500">
              點擊圓點查看測站即時溫度
            </span>
          </div>
          <TaiwanMap stations={stations} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-800">
              📊 氣溫趨勢與高低溫分析
            </h2>
            <span className="text-xs text-gray-500">
              {selectedRegion} - {selectedCounty}
            </span>
          </div>
          <WeatherChart
            stations={stations}
            title={`${selectedRegion} (${selectedCounty}) 測站氣溫分析`}
          />
        </div>
      </div>

      {/* Weather Table */}
      <WeatherTable stations={stations} />
    </div>
  );
}
