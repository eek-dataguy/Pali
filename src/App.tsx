import { useEffect } from 'react';
import { navigate, useRoute } from './lib/router';
import { useStore } from './lib/store';
import Home from './pages/Home';
import LessonPage from './pages/LessonPage';
import ReviewPage from './pages/ReviewPage';
import Reference from './pages/Reference';
import Reader from './pages/Reader';
import Profile from './pages/Profile';
import Welcome from './pages/Welcome';

export default function App() {
  const route = useRoute();
  const placementDone = useStore((s) => s.placementDone);

  useEffect(() => {
    if (!window.location.hash) navigate('/');
  }, []);

  if (!placementDone && route.parts[0] !== 'welcome') {
    return <Welcome />;
  }

  const [head, ...rest] = route.parts;

  switch (head) {
    case undefined:
      return <Shell><Home /></Shell>;
    case 'lesson':
      return <LessonPage lessonId={rest[0]} />;
    case 'review':
      return <ReviewPage mode={rest[0] === 'weak' ? 'weak' : 'due'} />;
    case 'reference':
      return <Shell><Reference tab={rest[0]} /></Shell>;
    case 'read':
      return <Shell><Reader passageId={rest[0]} /></Shell>;
    case 'profile':
      return <Shell><Profile /></Shell>;
    case 'welcome':
      return <Welcome />;
    default:
      return <Shell><Home /></Shell>;
  }
}

/** Page chrome: content plus the bottom navigation bar. */
function Shell({ children }: { children: React.ReactNode }) {
  const route = useRoute();
  const tab = route.parts[0] ?? '';
  const items = [
    { id: '', icon: '🪷', label: 'រៀន', to: '/' },
    { id: 'read', icon: '📖', label: 'អាន', to: '/read' },
    { id: 'reference', icon: '📚', label: 'ឯកសារ', to: '/reference' },
    { id: 'profile', icon: '👤', label: 'ខ្ញុំ', to: '/profile' },
  ];

  return (
    <div className="min-h-screen pb-20">
      {children}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-xl">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.to)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition
                ${tab === item.id ? 'text-saffron-600' : 'text-stone-400'}`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
