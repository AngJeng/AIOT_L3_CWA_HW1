import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export interface StationRecord {
  id: number;
  stationId: string;
  stationName: string;
  countyName: string;
  townName: string;
  regionName: string;
  obsTime: string;
  dataDate: string;
  temperature: number;
  dailyHigh: number;
  dailyLow: number;
  latitude: number;
  longitude: number;
  weather?: string;
  humidity?: number;
}

export interface RegionSummary {
  regionName: string;
  stationCount: number;
  avgTemp: number;
  maxHigh: number;
  minLow: number;
}

/**
 * Returns a SQLite connection to public/data.db.
 */
export function getDB() {
  const dbPath = path.join(process.cwd(), "public", "data.db");
  const fallbackPath = path.resolve(__dirname, "../../public/data.db");
  const resolvedPath = fs.existsSync(dbPath)
    ? dbPath
    : fs.existsSync(fallbackPath)
    ? fallbackPath
    : dbPath;
  return new Database(resolvedPath, { readonly: true, fileMustExist: false });
}

/** Return all distinct region names */
export function listRegions(): string[] {
  try {
    const db = getDB();
    const rows = db
      .prepare("SELECT DISTINCT regionName FROM TemperatureForecasts ORDER BY regionName ASC")
      .all() as { regionName: string }[];
    return rows.map((r) => r.regionName);
  } catch (err) {
    console.error("listRegions error:", err);
    return [];
  }
}

/** Return all distinct county names, optionally filtered by region */
export function listCounties(region?: string): string[] {
  try {
    const db = getDB();
    if (region && region !== "全部地區") {
      const rows = db
        .prepare("SELECT DISTINCT countyName FROM TemperatureForecasts WHERE regionName = ? ORDER BY countyName ASC")
        .all(region) as { countyName: string }[];
      return rows.map((r) => r.countyName);
    }
    const rows = db
      .prepare("SELECT DISTINCT countyName FROM TemperatureForecasts ORDER BY countyName ASC")
      .all() as { countyName: string }[];
    return rows.map((r) => r.countyName);
  } catch (err) {
    console.error("listCounties error:", err);
    return [];
  }
}

/** Return summary statistics for all regions */
export function getRegionSummaries(): RegionSummary[] {
  try {
    const db = getDB();
    const rows = db
      .prepare(`
        SELECT 
          regionName,
          COUNT(*) as stationCount,
          ROUND(AVG(temperature), 1) as avgTemp,
          ROUND(MAX(dailyHigh), 1) as maxHigh,
          ROUND(MIN(dailyLow), 1) as minLow
        FROM TemperatureForecasts
        GROUP BY regionName
        ORDER BY avgTemp DESC
      `)
      .all() as RegionSummary[];
    return rows;
  } catch (err) {
    console.error("getRegionSummaries error:", err);
    return [];
  }
}

/** Return stations filtered by region and/or county */
export function getStationRecords(params?: {
  region?: string;
  county?: string;
  limit?: number;
}): StationRecord[] {
  try {
    const db = getDB();
    const conditions: string[] = [];
    const args: any[] = [];

    if (params?.region && params.region !== "全部地區") {
      conditions.push("regionName = ?");
      args.push(params.region);
    }
    if (params?.county && params.county !== "全部縣市") {
      conditions.push("countyName = ?");
      args.push(params.county);
    }

    let sql = `
      SELECT * FROM TemperatureForecasts
    `;
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY temperature DESC";
    if (params?.limit) {
      sql += " LIMIT ?";
      args.push(params.limit);
    }

    return db.prepare(sql).all(...args) as StationRecord[];
  } catch (err) {
    console.error("getStationRecords error:", err);
    return [];
  }
}
