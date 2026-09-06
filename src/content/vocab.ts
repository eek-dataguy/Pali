import type { Vocab } from './types';
import type { Decl, Gender } from '../lib/morphology';

/**
 * The dictionary. Every entry is a citation form only — buddho, buddhassa,
 * buddhesu and the rest come from the morphology engine, so adding a word here
 * immediately adds it to every drill type that word can support.
 */

const noun = (
  id: string, pali: string, km: string, en: string,
  decl: Decl, gender: Gender, tags: string[], note?: string,
): Vocab => ({ id, pali, km, en, pos: 'noun', decl, gender, tags, note });

const verb = (
  id: string, pali: string, km: string, en: string, stem: string, tags: string[],
  extra: Partial<Vocab> = {},
): Vocab => ({ id, pali, km, en, pos: 'verb', stem, tags, ...extra });

const ind = (id: string, pali: string, km: string, en: string, tags: string[], note?: string): Vocab =>
  ({ id, pali, km, en, pos: 'ind', tags, note });

const adj = (id: string, pali: string, km: string, en: string, tags: string[], note?: string): Vocab =>
  ({ id, pali, km, en, pos: 'adj', decl: 'a', gender: 'm', tags, note });

const num = (id: string, pali: string, km: string, en: string, tags: string[]): Vocab =>
  ({ id, pali, km, en, pos: 'num', tags });

/* ------------------------------------------- the words of the daily chants */

const CHANT: Vocab[] = [
  noun('buddha', 'buddha', 'ព្រះពុទ្ធ, អ្នកត្រាស់ដឹង', 'the Buddha, awakened one', 'a', 'm',
    ['chant', 'core', 'tiratana'], 'មកពីឫស budh = ដឹង, ភ្ញាក់។ ពុទ្ធ = អ្នកភ្ញាក់ឡើងហើយ។'),
  noun('dhamma', 'dhamma', 'ព្រះធម៌, សភាវធម៌, ធម្មជាតិ', 'Dhamma, teaching, phenomenon', 'a', 'm',
    ['chant', 'core', 'tiratana'], 'ពាក្យនេះមានន័យច្រើន៖ ធម៌ដែលព្រះពុទ្ធសំដែង, ការពិត, និងរបស់អ្វីមួយៗ។'),
  noun('sangha', 'saṅgha', 'ព្រះសង្ឃ, ក្រុម', 'Sangha, community', 'a', 'm', ['chant', 'core', 'tiratana']),
  noun('sarana', 'saraṇa', 'ទីពឹង, សរណៈ', 'refuge', 'a', 'nt', ['chant', 'core']),
  noun('bhagavant', 'bhagavant', 'ព្រះមានព្រះភាគ', 'the Blessed One', 'vant', 'm', ['chant', 'core', 'epithet'],
    'ជាពាក្យហៅព្រះពុទ្ធដ៏គួរគោរពបំផុត។ បឋមាឯកវចនៈ = ភគវា។'),
  noun('arahant', 'arahant', 'ព្រះអរហន្ត, អ្នកគួរបូជា', 'arahant, worthy one', 'ant', 'm', ['chant', 'core', 'epithet']),
  noun('sammasambuddha', 'sammāsambuddha', 'ព្រះសម្មាសម្ពុទ្ធ', 'fully self-awakened one', 'a', 'm', ['chant', 'epithet']),
  noun('namo', 'namo', 'ការនមស្ការ, សូមថ្វាយបង្គំ', 'homage', 'as', 'nt', ['chant'],
    'ជាទម្រង់ពិសេស (មនោគណៈ)។ នមោ តស្ស = សូមថ្វាយបង្គំចំពោះព្រះអង្គនោះ។'),
  noun('sila', 'sīla', 'សីល, សីលធម៌', 'virtue, precept', 'a', 'nt', ['chant', 'core', 'dhamma']),
  noun('sikkhapada', 'sikkhāpada', 'សិក្ខាបទ, ខទ្រង់វិន័យ', 'training rule', 'a', 'nt', ['chant', 'vinaya']),
  noun('veramani', 'veramaṇī', 'ការវៀរចេញ, វិរតី', 'abstaining from', 'ī', 'f', ['chant', 'vinaya']),
  noun('panatipata', 'pāṇātipāta', 'ការសម្លាប់សត្វ', 'killing living beings', 'a', 'm', ['chant', 'vinaya']),
  noun('adinnadana', 'adinnādāna', 'ការលួចយករបស់គេ', 'taking what is not given', 'a', 'nt', ['chant', 'vinaya']),
  noun('musavada', 'musāvāda', 'ការនិយាយកុហក', 'false speech', 'a', 'm', ['chant', 'vinaya']),
  verb('samadiyami', 'samādiyāmi', 'ខ្ញុំសូមសមាទាន', 'I undertake', 'samādiya', ['chant'],
    { note: 'ជាបុរសទី១ ឯកវចនៈ — ខ្ញុំ​ធ្វើ​ដោយ​ខ្លួន​ឯង។' }),
  ind('dutiyampi', 'dutiyampi', 'ជាលើកទីពីរ', 'for a second time', ['chant']),
  ind('tatiyampi', 'tatiyampi', 'ជាលើកទីបី', 'for a third time', ['chant']),
  ind('iti', 'iti', 'ដូច្នេះ, ថា (សញ្ញាបញ្ចប់សម្តី)', 'thus, "quote-end"', ['chant', 'core', 'particle'],
    'ជាសញ្ញាបិទសម្តីដកស្រង់។ ក្នុងបទគាថា កាត់ខ្លីជា តិ ឬ ន្តិ។'),
];

/* --------------------------------------------------- people and a-stem nouns */

const PEOPLE: Vocab[] = [
  noun('nara', 'nara', 'មនុស្សប្រុស, បុរស', 'man', 'a', 'm', ['people', 'basic']),
  noun('purisa', 'purisa', 'បុរស, បុគ្គល', 'man, person', 'a', 'm', ['people', 'basic']),
  noun('putta', 'putta', 'កូនប្រុស', 'son', 'a', 'm', ['people', 'family']),
  noun('acariya', 'ācariya', 'គ្រូ, អាចារ្យ', 'teacher', 'a', 'm', ['people', 'basic']),
  noun('sissa', 'sissa', 'សិស្ស', 'pupil', 'a', 'm', ['people', 'basic']),
  noun('kassaka', 'kassaka', 'កសិករ, អ្នកស្រែ', 'farmer', 'a', 'm', ['people', 'basic']),
  noun('brahmana', 'brāhmaṇa', 'ព្រាហ្មណ៍', 'brahmin', 'a', 'm', ['people', 'sutta']),
  noun('vanija', 'vāṇija', 'ឈ្មួញ', 'merchant', 'a', 'm', ['people', 'basic']),
  noun('upasaka', 'upāsaka', 'ឧបាសក', 'lay follower', 'a', 'm', ['people', 'dhamma']),
  noun('cora', 'cora', 'ចោរ', 'thief', 'a', 'm', ['people', 'basic']),
  noun('luddaka', 'luddaka', 'ព្រានប្រមាញ់', 'hunter', 'a', 'm', ['people', 'basic']),
  noun('yacaka', 'yācaka', 'អ្នកសុំទាន', 'beggar', 'a', 'm', ['people', 'basic']),
  noun('matula', 'mātula', 'ពូ (បងប្អូនម្តាយ)', 'uncle', 'a', 'm', ['people', 'family']),
  noun('sahaya', 'sahāya', 'មិត្តសម្លាញ់', 'friend', 'a', 'm', ['people', 'basic']),
  noun('bhupala', 'bhūpāla', 'ស្តេច, អ្នកគ្រប់គ្រងផែនដី', 'king', 'a', 'm', ['people', 'sutta']),
  noun('deva', 'deva', 'ទេវតា, ព្រះ', 'deity', 'a', 'm', ['people', 'dhamma']),
  noun('manussa', 'manussa', 'មនុស្ស', 'human being', 'a', 'm', ['people', 'dhamma']),
  noun('satta', 'satta', 'សត្វ, សត្តៈ (អ្នកមានជីវិត)', 'living being', 'a', 'm', ['people', 'dhamma']),
  noun('bala', 'bāla', 'មនុស្សពាល, អ្នកល្ងង់', 'fool', 'a', 'm', ['people', 'dhammapada']),
  noun('pandita', 'paṇḍita', 'បណ្ឌិត, អ្នកប្រាជ្ញ', 'wise person', 'a', 'm', ['people', 'dhammapada']),
  noun('mitta', 'mitta', 'មិត្ត', 'friend', 'a', 'm', ['people', 'basic']),
  noun('amacca', 'amacca', 'អាមាត្យ, មន្ត្រី', 'minister', 'a', 'm', ['people', 'sutta']),
  noun('gahapati', 'gahapati', 'គហបតី, ម្ចាស់ផ្ទះ', 'householder', 'i', 'm', ['people', 'sutta']),
  noun('samana', 'samaṇa', 'សមណៈ, អ្នកបួស', 'recluse', 'a', 'm', ['people', 'dhamma']),
];

/* ------------------------------------------------------ things and neuters */

const THINGS: Vocab[] = [
  noun('gama', 'gāma', 'ភូមិ, ស្រុក', 'village', 'a', 'm', ['world', 'basic']),
  noun('rukkha', 'rukkha', 'ដើមឈើ', 'tree', 'a', 'm', ['world', 'basic']),
  noun('pabbata', 'pabbata', 'ភ្នំ', 'mountain', 'a', 'm', ['world', 'basic']),
  noun('magga', 'magga', 'ផ្លូវ, មគ្គ', 'path', 'a', 'm', ['world', 'dhamma']),
  noun('loka', 'loka', 'លោក, ពិភពលោក', 'world', 'a', 'm', ['world', 'dhamma']),
  noun('sappa', 'sappa', 'ពស់', 'snake', 'a', 'm', ['world', 'animal']),
  noun('miga', 'miga', 'សត្វព្រៃ, ក្តាន់', 'deer', 'a', 'm', ['world', 'animal']),
  noun('kukkura', 'kukkura', 'ឆ្កែ', 'dog', 'a', 'm', ['world', 'animal']),
  noun('assa', 'assa', 'សេះ', 'horse', 'a', 'm', ['world', 'animal']),
  noun('hatthi', 'hatthī', 'ដំរី', 'elephant', 'ī', 'm', ['world', 'animal']),
  noun('sakuna', 'sakuṇa', 'បក្សី, សត្វស្លាប', 'bird', 'a', 'm', ['world', 'animal']),
  noun('maccha', 'maccha', 'ត្រី', 'fish', 'a', 'm', ['world', 'animal']),
  noun('suriya', 'suriya', 'ព្រះអាទិត្យ', 'sun', 'a', 'm', ['world', 'nature']),
  noun('canda', 'canda', 'ព្រះចន្ទ', 'moon', 'a', 'm', ['world', 'nature']),
  noun('rupa', 'rūpa', 'រូប, សំណាក', 'form, matter', 'a', 'nt', ['dhamma', 'abhidhamma', 'khandha']),
  noun('citta', 'citta', 'ចិត្ត', 'mind, consciousness', 'a', 'nt', ['dhamma', 'abhidhamma']),
  noun('kamma', 'kamma', 'កម្ម, ការងារ, ទង្វើ', 'action, kamma', 'a', 'nt', ['dhamma', 'core']),
  noun('dukkha_n', 'dukkha', 'ទុក្ខ', 'suffering', 'a', 'nt', ['dhamma', 'core', 'sacca']),
  noun('sukha_n', 'sukha', 'សុខ', 'happiness', 'a', 'nt', ['dhamma', 'core']),
  noun('dana', 'dāna', 'ទាន, ការឲ្យ', 'giving', 'a', 'nt', ['dhamma', 'core']),
  noun('nana', 'ñāṇa', 'ញាណ, ចំណេះដឹង', 'knowledge', 'a', 'nt', ['dhamma']),
  noun('phala', 'phala', 'ផល, ផ្លែឈើ', 'fruit, result', 'a', 'nt', ['dhamma', 'basic']),
  noun('punna', 'puñña', 'បុណ្យ, កុសល', 'merit', 'a', 'nt', ['dhamma', 'core']),
  noun('papa', 'pāpa', 'បាប, អកុសល', 'evil', 'a', 'nt', ['dhamma', 'core']),
  noun('sacca', 'sacca', 'សច្ចៈ, ការពិត', 'truth', 'a', 'nt', ['dhamma', 'sacca']),
  noun('ghara', 'ghara', 'ផ្ទះ', 'house', 'a', 'nt', ['world', 'basic']),
  noun('nagara', 'nagara', 'ទីក្រុង', 'city', 'a', 'nt', ['world', 'basic']),
  noun('khetta', 'khetta', 'ស្រែ, ចម្ការ', 'field', 'a', 'nt', ['world', 'basic']),
  noun('dhana', 'dhana', 'ទ្រព្យសម្បត្តិ', 'wealth', 'a', 'nt', ['world', 'basic']),
  noun('udaka', 'udaka', 'ទឹក', 'water', 'a', 'nt', ['world', 'basic']),
  noun('bhatta', 'bhatta', 'បាយ, អាហារ', 'rice, meal', 'a', 'nt', ['world', 'basic']),
  noun('vattha', 'vattha', 'សំពត់, សម្លៀកបំពាក់', 'cloth', 'a', 'nt', ['world', 'basic']),
  noun('puppha', 'puppha', 'ផ្កា', 'flower', 'a', 'nt', ['world', 'basic']),
  noun('mula', 'mūla', 'ឫស, ដើមចម', 'root', 'a', 'nt', ['world', 'basic']),
  noun('vana', 'vana', 'ព្រៃ', 'forest', 'a', 'nt', ['world', 'basic']),
  noun('vacana', 'vacana', 'ពាក្យសម្តី', 'word, speech', 'a', 'nt', ['world', 'grammar']),
  noun('padda', 'pada', 'បទ, ជំហាន, ពាក្យ', 'word, step', 'a', 'nt', ['grammar', 'dhammapada']),
  noun('nayana', 'nayana', 'ភ្នែក', 'eye', 'a', 'nt', ['body']),
  noun('mukha', 'mukha', 'មាត់, មុខ', 'mouth, face', 'a', 'nt', ['body']),
  noun('sarira', 'sarīra', 'រាងកាយ', 'body', 'a', 'nt', ['body']),
  noun('kaya', 'kāya', 'កាយ, រាងកាយ', 'body', 'a', 'm', ['body', 'dhamma', 'satipatthana']),
];

/* --------------------------------------------------------- feminine nouns */

const FEMININE: Vocab[] = [
  noun('kanna', 'kaññā', 'នារី, ក្មេងស្រី', 'girl', 'ā', 'f', ['people', 'basic']),
  noun('itthi', 'itthī', 'ស្ត្រី', 'woman', 'ī', 'f', ['people', 'basic']),
  noun('bhariya', 'bhariyā', 'ប្រពន្ធ', 'wife', 'ā', 'f', ['people', 'family']),
  noun('darika', 'dārikā', 'ក្មេងស្រី', 'little girl', 'ā', 'f', ['people', 'family']),
  noun('bhagini', 'bhaginī', 'បងស្រី, ប្អូនស្រី', 'sister', 'ī', 'f', ['people', 'family']),
  noun('kumari', 'kumārī', 'នារីក្មេង', 'maiden', 'ī', 'f', ['people', 'family']),
  noun('devi', 'devī', 'ព្រះនាង, ទេវី', 'queen, goddess', 'ī', 'f', ['people', 'sutta']),
  noun('vaca', 'vācā', 'វាចា, ពាក្យសម្តី', 'speech', 'ā', 'f', ['dhamma', 'magga']),
  noun('panna', 'paññā', 'បញ្ញា', 'wisdom', 'ā', 'f', ['dhamma', 'core']),
  noun('saddha', 'saddhā', 'សទ្ធា, ជំនឿ', 'faith', 'ā', 'f', ['dhamma', 'core']),
  noun('metta', 'mettā', 'មេត្តា', 'loving-kindness', 'ā', 'f', ['dhamma', 'brahmavihara']),
  noun('karuna', 'karuṇā', 'ករុណា', 'compassion', 'ā', 'f', ['dhamma', 'brahmavihara']),
  noun('mudita', 'muditā', 'មុទិតា', 'sympathetic joy', 'ā', 'f', ['dhamma', 'brahmavihara']),
  noun('upekkha', 'upekkhā', 'ឧបេក្ខា', 'equanimity', 'ā', 'f', ['dhamma', 'brahmavihara']),
  noun('tanha', 'taṇhā', 'តណ្ហា, ការស្រេកឃ្លាន', 'craving', 'ā', 'f', ['dhamma', 'sacca']),
  noun('jara', 'jarā', 'ជរា, ភាពចាស់', 'old age', 'ā', 'f', ['dhamma', 'sacca']),
  noun('nava', 'nāvā', 'ទូក', 'boat', 'ā', 'f', ['world', 'basic']),
  noun('sala', 'sālā', 'សាលា', 'hall', 'ā', 'f', ['world', 'basic']),
  noun('sena', 'senā', 'កងទ័ព', 'army', 'ā', 'f', ['world', 'sutta']),
  noun('jati', 'jāti', 'ជាតិ, កំណើត', 'birth', 'i', 'f', ['dhamma', 'sacca']),
  noun('gati', 'gati', 'គតិ, ទីទៅ', 'destination', 'i', 'f', ['dhamma']),
  noun('sati', 'sati', 'សតិ, ការរលឹក', 'mindfulness', 'i', 'f', ['dhamma', 'core', 'satipatthana']),
  noun('ratti', 'ratti', 'រាត្រី, យប់', 'night', 'i', 'f', ['world', 'basic']),
  noun('bhumi', 'bhūmi', 'ដី, ភូមិ (ថ្នាក់)', 'ground, stage', 'i', 'f', ['world', 'abhidhamma']),
  noun('nadi', 'nadī', 'ទន្លេ, ស្ទឹង', 'river', 'ī', 'f', ['world', 'basic']),
  noun('mata_f', 'mātar', 'ម្តាយ', 'mother', 'ar', 'f', ['people', 'family']),
  noun('dhita', 'dhītar', 'កូនស្រី', 'daughter', 'ar', 'f', ['people', 'family']),
];

/* ------------------------------------------------- i-, u- and other stems */

const OTHER_STEMS: Vocab[] = [
  noun('bhikkhu', 'bhikkhu', 'ភិក្ខុ, ព្រះសង្ឃ', 'monk', 'u', 'm', ['people', 'core', 'sutta'],
    'អាលបនៈពហុវចនៈ = ភិក្ខវេ — ជាពាក្យដែលព្រះពុទ្ធហៅព្រះសង្ឃនៅដើមព្រះសូត្រ។'),
  noun('bhikkhuni', 'bhikkhunī', 'ភិក្ខុនី', 'nun', 'ī', 'f', ['people', 'vinaya']),
  noun('garu', 'garu', 'គ្រូ, អ្នកគួរគោរព', 'teacher, venerable', 'u', 'm', ['people']),
  noun('bandhu', 'bandhu', 'សាច់ញាតិ', 'relative', 'u', 'm', ['people', 'family']),
  noun('hetu', 'hetu', 'ហេតុ, មូលហេតុ', 'cause', 'u', 'm', ['dhamma', 'abhidhamma']),
  noun('setu', 'setu', 'ស្ពាន', 'bridge', 'u', 'm', ['world']),
  noun('cakkhu', 'cakkhu', 'ភ្នែក, ចក្ខុ', 'eye', 'u', 'nt', ['body', 'abhidhamma', 'ayatana']),
  noun('ayu', 'āyu', 'អាយុ', 'lifespan', 'u', 'nt', ['dhamma']),
  noun('madhu', 'madhu', 'ទឹកឃ្មុំ', 'honey', 'u', 'nt', ['world']),
  noun('vatthu_u', 'vatthu', 'វត្ថុ, រឿង, មូលដ្ឋាន', 'object, story, basis', 'u', 'nt', ['world', 'commentary']),
  noun('muni', 'muni', 'មុនី, អ្នកស្ងប់', 'sage', 'i', 'm', ['people', 'dhammapada']),
  noun('isi', 'isi', 'ឥសី, ឥសិ', 'seer', 'i', 'm', ['people', 'sutta']),
  noun('aggi', 'aggi', 'ភ្លើង', 'fire', 'i', 'm', ['world']),
  noun('atthi_n', 'aṭṭhi', 'ឆ្អឹង', 'bone', 'i', 'nt', ['body', 'satipatthana']),
  noun('satthar', 'satthar', 'ព្រះសាស្តា', 'the Teacher', 'ar', 'm', ['epithet', 'sutta'],
    'បឋមាឯកវចនៈ = សត្ថា។ ជាពាក្យហៅព្រះពុទ្ធក្នុងអដ្ឋកថា។'),
  noun('pitar', 'pitar', 'ឪពុក', 'father', 'ar', 'm', ['people', 'family']),
  noun('bhatar', 'bhātar', 'បងប្រុស, ប្អូនប្រុស', 'brother', 'ar', 'm', ['people', 'family']),
  noun('raja', 'rājan', 'ស្តេច', 'king', 'irregular', 'm', ['people', 'sutta'],
    'ជាសព្ទវិសេស៖ រាជា, រាជានំ, រញ្ញា, រញ្ញោ។'),
  noun('attan', 'attan', 'ខ្លួន, អត្តា', 'self', 'irregular', 'm', ['dhamma', 'core'],
    'អត្តា, អត្តានំ, អត្តនា, អត្តនោ។ សូមប្រៀបធៀបនឹង អនត្តា។'),
  noun('mana', 'mana', 'ចិត្ត, មនោ', 'mind', 'as', 'nt', ['dhamma', 'abhidhamma'],
    'ជាមនោគណៈ៖ បឋមាឯកវចនៈ មនោ ឬ មនំ, តតិយា មនសា។'),
  noun('ceto', 'ceta', 'ចេតសិក, ចិត្ត', 'heart, mind', 'as', 'nt', ['dhamma', 'abhidhamma']),
  noun('tejo', 'teja', 'តេជៈ, កំដៅ', 'heat, energy', 'as', 'nt', ['dhamma', 'abhidhamma']),
  noun('satimant', 'satimant', 'អ្នកមានសតិ', 'mindful one', 'vant', 'm', ['dhamma', 'satipatthana']),
  noun('gunavant', 'guṇavant', 'អ្នកមានគុណ', 'virtuous one', 'vant', 'm', ['dhamma']),
];

/* ------------------------------------------------------------------ verbs */

const VERBS: Vocab[] = [
  verb('gacchati', 'gacchati', 'ទៅ', 'goes', 'gaccha', ['verb', 'core', 'basic'],
    { pp: 'gata', abs: 'gantvā', inf: 'gantuṃ', note: 'ឫស គម៑។ គច្ឆាមិ = ខ្ញុំទៅ — ជាពាក្យក្នុងបទសរណគមន៍។' }),
  verb('agacchati', 'āgacchati', 'មកដល់', 'comes', 'āgaccha', ['verb', 'basic'],
    { pp: 'āgata', abs: 'āgantvā', inf: 'āgantuṃ' }),
  verb('hoti', 'hoti', 'មាន, ជា, កើតឡើង', 'is, becomes', 'ho', ['verb', 'core', 'basic'], {
    pp: 'bhūta', abs: 'hutvā', inf: 'hotuṃ',
    overrides: {
      'pres.3.sg': ['hoti'], 'pres.2.sg': ['hosi'], 'pres.1.sg': ['homi'],
      'pres.3.pl': ['honti'], 'pres.2.pl': ['hotha'], 'pres.1.pl': ['homa'],
      'fut.3.sg': ['bhavissati'], 'fut.2.sg': ['bhavissasi'], 'fut.1.sg': ['bhavissāmi'],
      'fut.3.pl': ['bhavissanti'], 'fut.2.pl': ['bhavissatha'], 'fut.1.pl': ['bhavissāma'],
      'aor.3.sg': ['ahosi'], 'aor.3.pl': ['ahesuṃ'], 'aor.1.sg': ['ahosiṃ'],
      'imp.3.sg': ['hotu'], 'imp.2.sg': ['hohi'], 'imp.3.pl': ['hontu'],
      'opt.3.sg': ['bhaveyya', 'assa'], 'opt.3.pl': ['bhaveyyuṃ'],
    },
    note: 'កិរិយាដ៏សំខាន់បំផុត។ សូមចាំទម្រង់ ហោតិ, ហោន្តិ, ហោមិ។',
  }),
  verb('atthi', 'atthi', 'មាន (ជាកិរិយាបញ្ជាក់ការមាន)', 'there is, exists', 'as', ['verb', 'core'], {
    overrides: {
      'pres.3.sg': ['atthi'], 'pres.2.sg': ['asi'], 'pres.1.sg': ['asmi', 'amhi'],
      'pres.3.pl': ['santi'], 'pres.2.pl': ['attha'], 'pres.1.pl': ['asma', 'amha'],
      'opt.3.sg': ['siyā', 'assa'], 'opt.3.pl': ['siyuṃ', 'assu'],
      'imp.3.sg': ['atthu'],
    },
    note: 'វិសេសទាំងស្រុង។ នត្ថិ = ន + អត្ថិ = មិនមាន។',
  }),
  verb('karoti', 'karoti', 'ធ្វើ', 'does, makes', 'karo', ['verb', 'core', 'basic'], {
    pp: 'kata', abs: 'katvā', inf: 'kātuṃ',
    overrides: {
      'pres.3.sg': ['karoti'], 'pres.2.sg': ['karosi'], 'pres.1.sg': ['karomi'],
      'pres.3.pl': ['karonti'], 'pres.2.pl': ['karotha'], 'pres.1.pl': ['karoma'],
      'fut.3.sg': ['karissati'], 'fut.1.sg': ['karissāmi'], 'fut.3.pl': ['karissanti'],
      'aor.3.sg': ['akāsi'], 'aor.3.pl': ['akaṃsu'],
      'imp.3.sg': ['karotu'], 'imp.2.sg': ['karohi'], 'imp.3.pl': ['karontu'],
      'opt.3.sg': ['kareyya', 'kayirā'],
    },
  }),
  verb('deti', 'deti', 'ឲ្យ, ប្រគេន', 'gives', 'de', ['verb', 'core', 'basic'], {
    pp: 'dinna', abs: 'datvā', inf: 'dātuṃ',
    overrides: {
      'pres.3.sg': ['deti', 'dadāti'], 'pres.2.sg': ['desi'], 'pres.1.sg': ['demi'],
      'pres.3.pl': ['denti', 'dadanti'], 'pres.2.pl': ['detha'], 'pres.1.pl': ['dema'],
      'imp.2.sg': ['dehi'], 'aor.3.sg': ['adāsi'], 'fut.3.sg': ['dassati'],
    },
  }),
  verb('passati', 'passati', 'ឃើញ', 'sees', 'passa', ['verb', 'core', 'basic'],
    { pp: 'diṭṭha', abs: 'disvā', inf: 'daṭṭhuṃ', note: 'កិរិយាអតីត ទិដ្ឋ និង បុព្វកិរិយា ទិស្វា មកពីឫសផ្សេង (ទិស៑)។' }),
  verb('sunati', 'suṇāti', 'ស្តាប់, ឮ', 'hears', 'suṇā', ['verb', 'core', 'basic'], {
    pp: 'suta', abs: 'sutvā', inf: 'sotuṃ',
    overrides: {
      'pres.3.sg': ['suṇāti'], 'pres.2.sg': ['suṇāsi'], 'pres.1.sg': ['suṇāmi'],
      'pres.3.pl': ['suṇanti'], 'pres.2.pl': ['suṇātha'], 'pres.1.pl': ['suṇāma'],
      'imp.2.pl': ['suṇātha'],
    },
    note: 'សុតំ (កិរិយាអតីត) ជាពាក្យបើកព្រះសូត្រ៖ ឯវំ មេ សុតំ។',
  }),
  verb('janati', 'jānāti', 'ដឹង', 'knows', 'jānā', ['verb', 'core'],
    { pp: 'ñāta', abs: 'ñatvā', inf: 'ñātuṃ' }),
  verb('ganhati', 'gaṇhāti', 'កាន់, យក', 'takes', 'gaṇhā', ['verb', 'basic'],
    { pp: 'gahita', abs: 'gahetvā', inf: 'gahetuṃ' }),
  verb('bhunjati', 'bhuñjati', 'ឆាន់, ញ៉ាំ', 'eats', 'bhuñja', ['verb', 'basic'],
    { pp: 'bhutta', abs: 'bhuñjitvā', inf: 'bhuñjituṃ' }),
  verb('pivati', 'pivati', 'ផឹក', 'drinks', 'piva', ['verb', 'basic'], { pp: 'pīta', abs: 'pivitvā' }),
  verb('titthati', 'tiṭṭhati', 'ឈរ, នៅ', 'stands, remains', 'tiṭṭha', ['verb', 'basic'],
    { pp: 'ṭhita', abs: 'ṭhatvā', inf: 'ṭhātuṃ' }),
  verb('nisidati', 'nisīdati', 'អង្គុយ', 'sits', 'nisīda', ['verb', 'basic'],
    { pp: 'nisinna', abs: 'nisīditvā' }),
  verb('sayati', 'sayati', 'ដេក', 'lies down, sleeps', 'saya', ['verb', 'basic'], { pp: 'sayita' }),
  verb('dhavati', 'dhāvati', 'រត់', 'runs', 'dhāva', ['verb', 'basic'], { pp: 'dhāvita' }),
  verb('carati', 'carati', 'ដើរ, ប្រព្រឹត្ត', 'walks, practises', 'cara', ['verb', 'dhamma'],
    { pp: 'cariṇṇa', abs: 'caritvā' }),
  verb('vasati', 'vasati', 'រស់នៅ', 'dwells', 'vasa', ['verb', 'basic'], { pp: 'vuttha', abs: 'vasitvā' }),
  verb('pacati', 'pacati', 'ចម្អិន', 'cooks', 'paca', ['verb', 'basic'], { pp: 'pakka' }),
  verb('pathati', 'paṭhati', 'អាន, សូត្រ', 'reads, recites', 'paṭha', ['verb', 'basic'], { pp: 'paṭhita' }),
  verb('likhati', 'likhati', 'សរសេរ', 'writes', 'likha', ['verb', 'basic'], { pp: 'likhita' }),
  verb('vadati', 'vadati', 'និយាយ', 'says', 'vada', ['verb', 'basic'], { pp: 'vutta', abs: 'vatvā' }),
  verb('bhasati', 'bhāsati', 'ពោល, សំដែង', 'speaks', 'bhāsa', ['verb', 'sutta'],
    { pp: 'bhāsita', abs: 'bhāsitvā' }),
  verb('pucchati', 'pucchati', 'សួរ', 'asks', 'puccha', ['verb', 'basic'],
    { pp: 'puṭṭha', abs: 'pucchitvā' }),
  verb('labhati', 'labhati', 'បាន, ទទួល', 'receives', 'labha', ['verb', 'basic'],
    { pp: 'laddha', abs: 'labhitvā' }),
  verb('harati', 'harati', 'នាំយកទៅ', 'carries away', 'hara', ['verb', 'basic'], { pp: 'haṭa' }),
  verb('aharati', 'āharati', 'នាំយកមក', 'brings', 'āhara', ['verb', 'basic'], { pp: 'āhaṭa' }),
  verb('rakkhati', 'rakkhati', 'រក្សា, ការពារ', 'protects', 'rakkha', ['verb', 'dhamma'], { pp: 'rakkhita' }),
  verb('vandati', 'vandati', 'ថ្វាយបង្គំ', 'pays homage', 'vanda', ['verb', 'chant'],
    { pp: 'vandita', abs: 'vanditvā' }),
  verb('pujeti', 'pūjeti', 'បូជា', 'venerates', 'pūje', ['verb', 'chant'], { pp: 'pūjita' }),
  verb('icchati', 'icchati', 'ប្រាថ្នា, ចង់បាន', 'wishes', 'iccha', ['verb', 'dhamma'], { pp: 'iṭṭha' }),
  verb('bhavati_v', 'bhāveti', 'ចម្រើន, អប់រំ (ចិត្ត)', 'develops, cultivates', 'bhāve', ['verb', 'dhamma'],
    { pp: 'bhāvita', note: 'ជាពាក្យសម្រាប់ការចម្រើនសមាធិ និងវិបស្សនា។' }),
  verb('deseti', 'deseti', 'សំដែង (ធម៌)', 'teaches', 'dese', ['verb', 'sutta'],
    { pp: 'desita', abs: 'desetvā' }),
  verb('cinteti', 'cinteti', 'គិត', 'thinks', 'cinte', ['verb', 'basic'], { pp: 'cintita' }),
  verb('pasidati', 'pasīdati', 'ជ្រះថ្លា, ស្ងប់', 'gains confidence', 'pasīda', ['verb', 'dhamma'],
    { pp: 'pasanna' }),
  verb('uppajjati', 'uppajjati', 'កើតឡើង', 'arises', 'uppajja', ['verb', 'abhidhamma'],
    { pp: 'uppanna', note: 'ជាពាក្យសំខាន់ក្នុងបដិច្ចសមុប្បាទ។' }),
  verb('nirujjhati', 'nirujjhati', 'រលត់ទៅ', 'ceases', 'nirujjha', ['verb', 'abhidhamma'],
    { pp: 'niruddha' }),
  verb('marati', 'marati', 'ស្លាប់', 'dies', 'mara', ['verb', 'dhamma'], { pp: 'mata' }),
  verb('jayati', 'jāyati', 'កើត', 'is born', 'jāya', ['verb', 'dhamma'], { pp: 'jāta' }),
  verb('pajahati', 'pajahati', 'លះបង់', 'abandons', 'pajaha', ['verb', 'dhamma'],
    { pp: 'pahīna', abs: 'pahāya' }),
  verb('viharati', 'viharati', 'នៅ, សណ្ឋិត', 'dwells', 'vihara', ['verb', 'sutta'],
    { pp: 'vihata', abs: 'viharitvā', note: 'ជាពាក្យបើករឿងក្នុងព្រះសូត្រ៖ ភគវា … វិហរតិ។' }),
  verb('anupassati', 'anupassati', 'ពិចារណាឃើញ', 'contemplates', 'anupassa', ['verb', 'satipatthana'],
    { pp: 'anupassita' }),
];

/* --------------------------------------------------- adjectives and numbers */

const ADJECTIVES: Vocab[] = [
  adj('sabba', 'sabba', 'ទាំងអស់', 'all', ['adj', 'core']),
  adj('mahanta', 'mahanta', 'ធំ', 'great, big', ['adj', 'basic']),
  adj('khuddaka', 'khuddaka', 'តូច', 'small', ['adj', 'basic']),
  adj('digha', 'dīgha', 'វែង', 'long', ['adj', 'basic']),
  adj('rassa', 'rassa', 'ខ្លី', 'short', ['adj', 'basic']),
  adj('seta', 'seta', 'ស', 'white', ['adj', 'basic']),
  adj('kanha', 'kaṇha', 'ខ្មៅ', 'black', ['adj', 'basic']),
  adj('sundara', 'sundara', 'ស្អាត', 'beautiful', ['adj', 'basic']),
  adj('kusala', 'kusala', 'កុសល, ល្អ', 'wholesome', ['adj', 'dhamma', 'core']),
  adj('akusala', 'akusala', 'អកុសល, អាក្រក់', 'unwholesome', ['adj', 'dhamma', 'core']),
  adj('anicca', 'anicca', 'អនិច្ចំ, មិនទៀង', 'impermanent', ['adj', 'dhamma', 'tilakkhana'],
    'លក្ខណៈទី១ ក្នុងត្រៃលក្ខណ៍។'),
  adj('dukkha_a', 'dukkha', 'ទុក្ខ, ជាទុក្ខ', 'suffering, unsatisfactory', ['adj', 'dhamma', 'tilakkhana']),
  adj('anatta', 'anatta', 'អនត្តា, មិនមែនខ្លួន', 'not-self', ['adj', 'dhamma', 'tilakkhana']),
  adj('ariya', 'ariya', 'អរិយៈ, ប្រសើរ', 'noble', ['adj', 'dhamma', 'core']),
  adj('parisuddha', 'parisuddha', 'បរិសុទ្ធ', 'pure', ['adj', 'dhamma']),
  adj('sukha_a', 'sukha', 'សុខ, ស្រួល', 'pleasant', ['adj', 'dhamma']),
  num('eka', 'eka', 'មួយ', 'one', ['num']),
  num('dvi', 'dvi', 'ពីរ', 'two', ['num']),
  num('ti', 'ti', 'បី', 'three', ['num']),
  num('catu', 'catu', 'បួន', 'four', ['num']),
  num('panca', 'pañca', 'ប្រាំ', 'five', ['num']),
  num('cha', 'cha', 'ប្រាំមួយ', 'six', ['num']),
  num('satta_n', 'satta', 'ប្រាំពីរ', 'seven', ['num']),
  num('attha_n', 'aṭṭha', 'ប្រាំបី', 'eight', ['num']),
  num('nava_n', 'nava', 'ប្រាំបួន', 'nine', ['num']),
  num('dasa', 'dasa', 'ដប់', 'ten', ['num']),
];

/* ------------------------------------------------------- indeclinables */

const INDECLINABLES: Vocab[] = [
  ind('ca', 'ca', 'និង, ហើយ', 'and', ['particle', 'core'], 'តែងតាំងនៅក្រោយពាក្យ មិនមែននៅមុខទេ។'),
  ind('va', 'vā', 'ឬ', 'or', ['particle', 'core']),
  ind('na', 'na', 'មិន, ទេ', 'not', ['particle', 'core']),
  ind('api', 'api', 'ក៏, ទោះបី', 'also, even', ['particle', 'core']),
  ind('eva', 'eva', 'ពិតប្រាកដ, តែប៉ុណ្ណោះ', 'indeed, only', ['particle', 'core']),
  ind('hi', 'hi', 'ព្រោះថា, ពិតណាស់', 'for, indeed', ['particle', 'sutta']),
  ind('kho', 'kho', 'ពិតជា (ពាក្យបំពេញ)', 'indeed', ['particle', 'sutta']),
  ind('pana', 'pana', 'តែ, ឯ', 'but, moreover', ['particle', 'sutta']),
  ind('evam', 'evaṃ', 'យ៉ាងនេះ, ដូច្នេះ', 'thus', ['particle', 'sutta']),
  ind('yatha', 'yathā', 'ដូចជា, តាមរបៀបដែល', 'as, just as', ['particle', 'core']),
  ind('tatha', 'tathā', 'ដូច្នោះ', 'so, thus', ['particle', 'core']),
  ind('idani', 'idāni', 'ឥឡូវនេះ', 'now', ['particle', 'time']),
  ind('ajja', 'ajja', 'ថ្ងៃនេះ', 'today', ['particle', 'time']),
  ind('sada', 'sadā', 'ជានិច្ច', 'always', ['particle', 'time']),
  ind('puna', 'puna', 'ម្តងទៀត', 'again', ['particle', 'time']),
  ind('saddhim', 'saddhiṃ', 'ជាមួយនឹង', 'together with', ['particle', 'core'],
    'ប្រើជាមួយតតិយាវិភត្តិ៖ ភិក្ខូហិ សទ្ធិំ = ជាមួយភិក្ខុទាំងឡាយ។'),
  ind('saha', 'saha', 'ជាមួយ', 'with', ['particle', 'core']),
  ind('vina', 'vinā', 'ដោយគ្មាន', 'without', ['particle']),
  ind('tattha', 'tattha', 'នៅទីនោះ', 'there', ['particle', 'place']),
  ind('ettha', 'ettha', 'នៅទីនេះ', 'here', ['particle', 'place']),
  ind('kattha', 'kattha', 'នៅឯណា?', 'where?', ['particle', 'place']),
  ind('kada', 'kadā', 'ពេលណា?', 'when?', ['particle', 'question']),
  ind('kasma', 'kasmā', 'ហេតុអ្វី?', 'why?', ['particle', 'question']),
  ind('katham', 'kathaṃ', 'ដោយរបៀបណា?', 'how?', ['particle', 'question']),
  ind('sace', 'sace', 'ប្រសិនបើ', 'if', ['particle', 'core']),
  ind('ma', 'mā', 'កុំ (ហាមឃាត់)', 'do not', ['particle', 'core'],
    'ប្រើជាមួយកិរិយាអតីត ដើម្បីហាមឃាត់៖ មា ការសិ = កុំធ្វើ។'),
  ind('atha', 'atha', 'បន្ទាប់មក', 'then', ['particle', 'sutta']),
  ind('seyyathapi', 'seyyathāpi', 'ប្រៀបដូចជា', 'just as if', ['particle', 'sutta', 'simile']),
  ind('paticca', 'paṭicca', 'អាស្រ័យនូវ', 'dependent on', ['particle', 'abhidhamma']),
  ind('yava', 'yāva', 'រហូតដល់', 'as far as, until', ['particle']),
  ind('sadhu', 'sādhu', 'ល្អហើយ, សាធុ', 'good, well said', ['particle', 'chant']),
];

/* --------------------------------------- doctrinal and commentarial terms */

const DHAMMA_TERMS: Vocab[] = [
  noun('nibbana', 'nibbāna', 'និព្វាន', 'Nibbana', 'a', 'nt', ['dhamma', 'core', 'sacca']),
  noun('samsara', 'saṃsāra', 'សង្សារវដ្ត', 'round of rebirth', 'a', 'm', ['dhamma']),
  noun('kilesa', 'kilesa', 'កិលេស', 'defilement', 'a', 'm', ['dhamma', 'abhidhamma']),
  noun('avijja', 'avijjā', 'អវិជ្ជា', 'ignorance', 'ā', 'f', ['dhamma', 'paticca']),
  noun('vijja', 'vijjā', 'វិជ្ជា', 'true knowledge', 'ā', 'f', ['dhamma']),
  noun('samudaya', 'samudaya', 'សមុទ័យ, ហេតុកើត', 'origin', 'a', 'm', ['dhamma', 'sacca']),
  noun('nirodha', 'nirodha', 'និរោធ, ការរលត់', 'cessation', 'a', 'm', ['dhamma', 'sacca']),
  noun('khandha', 'khandha', 'ខន្ធ, គំនរ', 'aggregate', 'a', 'm', ['dhamma', 'abhidhamma', 'khandha']),
  noun('vedana', 'vedanā', 'វេទនា, អារម្មណ៍', 'feeling', 'ā', 'f', ['dhamma', 'khandha', 'satipatthana']),
  noun('sanna', 'saññā', 'សញ្ញា, ការចាំបាន', 'perception', 'ā', 'f', ['dhamma', 'khandha']),
  noun('sankhara', 'saṅkhāra', 'សង្ខារ', 'formation', 'a', 'm', ['dhamma', 'khandha', 'paticca']),
  noun('vinnana', 'viññāṇa', 'វិញ្ញាណ', 'consciousness', 'a', 'nt', ['dhamma', 'khandha']),
  noun('ayatana', 'āyatana', 'អាយតនៈ', 'sense base', 'a', 'nt', ['abhidhamma', 'ayatana']),
  noun('dhatu', 'dhātu', 'ធាតុ', 'element', 'u', 'f', ['abhidhamma']),
  noun('cetasika', 'cetasika', 'ចេតសិក', 'mental factor', 'a', 'nt', ['abhidhamma']),
  noun('samadhi', 'samādhi', 'សមាធិ', 'concentration', 'i', 'm', ['dhamma', 'magga']),
  noun('viriya', 'viriya', 'វីរិយៈ, ការព្យាយាម', 'energy', 'a', 'nt', ['dhamma']),
  noun('jhana', 'jhāna', 'ឈាន', 'absorption', 'a', 'nt', ['dhamma', 'bhavana']),
  noun('vipassana', 'vipassanā', 'វិបស្សនា', 'insight', 'ā', 'f', ['dhamma', 'bhavana']),
  noun('samatha', 'samatha', 'សមថៈ', 'serenity', 'a', 'm', ['dhamma', 'bhavana']),
  noun('sikkha', 'sikkhā', 'សិក្ខា, ការសិក្សា', 'training', 'ā', 'f', ['dhamma', 'vinaya']),
  noun('paccaya', 'paccaya', 'បច្ច័យ, លក្ខខណ្ឌ', 'condition', 'a', 'm', ['abhidhamma', 'paticca']),
  noun('vipaka', 'vipāka', 'វិបាក, ផលនៃកម្ម', 'result of kamma', 'a', 'm', ['abhidhamma']),
  noun('upadana', 'upādāna', 'ឧបាទាន, ការប្រកាន់', 'clinging', 'a', 'nt', ['dhamma', 'paticca']),
  noun('bhava', 'bhava', 'ភព', 'becoming, existence', 'a', 'm', ['dhamma', 'paticca']),
  noun('phassa', 'phassa', 'ផស្សៈ, ការប៉ះពាល់', 'contact', 'a', 'm', ['abhidhamma', 'paticca']),
  noun('salayatana', 'saḷāyatana', 'សឡាយតនៈ (អាយតនៈ៦)', 'six sense bases', 'a', 'nt', ['abhidhamma', 'paticca']),
  noun('namarupa', 'nāmarūpa', 'នាមរូប', 'mind-and-matter', 'a', 'nt', ['abhidhamma', 'paticca']),
  noun('sutta', 'sutta', 'ព្រះសូត្រ', 'discourse', 'a', 'nt', ['text', 'core']),
  noun('gatha', 'gāthā', 'គាថា', 'verse', 'ā', 'f', ['text', 'core']),
  noun('vinaya', 'vinaya', 'វិន័យ', 'monastic discipline', 'a', 'm', ['text', 'vinaya']),
  noun('abhidhamma', 'abhidhamma', 'អភិធម្ម', 'higher doctrine', 'a', 'm', ['text', 'abhidhamma']),
  noun('atthakatha', 'aṭṭhakathā', 'អដ្ឋកថា', 'commentary', 'ā', 'f', ['text', 'commentary']),
  noun('tika', 'ṭīkā', 'ដីកា (អដ្ឋកថារង)', 'sub-commentary', 'ā', 'f', ['text', 'commentary']),
  noun('attha', 'attha', 'អត្ថ, សេចក្តី, ប្រយោជន៍', 'meaning, benefit', 'a', 'm', ['text', 'commentary'],
    'ក្នុងអដ្ឋកថា ពាក្យនេះមានន័យថា «អត្ថន័យ»។'),
  noun('adhippaya', 'adhippāya', 'អធិប្បាយ, បំណង', 'intention, purport', 'a', 'm', ['commentary']),
  noun('vevacana', 'vevacana', 'វេវចនៈ, ពាក្យសទិសន័យ', 'synonym', 'a', 'nt', ['commentary']),
  noun('lakkhana', 'lakkhaṇa', 'លក្ខណៈ', 'characteristic', 'a', 'nt', ['abhidhamma', 'commentary']),
];

/* ------------------------------------------------------------- pronouns */

const pron = (id: string, pali: string, km: string, en: string, note?: string): Vocab =>
  ({ id, pali, km, en, pos: 'pron', tags: ['pronoun', 'core'], note });

const PRONOUN_ENTRIES: Vocab[] = [
  pron('amha', 'ahaṃ', 'ខ្ញុំ', 'I', 'ប្រែពិសេស៖ អហំ, មំ, មយា, មម/មយ្ហំ, មយិ។ ពហុវចនៈ មយំ, អម្ហេ, អម្ហាកំ។'),
  pron('tumha', 'tvaṃ', 'អ្នក', 'you', 'ត្វំ, តំ, តយា, តវ/តុយ្ហំ។ ពហុវចនៈ តុម្ហេ, តុម្ហាកំ។'),
  pron('ta_m', 'so', 'គាត់, នោះ (បុល្លិង្គ)', 'he, that', 'សោ, តំ, តេន, តស្ស, តស្មិំ។ ពហុវចនៈ តេ, តេសំ, តេសុ។'),
  pron('ta_f', 'sā', 'នាង, នោះ (ឥត្ថីលិង្គ)', 'she, that', 'សា, តំ, តាយ, តស្សា។ ពហុវចនៈ តា/តាយោ, តាសំ។'),
  pron('ta_nt', 'taṃ', 'វា, នោះ (នបុំសកលិង្គ)', 'it, that', 'តំ, តេន, តស្ស។ ពហុវចនៈ តានិ, តេសំ។'),
  pron('ima_m', 'ayaṃ', 'នេះ', 'this', 'អយំ, ឥមំ, ឥមិនា, ឥមស្ស។ ពហុវចនៈ ឥមេ, ឥមេសំ។'),
  pron('ya_m', 'yo', 'ដែល, អ្នកណា', 'who, which', 'សព្វនាមសម្ពន្ធ។ ច្រើនប្រើគូនឹង ត៖ យោ … សោ … = អ្នកណា … អ្នកនោះ …។'),
  pron('ka_m', 'ko', 'អ្នកណា?, អ្វី?', 'who?, what?', 'សព្វនាមសំណួរ៖ កោ, កំ, កេន, កស្ស, កស្មា។'),
  pron('sura', 'surā', 'សុរា, ស្រា', 'liquor'),
];

export const VOCAB: Vocab[] = [
  ...CHANT, ...PEOPLE, ...THINGS, ...FEMININE, ...OTHER_STEMS,
  ...VERBS, ...ADJECTIVES, ...INDECLINABLES, ...DHAMMA_TERMS, ...PRONOUN_ENTRIES,
];

export const VOCAB_BY_ID = new Map(VOCAB.map((v) => [v.id, v]));

export function vocabById(id: string): Vocab | undefined {
  return VOCAB_BY_ID.get(id);
}

/** Every distinct tag, for the "practise a topic" screen. */
export const VOCAB_TAGS = [...new Set(VOCAB.flatMap((v) => v.tags))].sort();
