"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "What is your leadership style?",
  "Tell me about your SaaS experience",
  "What impact have you delivered?",
];

export default function DigitalTwinChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function ask(question: string) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: cleanQuestion }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setMessages((current) => [...current, { role: "assistant", content: data.answer! }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div className="twin-shell">
      {open && (
        <section className="twin-panel" role="dialog" aria-modal="true" aria-label="Hendrik's Digital Twin">
          <header className="twin-header">
            <div className="twin-identity">
              <span className="twin-avatar">HO<i /></span>
              <div>
                <strong>Hendrik&apos;s Digital Twin</strong>
                <span><i /> AI career guide · Online</span>
              </div>
            </div>
            <button className="twin-close" type="button" onClick={() => setOpen(false)} aria-label="Close Digital Twin chat">×</button>
          </header>

          <div className="twin-messages" aria-live="polite">
            <div className="twin-intro">
              <span className="twin-avatar large">HO</span>
              <h2>Ask me about Hendrik&apos;s career.</h2>
              <p>I&apos;m an AI guide grounded in Hendrik&apos;s professional profile—here to answer questions about his experience, leadership, and impact.</p>
            </div>

            {messages.length === 0 && (
              <div className="twin-suggestions">
                {suggestions.map((suggestion) => (
                  <button type="button" key={suggestion} onClick={() => void ask(suggestion)}>{suggestion}<span>↗</span></button>
                ))}
              </div>
            )}

            {messages.map((message, index) => (
              <div className={`twin-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.role === "assistant" && <span className="message-label">Digital Twin</span>}
                <p>{message.content}</p>
              </div>
            ))}

            {loading && (
              <div className="twin-message assistant loading" aria-label="Digital Twin is thinking">
                <span className="message-label">Digital Twin</span>
                <p><i /><i /><i /></p>
              </div>
            )}
            {error && <p className="twin-error" role="alert">{error}</p>}
            <div ref={endRef} />
          </div>

          <form className="twin-form" onSubmit={submit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about my experience..."
              aria-label="Question for Hendrik's Digital Twin"
              rows={1}
              maxLength={2_000}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send question">
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 12-6-4 12-2-5-6-1Z" /></svg>
            </button>
          </form>
          <p className="twin-disclaimer">AI-generated answers · Grounded in Hendrik&apos;s career profile</p>
        </section>
      )}

      <button className={`twin-trigger ${open ? "is-open" : ""}`} type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span className="trigger-orbit"><i /><b>HO</b></span>
        <span><small>Meet my</small>Digital Twin</span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>
      </button>
    </div>
  );
}
