type GatewayBody = {
  model: string;
  instructions: string;
  input: string;
  stream: boolean;
  reasoning?: { effort: "low" | "medium" | "high" };
};

type ResponseContent = { type: string; text?: string };
type ResponseOutput = { type: string; content?: ResponseContent[] };
type ResponsesApiResponse = {
  id: string;
  model: string;
  output: ResponseOutput[];
};

const ENDPOINT = "https://genai.gjensidige.io/openai/v1/responses";
const MODEL = "gpt-5.6-luna";

export async function callAIGateway(
  instructions: string,
  input: string,
  valg: { tenketid?: "low" | "medium" | "high" } = {},
): Promise<string> {
  const token = process.env.AI_GATEWAY_TOKEN;
  if (!token) {
    throw new Error(
      "AI_GATEWAY_TOKEN mangler. Kjør oppsettet for AI-gatewayen på nytt.",
    );
  }

  const body: GatewayBody = {
    model: MODEL,
    instructions,
    input,
    stream: false,
    ...(valg.tenketid ? { reasoning: { effort: valg.tenketid } } : {}),
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`AI-gateway svarte ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as ResponsesApiResponse;
  const text = data.output
    ?.flatMap((o) => o.content ?? [])
    .map((c) => c.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("AI-gateway returnerte tomt svar.");
  }
  return text;
}
