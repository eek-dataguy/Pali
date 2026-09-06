import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Card, Grade } from './srs';
import { DAY, forecast, gradeFromAnswer, isDue, mastery, newCard, retrievability, review, sortByUrgency } from './srs';
import { clamp, dayKey, daysBetween } from './util';
import { LESSONS, UNITS } from '../content/curriculum';

/**
 * All learner state, persisted to the browser.
 *
 * The app is deliberately local-first: no account, no server, nothing leaves
 * the device. That keeps it free to host and usable in a temple with poor
 * connectivity, and progress can still be moved between devices by exporting
 * the JSON.
 */

export type ScriptPref = 'khmer' | 'iast' | 'both';

export type Profile = {
  name: string;
  /** XP the learner aims to earn each day. */
  dailyGoal: number;
  /** Ceiling on brand-new cards per day; also adjusted automatically. */
  newPerDay: number;
  script: ScriptPref;
  showEnglish: boolean;
  audio: boolean;
  /** Slower, clearer audio for chanting practice. */
  speechRate: number;
};

export type DayStat = { xp: number; answers: number; correct: number; seconds: number };

export type LessonRecord = { completed: number; bestAccuracy: number; lastAt: number };

type State = {
  profile: Profile;
  xp: number;
  streak: number;
  bestStreak: number;
  lastActiveDay: string | null;
  cards: Record<string, Card>;
  lessons: Record<string, LessonRecord>;
  /** Accuracy per content tag, which drives the weak-area practice. */
  tagStats: Record<string, { seen: number; correct: number }>;
  daily: Record<string, DayStat>;
  placementDone: boolean;

  setProfile: (patch: Partial<Profile>) => void;
  answer: (card: string, correct: boolean, ms: number, tags: string[], hint?: boolean) => Grade;
  finishLesson: (lessonId: string, accuracy: number, xp: number, seconds: number) => void;
  /** XP from a review session, which completes no lesson. */
  addXp: (xp: number, seconds: number) => void;
  markPlacement: (unlockThrough: string | null) => void;
  resetAll: () => void;
  importState: (json: string) => boolean;
};

const DEFAULT_PROFILE: Profile = {
  name: '',
  dailyGoal: 60,
  newPerDay: 12,
  script: 'both',
  showEnglish: false,
  audio: true,
  speechRate: 0.75,
};

/** Roll the streak forward, or break it if a day was missed. */
function touchDay(state: {
  streak: number; bestStreak: number; lastActiveDay: string | null; daily: Record<string, DayStat>;
}): Partial<State> {
  const today = dayKey();
  if (state.lastActiveDay === today) return {};
  const gap = state.lastActiveDay ? daysBetween(state.lastActiveDay, today) : Infinity;
  const streak = gap === 1 ? state.streak + 1 : 1;
  return {
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
    lastActiveDay: today,
    daily: { ...state.daily, [today]: state.daily[today] ?? { xp: 0, answers: 0, correct: 0, seconds: 0 } },
  };
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      xp: 0,
      streak: 0,
      bestStreak: 0,
      lastActiveDay: null,
      cards: {},
      lessons: {},
      tagStats: {},
      daily: {},
      placementDone: false,

      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      answer: (cardId, correct, ms, tags, hint = false) => {
        const grade = gradeFromAnswer(correct, ms, hint);
        set((s) => {
          const existing = s.cards[cardId] ?? newCard(cardId);
          const updated = review(existing, grade);
          const today = dayKey();
          const day = s.daily[today] ?? { xp: 0, answers: 0, correct: 0, seconds: 0 };
          const tagStats = { ...s.tagStats };
          for (const t of tags) {
            const prev = tagStats[t] ?? { seen: 0, correct: 0 };
            tagStats[t] = { seen: prev.seen + 1, correct: prev.correct + (correct ? 1 : 0) };
          }
          return {
            ...touchDay(s),
            cards: { ...s.cards, [cardId]: updated },
            tagStats,
            daily: {
              ...s.daily,
              [today]: {
                ...day,
                answers: day.answers + 1,
                correct: day.correct + (correct ? 1 : 0),
                seconds: day.seconds + Math.round(ms / 1000),
              },
            },
          };
        });
        return grade;
      },

      finishLesson: (lessonId, accuracy, xp, seconds) =>
        set((s) => {
          const prev = s.lessons[lessonId];
          const today = dayKey();
          const day = s.daily[today] ?? { xp: 0, answers: 0, correct: 0, seconds: 0 };
          return {
            ...touchDay(s),
            xp: s.xp + xp,
            lessons: {
              ...s.lessons,
              [lessonId]: {
                completed: (prev?.completed ?? 0) + 1,
                bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
                lastAt: Date.now(),
              },
            },
            daily: { ...s.daily, [today]: { ...day, xp: day.xp + xp, seconds: day.seconds + seconds } },
          };
        }),

      addXp: (xp, seconds) =>
        set((s) => {
          const today = dayKey();
          const day = s.daily[today] ?? { xp: 0, answers: 0, correct: 0, seconds: 0 };
          return {
            ...touchDay(s),
            xp: s.xp + xp,
            daily: { ...s.daily, [today]: { ...day, xp: day.xp + xp, seconds: day.seconds + seconds } },
          };
        }),

      markPlacement: (unlockThrough) =>
        set((s) => {
          if (!unlockThrough) return { placementDone: true };
          /* A placement test marks earlier lessons as passed so the learner
             starts where they actually are, without grinding the alphabet. */
          const stop = LESSONS.findIndex((l) => l.id === unlockThrough);
          const lessons = { ...s.lessons };
          LESSONS.slice(0, Math.max(0, stop)).forEach((l) => {
            if (!lessons[l.id]) lessons[l.id] = { completed: 1, bestAccuracy: 0.8, lastAt: Date.now() };
          });
          return { placementDone: true, lessons };
        }),

      resetAll: () => set({
        profile: DEFAULT_PROFILE, xp: 0, streak: 0, bestStreak: 0, lastActiveDay: null,
        cards: {}, lessons: {}, tagStats: {}, daily: {}, placementDone: false,
      }),

      importState: (json) => {
        try {
          const data = JSON.parse(json);
          if (!data || typeof data !== 'object' || !('cards' in data)) return false;
          set({ ...get(), ...data });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'pali-khmer-progress',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/* ------------------------------------------------------------- selectors -- */

export function dueCardIds(cards: Record<string, Card>, now = Date.now()): string[] {
  return sortByUrgency(Object.values(cards).filter((c) => isDue(c, now)), now).map((c) => c.id);
}

export function dueCount(cards: Record<string, Card>, now = Date.now()): number {
  return Object.values(cards).filter((c) => isDue(c, now)).length;
}

/** Cards the learner keeps getting wrong, worst first. */
export function weakCardIds(cards: Record<string, Card>, limit = 20): string[] {
  return Object.values(cards)
    .filter((c) => c.lapses > 0 || c.ease < 2.3)
    .sort((a, b) => (b.lapses - a.lapses) || (a.ease - b.ease))
    .slice(0, limit)
    .map((c) => c.id);
}

/** Content tags the learner is measurably weak at, for targeted practice. */
export function weakTags(
  tagStats: Record<string, { seen: number; correct: number }>, minSeen = 6,
): { tag: string; accuracy: number; seen: number }[] {
  return Object.entries(tagStats)
    .filter(([, v]) => v.seen >= minSeen)
    .map(([tag, v]) => ({ tag, accuracy: v.correct / v.seen, seen: v.seen }))
    .filter((x) => x.accuracy < 0.8)
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function isLessonUnlocked(lessonId: string, lessons: Record<string, LessonRecord>): boolean {
  const index = LESSONS.findIndex((l) => l.id === lessonId);
  if (index <= 0) return true;
  return !!lessons[LESSONS[index - 1].id];
}

export function isLessonComplete(lessonId: string, lessons: Record<string, LessonRecord>): boolean {
  return !!lessons[lessonId];
}

/** The single lesson the home screen should push the learner towards next. */
export function nextLesson(lessons: Record<string, LessonRecord>): string {
  const next = LESSONS.find((l) => !lessons[l.id]);
  return next?.id ?? LESSONS[LESSONS.length - 1].id;
}

export function unitProgress(unitId: string, lessons: Record<string, LessonRecord>): number {
  const unit = UNITS.find((u) => u.id === unitId);
  if (!unit) return 0;
  const done = unit.lessons.filter((l) => lessons[l.id]).length;
  return done / unit.lessons.length;
}

export function todayStat(daily: Record<string, DayStat>): DayStat {
  return daily[dayKey()] ?? { xp: 0, answers: 0, correct: 0, seconds: 0 };
}

/**
 * How many new cards to introduce today. When the review backlog grows the
 * intake shrinks automatically, which is what stops a learner drowning in
 * reviews three weeks in — the usual reason people quit a spaced-repetition app.
 */
export function newCardAllowance(profile: Profile, cards: Record<string, Card>): number {
  const backlog = dueCount(cards);
  if (backlog > 120) return 0;
  if (backlog > 60) return Math.round(profile.newPerDay * 0.4);
  if (backlog > 30) return Math.round(profile.newPerDay * 0.7);
  return profile.newPerDay;
}

/** Overall mastery of the whole course, 0-1, for the profile screen. */
export function overallMastery(cards: Record<string, Card>): number {
  const values = Object.values(cards);
  if (!values.length) return 0;
  return values.reduce((n, c) => n + mastery(c), 0) / values.length;
}

export function reviewForecast(cards: Record<string, Card>, days = 14): number[] {
  return forecast(Object.values(cards), days);
}

/** Cards whose recall probability has dropped furthest, for the strength view. */
export function fadingCards(cards: Record<string, Card>, limit = 12): { id: string; r: number }[] {
  return Object.values(cards)
    .filter((c) => c.state === 'review')
    .map((c) => ({ id: c.id, r: retrievability(c) }))
    .sort((a, b) => a.r - b.r)
    .slice(0, limit);
}

export function goalProgress(daily: Record<string, DayStat>, profile: Profile): number {
  return clamp(todayStat(daily).xp / Math.max(1, profile.dailyGoal), 0, 1);
}

/** Days studied in the last fortnight, for the activity strip. */
export function recentActivity(daily: Record<string, DayStat>, days = 14): { day: string; xp: number }[] {
  const out: { day: string; xp: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = dayKey(Date.now() - i * DAY);
    out.push({ day: key, xp: daily[key]?.xp ?? 0 });
  }
  return out;
}
