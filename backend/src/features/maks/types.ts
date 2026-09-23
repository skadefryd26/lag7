export type MaksRequest = { skade: string };

export type MaksResponse = {
  tips: string[];
  belop: number;
  kommentar: string;
};

export type ErrorResponse = { error: string };
