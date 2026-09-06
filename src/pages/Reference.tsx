import { useMemo, useState } from 'react';
import { CONSONANT_GROUPS, CONTRAST_PAIRS, NIGGAHITA_LETTER, VOWELS } from '../content/alphabet';
import { GRAMMAR } from '../content/grammar';
import { VOCAB } from '../content/vocab';
import { paradigmTable } from '../lib/exercises';
import { looseKey, toKhmer } from '../lib/pali';
import { speak } from '../lib/audio';
import { navigate } from '../lib/router';
import { useStore } from '../lib/store';
import { DataTable, ScriptText, useDebounced } from '../components/ui';

/**
 * Reference material the learner can consult outside a lesson: the alphabet
 * chart, the grammar handbook, and a searchable dictionary. Everything here is
 * the same data the exercises are generated from, so it can never disagree
 * with what was taught.
 */

const TABS = [
  { id: 'alphabet', label: 'អក្សរ' },
  { id: 'grammar', label: 'វេយ្យាករណ៍' },
  { id: 'dict', label: 'វចនានុក្រម' },
] as const;

export default function Reference({ tab }: { tab?: string }) {
  const active = TABS.find((t) => t.id === tab)?.id ?? 'alphabet';
  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-8 pt-4">
      <h1 className="mb-3 text-2xl font-bold">ឯកសារយោង</h1>
      <div className="mb-5 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => navigate(`/reference/${t.id}`)}
            className={`flex-1 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition
              ${active === t.id ? 'border-saffron-400 bg-saffron-50 text-saffron-800' : 'border-stone-200 bg-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {active === 'alphabet' && <AlphabetTab />}
      {active === 'grammar' && <GrammarTab />}
      {active === 'dict' && <DictionaryTab />}
    </div>
  );
}

function AlphabetTab() {
  const rate = useStore((s) => s.profile.speechRate);
  const audio = useStore((s) => s.profile.audio);

  const Cell = ({ khmer, iast, name }: { khmer: string; iast: string; name: string }) => (
    <button
      type="button"
      onClick={() => audio && speak(iast + 'a', rate)}
      className="card flex flex-col items-center px-2 py-3 active:scale-95"
    >
      <span className="pali-khmer text-2xl leading-none">{khmer}</span>
      <span className="pali-iast mt-1.5 text-sm text-stone-500">{iast}</span>
      <span className="mt-0.5 text-[10px] text-stone-400">{name}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 font-bold">ស្រៈ ៨ (សរៈ)</h2>
        <div className="grid grid-cols-4 gap-2">
          {VOWELS.map((v) => <Cell key={v.iast} khmer={v.khmer} iast={v.iast} name={v.name} />)}
        </div>
      </section>

      {CONSONANT_GROUPS.map((group) => (
        <section key={group.id}>
          <h2 className="mb-2 font-bold">
            {group.kmTitle} <span className="text-sm font-normal text-stone-500">· {group.placeKm}</span>
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {group.letters.map((l) => <Cell key={l.iast} khmer={l.khmer} iast={l.iast} name={l.name} />)}
          </div>
        </section>
      ))}

      <section>
        <h2 className="mb-2 font-bold">និគ្គហិត</h2>
        <div className="card px-4 py-3">
          <span className="pali-khmer text-2xl">{NIGGAHITA_LETTER.khmer}</span>
          <p className="mt-1 text-sm text-stone-600">{NIGGAHITA_LETTER.hint}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-bold">សំឡេងដែលច្រឡំគ្នាញឹកញាប់</h2>
        <div className="space-y-2">
          {CONTRAST_PAIRS.map((pair) => (
            <div key={pair.a + pair.b} className="card px-4 py-3 text-sm text-stone-700">
              {pair.km}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function GrammarTab() {
  const [open, setOpen] = useState<string | null>(null);
  const script = useStore((s) => s.profile.script);
  return (
    <div className="space-y-2">
      {GRAMMAR.map((point) => {
        const expanded = open === point.id;
        const table = point.paradigm ? paradigmTable(point.paradigm, script) : point.tables?.[0];
        return (
          <div key={point.id} className="card overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : point.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{point.kmTitle}</span>
                <span className="block truncate text-xs text-stone-500">{point.title}</span>
              </span>
              <span className="text-stone-400">{expanded ? '−' : '+'}</span>
            </button>
            {expanded && (
              <div className="space-y-3 border-t border-stone-100 px-4 py-4">
                {point.body.map((paragraph, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-stone-700">{paragraph}</p>
                ))}
                {table && <DataTable caption={table.caption} headers={table.headers} rows={table.rows} />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DictionaryTab() {
  const [query, setQuery] = useState('');
  const search = useDebounced(query, 150);

  const results = useMemo(() => {
    const q = search.trim();
    if (!q) return VOCAB.slice(0, 40);
    const loose = looseKey(q);
    return VOCAB.filter((v) =>
      v.km.includes(q)
      || v.en.toLowerCase().includes(q.toLowerCase())
      || (loose.length > 0 && looseKey(v.pali).includes(loose))
      || toKhmer(v.pali).includes(q),
    ).slice(0, 60);
  }, [search]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ស្វែងរក — បាលី ខ្មែរ ឬអង់គ្លេស…"
        className="mb-4 w-full rounded-xl border-2 border-stone-200 px-4 py-3 outline-none focus:border-sky-400"
      />
      <p className="mb-2 text-xs text-stone-500">
        រកឃើញ {results.length} ពាក្យ ក្នុងចំណោម {VOCAB.length}
      </p>
      <div className="space-y-2">
        {results.map((v) => (
          <div key={v.id} className="card px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <ScriptText pali={v.pali} className="text-lg font-semibold" />
              <span className="shrink-0 text-xs text-stone-400">{v.pos}</span>
            </div>
            <p className="mt-1 text-stone-700">{v.km}</p>
            <p className="text-sm text-stone-500">{v.en}</p>
            {v.note && <p className="mt-1.5 text-sm text-stone-600">{v.note}</p>}
          </div>
        ))}
        {!results.length && <p className="py-8 text-center text-stone-500">រកមិនឃើញទេ។</p>}
      </div>
    </div>
  );
}
