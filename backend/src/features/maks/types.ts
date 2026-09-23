export type MaksRequest = { skade: string };

export type MaksResponse = {
  tips: string[];
  belop: number;
  kommentar: string;
  svikSannsynlighet: number;
  svikBegrunnelse: string;
};

export type ErrorResponse = { error: string };
