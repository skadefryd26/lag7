import type { ChatResponse, ChatTurn } from "./types";

export async function chatMedAgent(
  historikk: ChatTurn[],
  melding: string,
  forrigeBelop: number | undefined,
): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ historikk, melding, forrigeBelop }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(
      body.error ?? `Agenten sukket og feilet (${res.status}).`,
    );
  }
  return (await res.json()) as ChatResponse;
}
