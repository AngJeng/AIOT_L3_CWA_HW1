"use client";

import React, { useState, useEffect } from "react";
import RegionSelect from "@/components/RegionSelect";
import WeatherChart from "@/components/WeatherChart";
import WeatherTable from "@/components/WeatherTable";
import { StationRecord } from "@/lib/db";

export default function ForecastPage() {
  const [selectedRegion, setSelectedRegion] = useState("北部地區");
  const [selectedCounty, setSelectedCounty] = useState("全部縣市");
  const [regions, setRegions] = useState<string[]>(["全部地區"]);
  const [counties, setCounties] = useState<string[]>(["全部縣市"]);
  const [stations, setStations] = useState<StationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedRegion && selectedRegion !== "全部地區") params.set("region", selectedRegion);
        if (selectedCounty && selectedCounty !== "全部縣市") params.set("county", selectedCounty);

        const res = await fetch(`/api/weather?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setStations(data.stations || []);
          if (data.regions) setRegions(data.regions);
          if (data.counties) setCounties(data.counties);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedRegion, selectedCounty]);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">📊 區域氣象分析與高低溫預報</h1>
        <p className="text-sm text-gray-600 mt-1">
          深入檢視台灣各大區域各測站的即時觀測數值與今日極值變化
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
        disabled={loading}
      />

      <WeatherChart
        stations={stations}
        title={`${selectedRegion} 各測站氣溫趨勢分析`}
      />

      <WeatherTable stations={stations} />
    </div>
  );
}
