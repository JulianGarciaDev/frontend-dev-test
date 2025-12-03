import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchAPI, API_BASE_URL } from './base';

describe('fetchAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns json when response.ok', async () => {
    const data = { ok: true };
    fetch.mockResolvedValue({ ok: true, status: 200, json: () => data });

    const result = await fetchAPI('/product');

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/product`, expect.any(Object));
    expect(result).toEqual(data);
  });

  it('merges default headers with custom ones', async () => {
    const data = { ok: true };
    fetch.mockResolvedValue({ ok: true, status: 200, json: () => data });

    await fetchAPI('/product', { headers: { Authorization: 'Bearer token' } });

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/product`,
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
      })
    );
  });

  it('throws when response not ok and not retriable', async () => {
    fetch.mockResolvedValue({ ok: false, status: 404 });

    await expect(fetchAPI('/product/unknown')).rejects.toThrow('API Error: 404');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('retries on retriable HTTP codes and succeeds', async () => {
    const data = { ok: true };
    fetch
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => data });

    const promise = fetchAPI('/product');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual(data);
  });

  it('retries on network errors and eventually succeeds', async () => {
    const data = { ok: true };
    fetch
      .mockRejectedValueOnce(new TypeError('Network error'))
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => data });

    const promise = fetchAPI('/product');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual(data);
  });

  it('fails after exhausting retries on retriable code', async () => {
    fetch.mockResolvedValue({ ok: false, status: 503 });

    let error;
    const promise = fetchAPI('/product', { retries: 1 }).catch((e) => {
      error = e;
    });

    await vi.runAllTimersAsync();
    await promise;

    expect(error.message).toBe('API Error: 503');
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('retries correct number of times with custom config', async () => {
    const data = { ok: true };
    fetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => data });
    const promise = fetchAPI('/product', { retries: 2, retryDelay: 100 });
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(result).toEqual(data);
  });

  it('throws when fetch rejects on all attempts (default)', async () => {
    fetch.mockRejectedValue(new TypeError('Network down'));

    let error;
    const promise = fetchAPI('/product').catch((e) => {
      error = e;
    });

    await vi.runAllTimersAsync();
    await promise;

    expect(error.message).toBe('Network down');
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it.each([408, 429, 500, 502, 503, 504])('retries on HTTP %i', async (status) => {
    const data = { ok: true };
    fetch
      .mockResolvedValueOnce({ ok: false, status })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => data });

    const promise = fetchAPI('/product');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual(data);
  });

  it.each([400, 401, 403, 404, 422])('does not retry on HTTP %i', async (status) => {
    fetch.mockResolvedValue({ ok: false, status });

    await expect(fetchAPI('/product')).rejects.toThrow(`API Error: ${status}`);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('skips retries when retries is 0', async () => {
    fetch.mockResolvedValue({ ok: false, status: 503 });

    let error;
    const promise = fetchAPI('/product', { retries: 0 }).catch((e) => {
      error = e;
    });

    await vi.runAllTimersAsync();
    await promise;

    expect(error.message).toBe('API Error: 503');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('passes method and body correctly', async () => {
    const data = { count: 1 };
    fetch.mockResolvedValue({ ok: true, status: 200, json: () => data });

    await fetchAPI('/cart', {
      method: 'POST',
      body: JSON.stringify({ id: '1' }),
    });

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/cart`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ id: '1' }),
      })
    );
  });

});