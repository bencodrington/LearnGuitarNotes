import type { AppProgress } from '../utils/storage';
import MetronomeBar from './MetronomeBar';

export default function Step3Content({
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
  const note = progress.step3.noteOrder[progress.step3.currentNoteIndex];
  return (
    <div className="step-content">
      <p className="step-label">Step 3 — Sharps &amp; Flats</p>
      <MetronomeBar bpm={progress.currentBpm} isMuted={isMuted} onToggleMute={onToggleMute} />
      <div className="note-display">{note}</div>
      <p className="step-instructions">
        Play <strong>{note}</strong> on each string — thick to thin, then back.
        <br />
        One note per beat.
      </p>
      <button className="next-btn" onClick={onNext}>
        Done, next note →
      </button>
    </div>
  );
}
