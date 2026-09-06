import test from 'node:test';
import assert from 'node:assert/strict';
import { declineNoun, conjugate, CASES } from '../src/lib/morphology.ts';

test('the a-stem masculine paradigm is complete and correct', () => {
  const t = declineNoun('buddha', 'a', 'm');
  assert.equal(t.nom.sg[0], 'buddho');
  assert.equal(t.acc.sg[0], 'buddhaṃ');
  assert.equal(t.ins.sg[0], 'buddhena');
  assert.equal(t.gen.sg[0], 'buddhassa');
  assert.equal(t.loc.sg[0], 'buddhe');
  assert.equal(t.nom.pl[0], 'buddhā');
  assert.equal(t.acc.pl[0], 'buddhe');
  assert.equal(t.dat.pl[0], 'buddhānaṃ');
  assert.equal(t.loc.pl[0], 'buddhesu');
  for (const c of CASES) {
    assert.ok(t[c].sg.length > 0 && t[c].pl.length > 0, `${c} must have both numbers`);
  }
});

test('bhikkhu has the vocative plural used to open a sutta', () => {
  assert.deepEqual(declineNoun('bhikkhu', 'u', 'm').voc.pl, ['bhikkhave', 'bhikkhavo']);
});

test('the -vant stems produce bhagavā, not bhagavaā', () => {
  const t = declineNoun('bhagavant', 'vant', 'm');
  assert.equal(t.nom.sg[0], 'bhagavā');
  assert.equal(t.acc.sg[0], 'bhagavantaṃ');
  assert.equal(t.ins.sg[0], 'bhagavatā');
  assert.equal(t.gen.sg[0], 'bhagavato');
  assert.equal(t.loc.sg[0], 'bhagavati');
});

test('irregular nouns are listed rather than derived', () => {
  const t = declineNoun('rājan', 'irregular', 'm');
  assert.equal(t.nom.sg[0], 'rājā');
  assert.equal(t.ins.sg[0], 'raññā');
  assert.equal(t.gen.sg[0], 'rañño');
});

test('feminine ā-stems share one form across four cases', () => {
  const t = declineNoun('kaññā', 'ā', 'f');
  assert.equal(t.nom.sg[0], 'kaññā');
  assert.equal(t.acc.sg[0], 'kaññaṃ');
  for (const c of ['ins', 'dat', 'abl', 'gen']) {
    assert.equal(t[c].sg[0], 'kaññāya', `${c} singular is kaññāya`);
  }
});

test('the present tense conjugates across all six persons', () => {
  const v = conjugate('gaccha');
  assert.equal(v.pres['3.sg'][0], 'gacchati');
  assert.equal(v.pres['2.sg'][0], 'gacchasi');
  assert.equal(v.pres['1.sg'][0], 'gacchāmi');
  assert.equal(v.pres['3.pl'][0], 'gacchanti');
  assert.equal(v.pres['2.pl'][0], 'gacchatha');
  assert.equal(v.pres['1.pl'][0], 'gacchāma');
});

test('future, optative and imperative are formed correctly', () => {
  const v = conjugate('gaccha');
  assert.equal(v.fut['3.sg'][0], 'gacchissati');
  assert.equal(v.opt['3.sg'][0], 'gaccheyya');
  assert.deepEqual(v.imp['2.sg'], ['gaccha', 'gacchāhi']);
});

test('overrides replace derived forms for irregular verbs', () => {
  const v = conjugate('ho', { 'pres.3.sg': ['hoti'], 'pres.3.pl': ['honti'] });
  assert.equal(v.pres['3.sg'][0], 'hoti');
  assert.equal(v.pres['3.pl'][0], 'honti');
});
