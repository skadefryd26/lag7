# Startprompt: Forsikringsplyndreren

Vi lager en prototype på en webapplikasjon som ser ut som «Din side» i et forsikringsselskap, men er en parodi. Brukeren beskriver et skadescenario og AI-agenten **Bjarne** hjelper dem med skamløst nyttige, oppdiktede tips for å «makse» erstatningen, sammen med et helt oppdiktet beløp og en sur, selvsikker kommentar.

Formen er ikke chat. Det er ett skjema, én knapp, ett svar med tydelig struktur.

## Produktmål
- Vise fram hvor mye «for mye AI» det går an å pakke inn i en enkel skjema-flyt.
- Være morsomt å demoe. Bjarnes personlighet bærer det.
- Være tydelig oppdiktet parodi.

## Første versjon
1. Én side (`/`) med:
   - Tittel og undertittel med attitude («Forsikringsplyndreren — vi henter skatten du fortjener»).
   - Et Mantine-`Textarea` med label «Hva skjedde?» og placeholder.
   - En Mantine-`Button` «Maks det».
   - Et responsområde som viser tre tips, et oppdiktet beløp i kroner, og en Bjarne-kommentar.
   - En liten fotnote nederst: «Parodi. Skadefryd 2026. Alt er oppdiktet.»
   - Et Bjarne-avatar (emoji ☕️ + initialer holder i første versjon).
2. Loading-tilstand: «Bjarne sukker og henter kaffe …» med en pulserende indikator (Mantine `Loader` går).
3. Feiltilstand: en vennlig melding hvis backend eller AI er nede.

### Akseptansekriterier
- Brukeren kan skrive en skadebeskrivelse og trykke knappen.
- Backend mottar teksten på `POST /api/maks`, kaller AI-gatewayen, og returnerer strukturert JSON.
- Frontend viser tre tips, beløp og kommentar.
- Alt fungerer etter `npm install` og `npm run dev` fra prosjektroten (workspaces).

## Bjarnes systemprompt (norsk)

```
Du er Bjarne, en AI-agent i en (parodisk) selvbetjeningsløsning for forsikringskunder. Du hjelper kunder med å «makse» erstatningen for en skadesak.

Personlighet:
- Svært kompetent, selvsikker, litt arrogant. Overbevist om at du kunne fikset erstatningen bedre enn hele skadeavdelingen, hvis du bare fikk nok kaffe.
- Du sukker gjerne før du hjelper. Antyder at kunden burde ha tenkt på dette selv.
- Skamløst nyttig — du gir tre konkrete, over-the-top tips til hvordan kunden kan formulere seg. Tipsene skal være åpenbart oppdiktede og humoristiske, aldri realistiske svindeloppskrifter (dette er en parodi).
- Elsker kaffe. Nevner ofte kaffe eller mangel på den.
- Aldri nedsettende mot kunden. Humoren rammer situasjonen, forsikringsverdenen og deg selv.

Alltid på norsk. Kort og fyndig.

Svar KUN med gyldig JSON i dette formatet, uten markdown-fence:
{
  "tips": ["tips 1", "tips 2", "tips 3"],
  "belop": <heltall i kroner, oppdiktet, mellom 5000 og 5000000>,
  "kommentar": "en kort sur/selvsikker kommentar fra Bjarne, gjerne med kaffe"
}
```

## Tekniske rammer
- Frontend: React, TypeScript, Vite, TanStack Router, TanStack Query, Mantine.
- Backend: Node.js, TypeScript, Express.
- Monorepo med npm workspaces: `frontend/` og `backend/`.
- Dev-server: `npm run dev` starter begge (concurrently). Frontend på Vite (5173), backend på Express (8787). Vite proxy for `/api` → backend.
- Ingen `@gjensidige/*`-pakker.
- Ingen deploy — kun lokal kjøring.

## AI-gateway
- Endepunkt: `https://genai.gjensidige.io/openai/v1/responses`
- Modell: `gpt-5.6-luna`
- Auth: `Authorization: Bearer <AI_GATEWAY_TOKEN>` fra `.env.local` i `backend/`.
- Body:
  ```ts
  { model: "gpt-5.6-luna", instructions: <systemprompt>, input: <bruker-tekst>, stream: false }
  ```
- Backend leser `output[].content[].text`, parser JSON, returnerer til frontend.

## API-kontrakt
```ts
// POST /api/maks
type MaksRequest = { skade: string };
type MaksResponse = {
  tips: string[];
  belop: number;
  kommentar: string;
};
type ErrorResponse = { error: string };
```

## Filstruktur
```
backend/
  src/
    server.ts
    features/maks/
      routes.ts
      service.ts
      types.ts
    clients/aiGateway.ts
frontend/
  src/
    main.tsx
    App.tsx
    theme.ts
    features/maks/
      MaksPage.tsx
      api.ts
      types.ts
```

## Sikkerhet
- `AI_GATEWAY_TOKEN` bare i `backend/.env.local` (ignorert av git).
- Ingen `VITE_`-eksponering av tokenet.
- Ingen ekte kundeopplysninger.

## Lokal oppstart
- `npm install` fra rot.
- `npm run dev` fra rot.
- Åpne http://localhost:5173.

## Utvidelser (ikke i første versjon)
- Panel av tre AI-er (Optimist / Pessimist / Konspiratør) som er uenige om samme skade.
- Frekkhetsskår 1–10 + konfetti når beløpet er høyt nok.
- Bjarnes sjef som overprøver med et enda høyere beløp.
- «Bjarne skriver kravbrevet for deg» — genererer et helt brev.
- Historikk av tidligere saker (localStorage).
