# រៀនបាលី — Pali for Khmer speakers

A Duolingo-style web app for learning Pali **through Khmer**, from the first
letter to reading the Tipitaka, the commentaries and the Abhidhamma unaided.

Pali has no script of its own. In Cambodia it is written in Khmer script, and
that is what a student actually meets in a ព្រះត្រៃបិដក — so every word here is
shown in Khmer script and in IAST romanisation, and the learner chooses which.

## Why it is built this way

**It starts with what you already chant.** Unit 3 — before any grammar — is
នមោ តស្ស, សរណគមន៍ and សីល ៥. A student who already knows the *sound* of these
gets their first experience of *understanding* Pali within about fifteen
minutes. That is what brings someone back on day two.

**Nothing is hand-authored twice.** A word is stored once as a citation form;
the morphology engine derives all sixteen noun forms and thirty verb forms from
it. So the practice engine has an unlimited supply of drills, the grammar
tables can never disagree with the exercises built from them, and adding one
dictionary entry adds it to every drill type it can support.

**Repetition is scheduled, not guessed.** Every memorable thing — a letter, a
word, a case ending, a line of a sutta — is one card in a spaced-repetition
scheduler. Answer speed becomes the grade, so a hesitant correct answer comes
back sooner than a confident one. As the review backlog grows, the intake of
new cards automatically shrinks; drowning in reviews three weeks in is the
usual reason people abandon an SRS app.

**Participles come early.** Absolutives and past participles (`-tvā`, `-ta`)
arrive at unit 10, well before they would in a traditional syllabus, because
they are what sutta prose is actually made of. Long sentences in the Dīgha
Nikāya are chains of absolutives ending in one main verb; once you can see
that, the Canon opens.

## What is in it

| | |
|---|---|
| Units / lessons | 20 units, 81 lessons, five levels (មូលដ្ឋាន → កម្រិតខ្ពស់) |
| Dictionary | 280 entries with Khmer and English glosses |
| Grammar | 34 points in Khmer, using traditional terms (បឋមាវិភត្តិ, បុព្វកិរិយា…) |
| Reading | 10 texts, glossed word by word with a full grammatical parse |
| Exercises | 1,061 generated across the course, plus unlimited drill generation |
| Paradigms | 15 noun classes, 5 tenses × 6 persons, participles, 8 pronoun tables |

The reading corpus runs from នមោ តស្ស through Dhammapada 1 and 183, the
Maṅgala and Mettā Suttas, and the first noble truth from the
Dhammacakkappavattana Sutta, to a commentarial definition and the opening
verse of the Abhidhammatthasaṅgaha.

## Exercise types

Recognition and production multiple choice · Khmer-script ↔ romanisation ·
free typing (diacritics optional, Khmer script accepted) · listening ·
sentence building from word tiles · cloze · grammatical parsing
("which case is ភិក្ខូនំ?") · generated declension and conjugation drills ·
metre drills (គរុ / លហុ).

## Personalisation

- A placement check so an experienced reader is not made to grind the alphabet.
- Daily goal, new-cards-per-day, and script preference, all adjustable.
- Weak-area practice built from the tags you actually get wrong.
- Wrong answers return to the end of the session, so a lesson cannot be
  finished while something in it is still unlearned.

## Running it

```bash
npm install
npm run dev        # development server
npm run build      # typecheck + production build to dist/
npm run preview    # serve the built site
npm test           # unit tests for the script, morphology and SRS engines
```

## Privacy

Everything is local-first. There is no account and no server: progress lives in
the browser's storage, and can be exported to JSON and imported on another
device. That keeps the app free to host, private by construction, and usable
offline — which matters in a temple with poor connectivity.

## A note on the audio

No browser ships a Pali voice. Listening exercises borrow the nearest available
Indic voice, which renders Pali syllables far better than an English one but is
still an approximation, and the app says so where it matters. **Take your
teacher's recitation as authoritative, not the synthesiser.**

## Licence and sources

The Pali texts are from the Pali Canon and are in the public domain. The Khmer
translations, glosses and grammatical notes were written for this app and
follow standard Khmer temple grammar terminology; corrections from teachers are
very welcome.
