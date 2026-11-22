import { get, set } from "idb-keyval";

const CONVERSATIONS_KEY = "speakmate.conversations.v1";
const MIRROR_KEY = "speakmate.mirror.v1";

/** IndexedDB is used as the durable mirror for conversation history. */
export async function persistConversations<T>(conversations: T): Promise<void> {
  try {
    await set(CONVERSATIONS_KEY, conversations);
  } catch {
    // IndexedDB can be unavailable in private mode; localStorage remains the source of truth.
  }
}

export async function loadConversations<T>(): Promise<T | null> {
  try {
    const value = await get<T>(CONVERSATIONS_KEY);
    return value ?? null;
  } catch {
    return null;
  }
}

export async function persistMirror<T>(data: T): Promise<void> {
  try {
    await set(MIRROR_KEY, data);
  } catch {
    // ignore
  }
}

export async function loadMirror<T>(): Promise<T | null> {
  try {
    const value = await get<T>(MIRROR_KEY);
    return value ?? null;
  } catch {
    return null;
  }
}
