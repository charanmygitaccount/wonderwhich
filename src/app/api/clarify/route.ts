import { NextResponse } from "next/server";
import { ClarifySchema, type Clarify } from "@/lib/schema";
import { CLARIFY_SYSTEM } from "@/lib/prompts";
import { describeError, hasApiKey, streamStructured } from "@/lib/anthropic";
import { SAMPLE_CLARIFY } from "@/lib/sample";
import { parseFinal } from "@/lib/partial-json";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  let body: { goal?: unknown };
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

  if (!hasApiKey()) {
    return NextResponse.json(
      { clarify: SAMPLE_CLARIFY, mode: "demo" },
      { headers: { "X-Wonderwhich-Mode": "demo" } },
    );
  }

  try {
    // Intake is small and the user is staring at a spinner, so it runs at low
    // effort -- the thinking budget belongs in the blueprint, not here.
    let raw = "";
    for await (const delta of streamStructured({
      system: CLARIFY_SYSTEM,
      user: `They want to build:\n\n"""\n${goal}\n"""`,
      schema: ClarifySchema,
      schemaName: "intake questions",
      maxTokens: 4000,
      effort: "low",
    })) {
      raw += delta;
    }

    const parsed = ClarifySchema.safeParse(parseFinal<Clarify>(raw));
    if (!parsed.success) {
      // Intake is a nicety; never let it block the plan.
      return NextResponse.json({ clarify: null, mode: "live" });
    }

    return NextResponse.json({ clarify: parsed.data, mode: "live" });
  } catch (err) {
    console.error("[wonderwhich] intake failed", err);
    return NextResponse.json({ error: describeError(err) }, { status: 502 });
  }
}
