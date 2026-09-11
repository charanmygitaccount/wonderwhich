"use client";

import { useMemo, useState } from "react";
import type { Blueprint, Step, TierId } from "@/lib/schema";
import { TIER_IDS } from "@/lib/schema";
import { useProgress } from "@/lib/progress";
import type { StreamPhase } from "@/lib/useBlueprintStream";
import { MapView } from "./MapView";
import { TimelineView } from "./TimelineView";
import { StackView } from "./StackView";
import { MoneyView } from "./MoneyView";
import { StepDrawer } from "./StepDrawer";
import { Wordmark } from "./Launch";
import { accentOf, ProgressRing, Spinner, TIER_META } from "./ui";

const VIEWS = [
  { id: "map", label: "Map" },
  { id: "timeline", label: "Timeline" },
  { id: "stack", label: "Tools" },
  { id: "money", label: "Money" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

export function Board({
  blueprint,
  phase,
  mode,
  error,
  onRestart,
  onRetry,
}: {
  blueprint: Partial<Blueprint>;
  phase: StreamPhase;
  mode: "demo" | "live" | null;
  error: string | null;
  onRestart: () => void;
  onRetry: () => void;
}) {
  const [tier, setTier] = useState<TierId>("free");
  const [view, setView] = useState<ViewId>("map");
  const [openStepId, setOpenStepId] = useState<string | null>(null);

  const planKey = blueprint.title ?? "untitled";
  const progress = useProgress(planKey, blueprint);

  const steps = useMemo(
    () =>
      (blueprint.steps ?? []).filter((s): s is Step =>
        Boolean(s?.id && s?.title),
      ),
    [blueprint.steps],
  );

  const openIndex = steps.findIndex((s) => s.id === openStepId);
  const openStep = openIndex >= 0 ? steps[openIndex] : null;
  const openAccent = accentOf(
    blueprint.phases?.find((p) => p?.id === openStep?.phase)?.accent,
  );

  const doneCount = progress.countDone(tier);
  const streaming = phase === "streaming";

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-xl"
        style={{
          borderColor: "var(--line)",
          background: "color-mix(in srgb, var(--ink) 88%, transparent)",
        }}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <button onClick={onRestart} title="Start a new plan">
            <Wordmark />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[14px] font-semibold tracking-[-0.01em]">
              {blueprint.title ?? "Building your plan…"}
            </h1>
            {blueprint.tagline && (
              <p className="truncate text-[11.5px] text-[var(--text-faint)]">
                {blueprint.tagline}
              </p>
            )}
          </div>

          {mode === "demo" && (
            <span
              className="rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] uppercase"
              style={{ borderColor: "#38bdf855", color: "var(--sky)" }}
              title="No API key set — this is the bundled sample plan."
            >
              Demo
            </span>
          )}

          <div
            className="inline-flex rounded-lg border p-0.5"
            style={{ borderColor: "var(--line)" }}
          >
            {TIER_IDS.map((id) => {
              const active = id === tier;
              const meta = TIER_META[id];
              return (
                <button
                  key={id}
                  onClick={() => setTier(id)}
                  title={meta.blurb}
                  className="rounded-md px-2.5 py-1.5 text-[12px] font-medium transition"
                  style={{
                    background: active ? "var(--panel-2)" : "transparent",
                    color: active ? "var(--text)" : "var(--text-faint)",
                  }}
                >
                  <span
                    className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                    style={{
                      background: active ? meta.dot : "var(--line-strong)",
                    }}
                  />
                  {meta.label}
                </button>
              );
            })}
          </div>

          <ProgressRing done={doneCount} total={steps.length} />

          <button
            onClick={onRestart}
            className="rounded-lg border px-3 py-1.5 text-[12px] font-medium text-[var(--text-dim)] transition hover:bg-white/5"
            style={{ borderColor: "var(--line)" }}
          >
            New plan
          </button>
        </div>

        <div
          className="flex items-center gap-1 border-t px-4 sm:px-6"
          style={{ borderColor: "var(--line)" }}
        >
          {VIEWS.map((v) => {
            const active = v.id === view;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className="relative px-3 py-2.5 text-[12.5px] font-medium transition"
                style={{ color: active ? "var(--text)" : "var(--text-faint)" }}
              >
                {v.label}
                {active && (
                  <span
                    className="absolute inset-x-2 -bottom-px h-[2px] rounded-full"
                    style={{ background: "var(--ember)" }}
                  />
                )}
              </button>
            );
          })}

          <div className="ml-auto py-2">
            {streaming ? (
              <Spinner
                label={`Building… ${steps.length} steps, ${blueprint.tools?.length ?? 0} tools so far`}
              />
            ) : (
              <span className="text-[11px] text-[var(--text-faint)]">
                {doneCount} of {steps.length} done
              </span>
            )}
          </div>
        </div>

        {streaming && (
          <div
            className="sweep relative h-[2px] overflow-hidden"
            style={{ background: "var(--line)" }}
          />
        )}
      </header>

      {error && (
        <div
          className="mx-4 mt-4 flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 sm:mx-6"
          style={{
            borderColor: "#fb718544",
            background: "rgba(251,113,133,0.06)",
          }}
        >
          <span className="text-[13px] text-[var(--text-dim)]">{error}</span>
          <button
            onClick={onRetry}
            className="rounded-lg border px-3 py-1.5 text-[12px] font-medium transition hover:bg-white/5"
            style={{ borderColor: "var(--line)" }}
          >
            Try again
          </button>
        </div>
      )}

      {(blueprint.outcome || blueprint.totalTime) && (
        <section className="px-4 pt-5 pb-4 sm:px-6">
          <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
            {blueprint.outcome && (
              <div className="max-w-2xl">
                <div className="text-[10px] font-semibold tracking-[0.14em] text-[var(--text-faint)] uppercase">
                  What you'll have at the end
                </div>
                <p className="mt-1.5 text-[15px] leading-snug font-medium tracking-[-0.01em]">
                  {blueprint.outcome}
                </p>
              </div>
            )}
            <div className="flex gap-8">
              {blueprint.totalTime && (
                <Stat label="Time" value={blueprint.totalTime} />
              )}
              <Stat label="Steps" value={String(steps.length)} />
              <Stat
                label="Tools"
                value={String(blueprint.tools?.length ?? 0)}
              />
            </div>
          </div>
          {blueprint.audience && (
            <p className="mt-3 max-w-2xl text-[12px] leading-relaxed text-[var(--text-faint)]">
              <span className="text-[var(--text-dim)]">Written for: </span>
              {blueprint.audience}
            </p>
          )}
        </section>
      )}

      <main className="min-h-0 flex-1">
        {view === "map" && (
          <MapView
            blueprint={blueprint}
            tier={tier}
            isStepDone={progress.isStepDone}
            answers={progress.answers}
            onAnswer={progress.answerCheckpoint}
            onOpenStep={setOpenStepId}
          />
        )}
        {view === "timeline" && (
          <TimelineView
            blueprint={blueprint}
            tier={tier}
            isStepDone={progress.isStepDone}
            onOpenStep={setOpenStepId}
          />
        )}
        {view === "stack" && <StackView blueprint={blueprint} tier={tier} />}
        {view === "money" && (
          <MoneyView blueprint={blueprint} tier={tier} onTier={setTier} />
        )}
      </main>

      {openStep && (
        <StepDrawer
          step={openStep}
          blueprint={blueprint}
          tier={tier}
          accent={openAccent}
          index={openIndex}
          total={steps.length}
          ticks={progress.ticks}
          onToggleTick={progress.toggle}
          onTier={setTier}
          onClose={() => setOpenStepId(null)}
          onNavigate={(delta) => {
            const next = steps[openIndex + delta];
            if (next) setOpenStepId(next.id);
          }}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.14em] text-[var(--text-faint)] uppercase">
        {label}
      </div>
      <div className="mt-1.5 text-[15px] font-medium tracking-[-0.01em]">
        {value}
      </div>
    </div>
  );
}
