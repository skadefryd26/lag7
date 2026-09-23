import type { SkisseResponse } from "./types";

export async function tegnSkisse(skade: string): Promise<SkisseResponse> {
  const res = await fetch("/api/skisse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skade }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Bjarne mistet blyanten (${res.status}).`);
  }
  return (await res.json()) as SkisseResponse;
}
