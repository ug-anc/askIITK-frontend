"use client";

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import { API_QUERY_URL } from "@/lib/api";

interface Message {
  question: string;
  answer: string;
  isError?: boolean;
}

// 1. Array of ANC facts to rotate during loading states
const ANC_FACTS = [
  "💡 Did you know? ANC coordinates undergraduate research opportunities through SURGE.",
  "💡 ANC manages academic mentoring through the Student Guide Program (SGP).",
  "💡 Looking for course reviews? ANC maintains academic repositories and course feedback.",
  "💡 ANC works closely with the Senate Undergraduate Committee (SUGC) on academic policies.",
  "💡 Need career assistance? ANC organizes sessions for competitive exams and higher education."
];

const UG_MANUAL_DISCLAIMER =
  "Disclaimer: For informational purposes only. Students should consult the official UG Manual before making academic decisions. As policies update periodically, please verify current rules directly with the UG Office.";

const BOOK_EMOJIS = ["📖", "📚", "📑", "📜"];
const FACT_FADE_MS = 500;
const FACT_HOLD_MS = 3000;

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { question: "What all can you do?", answer: "I can answer questions from the UG Manual" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [factOpacity, setFactOpacity] = useState(1);
  
  // State to track the active fact index
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [sessionId] = useState(() => crypto.randomUUID());

  // 2. While waiting for the server: fade a fact in, hold it for 3s fully
  // visible, fade it completely out, then fade the next one in.
  useEffect(() => {
    if (!isLoading) return;

    let timeoutId: number;

    const hide = () => {
      setFactOpacity(0);
      timeoutId = window.setTimeout(advance, FACT_FADE_MS);
    };
    const advance = () => {
      setCurrentFactIndex((prev) => (prev + 1) % ANC_FACTS.length);
      setFactOpacity(1);
      timeoutId = window.setTimeout(hide, FACT_HOLD_MS);
    };

    timeoutId = window.setTimeout(hide, FACT_HOLD_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isLoading]);

  // Dynamically expands or shrinks the textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e?: FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();

    setInput("");
    setIsLoading(true);
    setCurrentFactIndex(0);
    setFactOpacity(1);

    // Use a special internal flag "__LOADING__" instead of static "Thinking..."
    setMessages((prev) => [...prev, { question: userQuery, answer: "__LOADING__" }]);

    try {
      const response = await fetch(API_QUERY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userQuery,
          session_id: sessionId,
        }),
      });

      let finalAnswer = "";
      let finalIsError = false;

      if (response.status === 429) {
        finalAnswer = "Slow down a bit! You've reached the request limit. Please try again in a minute.";
        finalIsError = true;
      } else {
        if (!response.ok) {
          throw new Error(`Server returned structural error status: ${response.status}`);
        }

        const data = await response.json();
        finalAnswer = data.answer;
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { question: userQuery, answer: finalAnswer, isError: finalIsError }
      ]);

    } catch (error) {
      console.error("API Communication Failure:", error);

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { 
          question: userQuery, 
          answer: "Unable to establish a connection with the server. Please verify your backend server status.", 
          isError: true 
        }
      ]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto border border-slate-100 bg-white shadow-sm overflow-hidden h-full flex flex-col">
      {/* Messages Render Timeline */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg, idx) => {
          const isLoadingMessage = msg.answer === "__LOADING__";

          return (
            <div key={idx} className="flex flex-col gap-1">
              <p className="font-semibold text-sm text-slate-800">You: {msg.question}</p>
              <p
                className={`text-sm whitespace-pre-wrap px-4 py-3 rounded-xl max-w-[100%] self-start transition-all duration-500 ${
                  isLoadingMessage
                    ? "text-amber-800 bg-amber-50 border border-amber-200/60"
                    : msg.isError
                    ? "text-red-700 bg-red-50 border border-red-100"
                    : "text-slate-600 bg-slate-100"
                }`}
              >
                {isLoadingMessage ? (
                  <span
                    className={`block transition-opacity ease-in-out ${factOpacity === 1 ? "opacity-100" : "opacity-0"}`}
                    style={{ transitionDuration: `${FACT_FADE_MS}ms` }}
                  >
                    {ANC_FACTS[currentFactIndex]}
                  </span>
                ) : (
                  msg.answer
                )}
              </p>
              {!isLoadingMessage && (
                <p className="text-xs italic text-slate-400 px-1">{UG_MANUAL_DISCLAIMER}</p>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Textarea Ingestion Engine */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row items-end">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything from the UG manual..."
            disabled={isLoading}
            className="flex-1 resize-none overflow-hidden max-h-48 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
          />

<button
  type="submit"
  disabled={isLoading || !input.trim()}
  className="inline-flex h-[46px] min-w-[90px] items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
>
  {isLoading ? (
    <span className="inline-block animate-pulse text-base">
      {BOOK_EMOJIS[currentFactIndex % BOOK_EMOJIS.length]}
    </span>
  ) : (
    "Ask"
  )}
</button>
        </form>
      </div>
    </div>
  );
}