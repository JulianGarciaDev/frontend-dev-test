export const API_BASE_URL = 'https://itx-frontend-test.onrender.com/api';

const RETRY_CODES = [408, 429, 500, 502, 503, 504];
const RETRIES = 2;
const RETRY_BASE_DELAY_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options, retries = RETRIES, baseDelay = RETRY_BASE_DELAY_MS) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || !RETRY_CODES.includes(response.status) || i === retries) {
        return response;
      }
    } catch (err) {
      if (i === retries) throw err;
      const nextDelay = baseDelay * Math.pow(2, i);
      console.warn(`Intento ${i + 1} fallido. Reintentando en ${nextDelay}ms...`, err.message);
      await sleep(nextDelay);
    }
  }
}

export async function fetchAPI(endpoint, options = {}) {
  const { retries, retryDelay, ...fetchOptions } = options;

  const res = await fetchWithRetry(
    `${API_BASE_URL}${endpoint}`,
    {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    },
    retries,
    retryDelay
  );

  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}