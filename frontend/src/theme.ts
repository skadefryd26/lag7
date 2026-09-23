import { createTheme, MantineColorsTuple } from "@mantine/core";

const coffee: MantineColorsTuple = [
  "#faf1e6",
  "#efdcc4",
  "#e0c39a",
  "#d1a970",
  "#c39150",
  "#a97638",
  "#845923",
  "#5f3f18",
  "#3f2a10",
  "#2a1c0a",
];

export const theme = createTheme({
  primaryColor: "coffee",
  primaryShade: 6,
  colors: { coffee },
  fontFamily: "Georgia, 'Times New Roman', serif",
  headings: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontWeight: "700",
  },
  defaultRadius: "md",
});
