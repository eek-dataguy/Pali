import test from 'node:test';
import assert from 'node:assert/strict';
import { VOCAB, VOCAB_BY_ID } from '../src/content/vocab.ts';
import { SENTENCES, SENTENCE_BY_ID } from '../src/content/sentences.ts';
import { PASSAGES, PASSAGE_BY_ID } from '../src/content/passages.ts';
import { GRAMMAR, GRAMMAR_BY_ID } from '../src/content/grammar.ts';
import { UNITS, LESSONS } from '../src/content/curriculum.ts';
import { ALL_LETTERS, LETTER_BY_IAST } from '../src/content/alphabet.ts';
import { toKhmer } from '../src/lib/pali.ts';

/**
 * Content integrity. A broken reference here would show a learner an empty
 * lesson or a gloss that links nowhere, so these are checked exhaustively
 * rather than by sampling.
 */

test('identifiers are unique across every collection', () => {
  for (const [name, items] of [
    ['vocab', VOCAB], ['sentences', SENTENCES], ['passages', PASSAGES],
    ['grammar', GRAMMAR], ['lessons', LESSONS], ['units', UNITS],
  ]) {
    const ids = items.map((x) => x.id);
    assert.equal(new Set(ids).size, ids.length, `${name} has duplicate ids`);
  }
});

test('dictionary entries are well formed', () => {
  for (const v of VOCAB) {
    assert.match(v.id, /^[a-z0-9_]+$/, `${v.id} is not a clean identifier`);
    assert.ok(v.pali.trim(), `${v.id} has no Pali`);
    assert.ok(v.km.trim(), `${v.id} has no Khmer gloss`);
    assert.ok(v.tags.length > 0, `${v.id} has no tags`);
    if (v.pos === 'noun') assert.ok(v.decl && v.gender, `${v.id} is a noun without a paradigm`);
    if (v.pos === 'verb') assert.ok(v.stem, `${v.id} is a verb without a stem`);
  }
});

test('every gloss lemma resolves to a dictionary entry', () => {
  const lemmas = [
    ...SENTENCES.flatMap((s) => s.words.map((w) => w.lemma)),
    ...PASSAGES.flatMap((p) => p.lines.flatMap((l) => l.words.map((w) => w.lemma))),
  ].filter(Boolean);
  for (const lemma of lemmas) {
    assert.ok(VOCAB_BY_ID.has(lemma), `gloss references unknown lemma "${lemma}"`);
  }
  assert.ok(lemmas.length > 100);
});

test('every lesson reference resolves', () => {
  for (const lesson of LESSONS) {
    for (const id of lesson.vocab ?? []) assert.ok(VOCAB_BY_ID.has(id), `${lesson.id} -> vocab ${id}`);
    for (const id of lesson.grammar ?? []) assert.ok(GRAMMAR_BY_ID.has(id), `${lesson.id} -> grammar ${id}`);
    for (const id of lesson.sentences ?? []) assert.ok(SENTENCE_BY_ID.has(id), `${lesson.id} -> sentence ${id}`);
    if (lesson.passage) assert.ok(PASSAGE_BY_ID.has(lesson.passage), `${lesson.id} -> passage ${lesson.passage}`);
    for (const l of lesson.letters ?? []) assert.ok(LETTER_BY_IAST.has(l), `${lesson.id} -> letter ${l}`);
  }
});

test('grammar examples point at real sentences', () => {
  for (const g of GRAMMAR) {
    for (const id of g.examples ?? []) assert.ok(SENTENCE_BY_ID.has(id), `${g.id} -> ${id}`);
  }
});

test('the alphabet is the traditional 41 sounds', () => {
  assert.equal(ALL_LETTERS.length, 41);
  assert.equal(ALL_LETTERS.filter((l) => l.kind === 'vowel').length, 8);
});

test('every Pali string transliterates to Khmer script without leaving Latin behind', () => {
  const strings = [
    ...VOCAB.map((v) => v.pali),
    ...SENTENCES.map((s) => s.pali),
    ...PASSAGES.flatMap((p) => p.lines.map((l) => l.pali)),
  ];
  for (const s of strings) {
    const khmer = toKhmer(s);
    assert.ok(khmer.length > 0, `"${s}" produced nothing`);
    assert.ok(!/[a-zA-Z]/.test(khmer), `"${s}" left Latin letters in "${khmer}"`);
  }
});

test('passage glosses cover the words of their line', () => {
  for (const p of PASSAGES) {
    for (const line of p.lines) {
      assert.ok(line.words.length > 0, `${p.id} has an unglossed line`);
      assert.ok(line.km.trim(), `${p.id} has an untranslated line`);
    }
  }
});

test('the path runs from foundations to advanced without gaps', () => {
  const levels = UNITS.map((u) => u.level);
  assert.deepEqual([...new Set(levels)], ['A', 'B', 'C', 'D', 'E']);
  for (const unit of UNITS) {
    assert.ok(unit.lessons.length > 0, `${unit.id} has no lessons`);
    assert.ok(unit.kmTitle.trim() && unit.kmGoal.trim(), `${unit.id} is missing Khmer copy`);
  }
  assert.ok(LESSONS.length >= 80);
});
