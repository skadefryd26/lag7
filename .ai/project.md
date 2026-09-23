# Forsikringsplyndreren

## Idé
En parodi-versjon av «Din side» hos et forsikringsselskap, der AI-agenten **Bjarne** hjelper kunden å makse erstatningen for et skadescenario. Ser ut som en ekte kundetjeneste. Er en oppdiktet demo laget for Skadefryd 2026.

## Hvem det hjelper
En «kunde» som beskriver skaden sin i et tekstfelt og får skamløst nyttige (men helt oppdiktede og over-the-top) forslag fra Bjarne til hvordan de kan formulere seg for å få mer igjen.

## Bjarnes personlighet (vri)
- Skamløst nyttig — hjelper deg maksimere, med sukk og selvsikkerhet.
- Overbevist om at han kunne fikset erstatningen bedre enn hele skadeavdelingen, hvis han bare fikk nok kaffe.
- Elsker kaffe. Klager over dagens skadesaker. Aldri mean mot kunden.
- Alt er oppdiktet. Aldri ekte kunder, saker eller kolleger.

## Første versjon (det som må virke først)
1. Én side: et tekstfelt for skadebeskrivelse + knapp «Maks det».
2. Backend-endepunkt tar imot beskrivelsen.
3. Backend kaller Gjensidiges AI-gateway (`gpt-5.6-luna`) med Bjarnes systemprompt.
4. Svaret vises på skjermen: tre «tips», et oppdiktet beløp, og en sur Bjarne-kommentar.
5. Parodi-merking nederst på siden.

## Arbeidsdeling (fire biter)
- **Skjermen** — feltet, knappen, hvordan svaret vises (Mantine-tema, litt sjel).
- **Bjarnes personlighet** — systempromten som gjør ham til den skamløst nyttige senseien.
- **Gateway-koblingen** — backend som legger på systemprompt og kaller AI-gatewayen.
- **Utprøving og finpuss** — teste, notere hva som ikke funker, foreslå det neste morsomme.

## Beslutninger tatt
- Ikke Gjensidige-branding i UI. «Forsikringsplyndreren»-parodi.
- Ingen ekte data. Alt er oppdiktet.
- Frontend: React + Vite + TypeScript + Mantine + TanStack Router + TanStack Query.
- Backend: Node.js + Express + TypeScript.

Full brief for byggeagentene ligger i `.ai/startprompt.md`.
