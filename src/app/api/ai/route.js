import { checkRateLimit } from "@/lib/ai/ratelimit";
import { classifyIntent } from "@/lib/ai/classify";
import { buildSystemPrompt } from "@/lib/ai/context";
import { trimToWindow } from "@/lib/ai/history";
import { planAndStream, streamWithToolResults } from "@/lib/ai/chat";

export const runtime = "nodejs";

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    console.log(`[route] 429 rate_limit ip=${ip}`);
    return Response.json(
      { error: "Rate limit exceeded. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { message, history = [], toolResults, toolCalls } = body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return Response.json({ error: "message is required." }, { status: 400 });
  }
  if (message.length > 500) {
    return Response.json({ error: "Message exceeds 500 character limit." }, { status: 400 });
  }
  if (!Array.isArray(history)) {
    return Response.json({ error: "history must be an array." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "AI assistant is currently unavailable." }, { status: 503 });
  }

  console.log(`[route] ip=${ip} history=${history.length} msg="${message.slice(0, 60)}"`);

  // Follow-up after tool execution: skip classification, just stream the final answer
  if (toolResults && toolCalls) {
    console.log(`[route] tool_followup tools=${JSON.stringify(toolCalls.map(t => t.name))}`);
    const systemMessage = { role: "system", content: buildSystemPrompt() };
    const trimmedHistory = trimToWindow(history, 20);
    const messages = [systemMessage, ...trimmedHistory, { role: "user", content: message }];
    try {
      return await streamWithToolResults(messages, toolCalls, toolResults, apiKey);
    } catch (err) {
      if (err.rateLimited) return Response.json({ error: "Too many requests — Gemini free tier limit hit. Wait a few seconds and try again." }, { status: 429 });
      throw err;
    }
  }

  // First request: classify intent before calling the main model
  const onTopic = await classifyIntent(message, apiKey);
  console.log(`[classify] on_topic=${onTopic} msg="${message.slice(0, 60)}"`);
  if (!onTopic) {
    return Response.json(
      { error: "I can only help with questions about Ayaan's portfolio, projects, and experience." },
      { status: 422 }
    );
  }

  const systemMessage = { role: "system", content: buildSystemPrompt() };
  const trimmedHistory = trimToWindow(history, 20);
  const messages = [
    systemMessage,
    ...trimmedHistory,
    { role: "user", content: message },
  ];

  try {
    return await planAndStream(messages, apiKey);
  } catch (err) {
    if (err.rateLimited) return Response.json({ error: "Too many requests — Gemini free tier limit hit. Wait a few seconds and try again." }, { status: 429 });
    throw err;
  }
}
