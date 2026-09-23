import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  MantineProvider,
  ScrollArea,
  type MantineColorsTuple,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { chatMedBjarne } from "./api";
import type { ChatResponse, ChatTurn, Valg } from "./types";
import { BelopGraf } from "./BelopGraf";
import { PengeRegn } from "./PengeRegn";
import { LuguberLoader } from "./LuguberLoader";
import { Skadeskisse } from "../skisse/Skadeskisse";

const kr = new Intl.NumberFormat("no-NO", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

// Luguber fargepalett — mørk, bleik og litt blodig. Brukes bare på denne siden.
const blood: MantineColorsTuple = [
  "#f4dfe0",
  "#e3b4b7",
  "#d18a8e",
  "#bd6165",
  "#a53a3f",
  "#8a262c",
  "#701b21",
  "#570f14",
  "#3c070b",
  "#220204",
];

// Et "drastisk" hopp: over 40 000 kr eller mer enn 25 % opp.
function erStortHopp(delta: number, forrige: number): boolean {
  if (delta <= 0) return false;
  return delta >= 40000 || (forrige > 0 && delta / forrige >= 0.25);
}

type KvitteringData = {
  saksnummer: string;
  belop: number;
  kommentar: string;
};

const KVITTERINGSKOMMENTARER = [
  "Sendt. Jeg har satt den øverst i bunken. Ikke fortell skadeavdelingen at det var meg.",
  "Sendt. Saksbehandleren som får denne kommer til å trenge kaffe. Mye kaffe.",
  "Sendt. Jeg brukte fire sekunder. Avdelingen ville brukt fire uker.",
  "Sendt. Hvis noen spør, var det du som skrev den.",
];

function lagKvittering(belop: number): KvitteringData {
  const nummer = Math.floor(100000 + Math.random() * 900000);
  return {
    saksnummer: `SKD-2026-${nummer}`,
    belop,
    kommentar:
      KVITTERINGSKOMMENTARER[
        Math.floor(Math.random() * KVITTERINGSKOMMENTARER.length)
      ],
  };
}

function Kvittering({ kvittering }: { kvittering: KvitteringData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <Box
        mt="md"
        style={{
          borderRadius: 14,
          padding: "12px 14px",
          background: "#241419",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Group justify="space-between" align="baseline" mb={4}>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase">
            Saksnummer
          </Text>
          <Text size="sm" fw={700} className="tabular">
            {kvittering.saksnummer}
          </Text>
        </Group>
        <Group justify="space-between" align="baseline">
          <Text size="xs" fw={700} c="dimmed" tt="uppercase">
            Krav sendt inn
          </Text>
          <Text size="sm" fw={700} className="tabular" style={{ color: "#e2555f" }}>
            {kr.format(kvittering.belop)}
          </Text>
        </Group>
        <Text size="sm" fs="italic" c="dimmed" mt={10}>
          “{kvittering.kommentar}”
        </Text>
      </Box>
    </motion.div>
  );
}

export function ChatPage() {
  const [historikk, setHistorikk] = useState<ChatTurn[]>([]);
  const [melding, setMelding] = useState("");
  const [hero, setHero] = useState("");
  const [belop, setBelop] = useState(0);
  const [belopHistorikk, setBelopHistorikk] = useState<number[]>([]);
  const [kommentar, setKommentar] = useState("");
  const [svik, setSvik] = useState<number | null>(null);
  const [svikBegrunnelse, setSvikBegrunnelse] = useState("");
  const [fengselAar, setFengselAar] = useState<number | null>(null);
  const [fengselKommentar, setFengselKommentar] = useState("");
  const [regn, setRegn] = useState(false);
  const [sisteInnsendt, setSisteInnsendt] = useState("");
  const [kvittering, setKvittering] = useState<KvitteringData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation<ChatResponse, Error, string>({
    mutationFn: (m) => chatMedBjarne(historikk, m, belop || undefined),
    onSuccess: (data, m) => {
      setHistorikk((h) => [
        ...h,
        { role: "kunde", text: m },
        { role: "bjarne", text: data.svar, tips: data.tips, valg: data.valg },
      ]);
      setHero(data.heroforklaring);
      setKommentar(data.kommentar);
      setSvik(data.svikSannsynlighet);
      setSvikBegrunnelse(data.svikBegrunnelse);
      setFengselAar(data.fengselAar);
      setFengselKommentar(data.fengselKommentar);
      setKvittering(null);

      const forrige = belop;
      setBelop(data.belop);
      setBelopHistorikk((b) => [...b, data.belop]);

      if (erStortHopp(data.delta, forrige)) {
        setRegn(true);
        window.setTimeout(() => setRegn(false), 2600);
      }
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [historikk, mutation.isPending]);

  const sisteDelta =
    belopHistorikk.length >= 2
      ? belopHistorikk[belopHistorikk.length - 1] -
        belopHistorikk[belopHistorikk.length - 2]
      : 0;

  function send() {
    const m = melding.trim();
    if (!m || mutation.isPending) return;
    setSisteInnsendt(m);
    setMelding("");
    mutation.mutate(m);
  }

  return (
    <MantineProvider
      forceColorScheme="dark"
      theme={{ colors: { blood }, primaryColor: "blood", primaryShade: 6 }}
    >
      <Box
        className="luguber-side"
        style={{
          position: "relative",
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 20% -10%, #2a0d12 0%, #0b0608 55%, #050406 100%)",
        }}
      >
        <PengeRegn aktiv={regn} />
        <Container size="lg" py={40}>
          <Group gap="md" align="center" mb={28}>
            <Avatar
              radius="xl"
              size={52}
              color="blood"
              style={{ fontSize: 24 }}
            >
              💀
            </Avatar>
            <div>
              <Title
                order={1}
                style={{ fontSize: 34, lineHeight: 1.05, color: "#e7d9d6" }}
              >
                Bjarne Maks — chat
              </Title>
              <Text c="dimmed" size="sm" mt={2}>
                Fortell hva som skjedde. Bjarne makser mens du snakker.
              </Text>
            </div>
          </Group>

        <Grid gutter="lg" align="stretch">
          {/* VENSTRE: chatten */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Card
              withBorder
              radius={20}
              p="lg"
              style={{
                background: "#140d10",
                boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
                borderColor: "rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                height: 560,
              }}
            >
              <ScrollArea style={{ flex: 1 }} viewportRef={scrollRef}>
                <Stack gap="sm" pr="sm">
                  {historikk.length === 0 && !mutation.isPending && (
                    <Text c="dimmed" size="sm" fs="italic" py="md">
                      Bjarne: «Ja ja. Fortell hva som skjedde, så skal jeg se hva
                      jeg kan gjøre. Etter kaffen.»
                    </Text>
                  )}
                  {historikk.map((t, i) => (
                    <Boble
                      key={i}
                      turn={t}
                      visValg={i === historikk.length - 1 && !mutation.isPending}
                      onVelg={(valg) => {
                        setSisteInnsendt(valg.tekst);
                        mutation.mutate(valg.tekst);
                      }}
                    />
                  ))}
                  {mutation.isPending && (
                    <LuguberLoader sisteMelding={sisteInnsendt} />
                  )}
                  {mutation.isError && (
                    <Text c="red" size="sm">
                      {mutation.error.message}
                    </Text>
                  )}
                </Stack>
              </ScrollArea>

              <Group gap="sm" mt="md" align="flex-end" className="chat-luguber-inputrow">
                <Textarea
                  style={{ flex: 1 }}
                  placeholder="Skriv til Bjarne …"
                  autosize
                  minRows={1}
                  maxRows={4}
                  value={melding}
                  onChange={(e) => setMelding(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  radius={12}
                />
                <Button
                  color="blood"
                  radius={12}
                  loading={mutation.isPending}
                  disabled={melding.trim().length === 0}
                  onClick={send}
                  className="bjarne-button"
                >
                  Send
                </Button>
              </Group>
            </Card>
          </Grid.Col>

          {/* HØYRE: heroforklaring + beløp + graf */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="lg">
              <Card
                withBorder
                radius={20}
                p="lg"
                style={{
                  background:
                    "linear-gradient(180deg, #150e12 0%, #0d0709 100%)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={6}>
                  Beskrivelse til skademelding
                </Text>
                <Text
                  style={{ lineHeight: 1.55, minHeight: 60 }}
                  size="sm"
                >
                  {hero || (
                    <Text component="span" c="dimmed" fs="italic">
                      Bjarne bygger den perfekte skadeforklaringen her mens dere
                      chatter.
                    </Text>
                  )}
                </Text>

                <Skadeskisse beskrivelse={hero} />

                {kvittering ? (
                  <Kvittering kvittering={kvittering} />
                ) : (
                  <Button
                    fullWidth
                    mt="md"
                    color="blood"
                    radius={12}
                    className="bjarne-button"
                    disabled={!hero}
                    onClick={() => setKvittering(lagKvittering(belop))}
                  >
                    Send inn skademelding
                  </Button>
                )}
              </Card>

              <Card
                withBorder
                radius={20}
                p="lg"
                style={{
                  background: "#140d10",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <Group justify="space-between" align="baseline" mb={4}>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                    Du kan få
                  </Text>
                  <AnimatePresence>
                    {sisteDelta !== 0 && (
                      <motion.div
                        key={belopHistorikk.length}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Text
                          size="sm"
                          fw={700}
                          c={sisteDelta > 0 ? "green" : "red"}
                        >
                          {sisteDelta > 0 ? "▲ +" : "▼ "}
                          {kr.format(Math.abs(sisteDelta))}
                        </Text>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Group>

                <motion.div
                  key={belop}
                  initial={{ scale: 0.96 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Text
                    className="tabular"
                    style={{
                      fontSize: 40,
                      fontWeight: 800,
                      lineHeight: 1.1,
                      color: "#e2555f",
                      textShadow: "0 0 16px rgba(226,85,95,0.35)",
                    }}
                  >
                    {kr.format(belop)}
                  </Text>
                </motion.div>

                <Box mt="md">
                  <BelopGraf verdier={belopHistorikk} />
                </Box>

                {kommentar && (
                  <Text fs="italic" size="sm" c="dimmed" mt="sm">
                    “{kommentar}”
                  </Text>
                )}
              </Card>

              {svik !== null && (
                <SvikMeter score={svik} begrunnelse={svikBegrunnelse} />
              )}

              {fengselAar !== null && (
                <FengselMeter aar={fengselAar} kommentar={fengselKommentar} />
              )}
            </Stack>
          </Grid.Col>
        </Grid>

        <Text ta="center" c="dimmed" size="xs" mt={32}>
          Parodi. Skadefryd 2026. Alt er oppdiktet — ingen ekte kunder, saker
          eller kaffekopper er skadet.
        </Text>
        </Container>
      </Box>
    </MantineProvider>
  );
}

function svikNiva(score: number): { label: string; color: string; emoji: string } {
  if (score <= 20) return { label: "Trygg havn", color: "#5aa06a", emoji: "🏴‍☠️" };
  if (score <= 50) return { label: "Løftet øyenbryn", color: "#d3a15a", emoji: "🧐" };
  if (score <= 80) return { label: "Telefonen ringer", color: "#d8663f", emoji: "☎️" };
  return { label: "Politianmeldt før frokost", color: "#e2555f", emoji: "🚔" };
}

function MeterKort({ children }: { children: React.ReactNode }) {
  return (
    <Card
      withBorder
      radius={20}
      p="lg"
      style={{
        background: "#140d10",
        boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {children}
    </Card>
  );
}

function SvikMeter({ score, begrunnelse }: { score: number; begrunnelse: string }) {
  const niva = svikNiva(score);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <MeterKort>
        <Group justify="space-between" align="center" mb={10}>
          <Group gap={8}>
            <Text style={{ fontSize: 20 }}>{niva.emoji}</Text>
            <div>
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
                Sannsynlighet for å bli tatt
              </Text>
              <Text fw={700} style={{ color: niva.color }}>
                {niva.label}
              </Text>
            </div>
          </Group>
          <Text
            fw={800}
            className="tabular"
            style={{ fontSize: 28, color: niva.color, lineHeight: 1 }}
          >
            {score}
            <Text component="span" fw={600} size="sm" c="dimmed" ml={2}>
              /100
            </Text>
          </Text>
        </Group>
        <Box
          style={{
            position: "relative",
            height: 10,
            borderRadius: 999,
            background: "#2a1418",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg, #5aa06a 0%, #d3a15a 45%, #d8663f 75%, #e2555f 100%)",
            }}
          />
        </Box>
        {begrunnelse && (
          <Text size="sm" c="dimmed" mt={10} fs="italic">
            {begrunnelse}
          </Text>
        )}
      </MeterKort>
    </motion.div>
  );
}

function fengselNiva(aar: number): { label: string; color: string; emoji: string } {
  if (aar < 0.5) return { label: "Fri som fuglen", color: "#5aa06a", emoji: "🕊️" };
  if (aar < 2) return { label: "Bot og bedring", color: "#d3a15a", emoji: "💸" };
  if (aar < 5) return { label: "Noen år på skyggesiden", color: "#d8663f", emoji: "⛓️" };
  if (aar < 10) return { label: "Lang dom", color: "#e2555f", emoji: "🚔" };
  return { label: "Livstid light", color: "#f06d76", emoji: "🔒" };
}

const FENGSEL_MAKS = 15;

function FengselMeter({ aar, kommentar }: { aar: number; kommentar: string }) {
  const niva = fengselNiva(aar);
  const prosent = Math.min(100, (aar / FENGSEL_MAKS) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <MeterKort>
        <Group justify="space-between" align="center" mb={10}>
          <Group gap={8}>
            <Text style={{ fontSize: 20 }}>{niva.emoji}</Text>
            <div>
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
                Antatt straff (beløp × svik)
              </Text>
              <Text fw={700} style={{ color: niva.color }}>
                {niva.label}
              </Text>
            </div>
          </Group>
          <Text
            fw={800}
            className="tabular"
            style={{ fontSize: 28, color: niva.color, lineHeight: 1 }}
          >
            {aar.toLocaleString("no-NO")}
            <Text component="span" fw={600} size="sm" c="dimmed" ml={4}>
              år
            </Text>
          </Text>
        </Group>
        <Box
          style={{
            position: "relative",
            height: 10,
            borderRadius: 999,
            background: "#2a1418",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prosent}%` }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg, #5aa06a 0%, #d3a15a 40%, #d8663f 70%, #f06d76 100%)",
            }}
          />
        </Box>
        {kommentar && (
          <Text size="sm" c="dimmed" mt={10} fs="italic">
            {kommentar}
          </Text>
        )}
      </MeterKort>
    </motion.div>
  );
}

function Boble({
  turn,
  visValg,
  onVelg,
}: {
  turn: ChatTurn;
  visValg: boolean;
  onVelg: (valg: Valg) => void;
}) {
  const kunde = turn.role === "kunde";
  const valgListe = visValg ? (turn.valg ?? []) : [];
  const harValg = valgListe.length > 0;
  if (!kunde && !harValg) return null;

  return (
    <Group justify={kunde ? "flex-end" : "flex-start"} gap={6}>
      <Box
        style={{
          maxWidth: "80%",
          padding: "10px 14px",
          borderRadius: 14,
          background: kunde ? "#4a141a" : "#1c1418",
          color: kunde ? "#f3e4e2" : "#d9cdd0",
          border: kunde ? "none" : "1px solid rgba(255,255,255,0.08)",
          lineHeight: 1.5,
          fontSize: 14,
        }}
      >
        {!kunde && (
          <Text size="xs" fw={700} c="#c96b6f" mb={6}>
            Bjarne
          </Text>
        )}
        {kunde && turn.text}

        {harValg && (
          <Stack gap={6}>
            <Text size="xs" fw={700} c="#c96b6f">
              Velg hva du vil legge til
            </Text>
            {valgListe.map((valg, i) => (
              <Button
                key={i}
                variant="default"
                radius={10}
                size="xs"
                justify="space-between"
                onClick={() => onVelg(valg)}
                rightSection={
                  <Text
                    size="xs"
                    fw={700}
                    c={valg.belop >= 0 ? "green" : "red"}
                  >
                    {valg.belop >= 0 ? "+" : "−"}
                    {kr.format(Math.abs(valg.belop))}
                  </Text>
                }
                styles={{
                  root: { height: "auto", padding: "8px 10px" },
                  label: { whiteSpace: "normal", textAlign: "left" },
                  inner: { justifyContent: "space-between", gap: 10 },
                }}
              >
                {valg.tittel}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
    </Group>
  );
}
