export default function MetronomeBar({
  bpm,
  isMuted,
  onToggleMute,
}: {
  bpm: number;
  isMuted: boolean;
  onToggleMute: () => void;
}) {
  return (
    <div className="metronome-bar">
      <span className="bpm-label">♩ {bpm} BPM</span>
      <button
        className={`mute-btn${isMuted ? ' muted' : ''}`}
        onClick={onToggleMute}
        aria-label={isMuted ? 'Unmute metronome' : 'Mute metronome'}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
