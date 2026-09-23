#!/usr/bin/env python3
"""
scripts/run_pipeline.py
End-to-end ETL script using only standard library:
1. Fetch weather observations from CWA Open Data API (O-A0003-001)
2. Parse station coordinates, temperatures, daily highs and lows
3. Store records into SQLite `public/data.db`
"""
import sys
from pathlib import Path
from scripts.fetch_weather import fetch
from scripts.parse_weather import parse
from scripts.database import bulk_insert

def run():
    print("=" * 60)
    print("🚀 Starting CWA Taiwan Weather ETL Pipeline (Zero Dependencies)")
    print("=" * 60)
    
    try:
        # Step 1: Fetch
        raw_data = fetch()
        
        # Step 2: Parse
        parsed_rows = parse(raw_data)
        
        # Step 3: Insert into SQLite
        bulk_insert(parsed_rows)
        
        print("=" * 60)
        print("🎉 ETL Pipeline Completed Successfully!")
        print("=" * 60)
    except Exception as exc:
        print(f"⚠️ Warning during ETL run: {exc}")
        db_path = Path(__file__).resolve().parent.parent / "public" / "data.db"
        if db_path.is_file():
            print(f"✅ Found existing database at {db_path}, proceeding with build.")
        else:
            print(f"❌ Error: Database not found at {db_path}")
            sys.exit(1)

if __name__ == "__main__":
    run()
