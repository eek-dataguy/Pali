import { useEffect, useState } from 'react';
import { toKhmer, khmerNumber } from '../lib/pali';
import { useStore } from '../lib/store';

/**
 * Shared presentation pieces. The important one is ScriptText: everywhere Pali
 * appears the learner can choose Khmer script, romanisation, or both, because
 * those serve different goals — Khmer script is what the Cambodian Tipitaka is
 * printed in, romanisation is what dictionaries and grammars use.
 */

export function ScriptText({
  pali, className = '', primary = 'auto',
}: {
  pali: string;
  className?: string;
  /** Force one script regardless of preference (used inside answer options). */
  primary?: 'auto' | 'khmer' | 'iast';
}) {
  const pref = useStore((s) => s.profile.script);
  const mode = primary === 'auto' ? pref : primary;

  if (mode === 'khmer') return <span className={`pali-khmer ${className}`}>{toKhmer(pali)}</span>;
  if (mode === 'iast') return <span className={`pali-iast ${className}`}>{pali}</span>;
  return (
    <span className={className}>
      <span className="pali-khmer">{toKhmer(pali)}</span>
      <span className="pali-iast ml-2 text-stone-500">{pali}</span>
    </span>
  );
}

/** Stacked display for headings: Khmer script large, romanisation beneath. */
export function ScriptHeading({ pali, className = '' }: { pali: string; className?: string }) {
  const pref = useStore((s) => s.profile.script);
  return (
    <div className={`text-center ${className}`}>
      {pref !== 'iast' && (
        <div className="pali-khmer text-3xl font-semibold leading-tight">{toKhmer(pali)}</div>
      )}
      {pref !== 'khmer' && (
        <div className={`pali-iast text-stone-500 ${pref === 'iast' ? 'text-3xl text-stone-900' : 'text-lg mt-1'}`}>
          {pali}
        </div>
      )}
    </div>
  );
}

export function ProgressRing({
  value, size = 44, stroke = 5, color = '#ff7f11', children,
}: {
  value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e7e5e4" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, Math.max(0, value)))}
          strokeLinecap="round" className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{children}</div>
    </div>
  );
}

export function Bar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-3 w-full overflow-hidden rounded-full bg-stone-200 ${className}`}>
      <div
        className="h-full rounded-full bg-leaf-500 transition-[width] duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
      />
    </div>
  );
}

export function Pill({
  children, tone = 'stone',
}: { children: React.ReactNode; tone?: 'stone' | 'leaf' | 'saffron' | 'sky' | 'red' }) {
  const tones = {
    stone: 'bg-stone-100 text-stone-600',
    leaf: 'bg-leaf-100 text-leaf-800',
    saffron: 'bg-saffron-100 text-saffron-800',
    sky: 'bg-sky-100 text-sky-800',
    red: 'bg-red-100 text-red-700',
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function KhmerNumber({ value }: { value: number }) {
  return <>{khmerNumber(value)}</>;
}

/** A table that scrolls horizontally rather than breaking the page layout. */
export function DataTable({
  caption, headers, rows,
}: { caption?: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200">
      <table className="w-full min-w-[26rem] border-collapse text-sm">
        {caption && (
          <caption className="bg-stone-50 px-3 py-2 text-left text-xs font-semibold text-stone-500">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="bg-stone-100">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-semibold text-stone-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 ? 'bg-stone-50/60' : ''}>
              {row.map((cell, j) => (
                <td key={j} className={`px-3 py-2 align-top ${j === 0 ? 'font-medium text-stone-600' : 'pali-iast'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Bottom sheet used for feedback after each answer. */
export function Sheet({
  open, tone, children,
}: { open: boolean; tone: 'correct' | 'wrong'; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 animate-slideup border-t-2 px-4 pb-6 pt-4 ${
        tone === 'correct' ? 'border-leaf-300 bg-leaf-50' : 'border-red-300 bg-red-50'
      }`}
    >
      <div className="mx-auto w-full max-w-xl">{children}</div>
    </div>
  );
}

/** Debounced value, used by the dictionary search box. */
export function useDebounced<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
