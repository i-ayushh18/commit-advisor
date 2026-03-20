const EXAMPLES = [
  "I added dark mode toggle using CSS variables",
  "Fixed a bug where users got logged out on refresh",
  "Refactored the auth service to use dependency injection",
  "Added unit tests for the payment module",
];

export default function EmptyState({ onExample }: { onExample: (s: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 sm:gap-8 px-2 sm:px-4">
      <div className="text-center">
        <div className="text-lg sm:text-2xl font-bold text-white mb-2">
          <span className="text-green-400">$</span> git commit -m &quot;...&quot;
        </div>
        <p className="text-[#8b949e] text-xs sm:text-sm max-w-sm">
          Describe your change or paste a diff. Get expert commit messages back, instantly.
        </p>
      </div>

      <div className="w-full max-w-lg">
        <p className="text-xs text-[#8b949e] mb-3 uppercase tracking-wider">Try an example</p>
        <div className="grid gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => onExample(ex)}
              className="text-left px-3 sm:px-4 py-3 rounded-md border border-[#30363d] bg-[#161b22] hover:border-[#388bfd] hover:bg-[#1c2128] active:bg-[#1c2128] text-xs sm:text-sm text-[#c9d1d9] transition-all duration-150 cursor-pointer"
            >
              <span className="text-[#8b949e] mr-2">▸</span>
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}