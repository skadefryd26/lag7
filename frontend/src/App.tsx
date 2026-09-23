import { useState } from "react";
import { Box, Group, Button } from "@mantine/core";
import { ChatPage } from "./features/chat/ChatPage";
import { MaksPage } from "./features/maks/MaksPage";

type Side = "chat" | "maks";

export function App() {
  const [side, setSide] = useState<Side>("maks");

  return (
    <Box>
      <Group
        justify="center"
        gap="xs"
        p="sm"
        style={{ position: "sticky", top: 0, zIndex: 10, background: "#1a1b1e" }}
      >
        <Button
          variant={side === "chat" ? "filled" : "light"}
          onClick={() => setSide("chat")}
        >
          Chat med Bjarne
        </Button>
        <Button
          variant={side === "maks" ? "filled" : "light"}
          onClick={() => setSide("maks")}
        >
          Maks & Fengsel-o-meter
        </Button>
      </Group>
      {side === "chat" ? <ChatPage /> : <MaksPage />}
    </Box>
  );
}
