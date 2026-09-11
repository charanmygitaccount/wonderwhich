"use client";

import { useState } from "react";
import type { Clarify } from "@/lib/schema";
import { Wordmark } from "./Launch";

/**
 * Intake asks the few questions that actually change the plan, as cards.
 *
 * It is deliberately not a chat: a beginner does not know what they are
 * supposed to say back. Picking from options they recognise about themselves
 * gets better answers than a blinking cursor does.
 */
export function Intake({
  clarify,
  onDone,
  onBack,
}: {
  clarify: Clarify;
  onDone: (answers: string[]) => void;
  onBack: () => void;
}) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [custom, setCustom] = useState<Record<string, string>>({});

  const questions = clarify.questions ?? [];
  const answeredCount = questions.filter(
    (q) => picked[q.id] || custom[q.id]?.trim(),
  ).length;

  function submit() {
    const answers = questions
      .map((q) => {
        const value = custom[q.id]?.trim() || picked[q.id];
        return value ? `${q.question} — ${value}` : null;
      })
      .filter((a): a is string => Boolean(a));
    onDone(answers);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-10 pb-24 sm:pt-16">
      <div className="rise">
        <Wordmark />

        <div className="mt-8">
          <div className="text-[10px] font-semibold tracking-[0.14em] text-[var(--text-faint)] uppercase">
            Here's what we understood
          </div>
          <p className="mt-2 text-[17px] leading-snug font-medium tracking-[-0.01em]">
            {clarify.read}
          </p>
        </div>

        <p className="mt-5 text-[13px] leading-relaxed text-[var(--text-dim)]">
          {questions.length} quick questions. Each one changes the plan — skip
          any that don't apply, or skip all of them and we'll assume you're
          starting from scratch with no budget.
        </p>

        <div className="mt-7 space-y-3">
          {questions.map((q, qi) => (
            <div key={q.id} className="panel rounded-xl p-4">
              <div className="flex items-baseline gap-2.5">
                <span className="text-[11px] font-semibold tabular-nums text-[var(--text-faint)]">
                  {String(qi + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[14.5px] leading-snug font-medium">
                    {q.question}
                  </div>
                  <div className="mt-1 text-[11.5px] text-[var(--text-faint)]">
                    {q.why}
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex flex-wrap gap-2">
                {(q.options ?? []).map((opt) => {
                  const active = picked[q.id] === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      title={opt.hint}
                      onClick={() =>
                        setPicked((p) => {
                          const next = { ...p };
                          if (next[q.id] === opt.label) delete next[q.id];
                          else next[q.id] = opt.label;
                          return next;
                        })
                      }
                      className="rounded-lg border px-3 py-2 text-left text-[12.5px] transition"
                      style={{
                        borderColor: active ? "var(--ember)" : "var(--line)",
                        background: active
                          ? "rgba(255,122,69,0.1)"
                          : "transparent",
                        color: active ? "var(--text)" : "var(--text-dim)",
                      }}
                    >
                      <span className="block font-medium">{opt.label}</span>
                      <span className="mt-0.5 block text-[11px] text-[var(--text-faint)]">
                        {opt.hint}
                      </span>
                    </button>
                  );
                })}
              </div>

              {q.allowCustom && (
                <input
                  value={custom[q.id] ?? ""}
                  onChange={(e) =>
                    setCustom((c) => ({ ...c, [q.id]: e.target.value }))
                  }
                  placeholder="Or type your own answer"
                  maxLength={200}
                  className="mt-2.5 w-full rounded-lg border bg-transparent px-3 py-2 text-[12.5px] outline-none placeholder:text-[var(--text-faint)]"
                  style={{ borderColor: "var(--line)" }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            onClick={submit}
            className="rounded-lg px-4 py-2.5 text-[13px] font-semibold text-black"
            style={{ background: "var(--ember)" }}
          >
            Build my plan
          </button>
          <button
            onClick={() => onDone([])}
            className="rounded-lg border px-4 py-2.5 text-[13px] font-medium text-[var(--text-dim)] transition hover:bg-white/5"
            style={{ borderColor: "var(--line)" }}
          >
            Skip — just build it
          </button>
          <button
            onClick={onBack}
            className="text-[12.5px] text-[var(--text-faint)] underline underline-offset-4 transition hover:text-[var(--text-dim)]"
          >
            Change what I asked for
          </button>
          <span className="ml-auto text-[11px] text-[var(--text-faint)]">
            {answeredCount} of {questions.length} answered
          </span>
        </div>
      </div>
    </main>
  );
}
