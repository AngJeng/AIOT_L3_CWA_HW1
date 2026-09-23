"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import { StationRecord } from "@/lib/db";
import "leaflet/dist/leaflet.css";

interface TaiwanMapProps {
  stations: StationRecord[];
}

export function getMarkerColor(temp: number): string {
  if (temp < 20) return "#3B82F6"; // 藍色
  if (temp <= 25) return "#22C55E"; // 綠色
  if (temp <= 30) return "#EAB308"; // 黃色
  return "#EF4444"; // 紅色
}

export default function TaiwanMap({ stations }: TaiwanMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[520px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        地圖載入中...
      </div>
    );
  }

  // Filter out invalid coordinates
  const validStations = stations.filter(
    (s) => s.latitude && s.longitude && s.latitude > 20 && s.latitude < 27 && s.longitude > 118 && s.longitude < 123
  );

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <MapContainer
        center={[23.8, 120.9]}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validStations.map((st) => {
          const color = getMarkerColor(st.temperature);
          return (
            <CircleMarker
              key={`${st.stationId}-${st.obsTime}`}
              center={[st.latitude, st.longitude]}
              radius={6}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.85,
                color: "#ffffff",
                weight: 1.5,
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={0.9}>
                <span className="font-semibold text-xs">
                  {st.stationName}: {st.temperature}°C
                </span>
              </Tooltip>
              <Popup>
                <div className="p-1 text-sm">
                  <div className="font-bold text-gray-900 text-base mb-1">
                    {st.stationName}
                    <span className="ml-1 text-xs font-normal text-gray-500">
                      ({st.countyName} {st.townName})
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    區域：{st.regionName} | 時間：{st.obsTime}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">即時氣溫：</span>
                      <span
                        className="font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: color }}
                      >
                        {st.temperature} °C
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">今日高低溫：</span>
                      <span className="font-medium text-gray-800">
                        <span className="text-red-600">高 {st.dailyHigh}°</span> /{" "}
                        <span className="text-emerald-600">低 {st.dailyLow}°</span>
                      </span>
                    </div>
                    {st.weather && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">天氣狀況：</span>
                        <span className="font-medium text-gray-800">{st.weather}</span>
                      </div>
                    )}
                    {st.humidity !== null && st.humidity !== undefined && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">相對濕度：</span>
                        <span className="font-medium text-gray-800">{st.humidity}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Temperature Color Scale Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-200 text-xs">
        <div className="font-bold text-gray-800 mb-2">🌡️ 氣溫區間圖例</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white shadow-sm inline-block"
              style={{ backgroundColor: "#3B82F6" }}
            ></span>
            <span className="text-gray-700">&lt; 20°C (藍色)</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white shadow-sm inline-block"
              style={{ backgroundColor: "#22C55E" }}
            ></span>
            <span className="text-gray-700">20 ~ 25°C (綠色)</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white shadow-sm inline-block"
              style={{ backgroundColor: "#EAB308" }}
            ></span>
            <span className="text-gray-700">25 ~ 30°C (黃色)</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white shadow-sm inline-block"
              style={{ backgroundColor: "#EF4444" }}
            ></span>
            <span className="text-gray-700">&gt; 30°C (紅色)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
