#!/usr/bin/env python3
"""
scripts/parse_weather.py
Parse raw JSON from CWA O-A0003-001 (10-minute station weather observations).
Extracts station info, coordinates, temperatures, extremes, and maps counties to Taiwan's 6 major regions.
"""
import json
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional

RAW_PATH = Path(__file__).resolve().parent.parent / "weather_raw.json"

# Six regions mapping according to CWA regional classification
COUNTY_TO_REGION = {
    # 北部地區
    "基隆市": "北部地區",
    "臺北市": "北部地區",
    "台北市": "北部地區",
    "新北市": "北部地區",
    "桃園市": "北部地區",
    "新竹市": "北部地區",
    "新竹縣": "北部地區",
    "苗栗縣": "北部地區",
    # 中部地區
    "臺中市": "中部地區",
    "台中市": "中部地區",
    "彰化縣": "中部地區",
    "南投縣": "中部地區",
    "雲林縣": "中部地區",
    "嘉義市": "中部地區",
    "嘉義縣": "中部地區",
    # 南部地區
    "臺南市": "南部地區",
    "台南市": "南部地區",
    "高雄市": "南部地區",
    "屏東縣": "南部地區",
    # 東北部地區
    "宜蘭縣": "東北部地區",
    # 東部地區
    "花蓮縣": "東部地區",
    # 東南部地區
    "臺東縣": "東南部地區",
    "台東縣": "東南部地區",
    # 離島地區
    "澎湖縣": "離島地區",
    "金門縣": "離島地區",
    "連江縣": "離島地區",
}

def parse(raw_data: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    if raw_data is None:
        if not RAW_PATH.is_file():
            sys.exit(f"❌ Raw data not found: {RAW_PATH}")
        raw_data = json.loads(RAW_PATH.read_text(encoding="utf-8"))

    stations = raw_data.get("records", {}).get("Station", [])
    if not stations:
        print("⚠️ Warning: No Station records found in data.")
        return []

    rows = []
    for st in stations:
        station_name = st.get("StationName", "").strip()
        station_id = st.get("StationId", "").strip()

        # Observation time
        obs_time_obj = st.get("ObsTime", {})
        obs_time = obs_time_obj.get("DateTime", "")
        # Format datetime e.g. "2026-09-23T21:10:00+08:00" -> "2026-09-23 21:10:00"
        data_date = obs_time.split("T")[0] if "T" in obs_time else (obs_time.split(" ")[0] if obs_time else "")
        clean_obs_time = obs_time.replace("T", " ").split("+")[0] if obs_time else ""

        # GeoInfo
        geo_info = st.get("GeoInfo", {})
        county_name = geo_info.get("CountyName", "其他").strip()
        town_name = geo_info.get("TownName", "").strip()
        region_name = COUNTY_TO_REGION.get(county_name, "其他地區")

        # Coordinates (search for WGS84, fallback to first coordinate)
        lat = None
        lon = None
        for coord in geo_info.get("Coordinates", []):
            try:
                c_lat = float(coord.get("StationLatitude", 0))
                c_lon = float(coord.get("StationLongitude", 0))
                if coord.get("CoordinateName") == "WGS84":
                    lat, lon = c_lat, c_lon
                    break
                elif lat is None:
                    lat, lon = c_lat, c_lon
            except (ValueError, TypeError):
                continue

        # WeatherElement
        we = st.get("WeatherElement", {})
        
        # Air Temperature
        temp_val = we.get("AirTemperature")
        temp: Optional[float] = None
        try:
            if temp_val is not None and float(temp_val) > -90:
                temp = float(temp_val)
        except (ValueError, TypeError):
            temp = None

        # Daily extremes
        daily_extreme = we.get("DailyExtreme", {})
        daily_high_obj = daily_extreme.get("DailyHigh", {}).get("TemperatureInfo", {})
        daily_low_obj = daily_extreme.get("DailyLow", {}).get("TemperatureInfo", {})

        daily_high: Optional[float] = None
        try:
            val = daily_high_obj.get("AirTemperature")
            if val is not None and float(val) > -90:
                daily_high = float(val)
        except (ValueError, TypeError):
            daily_high = None

        daily_low: Optional[float] = None
        try:
            val = daily_low_obj.get("AirTemperature")
            if val is not None and float(val) > -90:
                daily_low = float(val)
        except (ValueError, TypeError):
            daily_low = None

        # Weather description & Humidity
        weather = we.get("Weather", "")
        humidity_val = we.get("RelativeHumidity")
        humidity: Optional[float] = None
        try:
            if humidity_val is not None and float(humidity_val) >= 0:
                humidity = float(humidity_val)
        except (ValueError, TypeError):
            humidity = None

        # Only add valid stations with temperature and coordinates
        if temp is not None and lat is not None and lon is not None:
            rows.append({
                "stationId": station_id,
                "stationName": station_name,
                "countyName": county_name,
                "townName": town_name,
                "regionName": region_name,
                "obsTime": clean_obs_time or obs_time,
                "dataDate": data_date,
                "temperature": round(temp, 1),
                "dailyHigh": round(daily_high, 1) if daily_high is not None else round(temp, 1),
                "dailyLow": round(daily_low, 1) if daily_low is not None else round(temp, 1),
                "latitude": round(lat, 6),
                "longitude": round(lon, 6),
                "weather": str(weather),
                "humidity": round(humidity, 1) if humidity is not None else None,
            })

    print(f"✅ Parsed {len(rows)} observation rows from {len(stations)} stations.")
    return rows

if __name__ == "__main__":
    parsed = parse()
    if parsed:
        print("Sample parsed row:", parsed[0])
