import { useState } from 'react';
import { PASSAGES, passageById } from '../content/passages';
import type { Gloss, PassageLine } from '../content/types';
import { chantingBreakdown } from '../lib/exercises';
import { khmerNumber, toKhmer } from '../lib/pali';
import { speak } from '../lib/audio';
import { navigate } from '../lib/router';
import { useStore } from '../lib/store';
import { Pill, ScriptHeading } from '../components/ui';

/**
 * The reader.
 *
 * This is where the whole course is pointing: real text, with the translation
 * hidden until asked for, and every word tappable for its parse. Reading with
 * the gloss one tap away — rather than printed alongside — is what turns
 * recognition into recall.
 */

export default function Reader({ passageId }: { passageId?: string }) {
  const passage = passageId ? passageById(passageId) : undefined;
  if (passage) return <PassageView passage={passage} />;

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-8 pt-4">
      <h1 className="mb-1 text-2xl font-bold">បណ្ណាល័យ</h1>
      <p className="mb-5 text-sm text-stone-600">
        អត្ថបទពិតប្រាកដ ជាមួយការបកប្រែពាក្យម្តងៗ។ ចុចលើពាក្យណាមួយ ដើម្បីមើលអត្ថន័យ និងវិភត្តិ។
      </p>
      <div className="space-y-2">
        {PASSAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => navigate(`/read/${p.id}`)}
            className="card w-full px-4 py-4 text-left active:scale-[.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="block font-semibold">{p.kmTitle}</span>
                <span className="block text-xs text-stone-500">{p.kmSource}</span>
              </span>
              <span className="shrink-0 text-xs text-stone-400">{khmerNumber(p.lines.length)} បាទ</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PassageView({ passage }: { passage: NonNullable<ReturnType<typeof passageById>> }) {
  const [showAll, setShowAll] = useState(false);
  const rate = useStore((s) => s.profile.speechRate);
  const audio = useStore((s) => s.profile.audio);

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-8 pt-4">
      <button type="button" onClick={() => navigate('/read')} className="mb-3 text-sm text-stone-500">
        ← បណ្ណាល័យ
      </button>

      <h1 className="text-2xl font-bold leading-snug">{passage.kmTitle}</h1>
      <p className="mt-1 text-sm text-stone-500">{passage.kmSource}</p>
      <p className="mt-3 rounded-xl bg-saffron-50 px-4 py-3 text-[15px] leading-relaxed text-stone-700">
        {passage.intro}
      </p>

      <div className="my-4 flex gap-2">
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="btn-ghost flex-1 py-2 text-sm"
        >
          {showAll ? 'លាក់ការបកប្រែ' : 'បង្ហាញការបកប្រែទាំងអស់'}
        </button>
        {audio && (
          <button
            type="button"
            onClick={() => speak(passage.lines.map((l) => l.pali).join(' '), rate)}
            className="btn-ghost px-4 py-2 text-sm"
          >
            🔊 សូត្រ
          </button>
        )}
      </div>

      <div className="space-y-4">
        {passage.lines.map((line, i) => (
          <LineView key={i} line={line} forceOpen={showAll} />
        ))}
      </div>
    </div>
  );
}

function LineView({ line, forceOpen }: { line: PassageLine; forceOpen: boolean }) {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState<Gloss | null>(null);
  const [metre, setMetre] = useState(false);
  const rate = useStore((s) => s.profile.speechRate);
  const audio = useStore((s) => s.profile.audio);
  const visible = open || forceOpen;

  return (
    <div className="card px-4 py-4">
      <ScriptHeading pali={line.pali} className="mb-3" />

      {/* Tappable gloss: each word reveals its meaning and parse. */}
      <div className="mb-3 flex flex-wrap justify-center gap-1.5">
        {line.words.map((w, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setWord(word?.pali === w.pali ? null : w)}
            className={`rounded-lg border px-2 py-1 text-sm transition
              ${word?.pali === w.pali ? 'border-sky-400 bg-sky-50' : 'border-stone-200 bg-stone-50'}`}
          >
            <span className="pali-iast">{w.pali}</span>
          </button>
        ))}
      </div>

      {word && (
        <div className="mb-3 rounded-xl bg-sky-50 px-3 py-2.5 text-sm">
          <div className="flex items-baseline gap-2">
            <span className="pali-khmer text-lg">{toKhmer(word.pali)}</span>
            <span className="pali-iast text-stone-500">{word.pali}</span>
          </div>
          <div className="mt-1 text-stone-800">{word.km}</div>
          {word.gram && <div className="mt-1"><Pill tone="sky">{word.gram}</Pill></div>}
        </div>
      )}

      {metre && (
        <div className="mb-3 flex flex-wrap justify-center gap-1.5">
          {line.pali.split(/\s+/).flatMap((w, wi) =>
            chantingBreakdown(w.replace(/[,;។.]/g, '')).map((syl, si) => (
              <span
                key={`${wi}-${si}`}
                className={`rounded px-2 py-0.5 text-sm ${
                  syl.heavy ? 'bg-saffron-200 text-saffron-900' : 'bg-stone-100 text-stone-600'
                }`}
                title={syl.heavy ? 'គរុ' : 'លហុ'}
              >
                {syl.text}
              </span>
            )),
          )}
          <p className="mt-2 w-full text-center text-xs text-stone-500">
            ពណ៌លឿង = គរុ (ធ្ងន់) · ពណ៌ប្រផេះ = លហុ (ស្រាល)
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs">
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-lg bg-stone-100 px-3 py-1.5 font-semibold">
          {visible ? 'លាក់' : 'ការបកប្រែ'}
        </button>
        <button type="button" onClick={() => setMetre((v) => !v)} className="rounded-lg bg-stone-100 px-3 py-1.5 font-semibold">
          ចង្វាក់ឆន្ទ
        </button>
        {audio && (
          <button type="button" onClick={() => speak(line.pali, rate)} className="rounded-lg bg-stone-100 px-3 py-1.5 font-semibold">
            🔊 ស្តាប់
          </button>
        )}
      </div>

      {visible && (
        <div className="mt-3 space-y-2">
          <p className="text-[15px] leading-relaxed text-stone-800">{line.km}</p>
          {line.note && (
            <p className="rounded-xl bg-stone-100 px-3 py-2 text-sm text-stone-600">💡 {line.note}</p>
          )}
        </div>
      )}
    </div>
  );
}
