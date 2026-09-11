"use client";

import type { Blueprint, TierId, Tool } from "@/lib/schema";
import { Badge, SectionLabel } from "./ui";

/**
 * Every tool the plan touches, split by whether the current budget actually
 * uses it. "What am I signing up for, and what does the free plan really give
 * me" is the question people ask before starting -- so it gets its own view
 * rather than being scattered across step drawers.
 */
export function StackView({
  blueprint,
  tier,
}: {
  blueprint: Partial<Blueprint>;
  tier: TierId;
}) {
  const tools = (blueprint.tools ?? []).filter((t): t is Tool =>
    Boolean(t?.id && t?.name),
  );

  // A tool is "in your stack" if a step at this tier actually uses it.
  const used = new Set<string>();
  for (const step of blueprint.steps ?? []) {
    for (const id of step?.variants?.[tier]?.tools ?? []) used.add(id);
  }

  const inStack = tools.filter((t) => used.has(t.id));
  const later = tools.filter((t) => !used.has(t.id));

  if (!tools.length) {
    return (
      <div className="px-5 py-16 text-center text-[13px] text-[var(--text-faint)]">
        Picking the tools…
      </div>
    );
  }

  return (
    <div className="px-4 pb-10 sm:px-6">
      <SectionLabel>
        Your stack at this budget — {inStack.length} tools
      </SectionLabel>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {inStack.map((tool) => (
          <ToolCard key={tool.id} tool={tool} active />
        ))}
      </div>

      {later.length > 0 && (
        <div className="mt-8">
          <SectionLabel>Not needed at this budget</SectionLabel>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {later.map((tool) => (
              <ToolCard key={tool.id} tool={tool} active={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolCard({ tool, active }: { tool: Tool; active: boolean }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="panel rise flex flex-col rounded-xl p-3.5 transition hover:border-[var(--line-strong)] hover:bg-[var(--panel-2)]"
      style={{ opacity: active ? 1 : 0.55 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[14px] font-semibold tracking-[-0.01em]">
            {tool.name}
          </div>
          <div className="mt-0.5 text-[10.5px] tracking-[0.08em] text-[var(--text-faint)] uppercase">
            {tool.category}
          </div>
        </div>
        <span className="text-[11px] text-[var(--text-faint)]">↗</span>
      </div>

      <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-dim)]">
        {tool.what}
      </p>

      <div
        className="mt-2.5 rounded-lg px-2.5 py-2"
        style={{ background: "var(--ink)" }}
      >
        <div className="text-[10px] font-semibold tracking-[0.1em] text-[var(--text-faint)] uppercase">
          Free plan
        </div>
        <div className="mt-0.5 text-[11.5px] leading-relaxed text-[var(--text-dim)]">
          {tool.freeTier}
        </div>
      </div>

      <p className="mt-2.5 text-[11.5px] leading-relaxed text-[var(--text-faint)]">
        <span className="text-[var(--text-dim)]">Why this one: </span>
        {tool.why}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge>{tool.price}</Badge>
        <Badge>{tool.learn} to learn</Badge>
      </div>
    </a>
  );
}
