import { UNITS, LEVEL_INFO } from '../content/curriculum';
import type { Lesson, Unit } from '../content/types';
import { navigate } from '../lib/router';
import {
  dueCount, goalProgress, isLessonComplete, isLessonUnlocked, nextLesson,
  todayStat, unitProgress, useStore, weakCardIds,
} from '../lib/store';
import { khmerNumber } from '../lib/pali';
import { Bar, KhmerNumber, ProgressRing } from '../components/ui';

/**
 * The learning path.
 *
 * Lessons unlock in order, and the single "continue" button always points at
 * the next unfinished one, so a returning learner never has to decide where
 * they were — deciding is friction, and friction is why streaks die.
 */

export default function Home() {
  const lessons = useStore((s) => s.lessons);
  const cards = useStore((s) => s.cards);
  const profile = useStore((s) => s.profile);
  const daily = useStore((s) => s.daily);
  const streak = useStore((s) => s.streak);
  const xp = useStore((s) => s.xp);

  const due = dueCount(cards);
  const weak = weakCardIds(cards).length;
  const next = nextLesson(lessons);
  const goal = goalProgress(daily, profile);
  const today = todayStat(daily);

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-8">
      <header className="sticky top-0 z-10 -mx-4 mb-4 border-b border-stone-200 bg-stone-50/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-bold text-saffron-600">
              🔥 <KhmerNumber value={streak} />
            </span>
            <span className="flex items-center gap-1 font-bold text-sky-600">
              ⭐ <KhmerNumber value={xp} />
            </span>
          </div>
          <button type="button" onClick={() => navigate('/profile')} aria-label="គោលដៅប្រចាំថ្ងៃ">
            <ProgressRing value={goal} color="#ff7f11">
              {khmerNumber(Math.round(goal * 100))}%
            </ProgressRing>
          </button>
        </div>
      </header>

      <section className="mb-5 space-y-3">
        <button
          type="button"
          onClick={() => navigate(`/lesson/${next}`)}
          className="btn-primary w-full py-4 text-lg"
        >
          បន្តរៀន →
        </button>

        <div className="grid grid-cols-2 gap-3">
          <ActionCard
            disabled={due === 0}
            onClick={() => navigate('/review')}
            icon="🔁"
            title="រំឭកឡើងវិញ"
            sub={due ? `${khmerNumber(due)} សន្លឹកដល់ពេល` : 'គ្មានអ្វីត្រូវរំឭកទេ'}
          />
          <ActionCard
            disabled={weak === 0}
            onClick={() => navigate('/review/weak')}
            icon="🎯"
            title="ចំណុចខ្សោយ"
            sub={weak ? `${khmerNumber(weak)} ចំណុចត្រូវពង្រឹង` : 'មិនទាន់មានទិន្នន័យ'}
          />
        </div>

        {today.answers > 0 && (
          <p className="text-center text-xs text-stone-500">
            ថ្ងៃនេះ៖ ឆ្លើយ {khmerNumber(today.answers)} សំណួរ · ត្រូវ{' '}
            {khmerNumber(Math.round((today.correct / today.answers) * 100))}%
            {' · '}{khmerNumber(Math.max(1, Math.round(today.seconds / 60)))} នាទី
          </p>
        )}
      </section>

      {UNITS.map((unit) => (
        <UnitBlock key={unit.id} unit={unit} lessons={lessons} />
      ))}
    </div>
  );
}

function ActionCard({
  icon, title, sub, onClick, disabled,
}: { icon: string; title: string; sub: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="card px-3 py-3 text-left transition active:scale-[.98] disabled:opacity-50"
    >
      <div className="text-xl leading-none">{icon}</div>
      <div className="mt-1.5 font-semibold">{title}</div>
      <div className="text-xs text-stone-500">{sub}</div>
    </button>
  );
}

function UnitBlock({ unit, lessons }: { unit: Unit; lessons: Record<string, { completed: number }> }) {
  const progress = unitProgress(unit.id, lessons as never);
  const level = LEVEL_INFO[unit.level];

  return (
    <section className="mb-6">
      <div className="mb-3 rounded-2xl px-4 py-3 text-white" style={{ backgroundColor: unit.color }}>
        <div className="text-xs font-semibold uppercase tracking-wide opacity-80">{level.km}</div>
        <h2 className="mt-0.5 text-lg font-bold leading-snug">
          {unit.icon} {unit.kmTitle}
        </h2>
        <p className="mt-1 text-sm opacity-90">{unit.kmGoal}</p>
        <div className="mt-2.5 flex items-center gap-2">
          <Bar value={progress} className="bg-white/30" />
          <span className="text-xs font-semibold">{khmerNumber(Math.round(progress * 100))}%</span>
        </div>
      </div>

      <div className="space-y-2">
        {unit.lessons.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} lessons={lessons} color={unit.color} />
        ))}
      </div>
    </section>
  );
}

const KIND_ICON: Record<Lesson['kind'], string> = {
  alphabet: '🔤', vocab: '💬', grammar: '🧩', reading: '📖',
  chant: '📿', compose: '✍️', checkpoint: '🏆',
};

function LessonRow({
  lesson, lessons, color,
}: { lesson: Lesson; lessons: Record<string, { completed: number }>; color: string }) {
  const unlocked = isLessonUnlocked(lesson.id, lessons as never);
  const done = isLessonComplete(lesson.id, lessons as never);

  return (
    <button
      type="button"
      disabled={!unlocked}
      onClick={() => navigate(`/lesson/${lesson.id}`)}
      className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left transition
        ${done ? 'border-leaf-200 bg-leaf-50'
          : unlocked ? 'border-stone-200 bg-white active:scale-[.99]'
          : 'border-stone-200 bg-stone-100 opacity-60'}`}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
        style={{ backgroundColor: done ? '#35ac4b' : unlocked ? color : '#d6d3d1', color: 'white' }}
      >
        {done ? '✓' : unlocked ? KIND_ICON[lesson.kind] : '🔒'}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{lesson.kmTitle}</span>
        <span className="block truncate text-xs text-stone-500">{lesson.title}</span>
      </span>
      <span className="shrink-0 text-xs font-semibold text-stone-400">+{lesson.xp}</span>
    </button>
  );
}
