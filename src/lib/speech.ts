/**
 * Speech recognition for pronunciation practice.
 *
 * No engine recognises Pali, so where recognition exists at all we run it with
 * the nearest Indic locale and treat the transcript as a rough signal only.
 * When it is unavailable — Firefox, Safari, or a denied microphone — the
 * exercise falls back to honest self-assessment, which is how shadowing
 * practice works anyway and is better than a confident wrong verdict.
 */

type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function constructor(): (new () => RecognitionLike) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => RecognitionLike) | null;
}

export function recognitionAvailable(): boolean {
  return constructor() !== null;
}

export type ListenResult =
  | { ok: true; transcript: string }
  | { ok: false; reason: 'unavailable' | 'denied' | 'silent' | 'error' };

/** Record one utterance and return what the engine thought it heard. */
export function listenOnce(lang = 'hi-IN', timeoutMs = 6000): Promise<ListenResult> {
  const Recognition = constructor();
  if (!Recognition) return Promise.resolve({ ok: false, reason: 'unavailable' });

  return new Promise((resolve) => {
    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    let settled = false;
    const finish = (result: ListenResult) => {
      if (settled) return;
      settled = true;
      try { recognition.stop(); } catch { /* already stopped */ }
      resolve(result);
    };

    const timer = setTimeout(() => finish({ ok: false, reason: 'silent' }), timeoutMs);

    recognition.onresult = (event) => {
      clearTimeout(timer);
      const best = event.results?.[0]?.[0]?.transcript ?? '';
      finish({ ok: true, transcript: best });
    };
    recognition.onerror = (event) => {
      clearTimeout(timer);
      finish({ ok: false, reason: event.error === 'not-allowed' ? 'denied' : 'error' });
    };
    recognition.onend = () => {
      clearTimeout(timer);
      finish({ ok: false, reason: 'silent' });
    };

    try {
      recognition.start();
    } catch {
      clearTimeout(timer);
      finish({ ok: false, reason: 'error' });
    }
  });
}

/**
 * How close a transcript is to the target, 0-1.
 *
 * Compared on diacritic-free skeletons because the recogniser is working in
 * another language's phonology; this is a similarity hint, never a verdict on
 * whether someone's Pali is correct.
 */
export function similarity(expected: string, heard: string): number {
  const a = expected.toLowerCase().replace(/[^a-zក-៿]/g, '');
  const b = heard.toLowerCase().replace(/[^a-zក-៿]/g, '');
  if (!a || !b) return 0;
  const distance = levenshtein(a, b);
  return Math.max(0, 1 - distance / Math.max(a.length, b.length));
}

function levenshtein(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length];
}
