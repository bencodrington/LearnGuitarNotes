import type { AppProgress } from '../utils/storage';
import MetronomeBar from './MetronomeBar';

export default function Step5Content({
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
  const { rounds, currentRoundIndex } = progress.step5;
  const notes = rounds[currentRoundIndex];
  return (
    <div className="step-content">
      <p className="step-label">Step 5 — Seven Notes</p>
      <MetronomeBar bpm={progress.currentBpm} isMuted={isMuted} onToggleMute={onToggleMute} />
      <div className="seven-notes">
        {notes.map((note, i) => (
          <div key={i} className="seven-note">
            <div className="seven-note-name">{note}</div>
            <div className="direction-arrow">{i % 2 === 0 ? '↑' : '↓'}</div>
          </div>
        ))}
      </div>
      <p className="step-instructions">
        Play through the sequence — alternating up and down strings continuously.
      </p>
      <p className="counter-text">
        Round {currentRoundIndex + 1} of {rounds.length}
      </p>
      <button className="next-btn" onClick={onNext}>
        {currentRoundIndex === rounds.length - 1 ? 'On to step 6 →' : 'Next round →'}
      </button>
    </div>
  );
}
