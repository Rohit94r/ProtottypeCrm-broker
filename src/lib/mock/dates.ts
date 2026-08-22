const now = new Date();

export function isoDaysAgo(days: number, hour = 10, min = 30): string {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

export function isoHoursFromNow(h: number): string {
  const d = new Date(now);
  d.setHours(d.getHours() + h);
  return d.toISOString();
}

export function isoHoursAgo(h: number): string {
  const d = new Date(now);
  d.setHours(d.getHours() - h);
  return d.toISOString();
}

export { now };
