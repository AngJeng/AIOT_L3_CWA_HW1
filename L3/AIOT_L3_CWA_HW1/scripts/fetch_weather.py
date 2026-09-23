#!/usr/bin/env python3
"""
scripts/fetch_weather.py
Fetch raw weather data from the CWA Open Data API (O-A0003-001).
Saves raw JSON to `weather_raw.json` at project root.
"""
import os
import sys
import json
from pathlib import Path
import requests

API_URL = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001"
DEFAULT_API_KEY = "CWA-55FDA6D3-A43C-4AE0-BB30-E62D5F684FB2"

def fetch():
    api_key = os.getenv("CWA_API_KEY", DEFAULT_API_KEY)
    if not api_key:
        sys.exit("❌ CWA_API_KEY not set in environment")

    params = {
        "Authorization": api_key,
        "format": "JSON"
    }

    print(f"📡 Fetching data from CWA API (Dataset: O-A0003-001)...")
    try:
        resp = requests.get(API_URL, params=params, timeout=25)
        resp.raise_for_status()
    except requests.RequestException as exc:
        sys.exit(f"❌ Failed to fetch CWA data: {exc}")

    data = resp.json()
    out_path = Path(__file__).resolve().parent.parent / "weather_raw.json"
    out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    station_count = len(data.get("records", {}).get("Station", []))
    print(f"✅ Successfully fetched {station_count} stations and saved to {out_path}")
    return data

if __name__ == "__main__":
    fetch()
