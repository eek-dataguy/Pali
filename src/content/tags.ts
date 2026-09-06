/**
 * Khmer labels for the internal tags.
 *
 * Tags are identifiers used by the generator and the weak-area analysis; they
 * are English because the code reads better that way, but they must never
 * reach the learner untranslated.
 */
export const TAG_KM: Record<string, string> = {
  // skills
  alphabet: 'អក្សរ និងសំឡេង',
  script: 'ការសរសេរអក្សរខ្មែរ',
  vocab: 'វាក្យសព្ទ',
  grammar: 'វេយ្យាករណ៍',
  declension: 'ការប្រែនាម (វិភត្តិ)',
  conjugation: 'ការប្រែកិរិយា',
  sentence: 'ប្រយោគ',
  parsing: 'ការវិភាគប្រយោគ',
  cloze: 'ការបំពេញពាក្យ',
  reading: 'ការអាន',
  listening: 'ការស្តាប់',
  metre: 'ឆន្ទ (គរុ/លហុ)',
  participle: 'កិរិយាកិត្តកៈ',
  compound: 'សមាស',
  sandhi: 'សន្ធិ',
  passive: 'កម្មវាចក',
  syntax: 'រចនាសម្ព័ន្ធប្រយោគ',
  case: 'វិភត្តិ',
  verb: 'កិរិយាសព្ទ',
  pronoun: 'សព្វនាម',
  particle: 'និបាត',
  adj: 'គុណនាម',
  num: 'សំខ្យា',
  tense: 'កាល',

  // subject matter
  core: 'ពាក្យស្នូល',
  basic: 'ពាក្យប្រចាំថ្ងៃ',
  chant: 'បទសូត្រ',
  dhamma: 'ធម៌',
  tiratana: 'ព្រះរតនត្រ័យ',
  epithet: 'ពាក្យហៅព្រះពុទ្ធ',
  people: 'មនុស្ស',
  family: 'គ្រួសារ',
  world: 'ធម្មជាតិ និងវត្ថុ',
  animal: 'សត្វ',
  nature: 'ធម្មជាតិ',
  body: 'រាងកាយ',
  time: 'ពេលវេលា',
  place: 'ទីកន្លែង',
  question: 'ពាក្យសំណួរ',
  simile: 'ឧបមា',
  formula: 'ឃ្លាស្តង់ដារព្រះសូត្រ',

  // doctrine and texts
  sutta: 'ព្រះសូត្រ',
  vinaya: 'វិន័យ',
  abhidhamma: 'អភិធម្ម',
  commentary: 'អដ្ឋកថា',
  dhammapada: 'ធម្មបទ',
  text: 'គម្ពីរ',
  sacca: 'អរិយសច្ចៈ',
  khandha: 'ខន្ធ',
  ayatana: 'អាយតនៈ',
  magga: 'មគ្គ',
  paticca: 'បដិច្ចសមុប្បាទ',
  bhavana: 'ភាវនា',
  brahmavihara: 'ព្រហ្មវិហារ',
  satipatthana: 'សតិប្បដ្ឋាន',
  tilakkhana: 'ត្រៃលក្ខណ៍',
  metta: 'មេត្តា',
  dana: 'ទាន',
  advanced: 'កម្រិតខ្ពស់',
  pronunciation: 'ការបញ្ចេញសំឡេង',
};

/** Falls back to the raw tag so a new tag is visible rather than blank. */
export function tagLabel(tag: string): string {
  return TAG_KM[tag] ?? tag;
}

/** Parts of speech, for the dictionary entry cards. */
export const POS_KM: Record<string, string> = {
  noun: 'នាមសព្ទ',
  verb: 'កិរិយាសព្ទ',
  adj: 'គុណនាម',
  pron: 'សព្វនាម',
  ind: 'និបាត',
  num: 'សំខ្យា',
  prefix: 'ឧបសគ្គ',
};

export function posLabel(pos: string): string {
  return POS_KM[pos] ?? pos;
}
