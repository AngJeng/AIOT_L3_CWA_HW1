"use client";

import React from "react";

interface RegionSelectProps {
  regions: string[];
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  counties: string[];
  selectedCounty: string;
  onCountyChange: (county: string) => void;
  disabled?: boolean;
}

export default function RegionSelect({
  regions,
  selectedRegion,
  onRegionChange,
  counties,
  selectedCounty,
  onCountyChange,
  disabled = false,
}: RegionSelectProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-4">
      {/* 區域選擇 */}
      <div className="flex items-center gap-2">
        <label htmlFor="region-select" className="text-sm font-semibold text-gray-700 whitespace-nowrap">
          🌐 台灣六大區域：
        </label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          disabled={disabled}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition"
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* 縣市選擇 */}
      <div className="flex items-center gap-2">
        <label htmlFor="county-select" className="text-sm font-semibold text-gray-700 whitespace-nowrap">
          🏙️ 縣市切換：
        </label>
        <select
          id="county-select"
          value={selectedCounty}
          onChange={(e) => onCountyChange(e.target.value)}
          disabled={disabled}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition"
        >
          {counties.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 快捷重置 */}
      {(selectedRegion !== "全部地區" || selectedCounty !== "全部縣市") && (
        <button
          onClick={() => {
            onRegionChange("全部地區");
            onCountyChange("全部縣市");
          }}
          className="text-xs text-blue-600 hover:text-blue-800 underline font-medium ml-auto"
        >
          重置篩選
        </button>
      )}
    </div>
  );
}
