/**
 * Rough numeric readings of the human-written time and money strings.
 *
 * The model writes "40 min" and "~$35/mo" because that is what a person needs
 * to read. The timeline and the cost ladder need numbers. These parsers are
 * deliberately forgiving and return null rather than guessing -- a view that
 * can't measure something draws it as unknown instead of inventing a length.
 */

const UNIT_MINUTES: Array<[RegExp, number]> = [
  [/\bmin(ute)?s?\b/i, 1],
  [/\bhours?\b|\bhrs?\b/i, 60],
  [/\bdays?\b/i, 60 * 6], // a working day, not 24h
  [/\bweekends?\b/i, 60 * 8],
  [/\bweeks?\b/i, 60 * 6 * 5],
  [/\bmonths?\b/i, 60 * 6 * 20],
];

/** "2-3 hours" -> 150. Returns null when there's nothing countable. */
export function parseMinutes(input: string | undefined): number | null {
  if (!input) return null;
  const text = input.toLowerCase();

  const range = text.match(/(\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:\.\d+)?)/);
  const single = text.match(/(\d+(?:\.\d+)?)/);

  let amount: number | null = null;
  if (range) amount = (parseFloat(range[1]) + parseFloat(range[2])) / 2;
  else if (single) amount = parseFloat(single[1]);

  const unit = UNIT_MINUTES.find(([re]) => re.test(text));
  if (!unit) return null;
  // "a weekend" / "one week" with no digits still has a usable unit.
  return Math.round((amount ?? 1) * unit[1]);
}

export function formatMinutes(total: number): string {
  if (total < 60) return `${total}m`;
  const hours = total / 60;
  if (hours < 10) return `${Number(hours.toFixed(1))}h`;
  const days = hours / 6;
  if (days < 10) return `${Number(days.toFixed(1))} days`;
  return `${Math.round(days / 5)} weeks`;
}

/** "~$35/mo" -> 35. "$0" -> 0. "Transaction fees only" -> null. */
export function parseMoney(input: string | undefined): number | null {
  if (!input) return null;
  const match = input.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  if (!/[$£€₹]|usd|inr|eur/i.test(input) && !/^0$/.test(match[1])) {
    // A bare number with no currency marker isn't money.
    return null;
  }
  return parseFloat(match[1]);
}
