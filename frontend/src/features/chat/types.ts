export type Valg = {
  tittel: string;
  tekst: string;
  belop: number;
};

export type ChatTurn = {
  role: "kunde" | "agent";
  text: string;
  tips?: string[];
  valg?: Valg[];
};

export type ChatResponse = {
  svar: string;
  tips: string[];
  heroforklaring: string;
  belop: number;
  delta: number;
  kommentar: string;
  svikSannsynlighet: number;
  svikBegrunnelse: string;
  fengselAar: number;
  fengselKommentar: string;
  valg: Valg[];
};
