import { useMemo } from 'react';
import { LESSON_BY_ID, UNIT_BY_LESSON } from '../content/curriculum';
import { buildLesson } from '../lib/exercises';
import { audioAvailable } from '../lib/audio';
import { navigate } from '../lib/router';
import { dueCardIds, useStore } from '../lib/store';
import { LessonRunner } from '../components/LessonRunner';

export default function LessonPage({ lessonId }: { lessonId?: string }) {
  const lesson = lessonId ? LESSON_BY_ID.get(lessonId) : undefined;
  const cards = useStore((s) => s.cards);
  const audio = useStore((s) => s.profile.audio);
  const script = useStore((s) => s.profile.script);
  const finishLesson = useStore((s) => s.finishLesson);

  /* Built once per mount: rebuilding on every keystroke would reshuffle the
     session under the learner's feet. */
  const exercises = useMemo(
    () => (lesson ? buildLesson(lesson, {
      audio: audio && audioAvailable(),
      script,
      dueCards: dueCardIds(cards).slice(0, 8),
      seed: Date.now(),
    }) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lesson?.id],
  );

  if (!lesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-stone-600">រកមេរៀននេះមិនឃើញទេ។</p>
        <button type="button" onClick={() => navigate('/')} className="btn-primary">ត្រលប់ក្រោយ</button>
      </div>
    );
  }

  const unit = UNIT_BY_LESSON.get(lesson.id);

  return (
    <LessonRunner
      exercises={exercises}
      title={`${unit?.kmTitle ?? ''} · ${lesson.kmTitle}`}
      xpReward={lesson.xp}
      onQuit={() => navigate('/')}
      onFinish={(result) => {
        const accuracy = result.answered ? result.correct / result.answered : 1;
        finishLesson(lesson.id, accuracy, result.xp, result.seconds);
        navigate('/');
      }}
    />
  );
}
