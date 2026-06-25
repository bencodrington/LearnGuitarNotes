import type { AppProgress } from '../utils/storage';

const BPM_OPTIONS = [40, 45, 50, 55, 60, 65, 70, 75, 80];

export default function Step6Content({
  progress,
  onSelectBpm,
}: {
  progress: AppProgress;
  onSelectBpm: (bpm: number) => void;
}) {
  const current = progress.currentBpm;
  const recommended = current < 80 ? current + 5 : null;
  return (
    <div className="step-content">
      <p className="step-label">Step 6 — Level Up!</p>
      <h2 className="step-heading">Select your new BPM</h2>
      <div className="bpm-grid">
        {BPM_OPTIONS.map((bpm) => (
          <button
            key={bpm}
            className={`bpm-btn${bpm === recommended ? ' recommended' : ''}${bpm === current ? ' current' : ''}`}
            onClick={() => onSelectBpm(bpm)}
            aria-label={`${bpm} BPM${bpm === recommended ? ' (recommended)' : ''}${bpm === current ? ' (current)' : ''}`}
          >
            <span className="bpm-value">{bpm}</span>
            {bpm === recommended && <span className="recommended-label">Recommended</span>}
            {bpm === current && bpm !== recommended && (
              <span className="recommended-label">Current</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
