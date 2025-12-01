const CACHE_DURATION = 3600 * 1000; // 1 hora

export function getCachedData(key) {
  const cache = localStorage.getItem(key);
  const timestamp = localStorage.getItem(`${key}_ts`);

  if (cache && timestamp && Date.now() - parseInt(timestamp) < CACHE_DURATION) {
    return JSON.parse(cache);
  }

  return null;
}

export function setCachedData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(`${key}_ts`, Date.now().toString());
}