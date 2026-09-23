import { callAIGateway } from "../../clients/aiGateway.js";
import { AGENT_CHAT_SYSTEM_PROMPT } from "./prompt.js";
import type { ChatRequest, ChatResponse, Valg } from "./types.js";

type RawChat = {
  svar: string;
  tips: string[];
  heroforklaring: string;
  belop: number;
  kommentar: string;
  svikSannsynlighet: number;
  svikBegrunnelse: string;
  valg: unknown;
};

export async function chatMedAgent(req: ChatRequest): Promise<ChatResponse> {
  const input = byggInput(req);
  const raw = await callAIGateway(AGENT_CHAT_SYSTEM_PROMPT, input);
  const json = extractJson(raw);
  const parsed = JSON.parse(json) as RawChat;

  if (
    typeof parsed.svar !== "string" ||
    typeof parsed.heroforklaring !== "string" ||
    typeof parsed.belop !== "number" ||
    typeof parsed.kommentar !== "string"
  ) {
    throw new Error("Uventet svarformat fra agenten.");
  }

  const belop = klem(Math.round(parsed.belop), 5000, 5000000);
  const forrige =
    typeof req.forrigeBelop === "number" ? req.forrigeBelop : belop;

  const svikSannsynlighet = klem(
    Math.round(
      typeof parsed.svikSannsynlighet === "number"
        ? parsed.svikSannsynlighet
        : 0,
    ),
    0,
    100,
  );
  const fengselAar = beregnFengselAar(belop, svikSannsynlighet);

  return {
    svar: parsed.svar,
    tips: Array.isArray(parsed.tips)
      ? parsed.tips.filter((t): t is string => typeof t === "string")
      : [],
    heroforklaring: parsed.heroforklaring,
    belop,
    delta: belop - forrige,
    kommentar: parsed.kommentar,
    svikSannsynlighet,
    svikBegrunnelse:
      typeof parsed.svikBegrunnelse === "string" ? parsed.svikBegrunnelse : "",
    fengselAar,
    fengselKommentar: fengselKommentar(fengselAar),
    valg: parseValg(parsed.valg),
  };
}

// Korrelasjon mellom utbetaling og svik-sannsynlighet, uttrykt i "år bak lås".
// Begge må være høye for lang straff. Oppdiktet parodi-formel.
export function beregnFengselAar(belop: number, svik: number): number {
  const belopFaktor = Math.min(1, Math.max(0, belop) / 5_000_000);
  const svikFaktor = Math.min(1, Math.max(0, svik) / 100);
  const aar = 15 * belopFaktor * svikFaktor;
  return Math.round(aar * 10) / 10;
}

function fengselKommentar(aar: number): string {
  if (aar < 0.5)
    return "Null drama. Agenten rekker kaffe før noen løfter et øyenbryn.";
  if (aar < 2)
    return "En bot og et surt blikk. Agenten har sett verre før frokost.";
  if (aar < 5)
    return "Noen år. Agenten anbefaler en advokat med bedre kaffe.";
  if (aar < 10)
    return "Dette lukter alvor. Agenten sukker og noterer besøkstidene.";
  return "Livstid light. Agenten sender kaffe i pakke, men besøker deg ikke.";
}

function parseValg(raw: unknown): Valg[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (v): v is Valg =>
        !!v &&
        typeof (v as Valg).tittel === "string" &&
        typeof (v as Valg).tekst === "string" &&
        typeof (v as Valg).belop === "number",
    )
    .slice(0, 4)
    .map((v) => ({
      tittel: v.tittel,
      tekst: v.tekst,
      belop: klem(Math.round(v.belop), -500000, 2000000),
    }));
}

function byggInput(req: ChatRequest): string {
  const historikk = req.historikk
    .map((t) => `${t.role === "kunde" ? "Kunde" : "Agent"}: ${t.text}`)
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
  throw new Error("Agenten svarte ikke med JSON.");
}
