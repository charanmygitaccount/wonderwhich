"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { Blueprint, Step, TierId, Tool } from "@/lib/schema";
import { StepCard } from "./StepCard";
import { accentOf } from "./ui";

interface Edge {
  from: string;
  to: string;
  color: string;
}

interface Line extends Edge {
  d: string;
}

/**
 * The map: phases as columns, steps as cards, dependencies as drawn curves.
 *
 * The curves are measured from the DOM rather than computed from a layout model
 * because the cards stream in and reflow -- measuring is the only thing that
 * stays correct while the plan is still arriving.
 */
export function MapView({
  blueprint,
  tier,
  isStepDone,
  answers,
  onAnswer,
  onOpenStep,
}: {
  blueprint: Partial<Blueprint>;
  tier: TierId;
  isStepDone: (stepId: string, tier: TierId) => boolean;
  answers: Record<string, string>;
  onAnswer: (checkpointId: string, option: string) => void;
  onOpenStep: (stepId: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [edges, setEdges] = useState({ left: false, right: false });

  const phases = (blueprint.phases ?? []).filter((p) => p?.id && p?.name);
  const steps = (blueprint.steps ?? []).filter((s): s is Step =>
    Boolean(s?.id && s?.title),
  );
  const checkpoints = (blueprint.checkpoints ?? []).filter(
    (c) => c?.id && c?.question,
  );
  const toolsById = new Map<string, Tool>(
    (blueprint.tools ?? [])
      .filter((t): t is Tool => Boolean(t?.id))
      .map((t) => [t.id, t]),
  );

  const stepIndex = new Map(steps.map((s, i) => [s.id, i]));
  const doneSet = new Set(
    steps.filter((s) => isStepDone(s.id, tier)).map((s) => s.id),
  );

  /** First unfinished step whose dependencies are all met. */
  const nextId = steps.find(
    (s) =>
      !doneSet.has(s.id) &&
      (s.dependsOn ?? []).every((d) => doneSet.has(d) || !stepIndex.has(d)),
  )?.id;

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const base = canvas.getBoundingClientRect();
    setSize({ w: canvas.scrollWidth, h: canvas.scrollHeight });

    const rectOf = (id: string) => {
      const el = canvas.querySelector<HTMLElement>(
        `[data-step-id="${CSS.escape(id)}"]`,
      );
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left: r.left - base.left,
        right: r.right - base.left,
        top: r.top - base.top,
        mid: r.top - base.top + r.height / 2,
      };
    };

    const next: Line[] = [];
    for (const step of steps) {
      for (const depId of step.dependsOn ?? []) {
        const a = rectOf(depId);
        const b = rectOf(step.id);
        if (!a || !b) continue;

        const x1 = a.right;
        const y1 = a.mid;
        const x2 = b.left;
        const y2 = b.mid;
        // Backward edges (same or earlier column) would cut across cards, so
        // they're skipped -- the drawer still lists them as prerequisites.
        if (x2 <= x1 + 4) continue;

        const dx = Math.max(28, (x2 - x1) * 0.5);
        next.push({
          from: depId,
          to: step.id,
          color: accentOf(
            phases.find(
              (p) => p.id === steps.find((s) => s.id === depId)?.phase,
            )?.accent,
          ),
          d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`,
        });
      }
    }
    setLines(next);
    // Re-measuring depends on the rendered DOM, not just these values, but they
    // are what change it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length, phases.length, tier]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(canvas);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const syncEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 8,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    syncEdges();
  }, [syncEdges, steps.length, phases.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // A vertical wheel over a horizontal board should move the board. Trackpad
    // users get this free; mouse users otherwise can't reach the last phase.
    function onWheel(e: WheelEvent) {
      const node = scrollRef.current;
      if (!node) return;
      if (e.deltaX !== 0 || Math.abs(e.deltaY) < 2) return;
      const atStart = node.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd =
        node.scrollLeft + node.clientWidth >= node.scrollWidth && e.deltaY > 0;
      if (atStart || atEnd) return; // let the page scroll past the board
      e.preventDefault();
      node.scrollLeft += e.deltaY;
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", syncEdges, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", syncEdges);
    };
    // The scroller doesn't exist until the first phase arrives, so this has to
    // re-run when the board appears -- not just on mount.
  }, [syncEdges, phases.length]);

  if (!phases.length) {
    return (
      <div className="px-5 py-16 text-center text-[13px] text-[var(--text-faint)]">
        Laying out the phases…
      </div>
    );
  }

  return (
    <div className="relative">
      <EdgeFade side="left" show={edges.left} />
      <EdgeFade side="right" show={edges.right} />
      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden px-4 pb-6 sm:px-6"
      >
        <div
          ref={canvasRef}
          className="relative flex min-w-max items-start gap-5 pt-2"
        >
          <svg
            className="pointer-events-none absolute top-0 left-0 z-0"
            width={size.w}
            height={size.h}
            aria-hidden="true"
          >
            {lines.map((l) => (
              <path
                key={`${l.from}->${l.to}`}
                d={l.d}
                fill="none"
                stroke={l.color}
                strokeWidth="1.5"
                strokeOpacity="0.38"
                strokeDasharray="3 4"
              />
            ))}
          </svg>

          {phases.map((phase, pi) => {
            const accent = accentOf(phase.accent);
            const phaseSteps = steps.filter((s) => s.phase === phase.id);
            const phaseDone = phaseSteps.filter((s) =>
              doneSet.has(s.id),
            ).length;

            return (
              <section
                key={phase.id}
                className="relative z-[1] w-[290px] shrink-0 sm:w-[310px]"
              >
                <header className="mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="grid h-6 w-6 place-items-center rounded-md text-[11px] font-bold tabular-nums"
                      style={{ background: `${accent}1f`, color: accent }}
                    >
                      {pi + 1}
                    </span>
                    <h2 className="text-[14px] font-semibold tracking-[-0.01em]">
                      {phase.name}
                    </h2>
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-[var(--text-faint)]">
                    {phase.goal}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="h-[3px] flex-1 overflow-hidden rounded-full"
                      style={{ background: "var(--line)" }}
                    >
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{
                          width: phaseSteps.length
                            ? `${(phaseDone / phaseSteps.length) * 100}%`
                            : "0%",
                          background: accent,
                        }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums text-[var(--text-faint)]">
                      {phaseDone}/{phaseSteps.length}
                    </span>
                  </div>
                </header>

                <div className="space-y-2.5">
                  {phaseSteps.map((step) => {
                    const blocked = (step.dependsOn ?? []).some(
                      (d) => stepIndex.has(d) && !doneSet.has(d),
                    );
                    return (
                      <div key={step.id}>
                        <StepCard
                          step={step}
                          index={stepIndex.get(step.id) ?? 0}
                          tier={tier}
                          accent={accent}
                          done={doneSet.has(step.id)}
                          isNext={step.id === nextId}
                          blocked={blocked}
                          toolsById={toolsById}
                          onOpen={() => onOpenStep(step.id)}
                        />
                        {checkpoints
                          .filter((c) => c.afterStep === step.id)
                          .map((c) => (
                            <CheckpointCard
                              key={c.id}
                              checkpoint={c}
                              chosen={answers[c.id]}
                              onAnswer={(opt) => onAnswer(c.id, opt)}
                            />
                          ))}
                      </div>
                    );
                  })}
                  {!phaseSteps.length && (
                    <div
                      className="rounded-xl border border-dashed p-4 text-[11.5px] text-[var(--text-faint)]"
                      style={{ borderColor: "var(--line)" }}
                    >
                      Steps arriving…
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Tells you there is more plan off-screen. Without this the board looks like it
 * simply ends at the viewport edge.
 */
function EdgeFade({ side, show }: { side: "left" | "right"; show: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-20 w-14 transition-opacity duration-300"
      style={{
        [side]: 0,
        opacity: show ? 1 : 0,
        background: `linear-gradient(to ${side}, transparent, var(--ink))`,
      }}
    />
  );
}

/**
 * A fork in the plan, drawn inline where it actually happens.
 *
 * This is the "ask me in the middle" part: the honest answer to some questions
 * is "it depends", and the plan says what it depends on and what each answer
 * changes, instead of guessing on the user's behalf.
 */
function CheckpointCard({
  checkpoint,
  chosen,
  onAnswer,
}: {
  checkpoint: NonNullable<Blueprint["checkpoints"]>[number];
  chosen?: string;
  onAnswer: (option: string) => void;
}) {
  const picked = (checkpoint.options ?? []).find((o) => o.label === chosen);

  return (
    <div
      className="rise mt-2.5 rounded-xl border p-3.5"
      style={{
        borderColor: "#a78bfa4d",
        background:
          "linear-gradient(180deg, rgba(167,139,250,0.09), rgba(167,139,250,0.03))",
      }}
    >
      <div className="text-[9.5px] font-bold tracking-[0.14em] text-[var(--violet)] uppercase">
        Decision point
      </div>
      <div className="mt-1.5 text-[13px] leading-snug font-semibold">
        {checkpoint.question}
      </div>
      <div className="mt-1 text-[11px] leading-relaxed text-[var(--text-faint)]">
        {checkpoint.why}
      </div>

      <div className="mt-2.5 space-y-1.5">
        {(checkpoint.options ?? []).map((opt) => {
          const active = opt.label === chosen;
          return (
            <button
              key={opt.label}
              onClick={() => onAnswer(opt.label)}
              className="w-full rounded-lg border px-2.5 py-1.5 text-left text-[11.5px] transition hover:bg-white/5"
              style={{
                borderColor: active ? "var(--violet)" : "var(--line)",
                background: active ? "rgba(167,139,250,0.12)" : "transparent",
                color: active ? "var(--text)" : "var(--text-dim)",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {picked && (
        <div
          className="mt-2.5 rounded-lg px-2.5 py-2 text-[11.5px] leading-relaxed"
          style={{ background: "rgba(167,139,250,0.1)", color: "var(--text)" }}
        >
          <span className="font-semibold text-[var(--violet)]">Then: </span>
          {picked.then}
        </div>
      )}
    </div>
  );
}
