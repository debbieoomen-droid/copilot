/**
 * components/case-card.js
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  Lab 2 – Refactor CaseCard                                        ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  The `renderCaseCard` function below uses old-style string         ║
 * ║  concatenation (+ operator) to build HTML.  This is fragile,      ║
 * ║  hard to read, and susceptible to injection issues.               ║
 * ║                                                                    ║
 * ║  Your task (with GitHub Copilot):                                  ║
 * ║  1. Refactor the function to use template literals                 ║
 * ║  2. Then refactor once more to build the element with the DOM      ║
 * ║     API (document.createElement, element.textContent, etc.)        ║
 * ║  3. Make sure XSS is impossible: never set innerHTML with          ║
 * ║     unsanitised data                                               ║
 * ║  4. Add an accessible aria-label to the card element               ║
 * ║                                                                    ║
 * ║  Hint: ask Copilot                                                  ║
 * ║    "Refactor renderCaseCard to use the DOM API instead of          ║
 * ║     string concatenation.  Use textContent for all user data."     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { statusLabel, statusClass, categoryLabel } from '../utils/formatters.js';

/**
 * Render a case card element.
 *
 * ⚠️  Lab 2: This implementation uses string concatenation — refactor it!
 *
 * @param {object} caseItem
 * @param {boolean} isSelected
 * @returns {HTMLElement}
 */
export function renderCaseCard(caseItem, isSelected = false) {
  const el = document.createElement('div');
  el.className = 'case-card' + (isSelected ? ' case-card--selected' : '');
  el.dataset.caseId = caseItem.id;

  // ⚠️  TODO Lab 2: Replace the string concatenation below with template literals,
  //     then with DOM API calls (document.createElement / textContent).
  el.innerHTML =
    '<div class="case-card__header">' +
    '<span class="case-card__id">#' + caseItem.id + '</span>' +
    '<span class="badge ' + statusClass(caseItem.status) + '">' + statusLabel(caseItem.status) + '</span>' +
    '</div>' +
    '<h3 class="case-card__subject">' + caseItem.subject + '</h3>' +
    '<div class="case-card__meta">' +
    '<span class="case-card__customer">' + caseItem.customerName + '</span>' +
    '<span class="case-card__category">' + categoryLabel(caseItem.category) + '</span>' +
    '</div>' +
    '<div class="case-card__priority case-card__priority--' + caseItem.priority + '">' +
    priorityIcon(caseItem.priority) + ' ' + caseItem.priority +
    '</div>';

  return el;
}

/** @param {string} priority */
function priorityIcon(priority) {
  const icons = { low: '🟢', medium: '🟡', high: '🟠', critical: '🔴' };
  return icons[priority] ?? '⚪';
}
