const events = {
  MUTATION_FAILED: { level: 'warn', action: 'show_error_and_retry' },
  REFRESH_FAILED: { level: 'warn', action: 'reload_without_repeating_write' },
} as const;

export type SafeEvent = keyof typeof events;

// Only fixed event codes are accepted. Never serialize an Error, note, ID, or user input.
export function formatSafeLog(event: SafeEvent): string {
  if (!Object.hasOwn(events, event)) throw new Error('Unknown diagnostic event');
  return JSON.stringify({ event, ...events[event] });
}

export function safeLog(event: SafeEvent): void {
  try { console.warn(formatSafeLog(event)); }
  catch { /* Diagnostics must never interrupt persistence or recovery. */ }
}
