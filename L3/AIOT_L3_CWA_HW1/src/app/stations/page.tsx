"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import RegionSelect from "@/components/RegionSelect";
import { StationRecord } from "@/lib/db";

const TaiwanMap = dynamic(() => import("@/components/TaiwanMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[650px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
      載入地圖元件中...
    </div>
  ),
});

export default function StationsPage() {
  const [selectedRegion, setSelectedRegion] = useState("全部地區");
  const [selectedCounty, setSelectedCounty] = useState("全部縣市");
  const [regions, setRegions] = useState<string[]>(["全部地區"]);
  const [counties, setCounties] = useState<string[]>(["全部縣市"]);
  const [stations, setStations] = useState<StationRecord[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams();
        if (selectedRegion !== "全部地區") params.set("region", selectedRegion);
        if (selectedCounty !== "全部縣市") params.set("county", selectedCounty);

        const res = await fetch(`/api/weather?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setStations(data.stations || []);
          if (data.regions) setRegions(data.regions);
          if (data.counties) setCounties(data.counties);
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [selectedRegion, selectedCounty]);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">🗺️ 台灣全區測站互動式分佈地圖</h1>
        <p className="text-sm text-gray-600 mt-1">
          直觀掌握台灣各區測站之精準地理位置與即時溫標分佈
        </p>
      </div>

      <RegionSelect
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionChange={(r) => {
          setSelectedRegion(r);
          setSelectedCounty("全部縣市");
        }}
        counties={counties}
        selectedCounty={selectedCounty}
        onCountyChange={setSelectedCounty}
      />

      <div className="h-[650px]">
        <TaiwanMap stations={stations} />
      </div>
    </div>
  );
}
