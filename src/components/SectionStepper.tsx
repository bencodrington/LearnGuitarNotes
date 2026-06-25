export default function SectionStepper({
  labels,
  currentIndex,
  onSectionClick,
}: {
  labels: string[];
  currentIndex: number;
  onSectionClick: (index: number) => void;
}) {
  if (labels.length === 0) return null;
  return (
    <nav className="section-stepper" aria-label="Sections within step">
      {labels.map((label, i) => (
        <button
          key={i}
          className={`section-dot${i === currentIndex ? ' active' : ''}${i < currentIndex ? ' done' : ''}`}
          onClick={() => onSectionClick(i)}
          aria-label={`Section: ${label}`}
          title={label}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
