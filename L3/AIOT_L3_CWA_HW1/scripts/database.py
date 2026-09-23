#!/usr/bin/env python3
"""
scripts/database.py
Manage SQLite database `public/data.db` and insert parsed station temperature records.
"""
import sqlite3
from pathlib import Path
from typing import Sequence, Mapping, Any

DB_PATH = Path(__file__).resolve().parent.parent / "public" / "data.db"

SQL_CREATE = """
CREATE TABLE IF NOT EXISTS TemperatureForecasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stationId TEXT,
    stationName TEXT NOT NULL,
    countyName TEXT NOT NULL,
    townName TEXT,
    regionName TEXT NOT NULL,
    obsTime TEXT NOT NULL,
    dataDate TEXT NOT NULL,
    temperature REAL NOT NULL,
    dailyHigh REAL,
    dailyLow REAL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    weather TEXT,
    humidity REAL,
    UNIQUE(stationName, obsTime)
);

CREATE INDEX IF NOT EXISTS idx_region ON TemperatureForecasts(regionName);
CREATE INDEX IF NOT EXISTS idx_county ON TemperatureForecasts(countyName);
CREATE INDEX IF NOT EXISTS idx_obsTime ON TemperatureForecasts(obsTime);
"""

INSERT_SQL = """
INSERT OR REPLACE INTO TemperatureForecasts
(stationId, stationName, countyName, townName, regionName, obsTime, dataDate, temperature, dailyHigh, dailyLow, latitude, longitude, weather, humidity)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
"""

def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.executescript(SQL_CREATE)
    conn.commit()
    conn.close()
    print(f"✅ DB initialized at {DB_PATH}")

def bulk_insert(rows: Sequence[Mapping[str, Any]]):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.executemany(
        INSERT_SQL,
        [
            (
                r.get("stationId"),
                r["stationName"],
                r["countyName"],
                r.get("townName"),
                r["regionName"],
                r["obsTime"],
                r["dataDate"],
                r["temperature"],
                r.get("dailyHigh"),
                r.get("dailyLow"),
                r["latitude"],
                r["longitude"],
                r.get("weather"),
                r.get("humidity"),
            )
            for r in rows
        ],
    )
    conn.commit()
    count = cur.execute("SELECT COUNT(*) FROM TemperatureForecasts").fetchone()[0]
    conn.close()
    print(f"✅ Inserted {len(rows)} rows into TemperatureForecasts. Total records in DB: {count}")

if __name__ == "__main__":
    init_db()
