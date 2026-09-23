import { callAIGateway } from "../../clients/aiGateway.js";
import { SKISSE_SYSTEM_PROMPT } from "./prompt.js";
import { sanitizeSvg } from "./sanitize.js";
import type { SkisseResponse } from "./types.js";

export async function tegnSkadeskisse(skade: string): Promise<SkisseResponse> {
  const raw = await callAIGateway(SKISSE_SYSTEM_PROMPT, skade);
  const json = extractJson(raw);
  const parsed = JSON.parse(json) as Partial<SkisseResponse>;

  if (
    typeof parsed.svg !== "string" ||
    !parsed.svg.trim().startsWith("<svg")
  ) {
    throw new Error("Bjarne leverte skissesuppe i stedet for JSON. Prøv igjen.");
  }

  const svg = sanitizeSvg(parsed.svg);

  if (!svg.startsWith("<svg") || !svg) {
    throw new Error("Bjarne tegnet noe rart. Prøv igjen.");
  }

  return { svg };
}

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) return trimmed;
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) return match[0];
  throw new Error("Bjarne svarte ikke med JSON, tydeligvis.");
}
