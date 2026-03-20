# commit-advisor

A terminal-styled chatbot that helps developers write better git commit messages.

Describe your change in plain English (or paste a diff) and get 2–3 commit message options back, following the [Conventional Commits](https://www.conventionalcommits.org/) spec — with reasoning for each.

**Live demo:** [commit-advisor](https://commit-advisor.vercel.app/)

---

## Why this topic

Every developer has written `git commit -m "fixes"` at 2am. The problem isn't not knowing better — it's that writing a good commit message requires a mental context switch mid-flow. This tool removes that friction.

The scope is intentionally tight: ask it about anything other than commits and it redirects you back. That's what makes it feel like a real tool rather than a generic AI wrapper.

---

## Stack

- **Next.js 14** — App Router, API routes
- **Groq API** (`llama-3.3-70b`) — free tier, fast streaming inference
- **Tailwind CSS** — terminal aesthetic
- **Vercel** — deployment

---

## Running locally

```bash
git clone https://github.com/i-ayushh18/commit-advisor
cd commit-advisor
npm install
```

Add a `.env.local`:
```
GROQ_API_KEY=your_key_here
```

Get a free key at [console.groq.com](https://console.groq.com).

```bash
npm run dev
```
