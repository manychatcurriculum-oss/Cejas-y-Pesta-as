"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "¿Cómo empiezo el plan?",
  "Dame una receta fácil",
  "¿Cuándo veo resultados?",
  "¿Puedo comer gelatina diet?",
];

const WELCOME: Message = {
  role: "assistant",
  content: "¡Hola! 👋 Soy tu asistente de Gelatina Fit. Estoy acá para darte recetas, contarte qué gelatina comprar en la dietética y ayudarte con todo lo que necesites para empezar. ¿Qué querés saber? 🌸",
};

export default function GelatinaChatbot() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setShowSuggestions(false);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.filter((m) => m !== WELCOME),
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ups, tuve un problema técnico. ¡Intentá de nuevo en un momento! 💕" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-pink-100 shadow-lg shadow-pink-500/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
          🥗
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Asistente Gelatina Fit</p>
          <p className="text-pink-100 text-xs">Recetas · Tips · Consejos</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-pink-100">En línea</span>
        </div>
      </div>

      {/* Messages */}
      <div className="h-72 overflow-y-auto px-4 py-4 space-y-3 bg-pink-50/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-sm shrink-0 mr-2 mt-0.5">
                🥗
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-pink-500 text-white rounded-br-sm"
                  : "bg-white text-gray-800 shadow-sm border border-pink-100 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-sm shrink-0 mr-2 mt-0.5">
              👩‍⚕️
            </div>
            <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-sm shrink-0 mr-2 mt-0.5">
              🥗
            </div>
            <div className="bg-white border border-pink-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="px-4 pt-3 pb-1 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs bg-pink-50 border border-pink-200 text-pink-600 rounded-full px-3 py-1.5 hover:bg-pink-100 transition-colors font-medium"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-pink-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí tu pregunta..."
          disabled={loading}
          className="flex-1 text-sm border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:opacity-50 bg-white"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-40 shrink-0"
        >
          →
        </button>
      </div>
    </div>
  );
}
