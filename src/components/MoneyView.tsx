"use client";

import type { Blueprint, TierId, Tool } from "@/lib/schema";
import { parseMoney } from "@/lib/estimate";
import { SectionLabel, TIER_META } from "./ui";
import { TIER_IDS } from "@/lib/schema";

/**
 * What each route actually costs, side by side.
 *
 * Bars are drawn only when every tier quotes a number we can read. When the
 * plan prices something as "transaction fees only", that is the honest answer
 * and it gets shown as text rather than converted into a fake bar.
 */
export function MoneyView({
  blueprint,
  tier,
  onTier,
}: {
  blueprint: Partial<Blueprint>;
  tier: TierId;
  onTier: (tier: TierId) => void;
}) {
  const tiers = (blueprint.tiers ?? []).filter((t) => t?.id);
  const tools = (blueprint.tools ?? []).filter((t): t is Tool =>
    Boolean(t?.id),
  );

  const amounts = tiers.map((t) => parseMoney(t.budget));
  const canChart = amounts.length > 1 && amounts.every((a) => a !== null);
  const max = canChart ? Math.max(...(amounts as number[]), 1) : 0;

  function toolsAt(tierId: TierId): Tool[] {
    const used = new Set<string>();
    for (const step of blueprint.steps ?? []) {
      for (const id of step?.variants?.[tierId]?.tools ?? []) used.add(id);
    }
    return tools.filter((t) => used.has(t.id));
  }

  if (!tiers.length) {
    return (
      <div className="px-5 py-16 text-center text-[13px] text-[var(--text-faint)]">
        Costing the routes…
      </div>
    );
  }

  return (
    <div className="px-4 pb-10 sm:px-6">
      <SectionLabel>Three routes to the same outcome</SectionLabel>

      <div className="grid gap-3 lg:grid-cols-3">
        {tiers.map((t, i) => {
          const active = t.id === tier;
          const meta = TIER_META[t.id as TierId] ?? TIER_META.free;
          const amount = amounts[i];
          const stack = toolsAt(t.id as TierId);

          return (
            <button
              key={t.id}
              onClick={() => onTier(t.id as TierId)}
              className="panel rise rounded-xl p-4 text-left transition hover:border-[var(--line-strong)]"
              style={{
                borderColor: active ? `${meta.dot}66` : undefined,
                background: active ? "var(--panel-2)" : undefined,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: meta.dot }}
                />
                <span className="text-[13px] font-semibold">{t.label}</span>
                {active && (
                  <span className="ml-auto text-[10px] font-bold tracking-[0.1em] text-[var(--text-faint)] uppercase">
                    Selected
                  </span>
                )}
              </div>

              <div className="mt-3 text-[26px] leading-none font-semibold tracking-[-0.03em]">
                {t.budget}
              </div>

              {canChart && (
                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full"
                  style={{ background: "var(--line)" }}
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${Math.max(3, ((amount ?? 0) / max) * 100)}%`,
                      background: meta.dot,
                    }}
                  />
                </div>
              )}

              <p className="mt-3 text-[12px] leading-relaxed text-[var(--text-dim)]">
                {t.summary}
              </p>

              <p className="mt-2.5 text-[11.5px] leading-relaxed text-[var(--text-faint)]">
                <span className="text-[var(--text-dim)]">Pick this when: </span>
                {t.bestFor}
              </p>

              <div className="mt-3 text-[11px] text-[var(--text-faint)]">
                {stack.length} tools
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <SectionLabel>What you're paying for at this budget</SectionLabel>
        <div
          className="panel overflow-hidden rounded-xl"
          style={{ background: "var(--panel)" }}
        >
          {toolsAt(tier).map((tool, i) => (
            <div
              key={tool.id}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3"
              style={{
                borderTop: i === 0 ? "none" : "1px solid var(--line)",
              }}
            >
              <span className="w-32 shrink-0 text-[13px] font-medium">
                {tool.name}
              </span>
              <span className="min-w-0 flex-1 text-[11.5px] text-[var(--text-faint)]">
                {tool.freeTier}
              </span>
              <span className="text-[12px] font-medium tabular-nums text-[var(--text-dim)]">
                {tool.price}
              </span>
            </div>
          ))}
          {!toolsAt(tier).length && (
            <div className="px-4 py-6 text-center text-[12px] text-[var(--text-faint)]">
              No tools costed for this budget yet.
            </div>
          )}
        </div>
        <p className="mt-2.5 text-[11px] leading-relaxed text-[var(--text-faint)]">
          Prices are approximate and change often — check the tool's own pricing
          page before committing to anything.
        </p>
      </div>

      {(blueprint.metrics?.length || blueprint.risks?.length) && (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {blueprint.metrics?.length ? (
            <div>
              <SectionLabel>How you'll know it's working</SectionLabel>
              <div className="space-y-1.5">
                {blueprint.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="panel flex flex-wrap items-baseline gap-x-3 rounded-lg px-3 py-2.5"
                  >
                    <span className="text-[12.5px] font-medium">{m.label}</span>
                    <span className="text-[12px] text-[var(--lime)]">
                      {m.target}
                    </span>
                    <span className="ml-auto text-[11px] text-[var(--text-faint)]">
                      {m.by}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {blueprint.risks?.length ? (
            <div>
              <SectionLabel>What could go wrong</SectionLabel>
              <div className="space-y-1.5">
                {blueprint.risks.map((r, i) => (
                  <div key={i} className="panel rounded-lg px-3 py-2.5">
                    <div className="text-[12.5px] leading-relaxed">
                      {r.risk}
                    </div>
                    <div className="mt-1 text-[11.5px] leading-relaxed text-[var(--text-faint)]">
                      <span className="text-[var(--teal)]">Do this: </span>
                      {r.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
