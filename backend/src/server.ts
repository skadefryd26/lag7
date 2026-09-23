import dotenv from "dotenv";
// .env.local ligger i prosjektroten, men backend startes fra backend/.
// Vi leter derfor begge steder.
dotenv.config({ path: ".env.local" });
dotenv.config({ path: "../.env.local" });
dotenv.config();
import express from "express";
import { maksRouter } from "./features/maks/routes.js";
import { skisseRouter } from "./features/skisse/routes.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/maks", maksRouter);
app.use("/api/skisse", skisseRouter);

const port = Number(process.env.PORT ?? 8787);
app.listen(port, () => {
  console.log(`Bjarne Maks backend kjører på http://localhost:${port}`);
});
