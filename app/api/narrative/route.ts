import { NextRequest, NextResponse } from "next/server";
import {
  KPI_DATA,
  THERAPEUTIC_AREA_DATA,
  SUPPLIER_PERFORMANCE,
  CASH_TO_CASH,
  CASH_TO_CASH_DETAILED,
  RISK_DATA,
  FALLBACK_NARRATIVES,
} from "@/data/mockData";

// ─── Types ───────────────────────────────────────────────────────────────────

type NarrativeType =
  | "overview"
  | "inventory"
  | "supplier"
  | "forecast"
  | "cashcycle"
  | "risk";

// ─── System prompt (per spec) ────────────────────────────────────────────────

const SYSTEM_PROMPT =
  "You are a supply chain analytics narrator for AbbVie, a $61B biopharmaceutical company. " +
  "Generate a concise 2-3 sentence executive summary based on the KPI data provided. " +
  "Use specific numbers. Be direct and action-oriented. Never use bullet points. " +
  "Write like a seasoned supply chain strategist briefing the C-suite.";

// ─── Build type-specific user messages ───────────────────────────────────────

function buildUserMessage(type: NarrativeType, data: unknown): string {
  switch (type) {
    case "overview": {
      const lines = KPI_DATA.map(
        (k) =>
          `${k.label}: ${k.value}${k.unit} (target: ${k.target}${k.unit}, trend: ${k.trendValue}, status: ${k.status})`
      );
      return `Summarize the current supply chain pulse based on these Tier 1 KPIs:\n${lines.join("\n")}`;
    }

    case "inventory": {
      const lines = THERAPEUTIC_AREA_DATA.map(
        (ta) =>
          `${ta.area}: ${ta.monthsOfSupply} months (target: ${ta.target}, status: ${ta.status}, products: ${ta.keyProducts.join(", ")})`
      );
      return `Provide an executive insight on inventory health across therapeutic areas:\n${lines.join("\n")}`;
    }

    case "supplier": {
      const lines = SUPPLIER_PERFORMANCE.map(
        (s) =>
          `${s.name} (${s.category}): OTD ${s.onTimeDelivery}%, Quality ${s.qualityScore}, Overall ${s.score}, Status: ${s.status}`
      );
      return `Summarize supplier performance and flag any risks:\n${lines.join("\n")}`;
    }

    case "forecast": {
      const lines = THERAPEUTIC_AREA_DATA.map(
        (ta) =>
          `${ta.area}: current ${ta.forecastAccuracy}% (prior period: ${ta.priorPeriodAccuracy}%, target: 90%)`
      );
      return `Analyze forecast accuracy trends by therapeutic area:\n${lines.join("\n")}`;
    }

    case "cashcycle": {
      const trend = CASH_TO_CASH;
      const detail = CASH_TO_CASH_DETAILED;
      const latest = detail[detail.length - 1];
      return (
        `Analyze cash-to-cash cycle performance:\n` +
        `12-month trend: ${trend[0].value} days (${trend[0].month}) → ${trend[trend.length - 1].value} days (${trend[trend.length - 1].month})\n` +
        `Latest breakdown — DIO: ${latest.dio}, DSO: ${latest.dso}, DPO: ${latest.dpo}, C2C: ${latest.c2c} days\n` +
        `Pharma benchmark range: 45-75 days`
      );
    }

    case "risk": {
      const riskData = data as { id?: string; [key: string]: unknown };
      const risk = riskData?.id
        ? RISK_DATA.find((r) => r.id === riskData.id)
        : null;
      if (risk) {
        return (
          `Provide a strategic risk brief for the C-suite:\n` +
          `Title: ${risk.title}\n` +
          `Category: ${risk.category} | Severity: ${risk.severity}\n` +
          `Region: ${risk.region}\n` +
          `Description: ${risk.description}\n` +
          `Affected Products: ${risk.affectedProducts.join(", ")}`
        );
      }
      return `Analyze this risk signal:\n${JSON.stringify(data)}`;
    }

    default:
      return JSON.stringify(data);
  }
}

// ─── Fallback narratives from mock data (NEVER return generic error) ─────────

function getFallback(type: NarrativeType, data: unknown): string {
  switch (type) {
    case "overview":
      return FALLBACK_NARRATIVES.overallSummary;
    case "inventory":
      return FALLBACK_NARRATIVES.inventoryHealth;
    case "supplier":
      return FALLBACK_NARRATIVES.supplierPerformance;
    case "forecast":
      return FALLBACK_NARRATIVES.forecastAccuracy;
    case "cashcycle":
      return FALLBACK_NARRATIVES.cashToCash;
    case "risk": {
      const riskData = data as { id?: string };
      if (riskData?.id && FALLBACK_NARRATIVES.riskBriefs[riskData.id]) {
        return FALLBACK_NARRATIVES.riskBriefs[riskData.id];
      }
      return "This risk signal requires monitoring. Review the affected products and regional exposure to assess mitigation options and timeline.";
    }
    default:
      return FALLBACK_NARRATIVES.overallSummary;
  }
}

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let type: NarrativeType = "overview";
  let data: unknown = {};

  try {
    const body = await req.json();
    type = body.type ?? "overview";
    data = body.data ?? {};
  } catch {
    // Malformed JSON — return overview fallback
    return NextResponse.json({ narrative: FALLBACK_NARRATIVES.overallSummary });
  }

  // No API key → return fallback silently (never expose error)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ narrative: getFallback(type, data) });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserMessage(type, data) }],
      }),
    });

    if (!res.ok) {
      // Rate limit, auth error, server error → fallback
      console.error("Anthropic API error:", res.status, await res.text());
      return NextResponse.json({ narrative: getFallback(type, data) });
    }

    const result = await res.json();
    const text = result?.content?.[0]?.text;
    if (!text) {
      return NextResponse.json({ narrative: getFallback(type, data) });
    }

    return NextResponse.json({ narrative: text });
  } catch (e) {
    // Network error → fallback
    console.error("Narrative generation failed:", e);
    return NextResponse.json({ narrative: getFallback(type, data) });
  }
}
