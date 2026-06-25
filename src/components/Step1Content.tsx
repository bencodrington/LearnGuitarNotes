import type { AppProgress } from '../utils/storage';

export default function Step1Content({ progress, onNext }: { progress: AppProgress; onNext: () => void }) {
  const { noteOrders, currentPass, currentNoteIndex } = progress.step1;
  const note = noteOrders[currentPass][currentNoteIndex];
  return (
    <div className="step-content">
      <p className="step-label">Step 1 — Natural Notes</p>
      <div className="note-display">{note}</div>
      <p className="step-instructions">
        Play <strong>{note}</strong> on each string — thick to thin, then back.
        <br />
        Repeat 3 times without a mistake.
      </p>
      <p className="counter-text">Pass {currentPass + 1} of 2</p>
      <button className="next-btn" onClick={onNext}>
        Done, next note →
      </button>
    </div>
  );
}
