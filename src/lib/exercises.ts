import type { Case, Numb, Person, Tense } from './morphology';
import {
  CASE_INFO, NUMBER_INFO, PERSON_INFO, TENSE_INFO, conjugate, declineNoun,
} from './morphology';
import { toKhmer, syllabify } from './pali';
import { hashString, sample, seededRandom, shuffle, uniqueBy } from './util';
import { ALL_LETTERS, LETTER_BY_IAST } from '../content/alphabet';
import { VOCAB, vocabById } from '../content/vocab';
import { sentenceById } from '../content/sentences';
import { passageById } from '../content/passages';
import { grammarById } from '../content/grammar';
import type { DrillSpec, Lesson, Vocab } from '../content/types';

/**
 * Exercise generation.
 *
 * Nothing here is hand-authored: an exercise is derived from a content item
 * plus a *card id*, which is the unit the spaced-repetition scheduler tracks.
 * One vocabulary entry therefore yields recognition, production, script and
 * listening drills, and one noun yields sixteen form drills, all sharing the
 * memory of how well the student knows that item.
 */

/** The atom of memory. Everything schedulable has one of these ids. */
export type CardId = string;

export const cardIds = {
  letter: (iast: string): CardId => `letter:${iast}`,
  vocab: (id: string): CardId => `vocab:${id}`,
  nounForm: (lemma: string, c: Case, n: Numb): CardId => `form:${lemma}:${c}:${n}`,
  verbForm: (lemma: string, t: Tense, p: Person, n: Numb): CardId => `verb:${lemma}:${t}:${p}:${n}`,
  sentence: (id: string): CardId => `sent:${id}`,
  line: (passageId: string, index: number): CardId => `line:${passageId}:${index}`,
  grammar: (id: string): CardId => `grammar:${id}`,
};

/** Human-readable label for a card, used in the review and strength screens. */
export function describeCard(id: CardId): { title: string; km: string } {
  const [kind, ...rest] = id.split(':');
  switch (kind) {
    case 'letter': {
      const l = LETTER_BY_IAST.get(rest[0]);
      return { title: l?.khmer ?? rest[0], km: `អក្សរ ${l?.name ?? rest[0]}` };
    }
    case 'vocab': {
      const v = vocabById(rest[0]);
      return { title: v?.pali ?? rest[0], km: v?.km ?? '' };
    }
    case 'form': {
      const [lemma, c, n] = rest;
      return {
        title: lemma,
        km: `${CASE_INFO[c as Case]?.km ?? c} ${NUMBER_INFO[n as Numb]?.km ?? n}`,
      };
    }
    case 'verb': {
      const [lemma, t, p, n] = rest;
      return {
        title: lemma,
        km: `${TENSE_INFO[t as Tense]?.km ?? t} ${PERSON_INFO[Number(p) as Person]?.km ?? p} ${NUMBER_INFO[n as Numb]?.km ?? n}`,
      };
    }
    case 'sent': {
      const s = sentenceById(rest[0]);
      return { title: s?.pali ?? rest[0], km: s?.km ?? '' };
    }
    case 'line': {
      const p = passageById(rest[0]);
      const l = p?.lines[Number(rest[1])];
      return { title: l?.pali ?? rest.join(':'), km: p?.kmTitle ?? '' };
    }
    case 'grammar': {
      const g = grammarById(rest[0]);
      return { title: g?.title ?? rest[0], km: g?.kmTitle ?? '' };
    }
    default:
      return { title: id, km: '' };
  }
}

/* ---------------------------------------------------------- exercise types */

type Base = { id: string; card: CardId; tags: string[] };

export type Exercise =
  /** A teaching card: shown, not graded. */
  | (Base & {
      kind: 'teach';
      heading: string;
      pali?: string;
      khmerScript?: string;
      meaning?: string;
      notes: string[];
      table?: { caption: string; headers: string[]; rows: string[][] };
    })
  /** Multiple choice. `answers` holds every acceptable option index. */
  | (Base & {
      kind: 'choice';
      prompt: string;
      promptPali?: string;
      options: { text: string; sub?: string }[];
      answers: number[];
      explain?: string;
    })
  /** Tap the matching pairs. */
  | (Base & { kind: 'match'; prompt: string; pairs: { left: string; right: string; card: CardId }[] })
  /** Build a translation from word tiles. */
  | (Base & {
      kind: 'wordbank';
      prompt: string;
      promptPali?: string;
      answer: string[];
      bank: string[];
      explain?: string;
    })
  /** Free typing, checked leniently (diacritics optional, Khmer script accepted). */
  | (Base & {
      kind: 'type';
      prompt: string;
      promptSub?: string;
      answer: string;
      accept: string[];
      isPali: boolean;
      explain?: string;
    })
  /** Hear it, then choose or type it. Only generated when a voice exists. */
  | (Base & { kind: 'listen'; speak: string; options: { text: string; sub?: string }[]; answers: number[] });

export type Graded = Exclude<Exercise, { kind: 'teach' }>;

export function isGraded(ex: Exercise): ex is Graded {
  return ex.kind !== 'teach';
}

/* ------------------------------------------------------------- distractors */

/** Wrong options should be plausible: same part of speech, similar shape. */
function distractorPool(target: Vocab): Vocab[] {
  const samePos = VOCAB.filter((v) => v.id !== target.id && v.pos === target.pos);
  const shared = samePos.filter((v) => v.tags.some((t) => target.tags.includes(t)));
  return shared.length >= 6 ? shared : samePos;
}

function optionSet<T>(correct: T, wrong: T[], rand: () => number): { options: T[]; index: number } {
  const options = shuffle([correct, ...wrong], rand);
  return { options, index: options.indexOf(correct) };
}

/* ------------------------------------------------------ letter exercises -- */

function letterExercises(iast: string, rand: () => number): Exercise[] {
  const letter = LETTER_BY_IAST.get(iast);
  if (!letter) return [];
  const card = cardIds.letter(iast);
  const tags = ['alphabet'];
  const others = ALL_LETTERS.filter((l) => l.iast !== iast && l.kind === letter.kind);

  const teach: Exercise = {
    kind: 'teach', id: `${card}:teach`, card, tags,
    heading: letter.khmer,
    pali: letter.iast,
    meaning: `${letter.name} — ${letter.placeKm}`,
    notes: [letter.hint],
  };

  const wrongScript = sample(others, 3, rand).map((l) => ({ text: l.khmer }));
  const script = optionSet({ text: letter.khmer }, wrongScript, rand);
  const toScript: Exercise = {
    kind: 'choice', id: `${card}:script`, card, tags,
    prompt: `តើអក្សរខ្មែរណាតំណាងឲ្យសំឡេង « ${letter.iast} » ?`,
    options: script.options, answers: [script.index],
    explain: letter.hint,
  };

  const wrongSound = sample(others, 3, rand).map((l) => ({ text: l.iast, sub: l.name }));
  const sound = optionSet({ text: letter.iast, sub: letter.name }, wrongSound, rand);
  const toSound: Exercise = {
    kind: 'choice', id: `${card}:sound`, card, tags,
    prompt: 'តើអក្សរនេះមានសំឡេងអ្វី?',
    promptPali: letter.khmer,
    options: sound.options, answers: [sound.index],
    explain: `${letter.name} — ${letter.placeKm}។ ${letter.hint}`,
  };

  return [teach, toScript, toSound];
}

/* ------------------------------------------------------- vocab exercises -- */

function vocabExercises(v: Vocab, rand: () => number, opts: { audio: boolean }): Exercise[] {
  const card = cardIds.vocab(v.id);
  const tags = ['vocab', ...v.tags];
  const pool = distractorPool(v);
  const khmerScript = toKhmer(v.pali);

  const out: Exercise[] = [{
    kind: 'teach', id: `${card}:teach`, card, tags,
    heading: v.pali,
    pali: v.pali,
    khmerScript,
    meaning: v.km,
    notes: [v.note, v.en ? `English: ${v.en}` : undefined].filter((x): x is string => !!x),
  }];

  const meaning = optionSet(
    { text: v.km },
    sample(pool, 3, rand).map((w) => ({ text: w.km })),
    rand,
  );
  out.push({
    kind: 'choice', id: `${card}:meaning`, card, tags,
    prompt: 'ពាក្យនេះមានន័យអ្វី?',
    promptPali: v.pali,
    options: meaning.options, answers: [meaning.index],
    explain: `${v.pali} (${khmerScript}) = ${v.km}`,
  });

  const production = optionSet(
    { text: v.pali, sub: khmerScript },
    sample(pool, 3, rand).map((w) => ({ text: w.pali, sub: toKhmer(w.pali) })),
    rand,
  );
  out.push({
    kind: 'choice', id: `${card}:produce`, card, tags,
    prompt: `« ${v.km} » ជាភាសាបាលីនិយាយយ៉ាងណា?`,
    options: production.options, answers: [production.index],
    explain: `${v.km} = ${v.pali} (${khmerScript})`,
  });

  const script = optionSet(
    { text: khmerScript },
    sample(pool, 3, rand).map((w) => ({ text: toKhmer(w.pali) })),
    rand,
  );
  out.push({
    kind: 'choice', id: `${card}:script`, card, tags: [...tags, 'script'],
    prompt: 'តើពាក្យនេះសរសេរជាអក្សរខ្មែរយ៉ាងណា?',
    promptPali: v.pali,
    options: script.options, answers: [script.index],
    explain: `${v.pali} → ${khmerScript}`,
  });

  out.push({
    kind: 'type', id: `${card}:type`, card, tags,
    prompt: `សរសេរជាភាសាបាលី៖ « ${v.km} »`,
    promptSub: 'អាចសរសេរដោយអក្សរឡាតាំង (មិនចាំបាច់ដាក់សញ្ញា) ឬអក្សរខ្មែរ',
    answer: v.pali, accept: [v.pali, khmerScript], isPali: true,
    explain: `${v.pali} (${khmerScript}) = ${v.km}`,
  });

  if (opts.audio) {
    const heard = optionSet(
      { text: v.pali, sub: khmerScript },
      sample(pool, 3, rand).map((w) => ({ text: w.pali, sub: toKhmer(w.pali) })),
      rand,
    );
    out.push({
      kind: 'listen', id: `${card}:listen`, card, tags: [...tags, 'listening'],
      speak: v.pali, options: heard.options, answers: [heard.index],
    });
  }

  return out;
}

/* ------------------------------------------------- generated form drills -- */

const ALL_CASES: Case[] = ['nom', 'acc', 'ins', 'dat', 'abl', 'gen', 'loc', 'voc'];

function nounDrill(
  lemma: string, c: Case, n: Numb, rand: () => number,
): Exercise[] {
  const entry = VOCAB.find((v) => v.pali === lemma);
  const decl = entry?.decl ?? 'a';
  const gender = entry?.gender ?? 'm';
  const table = declineNoun(lemma, decl, gender);
  const correct = table[c][n][0];
  if (!correct) return [];
  const card = cardIds.nounForm(lemma, c, n);
  const tags = ['declension', 'grammar'];

  /* Distractors are other cells of the *same* table: the mistake we want to
     train away is picking the wrong case, not picking a different word. */
  const cells = ALL_CASES.flatMap((cc) =>
    (['sg', 'pl'] as Numb[]).map((nn) => ({ form: table[cc][nn][0], c: cc, n: nn })),
  ).filter((x) => x.form && x.form !== correct);
  const wrong = uniqueBy(sample(cells, 6, rand), (x) => x.form).slice(0, 3);
  if (wrong.length < 3) return [];

  const label = `${CASE_INFO[c].km} ${NUMBER_INFO[n].km}`;
  const chosen = optionSet(
    { text: correct, sub: toKhmer(correct) },
    wrong.map((w) => ({ text: w.form, sub: toKhmer(w.form) })),
    rand,
  );

  /* Several cases can share a form (buddhassa is both ចតុត្ថី and ឆដ្ឋី), so
     every option equal to the right answer counts as right. */
  const answers = chosen.options
    .map((o, i) => (o.text === correct ? i : -1))
    .filter((i) => i >= 0);

  return [{
    kind: 'choice', id: `${card}:pick`, card, tags,
    prompt: `ដាក់ « ${lemma} » ជា ${label}`,
    promptPali: toKhmer(lemma),
    options: chosen.options, answers,
    explain: `${label} របស់ ${lemma} = ${correct} (${toKhmer(correct)}) — ${CASE_INFO[c].senseKm}`,
  }, {
    kind: 'type', id: `${card}:type`, card, tags,
    prompt: `សរសេរ « ${lemma} » ជា ${label}`,
    promptSub: CASE_INFO[c].senseKm,
    answer: correct,
    accept: [...table[c][n], ...table[c][n].map(toKhmer)],
    isPali: true,
    explain: `ទម្រង់ដែលទទួលយកបាន៖ ${table[c][n].join(', ')}`,
  }];
}

function verbDrill(
  lemma: string, t: Tense, p: Person, n: Numb, rand: () => number,
): Exercise[] {
  const entry = VOCAB.find((v) => v.pali === lemma || v.id === lemma);
  const stem = entry?.stem;
  if (!stem) return [];
  const table = conjugate(stem, entry?.overrides);
  const correct = table[t][`${p}.${n}`][0];
  if (!correct) return [];
  const card = cardIds.verbForm(entry.pali, t, p, n);
  const tags = ['conjugation', 'grammar'];

  const cells = (Object.keys(table[t]) as `${Person}.${Numb}`[])
    .map((slot) => table[t][slot][0])
    .filter((f) => f && f !== correct);
  const wrong = uniqueBy(sample(cells, 5, rand), (x) => x).slice(0, 3);
  if (wrong.length < 3) return [];

  const label = `${TENSE_INFO[t].km} ${PERSON_INFO[p].km} ${NUMBER_INFO[n].km}`;
  const chosen = optionSet(
    { text: correct, sub: toKhmer(correct) },
    wrong.map((w) => ({ text: w, sub: toKhmer(w) })),
    rand,
  );
  const answers = chosen.options
    .map((o, i) => (o.text === correct ? i : -1))
    .filter((i) => i >= 0);

  return [{
    kind: 'choice', id: `${card}:pick`, card, tags,
    prompt: `ដាក់ « ${entry.pali} » (${entry.km}) ជា ${label}`,
    options: chosen.options, answers,
    explain: `${label} = ${correct} (${toKhmer(correct)})`,
  }, {
    kind: 'type', id: `${card}:type`, card, tags,
    prompt: `សរសេរ « ${entry.pali} » ជា ${label}`,
    promptSub: TENSE_INFO[t].note,
    answer: correct,
    accept: [...table[t][`${p}.${n}`], ...table[t][`${p}.${n}`].map(toKhmer)],
    isPali: true,
  }];
}

function drillExercises(spec: DrillSpec, rand: () => number): Exercise[] {
  const out: Exercise[] = [];
  const numbers = spec.numbers ?? ['sg', 'pl'];
  if (spec.tenses?.length) {
    for (const t of spec.tenses) {
      for (const p of spec.persons ?? [1, 2, 3]) {
        for (const n of numbers) out.push(...verbDrill(spec.lemma, t, p, n, rand));
      }
    }
  }
  for (const c of spec.cases ?? []) {
    for (const n of numbers) out.push(...nounDrill(spec.lemma, c, n, rand));
  }
  return out;
}

/* ----------------------------------------------------- sentence exercises - */

function sentenceExercises(sentenceId: string, rand: () => number): Exercise[] {
  const s = sentenceById(sentenceId);
  if (!s) return [];
  const card = cardIds.sentence(sentenceId);
  const tags = ['sentence', ...s.tags];
  const out: Exercise[] = [];

  out.push({
    kind: 'teach', id: `${card}:teach`, card, tags,
    heading: s.pali,
    pali: s.pali,
    khmerScript: toKhmer(s.pali),
    meaning: s.km,
    notes: [
      s.words.map((w) => `${w.pali} = ${w.km}${w.gram ? ` (${w.gram})` : ''}`).join(' · '),
      s.source,
    ].filter((x): x is string => !!x),
  });

  /* Build the Khmer translation from tiles. Decoys come from other sentences so
     the student must actually read, not pattern-match on tile count. */
  const answer = s.km.replace(/។$/, '').split(/\s+/).filter(Boolean);
  const decoys = shuffle(
    s.words.map((w) => w.km.split(/\s+/)[0]).filter((w) => w && !answer.includes(w)),
    rand,
  ).slice(0, 3);
  if (answer.length >= 2) {
    out.push({
      kind: 'wordbank', id: `${card}:build`, card, tags,
      prompt: 'ប្រែប្រយោគនេះជាភាសាខ្មែរ',
      promptPali: s.pali,
      answer,
      bank: shuffle([...answer, ...decoys], rand),
      explain: s.km,
    });
  }

  /* Parse one content word: which case/number is it? */
  const parsable = s.words.filter((w) => w.gram && /វិភត្តិ|បឋមា|ទុតិយា|តតិយា|ចតុត្ថី|បញ្ចមី|ឆដ្ឋី|សត្តមី/.test(w.gram));
  const target = parsable[Math.floor(rand() * parsable.length)];
  if (target?.gram) {
    const wrongGrams = shuffle(
      ALL_CASES.map((c) => `${CASE_INFO[c].km} ឯកវចនៈ`).filter((g) => !target.gram!.startsWith(g.split(' ')[0])),
      rand,
    ).slice(0, 3);
    const parsed = optionSet({ text: target.gram }, wrongGrams.map((t) => ({ text: t })), rand);
    out.push({
      kind: 'choice', id: `${card}:parse`, card, tags: [...tags, 'parsing'],
      prompt: `ក្នុងប្រយោគនេះ ពាក្យ « ${target.pali} » ជាអ្វី?`,
      promptPali: s.pali,
      options: parsed.options, answers: [parsed.index],
      explain: `${target.pali} = ${target.km} — ${target.gram}`,
    });
  }

  return out;
}

/* ------------------------------------------------------ passage exercises - */

function passageExercises(passageId: string, rand: () => number): Exercise[] {
  const p = passageById(passageId);
  if (!p) return [];
  const out: Exercise[] = [];

  p.lines.forEach((l, i) => {
    const card = cardIds.line(passageId, i);
    const tags = ['reading', ...p.tags];
    out.push({
      kind: 'teach', id: `${card}:teach`, card, tags,
      heading: l.pali,
      pali: l.pali,
      khmerScript: toKhmer(l.pali),
      meaning: l.km,
      notes: [
        l.words.map((w) => `${w.pali} = ${w.km}${w.gram ? ` (${w.gram})` : ''}`).join(' · '),
        l.note,
      ].filter((x): x is string => !!x),
    });

    /* Meaning check against other lines of the same text — a real comprehension
       question, since the decoys are all thematically close. */
    const others = p.lines.filter((_, j) => j !== i).map((x) => ({ text: x.km }));
    if (others.length >= 2) {
      const chosen = optionSet({ text: l.km }, sample(others, 3, rand), rand);
      out.push({
        kind: 'choice', id: `${card}:meaning`, card, tags,
        prompt: 'បាទនេះមានន័យអ្វី?',
        promptPali: l.pali,
        options: chosen.options, answers: [chosen.index],
        explain: l.note ?? l.km,
      });
    }

    /* Cloze: blank one word out of the line and rebuild it from the gloss. */
    const words = l.pali.replace(/[,;។.]/g, '').split(/\s+/).filter(Boolean);
    if (words.length >= 3) {
      const hole = Math.floor(rand() * words.length);
      const missing = words[hole];
      const blanked = words.map((w, j) => (j === hole ? '____' : w)).join(' ');
      const wrong = shuffle(words.filter((w) => w !== missing), rand).slice(0, 3)
        .map((w) => ({ text: w, sub: toKhmer(w) }));
      if (wrong.length === 3) {
        const chosen = optionSet({ text: missing, sub: toKhmer(missing) }, wrong, rand);
        out.push({
          kind: 'choice', id: `${card}:cloze`, card, tags: [...tags, 'cloze'],
          prompt: 'បំពេញពាក្យដែលខ្វះ',
          promptPali: blanked,
          options: chosen.options, answers: [chosen.index],
          explain: `${l.pali} — ${l.km}`,
        });
      }
    }
  });

  return out;
}

/* ------------------------------------------------------ grammar exercises - */

function grammarExercises(
  grammarId: string, rand: () => number, script: ScriptMode = 'both',
): Exercise[] {
  const g = grammarById(grammarId);
  if (!g) return [];
  const card = cardIds.grammar(grammarId);
  const table = g.paradigm ? paradigmTable(g.paradigm, script) : g.tables?.[0];
  const out: Exercise[] = [{
    kind: 'teach', id: `${card}:teach`, card, tags: ['grammar', ...g.tags],
    heading: g.kmTitle,
    meaning: g.title,
    notes: g.body,
    table,
  }];

  /* A grammar point must produce practice, not just a page to read. Its
     paradigm and its examples are turned into drills so that a purely
     explanatory lesson is still a lesson you can complete. */
  if (g.paradigm?.kind === 'noun') {
    const cases: Case[] = sample(ALL_CASES, 4, rand);
    for (const c of cases) {
      out.push(...nounDrill(g.paradigm.lemma, c, rand() < 0.5 ? 'sg' : 'pl', rand));
    }
  } else if (g.paradigm?.kind === 'verb') {
    const slots: [Tense, Person, Numb][] = [
      ['pres', 3, 'sg'], ['pres', 1, 'sg'], ['pres', 3, 'pl'], ['pres', 2, 'sg'],
    ];
    for (const [t, person, n] of slots) {
      out.push(...verbDrill(g.paradigm.lemma, t, person, n, rand));
    }
  }
  for (const id of g.examples ?? []) out.push(...sentenceExercises(id, rand));
  if (g.tags.includes('metre')) out.push(...metreExercises(rand));
  return out;
}

/** Metre drills: is this syllable គរុ (heavy) or លហុ (light)? */
function metreExercises(rand: () => number): Exercise[] {
  const words = ['dhammaṃ', 'buddho', 'saṅkhārā', 'anicca', 'mettā', 'gacchāmi', 'sutaṃ', 'paññā'];
  return sample(words, 4, rand).flatMap((w) => {
    const syls = syllabify(w);
    if (syls.length < 2) return [];
    const i = Math.floor(rand() * syls.length);
    const target = syls[i];
    const card = `metre:${w}:${i}`;
    const options = [{ text: 'គរុ (ធ្ងន់)' }, { text: 'លហុ (ស្រាល)' }];
    return [{
      kind: 'choice', id: `${card}:pick`, card, tags: ['metre', 'chant'],
      prompt: `ក្នុងពាក្យ « ${w} » ព្យាង្គ « ${target.text} » ជាគរុ ឬលហុ?`,
      promptPali: syls.map((sy) => sy.text).join(' · '),
      options,
      answers: [target.heavy ? 0 : 1],
      explain: target.heavy
        ? 'ជាគរុ ព្រោះមានស្រៈវែង ឬមានព្យញ្ជនៈបិទព្យាង្គ។'
        : 'ជាលហុ ព្រោះមានស្រៈខ្លី ហើយគ្មានព្យញ្ជនៈបិទ។',
    } as Exercise];
  });
}

/** Which script the learner reads Pali in; paradigm tables follow it. */
export type ScriptMode = 'khmer' | 'iast' | 'both';

/** Format one set of alternative forms for a table cell. */
function showForms(forms: string[], script: ScriptMode): string {
  const shown = forms.map((f) => {
    if (script === 'iast') return f;
    if (script === 'khmer') return toKhmer(f);
    return `${toKhmer(f)} · ${f}`;
  });
  return shown.join(script === 'both' ? '\n' : ' / ');
}

/** Render a paradigm as a display table, generated rather than typed out. */
export function paradigmTable(
  p: NonNullable<import('../content/types').GrammarPoint['paradigm']>,
  script: ScriptMode = 'both',
): { caption: string; headers: string[]; rows: string[][] } {
  if (p.kind === 'verb') {
    const entry = VOCAB.find((v) => v.pali === p.lemma || v.id === p.lemma);
    const table = conjugate(p.stem ?? entry?.stem ?? 'gaccha', entry?.overrides);
    const tenses: Tense[] = ['pres', 'fut', 'aor', 'imp', 'opt'];
    return {
      caption: `ការប្រែកិរិយា ${p.lemma}`,
      headers: ['បុរស', ...tenses.map((t) => TENSE_INFO[t].km)],
      rows: ([3, 2, 1] as Person[]).flatMap((person) =>
        (['sg', 'pl'] as Numb[]).map((n) => [
          `${PERSON_INFO[person].km} ${NUMBER_INFO[n].km}`,
          ...tenses.map((t) => showForms(table[t][`${person}.${n}`], script)),
        ]),
      ),
    };
  }
  const entry = VOCAB.find((v) => v.pali === p.lemma);
  const table = declineNoun(p.lemma, p.decl ?? entry?.decl ?? 'a', p.gender ?? entry?.gender ?? 'm');
  return {
    caption: `ការប្រែនាម ${p.lemma}`,
    headers: ['វិភត្តិ', 'ឯកវចនៈ', 'ពហុវចនៈ'],
    rows: ALL_CASES.map((c) => [
      `${CASE_INFO[c].km}`,
      showForms(table[c].sg, script),
      showForms(table[c].pl, script),
    ]),
  };
}

/* ---------------------------------------------------------- session build - */

export type SessionOptions = {
  audio: boolean;
  /** Script the learner reads Pali in; controls generated paradigm tables. */
  script?: ScriptMode;
  /** Card ids that are due for review and should be folded into the lesson. */
  dueCards?: CardId[];
  /** Target number of graded exercises. */
  target?: number;
  seed?: number;
};

/** Pull one graded exercise for a card that already exists in the schedule. */
export function exercisesForCard(card: CardId, rand: () => number, audio: boolean): Exercise[] {
  const [kind, ...rest] = card.split(':');
  switch (kind) {
    case 'letter': return letterExercises(rest[0], rand);
    case 'vocab': {
      const v = vocabById(rest[0]);
      return v ? vocabExercises(v, rand, { audio }) : [];
    }
    case 'form': return nounDrill(rest[0], rest[1] as Case, rest[2] as Numb, rand);
    case 'verb': return verbDrill(rest[0], rest[1] as Tense, Number(rest[2]) as Person, rest[3] as Numb, rand);
    case 'sent': return sentenceExercises(rest[0], rand);
    case 'line': {
      const all = passageExercises(rest[0], rand);
      return all.filter((e) => e.card === card);
    }
    case 'grammar': return grammarExercises(rest[0], rand);
    default: return [];
  }
}

/**
 * Build a lesson: teaching cards first, then practice, with due review items
 * interleaved so old material keeps resurfacing inside new lessons.
 */
export function buildLesson(lesson: Lesson, opts: SessionOptions = { audio: false }): Exercise[] {
  const rand = seededRandom(opts.seed ?? hashString(lesson.id));
  const audio = opts.audio;

  const teaching: Exercise[] = [];
  const practice: Exercise[] = [];

  const add = (items: Exercise[]) => {
    for (const ex of items) (ex.kind === 'teach' ? teaching : practice).push(ex);
  };

  for (const id of lesson.grammar ?? []) add(grammarExercises(id, rand, opts.script ?? 'both'));
  for (const iast of lesson.letters ?? []) add(letterExercises(iast, rand));
  for (const id of lesson.vocab ?? []) {
    const v = vocabById(id);
    if (v) add(vocabExercises(v, rand, { audio }));
  }
  for (const spec of lesson.drills ?? []) add(drillExercises(spec, rand));
  for (const id of lesson.sentences ?? []) add(sentenceExercises(id, rand));
  if (lesson.passage) add(passageExercises(lesson.passage, rand));

  const target = opts.target ?? (lesson.kind === 'checkpoint' ? 16 : 14);

  /* If a lesson's own material is thin — a short explanatory point, say — top it
     up with vocabulary that shares its tags, so every lesson is a full session
     rather than a page with two questions after it. */
  const MINIMUM = 8;
  if (practice.length < MINIMUM) {
    /* Prefer the words that actually occur in this lesson's own sentences and
       passage — drilling those is revision of the lesson, not filler. */
    const glossed = [
      ...(lesson.sentences ?? []).flatMap((id) => sentenceById(id)?.words ?? []),
      ...(passageById(lesson.passage ?? '')?.lines.flatMap((l) => l.words) ?? []),
    ].map((w) => w.lemma).filter((x): x is string => !!x);

    const tagged = new Set((lesson.grammar ?? []).flatMap((id) => grammarById(id)?.tags ?? []));
    const candidates = uniqueBy(
      [
        ...glossed.map((id) => vocabById(id)).filter((v): v is Vocab => !!v),
        ...VOCAB.filter((v) => v.tags.some((t) => tagged.has(t))),
        ...VOCAB.filter((v) => v.tags.includes('core')),
      ],
      (v) => v.id,
    ).filter((v) => !(lesson.vocab ?? []).includes(v.id));

    for (const v of candidates) {
      if (practice.length >= MINIMUM) break;
      add(vocabExercises(v, rand, { audio }));
    }
  }

  const review = shuffle(opts.dueCards ?? [], rand)
    .slice(0, 4)
    .flatMap((c) => exercisesForCard(c, rand, audio).filter(isGraded).slice(0, 1));

  const chosen = shuffle(practice, rand).slice(0, Math.max(0, target - review.length));
  const body = shuffle([...chosen, ...review], rand);

  /* A teaching card must come before the first exercise that tests it. */
  const seen = new Set<CardId>();
  const out: Exercise[] = [];
  const teachByCard = new Map(teaching.map((t) => [t.card, t]));
  for (const ex of body) {
    const teach = teachByCard.get(ex.card);
    if (teach && !seen.has(ex.card)) {
      out.push(teach);
      seen.add(ex.card);
    }
    out.push(ex);
  }
  return out;
}

/** A pure review session: only cards the scheduler says are due. */
export function buildReview(dueCards: CardId[], opts: SessionOptions = { audio: false }): Exercise[] {
  const rand = seededRandom(opts.seed ?? Date.now());
  const target = opts.target ?? 20;
  const out: Exercise[] = [];
  for (const card of dueCards) {
    if (out.length >= target) break;
    const options = exercisesForCard(card, rand, opts.audio).filter(isGraded);
    if (!options.length) continue;
    out.push(options[Math.floor(rand() * options.length)]);
  }
  return out;
}

/** Practice built only from the student's weakest material. */
export function buildTargetedPractice(
  cards: CardId[], opts: SessionOptions = { audio: false },
): Exercise[] {
  return buildReview(cards, { ...opts, target: opts.target ?? 15 });
}

/** Syllable breakdown used by the pronunciation and chanting screens. */
export function chantingBreakdown(pali: string): { text: string; heavy: boolean }[] {
  return syllabify(pali).map((s) => ({ text: s.text, heavy: s.heavy }));
}
