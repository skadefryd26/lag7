const BLOCKED_TAGS_WITH_CONTENT = ["script", "style", "foreignObject"];
const BLOCKED_TAGS = ["image", "use"];

export function sanitizeSvg(svg: string): string {
  let sanitized = svg.trim();

  for (const tag of BLOCKED_TAGS_WITH_CONTENT) {
    const pairedTag = new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi");
    const singleTag = new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi");
    sanitized = sanitized.replace(pairedTag, "");
    sanitized = sanitized.replace(singleTag, "");
  }

  for (const tag of BLOCKED_TAGS) {
    const blockedTag = new RegExp(`<\\/?${tag}\\b[^>]*\\/?>`, "gi");
    sanitized = sanitized.replace(blockedTag, "");
  }

  sanitized = sanitized.replace(
    /\s(?:xlink:href|href)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
    "",
  );
  sanitized = sanitized.replace(
    /\son[a-z0-9:_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
    "",
  );
  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/data:/gi, "");

  return sanitized.trim();
}
