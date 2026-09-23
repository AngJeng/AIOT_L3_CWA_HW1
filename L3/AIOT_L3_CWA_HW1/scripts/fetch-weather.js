#!/usr/bin/env node
/**
 * scripts/fetch-weather.js
 * Pure Node.js ETL script for CWA Open Data API (O-A0003-001).
 * Uses native fetch and better-sqlite3 without any external Python dependencies.
 */
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const API_URL = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001";
const DEFAULT_API_KEY = "CWA-55FDA6D3-A43C-4AE0-BB30-E62D5F684FB2";
const DB_PATH = path.resolve(__dirname, "../public/data.db");

// County to Taiwan Six Major Regions mapping
const COUNTY_TO_REGION = {
  // 北部地區
  "基隆市": "北部地區",
  "臺北市": "北部地區",
  "台北市": "北部地區",
  "新北市": "北部地區",
  "桃園市": "北部地區",
  "新竹市": "北部地區",
  "新竹縣": "北部地區",
  "苗栗縣": "北部地區",
  // 中部地區
  "臺中市": "中部地區",
  "台中市": "中部地區",
  "彰化縣": "中部地區",
  "南投縣": "中部地區",
  "雲林縣": "中部地區",
  "嘉義市": "中部地區",
  "嘉義縣": "中部地區",
  // 南部地區
  "臺南市": "南部地區",
  "台南市": "南部地區",
  "高雄市": "南部地區",
  "屏東縣": "南部地區",
  // 東北部地區
  "宜蘭縣": "東北部地區",
  // 東部地區
  "花蓮縣": "東部地區",
  // 東南部地區
  "臺東縣": "東南部地區",
  "台東縣": "東南部地區",
  // 離島地區
  "澎湖縣": "離島地區",
  "金門縣": "離島地區",
  "連江縣": "離島地區",
};

async function main() {
  console.log("=".repeat(60));
  console.log("🚀 Starting CWA Taiwan Weather ETL Pipeline (Node.js)");
  console.log("=".repeat(60));

  const apiKey = process.env.CWA_API_KEY || DEFAULT_API_KEY;
  const fullUrl = `${API_URL}?Authorization=${encodeURIComponent(apiKey)}&format=JSON`;

  let rawData = null;

  try {
    console.log(`📡 Fetching data from CWA API (Dataset: O-A0003-001)...`);
    const response = await fetch(fullUrl, {
      headers: { "User-Agent": "TaiwanWeatherDashboard/1.0" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }

    rawData = await response.json();
    console.log("✅ CWA API response received successfully.");
  } catch (err) {
    console.warn(`⚠️ Warning: Failed to fetch data from CWA API: ${err.message}`);
    if (fs.existsSync(DB_PATH)) {
      console.log(`✅ Using existing SQLite database at ${DB_PATH}. Proceeding with build.`);
      return;
    }
    throw err;
  }

  const stations = rawData?.records?.Station || [];
  console.log(`🔍 Processing ${stations.length} station records...`);

  // Ensure public directory exists
  const publicDir = path.dirname(DB_PATH);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const db = new Database(DB_PATH);

  // Initialize SQLite Table & Indexes
  db.exec(`
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
  `);

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO TemperatureForecasts
    (stationId, stationName, countyName, townName, regionName, obsTime, dataDate, temperature, dailyHigh, dailyLow, latitude, longitude, weather, humidity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `);

  let insertedCount = 0;

  const insertMany = db.transaction((rows) => {
    for (const r of rows) {
      insertStmt.run(
        r.stationId,
        r.stationName,
        r.countyName,
        r.townName,
        r.regionName,
        r.obsTime,
        r.dataDate,
        r.temperature,
        r.dailyHigh,
        r.dailyLow,
        r.latitude,
        r.longitude,
        r.weather,
        r.humidity
      );
      insertedCount++;
    }
  });

  const parsedRows = [];

  for (const st of stations) {
    const stationName = (st.StationName || "").trim();
    const stationId = (st.StationId || "").trim();

    const obsTimeRaw = st.ObsTime?.DateTime || "";
    const cleanObsTime = obsTimeRaw.replace("T", " ").split("+")[0] || obsTimeRaw;
    const dataDate = cleanObsTime.split(" ")[0] || "";

    const geo = st.GeoInfo || {};
    const countyName = (geo.CountyName || "其他").trim();
    const townName = (geo.TownName || "").trim();
    const regionName = COUNTY_TO_REGION[countyName] || "其他地區";

    // Coordinates (Look for WGS84)
    let latitude = null;
    let longitude = null;
    const coords = geo.Coordinates || [];
    for (const c of coords) {
      const lat = parseFloat(c.StationLatitude);
      const lon = parseFloat(c.StationLongitude);
      if (!isNaN(lat) && !isNaN(lon)) {
        if (c.CoordinateName === "WGS84") {
          latitude = lat;
          longitude = lon;
          break;
        } else if (latitude === null) {
          latitude = lat;
          longitude = lon;
        }
      }
    }

    // Weather elements
    const we = st.WeatherElement || {};
    const tempVal = parseFloat(we.AirTemperature);
    const temperature = !isNaN(tempVal) && tempVal > -90 ? Math.round(tempVal * 10) / 10 : null;

    // Extremes
    const highVal = parseFloat(we.DailyExtreme?.DailyHigh?.TemperatureInfo?.AirTemperature);
    const lowVal = parseFloat(we.DailyExtreme?.DailyLow?.TemperatureInfo?.AirTemperature);
    const dailyHigh = !isNaN(highVal) && highVal > -90 ? Math.round(highVal * 10) / 10 : temperature;
    const dailyLow = !isNaN(lowVal) && lowVal > -90 ? Math.round(lowVal * 10) / 10 : temperature;

    const weather = we.Weather || "";
    const humVal = parseFloat(we.RelativeHumidity);
    const humidity = !isNaN(humVal) && humVal >= 0 ? Math.round(humVal * 10) / 10 : null;

    if (temperature !== null && latitude !== null && longitude !== null) {
      parsedRows.push({
        stationId,
        stationName,
        countyName,
        townName,
        regionName,
        obsTime: cleanObsTime,
        dataDate,
        temperature,
        dailyHigh,
        dailyLow,
        latitude: Math.round(latitude * 1000000) / 1000000,
        longitude: Math.round(longitude * 1000000) / 1000000,
        weather,
        humidity,
      });
    }
  }

  insertMany(parsedRows);

  const totalCount = db.prepare("SELECT COUNT(*) as count FROM TemperatureForecasts").get().count;
  db.close();

  console.log(`✅ Parsed and inserted ${insertedCount} observation rows.`);
  console.log(`📊 Total records now in public/data.db: ${totalCount}`);
  console.log("=".repeat(60));
  console.log("🎉 Node.js ETL Pipeline Completed Successfully!");
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("❌ Fatal Error in ETL Pipeline:", err);
  process.exit(1);
});
