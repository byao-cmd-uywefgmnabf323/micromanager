export function toYYYYMMDD(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseYYYYMMDD(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date();
  dt.setFullYear(y, (m || 1) - 1, d || 1);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getLastNDates(n: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = addDays(today, -i);
    dates.push(toYYYYMMDD(d));
  }
  return dates.reverse();
}

export function getWeekStart(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun..6 Sat
  const diff = (day + 6) % 7; // week starts Mon
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return toYYYYMMDD(d);
}
