// Trims the client-side message history to the last `max` messages.
// System message is never included here — route.js prepends it fresh each request.
export function trimToWindow(messages, max = 20) {
  if (!Array.isArray(messages) || messages.length === 0) return [];
  if (messages.length <= max) return messages;
  return messages.slice(messages.length - max);
}
