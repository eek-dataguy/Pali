import { useCallback, useRef, useState } from 'react';
import type { Exercise } from '../lib/exercises';
import { NO_ANSWER, hasAnswer, judge, type Answer } from '../lib/judge';
import { useStore } from '../lib/store';
import { CorrectAnswer, ExerciseView } from './ExerciseView';
import { Bar, Pill } from './ui';

/**
 * Runs one session.
 *
 * Wrong answers are pushed back onto the end of the queue rather than dismissed,
 * so a lesson cannot be finished while something in it is still unlearned — the
 * session length adapts to the learner instead of the other way round. That
 * retry is capped, though: an item a learner cannot get right today should not
 * hold the lesson open indefinitely, and the scheduler will bring it back
 * tomorrow anyway, which is the right place for it.
 */

/** How many times one exercise may come back inside a single session. */
const MAX_RETRIES = 2;

export type LessonResult = {
  answered: number;
  correct: number;
  seconds: number;
  xp: number;
};

export function LessonRunner({
  exercises, title, xpReward, onFinish, onQuit,
}: {
  exercises: Exercise[];
  title: string;
  xpReward: number;
  onFinish: (result: LessonResult) => void;
  onQuit: () => void;
}) {
  const record = useStore((s) => s.answer);
  const [queue, setQueue] = useState<Exercise[]>(exercises);
  const [position, setPosition] = useState(0);
  const [answer, setAnswer] = useState<Answer>(NO_ANSWER);
  const [checked, setChecked] = useState<{ correct: boolean } | null>(null);
  const [stats, setStats] = useState({ answered: 0, correct: 0, combo: 0, bestCombo: 0 });

  const shownAt = useRef(Date.now());
  const startedAt = useRef(Date.now());
  const retries = useRef(new Map<string, number>());

  const current = queue[position];
  const ready = current?.kind === 'teach' || hasAnswer(answer);

  const advance = useCallback((requeue: Exercise | null) => {
    setQueue((q) => (requeue ? [...q, requeue] : q));
    setPosition((p) => p + 1);
    setAnswer(NO_ANSWER);
    setChecked(null);
    shownAt.current = Date.now();
  }, []);

  if (!current) {
    const seconds = Math.round((Date.now() - startedAt.current) / 1000);
    const accuracy = stats.answered ? stats.correct / stats.answered : 1;
    return (
      <Summary
        title={title}
        stats={stats}
        seconds={seconds}
        xp={Math.round(xpReward * (0.6 + 0.4 * accuracy))}
        onDone={(xp) => onFinish({ answered: stats.answered, correct: stats.correct, seconds, xp })}
      />
    );
  }

  const handleCheck = () => {
    if (current.kind === 'teach') {
      advance(null);
      return;
    }
    const correct = judge(current, answer);
    record(current.card, correct, Date.now() - shownAt.current, current.tags);
    setChecked({ correct });
    setStats((s) => {
      const combo = correct ? s.combo + 1 : 0;
      return {
        answered: s.answered + 1,
        correct: s.correct + (correct ? 1 : 0),
        combo,
        bestCombo: Math.max(s.bestCombo, combo),
      };
    });
  };

  const progress = Math.min(1, position / Math.max(1, queue.length));

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3">
          <button
            type="button"
            onClick={onQuit}
            aria-label="ចាកចេញ"
            className="text-2xl leading-none text-stone-400 hover:text-stone-600"
          >
            ✕
          </button>
          <Bar value={progress} />
          {stats.combo >= 3 && <Pill tone="saffron">🔥 {stats.combo}</Pill>}
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-40">
        <div className="mx-auto w-full max-w-xl">
          <ExerciseView
            exercise={current}
            answer={answer}
            onAnswer={setAnswer}
            revealed={checked !== null}
            correct={checked?.correct ?? false}
          />
        </div>
      </main>

      <footer
        className={`fixed inset-x-0 bottom-0 z-30 border-t px-4 py-4
          ${checked === null ? 'border-stone-200 bg-white'
            : checked.correct ? 'border-leaf-200 bg-leaf-50' : 'border-red-200 bg-red-50'}`}
      >
        <div className="mx-auto w-full max-w-xl">
          {checked && (
            <div className="mb-3">
              <p className={`text-lg font-bold ${checked.correct ? 'text-leaf-700' : 'text-red-700'}`}>
                {checked.correct ? '✓ ត្រូវហើយ!' : '✗ មិនទាន់ត្រូវទេ'}
              </p>
              {!checked.correct && (
                <p className="mt-1 text-stone-700">
                  ចម្លើយត្រូវ៖ <CorrectAnswer exercise={current} />
                </p>
              )}
              {'explain' in current && current.explain && (
                <p className="mt-1 text-sm text-stone-600">{current.explain}</p>
              )}
              {!checked.correct && (retries.current.get(current.id) ?? 0) < MAX_RETRIES && (
                <p className="mt-1 text-xs text-stone-500">សំណួរនេះនឹងត្រលប់មកវិញនៅចុងមេរៀន។</p>
              )}
            </div>
          )}

          {checked === null ? (
            <button
              type="button"
              disabled={!ready}
              onClick={handleCheck}
              className="btn-primary w-full text-lg"
            >
              {current.kind === 'teach' ? 'យល់ហើយ — បន្ត' : 'ពិនិត្យ'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => advance(checked.correct ? null : current)}
              className="btn-primary w-full text-lg"
            >
              បន្ត
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

function Summary({
  title, stats, seconds, xp, onDone,
}: {
  title: string;
  stats: { answered: number; correct: number; bestCombo: number };
  seconds: number;
  xp: number;
  onDone: (xp: number) => void;
}) {
  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 100;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-6xl">🪷</div>
      <h2 className="text-2xl font-bold">មេរៀនចប់ហើយ!</h2>
      <p className="text-stone-500">{title}</p>
      <div className="grid w-full max-w-sm grid-cols-3 gap-3">
        <Stat label="ពិន្ទុ" value={`+${xp}`} tone="text-saffron-600" />
        <Stat label="ត្រឹមត្រូវ" value={`${accuracy}%`} tone="text-leaf-600" />
        <Stat label="រយៈពេល" value={`${Math.max(1, Math.round(seconds / 60))} នាទី`} tone="text-sky-600" />
      </div>
      {stats.bestCombo >= 5 && (
        <p className="text-stone-600">🔥 ឆ្លើយត្រូវជាប់គ្នា {stats.bestCombo} ដង</p>
      )}
      <button type="button" onClick={() => onDone(xp)} className="btn-primary w-full max-w-sm text-lg">
        បន្ត
      </button>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="card px-3 py-4">
      <div className={`text-xl font-bold ${tone}`}>{value}</div>
      <div className="mt-1 text-xs text-stone-500">{label}</div>
    </div>
  );
}

