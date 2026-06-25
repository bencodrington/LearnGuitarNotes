import type { AppProgress } from '../utils/storage';
import MetronomeBar from './MetronomeBar';

export default function Step4Content({
  progress,
  isMuted,
  onToggleMute,
  onNext,
}: {
  progress: AppProgress;
  isMuted: boolean;
  onToggleMute: () => void;
  onNext: () => void;
}) {
  const { pairs, currentPairIndex } = progress.step4;
  const [noteA, noteB] = pairs[currentPairIndex] as [string, string];
  return (
    <div className="step-content">
      <p className="step-label">Step 4 — Two Notes</p>
      <MetronomeBar bpm={progress.currentBpm} isMuted={isMuted} onToggleMute={onToggleMute} />
      <div className="pair-display">
        <div className="pair-note">
          <div className="note-display">{noteA}</div>
          <div className="direction-arrow">↑</div>
        </div>
        <div className="pair-sep">then</div>
        <div className="pair-note">
          <div className="note-display">{noteB}</div>
          <div className="direction-arrow">↓</div>
        </div>
      </div>
      <p className="step-instructions">
        Play <strong>{noteA}</strong> going up all strings, then <strong>{noteB}</strong> coming back
        down. Transition smoothly — never stop at the switch.
      </p>
      <p className="counter-text">
        Pair {currentPairIndex + 1} of {pairs.length}
      </p>
      <button className="next-btn" onClick={onNext}>
        Next pair →
      </button>
    </div>
  );
}
