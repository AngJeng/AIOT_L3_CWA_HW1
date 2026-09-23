"use client";

import React, { useState } from "react";
import { StationRecord } from "@/lib/db";

interface WeatherTableProps {
  stations: StationRecord[];
}

export function getTempBadge(temp: number) {
  if (temp < 20) {
    return {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-300",
      color: "#3B82F6",
      label: "< 20°C (寒冷/涼爽)",
    };
  } else if (temp <= 25) {
    return {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-300",
      color: "#22C55E",
      label: "20 ~ 25°C (舒適宜人)",
    };
  } else if (temp <= 30) {
    return {
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-300",
      color: "#EAB308",
      label: "25 ~ 30°C (溫暖略熱)",
    };
  } else {
    return {
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-300",
      color: "#EF4444",
      label: "> 30°C (炎熱高溫)",
    };
  }
}

export default function WeatherTable({ stations }: WeatherTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filtered = stations.filter(
    (s) =>
      s.stationName.includes(searchTerm) ||
      s.countyName.includes(searchTerm) ||
      s.regionName.includes(searchTerm) ||
      (s.townName && s.townName.includes(searchTerm))
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header and Search */}
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            📋 測站氣象數據列表
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            共 {filtered.length} 個符合條件的觀測站數據
          </p>
        </div>
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="搜尋測站、縣市、鄉鎮..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">測站名稱</th>
              <th className="px-4 py-3">縣市 / 鄉鎮</th>
              <th className="px-4 py-3">所屬區域</th>
              <th className="px-4 py-3">即時氣溫</th>
              <th className="px-4 py-3">今日高 / 低溫</th>
              <th className="px-4 py-3">天氣現象</th>
              <th className="px-4 py-3">相對濕度</th>
              <th className="px-4 py-3">觀測時間</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  查無符合搜尋條件的測站
                </td>
              </tr>
            ) : (
              paginated.map((st) => {
                const badge = getTempBadge(st.temperature);
                return (
                  <tr key={`${st.stationId}-${st.obsTime}`} className="hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {st.stationName}
                    </td>
                    <td className="px-4 py-3">
                      {st.countyName} {st.townName && <span className="text-gray-400 text-xs">({st.townName})</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
                        {st.regionName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {st.temperature} °C
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="text-red-500 font-medium">高 {st.dailyHigh}°</span> /{" "}
                      <span className="text-emerald-600 font-medium">低 {st.dailyLow}°</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {st.weather || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {st.humidity !== null && st.humidity !== undefined
                        ? `${st.humidity}%`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {st.obsTime}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            頁數 {currentPage} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              上一頁
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              下一頁
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
