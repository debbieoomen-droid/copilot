/**
 * components/case-list.js
 *
 * Renders the list of cases in the sidebar.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  Lab 6 – Performance                                              ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  The current `renderCaseList` implementation re-renders *all*     ║
 * ║  DOM nodes on every call (e.g. every keypress in the search box). ║
 * ║                                                                    ║
 * ║  Your task (with GitHub Copilot):                                  ║
 * ║  1. Wrap the onFilterChange callback in a debounce helper so       ║
 * ║     the API is not called on every single keystroke               ║
 * ║  2. Use DocumentFragment to batch-insert all case cards in one    ║
 * ║     DOM operation instead of appending one by one                 ║
 * ║  3. (Stretch) Implement a simple virtual list: only render cards  ║
 * ║     that are currently in the viewport                            ║
 * ║                                                                    ║
 * ║  Hint: ask Copilot                                                  ║
 * ║    "Add a debounce wrapper to the search input handler and         ║
 * ║     use DocumentFragment in renderCaseList for better performance" ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { renderCaseCard } from './case-card.js';

/**
 * Render the case list into the given container element.
 *
 * ⚠️  Lab 6: Replace the append-one-by-one loop with DocumentFragment.
 *     Add debounce to the search input as well.
 *
 * @param {HTMLElement} container
 * @param {object[]} cases
 * @param {string | null} selectedCaseId
 * @param {(caseItem: object) => void} onSelect
 */
export function renderCaseList(container, cases, selectedCaseId, onSelect) {
  // Clear existing content
  container.innerHTML = '';

  if (cases.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'case-list__empty';
    empty.textContent = 'No cases match your search.';
    container.appendChild(empty);
    return;
  }

  // TODO Lab 6: Replace this loop with a DocumentFragment
  for (const caseItem of cases) {
    const card = renderCaseCard(caseItem, caseItem.id === selectedCaseId);
    card.addEventListener('click', () => onSelect(caseItem));
    container.appendChild(card);   // ⚠️ triggers reflow on every iteration
  }
}

/**
 * Attach a live search input to filter cases.
 *
 * @param {HTMLInputElement} inputEl
 * @param {(searchTerm: string) => void} onFilterChange
 */
export function bindSearchInput(inputEl, onFilterChange) {
  // TODO Lab 6: Wrap onFilterChange in a debounce (e.g. 300 ms delay)
  //             so the API is not called on every keystroke.
  inputEl.addEventListener('input', (e) => {
    onFilterChange(e.target.value);   // ⚠️ called on every keystroke — debounce me!
  });
}
