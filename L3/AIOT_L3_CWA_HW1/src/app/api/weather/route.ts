import { NextResponse } from "next/server";
import {
  listRegions,
  listCounties,
  getRegionSummaries,
  getStationRecords,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region") || undefined;
    const county = searchParams.get("county") || undefined;
    const type = searchParams.get("type") || "all";

    const regions = ["全部地區", ...listRegions()];
    const counties = ["全部縣市", ...listCounties(region)];

    if (type === "summary") {
      const summaries = getRegionSummaries();
      return NextResponse.json({ success: true, summaries, regions });
    }

    const stations = getStationRecords({ region, county });
    const summaries = getRegionSummaries();

    return NextResponse.json({
      success: true,
      selectedRegion: region || "全部地區",
      selectedCounty: county || "全部縣市",
      regions,
      counties,
      stations,
      summaries,
      count: stations.length,
    });
  } catch (err) {
    console.error("API error /api/weather:", err);
    return NextResponse.json(
      { success: false, error: "Failed to query weather database" },
      { status: 500 }
    );
  }
}
