"use client";

import { useState } from "react";

const EXAMPLES = [
  {
    tag: "Food business",
    text: "I want to build a product which delivers protein bowls, protein oatmeal, protein shakes and bulking shakes to any address. I want to build a website for it, market it and get sales. I don't know anything about ads or any of this, but I want to build it.",
  },
  {
    tag: "Student",
    text: "I'm a final-year student with no work experience. I want to use AI tools to build a portfolio, put it online, and land my first paid freelance client within 30 days. I've never built a website.",
  },
  {
    tag: "Developer",
    text: "I'm a backend developer. I want to ship a Chrome extension, get it approved on the Web Store, and reach 1,000 real users without spending money on ads.",
  },
  {
    tag: "Creator",
    text: "I make short videos and I'm stuck at 200 followers. I want to use AI tools to plan and edit content, grow to 10,000 followers, and actually earn from it.",
  },
];

export function Launch({
  onSubmit,
  demoMode,
  busy,
  error,
}: {
  onSubmit: (goal: string) => void;
  demoMode: boolean;
  busy: boolean;
  error: string | null;
}) {
  const [value, setValue] = useState("");
  const canSubmit = value.trim().length > 12 && !busy;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-14 pb-24 sm:pt-24">
      <div className="rise">
        <Wordmark />

        <h1 className="mt-10 text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[3.1rem]">
          Stop reading how-tos.
          <br />
          <span className="text-[var(--text-faint)]">
            Watch the plan build itself.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--text-dim)]">
          Describe what you want to build. You get a map of the whole thing —
          which tools, which screen, which button, in what order — priced three
          ways: at zero budget, on a small budget, and with the paid stack.
        </p>

        <form
          className="mt-9"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) onSubmit(value.trim());
          }}
        >
          <div
            className="panel rounded-2xl p-2 transition-colors focus-within:border-[var(--line-strong)]"
            style={{ background: "var(--panel)" }}
          >
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (
                  (e.metaKey || e.ctrlKey) &&
                  e.key === "Enter" &&
                  canSubmit
                ) {
                  onSubmit(value.trim());
                }
              }}
              rows={5}
              maxLength={4000}
              autoFocus
              placeholder="I want to build… (the more honest you are about what you don't know, the better the plan)"
              className="w-full resize-none bg-transparent px-3 py-3 text-[15px] leading-relaxed outline-none placeholder:text-[var(--text-faint)]"
            />
            <div className="flex items-center justify-between gap-3 px-3 pt-1 pb-2">
              <span className="text-[11px] text-[var(--text-faint)]">
                {value.length > 0 ? `${value.length} / 4000` : "⌘↵ to send"}
              </span>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-lg px-4 py-2 text-[13px] font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-30"
                style={{ background: "var(--ember)" }}
              >
                {busy ? "Reading…" : "Build the plan"}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <p
            className="mt-3 rounded-lg border px-3 py-2 text-[13px]"
            style={{ borderColor: "#fb718544", color: "#fb7185" }}
          >
            {error}
          </p>
        )}

        <div className="mt-8">
          <div className="mb-3 text-[10px] font-semibold tracking-[0.14em] text-[var(--text-faint)] uppercase">
            Or start from one of these
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.tag}
                type="button"
                onClick={() => setValue(ex.text)}
                className="panel group rounded-xl p-3 text-left transition hover:border-[var(--line-strong)] hover:bg-[var(--panel-2)]"
              >
                <div className="text-[10px] font-semibold tracking-[0.12em] text-[var(--ember)] uppercase">
                  {ex.tag}
                </div>
                <div className="mt-1.5 line-clamp-3 text-[12.5px] leading-relaxed text-[var(--text-dim)]">
                  {ex.text}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <Promise
            title="Three budgets"
            body="The same goal planned at $0, on a small budget, and with the paid stack. Switch between them and the whole plan changes."
          />
          <Promise
            title="Click-by-click"
            body="Not “set up payments”. The app, the menu path, the button, and what it should look like when it worked."
          />
          <Promise
            title="Prompts included"
            body="Where a step uses an AI tool, the exact prompt is written out, ready to copy."
          />
        </div>

        {demoMode && (
          <div
            className="mt-10 rounded-xl border px-4 py-3 text-[12.5px] leading-relaxed"
            style={{ borderColor: "#38bdf844", color: "var(--text-dim)" }}
          >
            <span className="font-semibold text-[var(--sky)]">Demo mode.</span>{" "}
            No <code className="text-[var(--text)]">ANTHROPIC_API_KEY</code> is
            set, so any prompt returns the bundled sample plan — the full
            product, no spend. Add a key to{" "}
            <code className="text-[var(--text)]">.env.local</code> to plan your
            own.
          </div>
        )}
      </div>
    </main>
  );
}

export function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="inline-block h-[18px] w-[18px] rounded-[5px]"
        style={{
          background:
            "conic-gradient(from 140deg, var(--ember), var(--violet), var(--teal), var(--ember))",
        }}
      />
      <span className="text-[15px] font-semibold tracking-[-0.02em]">
        wonder<span className="text-[var(--text-faint)]">which</span>
      </span>
    </div>
  );
}

function Promise({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel rounded-xl p-3.5">
      <div className="text-[13px] font-semibold">{title}</div>
      <div className="mt-1.5 text-[12px] leading-relaxed text-[var(--text-faint)]">
        {body}
      </div>
    </div>
  );
}
