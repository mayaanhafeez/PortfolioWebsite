import { TOOL_DEFINITIONS } from "./tools";
import { getGithubActivity } from "./github";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash";

// Tools resolved entirely server-side (pure data retrieval, no UI side effect) —
// unlike navigate_section/set_theme/open_link, which round-trip to the client.
const SERVER_TOOLS = {
  get_github_activity: (args) => getGithubActivity(args.days),
};

function toGeminiRequest(messages, tools) {
  const system = messages.find((message) => message.role === "system")?.content;
  const contents = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  const body = {
    systemInstruction: { parts: [{ text: system ?? "" }] },
    contents,
    generationConfig: {
      maxOutputTokens: 400,
      thinkingConfig: { thinkingLevel: "MINIMAL" },
    },
  };
  if (tools?.length) {
    body.tools = [{
      functionDeclarations: tools.map(({ function: tool }) => ({
        name: tool.name,
        description: tool.description,
        parametersJsonSchema: tool.parameters,
      })),
    }];
  }
  return body;
}

async function geminiCall(messages, tools, apiKey) {
  const res = await fetch(`${GEMINI_URL}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(toGeminiRequest(messages, tools)),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429) throw Object.assign(new Error("rate_limited"), { rateLimited: true });
    throw new Error(`Gemini error ${res.status}: ${errText}`);
  }
  return res.json();
}

function buildSSEStream(geminiStreamRes) {
  return new ReadableStream({
    async start(controller) {
      const reader = geminiStreamRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const send = (chunk) => controller.enqueue(new TextEncoder().encode(chunk));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          try {
            const chunk = JSON.parse(raw);
            const content = chunk.candidates?.[0]?.content?.parts
              ?.map((part) => part.text ?? "")
              .join("");
            if (content) send(`data: ${JSON.stringify({ type: "delta", content })}\n\n`);
          } catch {
            // skip malformed chunks
          }
        }
      }
      send(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      controller.close();
    },
  });
}

async function streamGeminiText(messages, apiKey) {
  const res = await fetch(`${GEMINI_URL}:streamGenerateContent?alt=sse`, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(toGeminiRequest(messages)),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429) throw Object.assign(new Error("rate_limited"), { rateLimited: true });
    throw new Error(`Gemini stream error ${res.status}: ${errText}`);
  }

  return new Response(buildSSEStream(res), {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}

// Phase 1: non-streaming call with tools to detect if the model wants to use them.
// If tool calls are detected, returns JSON { type: "tool_calls", calls }.
// Otherwise falls through to Phase 2 streaming.
export async function planAndStream(messages, apiKey) {
  const userMsg = messages.findLast((m) => m.role === "user")?.content ?? "";
  console.log(`[ai] user: "${userMsg.slice(0, 80)}"`);

  const planData = await geminiCall(messages, TOOL_DEFINITIONS, apiKey);
  const candidate = planData.candidates?.[0];
  const functionCalls = candidate?.content?.parts?.filter((part) => part.functionCall) ?? [];

  if (functionCalls.length) {
    const calls = functionCalls.map(({ functionCall }, index) => ({
      id: functionCall.id ?? `call-${index}`,
      name: functionCall.name,
      args: functionCall.args ?? {},
      thoughtSignature: functionCalls[index].thoughtSignature,
    }));
    console.log("[ai] tool_calls:", JSON.stringify(calls));

    if (calls.every((c) => c.name in SERVER_TOOLS)) {
      const toolMessages = await Promise.all(
        calls.map(async (c) => ({
          role: "tool",
          tool_call_id: c.id,
          content: await SERVER_TOOLS[c.name](c.args),
        }))
      );
      console.log("[ai] server tool_calls resolved, streaming final answer");
      return streamWithToolResults(messages, calls, toolMessages, apiKey);
    }

    return Response.json({ type: "tool_calls", calls });
  }

  console.log(`[ai] finish_reason: ${candidate?.finishReason} — streaming text`);
  return streamGeminiText(messages, apiKey);
}

// Phase 2: stream final text after tool results have been appended to messages.
export async function streamWithToolResults(messages, toolCalls, toolResults, apiKey) {
  const body = toGeminiRequest(messages);
  body.contents.push(
    {
      role: "model",
      parts: toolCalls.map((call) => ({
        functionCall: { id: call.id, name: call.name, args: call.args },
        ...(call.thoughtSignature ? { thoughtSignature: call.thoughtSignature } : {}),
      })),
    },
    {
      role: "user",
      parts: toolResults.map((result) => {
        const call = toolCalls.find((item) => item.id === result.tool_call_id);
        if (!call) throw new Error(`Missing tool call for result ${result.tool_call_id}`);
        return {
          functionResponse: {
            id: result.tool_call_id,
            name: call.name,
            response: { result: result.content },
          },
        };
      }),
    }
  );

  const res = await fetch(`${GEMINI_URL}:streamGenerateContent?alt=sse`, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429) throw Object.assign(new Error("rate_limited"), { rateLimited: true });
    throw new Error(`Gemini stream error ${res.status}: ${errText}`);
  }
  return new Response(buildSSEStream(res), {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
