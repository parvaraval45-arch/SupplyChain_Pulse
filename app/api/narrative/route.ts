import { NextRequest, NextResponse } from "next/server";
import { generateNarrative } from "@/lib/claude";
import type { KPI } from "@/data/mockData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const kpiData: KPI[] = body.kpiData;
    const context: string | undefined = body.context;

    if (!kpiData || !Array.isArray(kpiData)) {
      return NextResponse.json(
        { error: "kpiData array is required" },
        { status: 400 }
      );
    }

    const narrative = await generateNarrative(kpiData, context);
    return NextResponse.json({ narrative });
  } catch (e) {
    console.error("Narrative route error:", e);
    return NextResponse.json(
      { narrative: "Unable to generate narrative at this time." },
      { status: 500 }
    );
  }
}
