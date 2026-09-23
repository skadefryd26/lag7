import { AnimatePresence, motion } from "framer-motion";

type Props = {
  aktiv: boolean;
};

const mynter = ["💰", "🪙", "💸", "🤑", "💵"];

// Regn av penger som faller nedover når beløpet hopper kraftig opp.
export function PengeRegn({ aktiv }: Props) {
  return (
    <AnimatePresence>
      {aktiv && (
        <motion.div
          key="regn"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          {Array.from({ length: 22 }).map((_, i) => {
            const venstre = Math.random() * 100;
            const forsinkelse = Math.random() * 0.5;
            const varighet = 1.4 + Math.random() * 1.1;
            const ikon = mynter[i % mynter.length];
            const storrelse = 20 + Math.random() * 20;
            return (
              <motion.div
                key={i}
                initial={{ y: -60, opacity: 0, rotate: 0 }}
                animate={{
                  y: "110%",
                  opacity: [0, 1, 1, 0.9],
                  rotate: Math.random() > 0.5 ? 360 : -360,
                }}
                transition={{
                  duration: varighet,
                  delay: forsinkelse,
                  ease: "easeIn",
                }}
                style={{
                  position: "absolute",
                  left: `${venstre}%`,
                  top: 0,
                  fontSize: storrelse,
                }}
              >
                {ikon}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
