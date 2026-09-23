import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { maksErstatning } from "./api";
import type { MaksResponse } from "./types";

const kr = new Intl.NumberFormat("no-NO", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

const sigh = [
  "Bjarne sukker og henter kaffe …",
  "Bjarne blar i vilkårene han fant på selv …",
  "Bjarne mumler noe om skadeavdelingens nivå …",
  "Bjarne regner i hodet. Det holder.",
];

export function MaksPage() {
  const [skade, setSkade] = useState("");
  const [sighIndex, setSighIndex] = useState(0);

  const mutation = useMutation<MaksResponse, Error, string>({
    mutationFn: async (s) => {
      const id = window.setInterval(
        () => setSighIndex((i) => (i + 1) % sigh.length),
        1400,
      );
      try {
        return await maksErstatning(s);
      } finally {
        window.clearInterval(id);
      }
    },
  });

  return (
    <Container size="sm" py={64}>
      <Stack gap={40}>
        <Stack gap={4}>
          <Group gap="md" align="center">
            <Avatar
              radius="xl"
              size={56}
              color="coffee"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.3), 0 6px 16px rgba(20,12,4,0.15)",
                fontSize: 26,
              }}
            >
              ☕
            </Avatar>
            <div>
              <Title order={1} style={{ fontSize: 40, lineHeight: 1.05 }}>
                Forsikringsplyndreren
              </Title>
              <Text c="dimmed" size="sm" mt={4}>
                Vi henter skatten du fortjener.
              </Text>
            </div>
          </Group>
        </Stack>

        <Card
          withBorder
          radius={20}
          p="xl"
          style={{
            boxShadow: "var(--shadow-md)",
            borderColor: "rgba(20,12,4,0.08)",
            background: "#fffdf8",
          }}
        >
          <Stack gap="lg">
            <Textarea
              label="Hva skjedde?"
              placeholder="Fortell Bjarne om skaden. Han sukker, men han hjelper."
              autosize
              minRows={5}
              maxRows={12}
              value={skade}
              onChange={(e) => setSkade(e.currentTarget.value)}
              disabled={mutation.isPending}
              radius={12}
              styles={{
                input: {
                  fontSize: 15,
                  lineHeight: 1.55,
                  padding: 14,
                },
                label: {
                  fontWeight: 600,
                  marginBottom: 6,
                },
              }}
            />
            <Group justify="space-between" align="center">
              <Text size="xs" c="dimmed">
                {skade.trim().length} tegn — Bjarne foretrekker konkret.
              </Text>
              <Button
                size="md"
                color="coffee"
                loading={mutation.isPending}
                disabled={skade.trim().length === 0}
                onClick={() => mutation.mutate(skade.trim())}
                className="bjarne-button"
                radius={12}
                px={28}
                style={{ fontWeight: 600, letterSpacing: 0.2 }}
              >
                Maks det
              </Button>
            </Group>
          </Stack>
        </Card>

        <AnimatePresence mode="wait">
          {mutation.isPending && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <Group gap="sm" justify="center">
                <Text fs="italic" c="dimmed" className="bjarne-sighing">
                  {sigh[sighIndex]}
                </Text>
              </Group>
            </motion.div>
          )}

          {mutation.isError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <Alert color="red" title="Bjarne er sur" radius={14}>
                {mutation.error.message}
              </Alert>
            </motion.div>
          )}

          {mutation.isSuccess && (
            <motion.div
              key="ok"
              initial={{ opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <BjarneSvar data={mutation.data} />
            </motion.div>
          )}
        </AnimatePresence>

        <Text ta="center" c="dimmed" size="xs" mt="lg">
          Parodi. Skadefryd 2026. Alt er oppdiktet — ingen ekte kunder, saker
          eller kaffekopper er skadet.
        </Text>
      </Stack>
    </Container>
  );
}

function BjarneSvar({ data }: { data: MaksResponse }) {
  return (
    <Card
      withBorder
      radius={20}
      p="xl"
      style={{
        boxShadow: "var(--shadow-lg)",
        borderColor: "rgba(20,12,4,0.08)",
        background: "#fffdf8",
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <Avatar
              radius="xl"
              color="coffee"
              size={40}
              style={{ fontWeight: 700 }}
            >
              B
            </Avatar>
            <Text fw={700} size="lg">
              Bjarne foreslår
            </Text>
          </Group>
          <Box
            className="tabular"
            style={{
              background:
                "linear-gradient(180deg, #845923 0%, #5f3f18 100%)",
              color: "#faf1e6",
              padding: "8px 16px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 18,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(20,12,4,0.2)",
            }}
          >
            {kr.format(data.belop)}
          </Box>
        </Group>

        <Stack gap={10}>
          {data.tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.24,
                delay: 0.06 + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr",
                  gap: 10,
                  padding: 14,
                  borderRadius: 14,
                  background: "#faf5ec",
                  border: "1px solid rgba(20,12,4,0.06)",
                }}
              >
                <Text
                  fw={700}
                  className="tabular"
                  style={{ color: "#845923" }}
                >
                  {i + 1}.
                </Text>
                <Text style={{ lineHeight: 1.55 }}>{tip}</Text>
              </Box>
            </motion.div>
          ))}
        </Stack>

        <SvikMeter
          score={data.svikSannsynlighet}
          begrunnelse={data.svikBegrunnelse}
        />

        <FengselMeter
          aar={data.fengselAar}
          kommentar={data.fengselKommentar}
        />

        <Card
          radius={14}
          p="md"
          style={{
            background: "#efdcc4",
            border: "1px solid rgba(20,12,4,0.06)",
          }}
        >
          <Text fs="italic" style={{ lineHeight: 1.5 }}>
            “{data.kommentar}”
          </Text>
        </Card>
      </Stack>
    </Card>
  );
}

function svikNiva(score: number): {
  label: string;
  color: string;
  emoji: string;
} {
  if (score <= 20)
    return { label: "Trygg havn", color: "#4a7c59", emoji: "🏴‍☠️" };
  if (score <= 50)
    return { label: "Løftet øyenbryn", color: "#c39150", emoji: "🧐" };
  if (score <= 80)
    return { label: "Telefonen ringer", color: "#c25c3a", emoji: "☎️" };
  return { label: "Politianmeldt før frokost", color: "#a83232", emoji: "🚔" };
}

function SvikMeter({
  score,
  begrunnelse,
}: {
  score: number;
  begrunnelse: string;
}) {
  const niva = svikNiva(score);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        delay: 0.32,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Box
        style={{
          padding: 16,
          borderRadius: 16,
          background: "#fffdf8",
          border: "1px solid rgba(20,12,4,0.08)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <Group justify="space-between" align="center" mb={10}>
          <Group gap={8}>
            <Text style={{ fontSize: 20 }}>{niva.emoji}</Text>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
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
            <Text
              component="span"
              fw={600}
              size="sm"
              c="dimmed"
              ml={2}
            >
              /100
            </Text>
          </Text>
        </Group>
        <Box
          style={{
            position: "relative",
            height: 10,
            borderRadius: 999,
            background: "#f0e4d1",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{
              duration: 0.9,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              height: "100%",
              background: `linear-gradient(90deg, #4a7c59 0%, #c39150 45%, #c25c3a 75%, #a83232 100%)`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          />
        </Box>
        <Text size="sm" c="dimmed" mt={10} fs="italic">
          {begrunnelse}
        </Text>
      </Box>
    </motion.div>
  );
}

function fengselNiva(aar: number): { label: string; color: string; emoji: string } {
  if (aar < 0.5) return { label: "Fri som fuglen", color: "#4a7c59", emoji: "🕊️" };
  if (aar < 2) return { label: "Bot og bedring", color: "#c39150", emoji: "💸" };
  if (aar < 5) return { label: "Noen år på skyggesiden", color: "#c25c3a", emoji: "⛓️" };
  if (aar < 10) return { label: "Lang dom", color: "#a83232", emoji: "🚔" };
  return { label: "Livstid light", color: "#7a1f1f", emoji: "🔒" };
}

// Skalaen topper på 15 år (parodi-maks).
const FENGSEL_MAKS = 15;

function FengselMeter({ aar, kommentar }: { aar: number; kommentar: string }) {
  const niva = fengselNiva(aar);
  const prosent = Math.min(100, (aar / FENGSEL_MAKS) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
    >
      <Box
        style={{
          padding: 16,
          borderRadius: 16,
          background: "#fffdf8",
          border: "1px solid rgba(20,12,4,0.08)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <Group justify="space-between" align="center" mb={10}>
          <Group gap={8}>
            <Text style={{ fontSize: 20 }}>{niva.emoji}</Text>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
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
            background: "#f0e4d1",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prosent}%` }}
            transition={{ duration: 0.9, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg, #4a7c59 0%, #c39150 40%, #c25c3a 70%, #7a1f1f 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          />
        </Box>
        <Text size="sm" c="dimmed" mt={10} fs="italic">
          {kommentar}
        </Text>
      </Box>
    </motion.div>
  );
}
