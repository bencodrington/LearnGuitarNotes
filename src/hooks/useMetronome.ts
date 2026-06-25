import { useRef, useEffect, useCallback } from 'react';

export function useMetronome(bpm: number, active: boolean, muted: boolean): void {
  const ctxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Use a ref for muted so toggling mute doesn't restart the interval
  const mutedRef = useRef(muted);
  useEffect(() => { mutedRef.current = muted; });

  const playClick = useCallback(() => {
    if (mutedRef.current) return;
    try {
      if (!ctxRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ctxRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = ctxRef.current!;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Ignore Web Audio API errors (e.g. browser restrictions)
    }
  }, []); // stable — reads muted via ref

  useEffect(() => {
    if (!active) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    const ms = (60 / bpm) * 1000;
    playClick(); // immediate first beat
    intervalRef.current = setInterval(playClick, ms);
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, bpm, playClick]);
}
