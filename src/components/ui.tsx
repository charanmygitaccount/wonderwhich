"use client";

import { useEffect, useState } from "react";
import type { Accent, TierId } from "@/lib/schema";

/**
 * Accent colours can't be Tailwind class names because the phase decides them
 * at runtime, so they live here as values and get applied as inline styles.
 */
export const ACCENT: Record<Accent, string> = {
  ember: "#ff7a45",
  teal: "#2dd4bf",
  violet: "#a78bfa",
  lime: "#a3e635",
  rose: "#fb7185",
  sky: "#38bdf8",
};

export function accentOf(name: string | undefined): string {
  return ACCENT[(name as Accent) ?? "ember"] ?? ACCENT.ember;
}

export const TIER_META: Record<
  TierId,
  { label: string; blurb: string; dot: string }
> = {
  free: { label: "Free", blurb: "Zero spend", dot: "#a3e635" },
  lean: { label: "Lean", blurb: "Small budget", dot: "#38bdf8" },
  pro: { label: "Pro", blurb: "Paid stack", dot: "#a78bfa" },
};

export function Badge({
  children,
  color,
  title,
}: {
  children: React.ReactNode;
  color?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap"
      style={{
        borderColor: color ? `${color}44` : "var(--line)",
        color: color ?? "var(--text-dim)",
        background: color ? `${color}12` : "transparent",
      }}
    >
      {children}
    </span>
  );
}

/** Effort as three bars — readable at a glance in a dense card. */
export function EffortBars({ level }: { level: number }) {
  const labels = ["Easy", "Medium", "Hard"];
  const n = Math.min(3, Math.max(1, level || 1));
  return (
    <span
      className="inline-flex items-end gap-[3px]"
      title={`${labels[n - 1]} (${n}/3)`}
      aria-label={`Effort: ${labels[n - 1]}`}
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full"
          style={{
            height: `${4 + i * 3}px`,
            background: i <= n ? "var(--text-dim)" : "var(--line-strong)",
          }}
        />
      ))}
    </span>
  );
}

export function ProgressRing({
  done,
  total,
  size = 38,
}: {
  done: number;
  total: number;
  size?: number;
}) {
  const pct = total ? done / total : 0;
  const r = (size - 5) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span
      className="relative inline-flex items-center justify-center"
      title={`${done} of ${total} steps done`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--ember)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset .45s ease" }}
        />
      </svg>
      <span className="absolute text-[10px] font-semibold tabular-nums">
        {Math.round(pct * 100)}
      </span>
    </span>
  );
}

/**
 * The copy button on a `paste` block. This is the field users actually came
 * for -- a prompt they can drop straight into the tool -- so copying it is a
 * first-class action, not a hidden affordance.
 */
export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 1800);
    return () => clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("ok");
    } catch {
      // Clipboard access is blocked in some embeds; say so rather than lying.
      setState("fail");
    }
  }

  return (
    <button
      onClick={copy}
      className="rounded-md border px-2.5 py-1 text-[11px] font-medium transition hover:bg-white/5"
      style={{
        borderColor: state === "ok" ? "#a3e63566" : "var(--line)",
        color: state === "ok" ? "#a3e635" : "var(--text-dim)",
      }}
    >
      {state === "ok" ? "Copied" : state === "fail" ? "Press ⌘C" : "Copy"}
    </button>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-[var(--text-faint)]">
      <span
        className="pulse-dot inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--ember)" }}
      />
      {label}
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-[var(--text-faint)] uppercase">
      {children}
    </div>
  );
}
