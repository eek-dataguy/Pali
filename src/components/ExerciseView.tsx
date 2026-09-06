import { useEffect, useRef } from 'react';
import type { Exercise } from '../lib/exercises';
import type { Answer } from '../lib/judge';
import { toKhmer } from '../lib/pali';
import { speak } from '../lib/audio';
import { useStore } from '../lib/store';
import { DataTable, ScriptHeading } from './ui';

/**
 * Renders one exercise as a fully controlled component: the current answer
 * comes in as a prop and every change goes straight back out. The component
 * holds no answer state of its own, so it cannot disagree with the runner
 * about what the learner has chosen.
 */

const DIACRITICS = ['ā', 'ī', 'ū', 'ṃ', 'ṅ', 'ñ', 'ṭ', 'ḍ', 'ṇ', 'ḷ'];

export type ExerciseViewProps = {
  exercise: Exercise;
  answer: Answer;
  onAnswer: (answer: Answer) => void;
  /** True once the answer has been checked; locks the controls. */
  revealed: boolean;
  correct: boolean;
};

export function ExerciseView(props: ExerciseViewProps) {
  switch (props.exercise.kind) {
    case 'teach':
      return <TeachCard exercise={props.exercise} />;
    case 'choice':
    case 'listen':
      return <ChoiceCard {...props} exercise={props.exercise} />;
    case 'type':
      return <TypeCard {...props} exercise={props.exercise} />;
    case 'wordbank':
      return <WordBankCard {...props} exercise={props.exercise} />;
    default:
      return null;
  }
}

/* --------------------------------------------------------------- teaching */

function TeachCard({ exercise }: { exercise: Extract<Exercise, { kind: 'teach' }> }) {
  const audio = useStore((s) => s.profile.audio);
  const rate = useStore((s) => s.profile.speechRate);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-saffron-50 p-5 text-center">
        {exercise.pali
          ? <ScriptHeading pali={exercise.pali} />
          : <div className="text-2xl font-semibold">{exercise.heading}</div>}
        {exercise.meaning && <div className="mt-2 text-lg text-stone-700">{exercise.meaning}</div>}
        {exercise.pali && audio && (
          <button
            type="button"
            onClick={() => speak(exercise.pali!, rate)}
            className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-saffron-700 shadow-sm"
          >
            🔊 ស្តាប់
          </button>
        )}
      </div>
      {exercise.notes.map((note, i) => (
        <p key={i} className="rounded-xl bg-stone-100 px-4 py-3 text-[15px] leading-relaxed text-stone-700">
          {note}
        </p>
      ))}
      {exercise.table && (
        <DataTable caption={exercise.table.caption} headers={exercise.table.headers} rows={exercise.table.rows} />
      )}
    </div>
  );
}

/* --------------------------------------------------------- multiple choice */

function ChoiceCard({
  exercise, answer, onAnswer, revealed,
}: ExerciseViewProps & { exercise: Extract<Exercise, { kind: 'choice' | 'listen' }> }) {
  const rate = useStore((s) => s.profile.speechRate);
  const isListen = exercise.kind === 'listen';
  const selected = answer.kind === 'choice' ? answer.index : -1;

  /* Play a listening prompt once when it first appears. */
  useEffect(() => {
    if (isListen) speak(exercise.speak, rate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  return (
    <div className="space-y-5">
      {isListen ? (
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold">ស្តាប់ រួចជ្រើសរើសពាក្យដែលអ្នកឮ</p>
          <button
            type="button"
            onClick={() => speak(exercise.speak, rate)}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-sky-500 text-4xl text-white shadow-[0_5px_0_#0369a1] active:translate-y-1"
            aria-label="ស្តាប់ម្តងទៀត"
          >
            🔊
          </button>
        </div>
      ) : (
        <div>
          <p className="text-lg font-semibold text-stone-800">{exercise.prompt}</p>
          {exercise.promptPali && (
            <div className="mt-4 rounded-2xl bg-stone-100 px-4 py-5 text-center">
              <ScriptHeading pali={exercise.promptPali} />
            </div>
          )}
        </div>
      )}

      <div className="grid gap-3">
        {exercise.options.map((opt, i) => {
          const isChosen = selected === i;
          const isRight = exercise.answers.includes(i);
          const cls = revealed
            ? isRight ? 'option option-correct'
              : isChosen ? 'option option-wrong' : 'option opacity-60'
            : isChosen ? 'option option-selected' : 'option';
          return (
            <button
              key={`${exercise.id}:${i}`}
              type="button"
              disabled={revealed}
              onClick={() => onAnswer({ kind: 'choice', index: i })}
              className={cls}
            >
              <span className="text-lg font-medium">{opt.text}</span>
              {opt.sub && <span className="pali-khmer ml-3 text-stone-500">{opt.sub}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ typing */

function TypeCard({
  exercise, answer, onAnswer, revealed, correct,
}: ExerciseViewProps & { exercise: Extract<Exercise, { kind: 'type' }> }) {
  const ref = useRef<HTMLInputElement>(null);
  const value = answer.kind === 'text' ? answer.value : '';

  useEffect(() => { ref.current?.focus(); }, [exercise.id]);

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-stone-800">{exercise.prompt}</p>
      {exercise.promptSub && <p className="text-sm text-stone-500">{exercise.promptSub}</p>}
      <input
        ref={ref}
        value={value}
        disabled={revealed}
        onChange={(e) => onAnswer({ kind: 'text', value: e.target.value })}
        placeholder="សរសេរចម្លើយនៅទីនេះ…"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`w-full rounded-2xl border-2 px-4 py-4 text-xl outline-none transition
          ${!revealed ? 'border-stone-200 focus:border-sky-400'
            : correct ? 'border-leaf-400 bg-leaf-50' : 'border-red-400 bg-red-50'}`}
      />
      {exercise.isPali && !revealed && (
        <div className="flex flex-wrap gap-2">
          {DIACRITICS.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => {
                onAnswer({ kind: 'text', value: value + ch });
                ref.current?.focus();
              }}
              className="pali-iast rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-lg shadow-sm active:scale-95"
            >
              {ch}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- word bank */

function WordBankCard({
  exercise, answer, onAnswer, revealed, correct,
}: ExerciseViewProps & { exercise: Extract<Exercise, { kind: 'wordbank' }> }) {
  const order = answer.kind === 'bank' ? answer.order : [];
  const available = exercise.bank.map((w, i) => ({ w, i })).filter(({ i }) => !order.includes(i));

  return (
    <div className="space-y-5">
      <p className="text-lg font-semibold text-stone-800">{exercise.prompt}</p>
      {exercise.promptPali && (
        <div className="rounded-2xl bg-stone-100 px-4 py-5">
          <ScriptHeading pali={exercise.promptPali} />
        </div>
      )}

      <div
        className={`min-h-[4.5rem] rounded-2xl border-2 border-dashed px-3 py-3 transition
          ${!revealed ? 'border-stone-300'
            : correct ? 'border-leaf-400 bg-leaf-50' : 'border-red-400 bg-red-50'}`}
      >
        <div className="flex flex-wrap gap-2">
          {order.map((bankIndex, position) => (
            <button
              key={`${bankIndex}-${position}`}
              type="button"
              disabled={revealed}
              onClick={() => onAnswer({ kind: 'bank', order: order.filter((_, k) => k !== position) })}
              className="rounded-xl border border-stone-300 bg-white px-3 py-2 shadow-sm active:scale-95"
            >
              {exercise.bank[bankIndex]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {available.map(({ w, i }) => (
          <button
            key={i}
            type="button"
            disabled={revealed}
            onClick={() => onAnswer({ kind: 'bank', order: [...order, i] })}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-[0_2px_0_#e7e5e4] active:translate-y-[2px] active:shadow-none"
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Shown in the feedback bar after a wrong answer. */
export function CorrectAnswer({ exercise }: { exercise: Exercise }) {
  switch (exercise.kind) {
    case 'choice':
    case 'listen':
      return <span className="font-semibold">{exercise.options[exercise.answers[0]]?.text}</span>;
    case 'type':
      return (
        <span className="font-semibold">
          {exercise.answer}
          {exercise.isPali && <span className="pali-khmer ml-2">{toKhmer(exercise.answer)}</span>}
        </span>
      );
    case 'wordbank':
      return <span className="font-semibold">{exercise.answer.join(' ')}</span>;
    default:
      return null;
  }
}
