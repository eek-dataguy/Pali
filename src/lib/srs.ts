/**
 * Spaced repetition.
 *
 * The scheduling is an SM-2 variant with short learning steps, interval fuzz,
 * and leech handling. Each thing worth remembering — a letter, a word, a case
 * ending, a sutta line — is one card, and the whole app is really just a queue
 * of cards that the lessons introduce and the reviews keep alive.
 */

export type Grade = 0 | 1 | 2 | 3; // again, hard, good, easy
export type CardState = 'new' | 'learning' | 'review' | 'relearning';

export type Card = {
  id: string;
  state: CardState;
  /** Days until the next review once the card has graduated. */
  interval: number;
  /** SM-2 ease factor: how fast intervals grow for this card. */
  ease: number;
  /** Index into LEARN_STEPS / RELEARN_STEPS while still in (re)learning. */
  step: number;
  due: number;
  lastReview: number;
  reps: number;
  lapses: number;
  /** Consecutive correct answers, used for the mastery display. */
  streak: number;
};

export const MINUTE = 60_000;
export const DAY = 86_400_000;

/** Minutes. Two quick sight-of-hand repetitions before the card graduates. */
const LEARN_STEPS = [1, 10];
const RELEARN_STEPS = [10];

const GRADUATING_INTERVAL = 1;
const EASY_INTERVAL = 4;
const MIN_EASE = 1.3;
const MAX_EASE = 2.8;
const LEECH_THRESHOLD = 6;

export function newCard(id: string, now = Date.now()): Card {
  return {
    id, state: 'new', interval: 0, ease: 2.5, step: 0,
    due: now, lastReview: 0, reps: 0, lapses: 0, streak: 0,
  };
}

/** ±8% jitter so cards introduced together don't come back together forever. */
function fuzz(days: number, rand: () => number): number {
  if (days < 2) return days;
  const spread = Math.max(1, days * 0.08);
  return Math.max(1, Math.round(days + (rand() * 2 - 1) * spread));
}

/**
 * Advance a card after the learner grades it. Returns a new card — callers keep
 * the old one if they want to show what changed.
 */
export function review(card: Card, grade: Grade, now = Date.now(), rand: () => number = Math.random): Card {
  const next: Card = { ...card, reps: card.reps + 1, lastReview: now };
  next.streak = grade === 0 ? 0 : card.streak + 1;

  if (card.state === 'new' || card.state === 'learning') {
    if (grade === 0) {
      next.state = 'learning';
      next.step = 0;
      next.due = now + LEARN_STEPS[0] * MINUTE;
      return next;
    }
    if (grade === 3) {
      next.state = 'review';
      next.step = -1;
      next.interval = fuzz(EASY_INTERVAL, rand);
      next.due = now + next.interval * DAY;
      return next;
    }
    const step = grade === 1 ? card.step : card.step + 1;
    if (step >= LEARN_STEPS.length) {
      next.state = 'review';
      next.step = -1;
      next.interval = fuzz(GRADUATING_INTERVAL, rand);
      next.due = now + next.interval * DAY;
      return next;
    }
    next.state = 'learning';
    next.step = step;
    next.due = now + LEARN_STEPS[step] * MINUTE;
    return next;
  }

  if (card.state === 'relearning') {
    if (grade === 0) {
      next.step = 0;
      next.due = now + RELEARN_STEPS[0] * MINUTE;
      return next;
    }
    const step = card.step + 1;
    if (step >= RELEARN_STEPS.length) {
      next.state = 'review';
      next.step = -1;
      next.interval = fuzz(Math.max(1, Math.round(card.interval)), rand);
      next.due = now + next.interval * DAY;
      return next;
    }
    next.step = step;
    next.due = now + RELEARN_STEPS[step] * MINUTE;
    return next;
  }

  // Graduated card in the review queue.
  if (grade === 0) {
    next.state = 'relearning';
    next.step = 0;
    next.lapses = card.lapses + 1;
    next.ease = Math.max(MIN_EASE, card.ease - 0.2);
    next.interval = Math.max(1, Math.round(card.interval * 0.4));
    next.due = now + RELEARN_STEPS[0] * MINUTE;
    return next;
  }

  const elapsedDays = card.lastReview ? (now - card.lastReview) / DAY : card.interval;
  const base = Math.max(card.interval, elapsedDays);
  let ease = card.ease;
  let interval: number;
  if (grade === 1) {
    ease = Math.max(MIN_EASE, ease - 0.15);
    interval = base * 1.2;
  } else if (grade === 2) {
    interval = base * ease;
  } else {
    ease = Math.min(MAX_EASE, ease + 0.15);
    interval = base * ease * 1.3;
  }
  next.ease = ease;
  next.interval = fuzz(Math.max(1, Math.round(interval)), rand);
  next.due = now + next.interval * DAY;
  next.state = 'review';
  next.step = -1;
  return next;
}

/** A card that keeps lapsing needs re-teaching, not more reviews. */
export function isLeech(card: Card): boolean {
  return card.lapses >= LEECH_THRESHOLD;
}

export function isDue(card: Card, now = Date.now()): boolean {
  return card.state !== 'new' && card.due <= now;
}

/**
 * Estimated chance of recalling the card right now. Drives review ordering and
 * the "weak items" practice, and feeds the strength bars in the UI.
 */
export function retrievability(card: Card, now = Date.now()): number {
  if (card.state === 'new') return 0;
  if (card.state === 'learning' || card.state === 'relearning') return 0.4;
  const days = (now - card.lastReview) / DAY;
  const stability = Math.max(0.1, card.interval);
  return Math.exp(Math.log(0.9) * (days / stability));
}

/** 0-1 mastery for progress display: how far the card is towards long intervals. */
export function mastery(card: Card): number {
  if (card.state === 'new') return 0;
  const byInterval = Math.min(1, Math.log10(1 + card.interval) / Math.log10(1 + 60));
  const byStreak = Math.min(1, card.streak / 5);
  return Math.max(0, Math.min(1, byInterval * 0.7 + byStreak * 0.3));
}

/** Most urgent first: overdue cards, then the ones closest to being forgotten. */
export function sortByUrgency(cards: Card[], now = Date.now()): Card[] {
  return [...cards].sort((a, b) => retrievability(a, now) - retrievability(b, now));
}

/** How many cards come due on each of the next `days` days. */
export function forecast(cards: Card[], days = 14, now = Date.now()): number[] {
  const out = new Array(days).fill(0);
  for (const card of cards) {
    if (card.state === 'new') continue;
    const offset = Math.floor((card.due - now) / DAY);
    if (offset < 0) out[0] += 1;
    else if (offset < days) out[offset] += 1;
  }
  return out;
}

/**
 * Turn a scored answer into a grade. Speed matters: a correct answer that took
 * a long time is "hard", so it comes back sooner than a confident one.
 */
export function gradeFromAnswer(correct: boolean, ms: number, hintUsed = false): Grade {
  if (!correct) return 0;
  if (hintUsed) return 1;
  if (ms < 4000) return 3;
  if (ms < 12000) return 2;
  return 1;
}
