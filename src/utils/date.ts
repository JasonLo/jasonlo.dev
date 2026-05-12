export type DateStyle = 'long' | 'short' | 'month-year';

export function formatDate(date: Date, style: DateStyle = 'short'): string {
  if (style === 'month-year') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: style,
    day: 'numeric',
  });
}
