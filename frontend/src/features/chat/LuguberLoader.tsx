import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Text } from "@mantine/core";

// Kjenner igjen hva kunden melder skade på, og gir en luguber "scene".
type Scene = {
  ikon: string;
  bilde: string; // lugubert foto (Unsplash)
  bakgrunn: string; // stemningsfarge/gradient som reserve
  tekster: string[];
};

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

const SCENER: { nokkelord: string[]; scene: Scene }[] = [
  {
    nokkelord: ["bil", "kjøretøy", "kollisjon", "parkering", "ratt", "bilen"],
    scene: {
      ikon: "🚗",
      bilde: U("photo-1503376780353-7e6692767b70"),
      bakgrunn:
        "radial-gradient(circle at 50% 40%, #2a1608 0%, #140c04 70%, #050301 100%)",
      tekster: [
        "Bjarne studerer bulkene i måneskinnet …",
        "Et vrak. Vakkert, på sitt vis.",
        "Han teller skrapene. Alle teller.",
      ],
    },
  },
  {
    nokkelord: ["motorsykkel", "mc", "sykkel", "moped", "scooter", "hjul"],
    scene: {
      ikon: "🏍️",
      bilde: U("photo-1558981403-c5f9899a28bc"),
      bakgrunn:
        "radial-gradient(circle at 50% 40%, #301010 0%, #160707 70%, #060202 100%)",
      tekster: [
        "Bjarne hører ekkoet av et hjul som ruller alene …",
        "Asfalten husker alt.",
        "Han noterer: «tapt frihet — erstattes i kroner».",
      ],
    },
  },
  {
    nokkelord: ["hest", "hoppe", "vallak", "pony", "ponni", "stall", "dyr"],
    scene: {
      ikon: "🐎",
      bilde: U("photo-1553284965-83fd3e82fa5a"),
      bakgrunn:
        "radial-gradient(circle at 50% 40%, #241a2e 0%, #110b17 70%, #050208 100%)",
      tekster: [
        "En hest vrinsker et sted i tåka …",
        "Bjarne kondolerer. Så regner han.",
        "Manken var forsikret. Selvsagt.",
      ],
    },
  },
  {
    nokkelord: ["hus", "hjem", "bolig", "leilighet", "tak", "kjeller", "brann", "vann", "hytte"],
    scene: {
      ikon: "🏚️",
      bilde: U("photo-1518709268805-4e9042af9f23"),
      bakgrunn:
        "radial-gradient(circle at 50% 40%, #1a1f12 0%, #0d1008 70%, #030401 100%)",
      tekster: [
        "Vinden uler gjennom et knust vindu …",
        "Bjarne går gjennom ruinene med lommelykt.",
        "Hver sprekk i veggen har en pris.",
      ],
    },
  },
  {
    nokkelord: ["båt", "seil", "motor", "kai", "sjø", "vann"],
    scene: {
      ikon: "⛵",
      bilde: U("photo-1544551763-46a013bb70d5"),
      bakgrunn:
        "radial-gradient(circle at 50% 40%, #0a1c26 0%, #050f15 70%, #010507 100%)",
      tekster: [
        "Noe synker langsomt i det mørke vannet …",
        "Bjarne speider ut over den kalde fjorden.",
        "Vrakgods. Verdifullt vrakgods.",
      ],
    },
  },
  {
    nokkelord: ["telefon", "mobil", "laptop", "pc", "data", "skjerm", "elektronikk"],
    scene: {
      ikon: "📱",
      bilde: U("photo-1510557880182-3d4d3cba35a5"),
      bakgrunn:
        "radial-gradient(circle at 50% 40%, #101a24 0%, #080d13 70%, #020306 100%)",
      tekster: [
        "En sprukken skjerm flimrer i mørket …",
        "Bjarne holder en likvake for elektronikken.",
        "Data tapt. Erstatning funnet.",
      ],
    },
  },
];

const STANDARD: Scene = {
  ikon: "🕯️",
  bilde: U("photo-1478760329108-5c3ed9d495a0"),
  bakgrunn:
    "radial-gradient(circle at 50% 40%, #201408 0%, #0f0a04 70%, #040301 100%)",
  tekster: [
    "Bjarne tenner et lys og blar i vilkårene han fant på selv …",
    "Han sukker. Dypt.",
    "Et sted stiger et beløp i mørket.",
  ],
};

function velgScene(tekst: string): Scene {
  const t = tekst.toLowerCase();
  for (const s of SCENER) {
    if (s.nokkelord.some((k) => t.includes(k))) return s.scene;
  }
  return STANDARD;
}

export function LuguberLoader({ sisteMelding }: { sisteMelding: string }) {
  const scene = velgScene(sisteMelding);
  const [tekstIndex, setTekstIndex] = useState(0);
  const [bildeFeilet, setBildeFeilet] = useState(false);

  useEffect(() => {
    setBildeFeilet(false);
    const id = window.setInterval(
      () => setTekstIndex((i) => (i + 1) % scene.tekster.length),
      1600,
    );
    return () => window.clearInterval(id);
  }, [scene]);

  return (
    <Box
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        background: scene.bakgrunn,
        padding: "36px 20px",
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.8)",
      }}
    >
      {/* Ekte lugubert foto som bakgrunn */}
      {!bildeFeilet && (
        <motion.img
          src={scene.bilde}
          alt=""
          aria-hidden
          onError={() => setBildeFeilet(true)}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 4, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(0.4) brightness(0.5) contrast(1.1)",
          }}
        />
      )}

      {/* Mørkt overlegg oppå bildet */}
      <Box
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Flimrende tåke */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0.15, 0.35, 0.15], x: [-10, 10, -10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 60%, rgba(255,255,255,0.10), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Ikonet — liten glødende markør oppå bildet */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.06, 1],
          filter: [
            "drop-shadow(0 0 8px rgba(255,90,40,0.5))",
            "drop-shadow(0 0 22px rgba(255,90,40,0.9))",
            "drop-shadow(0 0 8px rgba(255,90,40,0.5))",
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ fontSize: 54, lineHeight: 1, zIndex: 1 }}
      >
        {scene.ikon}
      </motion.div>

      {/* Roterende luguber tekst */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tekstIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5 }}
          style={{ zIndex: 1 }}
        >
          <Text
            ta="center"
            fs="italic"
            style={{
              color: "#e8d9c4",
              fontSize: 15,
              textShadow: "0 1px 8px rgba(0,0,0,0.9)",
              maxWidth: 340,
            }}
          >
            {scene.tekster[tekstIndex]}
          </Text>
        </motion.div>
      </AnimatePresence>

      {/* Pulserende "puls"-strek */}
      <motion.div
        aria-hidden
        animate={{ scaleX: [0.2, 1, 0.2], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 120,
          height: 2,
          borderRadius: 2,
          background:
            "linear-gradient(90deg, transparent, #ff5a28, transparent)",
          zIndex: 1,
        }}
      />
    </Box>
  );
}
