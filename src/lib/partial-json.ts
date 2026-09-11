/**
 * Parses JSON that is still arriving.
 *
 * The blueprint is a large object and takes a while to generate. Rather than
 * show a spinner until the last brace lands, the client parses whatever has
 * arrived on every frame and draws the phases, steps and tools that are already
 * complete. The plan visibly assembles itself, which is the point of the
 * product -- you watch it get built.
 *
 * Strategy: close whatever is open, try to parse, and if that fails, rewind to
 * the previous comma and try again. Rewinding drops the half-written element at
 * the tail, which is exactly what we want: only finished items get drawn.
 */

function stripFences(raw: string): string {
  const s = raw.trim();
  if (!s.startsWith("```")) return s;
  return s
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
}

/** Balances a truncated JSON string. Returns null if it can't be salvaged. */
function balance(src: string): string | null {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') inString = true;
    else if (ch === "{" || ch === "[") stack.push(ch);
    else if (ch === "}" || ch === "]") {
      const open = stack.pop();
      if (!open) return null; // more closers than openers: not salvageable
      if ((ch === "}") !== (open === "{")) return null; // mismatched
    }
  }

  let out = src;

  // A trailing backslash would escape the quote we're about to add.
  if (inString && escaped) out = out.slice(0, -1);
  if (inString) out += '"';

  out = out.replace(/\s+$/, "");
  if (out.endsWith(",")) out = out.slice(0, -1);
  if (out.endsWith(":")) out += "null";

  for (let i = stack.length - 1; i >= 0; i--) {
    out += stack[i] === "{" ? "}" : "]";
  }

  return out;
}

const MAX_REWINDS = 200;

/**
 * Best-effort parse of a partial JSON document.
 * Returns a possibly-incomplete object, or null if nothing usable yet.
 */
export function parsePartial<T>(raw: string): Partial<T> | null {
  let s = stripFences(raw);
  const start = s.indexOf("{");
  if (start === -1) return null;
  s = s.slice(start);

  for (let attempt = 0; attempt < MAX_REWINDS && s.length > 1; attempt++) {
    const balanced = balance(s);
    if (balanced !== null) {
      try {
        return JSON.parse(balanced) as Partial<T>;
      } catch {
        // fall through to rewind
      }
    }
    const cut = s.lastIndexOf(",");
    if (cut <= 0) break;
    s = s.slice(0, cut);
  }

  return null;
}

/** Strict parse for the finished document, tolerating stray fences. */
export function parseFinal<T>(raw: string): T {
  return JSON.parse(stripFences(raw)) as T;
}
