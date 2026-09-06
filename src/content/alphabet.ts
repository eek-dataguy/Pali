import type { Letter } from './types';

/**
 * The 41 sounds of Pali, presented the way Khmer temple grammars present them:
 * by place of articulation (ឋាន), because that is what makes the retroflex /
 * dental contrast — ដ vs ត — audible instead of theoretical.
 */

const K = 'កណ្ឋជៈ';
const T = 'តាលុជៈ';
const M = 'មុទ្ធជៈ';
const D = 'ទន្តជៈ';
const O = 'ឱដ្ឋជៈ';

export const VOWELS: Letter[] = [
  { iast: 'a', khmer: 'អ', name: 'អៈ', kind: 'vowel', place: 'kaṇṭhaja', placeKm: K, hint: 'សំឡេងខ្លី ចេញពីបំពង់ក ដូច "អ" ក្នុងពាក្យ "អរ"។ ១ មាត្រា។' },
  { iast: 'ā', khmer: 'អា', name: 'អា', kind: 'vowel', place: 'kaṇṭhaja', placeKm: K, hint: 'ដូច អ តែវែងជាង ២ ដង។ ២ មាត្រា។ ការបញ្ចេញឲ្យខុសប្រវែង ធ្វើឲ្យប្តូរអត្ថន័យ។' },
  { iast: 'i', khmer: 'ឥ', name: 'ឥ', kind: 'vowel', place: 'tāluja', placeKm: T, hint: 'អណ្តាតឡើងទៅក្រអូមមាត់។ ខ្លី ១ មាត្រា។' },
  { iast: 'ī', khmer: 'ឦ', name: 'ឦ', kind: 'vowel', place: 'tāluja', placeKm: T, hint: 'ដូច ឥ តែវែង ២ មាត្រា។' },
  { iast: 'u', khmer: 'ឧ', name: 'ឧ', kind: 'vowel', place: 'oṭṭhaja', placeKm: O, hint: 'ត្រដុសបបូរមាត់ជារង្វង់។ ខ្លី ១ មាត្រា។' },
  { iast: 'ū', khmer: 'ឩ', name: 'ឩ', kind: 'vowel', place: 'oṭṭhaja', placeKm: O, hint: 'ដូច ឧ តែវែង ២ មាត្រា។' },
  { iast: 'e', khmer: 'ឯ', name: 'ឯ', kind: 'vowel', place: 'kaṇṭhatāluja', placeKm: 'កណ្ឋតាលុជៈ', hint: 'ស្រៈវែងជានិច្ច លើកលែងតែពេលមានព្យញ្ជនៈពីរតាមក្រោយ។' },
  { iast: 'o', khmer: 'ឱ', name: 'ឱ', kind: 'vowel', place: 'kaṇṭhoṭṭhaja', placeKm: 'កណ្ឋោដ្ឋជៈ', hint: 'ស្រៈវែងជានិច្ច លើកលែងតែពេលមានព្យញ្ជនៈពីរតាមក្រោយ។' },
];

const c = (
  iast: string, khmer: string, name: string, place: string, placeKm: string, group: string, hint: string,
): Letter => ({ iast, khmer, name, kind: 'consonant', place, placeKm, group, hint });

export const CONSONANT_GROUPS: { id: string; kmTitle: string; placeKm: string; letters: Letter[] }[] = [
  {
    id: 'ka', kmTitle: 'វគ្គ ក', placeKm: K,
    letters: [
      c('k', 'ក', 'កៈ', 'kaṇṭhaja', K, 'ka', 'សំឡេងរឹង មិនមានខ្យល់ចេញ។'),
      c('kh', 'ខ', 'ខៈ', 'kaṇṭhaja', K, 'ka', 'ដូច ក តែបញ្ចេញខ្យល់ខ្លាំង (ធនិត)។'),
      c('g', 'គ', 'គៈ', 'kaṇṭhaja', K, 'ka', 'សំឡេងកូន (ឃោសៈ) មិនមានខ្យល់។'),
      c('gh', 'ឃ', 'ឃៈ', 'kaṇṭhaja', K, 'ka', 'សំឡេងកូន + ខ្យល់ចេញ។'),
      c('ṅ', 'ង', 'ងៈ', 'kaṇṭhaja', K, 'ka', 'សំឡេងច្រមុះ ដូច "ង" ខ្មែរ។'),
    ],
  },
  {
    id: 'ca', kmTitle: 'វគ្គ ច', placeKm: T,
    letters: [
      c('c', 'ច', 'ចៈ', 'tāluja', T, 'ca', 'អណ្តាតប៉ះក្រអូមមាត់។'),
      c('ch', 'ឆ', 'ឆៈ', 'tāluja', T, 'ca', 'ដូច ច តែបញ្ចេញខ្យល់។'),
      c('j', 'ជ', 'ជៈ', 'tāluja', T, 'ca', 'សំឡេងកូន។'),
      c('jh', 'ឈ', 'ឈៈ', 'tāluja', T, 'ca', 'សំឡេងកូន + ខ្យល់។'),
      c('ñ', 'ញ', 'ញៈ', 'tāluja', T, 'ca', 'សំឡេងច្រមុះនៅក្រអូមមាត់។'),
    ],
  },
  {
    id: 'ta-retroflex', kmTitle: 'វគ្គ ដ (មុទ្ធជៈ)', placeKm: M,
    letters: [
      c('ṭ', 'ដ', 'ដៈ', 'muddhaja', M, 'ta1', 'ចុងអណ្តាតកួចឡើងប៉ះពិដានមាត់។ នេះជាចំណុចខុសគ្នាសំខាន់ពី ត។'),
      c('ṭh', 'ឋ', 'ឋៈ', 'muddhaja', M, 'ta1', 'ដូច ដ តែបញ្ចេញខ្យល់។'),
      c('ḍ', 'ឌ', 'ឌៈ', 'muddhaja', M, 'ta1', 'សំឡេងកូន កួចអណ្តាត។'),
      c('ḍh', 'ឍ', 'ឍៈ', 'muddhaja', M, 'ta1', 'សំឡេងកូន + ខ្យល់។'),
      c('ṇ', 'ណ', 'ណៈ', 'muddhaja', M, 'ta1', 'សំឡេងច្រមុះ កួចអណ្តាត។'),
    ],
  },
  {
    id: 'ta-dental', kmTitle: 'វគ្គ ត (ទន្តជៈ)', placeKm: D,
    letters: [
      c('t', 'ត', 'តៈ', 'dantaja', D, 'ta2', 'ចុងអណ្តាតប៉ះធ្មេញ។ ស្តើងជាង ដ។'),
      c('th', 'ថ', 'ថៈ', 'dantaja', D, 'ta2', 'ដូច ត តែបញ្ចេញខ្យល់។'),
      c('d', 'ទ', 'ទៈ', 'dantaja', D, 'ta2', 'សំឡេងកូននៅធ្មេញ។'),
      c('dh', 'ធ', 'ធៈ', 'dantaja', D, 'ta2', 'សំឡេងកូន + ខ្យល់ — ដូចក្នុង ធម្ម។'),
      c('n', 'ន', 'នៈ', 'dantaja', D, 'ta2', 'សំឡេងច្រមុះនៅធ្មេញ។'),
    ],
  },
  {
    id: 'pa', kmTitle: 'វគ្គ ប', placeKm: O,
    letters: [
      c('p', 'ប', 'បៈ', 'oṭṭhaja', O, 'pa', 'បិទបបូរមាត់ មិនបញ្ចេញខ្យល់។'),
      c('ph', 'ផ', 'ផៈ', 'oṭṭhaja', O, 'pa', 'ដូច ប តែបញ្ចេញខ្យល់។'),
      c('b', 'ព', 'ពៈ', 'oṭṭhaja', O, 'pa', 'សំឡេងកូន។ ចំណាំ៖ បាលី b សរសេរ ព មិនមែន ប ទេ។'),
      c('bh', 'ភ', 'ភៈ', 'oṭṭhaja', O, 'pa', 'សំឡេងកូន + ខ្យល់។'),
      c('m', 'ម', 'មៈ', 'oṭṭhaja', O, 'pa', 'សំឡេងច្រមុះនៅបបូរមាត់។'),
    ],
  },
  {
    id: 'avagga', kmTitle: 'អវគ្គ (ព្យញ្ជនៈក្រៅវគ្គ)', placeKm: 'ផ្សេងៗ',
    letters: [
      c('y', 'យ', 'យៈ', 'tāluja', T, 'avagga', 'សំឡេងរអិលនៅក្រអូមមាត់។'),
      c('r', 'រ', 'រៈ', 'muddhaja', M, 'avagga', 'អណ្តាតញ័រស្រាល។'),
      c('l', 'ល', 'លៈ', 'dantaja', D, 'avagga', 'អណ្តាតប៉ះធ្មេញ ខ្យល់ចេញសងខាង។'),
      c('v', 'វ', 'វៈ', 'dantoṭṭhaja', 'ទន្តោដ្ឋជៈ', 'avagga', 'ធ្មេញលើប៉ះបបូរមាត់ក្រោម។'),
      c('s', 'ស', 'សៈ', 'dantaja', D, 'avagga', 'សំឡេងសសៈ។ បាលីមាន ស តែមួយ គ្មាន ឝ ឞ ដូចសំស្ក្រឹតទេ។'),
      c('h', 'ហ', 'ហៈ', 'kaṇṭhaja', K, 'avagga', 'ខ្យល់ចេញពីបំពង់ក។'),
      c('ḷ', 'ឡ', 'ឡៈ', 'muddhaja', M, 'avagga', 'ល កួចអណ្តាត។ ជួបក្នុងពាក្យដូចជា ចូឡ, អាឡវក។'),
    ],
  },
];

export const NIGGAHITA_LETTER: Letter = {
  iast: 'ṃ', khmer: 'ំ', name: 'និគ្គហិត', kind: 'niggahita',
  place: 'nāsika', placeKm: 'នាសិកជៈ',
  hint: 'សញ្ញាច្រមុះ សរសេរពីលើស្រៈ។ ពុទ្ធំ = ពុទ្ធ + ំ។ បញ្ចេញដូច "ង" ស្រាលៗនៅចុងព្យាង្គ។',
};

export const ALL_LETTERS: Letter[] = [
  ...VOWELS,
  ...CONSONANT_GROUPS.flatMap((g) => g.letters),
  NIGGAHITA_LETTER,
];

export const LETTER_BY_IAST = new Map(ALL_LETTERS.map((l) => [l.iast, l]));

/** Minimal pairs that Khmer speakers most often confuse when reading Pali. */
export const CONTRAST_PAIRS: { a: string; b: string; km: string }[] = [
  { a: 'ṭ', b: 't', km: 'ដ (កួចអណ្តាត) ធៀបនឹង ត (ធ្មេញ) — ដូច បដិ ធៀបនឹង បតិ។' },
  { a: 'ḍ', b: 'd', km: 'ឌ ធៀបនឹង ទ — ខុសគ្នាត្រង់ទីតាំងអណ្តាត។' },
  { a: 'ṇ', b: 'n', km: 'ណ ធៀបនឹង ន — ដូច ញាណ ធៀបនឹង ញាន។' },
  { a: 'b', b: 'p', km: 'ព (b) ធៀបនឹង ប (p) — ចំណាំការសរសេរខ្មែរឲ្យបានច្បាស់។' },
  { a: 'a', b: 'ā', km: 'ស្រៈខ្លី ធៀបនឹង ស្រៈវែង — ប្តូរអត្ថន័យទាំងស្រុង។' },
  { a: 'ḷ', b: 'l', km: 'ឡ ធៀបនឹង ល។' },
];
