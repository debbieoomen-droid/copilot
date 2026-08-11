/**
 * utils/formatters.js
 * Utility functions for formatting and domain logic.
 *
 * Lab 5 — calculatePriorityScore()
 * ─────────────────────────────────
 * This function contains intentional edge-case bugs.
 * Your task: use GitHub Copilot to identify and fix the issues,
 * then write tests (or console assertions) to confirm correct behaviour.
 *
 * Known edge cases to find:
 *  1. Division by zero when daysOpen is 0
 *  2. Escalation bonus is applied even for resolved/closed cases
 *  3. 'critical' priority factor is missing (treated as 0)
 */

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

/**
 * Format an ISO date string to a Dutch locale date/time string.
 * @param {string} isoString
 * @returns {string}  e.g. "10 mrt 2026, 09:15"
 */
export function formatDateNL(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Return the number of whole calendar days between two ISO date strings.
 * @param {string} fromIso
 * @param {string} toIso
 * @returns {number}
 */
export function daysBetween(fromIso, toIso) {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  return Math.floor((to - from) / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// IBAN masking
// ---------------------------------------------------------------------------

/**
 * Mask an IBAN for display: show country code + last 4 digits.
 * Example: "NL91RABO0417164300" → "NL** **** **** 4300"
 * @param {string} iban
 * @returns {string}
 */
export function maskIBAN(iban) {
  if (!iban || iban.length < 6) return '****';
  const country = iban.slice(0, 2);
  const last4 = iban.slice(-4);
  return `${country}** **** **** ${last4}`;
}

/**
 * Format an IBAN with spaces for readability.
 * Example: "NL91RABO0417164300" → "NL91 RABO 0417 1643 00"
 * @param {string} iban
 * @returns {string}
 */
export function formatIBAN(iban) {
  if (!iban) return '';
  return iban.replace(/(.{4})/g, '$1 ').trim();
}

// ---------------------------------------------------------------------------
// Priority
// ---------------------------------------------------------------------------

/** @type {Record<string, number>} Priority factors per level */
const PRIORITY_FACTORS = {
  low: 1,
  medium: 2,
  high: 3,
  // TODO Lab 5: 'critical' factor is missing — add it here
};

/**
 * Calculate a numeric priority score for a case.
 *
 * Formula:
 *   score = (daysOpen / 1) * priorityFactor + escalationBonus
 *
 * escalationBonus = 10 when status is 'escalated', else 0
 *
 * ⚠️  Lab 5 — This function contains bugs. Find and fix them!
 *
 * @param {{ priority: string, status: string, createdAt: string }} caseItem
 * @returns {number}
 */
export function calculatePriorityScore(caseItem) {
  const daysOpen = daysBetween(caseItem.createdAt, new Date().toISOString());

  // BUG 1: When daysOpen is 0 (case opened today) the score is always 0
  //        regardless of priority. Fix: ensure a minimum score of 1 day.
  const factor = PRIORITY_FACTORS[caseItem.priority] ?? 0;

  // BUG 2: Escalation bonus is applied even for 'resolved' and 'closed' cases.
  //        Fix: only apply the bonus for active (not resolved/closed) cases.
  const escalationBonus = caseItem.status === 'escalated' ? 10 : 0;

  return daysOpen * factor + escalationBonus;
}

/**
 * Convert a numeric score to a priority label.
 * @param {number} score
 * @returns {'low' | 'medium' | 'high' | 'critical'}
 */
export function scoreToPriority(score) {
  if (score >= 30) return 'critical';
  if (score >= 15) return 'high';
  if (score >= 5) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// Status label helpers
// ---------------------------------------------------------------------------

/** Human-readable labels for status values */
const STATUS_LABELS = {
  open: 'Open',
  'in-progress': 'In behandeling',
  'waiting-customer': 'Wacht op klant',
  escalated: 'Escalatie',
  resolved: 'Opgelost',
  closed: 'Gesloten',
};

/**
 * @param {string} status
 * @returns {string}
 */
export function statusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

/** CSS modifier class for a status badge */
export function statusClass(status) {
  return `badge--${status}`;
}

/** Human-readable labels for category values */
const CATEGORY_LABELS = {
  complaint: 'Klacht',
  question: 'Vraag',
  'loan-request': 'Leningaanvraag',
  'fraud-report': 'Fraude',
  'account-issue': 'Rekeningprobleem',
  'payment-issue': 'Betaalprobleem',
  mortgage: 'Hypotheek',
  insurance: 'Verzekering',
  other: 'Overig',
};

/**
 * @param {string} category
 * @returns {string}
 */
export function categoryLabel(category) {
  return CATEGORY_LABELS[category] ?? category;
}
