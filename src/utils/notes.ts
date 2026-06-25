export const NATURAL_NOTES: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// Extended set including both enharmonic names (e.g. G# AND A♭)
export const EXTENDED_NOTES: string[] = [
  'C', 'C#', 'D♭', 'D', 'D#', 'E♭', 'E', 'F', 'F#', 'G♭', 'G', 'G#', 'A♭', 'A', 'A#', 'B♭', 'B',
];

// Pairs of notes that are the same pitch — should never appear in the same Step 4 pair
const ENHARMONIC_PAIRS: Array<[string, string]> = [
  ['C#', 'D♭'],
  ['D#', 'E♭'],
  ['F#', 'G♭'],
  ['G#', 'A♭'],
  ['A#', 'B♭'],
];

export function shuffle<T>(arr: ReadonlyArray<T>): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Shuffle strings ensuring no two consecutive notes are enharmonically equivalent.
export function shuffleNoAdjacentEnharmonics(arr: ReadonlyArray<string>): string[] {
  for (let attempt = 0; attempt < 200; attempt++) {
    const result = shuffle(arr);
    let valid = true;
    for (let i = 0; i < result.length - 1; i++) {
      if (areEnharmonic(result[i], result[i + 1])) {
        valid = false;
        break;
      }
    }
    if (valid) return result;
  }
  return shuffle(arr); // fallback (extremely unlikely)
}

export function areEnharmonic(a: string, b: string): boolean {
  return ENHARMONIC_PAIRS.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

function randomPair(): [string, string] {
  const pool = shuffle(EXTENDED_NOTES);
  for (let i = 0; i < pool.length - 1; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      if (!areEnharmonic(pool[i], pool[j])) {
        return [pool[i], pool[j]];
      }
    }
  }
  return [pool[0], pool[2]]; // fallback (unreachable in practice)
}

export function generatePairs(count: number): Array<[string, string]> {
  return Array.from({ length: count }, () => randomPair());
}

export function generateRounds(count: number, size = 7): string[][] {
  return Array.from({ length: count }, () => shuffleNoAdjacentEnharmonics(EXTENDED_NOTES).slice(0, size));
}
