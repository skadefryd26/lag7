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

  parsed.fengselAar = beregnFengselAar(
    parsed.belop,
    parsed.svikSannsynlighet,
  );
  parsed.fengselKommentar = fengselKommentar(parsed.fengselAar);

  return parsed;
}

// Korrelasjon mellom utbetaling og svik-sannsynlighet, uttrykt i "år bak lås".
// Jo høyere beløp OG jo høyere sannsynlighet for å bli tatt, jo lengre straff.
// Oppdiktet parodi-formel — ingen juridisk verdi.
export function beregnFengselAar(belop: number, svik: number): number {
  const belopFaktor = Math.min(1, Math.max(0, belop) / 5_000_000); // 0..1
  const svikFaktor = Math.min(1, Math.max(0, svik) / 100); // 0..1
  // Multiplikativ korrelasjon: begge må være høye for lang straff.
  const aar = 15 * belopFaktor * svikFaktor;
  return Math.round(aar * 10) / 10; // én desimal
}

function fengselKommentar(aar: number): string {
  if (aar < 0.5)
    return "Null drama. Bjarne rekker kaffe før noen løfter et øyenbryn.";
  if (aar < 2)
    return "En bot og et surt blikk. Bjarne har sett verre før frokost.";
  if (aar < 5)
    return "Noen år. Bjarne anbefaler en advokat med bedre kaffe enn ham.";
  if (aar < 10)
    return "Dette lukter alvor. Bjarne sukker og noterer besøkstidene.";
  return "Livstid light. Bjarne sender kaffe i pakke, men besøker deg ikke.";
}

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) return trimmed;
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) return match[0];
  throw new Error("Bjarne svarte ikke med JSON.");
}
