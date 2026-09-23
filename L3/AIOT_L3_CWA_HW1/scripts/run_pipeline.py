#!/usr/bin/env python3
"""
scripts/run_pipeline.py
End-to-end ETL script:
1. Fetch weather observations from CWA Open Data API (O-A0003-001)
2. Parse station coordinates, temperatures, daily highs and lows
3. Store records into SQLite `public/data.db`
"""
from scripts.fetch_weather import fetch
from scripts.parse_weather import parse
from scripts.database import bulk_insert

def run():
    print("=" * 60)
    print("🚀 Starting CWA Taiwan Weather ETL Pipeline")
    print("=" * 60)
    
    # Step 1: Fetch
    raw_data = fetch()
    
    # Step 2: Parse
    parsed_rows = parse(raw_data)
    
    # Step 3: Insert into SQLite
    bulk_insert(parsed_rows)
    
    print("=" * 60)
    print("🎉 ETL Pipeline Completed Successfully!")
    print("=" * 60)

if __name__ == "__main__":
    run()
