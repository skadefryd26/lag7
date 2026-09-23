import { callAIGateway } from "../../clients/aiGateway.js";
import { BJARNE_SYSTEM_PROMPT } from "./prompt.js";
import type { MaksResponse } from "./types.js";

export async function maksErstatning(skade: string): Promise<MaksResponse> {
  const raw = await callAIGateway(BJARNE_SYSTEM_PROMPT, skade);
  const json = extractJson(raw);
  const parsed = JSON.parse(json) as MaksResponse;
  if (
    !Array.isArray(parsed.tips) ||
    parsed.tips.length === 0 ||
    typeof parsed.belop !== "number" ||
    typeof parsed.kommentar !== "string" ||
    typeof parsed.svikSannsynlighet !== "number" ||
    typeof parsed.svikBegrunnelse !== "string"
  ) {
    throw new Error("Uventet svarformat fra Bjarne.");
  }
  parsed.svikSannsynlighet = Math.max(
    0,
    Math.min(100, Math.round(parsed.svikSannsynlighet)),
  );
  return parsed;
}

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) return trimmed;
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) return match[0];
  throw new Error("Bjarne svarte ikke med JSON.");
}
