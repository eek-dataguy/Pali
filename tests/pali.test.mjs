import test from 'node:test';
import assert from 'node:assert/strict';
import { toKhmer, syllabify, paliEquals, looseKey, khmerNumber } from '../src/lib/pali.ts';

/**
 * The transliterator is checked against spellings as they are actually printed
 * in Khmer-script editions of the Tipitaka. If one of these regresses, students
 * would be taught to read scripture wrongly, so they are pinned exactly.
 */
test('renders standard Khmer-script spellings', () => {
  const expected = {
    buddha: 'ពុទ្ធ',
    dhamma: 'ធម្ម',
    'saṅgha': 'សង្ឃ',
    'kammaṭṭhāna': 'កម្មដ្ឋាន',
    'satipaṭṭhāna': 'សតិបដ្ឋាន',
    'viññāṇa': 'វិញ្ញាណ',
    'nibbāna': 'និព្ពាន',
    'mettā': 'មេត្តា',
    indriya: 'ឥន្ទ្រិយ',
    'ñāṇa': 'ញាណ',
  };
  for (const [iast, khmer] of Object.entries(expected)) {
    assert.equal(toKhmer(iast), khmer, `${iast} should render as ${khmer}`);
  }
});

test('word-initial vowels use independent letters', () => {
  assert.equal(toKhmer('arahaṃ'), 'អរហំ');
  assert.equal(toKhmer('iti'), 'ឥតិ');
  assert.equal(toKhmer('evaṃ'), 'ឯវំ');
});

test('niggahita marks the accusative singular', () => {
  assert.equal(toKhmer('buddhaṃ'), 'ពុទ្ធំ');
  assert.equal(toKhmer('buddhaṃ saraṇaṃ gacchāmi'), 'ពុទ្ធំ សរណំ គច្ឆាមិ');
});

test('sentences close with the Khmer khan, not a dot', () => {
  assert.equal(toKhmer('Evaṃ me sutaṃ.'), 'ឯវំ មេ សុតំ។');
});

test('syllables are marked heavy or light for metre', () => {
  const syllables = syllabify('anicca');
  assert.deepEqual(syllables.map((s) => s.heavy), [false, true, false]);
});

test('a syllable keeps the consonant that closes it', () => {
  // Metre depends on closed syllables, so dhammā must read dham-mā, not dha-mā.
  assert.deepEqual(syllabify('dhammā').map((s) => s.text), ['dham', 'mā']);
  assert.deepEqual(syllabify('anicca').map((s) => s.text), ['a', 'nic', 'ca']);
  assert.deepEqual(
    syllabify('manopubbaṅgamā').map((s) => s.text),
    ['ma', 'no', 'pub', 'baṅ', 'ga', 'mā'],
  );
  assert.deepEqual(syllabify('sutaṃ').map((s) => s.text), ['su', 'taṃ']);
});

test('answers are accepted without diacritics or in Khmer script', () => {
  assert.ok(paliEquals('gacchāmi', 'gacchami'));
  assert.ok(paliEquals('dhammaṃ', 'dhammam'));
  assert.ok(paliEquals('buddha', 'ពុទ្ធ'));
  assert.ok(!paliEquals('buddha', 'buddho'), 'a different inflected form is not the same answer');
});

test('loose matching folds every Pali diacritic', () => {
  assert.equal(looseKey('saṅghaṃ'), 'sangham');
  assert.equal(looseKey('ṭhāna'), 'thana');
});

test('numbers render in Khmer numerals', () => {
  assert.equal(khmerNumber(2569), '២៥៦៩');
});

test('speech similarity is a hint, not a verdict', async () => {
  const { similarity } = await import('../src/lib/speech.ts');
  assert.equal(similarity('buddha', 'buddha'), 1);
  assert.ok(similarity('buddha', 'budha') > 0.7);
  assert.ok(similarity('buddha', 'xyzzy') < 0.3);
  assert.equal(similarity('buddha', ''), 0);
});
