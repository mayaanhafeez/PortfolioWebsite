import { TOOL_DEFINITIONS } from "./tools";
import { getGithubActivity } from "./github";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

// Tools resolved entirely server-side (pure data retrieval, no UI side effect) —
// unlike navigate_section/set_theme/open_link, which round-trip to the client.
const SERVER_TOOLS = {
  get_github_activity: (args) => getGithubActivity(args.days),
};

async function groqCall(messages, tools, apiKey) {
  const body = {
    model: MODEL,
    messages,
    max_tokens: 400,
    stream: false,
  };
  if (tools?.length) {
    body.tools = tools;
    body.tool_choice = "auto";
  }

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    const err = JSON.parse(errText).error ?? {};
    // model generated a malformed tool call — signal caller to retry without tools
    if (err.code === "tool_use_failed") throw Object.assign(new Error("tool_use_failed"), { toolUseFailed: true });
    if (res.status === 429) throw Object.assign(new Error("rate_limited"), { rateLimited: true });
    throw new Error(`Groq error ${res.status}: ${errText}`);
  }
  return res.json();
}

function buildSSEStream(groqStreamRes) {
  return new ReadableStream({
    async start(controller) {
      const reader = groqStreamRes.body.getReader();
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
          if (raw === "[DONE]") {
            send(`data: ${JSON.stringify({ type: "done" })}\n\n`);
            continue;
          }
          try {
            const chunk = JSON.parse(raw);
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) send(`data: ${JSON.stringify({ type: "delta", content })}\n\n`);
          } catch {
            // skip malformed chunks
          }
        }
      }
      controller.close();
    },
  });
}

async function streamGroqText(messages, apiKey) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 400, stream: true }),
  });

  if (!res.ok) {
    if (res.status === 429) throw Object.assign(new Error("rate_limited"), { rateLimited: true });
    throw new Error(`Groq stream error ${res.status}`);
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

  let planData;
  try {
    planData = await groqCall(messages, TOOL_DEFINITIONS, apiKey);
  } catch (err) {
    if (err.toolUseFailed) {
      // Don't let the model free-respond here — with no tool result to ground it,
      // it tends to hallucinate a plausible-sounding answer (e.g. inventing GitHub
      // activity). Fail honestly instead.
      console.log("[ai] tool_use_failed — returning honest error, no plain-stream fallback");
      return Response.json({ error: "Unable to fetch details from GitHub. Please try again." }, { status: 502 });
    }
    throw err;
  }
  const choice = planData.choices?.[0];

  if (choice?.finish_reason === "tool_calls" && choice.message.tool_calls?.length) {
    const calls = choice.message.tool_calls.map((tc) => ({
      id: tc.id,
      name: tc.function.name,
      args: JSON.parse(tc.function.arguments),
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
      return streamGroqText([...messages, choice.message, ...toolMessages], apiKey);
    }

    return Response.json({ type: "tool_calls", calls });
  }

  console.log(`[ai] finish_reason: ${choice?.finish_reason} — streaming text`);
  return streamGroqText(messages, apiKey);
}

// Phase 2: stream final text after tool results have been appended to messages.
export async function streamWithToolResults(messages, apiKey) {
  return streamGroqText(messages, apiKey);
}
