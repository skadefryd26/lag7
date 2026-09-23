import { useEffect, useRef } from "react";
import { Box, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { tegnSkisse } from "./api";
import type { SkisseResponse } from "./types";

const OPPTEGNING_FORSINKELSE_MS = 900;

export function Skadeskisse({ beskrivelse }: { beskrivelse: string }) {
  const [opened, { open, close }] = useDisclosure(false);

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

  if (!mutation.data) {
    if (!mutation.isPending) return null;
    return (
      <Box
        className="skisse-tegnes"
        mt="sm"
        aria-label="Skissen tegnes"
        style={{
          width: 168,
          height: 105,
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
    );
  }

  const svg = mutation.data.svg;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={svg.length}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: mutation.isPending ? 0.45 : 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={mutation.isPending ? "skisse-tegnes-paa-nytt" : undefined}
        >
          {/* SVG-en er sanert på serveren før den sendes hit. */}
          <Box
            className="skadeskisse"
            component="button"
            type="button"
            aria-label="Vis skadeskissen i full størrelse"
            onClick={open}
            mt="sm"
            p={0}
            style={{
              width: 168,
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              cursor: "zoom-in",
              display: "block",
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </motion.div>
      </AnimatePresence>

      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        centered
        withCloseButton={false}
        padding={0}
        radius={16}
        overlayProps={{ backgroundOpacity: 0.75, blur: 3 }}
      >
        {/* Samme sanerte SVG, vist i full bredde. */}
        <Box
          className="skadeskisse"
          style={{ width: "100%", cursor: "zoom-out" }}
          onClick={close}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </Modal>
    </>
  );
}
