"use client";

let context: AudioContext | null = null;
let lastPlayed = 0;

/** Very short, quiet tick used as optional typing feedback. Safe to call often. */
export function playKeySound(correct: boolean): void {
  if (typeof window === "undefined" || !window.AudioContext) return;

  const now = performance.now();
  if (now - lastPlayed < 40) return;
  lastPlayed = now;

  try {
    context ??= new window.AudioContext();
    if (context.state === "suspended") void context.resume();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.value = correct ? 740 : 210;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.016, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.06);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.07);
  } catch {
    // Audio is a nice-to-have: ignore blocked or unsupported audio contexts.
  }
}
