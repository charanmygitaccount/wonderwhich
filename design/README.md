# Plan canvas

Design source for how a WonderWhich plan should *look* as a workspace, rather
than as a column of cards: the flow with its branches and feedback loops, the
graphs behind it, the notes layer, and the visual language holding them
together.

Published canvas: https://claude.ai/code/artifact/14118685-abc7-48dc-8afd-0a4c6499e9fd

| File | Artboard |
|---|---|
| `Main.dc.html` | The flow — phase swimlanes, step nodes, fork diamonds, the two loops that send you back |
| `Signals.dc.html` | The graphs — effort by phase, cumulative hours, cost ladder, effort vs payoff |
| `Notes.dc.html` | The notes — plan note, pitfall, copy-this prompt, answered fork, done-when |
| `Legend.dc.html` | The visual language — what colour, shape, line and size each mean |
| `canvas.json` | Where the artboards sit on the canvas, plus the sticky notes |

These are static mockups. Nothing is wired up; the numbers are the sample
plan's real ones so the charts can be argued with.

## Colour

The artboards use `src/app/globals.css` tokens, with one deliberate change.

The app assigns phase accents ember → lime → teal → violet → sky. Ember and
lime are **ΔE 1.1 apart under deuteranopia** — indistinguishable to a red-green
colour-blind reader, and phases 1 and 2 are adjacent everywhere. The order here
is **ember → teal → violet → lime → sky**, which passes every check (lightness
band, chroma floor, CVD separation, normal-vision floor, contrast) against the
`#131620` panel.

That also frees lime, which was doing double duty as both a phase accent and
the "free / $0" colour. Now:

- **five phase hues** — identity, nothing else
- **rose** — a problem, or a path that sends you back
- **bright neutral** — chosen, or ticked. Brightness, never a hue
- **costs** — neutral, so no colour means two things

Charts use deeper steps of the same hues (L ≈ 0.62), because the interface
accents are too light to sit as fills on a dark surface.

Worth porting the phase order back into `src/lib/sample.ts` and the model's
`accent` guidance in `src/lib/schema.ts`.

## Re-seeding

The published `.html` is a generated bundle and is gitignored. To rebuild it,
run the `/design` skill's helper over these artboards, then republish to the
URL above so the link stays the same.
