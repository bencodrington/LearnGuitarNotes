export default function TimerPrompt({ onSelect }: { onSelect: (seconds: number) => void }) {
  return (
    <div className="timer-prompt">
      <h1>How long are you practicing for today?</h1>
      <div className="timer-options">
        <button className="timer-option" onClick={() => onSelect(5 * 60)}>
          5 minutes
        </button>
        <button className="timer-option" onClick={() => onSelect(10 * 60)}>
          10 minutes
        </button>
      </div>
    </div>
  );
}
