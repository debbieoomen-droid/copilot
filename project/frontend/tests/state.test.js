/**
 * Unit tests for js/state.js
 *
 * Run: npm test  (from the frontend/ directory)
 *
 * _state and _subscribers are module-level singletons so we:
 *   - Reset all state keys to their defaults in beforeEach
 *   - Accumulate unsubscribe functions and call them in afterEach
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { state, setState, subscribe } from '../js/state.js';

const DEFAULTS = {
  cases: [],
  selectedCaseId: null,
  summaries: {},
  filter: '',
  statusFilter: 'all',
  isLoading: false,
  error: null,
  notification: null,
};

let cleanups;

beforeEach(() => {
  // Fresh arrays/objects each time so strict-equality check in setState fires.
  setState({ ...DEFAULTS, cases: [], summaries: {} });
  cleanups = [];
});

afterEach(() => {
  for (const fn of cleanups) fn();
  cleanups = [];
});

// ---------------------------------------------------------------------------
// state()
// ---------------------------------------------------------------------------
describe('state()', () => {
  it('returns an object with all default keys and values', () => {
    expect(state()).toMatchObject(DEFAULTS);
  });

  it('returns a frozen (immutable) object', () => {
    expect(Object.isFrozen(state())).toBe(true);
  });

  it('returns a new shallow copy on each call', () => {
    expect(state()).not.toBe(state()); // distinct references
  });

  it('does not expose mutable internal state via the returned copy', () => {
    const copy = state();
    try {
      copy.filter = 'hacked'; // throws in strict mode, silently ignored otherwise
    } catch (_) {}
    expect(state().filter).toBe('');
  });
});

// ---------------------------------------------------------------------------
// setState(patch)
// ---------------------------------------------------------------------------
describe('setState(patch)', () => {
  it('updates a single key', () => {
    setState({ filter: 'mortgage' });
    expect(state().filter).toBe('mortgage');
  });

  it('updates multiple keys at once', () => {
    setState({ filter: 'loan', isLoading: true });
    const s = state();
    expect(s.filter).toBe('loan');
    expect(s.isLoading).toBe(true);
  });

  it('notifies the subscriber for the changed key with (newValue, fullState)', () => {
    const handler = vi.fn();
    cleanups.push(subscribe('filter', handler));
    setState({ filter: 'new-value' });
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith('new-value', expect.objectContaining({ filter: 'new-value' }));
  });

  it('does not notify subscriber when the value has not changed', () => {
    const handler = vi.fn();
    cleanups.push(subscribe('filter', handler));
    setState({ filter: '' }); // same as default
    expect(handler).not.toHaveBeenCalled();
  });

  it('notifies wildcard ("*") subscriber on any state change', () => {
    const handler = vi.fn();
    cleanups.push(subscribe('*', handler));
    setState({ isLoading: true });
    expect(handler).toHaveBeenCalledOnce();
  });

  it('passes the full state object to the wildcard subscriber', () => {
    const handler = vi.fn();
    cleanups.push(subscribe('*', handler));
    setState({ selectedCaseId: 'c001' });
    expect(handler.mock.calls[0][0]).toMatchObject({ selectedCaseId: 'c001' });
  });

  it('does not notify wildcard subscriber when nothing has changed', () => {
    const handler = vi.fn();
    cleanups.push(subscribe('*', handler));
    setState({ filter: '' }); // already ''
    expect(handler).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// subscribe(key, fn)
// ---------------------------------------------------------------------------
describe('subscribe(key, fn)', () => {
  it('returns an unsubscribe function that stops future notifications', () => {
    const handler = vi.fn();
    const unsub = subscribe('filter', handler);
    unsub(); // do NOT push to cleanups — already unsubscribed
    setState({ filter: 'after-unsub' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('allows multiple independent subscribers for the same key', () => {
    const h1 = vi.fn();
    const h2 = vi.fn();
    cleanups.push(subscribe('filter', h1));
    cleanups.push(subscribe('filter', h2));
    setState({ filter: 'shared' });
    expect(h1).toHaveBeenCalledOnce();
    expect(h2).toHaveBeenCalledOnce();
  });

  it('only notifies subscriber for its own key, not for other keys', () => {
    const filterHandler = vi.fn();
    const loadingHandler = vi.fn();
    cleanups.push(subscribe('filter', filterHandler));
    cleanups.push(subscribe('isLoading', loadingHandler));
    setState({ filter: 'targeted' });
    expect(filterHandler).toHaveBeenCalledOnce();
    expect(loadingHandler).not.toHaveBeenCalled();
  });

  it('unsubscribing one subscriber does not affect other subscribers on the same key', () => {
    const h1 = vi.fn();
    const h2 = vi.fn();
    cleanups.push(subscribe('filter', h1));
    const unsub2 = subscribe('filter', h2); // we'll unsubscribe manually
    unsub2();
    setState({ filter: 'partial' });
    expect(h1).toHaveBeenCalledOnce();
    expect(h2).not.toHaveBeenCalled();
  });
});
