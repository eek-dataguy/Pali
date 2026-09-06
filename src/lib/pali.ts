/**
 * Pali phonology and Khmer-script orthography.
 *
 * Cambodian Tipitaka editions print Pali in Khmer script, so every word in this
 * app can be shown in two systems at once: Khmer script (what students meet in
 * a real ព្រះត្រៃបិដក) and IAST romanisation (what dictionaries and grammars use).
 * Everything is stored once in IAST and converted here, so content authors never
 * have to type Khmer conjuncts by hand.
 */

export const NIGGAHITA = 'ំ'; // ំ
export const COENG = '្'; // ្  (subscript joiner)

/** Longest-match first: two-letter aspirates must be tried before their stops. */
const CONSONANTS: ReadonlyArray<readonly [string, string]> = [
  ['kh', 'ខ'], ['gh', 'ឃ'], ['ch', 'ឆ'], ['jh', 'ឈ'],
  ['ṭh', 'ឋ'], ['ḍh', 'ឍ'], ['th', 'ថ'], ['dh', 'ធ'],
  ['ph', 'ផ'], ['bh', 'ភ'],
  ['k', 'ក'], ['g', 'គ'], ['ṅ', 'ង'],
  ['c', 'ច'], ['j', 'ជ'], ['ñ', 'ញ'],
  ['ṭ', 'ដ'], ['ḍ', 'ឌ'], ['ṇ', 'ណ'],
  ['t', 'ត'], ['d', 'ទ'], ['n', 'ន'],
  ['p', 'ប'], ['b', 'ព'], ['m', 'ម'],
  ['y', 'យ'], ['r', 'រ'], ['l', 'ល'], ['v', 'វ'],
  ['s', 'ស'], ['h', 'ហ'], ['ḷ', 'ឡ'],
];

/** Dependent vowel signs, written after the consonant (or cluster). */
const VOWEL_SIGNS: Readonly<Record<string, string>> = {
  a: '', 'ā': 'ា', i: 'ិ', 'ī': 'ី',
  u: 'ុ', 'ū': 'ូ', e: 'េ', o: 'ោ',
};

/** Independent vowels, used when a syllable has no consonant onset. */
const VOWEL_LETTERS: Readonly<Record<string, string>> = {
  a: 'អ', 'ā': 'អា', i: 'ឥ', 'ī': 'ឦ',
  u: 'ឧ', 'ū': 'ឩ', e: 'ឯ', o: 'ឱ',
};

const VOWELS = ['ā', 'ī', 'ū', 'a', 'i', 'u', 'e', 'o'] as const;
export type Vowel = (typeof VOWELS)[number];

const LONG_VOWELS = new Set(['ā', 'ī', 'ū', 'e', 'o']);

/** Alternative spellings people type or paste, folded to the canonical letter. */
const IAST_ALIASES: Readonly<Record<string, string>> = {
  'ṁ': 'ṃ', 'ŋ': 'ṅ', 'ṉ': 'ṅ', 'ḹ': 'ḷ', 'ṛ': 'r', 'ĩ': 'ī',
};

/** Fold aliases and normalise to NFC so single-codepoint letters compare equal. */
export function normalizeIast(input: string): string {
  let s = input.normalize('NFC');
  for (const [from, to] of Object.entries(IAST_ALIASES)) s = s.split(from).join(to);
  return s;
}

type Unit =
  | { kind: 'cluster'; consonants: string[]; vowel: Vowel | null; niggahita: boolean }
  | { kind: 'vowel'; vowel: Vowel; niggahita: boolean }
  | { kind: 'other'; text: string };

function matchConsonant(s: string, i: number): readonly [string, string] | null {
  for (const entry of CONSONANTS) {
    if (s.startsWith(entry[0], i)) return entry;
  }
  return null;
}

function matchVowel(s: string, i: number): Vowel | null {
  for (const v of VOWELS) if (s.startsWith(v, i)) return v;
  return null;
}

/**
 * Split one Pali word into orthographic units. A consonant cluster is written in
 * Khmer as one stack (ធម្ម, ពុទ្ធ, កម្មដ្ឋាន), so the whole run of consonants that
 * precedes a vowel is collected together and the vowel sign hangs off the stack.
 */
function parseWord(word: string): Unit[] {
  const s = normalizeIast(word).toLowerCase();
  const units: Unit[] = [];
  let i = 0;
  while (i < s.length) {
    const consonants: string[] = [];
    let hit = matchConsonant(s, i);
    while (hit) {
      consonants.push(hit[1]);
      i += hit[0].length;
      hit = matchConsonant(s, i);
    }
    const vowel = matchVowel(s, i);
    if (vowel) i += vowel.length;
    let niggahita = false;
    if (s.startsWith('ṃ', i)) {
      niggahita = true;
      i += 1;
    }
    if (consonants.length) {
      units.push({ kind: 'cluster', consonants, vowel, niggahita });
    } else if (vowel) {
      units.push({ kind: 'vowel', vowel, niggahita });
    } else if (niggahita) {
      units.push({ kind: 'cluster', consonants: [], vowel: null, niggahita: true });
    } else {
      units.push({ kind: 'other', text: s[i] });
      i += 1;
    }
  }
  return units;
}

function renderWord(word: string): string {
  let out = '';
  for (const unit of parseWord(word)) {
    if (unit.kind === 'other') {
      out += unit.text;
      continue;
    }
    if (unit.kind === 'vowel') {
      out += VOWEL_LETTERS[unit.vowel];
    } else {
      out += unit.consonants.join(COENG);
      if (unit.vowel) out += VOWEL_SIGNS[unit.vowel];
    }
    if (unit.niggahita) out += NIGGAHITA;
  }
  return out;
}

/** Khmer texts close a sentence with ។ and a section with ៕, not with a dot. */
const PUNCTUATION: Readonly<Record<string, string>> = { '.': '។', ';': '។', '|': '។', '||': '៕' };

/**
 * Convert IAST Pali to Khmer script. Spaces pass through, punctuation is
 * converted to its Khmer equivalent, and hyphens mark a compound seam and are
 * dropped the way Khmer prints compounds.
 */
export function toKhmer(text: string): string {
  return normalizeIast(text)
    .split(/(\s+)/)
    .map((chunk) => {
      if (/^\s*$/.test(chunk)) return chunk;
      const lead = chunk.match(/^[^\p{L}]*/u)?.[0] ?? '';
      const tail = chunk.match(/[^\p{L}ṃ]*$/u)?.[0] ?? '';
      const core = chunk.slice(lead.length, chunk.length - tail.length);
      const punct = (run: string) => [...run].map((ch) => PUNCTUATION[ch] ?? ch).join('');
      return punct(lead) + core.split('-').map(renderWord).join('') + punct(tail);
    })
    .join('');
}

export type Syllable = {
  /** IAST text of the syllable, e.g. "dham". */
  text: string;
  /** Long vowel or a closing consonant makes a syllable heavy (គរុ) in metre. */
  heavy: boolean;
  vowel: Vowel;
};

/**
 * Split a word into spoken syllables and mark each heavy or light.
 *
 * A syllable is heavy (គរុ) if it has a long vowel, a niggahita, or a closing
 * consonant. Pali metre — and therefore correct chanting — rests entirely on
 * this distinction, so the closing consonants are kept in the syllable's text:
 * dhammā is dham-mā, not dha-mā.
 */
export function syllabify(word: string): Syllable[] {
  const s = normalizeIast(word).toLowerCase().replace(/-/g, '');
  const back = new Map(CONSONANTS.map(([iast, khmer]) => [khmer, iast]));
  const out: Syllable[] = [];

  for (const unit of parseWord(s)) {
    if (unit.kind === 'other') continue;

    if (unit.kind === 'cluster') {
      const letters = unit.consonants.map((c) => back.get(c) ?? '');
      // Every consonant but the last closes the syllable before it.
      if (letters.length > 1 && out.length) {
        const previous = out[out.length - 1];
        previous.text += letters.slice(0, -1).join('');
        previous.heavy = true;
      }
      if (!unit.vowel) {
        if (unit.niggahita && out.length) {
          out[out.length - 1].text += 'ṃ';
          out[out.length - 1].heavy = true;
        }
        continue;
      }
      const onset = letters[letters.length - 1] ?? '';
      out.push({
        text: onset + unit.vowel + (unit.niggahita ? 'ṃ' : ''),
        vowel: unit.vowel,
        heavy: LONG_VOWELS.has(unit.vowel) || unit.niggahita,
      });
      continue;
    }

    out.push({
      text: unit.vowel + (unit.niggahita ? 'ṃ' : ''),
      vowel: unit.vowel,
      heavy: LONG_VOWELS.has(unit.vowel) || unit.niggahita,
    });
  }
  return out;
}

/** Strip every diacritic so a learner typing plain ASCII still gets credit. */
export function looseKey(text: string): string {
  let s = normalizeIast(text).toLowerCase();
  const fold: Record<string, string> = {
    'ā': 'a', 'ī': 'i', 'ū': 'u', 'ṭ': 't', 'ḍ': 'd', 'ṇ': 'n',
    'ṅ': 'n', 'ñ': 'n', 'ḷ': 'l', 'ṃ': 'm', 'ṁ': 'm', 'ṣ': 's', 'ś': 's',
  };
  s = [...s].map((ch) => fold[ch] ?? ch).join('');
  s = s.replace(/aa/g, 'a').replace(/ii/g, 'i').replace(/uu/g, 'u');
  return s.replace(/[^a-z]/g, '');
}

/** Do two Pali strings match, allowing diacritic-free and Khmer-script typing? */
export function paliEquals(expected: string, given: string): boolean {
  const g = given.trim();
  if (!g) return false;
  if (normalizeIast(expected).toLowerCase() === normalizeIast(g).toLowerCase()) return true;
  if (looseKey(expected) === looseKey(g)) return true;
  return toKhmer(expected).replace(/\s+/g, '') === g.normalize('NFC').replace(/\s+/g, '');
}

const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

/** Render a number with Khmer numerals (១២៣) for the Khmer interface. */
export function khmerNumber(n: number): string {
  return String(Math.trunc(Math.abs(n)))
    .split('')
    .map((d) => KHMER_DIGITS[Number(d)] ?? d)
    .join('');
}
