import type { Gloss, Sentence } from './types';

/**
 * Example sentences, each parsed word by word.
 *
 * The gloss is the point: a learner who can see that ភិក្ខូនំ is ចតុត្ថី ពហុ
 * can work out an unfamiliar sentence for themselves, which is the skill that
 * eventually opens the Tipitaka. Every reading exercise is built from these.
 */

const g = (pali: string, km: string, gram?: string, lemma?: string): Gloss =>
  ({ pali, km, gram, lemma });

const s = (
  id: string, pali: string, km: string, words: Gloss[], tags: string[], source?: string,
): Sentence => ({ id, pali, km, words, tags, source });

/* Abbreviations used in the gloss line, spelled out in the UI legend:
   បឋមា/ទុតិយា/… = case, ឯក/ពហុ = number, បុំ/ឥត្ថី/នបុំ = gender,
   កិរិយា ៣ ឯក បច្ចុ = verb, 3rd person singular present. */

export const SENTENCES: Sentence[] = [
  /* --- first sentences: nominative subject + verb ------------------------ */
  s('s001', 'Naro gacchati.', 'បុរសទៅ។', [
    g('naro', 'បុរស', 'បឋមា ឯក បុំ', 'nara'),
    g('gacchati', 'ទៅ', 'កិរិយា ៣ ឯក បច្ចុ', 'gacchati'),
  ], ['u4', 'basic']),
  s('s002', 'Bhikkhū gacchanti.', 'ភិក្ខុទាំងឡាយទៅ។', [
    g('bhikkhū', 'ភិក្ខុទាំងឡាយ', 'បឋមា ពហុ បុំ', 'bhikkhu'),
    g('gacchanti', 'ទៅ', 'កិរិយា ៣ ពហុ បច្ចុ', 'gacchati'),
  ], ['u4', 'basic']),
  s('s003', 'Dārikā dhāvati.', 'ក្មេងស្រីរត់។', [
    g('dārikā', 'ក្មេងស្រី', 'បឋមា ឯក ឥត្ថី', 'darika'),
    g('dhāvati', 'រត់', 'កិរិយា ៣ ឯក បច្ចុ', 'dhavati'),
  ], ['u4', 'basic']),
  s('s004', 'Ahaṃ gacchāmi.', 'ខ្ញុំទៅ។', [
    g('ahaṃ', 'ខ្ញុំ', 'បឋមា ឯក', 'amha'),
    g('gacchāmi', 'ទៅ', 'កិរិយា ១ ឯក បច្ចុ', 'gacchati'),
  ], ['u4', 'pronoun']),
  s('s005', 'Tvaṃ dhammaṃ suṇāsi.', 'អ្នកស្តាប់ធម៌។', [
    g('tvaṃ', 'អ្នក', 'បឋមា ឯក', 'tumha'),
    g('dhammaṃ', 'នូវធម៌', 'ទុតិយា ឯក បុំ', 'dhamma'),
    g('suṇāsi', 'ស្តាប់', 'កិរិយា ២ ឯក បច្ចុ', 'sunati'),
  ], ['u4', 'pronoun']),

  /* --- accusative object ------------------------------------------------- */
  s('s010', 'Buddho dhammaṃ deseti.', 'ព្រះពុទ្ធសំដែងធម៌។', [
    g('buddho', 'ព្រះពុទ្ធ', 'បឋមា ឯក បុំ', 'buddha'),
    g('dhammaṃ', 'នូវធម៌', 'ទុតិយា ឯក បុំ', 'dhamma'),
    g('deseti', 'សំដែង', 'កិរិយា ៣ ឯក បច្ចុ', 'deseti'),
  ], ['u4', 'core', 'dhamma']),
  s('s011', 'Upāsako buddhaṃ vandati.', 'ឧបាសកថ្វាយបង្គំព្រះពុទ្ធ។', [
    g('upāsako', 'ឧបាសក', 'បឋមា ឯក បុំ', 'upasaka'),
    g('buddhaṃ', 'នូវព្រះពុទ្ធ', 'ទុតិយា ឯក បុំ', 'buddha'),
    g('vandati', 'ថ្វាយបង្គំ', 'កិរិយា ៣ ឯក បច្ចុ', 'vandati'),
  ], ['u4', 'chant']),
  s('s012', 'Ācariyo sissaṃ passati.', 'គ្រូឃើញសិស្ស។', [
    g('ācariyo', 'គ្រូ', 'បឋមា ឯក បុំ', 'acariya'),
    g('sissaṃ', 'នូវសិស្ស', 'ទុតិយា ឯក បុំ', 'sissa'),
    g('passati', 'ឃើញ', 'កិរិយា ៣ ឯក បច្ចុ', 'passati'),
  ], ['u4', 'basic']),
  s('s013', 'Puriso bhattaṃ bhuñjati.', 'បុរសញ៉ាំបាយ។', [
    g('puriso', 'បុរស', 'បឋមា ឯក បុំ', 'purisa'),
    g('bhattaṃ', 'នូវបាយ', 'ទុតិយា ឯក នបុំ', 'bhatta'),
    g('bhuñjati', 'ញ៉ាំ', 'កិរិយា ៣ ឯក បច្ចុ', 'bhunjati'),
  ], ['u4', 'basic']),
  s('s014', 'Dārikā pupphāni āharati.', 'ក្មេងស្រីនាំយកផ្កាមក។', [
    g('dārikā', 'ក្មេងស្រី', 'បឋមា ឯក ឥត្ថី', 'darika'),
    g('pupphāni', 'នូវផ្កាទាំងឡាយ', 'ទុតិយា ពហុ នបុំ', 'puppha'),
    g('āharati', 'នាំមក', 'កិរិយា ៣ ឯក បច្ចុ', 'aharati'),
  ], ['u4', 'basic']),
  s('s015', 'Sissā ācariyaṃ pucchanti.', 'សិស្សទាំងឡាយសួរគ្រូ។', [
    g('sissā', 'សិស្សទាំងឡាយ', 'បឋមា ពហុ បុំ', 'sissa'),
    g('ācariyaṃ', 'នូវគ្រូ', 'ទុតិយា ឯក បុំ', 'acariya'),
    g('pucchanti', 'សួរ', 'កិរិយា ៣ ពហុ បច្ចុ', 'pucchati'),
  ], ['u4', 'basic']),

  /* --- locative and instrumental ---------------------------------------- */
  s('s020', 'Manussā gāme vasanti.', 'មនុស្សទាំងឡាយរស់នៅក្នុងភូមិ។', [
    g('manussā', 'មនុស្សទាំងឡាយ', 'បឋមា ពហុ បុំ', 'manussa'),
    g('gāme', 'ក្នុងភូមិ', 'សត្តមី ឯក បុំ', 'gama'),
    g('vasanti', 'រស់នៅ', 'កិរិយា ៣ ពហុ បច្ចុ', 'vasati'),
  ], ['u6', 'case']),
  s('s021', 'Migā vane caranti.', 'ក្តាន់ទាំងឡាយដើរក្នុងព្រៃ។', [
    g('migā', 'ក្តាន់ទាំងឡាយ', 'បឋមា ពហុ បុំ', 'miga'),
    g('vane', 'ក្នុងព្រៃ', 'សត្តមី ឯក នបុំ', 'vana'),
    g('caranti', 'ដើរ', 'កិរិយា ៣ ពហុ បច្ចុ', 'carati'),
  ], ['u6', 'case']),
  s('s022', 'Bhikkhu ācariyena saddhiṃ gacchati.', 'ភិក្ខុទៅជាមួយនឹងគ្រូ។', [
    g('bhikkhu', 'ភិក្ខុ', 'បឋមា ឯក បុំ', 'bhikkhu'),
    g('ācariyena', 'ដោយគ្រូ', 'តតិយា ឯក បុំ', 'acariya'),
    g('saddhiṃ', 'ជាមួយនឹង', 'និបាត', 'saddhim'),
    g('gacchati', 'ទៅ', 'កិរិយា ៣ ឯក បច្ចុ', 'gacchati'),
  ], ['u6', 'case']),
  s('s023', 'Kassako hatthinā khettaṃ karoti.', 'កសិករធ្វើស្រែដោយដំរី។', [
    g('kassako', 'កសិករ', 'បឋមា ឯក បុំ', 'kassaka'),
    g('hatthinā', 'ដោយដំរី', 'តតិយា ឯក បុំ', 'hatthi'),
    g('khettaṃ', 'នូវស្រែ', 'ទុតិយា ឯក នបុំ', 'khetta'),
    g('karoti', 'ធ្វើ', 'កិរិយា ៣ ឯក បច្ចុ', 'karoti'),
  ], ['u6', 'case']),

  /* --- dative, ablative, genitive --------------------------------------- */
  s('s030', 'Buddho bhikkhūnaṃ dhammaṃ deseti.', 'ព្រះពុទ្ធសំដែងធម៌ដល់ភិក្ខុទាំងឡាយ។', [
    g('buddho', 'ព្រះពុទ្ធ', 'បឋមា ឯក បុំ', 'buddha'),
    g('bhikkhūnaṃ', 'ដល់ភិក្ខុទាំងឡាយ', 'ចតុត្ថី ពហុ បុំ', 'bhikkhu'),
    g('dhammaṃ', 'នូវធម៌', 'ទុតិយា ឯក បុំ', 'dhamma'),
    g('deseti', 'សំដែង', 'កិរិយា ៣ ឯក បច្ចុ', 'deseti'),
  ], ['u6', 'case', 'sutta']),
  s('s031', 'Upāsako bhikkhussa bhattaṃ deti.', 'ឧបាសកប្រគេនបាយដល់ភិក្ខុ។', [
    g('upāsako', 'ឧបាសក', 'បឋមា ឯក បុំ', 'upasaka'),
    g('bhikkhussa', 'ដល់ភិក្ខុ', 'ចតុត្ថី ឯក បុំ', 'bhikkhu'),
    g('bhattaṃ', 'នូវបាយ', 'ទុតិយា ឯក នបុំ', 'bhatta'),
    g('deti', 'ឲ្យ', 'កិរិយា ៣ ឯក បច្ចុ', 'deti'),
  ], ['u6', 'case', 'dana']),
  s('s032', 'Buddhassa dhammo sundaro hoti.', 'ធម៌របស់ព្រះពុទ្ធពិរោះ។', [
    g('buddhassa', 'របស់ព្រះពុទ្ធ', 'ឆដ្ឋី ឯក បុំ', 'buddha'),
    g('dhammo', 'ធម៌', 'បឋមា ឯក បុំ', 'dhamma'),
    g('sundaro', 'ពិរោះ', 'បឋមា ឯក បុំ (គុណនាម)', 'sundara'),
    g('hoti', 'ជា', 'កិរិយា ៣ ឯក បច្ចុ', 'hoti'),
  ], ['u6', 'case']),
  s('s033', 'Bhikkhū gāmā nagaraṃ gacchanti.', 'ភិក្ខុទាំងឡាយទៅទីក្រុងពីភូមិ។', [
    g('bhikkhū', 'ភិក្ខុទាំងឡាយ', 'បឋមា ពហុ បុំ', 'bhikkhu'),
    g('gāmā', 'ពីភូមិ', 'បញ្ចមី ឯក បុំ', 'gama'),
    g('nagaraṃ', 'ទៅទីក្រុង', 'ទុតិយា ឯក នបុំ', 'nagara'),
    g('gacchanti', 'ទៅ', 'កិរិយា ៣ ពហុ បច្ចុ', 'gacchati'),
  ], ['u6', 'case']),

  /* --- tenses ------------------------------------------------------------ */
  s('s040', 'Sisso pāṭhaṃ paṭhissati.', 'សិស្សនឹងអានមេរៀន។', [
    g('sisso', 'សិស្ស', 'បឋមា ឯក បុំ', 'sissa'),
    g('pāṭhaṃ', 'នូវមេរៀន', 'ទុតិយា ឯក បុំ'),
    g('paṭhissati', 'នឹងអាន', 'កិរិយា ៣ ឯក អនាគត', 'pathati'),
  ], ['u9', 'tense']),
  s('s041', 'Buddho dhammaṃ desesi.', 'ព្រះពុទ្ធបានសំដែងធម៌។', [
    g('buddho', 'ព្រះពុទ្ធ', 'បឋមា ឯក បុំ', 'buddha'),
    g('dhammaṃ', 'នូវធម៌', 'ទុតិយា ឯក បុំ', 'dhamma'),
    g('desesi', 'បានសំដែង', 'កិរិយា ៣ ឯក អតីត', 'deseti'),
  ], ['u9', 'tense']),
  s('s042', 'Sabbe sattā sukhī hontu.', 'សូមឲ្យសត្វទាំងអស់មានសុខ។', [
    g('sabbe', 'ទាំងអស់', 'បឋមា ពហុ បុំ', 'sabba'),
    g('sattā', 'សត្វទាំងឡាយ', 'បឋមា ពហុ បុំ', 'satta'),
    g('sukhī', 'មានសុខ', 'បឋមា ពហុ បុំ'),
    g('hontu', 'ចូរជា', 'កិរិយា ៣ ពហុ បញ្ជា', 'hoti'),
  ], ['u9', 'tense', 'metta', 'chant']),
  s('s043', 'Sace so gaccheyya ahaṃ pi gaccheyyāmi.', 'បើគាត់ទៅ ខ្ញុំក៏ទៅដែរ។', [
    g('sace', 'ប្រសិនបើ', 'និបាត', 'sace'),
    g('so', 'គាត់', 'បឋមា ឯក បុំ', 'ta_m'),
    g('gaccheyya', 'គប្បីទៅ', 'កិរិយា ៣ ឯក សត្តមី', 'gacchati'),
    g('ahaṃ', 'ខ្ញុំ', 'បឋមា ឯក', 'amha'),
    g('pi', 'ក៏', 'និបាត', 'api'),
    g('gaccheyyāmi', 'គប្បីទៅ', 'កិរិយា ១ ឯក សត្តមី', 'gacchati'),
  ], ['u9', 'tense']),

  /* --- participles and absolutives: the key to sutta prose --------------- */
  s('s050', 'Bhikkhu gāmaṃ gantvā bhattaṃ labhati.', 'ភិក្ខុទៅភូមិរួច ទទួលបាយ។', [
    g('bhikkhu', 'ភិក្ខុ', 'បឋមា ឯក បុំ', 'bhikkhu'),
    g('gāmaṃ', 'ទៅភូមិ', 'ទុតិយា ឯក បុំ', 'gama'),
    g('gantvā', 'ទៅរួច', 'បុព្វកិរិយា', 'gacchati'),
    g('bhattaṃ', 'នូវបាយ', 'ទុតិយា ឯក នបុំ', 'bhatta'),
    g('labhati', 'ទទួល', 'កិរិយា ៣ ឯក បច្ចុ', 'labhati'),
  ], ['u10', 'participle']),
  s('s051', 'Dhammaṃ sutvā upāsako pasīdati.', 'ស្តាប់ធម៌រួច ឧបាសកជ្រះថ្លា។', [
    g('dhammaṃ', 'នូវធម៌', 'ទុតិយា ឯក បុំ', 'dhamma'),
    g('sutvā', 'ស្តាប់រួច', 'បុព្វកិរិយា', 'sunati'),
    g('upāsako', 'ឧបាសក', 'បឋមា ឯក បុំ', 'upasaka'),
    g('pasīdati', 'ជ្រះថ្លា', 'កិរិយា ៣ ឯក បច្ចុ', 'pasidati'),
  ], ['u10', 'participle']),
  s('s052', 'Gacchanto bhikkhu dhammaṃ cinteti.', 'ភិក្ខុកំពុងដើរ គិតពីធម៌។', [
    g('gacchanto', 'កំពុងទៅ', 'បច្ចុប្បន្នកិរិយា បឋមា ឯក', 'gacchati'),
    g('bhikkhu', 'ភិក្ខុ', 'បឋមា ឯក បុំ', 'bhikkhu'),
    g('dhammaṃ', 'នូវធម៌', 'ទុតិយា ឯក បុំ', 'dhamma'),
    g('cinteti', 'គិត', 'កិរិយា ៣ ឯក បច្ចុ', 'cinteti'),
  ], ['u10', 'participle']),
  s('s053', 'Buddhena desito dhammo sabbehi sotabbo.', 'ធម៌ដែលព្រះពុទ្ធសំដែងហើយ គួរស្តាប់ដោយអ្នកទាំងអស់។', [
    g('buddhena', 'ដោយព្រះពុទ្ធ', 'តតិយា ឯក បុំ', 'buddha'),
    g('desito', 'ដែលសំដែងហើយ', 'កិរិយាអតីត បឋមា ឯក', 'deseti'),
    g('dhammo', 'ធម៌', 'បឋមា ឯក បុំ', 'dhamma'),
    g('sabbehi', 'ដោយអ្នកទាំងអស់', 'តតិយា ពហុ បុំ', 'sabba'),
    g('sotabbo', 'គួរស្តាប់', 'កិច្ចកិរិយា បឋមា ឯក', 'sunati'),
  ], ['u10', 'participle', 'passive']),
  s('s054', 'Dhammaṃ sotuṃ manussā āgacchanti.', 'មនុស្សទាំងឡាយមក ដើម្បីស្តាប់ធម៌។', [
    g('dhammaṃ', 'នូវធម៌', 'ទុតិយា ឯក បុំ', 'dhamma'),
    g('sotuṃ', 'ដើម្បីស្តាប់', 'និមិត្តកិរិយា', 'sunati'),
    g('manussā', 'មនុស្សទាំងឡាយ', 'បឋមា ពហុ បុំ', 'manussa'),
    g('āgacchanti', 'មក', 'កិរិយា ៣ ពហុ បច្ចុ', 'agacchati'),
  ], ['u10', 'participle']),

  /* --- doctrinal sentences ---------------------------------------------- */
  s('s060', 'Sabbe saṅkhārā aniccā.', 'សង្ខារទាំងអស់មិនទៀង។', [
    g('sabbe', 'ទាំងអស់', 'បឋមា ពហុ បុំ', 'sabba'),
    g('saṅkhārā', 'សង្ខារទាំងឡាយ', 'បឋមា ពហុ បុំ', 'sankhara'),
    g('aniccā', 'មិនទៀង', 'បឋមា ពហុ បុំ (គុណនាម)', 'anicca'),
  ], ['u13', 'tilakkhana', 'dhammapada'], 'ធម្មបទ ២៧៧'),
  s('s061', 'Sabbe dhammā anattā.', 'ធម៌ទាំងអស់មិនមែនខ្លួន។', [
    g('sabbe', 'ទាំងអស់', 'បឋមា ពហុ បុំ', 'sabba'),
    g('dhammā', 'ធម៌ទាំងឡាយ', 'បឋមា ពហុ បុំ', 'dhamma'),
    g('anattā', 'មិនមែនខ្លួន', 'បឋមា ពហុ បុំ', 'anatta'),
  ], ['u13', 'tilakkhana', 'dhammapada'], 'ធម្មបទ ២៧៩'),
  s('s062', 'Natthi santi paraṃ sukhaṃ.', 'គ្មានសុខណាលើសពីសេចក្តីស្ងប់ទេ។', [
    g('natthi', 'មិនមាន', 'កិរិយា ៣ ឯក បច្ចុ', 'atthi'),
    g('santi', 'សេចក្តីស្ងប់', 'បឋមា ឯក ឥត្ថី'),
    g('paraṃ', 'លើសពី', 'ទុតិយា ឯក'),
    g('sukhaṃ', 'សុខ', 'បឋមា ឯក នបុំ', 'sukha_n'),
  ], ['u13', 'dhammapada'], 'ធម្មបទ ២០២'),
  s('s063', 'Cittena niyyati loko.', 'លោកត្រូវនាំទៅដោយចិត្ត។', [
    g('cittena', 'ដោយចិត្ត', 'តតិយា ឯក នបុំ', 'citta'),
    g('niyyati', 'ត្រូវនាំទៅ', 'កិរិយា ៣ ឯក កម្មវាចក'),
    g('loko', 'លោក', 'បឋមា ឯក បុំ', 'loka'),
  ], ['u13', 'sutta'], 'សំយុត្តនិកាយ'),
  s('s064', 'Attā hi attano nātho.', 'ខ្លួនឯងហ្នឹងហើយ ជាទីពឹងរបស់ខ្លួន។', [
    g('attā', 'ខ្លួន', 'បឋមា ឯក បុំ', 'attan'),
    g('hi', 'ព្រោះថា', 'និបាត', 'hi'),
    g('attano', 'របស់ខ្លួន', 'ឆដ្ឋី ឯក បុំ', 'attan'),
    g('nātho', 'ទីពឹង', 'បឋមា ឯក បុំ'),
  ], ['u13', 'dhammapada'], 'ធម្មបទ ១៦០'),

  /* --- sutta formulae ---------------------------------------------------- */
  s('s070', 'Evaṃ me sutaṃ.', 'ខ្ញុំបានឮមកយ៉ាងនេះ។', [
    g('evaṃ', 'យ៉ាងនេះ', 'និបាត', 'evam'),
    g('me', 'ដោយខ្ញុំ', 'តតិយា ឯក', 'amha'),
    g('sutaṃ', 'ត្រូវបានឮ', 'កិរិយាអតីត បឋមា ឯក នបុំ', 'sunati'),
  ], ['u16', 'formula', 'sutta'],
    'ជាឃ្លាបើកព្រះសូត្រគ្រប់ព្រះសូត្រ — ពាក្យរបស់ព្រះអានន្ទ'),
  s('s071', 'Ekaṃ samayaṃ bhagavā sāvatthiyaṃ viharati.', 'សម័យមួយ ព្រះមានព្រះភាគគង់នៅក្នុងក្រុងសាវត្ថី។', [
    g('ekaṃ', 'មួយ', 'ទុតិយា ឯក', 'eka'),
    g('samayaṃ', 'សម័យ', 'ទុតិយា ឯក បុំ'),
    g('bhagavā', 'ព្រះមានព្រះភាគ', 'បឋមា ឯក បុំ', 'bhagavant'),
    g('sāvatthiyaṃ', 'ក្នុងក្រុងសាវត្ថី', 'សត្តមី ឯក ឥត្ថី'),
    g('viharati', 'គង់នៅ', 'កិរិយា ៣ ឯក បច្ចុ', 'viharati'),
  ], ['u16', 'formula', 'sutta']),
  s('s072', 'Bhagavā etadavoca.', 'ព្រះមានព្រះភាគបានត្រាស់ពាក្យនេះ។', [
    g('bhagavā', 'ព្រះមានព្រះភាគ', 'បឋមា ឯក បុំ', 'bhagavant'),
    g('etad', 'នូវពាក្យនេះ', 'ទុតិយា ឯក នបុំ'),
    g('avoca', 'បានត្រាស់', 'កិរិយា ៣ ឯក អតីត', 'vadati'),
  ], ['u16', 'formula', 'sutta'],
    'សន្ធិ៖ ឯតំ + អវោច = ឯតទវោច'),
  s('s073', 'Idaṃ vatvā sugato uṭṭhāyāsanā pakkāmi.', 'ព្រះសុគតត្រាស់ពាក្យនេះរួច ក្រោកពីអាសនៈយាងចេញទៅ។', [
    g('idaṃ', 'នូវពាក្យនេះ', 'ទុតិយា ឯក នបុំ', 'ima_m'),
    g('vatvā', 'ត្រាស់រួច', 'បុព្វកិរិយា', 'vadati'),
    g('sugato', 'ព្រះសុគត', 'បឋមា ឯក បុំ'),
    g('uṭṭhāyāsanā', 'ក្រោកពីអាសនៈ', 'បុព្វកិរិយា + បញ្ចមី'),
    g('pakkāmi', 'យាងចេញទៅ', 'កិរិយា ៣ ឯក អតីត'),
  ], ['u16', 'formula', 'sutta']),

  /* --- commentary style --------------------------------------------------- */
  s('s080', 'Buddhoti kena aṭṭhena buddho?', 'ពាក្យថា «ពុទ្ធ» — ដោយអត្ថន័យអ្វីទើបហៅថាពុទ្ធ?', [
    g('buddhoti', 'ថា «ពុទ្ធ»', 'បឋមា + ឥតិ', 'buddha'),
    g('kena', 'ដោយអ្វី', 'តតិយា ឯក', 'ka_m'),
    g('aṭṭhena', 'ដោយអត្ថន័យ', 'តតិយា ឯក បុំ', 'attha'),
    g('buddho', 'ពុទ្ធ', 'បឋមា ឯក បុំ', 'buddha'),
  ], ['u17', 'commentary'],
    'ជារបៀបសួរឆ្លើយស្តង់ដារបស់អដ្ឋកថា'),
  s('s081', 'Bujjhitā saccānīti buddho.', 'អ្នកត្រាស់ដឹងនូវសច្ចៈទាំងឡាយ ដូច្នេះហៅថា ពុទ្ធ។', [
    g('bujjhitā', 'អ្នកត្រាស់ដឹង', 'បឋមា ឯក បុំ'),
    g('saccāni', 'នូវសច្ចៈទាំងឡាយ', 'ទុតិយា ពហុ នបុំ', 'sacca'),
    g('iti', 'ដូច្នេះ', 'និបាត', 'iti'),
    g('buddho', 'ពុទ្ធ', 'បឋមា ឯក បុំ', 'buddha'),
  ], ['u17', 'commentary'],
    'ជានិយមន័យបែបអដ្ឋកថា៖ … ឥតិ + ពាក្យដែលត្រូវពន្យល់'),
  s('s082', 'Tattha katamo dhammo kusalo?', 'ក្នុងទីនោះ ធម៌អ្វីជាកុសល?', [
    g('tattha', 'ក្នុងទីនោះ', 'និបាត', 'tattha'),
    g('katamo', 'អ្វី, មួយណា', 'បឋមា ឯក បុំ'),
    g('dhammo', 'ធម៌', 'បឋមា ឯក បុំ', 'dhamma'),
    g('kusalo', 'ជាកុសល', 'បឋមា ឯក បុំ', 'kusala'),
  ], ['u18', 'abhidhamma'],
    'ជាទម្រង់សំណួររបស់គម្ពីរធម្មសង្គណី'),
];

export const SENTENCE_BY_ID = new Map(SENTENCES.map((x) => [x.id, x]));

export function sentenceById(id: string): Sentence | undefined {
  return SENTENCE_BY_ID.get(id);
}
