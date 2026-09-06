import { useMemo } from 'react';
import { buildReview, buildTargetedPractice } from '../lib/exercises';
import { audioAvailable } from '../lib/audio';
import { navigate } from '../lib/router';
import { dueCardIds, useStore, weakCardIds } from '../lib/store';
import { LessonRunner } from '../components/LessonRunner';

/**
 * Review sessions. "due" is the scheduler's queue; "weak" ignores the schedule
 * and drills whatever the learner keeps getting wrong.
 */
export default function ReviewPage({ mode }: { mode: 'due' | 'weak' }) {
  const cards = useStore((s) => s.cards);
  const audio = useStore((s) => s.profile.audio);
  const addXp = useStore((s) => s.addXp);

  const exercises = useMemo(() => {
    const opts = { audio: audio && audioAvailable(), seed: Date.now() };
    return mode === 'weak'
      ? buildTargetedPractice(weakCardIds(cards, 25), opts)
      : buildReview(dueCardIds(cards), opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  if (!exercises.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-6xl">🌿</div>
        <h2 className="text-xl font-bold">គ្មានអ្វីត្រូវរំឭកឥឡូវទេ</h2>
        <p className="max-w-sm text-stone-600">
          ការរំឭកនឹងលេចឡើងវិញ ត្រង់ពេលដែលអ្នកជិតភ្លេច។ ចូររៀនមេរៀនថ្មីជាមុនសិន។
        </p>
        <button type="button" onClick={() => navigate('/')} className="btn-primary">ត្រលប់ក្រោយ</button>
      </div>
    );
  }

  return (
    <LessonRunner
      exercises={exercises}
      title={mode === 'weak' ? 'ពង្រឹងចំណុចខ្សោយ' : 'ការរំឭកឡើងវិញ'}
      xpReward={mode === 'weak' ? 30 : 40}
      onQuit={() => navigate('/')}
      onFinish={(result) => {
        addXp(result.xp, result.seconds);
        navigate('/');
      }}
    />
  );
}
