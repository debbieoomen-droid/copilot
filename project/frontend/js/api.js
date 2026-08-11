/**
 * api.js
 * Dual-mode API layer.
 *
 * When USE_REAL_BACKEND is false (default) all functions use in-memory mock
 * data and simulate network latency — good for offline development and labs.
 *
 * When USE_REAL_BACKEND is true every call hits the Spring Boot backend at
 * API_BASE_URL.  Field names and enum values are normalised so the rest of
 * the application always sees the same shape regardless of mode.
 *
 * Change the flag in js/config.js to switch modes.
 */

import { MOCK_CASES, MOCK_SUMMARIES } from './data.js';
import { USE_REAL_BACKEND, API_BASE_URL } from './config.js';

/** Simulated network delay in milliseconds (mock mode only) */
const SIMULATED_DELAY = 400;

/**
 * Simulate a network call with optional failure rate.
 * @template T
 * @param {T} data
 * @param {{ delay?: number, failRate?: number }} [options]
 * @returns {Promise<T>}
 */
function simulateFetch(data, { delay = SIMULATED_DELAY, failRate = 0 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error('Network error: request failed. Please try again.'));
      } else {
        resolve(structuredClone(data));
      }
    }, delay);
  });
}

// ---------------------------------------------------------------------------
// Real-backend helpers
// ---------------------------------------------------------------------------

/**
 * Thin fetch wrapper: throws a descriptive Error on non-2xx responses.
 * @param {string} path  URL path relative to API_BASE_URL (include leading /)
 * @param {RequestInit} [init]
 * @returns {Promise<any>} parsed JSON response body
 */
async function apiFetch(path, init = {}) {
  const url = `${API_BASE_URL}${path}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const response = await fetch(url, {
    ...init,
    headers: { ...defaultHeaders, ...(init.headers ?? {}) },
  });
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // ignore parse errors — keep the status-code message
    }
    throw new Error(message);
  }
  // 204 No Content has no body
  if (response.status === 204) return null;
  return response.json();
}

/**
 * Convert a Java UPPER_CASE enum string to a lowercase kebab-case slug.
 * e.g. 'IN_PROGRESS' → 'in-progress'
 * @param {string|null} value
 */
function slugify(value) {
  return value ? value.toLowerCase().replace(/_/g, '-') : value;
}

/**
 * Convert a lowercase kebab-case slug back to a Java UPPER_CASE enum string.
 * e.g. 'in-progress' → 'IN_PROGRESS'
 * @param {string|null} value
 */
function unslugify(value) {
  return value ? value.toUpperCase().replace(/-/g, '_') : value;
}

/**
 * Ensure a LocalDateTime string from the backend is treated as UTC by
 * appending 'Z' when it is missing.
 * @param {string|null} value
 */
function toIsoString(value) {
  if (!value) return null;
  return value.endsWith('Z') ? value : `${value}Z`;
}

/**
 * Normalise a CaseSummaryDTO from the backend into the shape that the rest
 * of the frontend expects.
 * @param {object} dto
 */
function normalizeCase(dto) {
  return {
    ...dto,
    // Backend exposes maskedIban; frontend uses iban
    iban: dto.maskedIban ?? dto.iban,
    // Enums are UPPER_CASE on the backend; frontend uses kebab-case
    status: slugify(dto.status),
    category: slugify(dto.category),
    // LocalDateTime has no timezone indicator — treat as UTC
    createdAt: toIsoString(dto.createdAt),
    updatedAt: toIsoString(dto.updatedAt),
    resolvedAt: toIsoString(dto.resolvedAt),
  };
}

/**
 * Normalise a SummaryNoteDTO from the backend.
 * @param {object} dto
 */
function normalizeSummary(dto) {
  return { ...dto, createdAt: toIsoString(dto.createdAt) };
}

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------

/**
 * Fetch all cases, optionally filtered by status and/or search term.
 * @param {{ statusFilter?: string, search?: string }} [options]
 * @returns {Promise<object[]>}
 */
export async function getCases({ statusFilter = 'all', search = '' } = {}) {
  if (USE_REAL_BACKEND) {
    // Fetch all cases from the backend (page 0, large size) then filter client-side
    const data = await apiFetch('/cases?page=0&size=100');
    let results = (data.content ?? []).map(normalizeCase);

    if (statusFilter !== 'all') {
      results = results.filter((c) => c.status === statusFilter);
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      results = results.filter(
        (c) =>
          c.subject.toLowerCase().includes(term) ||
          c.customerName.toLowerCase().includes(term) ||
          String(c.id).toLowerCase().includes(term),
      );
    }
    return results;
  }

  // --- Mock mode ---
  let results = MOCK_CASES;

  if (statusFilter !== 'all') {
    results = results.filter((c) => c.status === statusFilter);
  }

  if (search.trim()) {
    const term = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.subject.toLowerCase().includes(term) ||
        c.customerName.toLowerCase().includes(term) ||
        c.id.toLowerCase().includes(term),
    );
  }

  return simulateFetch(results);
}

/**
 * Fetch a single case by id.
 * @param {string|number} id
 * @returns {Promise<object>}
 */
export async function getCaseById(id) {
  if (USE_REAL_BACKEND) {
    const dto = await apiFetch(`/cases/${id}`);
    return normalizeCase(dto);
  }

  const found = MOCK_CASES.find((c) => c.id === id);
  if (!found) {
    return Promise.reject(new Error(`Case with id '${id}' not found.`));
  }
  return simulateFetch(found);
}

/**
 * Create a new case.
 * @param {{ subject: string, description: string, category: string, customerName: string, iban: string }} payload
 * @returns {Promise<object>} the created case
 */
export async function createCase(payload) {
  if (USE_REAL_BACKEND) {
    const body = {
      subject: payload.subject,
      description: payload.description,
      category: unslugify(payload.category),
      customerName: payload.customerName,
      maskedIban: payload.iban,
    };
    const dto = await apiFetch('/cases', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return normalizeCase(dto);
  }

  const newCase = {
    id: `c${String(MOCK_CASES.length + 1).padStart(3, '0')}`,
    customerId: `cust-${100 + MOCK_CASES.length + 1}`,
    status: 'open',
    priority: 'medium',
    assignedAgent: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolvedAt: null,
    ...payload,
  };
  MOCK_CASES.push(newCase);
  return simulateFetch(newCase);
}

/**
 * Update the status of a case.
 * @param {string|number} id
 * @param {string} newStatus  kebab-case slug (e.g. 'in-progress')
 * @returns {Promise<object>} the updated case
 */
export async function updateCaseStatus(id, newStatus) {
  if (USE_REAL_BACKEND) {
    const dto = await apiFetch(`/cases/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: unslugify(newStatus) }),
    });
    return normalizeCase(dto);
  }

  const caseItem = MOCK_CASES.find((c) => c.id === id);
  if (!caseItem) {
    return Promise.reject(new Error(`Case with id '${id}' not found.`));
  }
  caseItem.status = newStatus;
  caseItem.updatedAt = new Date().toISOString();
  if (newStatus === 'resolved' || newStatus === 'closed') {
    caseItem.resolvedAt = new Date().toISOString();
  }
  return simulateFetch(caseItem);
}

// ---------------------------------------------------------------------------
// Case Summaries (notes)
// ---------------------------------------------------------------------------

/**
 * Fetch all summaries/notes for a case.
 * @param {string|number} caseId
 * @returns {Promise<object[]>}
 */
export async function getSummaries(caseId) {
  if (USE_REAL_BACKEND) {
    const list = await apiFetch(`/cases/${caseId}/summaries`);
    return (list ?? []).map(normalizeSummary);
  }

  const summaries = MOCK_SUMMARIES[caseId] ?? [];
  return simulateFetch(summaries);
}

/**
 * Add a note/summary to a case.
 * @param {{ caseId: string|number, agentName: string, content: string, isInternal: boolean }} payload
 * @returns {Promise<object>} the created summary
 */
export async function addSummary({ caseId, agentName, content, isInternal }) {
  if (USE_REAL_BACKEND) {
    const dto = await apiFetch(`/cases/${caseId}/summaries`, {
      method: 'POST',
      body: JSON.stringify({ agentName, content, isInternal: Boolean(isInternal) }),
    });
    return normalizeSummary(dto);
  }

  if (!MOCK_SUMMARIES[caseId]) {
    MOCK_SUMMARIES[caseId] = [];
  }
  const note = {
    id: `s${Date.now()}`,
    caseId,
    agentName,
    content,
    isInternal: Boolean(isInternal),
    createdAt: new Date().toISOString(),
  };
  MOCK_SUMMARIES[caseId].push(note);
  return simulateFetch(note, { delay: 200 });
}
