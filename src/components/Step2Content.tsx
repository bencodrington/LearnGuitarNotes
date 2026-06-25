import type { AppProgress } from '../utils/storage';
import MetronomeBar from './MetronomeBar';

export default function Step2Content({
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
  const note = progress.step2.noteOrder[progress.step2.currentNoteIndex];
  return (
    <div className="step-content">
      <p className="step-label">Step 2 — Add Metronome</p>
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
