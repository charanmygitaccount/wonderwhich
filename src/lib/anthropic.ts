import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { ZodType } from "zod";
import { jsonFallbackInstruction } from "./prompts";

export const MODEL = process.env.WONDERWHICH_MODEL ?? "claude-opus-5";

type Effort = "low" | "medium" | "high" | "xhigh" | "max";
const EFFORT = (process.env.WONDERWHICH_EFFORT ?? "high") as Effort;

/** Demo mode is a first-class path, not a degraded one -- see lib/sample.ts. */
export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

export interface StreamOptions {
  system: string;
  user: string;
  schema: ZodType;
  schemaName: string;
  maxTokens: number;
  effort?: Effort;
}

/**
 * Streams a structured JSON response as raw text deltas.
 *
 * Three request shapes are tried in order, most capable first. A shape is only
 * abandoned if it fails *before* producing output -- once text is flowing we're
 * committed, and an error after that is a real error rather than a signal that
 * this account or region doesn't have the feature.
 *
 * The point is that a missing beta or an unsupported parameter degrades the
 * request instead of the product: the user still gets their blueprint.
 */
export async function* streamStructured(
  opts: StreamOptions,
): AsyncGenerator<string> {
  const { system, user, schema, schemaName, maxTokens } = opts;
  const effort = opts.effort ?? EFFORT;
  const format = zodOutputFormat(schema);
  const c = getClient();

  const shapes: Array<{ name: string; open: () => AsyncIterable<unknown> }> = [
    {
      // Structured outputs + server-side refusal fallback. If a safety
      // classifier declines, the API re-runs on a fallback model in the same
      // call rather than handing the user an empty screen.
      name: "beta+fallbacks",
      open: () =>
        c.beta.messages.stream({
          model: MODEL,
          max_tokens: maxTokens,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          thinking: { type: "adaptive" },
          output_config: { format, effort },
          system,
          messages: [{ role: "user", content: user }],
        }),
    },
    {
      name: "structured",
      open: () =>
        c.messages.stream({
          model: MODEL,
          max_tokens: maxTokens,
          thinking: { type: "adaptive" },
          output_config: { format, effort },
          system,
          messages: [{ role: "user", content: user }],
        }),
    },
    {
      // Last resort: ask for JSON in words. Less reliable, still usable --
      // the client-side parser is tolerant of a stray fence.
      name: "prompt-json",
      open: () =>
        c.messages.stream({
          model: MODEL,
          max_tokens: maxTokens,
          thinking: { type: "adaptive" },
          system: system + jsonFallbackInstruction(schemaName),
          messages: [{ role: "user", content: user }],
        }),
    },
  ];

  let lastError: unknown;

  for (let i = 0; i < shapes.length; i++) {
    let emitted = false;
    try {
      const stream = shapes[i].open() as AsyncIterable<{
        type: string;
        delta?: { type: string; text?: string };
      }>;
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta?.type === "text_delta" &&
          event.delta.text
        ) {
          emitted = true;
          yield event.delta.text;
        }
      }
      return;
    } catch (err) {
      lastError = err;
      if (emitted) throw err; // committed -- don't silently restart the stream
      if (i < shapes.length - 1) {
        console.warn(
          `[wonderwhich] request shape "${shapes[i].name}" unavailable, falling back:`,
          err instanceof Error ? err.message : err,
        );
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("All request shapes failed");
}

/** Turns an SDK error into something worth putting on screen. */
export function describeError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) {
    return "The API key was rejected. Check ANTHROPIC_API_KEY in .env.local.";
  }
  if (err instanceof Anthropic.RateLimitError) {
    return "Rate limited by the API. Wait a moment and try again.";
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return "Couldn't reach the Claude API. Check your network and retry.";
  }
  if (err instanceof Anthropic.APIError) {
    return `The API returned an error. ${err.message}`;
  }
  return err instanceof Error ? err.message : "Something went wrong.";
}
