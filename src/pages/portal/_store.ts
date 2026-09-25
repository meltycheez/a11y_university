// Portal changes made this session (acknowledged alerts, read messages, finished to-dos, profile edits).
// Module memory only: survives client navigation between portal pages, resets on reload (plan 06).
import { createStore } from "~/lib/interactive";

export interface ProfilePrefs { chosen: string; pronouns: string; phone: string; email: string; emergency: string; emergencyPhone: string; alerts: string }

export const portalStore = createStore({
  acknowledged: [] as string[],
  /** Message id → read, overriding the dataset's flag. */
  read: {} as Record<string, boolean>,
  done: [] as string[],
  profile: null as ProfilePrefs | null,
});

export const updatePortal = (patch: Partial<ReturnType<typeof portalStore.get>>) => portalStore.set((s) => ({ ...s, ...patch }));
export const isRead = (m: { id: string; read: boolean }, read: Record<string, boolean>) => read[m.id] ?? m.read;
