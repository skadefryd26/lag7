import { useEffect, useRef } from "react";
import { Box } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { tegnSkisse } from "./api";
import type { SkisseResponse } from "./types";

const OPPTEGNING_FORSINKELSE_MS = 900;

export function Skadeskisse({ beskrivelse }: { beskrivelse: string }) {
  const mutation = useMutation<SkisseResponse, Error, string>({
    mutationFn: tegnSkisse,
  });

  const sistTegnet = useRef("");
  const tegnPaaNytt = useRef(mutation.mutate);
  tegnPaaNytt.current = mutation.mutate;

  useEffect(() => {
    const tekst = beskrivelse.trim();
    if (!tekst || tekst === sistTegnet.current) return;

    const id = window.setTimeout(() => {
      sistTegnet.current = tekst;
      tegnPaaNytt.current(tekst);
    }, OPPTEGNING_FORSINKELSE_MS);

    return () => window.clearTimeout(id);
  }, [beskrivelse]);

  if (!mutation.data) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mutation.data.svg.length}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: mutation.isPending ? 0.45 : 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* SVG-en er sanert på serveren før den sendes hit. */}
        <Box
          className="skadeskisse"
          mt="sm"
          style={{
            width: 168,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          dangerouslySetInnerHTML={{ __html: mutation.data.svg }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
