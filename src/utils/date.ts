export type DateStyle = 'long' | 'short' | 'month-year';

/**
 * Formats a content date for display.
 *
 * Rendered in UTC on purpose. Frontmatter dates are date-only strings
 * (`2026-07-18`), which `z.coerce.date()` parses as UTC midnight. Formatting
 * those in the build machine's local zone shifts them a day backwards
 * anywhere west of UTC, so the visible date would disagree with the adjacent
 * `<time datetime>` attribute (which is always the UTC ISO string).
 *
 * Every other read of these dates uses the UTC accessors for the same reason.
 */
export function formatDate(date: Date, style: DateStyle = 'short'): string {
  if (style === 'month-year') {
    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
    });
  }
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: style,
    day: 'numeric',
  });
}
