"use client";

import type { Blueprint, Step, TierId } from "@/lib/schema";
import { formatMinutes, parseMinutes } from "@/lib/estimate";
import { accentOf } from "./ui";

/**
 * The plan as elapsed effort, laid end to end.
 *
 * Bars are hands-on time, not calendar time -- the honest answer to "how long
 * will this take me" is hours of work, and stretching it over a calendar
 * invents a schedule the user never agreed to.
 */
export function TimelineView({
  blueprint,
  tier,
  isStepDone,
  onOpenStep,
}: {
  blueprint: Partial<Blueprint>;
  tier: TierId;
  isStepDone: (stepId: string, tier: TierId) => boolean;
  onOpenStep: (stepId: string) => void;
}) {
  const phases = (blueprint.phases ?? []).filter((p) => p?.id);
  const steps = (blueprint.steps ?? []).filter((s): s is Step =>
    Boolean(s?.id && s?.title),
  );

  const measured = steps.map((s) => ({
    step: s,
    minutes: parseMinutes(s.time),
  }));
  const known = measured.filter((m) => m.minutes !== null);
  const fallback = known.length
    ? Math.round(known.reduce((a, m) => a + (m.minutes ?? 0), 0) / known.length)
    : 60;

  const withTime = measured.map((m) => ({
    ...m,
    minutes: m.minutes ?? fallback,
    estimated: m.minutes === null,
  }));
  const total = withTime.reduce((a, m) => a + m.minutes, 0) || 1;

  let cursor = 0;
  const rows = withTime.map((m) => {
    const start = cursor;
    cursor += m.minutes;
    return { ...m, start };
  });

  if (!rows.length) {
    return (
      <div className="px-5 py-16 text-center text-[13px] text-[var(--text-faint)]">
        Working out the timings…
      </div>
    );
  }

  return (
    <div className="px-4 pb-10 sm:px-6">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-[13px] text-[var(--text-dim)]">
          <span className="font-semibold text-[var(--text)]">
            {formatMinutes(total)}
          </span>{" "}
          of hands-on work across {rows.length} steps
        </span>
        <span className="text-[11px] text-[var(--text-faint)]">
          Calendar time depends on how many hours a week you have.
        </span>
      </div>

      <div className="space-y-4">
        {phases.map((phase) => {
          const accent = accentOf(phase.accent);
          const phaseRows = rows.filter((r) => r.step.phase === phase.id);
          if (!phaseRows.length) return null;
          const phaseMinutes = phaseRows.reduce((a, r) => a + r.minutes, 0);

          return (
            <section key={phase.id}>
              <div className="mb-2 flex items-baseline gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: accent }}
                />
                <h3 className="text-[13px] font-semibold">{phase.name}</h3>
                <span className="text-[11px] text-[var(--text-faint)]">
                  {formatMinutes(phaseMinutes)}
                </span>
              </div>

              <div className="space-y-1">
                {phaseRows.map((row) => {
                  const done = isStepDone(row.step.id, tier);
                  return (
                    <button
                      key={row.step.id}
                      onClick={() => onOpenStep(row.step.id)}
                      className="group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition hover:bg-white/5"
                    >
                      <span
                        className="w-[140px] shrink-0 truncate text-[12px] sm:w-[220px]"
                        style={{
                          color: done ? "var(--text-faint)" : "var(--text)",
                          textDecoration: done ? "line-through" : undefined,
                        }}
                      >
                        {row.step.title}
                      </span>

                      <span className="relative h-5 min-w-0 flex-1 overflow-hidden rounded">
                        <span
                          className="absolute inset-y-0 rounded"
                          style={{
                            left: `${(row.start / total) * 100}%`,
                            width: `${Math.max(1.5, (row.minutes / total) * 100)}%`,
                            background: done ? `${accent}40` : accent,
                            opacity: row.estimated ? 0.45 : 1,
                          }}
                        />
                      </span>

                      <span
                        title={row.step.time}
                        className="w-[92px] shrink-0 truncate text-right text-[11px] text-[var(--text-faint)]"
                      >
                        {row.estimated ? "~" : ""}
                        {row.step.time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
