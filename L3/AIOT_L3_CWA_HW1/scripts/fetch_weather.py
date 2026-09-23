#!/usr/bin/env python3
"""
scripts/fetch_weather.py
Fetch raw weather data from the CWA Open Data API (O-A0003-001).
Uses Python built-in urllib so it requires ZERO external dependencies.
"""
import os
import sys
import json
from pathlib import Path
import urllib.request
import urllib.parse
import urllib.error

API_URL = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001"
DEFAULT_API_KEY = "CWA-55FDA6D3-A43C-4AE0-BB30-E62D5F684FB2"

def fetch():
    api_key = os.getenv("CWA_API_KEY", DEFAULT_API_KEY)
    if not api_key:
        print("⚠️ CWA_API_KEY not set in environment, using default key")
        api_key = DEFAULT_API_KEY

    params = {
        "Authorization": api_key,
        "format": "JSON"
    }

    query_str = urllib.parse.urlencode(params)
    full_url = f"{API_URL}?{query_str}"

    print(f"📡 Fetching data from CWA API (Dataset: O-A0003-001)...")
    try:
        req = urllib.request.Request(
            full_url,
            headers={"User-Agent": "TaiwanWeatherDashboard/1.0"}
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            raw_bytes = response.read()
            data = json.loads(raw_bytes.decode("utf-8"))
    except urllib.error.URLError as exc:
        print(f"⚠️ Failed to fetch CWA data: {exc}")
        out_path = Path(__file__).resolve().parent.parent / "weather_raw.json"
        if out_path.is_file():
            print(f"🔄 Using existing fallback: {out_path}")
            return json.loads(out_path.read_text(encoding="utf-8"))
        raise

    out_path = Path(__file__).resolve().parent.parent / "weather_raw.json"
    out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    station_count = len(data.get("records", {}).get("Station", []))
    print(f"✅ Successfully fetched {station_count} stations and saved to {out_path}")
    return data

if __name__ == "__main__":
    fetch()
