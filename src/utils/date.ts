export type DateStyle = 'long' | 'short';

export function formatDate(date: Date, style: DateStyle = 'short'): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: style,
    day: 'numeric',
  });
}
