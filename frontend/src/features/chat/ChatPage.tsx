import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { chatMedBjarne } from "./api";
import type { ChatResponse, ChatTurn } from "./types";
import { BelopGraf } from "./BelopGraf";
import { PengeRegn } from "./PengeRegn";

const kr = new Intl.NumberFormat("no-NO", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

// Et "drastisk" hopp: over 40 000 kr eller mer enn 25 % opp.
function erStortHopp(delta: number, forrige: number): boolean {
  if (delta <= 0) return false;
  return delta >= 40000 || (forrige > 0 && delta / forrige >= 0.25);
}

export function ChatPage() {
  const [historikk, setHistorikk] = useState<ChatTurn[]>([]);
  const [melding, setMelding] = useState("");
  const [hero, setHero] = useState("");
  const [belop, setBelop] = useState(0);
  const [belopHistorikk, setBelopHistorikk] = useState<number[]>([]);
  const [kommentar, setKommentar] = useState("");
  const [regn, setRegn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation<ChatResponse, Error, string>({
    mutationFn: (m) => chatMedBjarne(historikk, m, belop || undefined),
    onSuccess: (data, m) => {
      setHistorikk((h) => [
        ...h,
        { role: "kunde", text: m },
        { role: "bjarne", text: data.svar, tips: data.tips },
      ]);
      setHero(data.heroforklaring);
      setKommentar(data.kommentar);

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
    setMelding("");
    mutation.mutate(m);
  }

  return (
    <Box style={{ position: "relative", minHeight: "100vh" }}>
      <PengeRegn aktiv={regn} />
      <Container size="lg" py={40}>
        <Group gap="md" align="center" mb={28}>
          <Avatar radius="xl" size={52} color="coffee" style={{ fontSize: 24 }}>
            ☕
          </Avatar>
          <div>
            <Title order={1} style={{ fontSize: 34, lineHeight: 1.05 }}>
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
                background: "#fffdf8",
                boxShadow: "var(--shadow-md)",
                borderColor: "rgba(20,12,4,0.08)",
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
                    <Boble key={i} turn={t} />
                  ))}
                  {mutation.isPending && (
                    <Text c="dimmed" size="sm" fs="italic" className="bjarne-sighing">
                      Bjarne sukker og blar i vilkårene han fant på selv …
                    </Text>
                  )}
                  {mutation.isError && (
                    <Text c="red" size="sm">
                      {mutation.error.message}
                    </Text>
                  )}
                </Stack>
              </ScrollArea>

              <Group gap="sm" mt="md" align="flex-end">
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
                  color="coffee"
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
                    "linear-gradient(180deg, #fffdf8 0%, #faf3e8 100%)",
                  boxShadow: "var(--shadow-md)",
                  borderColor: "rgba(20,12,4,0.08)",
                }}
              >
                <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={6}>
                  Maks-forklaring
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
              </Card>

              <Card
                withBorder
                radius={20}
                p="lg"
                style={{
                  background: "#fffdf8",
                  boxShadow: "var(--shadow-md)",
                  borderColor: "rgba(20,12,4,0.08)",
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
                      color: "#5f3f18",
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
            </Stack>
          </Grid.Col>
        </Grid>

        <Text ta="center" c="dimmed" size="xs" mt={32}>
          Parodi. Skadefryd 2026. Alt er oppdiktet — ingen ekte kunder, saker
          eller kaffekopper er skadet.
        </Text>
      </Container>
    </Box>
  );
}

function Boble({ turn }: { turn: ChatTurn }) {
  const kunde = turn.role === "kunde";
  return (
    <Group justify={kunde ? "flex-end" : "flex-start"} gap={6}>
      <Box
        style={{
          maxWidth: "80%",
          padding: "10px 14px",
          borderRadius: 14,
          background: kunde ? "#845923" : "#faf5ec",
          color: kunde ? "#faf1e6" : "inherit",
          border: kunde ? "none" : "1px solid rgba(20,12,4,0.06)",
          lineHeight: 1.5,
          fontSize: 14,
        }}
      >
        {!kunde && (
          <Text size="xs" fw={700} c="#845923" mb={2}>
            Bjarne
          </Text>
        )}
        {turn.text}

        {!kunde && turn.tips && turn.tips.length > 0 && (
          <Box
            mt={10}
            p={10}
            style={{
              background: "#fffdf8",
              border: "1px dashed rgba(132,89,35,0.35)",
              borderRadius: 10,
            }}
          >
            <Text size="xs" fw={700} c="#845923" mb={6}>
              💡 Bjarnes maks-tips
            </Text>
            <Stack gap={4}>
              {turn.tips.map((tip, i) => (
                <Group key={i} gap={6} align="flex-start" wrap="nowrap">
                  <Text size="xs" fw={700} c="#845923" style={{ lineHeight: 1.5 }}>
                    {i + 1}.
                  </Text>
                  <Text size="xs" style={{ lineHeight: 1.5 }}>
                    {tip}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Group>
  );
}
