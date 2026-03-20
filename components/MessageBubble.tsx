"use client";
import { useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="text-xs text-[#8b949e] hover:text-white transition-colors px-2 py-1 rounded border border-[#30363d] hover:border-[#8b949e]"
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

function renderContent(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const code = part.replace(/^```[^\n]*\n?/, "").replace(/```$/, "").trim();
      return (
        <div key={i} className="relative group my-2">
          <pre><code>{code}</code></pre>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={code} />
          </div>
        </div>
      );
    }
    return (
      <p key={i} className="text-sm leading-relaxed text-[#c9d1d9] whitespace-pre-wrap">
        {part}
      </p>
    );
  });
}

export default function MessageBubble({
  role, content, isStreaming,
}: {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-4 animate-fade-in">
        <div className="max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#1f6feb] text-white text-sm">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 sm:gap-3 mb-4 animate-fade-in">
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 text-xs shrink-0 mt-1">
        $
      </div>
      <div className="flex-1 min-w-0">
        {renderContent(content)}
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" />
        )}
      </div>
    </div>
  );
}