export type ChatTurn = {
  role: "kunde" | "agent";
  text: string;
};

export type ChatRequest = {
  historikk: ChatTurn[];
  melding: string;
  forrigeBelop?: number;
};

export type Valg = {
  // Kort overskrift på alternativet, f.eks. "Sjokkskadet katt"
  tittel: string;
  // Setningen som legges til skadeforklaringen hvis kunden velger dette
  tekst: string;
  // Hva dette alternativet er verdt i kroner (kan være negativt)
  belop: number;
};

export type ChatResponse = {
  // Agentens svar i chatten
  svar: string;
  // Konkrete tips/forslag for å makse utbetalingen
  tips: string[];
  // Den beste versjonen av skadeforklaringen så langt (gir maks uttelling)
  heroforklaring: string;
  // Beløpet kunden har "makset" seg til
  belop: number;
  // Endring fra forrige beløp (positiv = opp, negativ = ned)
  delta: number;
  // Kort sur/selvsikker kommentar fra agenten
  kommentar: string;
  // Sannsynlighet (0-100) for at kunden blir tatt for svik
  svikSannsynlighet: number;
  // Kort begrunnelse for svik-sannsynligheten
  svikBegrunnelse: string;
  // Antatt straff i år, utledet av beløp × svik-sannsynlighet
  fengselAar: number;
  // Agentens kommentar til straffen
  fengselKommentar: string;
  // Alternativer kunden kan klikke på for å forme skademeldingen videre
  valg: Valg[];
};

export type ErrorResponse = { error: string };
