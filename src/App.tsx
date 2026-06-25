import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import type { AppProgress } from './utils/storage';
import {
  loadProgress,
  saveProgress,
  advanceProgress,
  jumpToSection,
  selectBpm,
  getSectionInfo,
} from './utils/storage';
import { useMetronome } from './hooks/useMetronome';

// ── Timer Prompt ────────────────────────────────────────────────────────────

function TimerPrompt({ onSelect }: { onSelect: (seconds: number) => void }) {
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

// ── Timer Display (top-right) ───────────────────────────────────────────────

function TimerDisplay({ duration }: { duration: number }) {
  const [remaining, setRemaining] = useState(duration);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      setRemaining(Math.max(0, duration - elapsed));
    }, 500);
    return () => clearInterval(interval);
  }, [duration]);

  const elapsed = duration - remaining;
  const pct = (elapsed / duration) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  if (remaining === 0) {
    return (
      <div className="timer-display">
        <span className="timer-done" title="Session complete!">✓</span>
      </div>
    );
  }

  return (
    <div className="timer-display">
      <span className="timer-text">
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
      <div className="timer-bar">
        <div className="timer-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Step Stepper (1–6) ──────────────────────────────────────────────────────

const STEP_LABELS = ['Natural Notes', 'Metronome', 'Sharps & Flats', 'Two Notes', '7 Notes', 'Level Up'];

function StepStepper({
  currentStep,
  completedSteps,
  onStepClick,
}: {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
}) {
  return (
    <nav className="step-stepper" aria-label="Practice steps">
      {[1, 2, 3, 4, 5, 6].map((step, i) => (
        <React.Fragment key={step}>
          {i > 0 && <div className="step-connector" aria-hidden="true" />}
          <button
            className={`step-dot${step === currentStep ? ' active' : ''}${completedSteps.has(step) ? ' done' : ''}`}
            onClick={() => onStepClick(step)}
            aria-label={`Step ${step}: ${STEP_LABELS[i]}`}
            aria-current={step === currentStep ? 'step' : undefined}
            title={`Step ${step}: ${STEP_LABELS[i]}`}
          >
            {completedSteps.has(step) ? '✓' : step}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}

// ── Section Stepper (within current step) ──────────────────────────────────

function SectionStepper({
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

// ── Metronome Bar ───────────────────────────────────────────────────────────

function MetronomeBar({
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

// ── Step 1: Natural Notes ───────────────────────────────────────────────────

function Step1Content({ progress, onNext }: { progress: AppProgress; onNext: () => void }) {
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

// ── Step 2: Add Metronome ───────────────────────────────────────────────────

function Step2Content({
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

// ── Step 3: Sharps & Flats ──────────────────────────────────────────────────

function Step3Content({
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

// ── Step 4: Two Notes ───────────────────────────────────────────────────────

function Step4Content({
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

// ── Step 5: Seven Notes ─────────────────────────────────────────────────────

function Step5Content({
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
        Next round →
      </button>
    </div>
  );
}

// ── Step 6: BPM Selection ───────────────────────────────────────────────────

const BPM_OPTIONS = [40, 45, 50, 55, 60, 65, 70, 75, 80];

function Step6Content({
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

// ── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="app-footer">
      Based on{' '}
      <a
        href="https://youtu.be/PJddQ6Q0UDo?si=zLajcpPRgyRgJFG3"
        target="_blank"
        rel="noopener noreferrer"
      >
        MusicTheoryForGuitar on YouTube
      </a>
    </footer>
  );
}

// ── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [sessionDuration, setSessionDuration] = useState<number | null>(null);
  const [progress, setProgress] = useState<AppProgress>(() => loadProgress());
  const [isMuted, setIsMuted] = useState(false);

  // Sync to localStorage on every progress change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Metronome is active during steps 2–5 while a session is running
  const metronomeActive =
    sessionDuration !== null && [2, 3, 4, 5].includes(progress.currentStep);
  useMetronome(progress.currentBpm, metronomeActive, isMuted);

  const completedSteps = new Set<number>();
  if (progress.step1.completed) completedSteps.add(1);
  if (progress.step2.completed) completedSteps.add(2);
  if (progress.step3.completed) completedSteps.add(3);
  if (progress.step4.completed) completedSteps.add(4);
  if (progress.step5.completed) completedSteps.add(5);

  const handleNext = () => setProgress((p) => advanceProgress(p));
  const handleJumpToStep = (step: number) =>
    setProgress((p) => ({ ...p, currentStep: step }));
  const handleJumpToSection = (idx: number) =>
    setProgress((p) => jumpToSection(p, idx));
  const handleSelectBpm = (bpm: number) =>
    setProgress((p) => selectBpm(p, bpm));
  const handleToggleMute = () => setIsMuted((m) => !m);

  const { labels: sectionLabels, currentIndex: sectionIndex } = getSectionInfo(progress);

  function renderStep() {
    switch (progress.currentStep) {
      case 1:
        return <Step1Content progress={progress} onNext={handleNext} />;
      case 2:
        return (
          <Step2Content
            progress={progress}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <Step3Content
            progress={progress}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <Step4Content
            progress={progress}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onNext={handleNext}
          />
        );
      case 5:
        return (
          <Step5Content
            progress={progress}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onNext={handleNext}
          />
        );
      case 6:
        return <Step6Content progress={progress} onSelectBpm={handleSelectBpm} />;
      default:
        return null;
    }
  }

  if (sessionDuration === null) {
    return (
      <div className="app">
        <TimerPrompt onSelect={setSessionDuration} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">Learn Guitar Notes</div>
        <TimerDisplay duration={sessionDuration} />
      </header>
      <main className="app-main">
        <StepStepper
          currentStep={progress.currentStep}
          completedSteps={completedSteps}
          onStepClick={handleJumpToStep}
        />
        <SectionStepper
          labels={sectionLabels}
          currentIndex={sectionIndex}
          onSectionClick={handleJumpToSection}
        />
        {renderStep()}
      </main>
      <Footer />
    </div>
  );
}
