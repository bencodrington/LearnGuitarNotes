import { NATURAL_NOTES, EXTENDED_NOTES, shuffle, generatePairs, generateRounds } from './notes';

export interface Step1Data {
  noteOrders: [string[], string[]]; // two shuffled orderings (pass 1 & 2)
  currentPass: number;              // 0 or 1
  currentNoteIndex: number;
  completed: boolean;
}

export interface Step2Data {
  noteOrder: string[];
  currentNoteIndex: number;
  completed: boolean;
}

export interface Step3Data {
  noteOrder: string[];
  currentNoteIndex: number;
  completed: boolean;
}

export interface Step4Data {
  pairs: [string, string][];
  currentPairIndex: number;
  completed: boolean;
}

export interface Step5Data {
  rounds: string[][];
  currentRoundIndex: number;
  completed: boolean;
}

export interface AppProgress {
  currentStep: number;  // 1–6
  currentBpm: number;   // metronome bpm, starts at 40
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
}

export function createInitialProgress(): AppProgress {
  return {
    currentStep: 1,
    currentBpm: 40,
    step1: {
      noteOrders: [shuffle(NATURAL_NOTES), shuffle(NATURAL_NOTES)],
      currentPass: 0,
      currentNoteIndex: 0,
      completed: false,
    },
    step2: {
      noteOrder: shuffle(NATURAL_NOTES),
      currentNoteIndex: 0,
      completed: false,
    },
    step3: {
      noteOrder: shuffle(EXTENDED_NOTES),
      currentNoteIndex: 0,
      completed: false,
    },
    step4: {
      pairs: generatePairs(7),
      currentPairIndex: 0,
      completed: false,
    },
    step5: {
      rounds: generateRounds(3),
      currentRoundIndex: 0,
      completed: false,
    },
  };
}

const STORAGE_KEY = 'lgn-progress-v1';

export function loadProgress(): AppProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppProgress;
      // Basic shape validation before trusting stored data
      if (
        parsed &&
        typeof parsed.currentStep === 'number' &&
        parsed.step1 &&
        Array.isArray(parsed.step1.noteOrders) &&
        parsed.step2 && parsed.step3 && parsed.step4 && parsed.step5
      ) {
        return parsed;
      }
    }
  } catch {
    // Corrupted / unavailable storage — fall through to fresh state
  }
  return createInitialProgress();
}

export function saveProgress(progress: AppProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Quota exceeded or storage unavailable — ignore
  }
}

// Advance to the next section/step when the user clicks "Next"
export function advanceProgress(progress: AppProgress): AppProgress {
  switch (progress.currentStep) {
    case 1: {
      const { currentPass, currentNoteIndex, noteOrders } = progress.step1;
      const notesPerPass = noteOrders[0].length;
      if (currentNoteIndex < notesPerPass - 1) {
        return { ...progress, step1: { ...progress.step1, currentNoteIndex: currentNoteIndex + 1 } };
      } else if (currentPass === 0) {
        // Move to pass 2
        return { ...progress, step1: { ...progress.step1, currentPass: 1, currentNoteIndex: 0 } };
      } else {
        // Both passes done — advance to Step 2
        return { ...progress, currentStep: 2, step1: { ...progress.step1, completed: true } };
      }
    }
    case 2: {
      const { currentNoteIndex, noteOrder } = progress.step2;
      if (currentNoteIndex < noteOrder.length - 1) {
        return { ...progress, step2: { ...progress.step2, currentNoteIndex: currentNoteIndex + 1 } };
      }
      return { ...progress, currentStep: 3, step2: { ...progress.step2, completed: true } };
    }
    case 3: {
      const { currentNoteIndex, noteOrder } = progress.step3;
      if (currentNoteIndex < noteOrder.length - 1) {
        return { ...progress, step3: { ...progress.step3, currentNoteIndex: currentNoteIndex + 1 } };
      }
      return { ...progress, currentStep: 4, step3: { ...progress.step3, completed: true } };
    }
    case 4: {
      const { currentPairIndex, pairs } = progress.step4;
      if (currentPairIndex < pairs.length - 1) {
        return { ...progress, step4: { ...progress.step4, currentPairIndex: currentPairIndex + 1 } };
      }
      return { ...progress, currentStep: 5, step4: { ...progress.step4, completed: true } };
    }
    case 5: {
      const { currentRoundIndex, rounds } = progress.step5;
      if (currentRoundIndex < rounds.length - 1) {
        return { ...progress, step5: { ...progress.step5, currentRoundIndex: currentRoundIndex + 1 } };
      }
      return { ...progress, currentStep: 6, step5: { ...progress.step5, completed: true } };
    }
    default:
      return progress;
  }
}

// Jump to a specific section within the current step (from section stepper click)
export function jumpToSection(progress: AppProgress, sectionIndex: number): AppProgress {
  switch (progress.currentStep) {
    case 1: {
      const notesPerPass = progress.step1.noteOrders[0].length;
      const pass = Math.floor(sectionIndex / notesPerPass);
      const noteIndex = sectionIndex % notesPerPass;
      return {
        ...progress,
        step1: {
          ...progress.step1,
          currentPass: Math.min(pass, 1),
          currentNoteIndex: Math.min(noteIndex, notesPerPass - 1),
        },
      };
    }
    case 2:
      return {
        ...progress,
        step2: {
          ...progress.step2,
          currentNoteIndex: Math.min(sectionIndex, progress.step2.noteOrder.length - 1),
        },
      };
    case 3:
      return {
        ...progress,
        step3: {
          ...progress.step3,
          currentNoteIndex: Math.min(sectionIndex, progress.step3.noteOrder.length - 1),
        },
      };
    case 4:
      return {
        ...progress,
        step4: {
          ...progress.step4,
          currentPairIndex: Math.min(sectionIndex, progress.step4.pairs.length - 1),
        },
      };
    case 5:
      return {
        ...progress,
        step5: {
          ...progress.step5,
          currentRoundIndex: Math.min(sectionIndex, progress.step5.rounds.length - 1),
        },
      };
    default:
      return progress;
  }
}

// Select a new BPM from Step 6 and restart from Step 2 with fresh data
export function selectBpm(progress: AppProgress, bpm: number): AppProgress {
  return {
    ...progress,
    currentStep: 2,
    currentBpm: bpm,
    step2: { noteOrder: shuffle(NATURAL_NOTES), currentNoteIndex: 0, completed: false },
    step3: { noteOrder: shuffle(EXTENDED_NOTES), currentNoteIndex: 0, completed: false },
    step4: { pairs: generatePairs(7), currentPairIndex: 0, completed: false },
    step5: { rounds: generateRounds(3), currentRoundIndex: 0, completed: false },
  };
}

// Labels and current index for the section stepper
export function getSectionInfo(progress: AppProgress): { labels: string[]; currentIndex: number } {
  switch (progress.currentStep) {
    case 1: {
      const { noteOrders, currentPass, currentNoteIndex } = progress.step1;
      return {
        labels: [...noteOrders[0], ...noteOrders[1]],
        currentIndex: currentPass * noteOrders[0].length + currentNoteIndex,
      };
    }
    case 2:
      return { labels: progress.step2.noteOrder, currentIndex: progress.step2.currentNoteIndex };
    case 3:
      return { labels: progress.step3.noteOrder, currentIndex: progress.step3.currentNoteIndex };
    case 4:
      return {
        labels: progress.step4.pairs.map((_, i) => `${i + 1}`),
        currentIndex: progress.step4.currentPairIndex,
      };
    case 5:
      return {
        labels: progress.step5.rounds.map((_, i) => `R${i + 1}`),
        currentIndex: progress.step5.currentRoundIndex,
      };
    default:
      return { labels: [], currentIndex: 0 };
  }
}
