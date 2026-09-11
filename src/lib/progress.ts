"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Blueprint, TierId } from "./schema";

/**
 * Progress lives in localStorage, keyed by the plan's title.
 *
 * A plan you can't tick off is a document, not a tool -- and losing your ticks
 * on refresh would make people stop trusting it after one reload. Storage can
 * throw (private windows, blocked site data), so every access is guarded and
 * the app works, just forgetfully, when it fails.
 */

interface Stored {
  ticks: string[];
  answers: Record<string, string>;
}

const EMPTY: Stored = { ticks: [], answers: {} };

function keyFor(planKey: string): string {
  return `wonderwhich:progress:${planKey}`;
}

function read(planKey: string): Stored {
  try {
    const raw = localStorage.getItem(keyFor(planKey));
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Stored>;
    return {
      ticks: Array.isArray(parsed.ticks) ? parsed.ticks : [],
      answers:
        parsed.answers && typeof parsed.answers === "object"
          ? parsed.answers
          : {},
    };
  } catch {
    return EMPTY;
  }
}

function write(planKey: string, value: Stored): void {
  try {
    localStorage.setItem(keyFor(planKey), JSON.stringify(value));
  } catch {
    // Out of quota or storage blocked -- ticks stay in memory for this session.
  }
}

export function tickKey(stepId: string, tier: TierId, index: number): string {
  return `${stepId}|${tier}|${index}`;
}

export function useProgress(planKey: string, blueprint: Partial<Blueprint>) {
  const [ticks, setTicks] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!planKey) return;
    const stored = read(planKey);
    setTicks(new Set(stored.ticks));
    setAnswers(stored.answers);
    setLoaded(true);
  }, [planKey]);

  const persist = useCallback(
    (nextTicks: Set<string>, nextAnswers: Record<string, string>) => {
      if (!planKey) return;
      write(planKey, { ticks: [...nextTicks], answers: nextAnswers });
    },
    [planKey],
  );

  const toggle = useCallback(
    (key: string) => {
      setTicks((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        persist(next, answers);
        return next;
      });
    },
    [answers, persist],
  );

  const answerCheckpoint = useCallback(
    (checkpointId: string, option: string) => {
      setAnswers((prev) => {
        // Clicking the chosen option again clears it, so a fork isn't a trap.
        const next = { ...prev };
        if (next[checkpointId] === option) delete next[checkpointId];
        else next[checkpointId] = option;
        persist(ticks, next);
        return next;
      });
    },
    [persist, ticks],
  );

  const reset = useCallback(() => {
    setTicks(new Set());
    setAnswers({});
    persist(new Set(), {});
  }, [persist]);

  /** A step is done when every finish condition for the active tier is ticked. */
  const isStepDone = useCallback(
    (stepId: string, tier: TierId): boolean => {
      const step = blueprint.steps?.find((s) => s?.id === stepId);
      const conditions = step?.variants?.[tier]?.doneWhen;
      if (!conditions?.length) return false;
      return conditions.every((_, i) => ticks.has(tickKey(stepId, tier, i)));
    },
    [blueprint.steps, ticks],
  );

  const countDone = useCallback(
    (tier: TierId): number =>
      (blueprint.steps ?? []).filter((s) => s?.id && isStepDone(s.id, tier))
        .length,
    [blueprint.steps, isStepDone],
  );

  return useMemo(
    () => ({
      ticks,
      answers,
      loaded,
      toggle,
      answerCheckpoint,
      reset,
      isStepDone,
      countDone,
    }),
    [
      ticks,
      answers,
      loaded,
      toggle,
      answerCheckpoint,
      reset,
      isStepDone,
      countDone,
    ],
  );
}
