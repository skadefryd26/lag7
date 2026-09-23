export type ChatTurn = {
  role: "kunde" | "bjarne";
  text: string;
};

export type ChatRequest = {
  historikk: ChatTurn[];
  melding: string;
  forrigeBelop?: number;
};

export type ChatResponse = {
  // Bjarnes svar i chatten
  svar: string;
  // Konkrete tips/forslag for å makse utbetalingen
  tips: string[];
  // Den beste versjonen av skadeforklaringen så langt (gir maks uttelling)
  heroforklaring: string;
  // Beløpet kunden har "makset" seg til
  belop: number;
  // Endring fra forrige beløp (positiv = opp, negativ = ned)
  delta: number;
  // Kort sur/selvsikker kommentar fra Bjarne
  kommentar: string;
};

export type ErrorResponse = { error: string };
