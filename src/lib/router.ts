import { useEffect, useState } from 'react';

/**
 * A hash router in twenty lines.
 *
 * Hash routing means the built site works from any static host — GitHub Pages,
 * a USB stick, a phone opened offline in a temple — with no server rewrite
 * rules, which matters more here than pretty URLs.
 */

export type Route = { path: string; parts: string[] };

function current(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const parts = raw.split('/').filter(Boolean);
  return { path: `/${parts.join('/')}`, parts };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(current);
  useEffect(() => {
    const onChange = () => setRoute(current());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function navigate(to: string): void {
  window.location.hash = to.startsWith('/') ? `#${to}` : `#/${to}`;
  window.scrollTo(0, 0);
}
