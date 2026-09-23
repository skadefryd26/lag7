import { Router } from "express";
import { chatMedBjarne } from "./service.js";
import type { ChatRequest, ChatTurn } from "./types.js";

export const chatRouter = Router();

chatRouter.post("/", async (req, res) => {
  const body = req.body as Partial<ChatRequest>;
  const melding = (body?.melding ?? "").toString().trim();
  if (!melding) {
    return res.status(400).json({ error: "Skriv noe til Bjarne først." });
  }

  const historikk: ChatTurn[] = Array.isArray(body?.historikk)
    ? body!.historikk!.filter(
        (t): t is ChatTurn =>
          !!t &&
          (t.role === "kunde" || t.role === "bjarne") &&
          typeof t.text === "string",
      )
    : [];

  const forrigeBelop =
    typeof body?.forrigeBelop === "number" ? body!.forrigeBelop : undefined;

  try {
    const result = await chatMedBjarne({ historikk, melding, forrigeBelop });
    res.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Ukjent feil hos Bjarne.";
    console.error("[chat] feil:", message);
    res.status(500).json({ error: message });
  }
});
