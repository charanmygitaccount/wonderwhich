# WonderWhich

**Describe what you want to build. Get a plan you can look at, not read.**

Most "how do I do X" answers are a wall of text you have to hold in your head.
WonderWhich turns the same question into a board: phases across the top, steps
as cards, dependencies drawn between them, and every step opening into the
actual clicks — which app, which screen, which button, and what it should look
like when it worked.

The same goal is planned three ways — at **$0**, on a **small budget**, and with
the **paid stack** — and switching between them changes the tools, the steps and
the trade-offs, not just the price tag.

---

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

**No API key needed.** With no key set, the app runs in demo mode and serves a
bundled sample plan — the full product, every screen, zero spend. Demo mode
drives the same streaming parser and the same progressive rendering as a live
call, so it isn't a mockup; it's the real interface with fixed data.

To plan your own goals, add a key:

```bash
cp .env.example .env.local   # then put your key in ANTHROPIC_API_KEY
```

---

## What's on screen

| View | What it answers |
|---|---|
| **Map** | What's the whole thing, in what order, and what do I do first? |
| **Timeline** | How many hours of actual work is this? |
| **Tools** | What am I signing up for, and what does the free plan really give me? |
| **Money** | What do the three routes cost, and what am I paying for? |

Opening a step card slides out the walkthrough: the click-by-click actions, the
copy-paste prompts, the finish conditions you tick off, and the specific ways
people get that step wrong.

Two things make it a tool rather than a document:

- **Decision points** sit inline in the map, where the honest answer is "it
  depends". They say what the answer changes and what happens either way.
- **Progress is yours.** Ticking finish conditions marks steps done, fills the
  phase bars and the ring in the header, and survives a refresh (localStorage,
  keyed per plan).

---

## How it's put together

The frontend is the product; everything else is thin.

```
src/
  components/        the whole interface
    App.tsx            launch → intake → board
    Launch.tsx         the prompt screen
    Intake.tsx         the few questions that change the plan
    Board.tsx          header, tier switch, view switching, drawer wiring
    MapView.tsx        phase columns, step cards, dependency curves, forks
    TimelineView.tsx   hands-on effort, laid end to end
    StackView.tsx      tools, split by whether this budget uses them
    MoneyView.tsx      the three routes, costed side by side
    StepDrawer.tsx     the walkthrough — this is the payload
    StepCard.tsx, ui.tsx
  lib/
    schema.ts          the contract (see below)
    sample.ts          the bundled demo plan
    partial-json.ts    parses JSON that is still arriving
    progress.ts        ticks and decisions, in localStorage
    estimate.ts        reads "2-3 hours" and "~$35/mo" as numbers
    prompts.ts, anthropic.ts
  app/
    page.tsx, layout.tsx, globals.css
    api/blueprint, api/clarify
```

### The schema is the design

`src/lib/schema.ts` is the load-bearing file. The rule it enforces: **if a field
can't be drawn as a node, a card, a bar or a checklist, it doesn't belong.**
That's the line between this and a chatbot that returns an essay.

So an instruction isn't a paragraph — it's `app` / `where` / `do` / `detail` /
`paste`, which is why the drawer can render a breadcrumb and a copy button
instead of prose, and why a step can't get away with saying "configure your
DNS".

### Watching it build

A plan is a big document and takes a while to generate. Instead of a spinner,
`partial-json.ts` closes whatever brackets are open, parses, and rewinds to the
previous comma if that fails — so half-written items are dropped and only
finished ones get drawn. The board assembles itself while you watch.

### Design

One committed dark palette. Colour means *which phase*, never decoration.
Accents are applied as inline styles because the phase picks them at runtime.
The dependency curves are measured from the DOM rather than computed from a
layout model — measuring is the only thing that stays correct while cards are
still streaming in and reflowing.

---

## Known limits

- **Prices and menu labels drift.** The prompts push for real screens and real
  free-tier limits, and tell the model to describe a destination rather than
  invent an exact label it isn't sure of — but check pricing pages before
  committing money to anything.
- **Timeline bars are hands-on effort, not a calendar.** Elapsed time depends on
  how many hours a week you actually have.
- **Progress is per-browser.** No accounts, no sync.
