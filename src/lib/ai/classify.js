const CLASSIFY_SYSTEM = `You are a content filter for a software developer's portfolio assistant. Respond with exactly one word.

Reply YES if the message is about:
- The developer (Ayaan), his background, education, or personality
- His projects, code, or technical work
- His skills, languages, frameworks, or tools
- His experience or jobs
- Navigating, theming, or using this portfolio website
- Greetings or casual conversation directed at the assistant
- Anything that could reasonably relate to a software developer's portfolio

Reply NO only if the message is clearly unrelated — e.g. asking for news, weather, cooking recipes, political opinions, or other topics with no connection to a developer portfolio.

When in doubt, reply YES.`;

export async function classifyIntent(message, apiKey) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
    {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: CLASSIFY_SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: {
          maxOutputTokens: 5,
          temperature: 0,
          thinkingConfig: { thinkingLevel: "MINIMAL" },
        },
      }),
    }
  );

  if (!res.ok) return true; // fail open — don't block on classification errors

  const data = await res.json();
  const reply = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim()
    .toUpperCase() ?? "";
  return reply.startsWith("YES");
}
