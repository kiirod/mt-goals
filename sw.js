

const NOTIF_SCHEDULE_KEY = 'monkeytype_goals_notif_schedule';
const NOTIF_GOALS_KEY    = 'monkeytype_goals';
const NOTIF_NEXT_KEY     = 'monkeytype_goals_notif_next';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('periodicsync', e => {
  if (e.tag === 'goal-reminder') {
    e.waitUntil(maybeNotify());
  }
});

self.addEventListener('message', async e => {
  if (e.data && e.data.type === 'CHECK_NOTIFY') {
    await maybeNotify();
  }
  if (e.data && e.data.type === 'SCHEDULE_UPDATE') {
  }
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'Goal Reminder', {
      body: data.body || 'Check your goals!',
      icon: '/images/mtg.png',
    })
  );
});

async function maybeNotify() {
  const [schedule, goals, nextTime] = await Promise.all([
    idbGet(NOTIF_SCHEDULE_KEY),
    idbGet(NOTIF_GOALS_KEY),
    idbGet(NOTIF_NEXT_KEY),
  ]);

  if (!schedule || schedule.type === 'never' || !schedule.ms) return;

  const now = Date.now();
  const next = nextTime ? parseInt(nextTime, 10) : 0;

  if (now < next) return;

  const goalsList = goals || [];
  if (!goalsList.length) return;

  const goal = goalsList[Math.floor(Math.random() * goalsList.length)].text;

  await self.registration.showNotification('Goal Reminder', {
    body: goal,
    icon: '/images/mtg.png',
    badge: '/images/mtg.png',
  });

  await idbSet(NOTIF_NEXT_KEY, (now + schedule.ms).toString());
}

function idbOpen() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('mtgoals_sw', 1);
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore('kv');
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

async function idbGet(key) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction('kv', 'readonly');
    const req = tx.objectStore('kv').get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror   = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction('kv', 'readwrite');
    const req = tx.objectStore('kv').put(value, key);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}
