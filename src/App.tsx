import { useState, useEffect } from 'react';
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
import Footer from './components/Footer';
import TimerPrompt from './components/TimerPrompt';
import TimerDisplay from './components/TimerDisplay';
import StepStepper from './components/StepStepper';
import SectionStepper from './components/SectionStepper';
import Step1Content from './components/Step1Content';
import Step2Content from './components/Step2Content';
import Step3Content from './components/Step3Content';
import Step4Content from './components/Step4Content';
import Step5Content from './components/Step5Content';
import Step6Content from './components/Step6Content';

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
