import type { Case, Decl, Gender, Numb, Person, Tense } from '../lib/morphology';

export type Pos = 'noun' | 'verb' | 'adj' | 'pron' | 'ind' | 'num' | 'prefix';

/** One dictionary entry. Inflected forms are derived, never stored. */
export type Vocab = {
  id: string;
  /** Citation form in IAST; Khmer script is generated from it. */
  pali: string;
  km: string;
  en: string;
  pos: Pos;
  decl?: Decl;
  gender?: Gender;
  /** Present stem for verbs, e.g. gaccha for gacchati. */
  stem?: string;
  /** Irregular non-finite forms; regular ones are derived. */
  pp?: string;
  abs?: string;
  inf?: string;
  overrides?: Partial<Record<`${Tense}.${Person}.${Numb}`, string[]>>;
  /** Khmer note shown on the teaching card. */
  note?: string;
  tags: string[];
};

/** Word-by-word gloss — the backbone of every reading exercise. */
export type Gloss = {
  pali: string;
  km: string;
  /** Grammatical parse, e.g. "បឋមា ឯក បុំ" or "កិរិយា ៣ ឯក". */
  gram?: string;
  /** Dictionary form, so the reader can link a form back to its entry. */
  lemma?: string;
};

export type Sentence = {
  id: string;
  pali: string;
  km: string;
  en?: string;
  words: Gloss[];
  tags: string[];
  source?: string;
};

export type GrammarTable = {
  caption: string;
  headers: string[];
  rows: string[][];
};

export type GrammarPoint = {
  id: string;
  kmTitle: string;
  title: string;
  /** Khmer explanation, one string per paragraph. */
  body: string[];
  tables?: GrammarTable[];
  /** Auto-generate the paradigm table for this lemma instead of writing it out. */
  paradigm?: { lemma: string; decl?: Decl; gender?: Gender; stem?: string; kind: 'noun' | 'verb' };
  examples?: string[];
  tags: string[];
};

export type PassageLine = {
  pali: string;
  km: string;
  words: Gloss[];
  note?: string;
};

export type Passage = {
  id: string;
  title: string;
  kmTitle: string;
  source: string;
  kmSource: string;
  /** Khmer introduction: what this text is and why it matters. */
  intro: string;
  lines: PassageLine[];
  tags: string[];
};

export type DrillSpec = {
  lemma: string;
  cases?: Case[];
  numbers?: Numb[];
  tenses?: Tense[];
  persons?: Person[];
};

export type LessonKind =
  | 'alphabet' | 'vocab' | 'grammar' | 'reading' | 'chant' | 'compose' | 'checkpoint';

export type Lesson = {
  id: string;
  kmTitle: string;
  title: string;
  kind: LessonKind;
  letters?: string[];
  vocab?: string[];
  grammar?: string[];
  sentences?: string[];
  passage?: string;
  drills?: DrillSpec[];
  xp: number;
};

export type Level = 'A' | 'B' | 'C' | 'D' | 'E';

export type Unit = {
  id: string;
  kmTitle: string;
  title: string;
  level: Level;
  /** What the student can do at the end, in Khmer. */
  kmGoal: string;
  color: string;
  icon: string;
  lessons: Lesson[];
};

/** A letter of the Pali alphabet as taught in the Khmer tradition. */
export type Letter = {
  iast: string;
  khmer: string;
  /** Khmer name of the letter, e.g. កៈ. */
  name: string;
  kind: 'vowel' | 'consonant' | 'niggahita';
  /** Place of articulation, traditional Pali term. */
  place: string;
  placeKm: string;
  /** Khmer description of how to make the sound. */
  hint: string;
  group?: string;
};
