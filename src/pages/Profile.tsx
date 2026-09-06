import { useRef, useState } from 'react';
import { LESSONS } from '../content/curriculum';
import { describeCard } from '../lib/exercises';
import { audioAvailable, isApproximateVoice } from '../lib/audio';
import {
  dueCount, fadingCards, overallMastery, recentActivity, reviewForecast,
  todayStat, useStore, weakTags,
} from '../lib/store';
import { khmerNumber } from '../lib/pali';
import { Bar, KhmerNumber, Pill, ProgressRing } from '../components/ui';

/**
 * Progress and settings.
 *
 * The forecast and the strength list are here for a reason: spaced repetition
 * asks for trust, and a learner who can see that today's twelve reviews become
 * four next week is far likelier to keep going.
 */

export default function Profile() {
  const store = useStore();
  const { profile, cards, lessons, daily, streak, bestStreak, xp } = store;
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const done = LESSONS.filter((l) => lessons[l.id]).length;
  const forecast = reviewForecast(cards, 14);
  const activity = recentActivity(daily, 14);
  const weak = weakTags(store.tagStats);
  const fading = fadingCards(cards, 8);
  const today = todayStat(daily);
  const maxForecast = Math.max(1, ...forecast);
  const maxXp = Math.max(1, ...activity.map((a) => a.xp));

  const exportProgress = () => {
    const data = JSON.stringify({
      profile, xp, streak, bestStreak, lastActiveDay: store.lastActiveDay,
      cards, lessons, tagStats: store.tagStats, daily, placementDone: true,
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pali-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-8 pt-4">
      <h1 className="mb-4 text-2xl font-bold">{profile.name || 'វឌ្ឍនភាពរបស់ខ្ញុំ'}</h1>

      <div className="mb-5 grid grid-cols-4 gap-2 text-center">
        <StatBox label="ថ្ងៃជាប់គ្នា" value={<KhmerNumber value={streak} />} icon="🔥" />
        <StatBox label="ពិន្ទុសរុប" value={<KhmerNumber value={xp} />} icon="⭐" />
        <StatBox label="មេរៀនចប់" value={<KhmerNumber value={done} />} icon="✅" />
        <StatBox label="ត្រូវរំឭក" value={<KhmerNumber value={dueCount(cards)} />} icon="🔁" />
      </div>

      <Section title="ការចងចាំរួម">
        <div className="flex items-center gap-4">
          <ProgressRing value={overallMastery(cards)} size={64} stroke={7} color="#35ac4b">
            {Math.round(overallMastery(cards) * 100)}%
          </ProgressRing>
          <div className="flex-1 text-sm text-stone-600">
            <p>សន្លឹកចងចាំសរុប៖ {khmerNumber(Object.keys(cards).length)}</p>
            <p>ថ្ងៃជាប់គ្នាច្រើនបំផុត៖ <KhmerNumber value={bestStreak} /> ថ្ងៃ</p>
            <p>ថ្ងៃនេះ៖ {khmerNumber(today.answers)} សំណួរ · {khmerNumber(Math.max(0, Math.round(today.seconds / 60)))} នាទី</p>
          </div>
        </div>
      </Section>

      <Section title="ការរំឭក ១៤ ថ្ងៃខាងមុខ" hint="ចំនួនសន្លឹកដែលនឹងដល់ពេលរំឭកនៅថ្ងៃនីមួយៗ">
        <div className="flex h-24 items-end gap-1">
          {forecast.map((n, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-sky-400"
                style={{ height: `${(n / maxForecast) * 100}%`, minHeight: n ? 3 : 0 }}
                title={`${n}`}
              />
              <span className="text-[9px] text-stone-400">{i === 0 ? 'ថ្ងៃនេះ' : i}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="សកម្មភាព ១៤ ថ្ងៃចុងក្រោយ">
        <div className="flex h-16 items-end gap-1">
          {activity.map((a) => (
            <div
              key={a.day}
              className={`flex-1 rounded-t ${a.xp ? 'bg-saffron-400' : 'bg-stone-200'}`}
              style={{ height: a.xp ? `${(a.xp / maxXp) * 100}%` : '6px' }}
              title={`${a.day}: ${a.xp} XP`}
            />
          ))}
        </div>
      </Section>

      {weak.length > 0 && (
        <Section title="ចំណុចដែលគួរពង្រឹង">
          <div className="space-y-2">
            {weak.slice(0, 5).map((w) => (
              <div key={w.tag} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-sm">{w.tag}</span>
                <Bar value={w.accuracy} />
                <span className="w-10 shrink-0 text-right text-xs text-stone-500">
                  {Math.round(w.accuracy * 100)}%
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {fading.length > 0 && (
        <Section title="ជិតភ្លេច" hint="សន្លឹកដែលឱកាសនឹកឃើញធ្លាក់ចុះជាងគេ">
          <div className="flex flex-wrap gap-1.5">
            {fading.map((f) => {
              const d = describeCard(f.id);
              return (
                <span key={f.id} className="rounded-lg bg-stone-100 px-2 py-1 text-xs">
                  <span className="pali-iast">{d.title}</span>
                  <span className="ml-1 text-stone-400">{Math.round(f.r * 100)}%</span>
                </span>
              );
            })}
          </div>
        </Section>
      )}

      <Section title="ការកំណត់">
        <Setting label="គោលដៅប្រចាំថ្ងៃ">
          <div className="flex gap-2">
            {[30, 60, 120, 200].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => store.setProfile({ dailyGoal: v })}
                className={`flex-1 rounded-lg border-2 py-2 text-sm font-semibold
                  ${profile.dailyGoal === v ? 'border-saffron-400 bg-saffron-50' : 'border-stone-200'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </Setting>

        <Setting label="ពាក្យថ្មីក្នុងមួយថ្ងៃ">
          <div className="flex gap-2">
            {[6, 12, 20, 30].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => store.setProfile({ newPerDay: v })}
                className={`flex-1 rounded-lg border-2 py-2 text-sm font-semibold
                  ${profile.newPerDay === v ? 'border-saffron-400 bg-saffron-50' : 'border-stone-200'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </Setting>

        <Setting label="របៀបបង្ហាញភាសាបាលី">
          <div className="flex gap-2">
            {[
              { v: 'khmer' as const, k: 'ខ្មែរ' },
              { v: 'both' as const, k: 'ទាំងពីរ' },
              { v: 'iast' as const, k: 'ឡាតាំង' },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => store.setProfile({ script: o.v })}
                className={`flex-1 rounded-lg border-2 py-2 text-sm font-semibold
                  ${profile.script === o.v ? 'border-saffron-400 bg-saffron-50' : 'border-stone-200'}`}
              >
                {o.k}
              </button>
            ))}
          </div>
        </Setting>

        <Setting label="សំឡេង">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={profile.audio}
              onChange={(e) => store.setProfile({ audio: e.target.checked })}
              className="h-5 w-5 accent-saffron-500"
            />
            បើកលំហាត់ស្តាប់ និងការអានឮៗ
          </label>
          {!audioAvailable() && (
            <p className="mt-2 text-xs text-stone-500">
              ឧបករណ៍នេះមិនមានសំឡេងអានទេ — លំហាត់ស្តាប់នឹងមិនបង្ហាញ។
            </p>
          )}
          {audioAvailable() && isApproximateVoice() && (
            <p className="mt-2 text-xs text-stone-500">
              ⚠️ គ្មានសំឡេងបាលីពិតប្រាកដទេ។ យើងប្រើសំឡេងជិតខាងបំផុតដែលមាន ដូច្នេះការបញ្ចេញសំឡេង
              គ្រាន់តែជាការប៉ាន់ស្មាន — សូមយកការសូត្ររបស់គ្រូជាគោល។
            </p>
          )}
          <div className="mt-3">
            <p className="mb-1 text-xs text-stone-500">ល្បឿនអាន</p>
            <input
              type="range" min={0.4} max={1.2} step={0.05}
              value={profile.speechRate}
              onChange={(e) => store.setProfile({ speechRate: Number(e.target.value) })}
              className="w-full accent-saffron-500"
            />
          </div>
        </Setting>
      </Section>

      <Section title="ទិន្នន័យរបស់អ្នក" hint="ទិន្នន័យទាំងអស់រក្សាទុកក្នុងឧបករណ៍នេះតែប៉ុណ្ណោះ — គ្មានផ្ញើទៅណាទេ។">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={exportProgress} className="btn-ghost py-2 text-sm">
            នាំចេញ (JSON)
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost py-2 text-sm">
            នាំចូល
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const ok = store.importState(await file.text());
            setMessage(ok ? 'នាំចូលបានសម្រេច។' : 'ឯកសារមិនត្រឹមត្រូវទេ។');
          }}
        />
        {message && <p className="mt-2 text-sm text-stone-600">{message}</p>}

        <button
          type="button"
          onClick={() => {
            if (confirm('លុបវឌ្ឍនភាពទាំងអស់មែនទេ? សកម្មភាពនេះមិនអាចត្រលប់វិញបានទេ។')) {
              store.resetAll();
              location.hash = '#/';
            }
          }}
          className="mt-3 w-full rounded-xl border-2 border-red-200 py-2 text-sm font-semibold text-red-600"
        >
          លុបវឌ្ឍនភាពទាំងអស់
        </button>
      </Section>

      <p className="mt-6 text-center text-xs text-stone-400">
        សូមឲ្យការសិក្សានេះជាបច្ច័យដល់បញ្ញា និងសេចក្តីសុខ។ 🪷
      </p>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: React.ReactNode; icon: string }) {
  return (
    <div className="card px-2 py-3">
      <div className="text-lg leading-none">{icon}</div>
      <div className="mt-1 font-bold">{value}</div>
      <div className="text-[10px] text-stone-500">{label}</div>
    </div>
  );
}

function Section({
  title, hint, children,
}: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="card mb-4 px-4 py-4">
      <h2 className="font-bold">{title}</h2>
      {hint && <p className="mb-3 mt-0.5 text-xs text-stone-500">{hint}</p>}
      <div className={hint ? '' : 'mt-3'}>{children}</div>
    </section>
  );
}

function Setting({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-sm font-semibold text-stone-600">{label}</p>
      {children}
    </div>
  );
}

export { Pill };
