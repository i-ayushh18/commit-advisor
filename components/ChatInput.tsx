"use client";
import { useRef, useEffect } from "react";

export default function ChatInput({
  value, onChange, onSubmit, disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${Math.min(ref.current.scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSubmit();
    }
  };

  return (
    <div className="border-t border-[#30363d] bg-[#0d1117] px-2 sm:px-4 py-3 sm:py-4 safe-bottom">
      <div className="max-w-3xl mx-auto flex gap-2 sm:gap-3 items-end">
        <span className="text-green-400 text-sm mb-3 shrink-0 hidden sm:inline">▸</span>
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder="Describe your change..."
          rows={1}
          className="flex-1 resize-none bg-transparent border-none outline-none text-sm text-[#e6edf3] placeholder-[#484f58] font-mono"
        />
        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="mb-1 px-3 sm:px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 active:bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-mono transition-colors shrink-0"
        >
          {disabled ? "..." : "commit →"}
        </button>
      </div>
    </div>
  );
}