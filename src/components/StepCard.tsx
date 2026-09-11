"use client";

import type { Step, TierId, Tool } from "@/lib/schema";
import { Badge, EffortBars } from "./ui";

export interface StepCardProps {
  step: Step;
  index: number;
  tier: TierId;
  accent: string;
  done: boolean;
  isNext: boolean;
  blocked: boolean;
  toolsById: Map<string, Tool>;
  onOpen: () => void;
}

/**
 * One step, as it appears on the map.
 *
 * The card answers three questions without being opened: how long, how hard,
 * and what it costs at the selected tier. Everything else is in the drawer --
 * a card that tries to show the click-by-click is a card nobody can scan.
 */
export function StepCard({
  step,
  index,
  tier,
  accent,
  done,
  isNext,
  blocked,
  toolsById,
  onOpen,
}: StepCardProps) {
  const variant = step.variants?.[tier];
  const tools = (variant?.tools ?? [])
    .map((id) => toolsById.get(id)?.name ?? id)
    .slice(0, 3);
  const actionCount = variant?.actions?.length ?? 0;

  return (
    <button
      onClick={onOpen}
      data-step-id={step.id}
      className="rise panel group relative w-full rounded-xl p-3.5 text-left transition hover:border-[var(--line-strong)] hover:bg-[var(--panel-2)]"
      style={{
        borderColor: isNext ? `${accent}66` : undefined,
        boxShadow: isNext
          ? `0 0 0 1px ${accent}33, 0 8px 30px -12px ${accent}55`
          : undefined,
        opacity: done ? 0.62 : blocked ? 0.82 : 1,
      }}
    >
      <span
        className="absolute top-0 left-3.5 h-[2px] w-8 rounded-b"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="grid h-5 w-5 shrink-0 place-items-center rounded-md text-[10px] font-bold tabular-nums"
            style={{
              background: done ? accent : "var(--panel-2)",
              color: done ? "#08090b" : "var(--text-faint)",
              border: done ? "none" : "1px solid var(--line)",
            }}
          >
            {done ? "✓" : index + 1}
          </span>
          {isNext && !done && (
            <span
              className="text-[9.5px] font-bold tracking-[0.12em] uppercase"
              style={{ color: accent }}
            >
              Start here
            </span>
          )}
        </div>
        <EffortBars level={step.effort} />
      </div>

      <h3
        className="mt-2 text-[14px] leading-snug font-semibold tracking-[-0.01em]"
        style={{ textDecoration: done ? "line-through" : undefined }}
      >
        {step.title}
      </h3>

      <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-[var(--text-faint)]">
        {step.why}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge>{step.time}</Badge>
        {variant?.cost && (
          <Badge color={accent} title={variant.cost}>
            <span className="block max-w-[11rem] truncate">{variant.cost}</span>
          </Badge>
        )}
        {actionCount > 0 && (
          <span className="text-[10.5px] text-[var(--text-faint)]">
            {actionCount} {actionCount === 1 ? "click" : "clicks"}
          </span>
        )}
      </div>

      {tools.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {tools.map((name) => (
            <span
              key={name}
              className="rounded border px-1.5 py-0.5 text-[10px] text-[var(--text-dim)]"
              style={{ borderColor: "var(--line)" }}
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
