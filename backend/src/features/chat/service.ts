import { callAIGateway } from "../../clients/aiGateway.js";
import { BJARNE_CHAT_SYSTEM_PROMPT } from "./prompt.js";
import type { ChatRequest, ChatResponse } from "./types.js";

type RawChat = {
  svar: string;
  tips: string[];
  heroforklaring: string;
  belop: number;
  kommentar: string;
};

export async function chatMedBjarne(req: ChatRequest): Promise<ChatResponse> {
  const input = byggInput(req);
  const raw = await callAIGateway(BJARNE_CHAT_SYSTEM_PROMPT, input);
  const json = extractJson(raw);
  const parsed = JSON.parse(json) as RawChat;

  if (
    typeof parsed.svar !== "string" ||
    typeof parsed.heroforklaring !== "string" ||
    typeof parsed.belop !== "number" ||
    typeof parsed.kommentar !== "string"
  ) {
    throw new Error("Uventet svarformat fra Bjarne.");
  }

  const belop = klem(Math.round(parsed.belop), 5000, 5000000);
  const forrige =
    typeof req.forrigeBelop === "number" ? req.forrigeBelop : belop;

  return {
    svar: parsed.svar,
    tips: Array.isArray(parsed.tips)
      ? parsed.tips.filter((t): t is string => typeof t === "string")
      : [],
    heroforklaring: parsed.heroforklaring,
    belop,
    delta: belop - forrige,
    kommentar: parsed.kommentar,
  };
}

function byggInput(req: ChatRequest): string {
  const historikk = req.historikk
    .map((t) => `${t.role === "kunde" ? "Kunde" : "Bjarne"}: ${t.text}`)
    .join("\n");

  const forrige =
    typeof req.forrigeBelop === "number"
      ? `\n\nForrige totalbeløp: ${req.forrigeBelop} kr.`
      : "";

  return `Samtalen så langt:\n${historikk || "(ingen tidligere meldinger)"}\n\nNy melding fra kunden:\n${req.melding}${forrige}`;
}

function klem(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) return trimmed;
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) return match[0];
  throw new Error("Bjarne svarte ikke med JSON.");
}
