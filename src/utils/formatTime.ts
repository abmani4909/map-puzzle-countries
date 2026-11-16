/** 0:07.4 - minutes, seconds, tenths. Tabular-friendly, always two digits. */
export function formatClock(ms: number): string {
  const safe = Math.max(0, Math.floor(ms));
  const total = Math.floor(safe / 100);
  const tenths = total % 10;
  const seconds = Math.floor(total / 10) % 60;
  const minutes = Math.floor(total / 600);
  const ss = seconds < 10 ? '0' + seconds : String(seconds);
  return minutes + ':' + ss + '.' + tenths;
}

/** 00:00.0 - zero padded, for the in-game stopwatch readout. */
export function formatStopwatch(ms: number): string {
  const safe = Math.max(0, Math.floor(ms));
  const total = Math.floor(safe / 100);
  const tenths = total % 10;
  const seconds = Math.floor(total / 10) % 60;
  const minutes = Math.floor(total / 600);
  const mm = minutes < 10 ? '0' + minutes : String(minutes);
  const ss = seconds < 10 ? '0' + seconds : String(seconds);
  return mm + ':' + ss + '.' + tenths;
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** DD MMM YYYY */
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const day = d.getDate();
  const dd = day < 10 ? '0' + day : String(day);
  return dd + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}
