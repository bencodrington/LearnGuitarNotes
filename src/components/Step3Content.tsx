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
  const { noteOrder, currentNoteIndex } = progress.step3;
  const note = noteOrder[currentNoteIndex];
  const buttonLabel = currentNoteIndex === noteOrder.length - 1 ? 'On to step 4 →' : 'Done, next note →';
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
        {buttonLabel}
      </button>
    </div>
  );
}
