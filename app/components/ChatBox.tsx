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

const BOOK_EMOJIS = ["📖", "📚", "📑", "📜"];

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { question: "What all can you do?", answer: "I can answer questions from the UG Manual" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // State to track the active fact index
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [sessionId] = useState(() => crypto.randomUUID());

  // 2. Rotate ANC facts every 2.5 seconds while waiting for the server
  useEffect(() => {
    if (!isLoading) return;

    setCurrentFactIndex(0); // Reset to first fact on new request

    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % ANC_FACTS.length);
    }, 1200);

    return () => clearInterval(interval);
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

    // Use a special internal flag "__LOADING__" instead of static "Thinking..."
    setMessages((prev) => [...prev, { question: userQuery, answer: "__LOADING__" }]);

    try {
      console.log({
        "query": userQuery,
        "session_id": sessionId
      });
      
      const response = await fetch(API_QUERY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userQuery,
          session_id: "75e6d6d8-f860-466d-a70d-f28e2025b682",
        }),
      });

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { 
            question: userQuery, 
            answer: "Slow down a bit! You've reached the request limit. Please try again in a minute.", 
            isError: true 
          }
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Server returned structural error status: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { question: userQuery, answer: data.answer }
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
                className={`text-sm whitespace-pre-wrap px-4 py-3 rounded-xl max-w-[100%] self-start transition-all duration-300 ${
                  isLoadingMessage
                    ? "text-amber-800 bg-amber-50 border border-amber-200/60 animate-pulse"
                    : msg.isError
                    ? "text-red-700 bg-red-50 border border-red-100"
                    : "text-slate-600 bg-slate-100"
                }`}
              >
                {/* 3. Render rotating ANC fact if currently loading */}
                {isLoadingMessage ? ANC_FACTS[currentFactIndex] : msg.answer}
              </p>
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
            placeholder="Ask anything about IITK..."
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