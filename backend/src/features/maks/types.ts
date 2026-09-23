export type MaksRequest = { skade: string };

export type MaksResponse = {
  tips: string[];
  belop: number;
  kommentar: string;
  svikSannsynlighet: number;
  svikBegrunnelse: string;
  fengselAar: number;
  fengselKommentar: string;
};

export type ErrorResponse = { error: string };
