/**
 * Pali morphology generator.
 *
 * Instead of hand-writing thousands of drill items, the app stores a word once
 * and derives every inflected form from a paradigm. That gives the practice
 * engine an unlimited supply of exercises ("put ពុទ្ធ into ទុតិយាវិភត្តិ ពហុវចនៈ")
 * and lets the reader gloss forms a student meets in a real sutta.
 */

export type Case = 'nom' | 'acc' | 'ins' | 'dat' | 'abl' | 'gen' | 'loc' | 'voc';
export type Numb = 'sg' | 'pl';
export type Gender = 'm' | 'f' | 'nt';

export const CASES: readonly Case[] = ['nom', 'acc', 'ins', 'dat', 'abl', 'gen', 'loc', 'voc'];
export const NUMBERS: readonly Numb[] = ['sg', 'pl'];

/** Traditional Khmer/Pali grammatical names — the vocabulary temple students use. */
export const CASE_INFO: Record<Case, { pali: string; km: string; sense: string; senseKm: string }> = {
  nom: { pali: 'paṭhamā', km: 'បឋមាវិភត្តិ', sense: 'subject', senseKm: 'ជាកត្តា (អ្នកធ្វើ)' },
  acc: { pali: 'dutiyā', km: 'ទុតិយាវិភត្តិ', sense: 'object', senseKm: 'ជាកម្ម (អ្វីដែលត្រូវធ្វើ)' },
  ins: { pali: 'tatiyā', km: 'តតិយាវិភត្តិ', sense: 'by / with', senseKm: 'ដោយ, ជាមួយ' },
  dat: { pali: 'catutthī', km: 'ចតុត្ថីវិភត្តិ', sense: 'to / for', senseKm: 'ដល់, សម្រាប់' },
  abl: { pali: 'pañcamī', km: 'បញ្ចមីវិភត្តិ', sense: 'from', senseKm: 'អំពី, ពី' },
  gen: { pali: 'chaṭṭhī', km: 'ឆដ្ឋីវិភត្តិ', sense: 'of', senseKm: 'របស់, នៃ' },
  loc: { pali: 'sattamī', km: 'សត្តមីវិភត្តិ', sense: 'in / on / at', senseKm: 'ក្នុង, លើ, ត្រង់' },
  voc: { pali: 'ālapana', km: 'អាលបនវិភត្តិ', sense: 'calling', senseKm: 'ការហៅ' },
};

export const NUMBER_INFO: Record<Numb, { km: string; pali: string }> = {
  sg: { km: 'ឯកវចនៈ', pali: 'ekavacana' },
  pl: { km: 'ពហុវចនៈ', pali: 'bahuvacana' },
};

export const GENDER_INFO: Record<Gender, { km: string; pali: string }> = {
  m: { km: 'បុល្លិង្គ', pali: 'pulliṅga' },
  f: { km: 'ឥត្ថីលិង្គ', pali: 'itthiliṅga' },
  nt: { km: 'នបុំសកលិង្គ', pali: 'napuṃsakaliṅga' },
};

/** Which paradigm a noun follows. Named after its stem-final sound. */
export type Decl = 'a' | 'ā' | 'i' | 'ī' | 'u' | 'ū' | 'ar' | 'vant' | 'ant' | 'as' | 'irregular';

type Endings = Record<Case, { sg: string[]; pl: string[] }>;

const e = (
  rows: [Case, string[], string[]][],
): Endings => Object.fromEntries(rows.map(([c, sg, pl]) => [c, { sg, pl }])) as Endings;

/** buddha — a-ending masculine, by far the commonest noun class. */
const A_MASC = e([
  ['nom', ['o'], ['ā']],
  ['acc', ['aṃ'], ['e']],
  ['ins', ['ena'], ['ehi', 'ebhi']],
  ['dat', ['āya', 'assa'], ['ānaṃ']],
  ['abl', ['ā', 'asmā', 'amhā'], ['ehi', 'ebhi']],
  ['gen', ['assa'], ['ānaṃ']],
  ['loc', ['e', 'asmiṃ', 'amhi'], ['esu']],
  ['voc', ['a', 'ā'], ['ā']],
]);

/** rūpa — a-ending neuter: only nominative/accusative differ from the masculine. */
const A_NEUT: Endings = { ...A_MASC,
  nom: { sg: ['aṃ'], pl: ['āni', 'ā'] },
  acc: { sg: ['aṃ'], pl: ['āni', 'e'] },
  voc: { sg: ['a'], pl: ['āni'] },
};

/** kaññā — ā-ending feminine. */
const AA_FEM = e([
  ['nom', ['ā'], ['ā', 'āyo']],
  ['acc', ['aṃ'], ['ā', 'āyo']],
  ['ins', ['āya'], ['āhi', 'ābhi']],
  ['dat', ['āya'], ['ānaṃ']],
  ['abl', ['āya'], ['āhi', 'ābhi']],
  ['gen', ['āya'], ['ānaṃ']],
  ['loc', ['āya', 'āyaṃ'], ['āsu']],
  ['voc', ['e'], ['ā', 'āyo']],
]);

/** muni — i-ending masculine. */
const I_MASC = e([
  ['nom', ['i'], ['ī', 'ayo']],
  ['acc', ['iṃ'], ['ī', 'ayo']],
  ['ins', ['inā'], ['īhi', 'ībhi']],
  ['dat', ['ino', 'issa'], ['īnaṃ']],
  ['abl', ['inā', 'ismā', 'imhā'], ['īhi', 'ībhi']],
  ['gen', ['ino', 'issa'], ['īnaṃ']],
  ['loc', ['ismiṃ', 'imhi'], ['īsu']],
  ['voc', ['i'], ['ī', 'ayo']],
]);

const I_NEUT: Endings = { ...I_MASC,
  nom: { sg: ['i'], pl: ['īni', 'ī'] },
  acc: { sg: ['iṃ'], pl: ['īni', 'ī'] },
  voc: { sg: ['i'], pl: ['īni'] },
};

/** jāti — i-ending feminine. */
const I_FEM = e([
  ['nom', ['i'], ['ī', 'iyo']],
  ['acc', ['iṃ'], ['ī', 'iyo']],
  ['ins', ['iyā'], ['īhi', 'ībhi']],
  ['dat', ['iyā'], ['īnaṃ']],
  ['abl', ['iyā'], ['īhi', 'ībhi']],
  ['gen', ['iyā'], ['īnaṃ']],
  ['loc', ['iyā', 'iyaṃ'], ['īsu']],
  ['voc', ['i'], ['ī', 'iyo']],
]);

/** nadī — ī-ending feminine. */
const II_FEM = e([
  ['nom', ['ī'], ['ī', 'iyo']],
  ['acc', ['iṃ'], ['ī', 'iyo']],
  ['ins', ['iyā'], ['īhi', 'ībhi']],
  ['dat', ['iyā'], ['īnaṃ']],
  ['abl', ['iyā'], ['īhi', 'ībhi']],
  ['gen', ['iyā'], ['īnaṃ']],
  ['loc', ['iyā', 'iyaṃ'], ['īsu']],
  ['voc', ['i'], ['ī', 'iyo']],
]);

/** bhikkhu — u-ending masculine. Its vocative plural gives us "bhikkhave". */
const U_MASC = e([
  ['nom', ['u'], ['ū', 'avo']],
  ['acc', ['uṃ'], ['ū', 'avo']],
  ['ins', ['unā'], ['ūhi', 'ūbhi']],
  ['dat', ['uno', 'ussa'], ['ūnaṃ']],
  ['abl', ['unā', 'usmā', 'umhā'], ['ūhi', 'ūbhi']],
  ['gen', ['uno', 'ussa'], ['ūnaṃ']],
  ['loc', ['usmiṃ', 'umhi'], ['ūsu']],
  ['voc', ['u'], ['ave', 'avo']],
]);

const U_NEUT: Endings = { ...U_MASC,
  nom: { sg: ['u'], pl: ['ūni', 'ū'] },
  acc: { sg: ['uṃ'], pl: ['ūni', 'ū'] },
  voc: { sg: ['u'], pl: ['ūni'] },
};

/** dhenu — u-ending feminine. */
const U_FEM = e([
  ['nom', ['u'], ['ū', 'uyo']],
  ['acc', ['uṃ'], ['ū', 'uyo']],
  ['ins', ['uyā'], ['ūhi', 'ūbhi']],
  ['dat', ['uyā'], ['ūnaṃ']],
  ['abl', ['uyā'], ['ūhi', 'ūbhi']],
  ['gen', ['uyā'], ['ūnaṃ']],
  ['loc', ['uyā', 'uyaṃ'], ['ūsu']],
  ['voc', ['u'], ['ū', 'uyo']],
]);

/** satthar, pitar — agent and kinship nouns in -ar. */
const AR_STEM = e([
  ['nom', ['ā'], ['āro']],
  ['acc', ['āraṃ'], ['āre', 'āro']],
  ['ins', ['ārā'], ['ārehi', 'ūhi']],
  ['dat', ['u', 'uno', 'ussa'], ['ārānaṃ', 'ūnaṃ']],
  ['abl', ['ārā'], ['ārehi', 'ūhi']],
  ['gen', ['u', 'uno', 'ussa'], ['ārānaṃ', 'ūnaṃ']],
  ['loc', ['ari'], ['āresu', 'ūsu']],
  ['voc', ['a', 'ā'], ['āro']],
]);

/** bhagavant, satimant — the -vant/-mant possessive adjectives. */
const VANT_STEM = e([
  ['nom', ['ā'], ['anto', 'antā']],
  ['acc', ['antaṃ'], ['ante']],
  ['ins', ['atā', 'antena'], ['antehi']],
  ['dat', ['ato', 'antassa'], ['ataṃ', 'antānaṃ']],
  ['abl', ['atā', 'antasmā'], ['antehi']],
  ['gen', ['ato', 'antassa'], ['ataṃ', 'antānaṃ']],
  ['loc', ['ati', 'ante', 'antasmiṃ'], ['antesu']],
  ['voc', ['ā', 'a'], ['anto']],
]);

/** gacchant — present participles declined as -ant stems. */
const ANT_STEM = e([
  ['nom', ['aṃ', 'anto'], ['anto', 'antā']],
  ['acc', ['antaṃ'], ['ante']],
  ['ins', ['atā', 'antena'], ['antehi']],
  ['dat', ['ato', 'antassa'], ['ataṃ', 'antānaṃ']],
  ['abl', ['atā', 'antasmā'], ['antehi']],
  ['gen', ['ato', 'antassa'], ['ataṃ', 'antānaṃ']],
  ['loc', ['ati', 'ante'], ['antesu']],
  ['voc', ['aṃ', 'anta'], ['anto']],
]);

/** mano, ceto, tejo — the "mana-group" -as stems. */
const AS_STEM = e([
  ['nom', ['o', 'aṃ'], ['ā', 'āni']],
  ['acc', ['aṃ'], ['e', 'āni']],
  ['ins', ['asā', 'ena'], ['ehi']],
  ['dat', ['aso', 'assa'], ['ānaṃ']],
  ['abl', ['asā', 'asmā'], ['ehi']],
  ['gen', ['aso', 'assa'], ['ānaṃ']],
  ['loc', ['asi', 'e', 'asmiṃ'], ['esu']],
  ['voc', ['a'], ['ā']],
]);

const TABLES: Record<string, Endings> = {
  'a:m': A_MASC, 'a:nt': A_NEUT, 'a:f': AA_FEM,
  'ā:f': AA_FEM, 'ā:m': AA_FEM, 'ā:nt': AA_FEM,
  'i:m': I_MASC, 'i:nt': I_NEUT, 'i:f': I_FEM,
  'ī:f': II_FEM, 'ī:m': I_MASC, 'ī:nt': I_NEUT,
  'u:m': U_MASC, 'u:nt': U_NEUT, 'u:f': U_FEM,
  'ū:f': U_FEM, 'ū:m': U_MASC, 'ū:nt': U_NEUT,
  'ar:m': AR_STEM, 'ar:f': AR_STEM, 'ar:nt': AR_STEM,
  'vant:m': VANT_STEM, 'vant:f': VANT_STEM, 'vant:nt': VANT_STEM,
  'ant:m': ANT_STEM, 'ant:f': ANT_STEM, 'ant:nt': ANT_STEM,
  'as:nt': AS_STEM, 'as:m': AS_STEM, 'as:f': AS_STEM,
};

/** Strip the citation ending so endings can be appended to a bare base. */
function baseOf(word: string, decl: Decl): string {
  switch (decl) {
    case 'ar': return word.replace(/ar$/, '').replace(/ā$/, '');
    case 'vant':
    case 'ant': return word.replace(/ant$/, '');
    case 'as': return word.replace(/a$/, '');
    default: return word.replace(/[aāiīuū]$/, '');
  }
}

/** Nouns whose paradigms are too irregular to derive; listed in full. */
const IRREGULAR_NOUNS: Record<string, Partial<Record<`${Case}.${Numb}`, string[]>>> = {
  rājan: {
    'nom.sg': ['rājā'], 'acc.sg': ['rājānaṃ', 'rājaṃ'], 'ins.sg': ['raññā', 'rājena'],
    'dat.sg': ['rañño', 'rājino'], 'abl.sg': ['raññā'], 'gen.sg': ['rañño', 'rājino'],
    'loc.sg': ['raññe', 'rājini'], 'voc.sg': ['rāja'],
    'nom.pl': ['rājāno'], 'acc.pl': ['rājāno'], 'ins.pl': ['rājūhi', 'rājehi'],
    'dat.pl': ['raññaṃ', 'rājūnaṃ'], 'abl.pl': ['rājūhi'], 'gen.pl': ['raññaṃ', 'rājūnaṃ'],
    'loc.pl': ['rājūsu', 'rājesu'], 'voc.pl': ['rājāno'],
  },
  attan: {
    'nom.sg': ['attā'], 'acc.sg': ['attānaṃ', 'attaṃ'], 'ins.sg': ['attanā'],
    'dat.sg': ['attano'], 'abl.sg': ['attanā'], 'gen.sg': ['attano'],
    'loc.sg': ['attani'], 'voc.sg': ['atta'],
    'nom.pl': ['attāno'], 'acc.pl': ['attāno'], 'ins.pl': ['attanehi'],
    'dat.pl': ['attānaṃ'], 'abl.pl': ['attanehi'], 'gen.pl': ['attānaṃ'],
    'loc.pl': ['attesu'], 'voc.pl': ['attāno'],
  },
};

export type NounTable = Record<Case, { sg: string[]; pl: string[] }>;

/**
 * Build the full eight-case table for a noun.
 * `word` is the citation form (buddha, kaññā, bhikkhu, satthar, bhagavant).
 */
export function declineNoun(word: string, decl: Decl, gender: Gender): NounTable {
  const irregular = IRREGULAR_NOUNS[word];
  if (irregular) {
    return Object.fromEntries(
      CASES.map((c) => [c, { sg: irregular[`${c}.sg`] ?? [], pl: irregular[`${c}.pl`] ?? [] }]),
    ) as NounTable;
  }
  const endings = TABLES[`${decl}:${gender}`] ?? A_MASC;
  const base = baseOf(word, decl);
  return Object.fromEntries(
    CASES.map((c) => [c, {
      sg: endings[c].sg.map((x) => base + x),
      pl: endings[c].pl.map((x) => base + x),
    }]),
  ) as NounTable;
}

/** The single form to show first when a drill asks for one answer. */
export function declineOne(word: string, decl: Decl, gender: Gender, c: Case, n: Numb): string {
  return declineNoun(word, decl, gender)[c][n][0] ?? word;
}

/* ---------------------------------------------------------------- verbs -- */

export type Tense = 'pres' | 'fut' | 'aor' | 'imp' | 'opt';
export type Person = 1 | 2 | 3;

export const TENSE_INFO: Record<Tense, { km: string; pali: string; note: string }> = {
  pres: { km: 'បច្ចុប្បន្នកាល', pali: 'vattamānā', note: 'កំពុងធ្វើ / ធ្វើជាទូទៅ' },
  fut: { km: 'អនាគតកាល', pali: 'bhavissanti', note: 'នឹងធ្វើ' },
  aor: { km: 'អតីតកាល', pali: 'ajjatanī', note: 'បានធ្វើរួច' },
  imp: { km: 'បញ្ជា/អាណត្តិ', pali: 'pañcamī', note: 'ចូរធ្វើ' },
  opt: { km: 'សុភាវៈ/គួរ', pali: 'sattamī', note: 'គប្បីធ្វើ / បើធ្វើ' },
};

export const PERSON_INFO: Record<Person, { km: string; pali: string }> = {
  3: { km: 'បុរសទី៣ (គេ)', pali: 'paṭhamapurisa' },
  2: { km: 'បុរសទី២ (អ្នក)', pali: 'majjhimapurisa' },
  1: { km: 'បុរសទី១ (ខ្ញុំ)', pali: 'uttamapurisa' },
};

const VERB_ENDINGS: Record<Tense, Record<`${Person}.${Numb}`, string[]>> = {
  pres: {
    '3.sg': ['ti'], '2.sg': ['si'], '1.sg': ['mi'],
    '3.pl': ['nti'], '2.pl': ['tha'], '1.pl': ['ma'],
  },
  fut: {
    '3.sg': ['issati'], '2.sg': ['issasi'], '1.sg': ['issāmi'],
    '3.pl': ['issanti'], '2.pl': ['issatha'], '1.pl': ['issāma'],
  },
  aor: {
    '3.sg': ['i'], '2.sg': ['i'], '1.sg': ['iṃ'],
    '3.pl': ['iṃsu'], '2.pl': ['ittha'], '1.pl': ['imhā'],
  },
  imp: {
    '3.sg': ['tu'], '2.sg': ['', 'hi'], '1.sg': ['mi'],
    '3.pl': ['ntu'], '2.pl': ['tha'], '1.pl': ['ma'],
  },
  opt: {
    '3.sg': ['eyya'], '2.sg': ['eyyāsi'], '1.sg': ['eyyāmi'],
    '3.pl': ['eyyuṃ'], '2.pl': ['eyyātha'], '1.pl': ['eyyāma'],
  },
};

/**
 * Lengthen or shorten the stem vowel the way the ending requires:
 * gaccha + mi -> gacchāmi, gaccha + ti -> gacchati, gaccha + eyya -> gccheyya.
 */
function joinStem(stem: string, ending: string, tense: Tense): string {
  const base = stem.replace(/a$/, '');
  if (tense === 'opt') return base + ending;
  if (tense === 'fut' || tense === 'aor') return base + ending;
  if (tense === 'imp' && ending === '') return stem;
  if (tense === 'imp' && ending === 'hi') return base + 'ā' + ending;
  if (ending === 'mi' || ending === 'ma') return base + 'ā' + ending;
  return base + 'a' + ending;
}

export type VerbTable = Record<Tense, Record<`${Person}.${Numb}`, string[]>>;

/** `stem` is the present stem, e.g. gaccha (gacchati), paca (pacati), vada. */
export function conjugate(
  stem: string,
  overrides: Partial<Record<`${Tense}.${Person}.${Numb}`, string[]>> = {},
): VerbTable {
  const tenses = Object.keys(VERB_ENDINGS) as Tense[];
  return Object.fromEntries(
    tenses.map((t) => [
      t,
      Object.fromEntries(
        (Object.keys(VERB_ENDINGS[t]) as `${Person}.${Numb}`[]).map((slot) => {
          const key = `${t}.${slot}` as `${Tense}.${Person}.${Numb}`;
          const forms = overrides[key] ?? VERB_ENDINGS[t][slot].map((x) => joinStem(stem, x, t));
          return [slot, forms];
        }),
      ),
    ]),
  ) as VerbTable;
}

export function conjugateOne(
  stem: string, tense: Tense, person: Person, n: Numb,
  overrides?: Partial<Record<`${Tense}.${Person}.${Numb}`, string[]>>,
): string {
  return conjugate(stem, overrides)[tense][`${person}.${n}`][0] ?? stem;
}

/**
 * Regularly derived non-finite forms. Irregular verbs (gacchati -> gata, gantvā)
 * carry explicit values on the vocabulary entry and override these.
 */
export function derivedForms(stem: string): {
  pp: string; abs: string; inf: string; prp: string; prpMana: string; fpp: string;
} {
  const base = stem.replace(/a$/, '');
  return {
    pp: base + 'ita',
    abs: base + 'itvā',
    inf: base + 'ituṃ',
    prp: stem + 'nta',
    prpMana: base + 'amāna',
    fpp: base + 'itabba',
  };
}

export const DERIVED_INFO: Record<string, { km: string; pali: string; note: string }> = {
  pp: { km: 'កិរិយាអតីត', pali: 'kita (-ta)', note: 'ធ្វើរួច / ត្រូវបានធ្វើ — gata = ទៅហើយ' },
  abs: { km: 'បុព្វកិរិយា', pali: 'pubbakiriyā (-tvā)', note: 'ធ្វើ…រួច — gantvā = ទៅរួច' },
  inf: { km: 'និមិត្តកិរិយា', pali: 'tumanta (-tuṃ)', note: 'ដើម្បីធ្វើ — gantuṃ = ដើម្បីទៅ' },
  prp: { km: 'បច្ចុប្បន្នកិរិយា', pali: 'vattamāna (-nta)', note: 'កំពុងធ្វើ — gacchanto = កំពុងទៅ' },
  fpp: { km: 'កិច្ចកិរិយា', pali: 'kicca (-tabba)', note: 'គួរធ្វើ — kātabba = គួរធ្វើ' },
};

/* ------------------------------------------------------------ pronouns -- */

export const PRONOUNS: Record<string, { km: string; forms: Partial<Record<`${Case}.${Numb}`, string[]>> }> = {
  amha: {
    km: 'ខ្ញុំ / យើង',
    forms: {
      'nom.sg': ['ahaṃ'], 'acc.sg': ['maṃ', 'mamaṃ'], 'ins.sg': ['mayā', 'me'],
      'dat.sg': ['mama', 'mayhaṃ', 'me'], 'abl.sg': ['mayā'], 'gen.sg': ['mama', 'mayhaṃ', 'me'],
      'loc.sg': ['mayi'],
      'nom.pl': ['mayaṃ', 'amhe'], 'acc.pl': ['amhe', 'no'], 'ins.pl': ['amhehi', 'no'],
      'dat.pl': ['amhākaṃ', 'no'], 'abl.pl': ['amhehi'], 'gen.pl': ['amhākaṃ', 'no'],
      'loc.pl': ['amhesu'],
    },
  },
  tumha: {
    km: 'អ្នក / អ្នកទាំងឡាយ',
    forms: {
      'nom.sg': ['tvaṃ', 'tuvaṃ'], 'acc.sg': ['taṃ', 'tavaṃ'], 'ins.sg': ['tayā', 'te'],
      'dat.sg': ['tava', 'tuyhaṃ', 'te'], 'abl.sg': ['tayā'], 'gen.sg': ['tava', 'tuyhaṃ', 'te'],
      'loc.sg': ['tayi'],
      'nom.pl': ['tumhe'], 'acc.pl': ['tumhe', 'vo'], 'ins.pl': ['tumhehi', 'vo'],
      'dat.pl': ['tumhākaṃ', 'vo'], 'abl.pl': ['tumhehi'], 'gen.pl': ['tumhākaṃ', 'vo'],
      'loc.pl': ['tumhesu'],
    },
  },
  ta_m: {
    km: 'គាត់ / នោះ (បុល្លិង្គ)',
    forms: {
      'nom.sg': ['so'], 'acc.sg': ['taṃ'], 'ins.sg': ['tena'], 'dat.sg': ['tassa'],
      'abl.sg': ['tasmā'], 'gen.sg': ['tassa'], 'loc.sg': ['tasmiṃ'],
      'nom.pl': ['te'], 'acc.pl': ['te'], 'ins.pl': ['tehi'], 'dat.pl': ['tesaṃ', 'tesānaṃ'],
      'abl.pl': ['tehi'], 'gen.pl': ['tesaṃ'], 'loc.pl': ['tesu'],
    },
  },
  ta_f: {
    km: 'នាង / នោះ (ឥត្ថីលិង្គ)',
    forms: {
      'nom.sg': ['sā'], 'acc.sg': ['taṃ'], 'ins.sg': ['tāya'], 'dat.sg': ['tassā', 'tāya'],
      'abl.sg': ['tāya'], 'gen.sg': ['tassā'], 'loc.sg': ['tassaṃ', 'tāyaṃ'],
      'nom.pl': ['tā', 'tāyo'], 'acc.pl': ['tā', 'tāyo'], 'ins.pl': ['tāhi'],
      'dat.pl': ['tāsaṃ'], 'abl.pl': ['tāhi'], 'gen.pl': ['tāsaṃ'], 'loc.pl': ['tāsu'],
    },
  },
  ta_nt: {
    km: 'វា / នោះ (នបុំសកលិង្គ)',
    forms: {
      'nom.sg': ['taṃ', 'tad'], 'acc.sg': ['taṃ'], 'ins.sg': ['tena'], 'dat.sg': ['tassa'],
      'abl.sg': ['tasmā'], 'gen.sg': ['tassa'], 'loc.sg': ['tasmiṃ'],
      'nom.pl': ['tāni'], 'acc.pl': ['tāni'], 'ins.pl': ['tehi'], 'dat.pl': ['tesaṃ'],
      'abl.pl': ['tehi'], 'gen.pl': ['tesaṃ'], 'loc.pl': ['tesu'],
    },
  },
  ima_m: {
    km: 'នេះ (បុល្លិង្គ)',
    forms: {
      'nom.sg': ['ayaṃ'], 'acc.sg': ['imaṃ'], 'ins.sg': ['iminā', 'anena'], 'dat.sg': ['imassa', 'assa'],
      'abl.sg': ['imasmā'], 'gen.sg': ['imassa', 'assa'], 'loc.sg': ['imasmiṃ', 'asmiṃ'],
      'nom.pl': ['ime'], 'acc.pl': ['ime'], 'ins.pl': ['imehi', 'ehi'], 'dat.pl': ['imesaṃ', 'esaṃ'],
      'abl.pl': ['imehi'], 'gen.pl': ['imesaṃ', 'esaṃ'], 'loc.pl': ['imesu', 'esu'],
    },
  },
  ya_m: {
    km: 'ដែល / អ្នកណា (សម្ពន្ធ)',
    forms: {
      'nom.sg': ['yo'], 'acc.sg': ['yaṃ'], 'ins.sg': ['yena'], 'dat.sg': ['yassa'],
      'abl.sg': ['yasmā'], 'gen.sg': ['yassa'], 'loc.sg': ['yasmiṃ', 'yamhi'],
      'nom.pl': ['ye'], 'acc.pl': ['ye'], 'ins.pl': ['yehi'], 'dat.pl': ['yesaṃ'],
      'abl.pl': ['yehi'], 'gen.pl': ['yesaṃ'], 'loc.pl': ['yesu'],
    },
  },
  ka_m: {
    km: 'អ្នកណា? អ្វី? (សំណួរ)',
    forms: {
      'nom.sg': ['ko'], 'acc.sg': ['kaṃ'], 'ins.sg': ['kena'], 'dat.sg': ['kassa', 'kissa'],
      'abl.sg': ['kasmā', 'kismā'], 'gen.sg': ['kassa'], 'loc.sg': ['kasmiṃ', 'kimhi'],
      'nom.pl': ['ke'], 'acc.pl': ['ke'], 'ins.pl': ['kehi'], 'dat.pl': ['kesaṃ'],
      'abl.pl': ['kehi'], 'gen.pl': ['kesaṃ'], 'loc.pl': ['kesu'],
    },
  },
};
