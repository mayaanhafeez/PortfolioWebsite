"use client";

import { useState, useEffect, useRef } from "react";

export default function AIChat({ messages, loading, onSend, onClose, inputRef, initialPrompt }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const sentRef = useRef(false);

  useEffect(() => {
    if (initialPrompt) {
      if (!sentRef.current) {
        sentRef.current = true;
        onSend(initialPrompt);
      }
    } else {
      inputRef?.current?.focus();
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleKeyDown(e) {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "Enter" && !e.shiftKey && input.trim() && !loading) {
      onSend(input.trim());
      setInput("");
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="aiChat" onClick={(e) => e.stopPropagation()}>

        <div className="aiChatHeader">
          <span className="aiChatTitle">
            <span className="aiChatTitleIcon">⬡</span> ai.nvim
          </span>
          <div className="aiChatMeta">
            <span className="aiChatModel">llama-3.3-70b</span>
            <span className="aiChatClose" onClick={onClose}>✕</span>
          </div>
        </div>

        <div className="aiChatMessages">
          {messages.length === 0 && (
            <div className="aiChatEmpty">
              Ask me about Ayaan&apos;s projects, skills, or experience.<br />
              Or try: &quot;navigate to projects&quot;, &quot;switch to gruvbox&quot;, &quot;open the ssht github&quot;
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`aiChatMsg ${msg.role}`}>
              <span className="aiChatMsgRole">{msg.role === "user" ? "you" : "ai"}</span>
              <span className="aiChatMsgContent">{msg.content}</span>
            </div>
          ))}
          {loading && (
            <div className="aiChatMsg assistant">
              <span className="aiChatMsgRole">ai</span>
              <span className="aiChatSpinner">▋</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="aiChatInputRow">
          <span className="aiChatPrompt">❯</span>
          <input
            ref={inputRef}
            className="aiChatInput"
            value={input}
            maxLength={500}
            placeholder="ask me anything about ayaan..."
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="aiChatCharCount">{input.length}/500</span>
        </div>

        <div className="aiChatHint">
          <kbd>Enter</kbd> send&ensp;
          <kbd>Esc</kbd> close&ensp;
          <span>history preserved this session</span>
        </div>

      </div>
    </div>
  );
}
