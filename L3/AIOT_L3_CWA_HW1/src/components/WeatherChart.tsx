"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { StationRecord } from "@/lib/db";

interface WeatherChartProps {
  stations: StationRecord[];
  title?: string;
}

export default function WeatherChart({ stations, title }: WeatherChartProps) {
  if (!stations || stations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
        暫無可顯示的測站數據
      </div>
    );
  }

  // Pick up to 25 representative stations to keep chart legible and clean
  const chartData = stations.slice(0, 25).map((st) => ({
    name: st.stationName,
    county: st.countyName,
    temperature: st.temperature,
    dailyHigh: st.dailyHigh,
    dailyLow: st.dailyLow,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-wrap items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            📈 {title || "測站氣溫變化與高低溫趨勢圖"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            顯示測站之即時氣溫、今日最高溫與今日最低溫對比（前 {chartData.length} 個測站）
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            即時氣溫
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            今日最高溫
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            今日最低溫
          </span>
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: -10, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tick={({ x, y, payload }) => (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={0}
                    dy={12}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize={11}
                    transform="rotate(-35)"
                  >
                    {payload.value}
                  </text>
                </g>
              )}
              interval={0}
            />
            <YAxis
              unit="°C"
              stroke="#64748b"
              fontSize={12}
              domain={["dataMin - 2", "dataMax + 2"]}
            />
            <Tooltip
              formatter={(value: any, name: any) => {
                const labelMap: Record<string, string> = {
                  temperature: "即時氣溫",
                  dailyHigh: "今日最高溫",
                  dailyLow: "今日最低溫",
                };
                return [`${value} °C`, labelMap[name] || name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  return `${label} (${payload[0].payload.county})`;
                }
                return label;
              }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                borderColor: "#e2e8f0",
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="temperature"
              name="即時氣溫"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="dailyHigh"
              name="今日最高溫"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 2.5, fill: "#ef4444" }}
            />
            <Line
              type="monotone"
              dataKey="dailyLow"
              name="今日最低溫"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 2.5, fill: "#10b981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
