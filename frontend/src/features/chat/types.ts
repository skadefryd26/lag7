export type ChatTurn = {
  role: "kunde" | "bjarne";
  text: string;
  tips?: string[];
};

export type ChatResponse = {
  svar: string;
  tips: string[];
  heroforklaring: string;
  belop: number;
  delta: number;
  kommentar: string;
};
