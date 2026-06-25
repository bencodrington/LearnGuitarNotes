import React from 'react';

const STEP_LABELS = ['Natural Notes', 'Metronome', 'Sharps & Flats', 'Two Notes', '7 Notes', 'Level Up'];

export default function StepStepper({
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
