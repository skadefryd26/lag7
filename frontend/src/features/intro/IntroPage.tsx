import { motion } from "framer-motion";
import { Box, Button, MantineProvider, Stack, Text, Title, type MantineColorsTuple } from "@mantine/core";

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

// Ease-out for entrances (skill 2.6). Alt under 300ms (skill 1.1/2.12).
const easeOut = [0.22, 1, 0.36, 1] as const;

export function IntroPage({ onStart }: { onStart: () => void }) {
  return (
    <MantineProvider
      forceColorScheme="dark"
      theme={{ colors: { blood }, primaryColor: "blood", primaryShade: 6 }}
    >
      <Box
        style={{
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 50% 30%, #3a0f16 0%, #10070a 60%, #050305 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        {/* Rolig, pulserende glød i bakgrunnen — linear ikke tillatt for motion (2.9); bruk easeInOut. */}
        <motion.div
          aria-hidden
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: 620,
            height: 620,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(226,85,95,0.35) 0%, rgba(226,85,95,0) 65%)",
            filter: "blur(20px)",
            zIndex: 0,
          }}
        />

        {/* Flimrende tåke */}
        <motion.div
          aria-hidden
          animate={{ opacity: [0.1, 0.25, 0.1], x: [-14, 14, -14] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.06), transparent 60%)",
            zIndex: 0,
          }}
        />

        <Stack
          gap={28}
          align="center"
          style={{ position: "relative", zIndex: 1, maxWidth: 640 }}
        >
          {/* Merkeikon — enkel fade-in, ease-out, kort */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
            style={{ fontSize: 72, lineHeight: 1, filter: "drop-shadow(0 0 24px rgba(226,85,95,0.55))" }}
          >
            💀
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: easeOut, delay: 0.04 }}
          >
            <Title
              order={1}
              ta="center"
              style={{
                fontSize: 56,
                lineHeight: 1.02,
                letterSpacing: -0.5,
                color: "#f0dedb",
                textWrap: "balance",
                textShadow: "0 2px 24px rgba(0,0,0,0.6)",
              }}
            >
              Forsikringsplyndreren
            </Title>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: easeOut, delay: 0.08 }}
          >
            <Text
              ta="center"
              size="lg"
              style={{
                color: "#c9b3b0",
                lineHeight: 1.55,
                maxWidth: 520,
                textWrap: "pretty",
              }}
            >
              Vi henter skatten du fortjener. Fortell hva som skjedde — vi
              formulerer resten.
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: easeOut, delay: 0.12 }}
          >
            <Button
              size="lg"
              radius={14}
              color="blood"
              className="agent-button"
              onClick={onStart}
              styles={{
                root: {
                  paddingLeft: 28,
                  paddingRight: 28,
                  fontSize: 16,
                  fontWeight: 700,
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 24px rgba(226,85,95,0.35), 0 2px 6px rgba(0,0,0,0.5)",
                },
              }}
            >
              Snakk med forsikringsplyndreren
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.28, ease: easeOut, delay: 0.18 }}
          >
            <Text ta="center" size="xs" c="dimmed" style={{ letterSpacing: 0.4 }}>
              Parodi. Skadefryd 2026. Alt er oppdiktet.
            </Text>
          </motion.div>
        </Stack>
      </Box>
    </MantineProvider>
  );
}
