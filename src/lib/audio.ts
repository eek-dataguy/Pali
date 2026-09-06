/**
 * Speech for listening and chanting practice.
 *
 * No browser ships a Pali voice, so we borrow the closest available one. Indic
 * voices (Hindi, Sanskrit, Tamil) and Thai render Pali syllables far more
 * accurately than an English voice, which mangles the long vowels and
 * aspirates the app is trying to teach. If nothing suitable exists we report
 * that honestly and the generator omits listening exercises rather than
 * teaching a wrong pronunciation.
 */

const PREFERRED = ['sa', 'hi-IN', 'hi', 'ne-NP', 'mr-IN', 'ta-IN', 'th-TH', 'si-LK', 'km-KH'];

let cached: SpeechSynthesisVoice | null | undefined;

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
}

export function pickVoice(): SpeechSynthesisVoice | null {
  if (cached !== undefined) return cached;
  const s = synth();
  if (!s) return (cached = null);
  const voices = s.getVoices();
  if (!voices.length) {
    cached = undefined; // voices load asynchronously; try again later
    return null;
  }
  for (const tag of PREFERRED) {
    const hit = voices.find((v) => v.lang.toLowerCase().startsWith(tag.toLowerCase()));
    if (hit) return (cached = hit);
  }
  return (cached = voices[0] ?? null);
}

export function audioAvailable(): boolean {
  return !!synth() && !!pickVoice();
}

/** True when we are only approximating with a non-Indic voice. */
export function isApproximateVoice(): boolean {
  const v = pickVoice();
  if (!v) return true;
  return !PREFERRED.some((tag) => v.lang.toLowerCase().startsWith(tag.toLowerCase()));
}

export function speak(text: string, rate = 0.75): void {
  const s = synth();
  if (!s) return;
  s.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  utterance.rate = rate;
  utterance.pitch = 1;
  s.speak(utterance);
}

export function stopSpeaking(): void {
  synth()?.cancel();
}

/** Voices arrive asynchronously in most browsers; re-run the callback when they do. */
export function onVoicesReady(cb: () => void): () => void {
  const s = synth();
  if (!s) return () => {};
  const handler = () => {
    cached = undefined;
    cb();
  };
  s.addEventListener('voiceschanged', handler);
  return () => s.removeEventListener('voiceschanged', handler);
}
