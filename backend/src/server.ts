import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prosjektRot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
dotenv.config({ path: path.join(prosjektRot, ".env.local") });
dotenv.config({ path: path.join(prosjektRot, ".env") });
dotenv.config({ path: ".env.local" });
dotenv.config();
import express from "express";
import { maksRouter } from "./features/maks/routes.js";
import { chatRouter } from "./features/chat/routes.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/maks", maksRouter);
app.use("/api/chat", chatRouter);

const port = Number(process.env.PORT ?? 8787);
app.listen(port, () => {
  console.log(`Bjarne Maks backend kjører på http://localhost:${port}`);
});
