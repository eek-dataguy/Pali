import type { Lesson, Unit } from './types';

/**
 * The learning path.
 *
 * It is ordered by what unlocks reading soonest, not by what is easiest. The
 * chants come third — before any grammar — because a student who already knows
 * the sound of សរណគមន៍ gets their first experience of *understanding* Pali in
 * about fifteen minutes, and that is what makes them come back on day two.
 * Participles and absolutives arrive early (unit 10) for the same reason: they
 * are what sutta prose is actually made of.
 */

const L = (
  id: string, kmTitle: string, title: string, kind: Lesson['kind'], xp: number,
  extra: Partial<Lesson> = {},
): Lesson => ({ id, kmTitle, title, kind, xp, ...extra });

export const UNITS: Unit[] = [
  /* ================================================= កម្រិត A — មូលដ្ឋាន */
  {
    id: 'u1', level: 'A', color: '#ff7f11', icon: '🔤',
    kmTitle: 'អក្សរបាលី ១ — ស្រៈ និងវគ្គដើម',
    title: 'The Pali alphabet 1',
    kmGoal: 'អានស្រៈទាំង ៨ និងព្យញ្ជនៈវគ្គ ក វគ្គ ច ជាអក្សរខ្មែរបាន។',
    lessons: [
      L('l1_1', 'ស្រៈទាំង ៨', 'The eight vowels', 'alphabet', 15,
        { letters: ['a', 'ā', 'i', 'ī', 'u', 'ū', 'e', 'o'], grammar: ['g01', 'g02'] }),
      L('l1_2', 'វគ្គ ក', 'The ka group', 'alphabet', 15,
        { letters: ['k', 'kh', 'g', 'gh', 'ṅ'] }),
      L('l1_3', 'វគ្គ ច', 'The ca group', 'alphabet', 15,
        { letters: ['c', 'ch', 'j', 'jh', 'ñ'] }),
      L('l1_4', 'ត្រួតពិនិត្យ ១', 'Checkpoint 1', 'checkpoint', 25,
        { letters: ['a', 'ā', 'i', 'ī', 'u', 'ū', 'e', 'o', 'k', 'kh', 'g', 'gh', 'ṅ', 'c', 'ch', 'j', 'jh', 'ñ'] }),
    ],
  },
  {
    id: 'u2', level: 'A', color: '#ff7f11', icon: '🔠',
    kmTitle: 'អក្សរបាលី ២ — វគ្គដែលនៅសល់',
    title: 'The Pali alphabet 2',
    kmGoal: 'អានអក្សរបាលីទាំង ៤១ រួមទាំងព្យញ្ជនៈជើង និងនិគ្គហិត។',
    lessons: [
      L('l2_1', 'វគ្គ ដ — មុទ្ធជៈ', 'The retroflex group', 'alphabet', 15,
        { letters: ['ṭ', 'ṭh', 'ḍ', 'ḍh', 'ṇ'] }),
      L('l2_2', 'វគ្គ ត — ទន្តជៈ', 'The dental group', 'alphabet', 15,
        { letters: ['t', 'th', 'd', 'dh', 'n'] }),
      L('l2_3', 'វគ្គ ប', 'The pa group', 'alphabet', 15,
        { letters: ['p', 'ph', 'b', 'bh', 'm'] }),
      L('l2_4', 'អវគ្គ', 'The remaining consonants', 'alphabet', 15,
        { letters: ['y', 'r', 'l', 'v', 's', 'h', 'ḷ'] }),
      L('l2_5', 'ព្យញ្ជនៈជើង និងនិគ្គហិត', 'Clusters and niggahita', 'grammar', 20,
        { letters: ['ṃ'], grammar: ['g03', 'g04'] }),
      L('l2_6', 'ត្រួតពិនិត្យ ២', 'Checkpoint 2', 'checkpoint', 30,
        { letters: ['ṭ', 'ṭh', 'ḍ', 'ḍh', 'ṇ', 't', 'th', 'd', 'dh', 'n', 'p', 'ph', 'b', 'bh', 'm', 'ṃ'] }),
    ],
  },
  {
    id: 'u3', level: 'A', color: '#f0a30a', icon: '🙏',
    kmTitle: 'ពាក្យដែលអ្នកសូត្ររាល់ថ្ងៃ',
    title: 'The words you already chant',
    kmGoal: 'យល់អត្ថន័យរាល់ពាក្យក្នុង នមោ តស្ស, សរណគមន៍ និងសីល ៥។',
    lessons: [
      L('l3_1', 'នមោ តស្ស', 'Namo tassa', 'chant', 25,
        { passage: 'p_namo', vocab: ['namo', 'bhagavant', 'arahant', 'sammasambuddha', 'buddha'] }),
      L('l3_2', 'សរណគមន៍', 'Going for refuge', 'chant', 25,
        { passage: 'p_tisarana', vocab: ['buddha', 'dhamma', 'sangha', 'sarana', 'gacchati'] }),
      L('l3_3', 'សីល ៥', 'The five precepts', 'chant', 25,
        { passage: 'p_pancasila',
          vocab: ['sila', 'sikkhapada', 'veramani', 'panatipata', 'adinnadana', 'musavada', 'samadiyami', 'sura'] }),
      L('l3_4', 'ត្រួតពិនិត្យ ៣', 'Checkpoint 3', 'checkpoint', 35,
        { vocab: ['namo', 'buddha', 'dhamma', 'sangha', 'sarana', 'sila', 'sikkhapada', 'veramani'] }),
    ],
  },
  {
    id: 'u4', level: 'A', color: '#35ac4b', icon: '📖',
    kmTitle: 'ប្រយោគដំបូង',
    title: 'Your first sentences',
    kmGoal: 'អាននិងបង្កើតប្រយោគ កត្តា + កម្ម + កិរិយា ដោយខ្លួនឯង។',
    lessons: [
      L('l4_1', 'អ្នកធ្វើ និងកិរិយា', 'Subject and verb', 'grammar', 20, {
        grammar: ['g05', 'g06', 'g07'],
        vocab: ['nara', 'purisa', 'acariya', 'sissa', 'gacchati', 'dhavati'],
        sentences: ['s001', 's002', 's003'],
        drills: [{ lemma: 'buddha', cases: ['nom'], numbers: ['sg', 'pl'] }],
      }),
      L('l4_2', 'កម្ម — ទុតិយាវិភត្តិ', 'The object', 'grammar', 20, {
        vocab: ['buddha', 'dhamma', 'bhatta', 'puppha', 'deseti', 'vandati', 'passati', 'bhunjati'],
        sentences: ['s010', 's011', 's012', 's013'],
        drills: [{ lemma: 'buddha', cases: ['nom', 'acc'], numbers: ['sg', 'pl'] }],
      }),
      L('l4_3', 'មនុស្សច្រើននាក់', 'Plurals', 'vocab', 20, {
        vocab: ['manussa', 'bhikkhu', 'upasaka', 'darika', 'kassaka', 'aharati', 'pucchati'],
        sentences: ['s014', 's015'],
      }),
      L('l4_4', 'ខ្ញុំ និងអ្នក', 'I and you', 'grammar', 20, {
        vocab: ['amha', 'tumha', 'sunati', 'janati'],
        sentences: ['s004', 's005'],
      }),
      L('l4_5', 'ត្រួតពិនិត្យ ៤', 'Checkpoint 4', 'checkpoint', 40, {
        sentences: ['s001', 's010', 's013', 's015'],
        drills: [{ lemma: 'buddha', cases: ['nom', 'acc'], numbers: ['sg', 'pl'] }],
      }),
    ],
  },

  /* ============================================ កម្រិត B — វេយ្យាករណ៍មូលដ្ឋាន */
  {
    id: 'u5', level: 'B', color: '#268c39', icon: '🏃',
    kmTitle: 'កិរិយាបច្ចុប្បន្នកាល',
    title: 'The present tense',
    kmGoal: 'ប្រែកិរិយាគ្រប់បុរស គ្រប់វចនៈ ហើយស្គាល់ថានរណាជាអ្នកធ្វើ ដោយមើលកន្ទុយពាក្យ។',
    lessons: [
      L('l5_1', 'បុរសទី៣', 'Third person', 'grammar', 20, {
        grammar: ['g08'],
        vocab: ['gacchati', 'passati', 'vasati', 'carati'],
        drills: [{ lemma: 'gacchati', tenses: ['pres'], persons: [3], numbers: ['sg', 'pl'] }],
      }),
      L('l5_2', 'បុរសទី១ និងទី២', 'First and second person', 'grammar', 20, {
        vocab: ['vadati', 'pathati', 'likhati', 'icchati'],
        drills: [{ lemma: 'gacchati', tenses: ['pres'], persons: [1, 2], numbers: ['sg', 'pl'] }],
      }),
      L('l5_3', 'កិរិយាវិសេស — ហោតិ និង អត្ថិ', 'The irregular verbs', 'grammar', 25, {
        vocab: ['hoti', 'atthi', 'karoti', 'deti'],
        drills: [{ lemma: 'hoti', tenses: ['pres'], persons: [1, 2, 3], numbers: ['sg', 'pl'] }],
      }),
      L('l5_4', 'កិរិយាប្រចាំថ្ងៃ', 'Everyday verbs', 'vocab', 20, {
        vocab: ['nisidati', 'titthati', 'sayati', 'pivati', 'pacati', 'labhati', 'harati'],
      }),
      L('l5_5', 'ត្រួតពិនិត្យ ៥', 'Checkpoint 5', 'checkpoint', 40, {
        drills: [{ lemma: 'gacchati', tenses: ['pres'], persons: [1, 2, 3], numbers: ['sg', 'pl'] }],
      }),
    ],
  },
  {
    id: 'u6', level: 'B', color: '#268c39', icon: '🧩',
    kmTitle: 'វិភត្តិទាំង ៨',
    title: 'The eight cases',
    kmGoal: 'ស្គាល់តួនាទីរបស់ពាក្យក្នុងប្រយោគ ដោយមើលកន្ទុយពាក្យតែម្យ៉ាង។',
    lessons: [
      L('l6_1', 'តតិយា — ដោយ, ជាមួយ', 'Instrumental', 'grammar', 20, {
        grammar: ['g11'], vocab: ['saddhim', 'saha', 'hatthi'],
        sentences: ['s022', 's023'],
        drills: [{ lemma: 'buddha', cases: ['ins'], numbers: ['sg', 'pl'] }],
      }),
      L('l6_2', 'ចតុត្ថី — ដល់, សម្រាប់', 'Dative', 'grammar', 20, {
        grammar: ['g12'], sentences: ['s030', 's031'],
        drills: [{ lemma: 'buddha', cases: ['dat'], numbers: ['sg', 'pl'] }],
      }),
      L('l6_3', 'បញ្ចមី — ពី', 'Ablative', 'grammar', 20, {
        grammar: ['g13'], sentences: ['s033'],
        drills: [{ lemma: 'buddha', cases: ['abl'], numbers: ['sg', 'pl'] }],
      }),
      L('l6_4', 'ឆដ្ឋី — របស់', 'Genitive', 'grammar', 20, {
        grammar: ['g14'], sentences: ['s032', 's064'],
        drills: [{ lemma: 'buddha', cases: ['gen'], numbers: ['sg', 'pl'] }],
      }),
      L('l6_5', 'សត្តមី — ក្នុង, លើ', 'Locative', 'grammar', 20, {
        grammar: ['g15'], vocab: ['gama', 'vana', 'nagara', 'ghara'],
        sentences: ['s020', 's021'],
        drills: [{ lemma: 'buddha', cases: ['loc'], numbers: ['sg', 'pl'] }],
      }),
      L('l6_6', 'អាលបនៈ — ការហៅ', 'Vocative', 'grammar', 20, {
        grammar: ['g16'], vocab: ['bhikkhu'],
        drills: [{ lemma: 'bhikkhu', cases: ['voc', 'nom'], numbers: ['sg', 'pl'] }],
      }),
      L('l6_7', 'ត្រួតពិនិត្យ ៦ — វិភត្តិទាំង ៨', 'Checkpoint: all eight cases', 'checkpoint', 50, {
        drills: [
          { lemma: 'buddha', cases: ['nom', 'acc', 'ins', 'dat', 'abl', 'gen', 'loc', 'voc'], numbers: ['sg', 'pl'] },
        ],
      }),
    ],
  },
  {
    id: 'u7', level: 'B', color: '#216e30', icon: '⚖️',
    kmTitle: 'លិង្គទាំង ៣ និងក្រុមនាម',
    title: 'Genders and stem classes',
    kmGoal: 'ប្រែនាមគ្រប់ក្រុម៖ អ, អា, ឥ, ឦ, ឧ ទាំងបុល្លិង្គ ឥត្ថីលិង្គ និងនបុំសកលិង្គ។',
    lessons: [
      L('l7_1', 'នបុំសកលិង្គ', 'Neuter nouns', 'grammar', 20, {
        grammar: ['g09'], vocab: ['rupa', 'citta', 'kamma', 'phala', 'punna', 'dana'],
        drills: [{ lemma: 'rūpa', cases: ['nom', 'acc'], numbers: ['sg', 'pl'] }],
      }),
      L('l7_2', 'ឥត្ថីលិង្គ អា-ការន្ត', 'Feminine ā-stems', 'grammar', 20, {
        grammar: ['g10'], vocab: ['kanna', 'metta', 'panna', 'saddha', 'karuna', 'vaca'],
        drills: [{ lemma: 'kaññā', cases: ['nom', 'acc', 'ins', 'loc'], numbers: ['sg', 'pl'] }],
      }),
      L('l7_3', 'ឥ-ការន្ត និង ឧ-ការន្ត', 'i-stems and u-stems', 'grammar', 25, {
        grammar: ['g17'], vocab: ['bhikkhu', 'muni', 'aggi', 'hetu', 'cakkhu', 'jati', 'sati', 'nadi'],
        drills: [{ lemma: 'bhikkhu', cases: ['nom', 'acc', 'gen', 'loc'], numbers: ['sg', 'pl'] }],
      }),
      L('l7_4', 'ត្រួតពិនិត្យ ៧', 'Checkpoint 7', 'checkpoint', 45, {
        drills: [
          { lemma: 'rūpa', cases: ['nom', 'acc'], numbers: ['sg', 'pl'] },
          { lemma: 'kaññā', cases: ['nom', 'ins'], numbers: ['sg', 'pl'] },
          { lemma: 'bhikkhu', cases: ['nom', 'voc'], numbers: ['sg', 'pl'] },
        ],
      }),
    ],
  },
  {
    id: 'u8', level: 'B', color: '#216e30', icon: '👑',
    kmTitle: 'នាមពិសេស និងសព្វនាម',
    title: 'Special nouns and pronouns',
    kmGoal: 'អានពាក្យហៅព្រះពុទ្ធ (ភគវា, សត្ថា) និងសព្វនាមទាំងអស់ដោយស្ទាត់។',
    lessons: [
      L('l8_1', 'អរ-ការន្ត — សត្ថា, បិតា', 'The -ar nouns', 'grammar', 25, {
        grammar: ['g18'], vocab: ['satthar', 'pitar', 'mata_f', 'bhatar', 'dhita'],
        drills: [{ lemma: 'satthar', cases: ['nom', 'acc', 'ins', 'gen'], numbers: ['sg', 'pl'] }],
      }),
      L('l8_2', 'ភគវន្តុ', 'The -vant stems', 'grammar', 25, {
        grammar: ['g19'], vocab: ['bhagavant', 'satimant', 'gunavant'],
        sentences: ['s071', 's072'],
        drills: [{ lemma: 'bhagavant', cases: ['nom', 'acc', 'ins', 'gen', 'loc'], numbers: ['sg', 'pl'] }],
      }),
      L('l8_3', 'សព្វនាម', 'Pronouns', 'grammar', 25, {
        grammar: ['g20'], vocab: ['ta_m', 'ta_f', 'ima_m', 'ya_m', 'ka_m'],
        sentences: ['s043'],
      }),
      L('l8_4', 'នាមវិសេស — រាជា, អត្តា', 'Irregular nouns', 'vocab', 20, {
        vocab: ['raja', 'attan', 'mana'], sentences: ['s064'],
        drills: [{ lemma: 'rājan', cases: ['nom', 'acc', 'ins', 'gen'], numbers: ['sg', 'pl'] }],
      }),
      L('l8_5', 'ត្រួតពិនិត្យ ៨', 'Checkpoint 8', 'checkpoint', 45, {
        drills: [
          { lemma: 'bhagavant', cases: ['nom', 'acc', 'gen'], numbers: ['sg'] },
          { lemma: 'satthar', cases: ['nom', 'acc'], numbers: ['sg', 'pl'] },
        ],
      }),
    ],
  },

  /* ================================================ កម្រិត C — កម្រិតកណ្តាល */
  {
    id: 'u9', level: 'C', color: '#0ea5e9', icon: '⏳',
    kmTitle: 'កាលទាំងឡាយ',
    title: 'Tenses and moods',
    kmGoal: 'ប្រែកិរិយាបាន ៥ កាល ហើយយល់បទបួងសួង «សូមឲ្យ…» ជាភាសាបាលី។',
    lessons: [
      L('l9_1', 'អនាគតកាល', 'Future', 'grammar', 25, {
        grammar: ['g21'], sentences: ['s040'],
        drills: [{ lemma: 'gacchati', tenses: ['fut'], persons: [1, 3], numbers: ['sg', 'pl'] }],
      }),
      L('l9_2', 'អតីតកាល', 'Past', 'grammar', 25, {
        grammar: ['g22'], sentences: ['s041'],
        drills: [{ lemma: 'gacchati', tenses: ['aor'], persons: [1, 3], numbers: ['sg', 'pl'] }],
      }),
      L('l9_3', 'បញ្ជា — ចូរ, សូមឲ្យ', 'Imperative', 'grammar', 25, {
        grammar: ['g23'], sentences: ['s042'],
        drills: [{ lemma: 'hoti', tenses: ['imp'], persons: [2, 3], numbers: ['sg', 'pl'] }],
      }),
      L('l9_4', 'សត្តមី — គប្បី, បើ', 'Optative', 'grammar', 25, {
        vocab: ['sace'], sentences: ['s043'],
        drills: [{ lemma: 'gacchati', tenses: ['opt'], persons: [1, 3], numbers: ['sg', 'pl'] }],
      }),
      L('l9_5', 'ត្រួតពិនិត្យ ៩', 'Checkpoint 9', 'checkpoint', 50, {
        drills: [{ lemma: 'gacchati', tenses: ['pres', 'fut', 'aor', 'imp', 'opt'], persons: [1, 3], numbers: ['sg', 'pl'] }],
      }),
    ],
  },
  {
    id: 'u10', level: 'C', color: '#0284c7', icon: '🔑',
    kmTitle: 'កិរិយាកិត្តកៈ — កូនសោនៃព្រះសូត្រ',
    title: 'Participles — the key to sutta prose',
    kmGoal: 'បំបែកប្រយោគវែងក្នុងព្រះសូត្រជាឃ្លាតូចៗ ដោយស្គាល់ -ត្វា, -ត, -តុំ, -ន្ត។',
    lessons: [
      L('l10_1', 'កិរិយាអតីត (-ត)', 'Past participle', 'grammar', 30, {
        grammar: ['g24'], sentences: ['s053', 's070'],
      }),
      L('l10_2', 'បុព្វកិរិយា (-ត្វា)', 'Absolutive', 'grammar', 30, {
        grammar: ['g25'], sentences: ['s050', 's051'],
      }),
      L('l10_3', 'និមិត្តកិរិយា (-តុំ)', 'Infinitive', 'grammar', 25, {
        grammar: ['g26'], sentences: ['s054'],
      }),
      L('l10_4', 'បច្ចុប្បន្នកិរិយា (-ន្ត)', 'Present participle', 'grammar', 30, {
        grammar: ['g27'], sentences: ['s052'],
        drills: [{ lemma: 'gacchant', cases: ['nom', 'acc', 'gen'], numbers: ['sg', 'pl'] }],
      }),
      L('l10_5', 'ត្រួតពិនិត្យ ១០', 'Checkpoint 10', 'checkpoint', 55, {
        sentences: ['s050', 's051', 's052', 's053', 's054'],
      }),
    ],
  },
  {
    id: 'u11', level: 'C', color: '#0284c7', icon: '🪢',
    kmTitle: 'សមាស',
    title: 'Compounds',
    kmGoal: 'បំបែកសមាសវែងៗ ដូចអដ្ឋកថាធ្វើ។',
    lessons: [
      L('l11_1', 'សមាស ៦ ប្រភេទ', 'The six compounds', 'grammar', 30, { grammar: ['g29'] }),
      L('l11_2', 'បំបែកសមាសក្នុងសីល ៥', 'Compounds in the precepts', 'reading', 30, {
        passage: 'p_pancasila',
      }),
      L('l11_3', 'ត្រួតពិនិត្យ ១១', 'Checkpoint 11', 'checkpoint', 45, {
        vocab: ['namarupa', 'salayatana', 'sikkhapada', 'panatipata', 'adinnadana'],
      }),
    ],
  },
  {
    id: 'u12', level: 'C', color: '#0369a1', icon: '🔗',
    kmTitle: 'សន្ធិ និងកម្មវាចក',
    title: 'Sandhi and the passive',
    kmGoal: 'ស្តារពាក្យដើមឡើងវិញ ពេលពាក្យពីរបានភ្ជាប់គ្នា — ជំនាញចាំបាច់សម្រាប់វចនានុក្រម។',
    lessons: [
      L('l12_1', 'សន្ធិស្រៈ និងនិគ្គហិត', 'Vowel and niggahita sandhi', 'grammar', 30, {
        grammar: ['g30'], sentences: ['s072'],
      }),
      L('l12_2', 'កម្មវាចក និងកិច្ចកិរិយា', 'Passive and gerundive', 'grammar', 30, {
        grammar: ['g28'], sentences: ['s053', 's063'],
      }),
      L('l12_3', 'ត្រួតពិនិត្យ ១២', 'Checkpoint 12', 'checkpoint', 50, {
        sentences: ['s053', 's063', 's072'],
      }),
    ],
  },

  /* ================================================== កម្រិត D — ការអាន */
  {
    id: 'u13', level: 'D', color: '#7c3aed', icon: '🪷',
    kmTitle: 'ធម្មបទ',
    title: 'The Dhammapada',
    kmGoal: 'អានគាថាធម្មបទដោយខ្លួនឯង ហើយស្គាល់ចង្វាក់ឆន្ទ។',
    lessons: [
      L('l13_1', 'ធម្មបទ គាថា ១', 'Dhammapada 1', 'reading', 35, {
        passage: 'p_dhp1', vocab: ['mana', 'dukkha_n', 'padda'],
      }),
      L('l13_2', 'ធម្មបទ គាថា ១៨៣', 'Dhammapada 183', 'reading', 35, {
        passage: 'p_dhp183', vocab: ['papa', 'kusala', 'citta'],
      }),
      L('l13_3', 'ត្រៃលក្ខណ៍', 'The three characteristics', 'reading', 30, {
        sentences: ['s060', 's061', 's062', 's064'],
        vocab: ['anicca', 'dukkha_a', 'anatta', 'sankhara'],
      }),
      L('l13_4', 'ឆន្ទ — គរុ និងលហុ', 'Metre', 'grammar', 30, { grammar: ['g34'] }),
      L('l13_5', 'ត្រួតពិនិត្យ ១៣', 'Checkpoint 13', 'checkpoint', 55, {
        passage: 'p_dhp1', sentences: ['s060', 's061'],
      }),
    ],
  },
  {
    id: 'u14', level: 'D', color: '#7c3aed', icon: '🌟',
    kmTitle: 'មង្គលសូត្រ',
    title: 'The Maṅgala Sutta',
    kmGoal: 'អានមង្គលសូត្រដែលអ្នកសូត្ររាល់ពិធី ដោយយល់អត្ថន័យពេញលេញ។',
    lessons: [
      L('l14_1', 'អសេវនា ច ពាលានំ', 'Maṅgala Sutta, first verse', 'reading', 35, {
        passage: 'p_mangala', vocab: ['bala', 'pandita', 'pujeti'],
      }),
      L('l14_2', 'ត្រួតពិនិត្យ ១៤', 'Checkpoint 14', 'checkpoint', 45, { passage: 'p_mangala' }),
    ],
  },
  {
    id: 'u15', level: 'D', color: '#6d28d9', icon: '💛',
    kmTitle: 'ករណីយមេត្តសូត្រ',
    title: 'The Mettā Sutta',
    kmGoal: 'អានមេត្តសូត្រ និងយល់ការប្រើកិច្ចកិរិយា (ករណីយំ) និងបញ្ជាវិភត្តិ។',
    lessons: [
      L('l15_1', 'ករណីយមត្ថកុសលេន', 'Mettā Sutta, opening', 'reading', 35, {
        passage: 'p_metta', vocab: ['metta', 'satta', 'sabba'],
      }),
      L('l15_2', 'ត្រួតពិនិត្យ ១៥', 'Checkpoint 15', 'checkpoint', 45, { passage: 'p_metta' }),
    ],
  },
  {
    id: 'u16', level: 'D', color: '#6d28d9', icon: '☸️',
    kmTitle: 'ព្រះសូត្រ — ធម្មចក្កប្បវត្តន',
    title: 'Sutta prose',
    kmGoal: 'អានសេចក្តីព្រះសូត្រពិតប្រាកដ រួមទាំងឃ្លាបើកស្តង់ដារ និងអរិយសច្ចៈ។',
    lessons: [
      L('l16_1', 'ឃ្លាបើកព្រះសូត្រ', 'The opening formula', 'reading', 35, {
        sentences: ['s070', 's071', 's072', 's073'], grammar: ['g31'],
      }),
      L('l16_2', 'ទុក្ខអរិយសច្ចៈ', 'The first noble truth', 'reading', 40, {
        passage: 'p_dhammacakka',
        vocab: ['sacca', 'jati', 'jara', 'khandha', 'upadana', 'ariya'],
      }),
      L('l16_3', 'របៀបវិភាគប្រយោគ', 'How to parse a sentence', 'grammar', 35, { grammar: ['g32'] }),
      L('l16_4', 'ត្រួតពិនិត្យ ១៦', 'Checkpoint 16', 'checkpoint', 60, {
        passage: 'p_dhammacakka', sentences: ['s070', 's071'],
      }),
    ],
  },

  /* ============================================== កម្រិត E — កម្រិតខ្ពស់ */
  {
    id: 'u17', level: 'E', color: '#b45309', icon: '📜',
    kmTitle: 'អដ្ឋកថា',
    title: 'The commentaries',
    kmGoal: 'អានភាសាអដ្ឋកថា ដែលមានរបៀបនិយាយដដែលៗ និងអាចទស្សន៍ទាយបាន។',
    lessons: [
      L('l17_1', 'សំនួនអដ្ឋកថា', 'Commentarial idiom', 'grammar', 40, {
        grammar: ['g33'], vocab: ['attha', 'adhippaya', 'vevacana', 'atthakatha', 'tika'],
        sentences: ['s080', 's081'],
      }),
      L('l17_2', 'ហេតុអ្វីហៅថា ពុទ្ធ?', 'Why "Buddha"?', 'reading', 45, { passage: 'p_atthakatha' }),
      L('l17_3', 'ត្រួតពិនិត្យ ១៧', 'Checkpoint 17', 'checkpoint', 60, { passage: 'p_atthakatha' }),
    ],
  },
  {
    id: 'u18', level: 'E', color: '#b45309', icon: '🧠',
    kmTitle: 'អភិធម្ម',
    title: 'Abhidhamma',
    kmGoal: 'អានវាក្យសព្ទអភិធម្ម និងគាថាបើកនៃអភិធម្មត្ថសង្គហៈ។',
    lessons: [
      L('l18_1', 'បរមត្ថធម៌ ៤', 'The four ultimates', 'reading', 45, {
        passage: 'p_abhidhamma',
        vocab: ['citta', 'cetasika', 'rupa', 'nibbana', 'paccaya', 'vipaka', 'lakkhana'],
      }),
      L('l18_2', 'វាក្យសព្ទអភិធម្ម', 'Abhidhamma vocabulary', 'vocab', 40, {
        vocab: ['khandha', 'vedana', 'sanna', 'sankhara', 'vinnana', 'ayatana', 'dhatu', 'phassa', 'namarupa'],
        sentences: ['s082'],
      }),
      L('l18_3', 'ត្រួតពិនិត្យ ១៨', 'Checkpoint 18', 'checkpoint', 60, { passage: 'p_abhidhamma' }),
    ],
  },
  {
    id: 'u19', level: 'E', color: '#92400e', icon: '⚖️',
    kmTitle: 'វិន័យ និងភាសាព្រះសង្ឃ',
    title: 'Vinaya language',
    kmGoal: 'ស្គាល់វាក្យសព្ទវិន័យ និងបទដែលព្រះសង្ឃប្រើក្នុងសង្ឃកម្ម។',
    lessons: [
      L('l19_1', 'វាក្យសព្ទវិន័យ', 'Vinaya vocabulary', 'vocab', 40, {
        vocab: ['vinaya', 'sikkha', 'sikkhapada', 'bhikkhu', 'bhikkhuni', 'samana', 'sangha', 'veramani'],
      }),
      L('l19_2', 'ត្រួតពិនិត្យ ១៩', 'Checkpoint 19', 'checkpoint', 50, {
        vocab: ['vinaya', 'sikkha', 'sangha', 'bhikkhu'],
      }),
    ],
  },
  {
    id: 'u20', level: 'E', color: '#92400e', icon: '✍️',
    kmTitle: 'ការសរសេរ និងការនិយាយ',
    title: 'Writing and speaking Pali',
    kmGoal: 'តែងប្រយោគបាលីដោយខ្លួនឯង — ជាជំហានចុងក្រោយពីអ្នកអានទៅជាអ្នកប្រើ។',
    lessons: [
      L('l20_1', 'តែងប្រយោគសាមញ្ញ', 'Compose simple sentences', 'compose', 45, {
        sentences: ['s001', 's010', 's013', 's020', 's030'],
      }),
      L('l20_2', 'តែងប្រយោគមានបុព្វកិរិយា', 'Compose with absolutives', 'compose', 50, {
        sentences: ['s050', 's051', 's054'],
      }),
      L('l20_3', 'តែងបទបួងសួង', 'Compose a blessing', 'compose', 50, {
        sentences: ['s042'], passage: 'p_metta',
      }),
      L('l20_4', 'ត្រួតពិនិត្យចុងក្រោយ', 'Final checkpoint', 'checkpoint', 100, {
        sentences: ['s050', 's060', 's070'], passage: 'p_dhammacakka',
      }),
    ],
  },
];

export const LESSONS: Lesson[] = UNITS.flatMap((u) => u.lessons);
export const LESSON_BY_ID = new Map(LESSONS.map((l) => [l.id, l]));
export const UNIT_BY_LESSON = new Map(UNITS.flatMap((u) => u.lessons.map((l) => [l.id, u] as const)));

export const LEVEL_INFO: Record<Unit['level'], { km: string; en: string; note: string }> = {
  A: { km: 'កម្រិត ក — មូលដ្ឋាន', en: 'Foundations', note: 'អក្សរ សំឡេង និងបទសូត្រ' },
  B: { km: 'កម្រិត ខ — វេយ្យាករណ៍', en: 'Core grammar', note: 'វិភត្តិ លិង្គ និងកិរិយា' },
  C: { km: 'កម្រិត គ — កម្រិតកណ្តាល', en: 'Intermediate', note: 'កាល កិត្តកៈ សមាស សន្ធិ' },
  D: { km: 'កម្រិត ឃ — ការអាន', en: 'Reading', note: 'ធម្មបទ និងព្រះសូត្រ' },
  E: { km: 'កម្រិត ង — កម្រិតខ្ពស់', en: 'Advanced', note: 'អដ្ឋកថា អភិធម្ម និងការតែង' },
};

/** Position of a lesson in the whole path, for progress display. */
export function lessonIndex(lessonId: string): number {
  return LESSONS.findIndex((l) => l.id === lessonId);
}
