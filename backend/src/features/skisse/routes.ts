import { Router } from "express";
import { tegnSkadeskisse } from "./service.js";
import type { SkisseRequest } from "./types.js";

export const skisseRouter = Router();

skisseRouter.post("/", async (req, res) => {
  const body = req.body as Partial<SkisseRequest>;
  const skade = (body?.skade ?? "").toString().trim();
  if (!skade) {
    return res
      .status(400)
      .json({ error: "Beskriv skaden først, så kanskje jeg gidder å tegne den." });
  }
  try {
    const result = await tegnSkadeskisse(skade);
    res.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Ukjent krusedull fra Bjarne.";
    console.error("[skisse] feil:", message);
    res.status(500).json({ error: message });
  }
});
