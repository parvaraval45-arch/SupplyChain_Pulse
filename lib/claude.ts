import type { KPI } from "@/data/mockData";

const SYSTEM_PROMPT =
  "You are the Chief Supply Chain Officer's strategic analyst at AbbVie. " +
  "Write concise, executive-level supply chain performance narratives. Be specific, " +
  "data-driven, and direct. No fluff. Reference AbbVie's portfolio (Skyrizi, Rinvoq, " +
  "Humira wind-down, Allergan Aesthetics) where relevant. Max 3 sentences.";

function buildUserPrompt(kpiData: KPI[], context?: string): string {
  const lines = kpiData.map(
    (k) =>
      `• ${k.label}: ${k.value}${k.unit} (target ${k.target}${k.unit}, trend ${k.trendValue}, status ${k.status})`
  );
  let prompt = `Summarize the current supply chain pulse based on these KPIs:\n${lines.join("\n")}`;
  if (context) prompt += `\n\nAdditional context: ${context}`;
  return prompt;
}

export async function generateNarrative(
  kpiData: KPI[],
  context?: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return "AI narrative unavailable — ANTHROPIC_API_KEY not configured.";
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
        max_tokens: 256,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(kpiData, context) }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Anthropic API error:", res.status, err);
      return "Unable to generate narrative at this time. Review KPI cards for latest metrics.";
    }

    const data = await res.json();
    const text = data?.content?.[0]?.text;
    return text || "No narrative content returned.";
  } catch (e) {
    console.error("Narrative generation failed:", e);
    return "Unable to generate narrative at this time. Review KPI cards for latest metrics.";
  }
}

export async function generateDrillInsight(
  metricName: string,
  data: Record<string, unknown>
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return "Drill-down insight unavailable — API key not configured.";
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
        max_tokens: 150,
        system:
          "You are a pharma supply chain analyst at AbbVie. Give a concise 1-2 sentence 'So what?' insight for the given metric. Be specific and actionable.",
        messages: [
          {
            role: "user",
            content: `Metric: ${metricName}\nData: ${JSON.stringify(data)}\n\nWhat is the key takeaway?`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return "Insight temporarily unavailable.";
    }

    const body = await res.json();
    return body?.content?.[0]?.text || "No insight returned.";
  } catch (e) {
    console.error("Drill insight failed:", e);
    return "Insight temporarily unavailable.";
  }
}
