/**
 * utils/formatters.js
 * Utility functions for formatting and domain logic.
 *
 * Lab 5 — calculatePriorityScore()
 * ─────────────────────────────────
 * ⚠️  Training material. This function ships with three intentional defects.
 *
 * They are NOT listed here on purpose — finding them is the exercise. Use
 * GitHub Copilot to identify and fix them, then write tests (or console
 * assertions) that prove each fix.
 *
 * Never copy this function into a real system.
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
};

/**
 * Calculate a numeric priority score for a case.
 *
 * Intended behaviour:
 *   score = daysOpen * priorityFactor + escalationBonus
 *
 * Every supported priority level must map to a factor, so that a more urgent
 * case always outranks a less urgent one opened on the same day.
 *
 * A case opened today still counts as one day open — priority must never be
 * wiped out just because the case is new.
 *
 * An escalated case should get a +10 bonus. A case that is already resolved
 * or closed should never receive one.
 *
 * ⚠️  Lab 5 — this implementation does not fully match that description.
 *
 * @param {{ priority: string, status: string, createdAt: string }} caseItem
 * @returns {number}
 */
export function calculatePriorityScore(caseItem) {
  const daysOpen = daysBetween(caseItem.createdAt, new Date().toISOString());

  const factor = PRIORITY_FACTORS[caseItem.priority] ?? 0;

  const escalationBonus = caseItem.status !== 'open' ? 10 : 0;

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
