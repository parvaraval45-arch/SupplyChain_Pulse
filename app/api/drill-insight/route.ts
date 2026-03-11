import { NextRequest, NextResponse } from "next/server";
import { generateDrillInsight } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const metricName: string = body.metricName;
    const data: Record<string, unknown> = body.data;

    if (!metricName || !data) {
      return NextResponse.json(
        { error: "metricName and data are required" },
        { status: 400 }
      );
    }

    const insight = await generateDrillInsight(metricName, data);
    return NextResponse.json({ insight });
  } catch (e) {
    console.error("Drill insight route error:", e);
    return NextResponse.json(
      { insight: "Insight temporarily unavailable." },
      { status: 500 }
    );
  }
}
