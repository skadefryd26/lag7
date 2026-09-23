import type { MaksResponse } from "./types";

export async function maksErstatning(skade: string): Promise<MaksResponse> {
  const res = await fetch("/api/maks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skade }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Bjarne sukket og feilet (${res.status}).`);
  }
  return (await res.json()) as MaksResponse;
}
