import { useMemo, useState } from 'react';
import { exercisesForCard, isGraded } from '../lib/exercises';
import type { Exercise } from '../lib/exercises';
import { seededRandom } from '../lib/util';
import { khmerNumber } from '../lib/pali';
import { useStore } from '../lib/store';
import { navigate } from '../lib/router';
import { ExerciseView } from '../components/ExerciseView';
import { NO_ANSWER, hasAnswer, judge, type Answer } from '../lib/judge';
import { Bar } from '../components/ui';

/**
 * Onboarding and placement.
 *
 * The placement check exists so an experienced reader — a monk who already
 * chants and knows វិភត្តិ — is not made to grind the alphabet for a week
 * before reaching anything they care about. Questions run from a single letter
 * to a line of commentary; the learner starts just past the last one they got
 * right.
 */

/** Each probe unlocks everything before the lesson named, if answered correctly. */
const PROBES: { card: string; unlockThrough: string; label: string }[] = [
  { card: 'letter:kh', unlockThrough: 'l1_4', label: 'អក្សរ' },
  { card: 'vocab:sarana', unlockThrough: 'l3_4', label: 'ពាក្យក្នុងបទសូត្រ' },
  { card: 'form:buddha:acc:sg', unlockThrough: 'l4_5', label: 'ទុតិយាវិភត្តិ' },
  { card: 'form:buddha:ins:pl', unlockThrough: 'l6_7', label: 'វិភត្តិទាំង ៨' },
  { card: 'verb:gacchati:opt:3:sg', unlockThrough: 'l9_5', label: 'កាលកិរិយា' },
  { card: 'sent:s050', unlockThrough: 'l10_5', label: 'បុព្វកិរិយា' },
  { card: 'sent:s080', unlockThrough: 'l17_1', label: 'ភាសាអដ្ឋកថា' },
];

export default function Welcome() {
  const [step, setStep] = useState<'intro' | 'setup' | 'test' | 'done'>('intro');
  const setProfile = useStore((s) => s.setProfile);
  const markPlacement = useStore((s) => s.markPlacement);
  const profile = useStore((s) => s.profile);
  const [unlockThrough, setUnlockThrough] = useState<string | null>(null);

  if (step === 'intro') {
    return (
      <Screen>
        <div className="text-7xl">🪷</div>
        <h1 className="text-3xl font-bold leading-snug">រៀនភាសាបាលី<br />ជាភាសាខ្មែរ</h1>
        <p className="max-w-md text-stone-600">
          ចាប់ពីអក្សរដំបូង រហូតដល់អានព្រះត្រៃបិដក អដ្ឋកថា និងអភិធម្ម ដោយខ្លួនឯង។
          មេរៀនខ្លីៗរាល់ថ្ងៃ ជាមួយប្រព័ន្ធរំឭកឡើងវិញ ដែលនាំពាក្យត្រឡប់មកវិញ
          ត្រង់ពេលដែលអ្នកជិតភ្លេច។
        </p>
        <div className="grid w-full max-w-md gap-2 text-left text-sm text-stone-600">
          <Feature icon="📿" text="ចាប់ផ្តើមពីបទដែលអ្នកសូត្ររាល់ថ្ងៃ — នមោ តស្ស, សរណគមន៍, សីល ៥។" />
          <Feature icon="🔁" text="ប្រព័ន្ធរំឭក (SRS) រៀបពេលរំឭកឲ្យស្វ័យប្រវត្តិ។" />
          <Feature icon="📖" text="អក្សរខ្មែរ និងអក្សរឡាតាំង ជាមួយគ្នា។" />
          <Feature icon="🎯" text="លំហាត់កើតឡើងដោយស្វ័យប្រវត្តិ — មិនចេះអស់។" />
        </div>
        <button type="button" onClick={() => setStep('setup')} className="btn-primary w-full max-w-md text-lg">
          ចាប់ផ្តើម
        </button>
      </Screen>
    );
  }

  if (step === 'setup') {
    return (
      <Screen>
        <h2 className="text-2xl font-bold">តាំងលក្ខណៈតាមចិត្តអ្នក</h2>

        <Field label="ឈ្មោះ (មិនចាំបាច់)">
          <input
            value={profile.name}
            onChange={(e) => setProfile({ name: e.target.value })}
            placeholder="ឈ្មោះរបស់អ្នក"
            className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 outline-none focus:border-sky-400"
          />
        </Field>

        <Field label="គោលដៅប្រចាំថ្ងៃ">
          <div className="grid grid-cols-3 gap-2">
            {[{ v: 30, k: 'ស្រាល', s: '~៥ នាទី' }, { v: 60, k: 'ធម្មតា', s: '~១០ នាទី' }, { v: 120, k: 'ខ្លាំង', s: '~២០ នាទី' }].map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => setProfile({ dailyGoal: o.v })}
                className={`rounded-xl border-2 px-2 py-3 text-sm font-semibold transition
                  ${profile.dailyGoal === o.v ? 'border-saffron-400 bg-saffron-50 text-saffron-800' : 'border-stone-200'}`}
              >
                {o.k}
                <div className="mt-0.5 text-xs font-normal text-stone-500">{o.s}</div>
              </button>
            ))}
          </div>
        </Field>

        <Field label="របៀបបង្ហាញភាសាបាលី">
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: 'khmer' as const, k: 'អក្សរខ្មែរ', s: 'ធម្មតា' },
              { v: 'both' as const, k: 'ទាំងពីរ', s: 'ណែនាំ' },
              { v: 'iast' as const, k: 'ឡាតាំង', s: 'IAST' },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => setProfile({ script: o.v })}
                className={`rounded-xl border-2 px-2 py-3 text-sm font-semibold transition
                  ${profile.script === o.v ? 'border-saffron-400 bg-saffron-50 text-saffron-800' : 'border-stone-200'}`}
              >
                {o.k}
                <div className="mt-0.5 text-xs font-normal text-stone-500">{o.s}</div>
              </button>
            ))}
          </div>
        </Field>

        <div className="w-full max-w-md space-y-2">
          <button type="button" onClick={() => setStep('test')} className="btn-primary w-full text-lg">
            ធ្វើតេស្តកម្រិត (៧ សំណួរ)
          </button>
          <button
            type="button"
            onClick={() => { markPlacement(null); navigate('/'); }}
            className="btn-ghost w-full"
          >
            ខ្ញុំជាអ្នកចាប់ផ្តើមថ្មី — ចាប់ពីដើម
          </button>
        </div>
      </Screen>
    );
  }

  if (step === 'test') {
    return (
      <Placement
        onDone={(unlock) => {
          setUnlockThrough(unlock);
          setStep('done');
        }}
      />
    );
  }

  return (
    <Screen>
      <div className="text-6xl">🎯</div>
      <h2 className="text-2xl font-bold">រួចរាល់!</h2>
      <p className="max-w-md text-stone-600">
        {unlockThrough
          ? 'យើងបានរំលងមេរៀនដែលអ្នកចេះរួចហើយ។ អ្នកអាចត្រលប់ទៅរៀនវិញគ្រប់ពេល។'
          : 'យើងនឹងចាប់ផ្តើមពីអក្សរដំបូង។ សូមទុកចិត្តលើដំណើរការ — មេរៀនខ្លីៗរាល់ថ្ងៃឈ្នះការរៀនយូរម្តង។'}
      </p>
      <button
        type="button"
        onClick={() => { markPlacement(unlockThrough); navigate('/'); }}
        className="btn-primary w-full max-w-md text-lg"
      >
        ចូលរៀន
      </button>
    </Screen>
  );
}

function Placement({ onDone }: { onDone: (unlockThrough: string | null) => void }) {
  const rand = useMemo(() => seededRandom(7), []);
  const questions = useMemo<Exercise[]>(
    () => PROBES.map((p) => exercisesForCard(p.card, rand, false).filter(isGraded)[0]).filter(Boolean),
    [rand],
  );
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer>(NO_ANSWER);
  const [checked, setChecked] = useState<{ correct: boolean } | null>(null);
  const [lastCorrect, setLastCorrect] = useState<number>(-1);

  const current = questions[index];
  if (!current) {
    onDone(lastCorrect >= 0 ? PROBES[lastCorrect].unlockThrough : null);
    return null;
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 py-6">
      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-stone-500">
          តេស្តកម្រិត · សំណួរទី {khmerNumber(index + 1)} / {khmerNumber(questions.length)} · {PROBES[index]?.label}
        </p>
        <Bar value={index / questions.length} />
      </div>

      <div className="flex-1">
        <ExerciseView
          exercise={current}
          answer={answer}
          onAnswer={setAnswer}
          revealed={checked !== null}
          correct={checked?.correct ?? false}
        />
      </div>

      <div className="pt-6">
        {checked === null ? (
          <button
            type="button"
            disabled={!hasAnswer(answer)}
            onClick={() => {
              const correct = judge(current, answer);
              setChecked({ correct });
              if (correct) setLastCorrect(index);
            }}
            className="btn-primary w-full text-lg"
          >
            ពិនិត្យ
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { setChecked(null); setAnswer(NO_ANSWER); setIndex((i) => i + 1); }}
            className="btn-primary w-full text-lg"
          >
            បន្ត
          </button>
        )}
        <button
          type="button"
          onClick={() => onDone(lastCorrect >= 0 ? PROBES[lastCorrect].unlockThrough : null)}
          className="mt-2 w-full py-2 text-sm text-stone-500"
        >
          រំលងតេស្ត
        </button>
      </div>
    </div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-5 px-6 py-10 text-center">
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md text-left">
      <p className="mb-2 text-sm font-semibold text-stone-600">{label}</p>
      {children}
    </div>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm">
      <span className="text-lg leading-none">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
