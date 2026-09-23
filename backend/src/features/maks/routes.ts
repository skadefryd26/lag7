import { Router } from "express";
import { maksErstatning } from "./service.js";
import type { MaksRequest } from "./types.js";

export const maksRouter = Router();

maksRouter.post("/", async (req, res) => {
  const body = req.body as Partial<MaksRequest>;
  const skade = (body?.skade ?? "").toString().trim();
  if (!skade) {
    return res.status(400).json({ error: "Skriv noe om skaden først." });
  }
  try {
    const result = await maksErstatning(skade);
    res.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Ukjent feil hos Bjarne.";
    console.error("[maks] feil:", message);
    res.status(500).json({ error: message });
  }
});
