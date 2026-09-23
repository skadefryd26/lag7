import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatPage } from "./features/chat/ChatPage";
import { IntroPage } from "./features/intro/IntroPage";

export function App() {
  const [startet, setStartet] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {startet ? (
        <motion.div
          key="chat"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChatPage />
        </motion.div>
      ) : (
        <motion.div
          key="intro"
          initial={false}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          <IntroPage onStart={() => setStartet(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
