import { safeLog } from './SafeLog';

export type MutationOutcome =
  | { Saved: true; RefreshFailed: boolean }
  | { Saved: false; Error: string };

export async function performMutation(action: () => Promise<unknown>, refresh: () => Promise<void>): Promise<MutationOutcome> {
  try { await action(); }
  catch (reason) {
    safeLog('MUTATION_FAILED');
    return { Saved: false, Error: reason instanceof Error ? reason.message : 'Operasi database gagal. Silakan coba lagi.' };
  }
  try {
    await refresh();
    return { Saved: true, RefreshFailed: false };
  } catch {
    safeLog('REFRESH_FAILED');
    return { Saved: true, RefreshFailed: true };
  }
}
