/**
 * state.js
 * Minimal reactive state store.
 *
 * Usage:
 *   import { state, subscribe, setState } from './state.js';
 *
 *   subscribe('selectedCaseId', (newId) => console.log('selected:', newId));
 *   setState({ selectedCaseId: 'c003' });
 */

/** @type {Record<string, any>} */
const _state = {
  cases: [],
  selectedCaseId: null,
  summaries: {},        // keyed by caseId
  filter: '',
  statusFilter: 'all',
  isLoading: false,
  error: null,
  notification: null,   // { message, type } | null
};

/** @type {Map<string, Set<Function>>} */
const _subscribers = new Map();

/**
 * Read the current state (shallow copy).
 * @returns {Readonly<typeof _state>}
 */
export function state() {
  return Object.freeze({ ..._state });
}

/**
 * Update one or more state keys and notify all relevant subscribers.
 * @param {Partial<typeof _state>} patch
 */
export function setState(patch) {
  const changedKeys = [];

  for (const [key, value] of Object.entries(patch)) {
    if (_state[key] !== value) {
      _state[key] = value;
      changedKeys.push(key);
    }
  }

  for (const key of changedKeys) {
    const listeners = _subscribers.get(key);
    if (listeners) {
      for (const fn of listeners) {
        fn(_state[key], _state);
      }
    }
  }

  // Always notify wildcard subscribers
  const wildcardListeners = _subscribers.get('*');
  if (wildcardListeners && changedKeys.length > 0) {
    for (const fn of wildcardListeners) {
      fn(_state);
    }
  }
}

/**
 * Subscribe to changes on a specific state key (or '*' for any change).
 * @param {string} key
 * @param {Function} fn
 * @returns {() => void} unsubscribe function
 */
export function subscribe(key, fn) {
  if (!_subscribers.has(key)) {
    _subscribers.set(key, new Set());
  }
  _subscribers.get(key).add(fn);

  return () => {
    _subscribers.get(key)?.delete(fn);
  };
}
