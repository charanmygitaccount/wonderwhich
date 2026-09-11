"use client";

import { useCallback, useState } from "react";
import type { Clarify } from "@/lib/schema";
import { useBlueprintStream } from "@/lib/useBlueprintStream";
import { Launch } from "./Launch";
import { Intake } from "./Intake";
import { Board } from "./Board";

type Screen = "launch" | "intake" | "board";

export function App({ demoMode }: { demoMode: boolean }) {
  const [screen, setScreen] = useState<Screen>("launch");
  const [goal, setGoal] = useState("");
  const [clarify, setClarify] = useState<Clarify | null>(null);
  const [intakeBusy, setIntakeBusy] = useState(false);
  const [intakeError, setIntakeError] = useState<string | null>(null);
  const stream = useBlueprintStream();

  const plan = useCallback(
    (nextGoal: string, answers: string[]) => {
      setScreen("board");
      void stream.start(nextGoal, answers);
    },
    [stream],
  );

  const submitGoal = useCallback(
    async (nextGoal: string) => {
      setGoal(nextGoal);
      setIntakeBusy(true);
      setIntakeError(null);

      try {
        const res = await fetch("/api/clarify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal: nextGoal }),
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(body?.error ?? `Request failed (${res.status}).`);
        }

        const body = (await res.json()) as { clarify: Clarify | null };
        if (body.clarify?.questions?.length) {
          setClarify(body.clarify);
          setScreen("intake");
        } else {
          // Intake is optional -- never let it stand between a user and a plan.
          plan(nextGoal, []);
        }
      } catch (err) {
        setIntakeError(
          err instanceof Error ? err.message : "Couldn't reach the server.",
        );
      } finally {
        setIntakeBusy(false);
      }
    },
    [plan],
  );

  const restart = useCallback(() => {
    stream.reset();
    setClarify(null);
    setGoal("");
    setIntakeError(null);
    setScreen("launch");
  }, [stream]);

  if (screen === "intake" && clarify) {
    return (
      <Intake
        clarify={clarify}
        onDone={(answers) => plan(goal, answers)}
        onBack={restart}
      />
    );
  }

  if (screen === "board") {
    return (
      <Board
        blueprint={stream.blueprint}
        phase={stream.phase}
        mode={stream.mode}
        error={stream.error}
        onRestart={restart}
        onRetry={() => plan(goal, [])}
      />
    );
  }

  return (
    <Launch
      onSubmit={submitGoal}
      demoMode={demoMode}
      busy={intakeBusy}
      error={intakeError}
    />
  );
}
