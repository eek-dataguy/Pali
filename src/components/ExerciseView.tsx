import { useEffect, useRef, useState } from 'react';
import type { Exercise } from '../lib/exercises';
import { paliEquals, toKhmer } from '../lib/pali';
import { speak } from '../lib/audio';
import { useStore } from '../lib/store';
import { DataTable, ScriptHeading, ScriptText } from './ui';

/**
 * Renders a single exercise and reports whether the learner got it right.
 *
 * The component is controlled by LessonRunner: it owns nothing about
 * progression, only about how one question looks and how its answer is judged.
 */

export type Judgement = { correct: boolean; given: string };

const DIACRITICS = ['ā', 'ī', 'ū', 'ṃ', 'ṅ', 'ñ', 'ṭ', 'ḍ', 'ṇ', 'ḷ'];

export function ExerciseView({
  exercise, checked, onReady,
}: {
  exercise: Exercise;
  /** Set once the learner has pressed check; locks the controls. */
  checked: Judgement | null;
  /** Reports whether an answer is selected, and how to judge it when asked. */
  onReady: (ready: boolean, judge: () => Judgement) => void;
}) {
  switch (exercise.kind) {
    case 'teach':
      return <TeachCard exercise={exercise} onReady={onReady} />;
    case 'choice':
    case 'listen':
      return <ChoiceCard exercise={exercise} checked={checked} onReady={onReady} />;
    case 'type':
      return <TypeCard exercise={exercise} checked={checked} onReady={onReady} />;
    case 'wordbank':
      return <WordBankCard exercise={exercise} checked={checked} onReady={onReady} />;
    case 'match':
      return <div className="text-stone-500">…</div>;
  }
}

/* --------------------------------------------------------------- teaching */

function TeachCard({
  exercise, onReady,
}: { exercise: Extract<Exercise, { kind: 'teach' }>; onReady: (r: boolean, j: () => Judgement) => void }) {
  const audio = useStore((s) => s.profile.audio);
  const rate = useStore((s) => s.profile.speechRate);
  useEffect(() => {
    onReady(true, () => ({ correct: true, given: '' }));
  }, [exercise.id, onReady]);

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

/* ----------------------------------------------------------- multiple choice */

function ChoiceCard({
  exercise, checked, onReady,
}: {
  exercise: Extract<Exercise, { kind: 'choice' | 'listen' }>;
  checked: Judgement | null;
  onReady: (r: boolean, j: () => Judgement) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const rate = useStore((s) => s.profile.speechRate);
  const isListen = exercise.kind === 'listen';

  useEffect(() => setSelected(null), [exercise.id]);

  useEffect(() => {
    onReady(selected !== null, () => ({
      correct: selected !== null && exercise.answers.includes(selected),
      given: selected !== null ? exercise.options[selected].text : '',
    }));
  }, [selected, exercise, onReady]);

  /* Play the prompt automatically the first time a listening item appears. */
  useEffect(() => {
    if (isListen) speak(exercise.speak, rate);
  }, [exercise.id, isListen, rate]);

  return (
    <div className="space-y-5">
      {isListen ? (
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold">ស្តាប់ រួចជ្រើសរើសពាក្យដែលអ្នកឮ</p>
          <button
            type="button"
            onClick={() => speak(exercise.speak, rate)}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-sky-500 text-4xl text-white shadow-[0_5px_0_#0369a1] active:translate-y-1 active:shadow-[0_2px_0_#0369a1]"
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
          const reveal = checked !== null;
          const isRight = exercise.answers.includes(i);
          const cls = reveal
            ? isRight ? 'option option-correct'
              : isChosen ? 'option option-wrong' : 'option opacity-60'
            : isChosen ? 'option option-selected' : 'option';
          return (
            <button
              key={`${exercise.id}:${i}`}
              type="button"
              disabled={reveal}
              onClick={() => setSelected(i)}
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
  exercise, checked, onReady,
}: {
  exercise: Extract<Exercise, { kind: 'type' }>;
  checked: Judgement | null;
  onReady: (r: boolean, j: () => Judgement) => void;
}) {
  const [text, setText] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText('');
    ref.current?.focus();
  }, [exercise.id]);

  useEffect(() => {
    onReady(text.trim().length > 0, () => ({
      correct: judgeTyped(text, exercise),
      given: text.trim(),
    }));
  }, [text, exercise, onReady]);

  const insert = (ch: string) => {
    setText((t) => t + ch);
    ref.current?.focus();
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-stone-800">{exercise.prompt}</p>
      {exercise.promptSub && <p className="text-sm text-stone-500">{exercise.promptSub}</p>}
      <input
        ref={ref}
        value={text}
        disabled={checked !== null}
        onChange={(e) => setText(e.target.value)}
        placeholder="សរសេរចម្លើយនៅទីនេះ…"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`w-full rounded-2xl border-2 px-4 py-4 text-xl outline-none transition
          ${checked === null ? 'border-stone-200 focus:border-sky-400'
            : checked.correct ? 'border-leaf-400 bg-leaf-50' : 'border-red-400 bg-red-50'}`}
      />
      {exercise.isPali && checked === null && (
        <div className="flex flex-wrap gap-2">
          {DIACRITICS.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => insert(ch)}
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

/** Accepts diacritic-free romanisation and Khmer script, per accept list. */
function judgeTyped(text: string, exercise: Extract<Exercise, { kind: 'type' }>): boolean {
  const given = text.trim();
  if (!given) return false;
  if (!exercise.isPali) {
    const norm = (s: string) => s.replace(/\s+/g, ' ').replace(/[។.]/g, '').trim();
    return norm(given) === norm(exercise.answer);
  }
  return exercise.accept.some((a) => paliEquals(a, given)) || paliEquals(exercise.answer, given);
}

/* --------------------------------------------------------------- word bank */

function WordBankCard({
  exercise, checked, onReady,
}: {
  exercise: Extract<Exercise, { kind: 'wordbank' }>;
  checked: Judgement | null;
  onReady: (r: boolean, j: () => Judgement) => void;
}) {
  const [picked, setPicked] = useState<number[]>([]);

  useEffect(() => setPicked([]), [exercise.id]);

  useEffect(() => {
    const built = picked.map((i) => exercise.bank[i]);
    onReady(picked.length > 0, () => ({
      correct: built.join(' ') === exercise.answer.join(' '),
      given: built.join(' '),
    }));
  }, [picked, exercise, onReady]);

  const available = exercise.bank.map((w, i) => ({ w, i })).filter(({ i }) => !picked.includes(i));

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
          ${checked === null ? 'border-stone-300'
            : checked.correct ? 'border-leaf-400 bg-leaf-50' : 'border-red-400 bg-red-50'}`}
      >
        <div className="flex flex-wrap gap-2">
          {picked.map((bankIndex, position) => (
            <button
              key={`${bankIndex}-${position}`}
              type="button"
              disabled={checked !== null}
              onClick={() => setPicked((p) => p.filter((_, k) => k !== position))}
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
            disabled={checked !== null}
            onClick={() => setPicked((p) => [...p, i])}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-[0_2px_0_#e7e5e4] active:translate-y-[2px] active:shadow-none"
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Shown in the feedback sheet after a wrong answer. */
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

export { ScriptText };
