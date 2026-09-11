import { z } from "zod";

/**
 * The Blueprint is the whole product in one object.
 *
 * Everything here exists because something on screen draws it. If a field can't
 * be rendered as a node, a card, a bar or a checklist, it doesn't belong in the
 * schema -- that's the line between this and a chatbot that returns an essay.
 */

export const TIER_IDS = ["free", "lean", "pro"] as const;
export type TierId = (typeof TIER_IDS)[number];

export const ACCENTS = [
  "ember",
  "teal",
  "violet",
  "lime",
  "rose",
  "sky",
] as const;
export type Accent = (typeof ACCENTS)[number];

/**
 * One physical thing the user does, in one app, on one screen.
 *
 * `where` is the navigation path and `do` is the click. Keeping them apart is
 * what lets the drawer render a breadcrumb instead of a paragraph, and it
 * forces the model to name a real screen rather than say "configure your site".
 */
export const ActionSchema = z.object({
  app: z.string().describe("The exact product this happens in, e.g. 'Canva'."),
  where: z
    .string()
    .describe(
      "Navigation path to the screen, using arrows: 'Home → Create a design → Custom size'.",
    ),
  do: z
    .string()
    .describe("The single concrete click or entry, naming the real UI label."),
  detail: z
    .string()
    .describe("What to type/pick and what it should look like when it worked."),
  paste: z
    .string()
    .nullable()
    .describe(
      "Verbatim text the user can copy: an AI prompt, caption, formula, or config value. null when nothing is copyable.",
    ),
});
export type Action = z.infer<typeof ActionSchema>;

/** The same step, re-planned for one budget tier. */
export const StepVariantSchema = z.object({
  tools: z.array(z.string()).describe("Tool ids used at this tier."),
  cost: z.string().describe("Cash cost of this step at this tier, e.g. '$0'."),
  tradeoff: z
    .string()
    .describe("What this tier buys or costs you versus the others."),
  actions: z.array(ActionSchema).describe("Click-by-click, in order."),
  doneWhen: z
    .array(z.string())
    .describe("Observable finish conditions the user can tick off."),
  pitfalls: z
    .array(z.string())
    .describe("Specific traps at this step, not generic advice."),
});
export type StepVariant = z.infer<typeof StepVariantSchema>;

export const StepSchema = z.object({
  id: z.string(),
  phase: z.string().describe("id of the phase this belongs to"),
  title: z.string(),
  why: z.string().describe("One sentence: why this step exists at all."),
  outcome: z.string().describe("The artifact that exists after this step."),
  time: z
    .string()
    .describe(
      "Hands-on working time, e.g. '40 min'. Never calendar time -- 'one week' is not an answer to how long this takes to do.",
    ),
  effort: z.number().int().min(1).max(3).describe("1 easy, 2 medium, 3 hard."),
  dependsOn: z.array(z.string()).describe("Step ids that must land first."),
  variants: z.object({
    free: StepVariantSchema,
    lean: StepVariantSchema,
    pro: StepVariantSchema,
  }),
});
export type Step = z.infer<typeof StepSchema>;

export const PhaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  goal: z.string().describe("What is true at the end of this phase."),
  time: z.string(),
  accent: z.enum(ACCENTS),
});
export type Phase = z.infer<typeof PhaseSchema>;

export const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().describe("e.g. 'Website', 'Payments', 'Ads'."),
  what: z.string().describe("What it does, in plain words."),
  why: z.string().describe("Why this one and not the obvious alternative."),
  freeTier: z
    .string()
    .describe("Exactly what the free plan allows, or 'No free plan'."),
  price: z.string().describe("What the paid plan costs, e.g. '$19/mo'."),
  url: z.string(),
  minTier: z.enum(TIER_IDS).describe("Lowest budget tier that uses this tool."),
  learn: z.string().describe("Time to get useful with it, e.g. '15 min'."),
});
export type Tool = z.infer<typeof ToolSchema>;

/**
 * A fork in the plan. The user answers it in the UI and the answer steers the
 * rest -- this is how the product asks questions "in the middle" without
 * turning into a chat window.
 */
export const CheckpointSchema = z.object({
  id: z.string(),
  afterStep: z.string(),
  question: z.string(),
  why: z.string().describe("Why the answer changes the plan."),
  options: z.array(
    z.object({
      label: z.string(),
      then: z.string().describe("What the plan does if they pick this."),
    }),
  ),
});
export type Checkpoint = z.infer<typeof CheckpointSchema>;

export const BlueprintSchema = z.object({
  title: z.string(),
  tagline: z.string().describe("One line naming the thing being built."),
  outcome: z
    .string()
    .describe("What the user will have running when the last box is ticked."),
  audience: z.string().describe("Who this plan assumes the user is."),
  totalTime: z.string().describe("End to end, e.g. '3 weekends'."),
  tiers: z.array(
    z.object({
      id: z.enum(TIER_IDS),
      label: z.string(),
      budget: z.string().describe("e.g. '$0' or '$45/mo'."),
      summary: z.string(),
      bestFor: z.string(),
    }),
  ),
  phases: z.array(PhaseSchema),
  steps: z.array(StepSchema),
  tools: z.array(ToolSchema),
  checkpoints: z.array(CheckpointSchema),
  metrics: z.array(
    z.object({
      label: z.string(),
      target: z.string(),
      by: z.string().describe("When to expect it."),
    }),
  ),
  risks: z.array(z.object({ risk: z.string(), mitigation: z.string() })),
});
export type Blueprint = z.infer<typeof BlueprintSchema>;

/** The pre-flight questions, asked as cards before any planning happens. */
export const ClarifySchema = z.object({
  read: z
    .string()
    .describe("One line proving the goal was understood, in plain words."),
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      why: z.string().describe("What this changes about the plan."),
      options: z.array(
        z.object({
          label: z.string(),
          hint: z.string().describe("Short consequence of picking this."),
        }),
      ),
      allowCustom: z.boolean(),
    }),
  ),
});
export type Clarify = z.infer<typeof ClarifySchema>;
