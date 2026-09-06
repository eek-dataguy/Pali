import test from 'node:test';
import assert from 'node:assert/strict';
import { newCard, review, isDue, mastery, gradeFromAnswer, DAY } from '../src/lib/srs.ts';

const fixed = () => 0.5; // disable interval fuzz so intervals are exact

test('a new card graduates through the learning steps', () => {
  let c = newCard('x');
  const now = Date.now();
  c = review(c, 2, now, fixed);
  assert.equal(c.state, 'learning');
  c = review(c, 2, now, fixed);
  assert.equal(c.state, 'review');
  assert.equal(c.interval, 1);
});

test('intervals grow as the card is recalled', () => {
  let c = newCard('x');
  let t = Date.now();
  for (let i = 0; i < 4; i++) { c = review(c, 2, t, fixed); t = c.due; }
  assert.ok(c.interval > 3, `interval should expand, got ${c.interval}`);
});

test('a lapse sends the card back to relearning and lowers ease', () => {
  let c = newCard('x');
  let t = Date.now();
  c = review(c, 2, t, fixed); c = review(c, 2, c.due, fixed);
  const easeBefore = c.ease;
  c = review(c, 0, c.due, fixed);
  assert.equal(c.state, 'relearning');
  assert.equal(c.lapses, 1);
  assert.ok(c.ease < easeBefore);
});

test('answering easy skips ahead further than good', () => {
  const start = newCard('x');
  const now = Date.now();
  const good = review(review(start, 2, now, fixed), 2, now, fixed);
  const easy = review(start, 3, now, fixed);
  assert.ok(easy.interval > good.interval);
});

test('due dates are respected', () => {
  const now = Date.now();
  let c = review(review(newCard('x'), 2, now, fixed), 2, now, fixed);
  assert.ok(!isDue(c, now));
  assert.ok(isDue(c, now + 2 * DAY));
});

test('a new card is never counted as due', () => {
  assert.ok(!isDue(newCard('x')));
});

test('speed of a correct answer decides the grade', () => {
  assert.equal(gradeFromAnswer(true, 1000), 3);
  assert.equal(gradeFromAnswer(true, 8000), 2);
  assert.equal(gradeFromAnswer(true, 20000), 1);
  assert.equal(gradeFromAnswer(false, 500), 0);
  assert.equal(gradeFromAnswer(true, 500, true), 1, 'a hint caps the grade');
});

test('mastery rises from zero for an unseen card', () => {
  assert.equal(mastery(newCard('x')), 0);
  let c = newCard('x'); const now = Date.now();
  c = review(c, 2, now, fixed); c = review(c, 2, now, fixed);
  assert.ok(mastery(c) > 0);
});
