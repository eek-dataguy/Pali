import type { Exercise } from './exercises';
import { paliEquals } from './pali';

/**
 * Grading, as a pure function.
 *
 * Answer state lives in the session runner, not inside each exercise
 * component, and correctness is decided here from (exercise, answer) alone.
 * That keeps grading unit-testable and — more importantly — removes any
 * dependence on React effect ordering, which is what made an earlier
 * callback-based version intermittently refuse to accept a selected answer.
 */

export type Answer =
  | { kind: 'none' }
  | { kind: 'choice'; index: number }
  | { kind: 'text'; value: string }
  | { kind: 'bank'; order: number[] }
  /** Recitation: either a recogniser's similarity score, or the learner's own call. */
  | { kind: 'spoken'; confident: boolean };

export const NO_ANSWER: Answer = { kind: 'none' };

/** Has the learner supplied something we can grade? */
export function hasAnswer(answer: Answer): boolean {
  switch (answer.kind) {
    case 'choice': return answer.index >= 0;
    case 'text': return answer.value.trim().length > 0;
    case 'bank': return answer.order.length > 0;
    case 'spoken': return true;
    default: return false;
  }
}

/** Accepts diacritic-free romanisation and Khmer script for Pali answers. */
function judgeTyped(exercise: Extract<Exercise, { kind: 'type' }>, given: string): boolean {
  const text = given.trim();
  if (!text) return false;
  if (!exercise.isPali) {
    const norm = (s: string) => s.replace(/\s+/g, ' ').replace(/[។.]/g, '').trim();
    return norm(text) === norm(exercise.answer);
  }
  return exercise.accept.some((a) => paliEquals(a, text)) || paliEquals(exercise.answer, text);
}

export function judge(exercise: Exercise, answer: Answer): boolean {
  switch (exercise.kind) {
    case 'teach':
      return true;
    case 'choice':
    case 'listen':
      return answer.kind === 'choice' && exercise.answers.includes(answer.index);
    case 'type':
      return answer.kind === 'text' && judgeTyped(exercise, answer.value);
    case 'wordbank':
      return answer.kind === 'bank'
        && answer.order.map((i) => exercise.bank[i]).join(' ') === exercise.answer.join(' ');
    case 'speak':
      return answer.kind === 'spoken' && answer.confident;
    default:
      return false;
  }
}

/** What the learner actually gave, for the feedback line. */
export function describeAnswer(exercise: Exercise, answer: Answer): string {
  if (answer.kind === 'choice' && (exercise.kind === 'choice' || exercise.kind === 'listen')) {
    return exercise.options[answer.index]?.text ?? '';
  }
  if (answer.kind === 'text') return answer.value.trim();
  if (answer.kind === 'bank' && exercise.kind === 'wordbank') {
    return answer.order.map((i) => exercise.bank[i]).join(' ');
  }
  return '';
}
