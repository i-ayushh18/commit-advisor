"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import MessageBubble from "@/components/MessageBubble";
import ChatInput from "@/components/ChatInput";
import EmptyState from "@/components/EmptyState";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const clearChat = useCallback(() => {
    if (!isLoading) {
      setMessages([]);
      setStreamingContent("");
      setInput("");
    }
  }, [isLoading]);

  // Ctrl+K to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        clearChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearChat]);

  const send = async (text?: string) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setStreamingContent(full);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: full }]);
      setStreamingContent("");
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: unable to reach model. Check your API key and try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-[#0d1117]">
      {/* Header */}
      <header className="border-b border-[#30363d] px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="font-mono text-xs sm:text-sm text-white font-semibold truncate">commit-advisor</span>
        <span className="text-[#8b949e] text-xs ml-1 hidden sm:inline">v1.0.0</span>

        <div className="ml-auto flex items-center gap-3">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              disabled={isLoading}
              className="text-[#8b949e] hover:text-white text-xs font-mono transition-colors disabled:opacity-30 flex items-center gap-1"
              title="Clear conversation (Ctrl+K)"
            >
              <span className="hidden sm:inline">clear</span>
              <span>⌫</span>
            </button>
          )}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && !isLoading ? (
            <EmptyState onExample={(ex) => send(ex)} />
          ) : (
            <>
              {messages.map((m, i) => (
                <MessageBubble key={i} role={m.role} content={m.content} />
              ))}
              {streamingContent && (
                <MessageBubble role="assistant" content={streamingContent} isStreaming />
              )}
              {isLoading && !streamingContent && (
                <div className="flex gap-2 sm:gap-3 mb-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 text-xs shrink-0 mt-1">
                    $
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#8b949e]">
                    <span className="text-green-400">$</span>
                    <span>thinking</span>
                    <span className="inline-flex gap-0.5">
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={() => send()}
        disabled={isLoading}
      />
    </div>
  );
}