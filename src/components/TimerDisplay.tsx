import { useState, useEffect, useRef } from 'react';

export default function TimerDisplay({ duration }: { duration: number }) {
  const [remaining, setRemaining] = useState(duration);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      setRemaining(Math.max(0, duration - elapsed));
    }, 500);
    return () => clearInterval(interval);
  }, [duration]);

  const elapsed = duration - remaining;
  const pct = (elapsed / duration) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  if (remaining === 0) {
    return (
      <div className="timer-display">
        <span className="timer-done" title="Session complete!">✓</span>
      </div>
    );
  }

  return (
    <div className="timer-display">
      <span className="timer-text">
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
      <div className="timer-bar">
        <div className="timer-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
