"use client";

import { useEffect } from "react";
import type { Blueprint, Step, TierId, Tool } from "@/lib/schema";
import { tickKey } from "@/lib/progress";
import { Badge, CopyButton, EffortBars, SectionLabel, TIER_META } from "./ui";
import { TIER_IDS } from "@/lib/schema";

/**
 * The walkthrough. Everything above this is navigation; this is the product.
 *
 * Each action is rendered as app → path → click → what you should see, because
 * that is the shape of an instruction someone can follow with the app open in
 * the next tab. The `paste` block is given the most visual weight on purpose:
 * for AI steps it is the entire value of the step.
 */
export function StepDrawer({
  step,
  blueprint,
  tier,
  accent,
  index,
  total,
  ticks,
  onToggleTick,
  onTier,
  onClose,
  onNavigate,
}: {
  step: Step;
  blueprint: Partial<Blueprint>;
  tier: TierId;
  accent: string;
  index: number;
  total: number;
  ticks: Set<string>;
  onToggleTick: (key: string) => void;
  onTier: (tier: TierId) => void;
  onClose: () => void;
  onNavigate: (delta: number) => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onNavigate]);

  const variant = step.variants?.[tier];
  const toolsById = new Map<string, Tool>(
    (blueprint.tools ?? [])
      .filter((t): t is Tool => Boolean(t?.id))
      .map((t) => [t.id, t]),
  );
  const prereqs = (step.dependsOn ?? [])
    .map((id) => blueprint.steps?.find((s) => s?.id === id)?.title)
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close walkthrough"
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={step.title}
        className="rise relative flex h-full w-full max-w-[560px] flex-col border-l"
        style={{ background: "var(--ink-raised)", borderColor: "var(--line)" }}
      >
        <header
          className="flex items-start gap-3 border-b px-5 py-4"
          style={{ borderColor: "var(--line)" }}
        >
          <span
            className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[12px] font-bold tabular-nums"
            style={{ background: `${accent}1f`, color: accent }}
          >
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] leading-snug font-semibold tracking-[-0.015em]">
              {step.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge>{step.time}</Badge>
              {variant?.cost && (
                <Badge color={accent} title={variant.cost}>
                  <span className="block max-w-[13rem] truncate">
                    {variant.cost}
                  </span>
                </Badge>
              )}
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--text-faint)]">
                <EffortBars level={step.effort} />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <NavButton
              label="Previous step"
              onClick={() => onNavigate(-1)}
              disabled={index <= 0}
            >
              ‹
            </NavButton>
            <NavButton
              label="Next step"
              onClick={() => onNavigate(1)}
              disabled={index >= total - 1}
            >
              ›
            </NavButton>
            <NavButton label="Close" onClick={onClose}>
              ✕
            </NavButton>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <p className="text-[13.5px] leading-relaxed text-[var(--text-dim)]">
            {step.why}
          </p>

          <div
            className="mt-3 rounded-lg border-l-2 py-1.5 pl-3 text-[13px] leading-relaxed"
            style={{ borderColor: accent }}
          >
            <span className="text-[var(--text-faint)]">
              When this is done:{" "}
            </span>
            {step.outcome}
          </div>

          {prereqs.length > 0 && (
            <div className="mt-3 text-[11.5px] text-[var(--text-faint)]">
              Do these first: {prereqs.join(" · ")}
            </div>
          )}

          {/* Tier switch lives here too: the budget question is most concrete
              while looking at what you'd actually have to do. */}
          <div className="mt-5">
            <SectionLabel>Budget</SectionLabel>
            <div
              className="inline-flex rounded-lg border p-0.5"
              style={{ borderColor: "var(--line)" }}
            >
              {TIER_IDS.map((id) => {
                const active = id === tier;
                return (
                  <button
                    key={id}
                    onClick={() => onTier(id)}
                    className="rounded-md px-3 py-1.5 text-[12px] font-medium transition"
                    style={{
                      background: active ? "var(--panel-2)" : "transparent",
                      color: active ? "var(--text)" : "var(--text-faint)",
                    }}
                  >
                    {TIER_META[id].label}
                  </button>
                );
              })}
            </div>
            {variant?.tradeoff && (
              <p className="mt-2.5 text-[12px] leading-relaxed text-[var(--text-dim)]">
                {variant.tradeoff}
              </p>
            )}
          </div>

          {variant?.actions?.length ? (
            <div className="mt-6">
              <SectionLabel>Do this, in order</SectionLabel>
              <ol className="space-y-3">
                {variant.actions.map((action, i) => (
                  <li
                    key={i}
                    className="panel relative rounded-xl p-3.5 pl-11"
                    style={{ background: "var(--panel)" }}
                  >
                    <span
                      className="absolute top-3.5 left-3.5 grid h-6 w-6 place-items-center rounded-md text-[11px] font-bold tabular-nums"
                      style={{ background: "var(--panel-2)", color: accent }}
                    >
                      {i + 1}
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className="rounded px-1.5 py-0.5 text-[10.5px] font-semibold"
                        style={{ background: `${accent}1f`, color: accent }}
                      >
                        {action.app}
                      </span>
                      {action.where && (
                        <span className="text-[11px] text-[var(--text-faint)]">
                          {action.where}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-[13.5px] leading-snug font-medium">
                      {action.do}
                    </div>

                    {action.detail && (
                      <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--text-dim)]">
                        {action.detail}
                      </p>
                    )}

                    {action.paste && (
                      <div
                        className="mt-2.5 rounded-lg border"
                        style={{
                          borderColor: "var(--line)",
                          background: "var(--ink)",
                        }}
                      >
                        <div
                          className="flex items-center justify-between border-b px-2.5 py-1.5"
                          style={{ borderColor: "var(--line)" }}
                        >
                          <span className="text-[10px] font-semibold tracking-[0.1em] text-[var(--text-faint)] uppercase">
                            Copy this
                          </span>
                          <CopyButton text={action.paste} />
                        </div>
                        <pre className="max-h-60 overflow-auto px-2.5 py-2.5 text-[11.5px] leading-relaxed whitespace-pre-wrap text-[var(--text-dim)]">
                          {action.paste}
                        </pre>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {variant?.doneWhen?.length ? (
            <div className="mt-6">
              <SectionLabel>You're done when</SectionLabel>
              <div className="space-y-1.5">
                {variant.doneWhen.map((condition, i) => {
                  const key = tickKey(step.id, tier, i);
                  const checked = ticks.has(key);
                  return (
                    <label
                      key={key}
                      className="flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 transition hover:bg-white/5"
                      style={{
                        borderColor: checked ? `${accent}55` : "var(--line)",
                        background: checked ? `${accent}0f` : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleTick(key)}
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[var(--ember)]"
                      />
                      <span
                        className="text-[12.5px] leading-relaxed"
                        style={{
                          color: checked ? "var(--text-faint)" : "var(--text)",
                          textDecoration: checked ? "line-through" : undefined,
                        }}
                      >
                        {condition}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}

          {variant?.pitfalls?.length ? (
            <div className="mt-6">
              <SectionLabel>Where people get this wrong</SectionLabel>
              <ul className="space-y-1.5">
                {variant.pitfalls.map((pitfall, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 rounded-lg border px-3 py-2.5 text-[12.5px] leading-relaxed"
                    style={{
                      borderColor: "#fb718533",
                      background: "rgba(251,113,133,0.05)",
                      color: "var(--text-dim)",
                    }}
                  >
                    <span className="text-[var(--rose)]">!</span>
                    {pitfall}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {variant?.tools?.length ? (
            <div className="mt-6 mb-2">
              <SectionLabel>Tools in this step</SectionLabel>
              <div className="grid gap-2">
                {variant.tools.map((id) => {
                  const tool = toolsById.get(id);
                  if (!tool) return null;
                  return (
                    <a
                      key={id}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="panel rounded-lg p-3 transition hover:border-[var(--line-strong)]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-semibold">
                          {tool.name}
                        </span>
                        <span className="text-[11px] text-[var(--text-faint)]">
                          {tool.price} ↗
                        </span>
                      </div>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--text-dim)]">
                        {tool.what}
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--text-faint)]">
                        Free plan: {tool.freeTier}
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function NavButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-7 w-7 place-items-center rounded-md border text-[13px] text-[var(--text-dim)] transition hover:bg-white/5 disabled:opacity-25"
      style={{ borderColor: "var(--line)" }}
    >
      {children}
    </button>
  );
}
