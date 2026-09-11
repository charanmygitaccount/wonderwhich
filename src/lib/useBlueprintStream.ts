"use client";

import { useCallback, useRef, useState } from "react";
import type { Blueprint } from "./schema";
import { parsePartial } from "./partial-json";

export type StreamPhase = "idle" | "streaming" | "done" | "error";

interface State {
  phase: StreamPhase;
  blueprint: Partial<Blueprint>;
  error: string | null;
  mode: "demo" | "live" | null;
  chars: number;
}

const INITIAL: State = {
  phase: "idle",
  blueprint: {},
  error: null,
  mode: null,
  chars: 0,
};

/**
 * Streams a blueprint and re-parses it on every frame.
 *
 * Re-parsing the whole document each tick is deliberately naive and is fine at
 * this size (tens of KB): it keeps the rendered object always consistent with
 * what has arrived, instead of trying to merge fragments incrementally and
 * getting half-written elements on screen. Parsing is throttled to animation
 * frames so a fast stream can't thrash React.
 */
export function useBlueprintStream() {
  const [state, setState] = useState<State>(INITIAL);
  const rawRef = useRef("");
  const frameRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const flush = useCallback(() => {
    frameRef.current = null;
    const parsed = parsePartial<Blueprint>(rawRef.current);
    setState((s) => ({
      ...s,
      chars: rawRef.current.length,
      blueprint: parsed ?? s.blueprint,
    }));
  }, []);

  const schedule = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(flush);
  }, [flush]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const reset = useCallback(() => {
    cancel();
    rawRef.current = "";
    setState(INITIAL);
  }, [cancel]);

  const start = useCallback(
    async (goal: string, answers: string[]) => {
      cancel();
      rawRef.current = "";
      setState({ ...INITIAL, phase: "streaming" });

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/blueprint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal, answers }),
          signal: controller.signal,
        });

        const mode =
          res.headers.get("X-Wonderwhich-Mode") === "demo" ? "demo" : "live";
        setState((s) => ({ ...s, mode }));

        if (!res.ok || !res.body) {
          const message = await res
            .json()
            .then((j: { error?: string }) => j.error)
            .catch(() => null);
          throw new Error(message ?? `Request failed (${res.status}).`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE frames are separated by a blank line; keep any partial tail.
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            const line = frame.split("\n").find((l) => l.startsWith("data: "));
            if (!line) continue;
            let event: { t: string; v?: string };
            try {
              event = JSON.parse(line.slice(6)) as { t: string; v?: string };
            } catch {
              continue;
            }
            if (event.t === "d" && event.v) {
              rawRef.current += event.v;
              schedule();
            } else if (event.t === "err") {
              throw new Error(event.v ?? "Generation failed.");
            } else if (event.t === "done") {
              flush();
              setState((s) => ({ ...s, phase: "done" }));
            }
          }
        }

        flush();
        setState((s) => (s.phase === "done" ? s : { ...s, phase: "done" }));
      } catch (err) {
        if (controller.signal.aborted) return;
        setState((s) => ({
          ...s,
          phase: "error",
          error: err instanceof Error ? err.message : "Something went wrong.",
        }));
      } finally {
        abortRef.current = null;
      }
    },
    [cancel, flush, schedule],
  );

  return { ...state, start, reset, cancel };
}
