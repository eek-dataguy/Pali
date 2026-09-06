import test from 'node:test';
import assert from 'node:assert/strict';
import { judge, hasAnswer, NO_ANSWER } from '../src/lib/judge.ts';
import { buildLesson, isGraded } from '../src/lib/exercises.ts';
import { LESSONS, LESSON_BY_ID } from '../src/content/curriculum.ts';

const choice = {
  kind: 'choice', id: 'x', card: 'c', tags: [],
  prompt: 'p', options: [{ text: 'a' }, { text: 'b' }, { text: 'c' }], answers: [1],
};

test('no answer is not gradable', () => {
  assert.equal(hasAnswer(NO_ANSWER), false);
  assert.equal(hasAnswer({ kind: 'text', value: '   ' }), false);
  assert.equal(hasAnswer({ kind: 'bank', order: [] }), false);
  assert.equal(hasAnswer({ kind: 'choice', index: 0 }), true);
});

test('a chosen option is graded against the answer key', () => {
  assert.equal(judge(choice, { kind: 'choice', index: 1 }), true);
  assert.equal(judge(choice, { kind: 'choice', index: 0 }), false);
  assert.equal(judge(choice, NO_ANSWER), false);
});

test('every key of a multi-answer exercise is accepted', () => {
  const shared = { ...choice, answers: [0, 2] };
  assert.equal(judge(shared, { kind: 'choice', index: 0 }), true);
  assert.equal(judge(shared, { kind: 'choice', index: 2 }), true);
  assert.equal(judge(shared, { kind: 'choice', index: 1 }), false);
});

test('typed Pali is accepted without diacritics and in Khmer script', () => {
  const typed = {
    kind: 'type', id: 'x', card: 'c', tags: [],
    prompt: 'p', answer: 'buddhaṃ', accept: ['buddhaṃ', 'ពុទ្ធំ'], isPali: true,
  };
  assert.equal(judge(typed, { kind: 'text', value: 'buddhaṃ' }), true);
  assert.equal(judge(typed, { kind: 'text', value: 'buddham' }), true);
  assert.equal(judge(typed, { kind: 'text', value: ' ពុទ្ធំ ' }), true);
  assert.equal(judge(typed, { kind: 'text', value: 'buddho' }), false);
});

test('a word bank must be in the right order', () => {
  const bank = {
    kind: 'wordbank', id: 'x', card: 'c', tags: [],
    prompt: 'p', answer: ['ខ្ញុំ', 'ទៅ'], bank: ['ទៅ', 'ខ្ញុំ'],
  };
  assert.equal(judge(bank, { kind: 'bank', order: [1, 0] }), true);
  assert.equal(judge(bank, { kind: 'bank', order: [0, 1] }), false);
});

test('recitation is graded by the learner\'s own judgement', () => {
  const spoken = {
    kind: 'speak', id: 'x', card: 'c', tags: [],
    text: 'buddhaṃ saraṇaṃ gacchāmi', meaning: 'm', syllables: [],
  };
  assert.equal(judge(spoken, { kind: 'spoken', confident: true }), true);
  assert.equal(judge(spoken, { kind: 'spoken', confident: false }), false);
  assert.equal(hasAnswer({ kind: 'spoken', confident: false }), true, 'a "not yet" answer is still an answer');
});

test('teaching cards always pass, so they never block a session', () => {
  assert.equal(judge({ kind: 'teach', id: 't', card: 'c', tags: [], heading: 'h', notes: [] }, NO_ANSWER), true);
});

/**
 * The guarantee that matters: for every exercise the course can generate there
 * exists an answer that grades as correct. Without this a learner could be
 * trapped on a question that can never be satisfied.
 */
test('every generated exercise has a reachable correct answer', () => {
  let checked = 0;
  for (const lesson of LESSONS) {
    for (const ex of buildLesson(lesson, { audio: true, speaking: true, seed: 42 })) {
      if (!isGraded(ex)) continue;
      checked++;
      let solved = false;
      if (ex.kind === 'choice' || ex.kind === 'listen') {
        solved = ex.answers.some((i) => judge(ex, { kind: 'choice', index: i }));
      } else if (ex.kind === 'type') {
        solved = judge(ex, { kind: 'text', value: ex.answer });
      } else if (ex.kind === 'wordbank') {
        const order = ex.answer.map((w) => ex.bank.indexOf(w));
        solved = !order.includes(-1) && judge(ex, { kind: 'bank', order });
      } else if (ex.kind === 'speak') {
        solved = judge(ex, { kind: 'spoken', confident: true });
      }
      assert.ok(solved, `${ex.id} (${ex.kind}) has no reachable correct answer`);
    }
  }
  assert.ok(checked > 900, `expected the whole course to be checked, saw ${checked}`);
});

test('a lesson always contains enough practice to be worth doing', () => {
  for (const lesson of LESSONS) {
    const graded = buildLesson(lesson, { audio: false, seed: 7 }).filter(isGraded).length;
    assert.ok(graded >= 8, `${lesson.id} generated only ${graded} graded exercises`);
  }
});

test('a lesson is generated deterministically from its seed', () => {
  const a = buildLesson(LESSON_BY_ID.get('l4_2'), { audio: false, seed: 5 });
  const b = buildLesson(LESSON_BY_ID.get('l4_2'), { audio: false, seed: 5 });
  assert.deepEqual(a.map((x) => x.id), b.map((x) => x.id));
});

test('an exercise retried too often stops coming back', async () => {
  const { shouldRequeue, maxSessionLength, MAX_RETRIES } = await import('../src/lib/judge.ts');
  assert.equal(shouldRequeue(0), true, 'a first miss returns');
  assert.equal(shouldRequeue(MAX_RETRIES - 1), true);
  assert.equal(shouldRequeue(MAX_RETRIES), false, 'past the cap it is left to the scheduler');
  // Termination: a session cannot exceed this many questions however badly it goes.
  assert.equal(maxSessionLength(14), 42);
});
