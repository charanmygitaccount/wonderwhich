import { NextResponse } from "next/server";
import { BlueprintSchema } from "@/lib/schema";
import { BLUEPRINT_SYSTEM, buildBlueprintRequest } from "@/lib/prompts";
import { describeError, hasApiKey, streamStructured } from "@/lib/anthropic";
import { SAMPLE_BLUEPRINT } from "@/lib/sample";

export const runtime = "nodejs";
export const maxDuration = 300;

const encoder = new TextEncoder();

function sse(type: string, value?: string): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify({ t: type, v: value })}\n\n`);
}

/**
 * Replays the bundled blueprint as if it were being generated.
 *
 * Demo mode is not a stub -- it drives the same streaming parser and the same
 * progressive rendering as a live call, so the no-key experience is the real
 * product rather than a screenshot of it.
 */
function demoStream(): ReadableStream<Uint8Array> {
  const json = JSON.stringify(SAMPLE_BLUEPRINT);
  const CHUNK = 260;
  let i = 0;

  return new ReadableStream({
    async pull(controller) {
      if (i >= json.length) {
        controller.enqueue(sse("done"));
        controller.close();
        return;
      }
      controller.enqueue(sse("d", json.slice(i, i + CHUNK)));
      i += CHUNK;
      await new Promise((r) => setTimeout(r, 22));
    },
  });
}

function liveStream(
  goal: string,
  answers: string[],
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async start(controller) {
      try {
        const deltas = streamStructured({
          system: BLUEPRINT_SYSTEM,
          user: buildBlueprintRequest(goal, answers),
          schema: BlueprintSchema,
          schemaName: "blueprint",
          maxTokens: 64000,
        });
        for await (const delta of deltas) {
          controller.enqueue(sse("d", delta));
        }
        controller.enqueue(sse("done"));
      } catch (err) {
        console.error("[wonderwhich] blueprint generation failed", err);
        controller.enqueue(sse("err", describeError(err)));
      } finally {
        controller.close();
      }
    },
  });
}

export async function POST(req: Request) {
  let body: { goal?: unknown; answers?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Expected a JSON body." },
      { status: 400 },
    );
  }

  const goal = typeof body.goal === "string" ? body.goal.trim() : "";
  if (!goal) {
    return NextResponse.json(
      { error: "Tell us what you want to build." },
      { status: 400 },
    );
  }
  if (goal.length > 4000) {
    return NextResponse.json(
      {
        error:
          "That's longer than we can plan in one go -- trim it to the essentials.",
      },
      { status: 400 },
    );
  }

  const answers = Array.isArray(body.answers)
    ? body.answers
        .filter((a): a is string => typeof a === "string")
        .slice(0, 12)
    : [];

  const demo = !hasApiKey();

  return new Response(demo ? demoStream() : liveStream(goal, answers), {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Wonderwhich-Mode": demo ? "demo" : "live",
    },
  });
}
