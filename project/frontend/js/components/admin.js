/**
 * components/admin.js
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  Lab 4 – Security: XSS vulnerability                              ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  The admin panel below contains a deliberate XSS vulnerability:   ║
 * ║  user-supplied input is set directly via `innerHTML`.              ║
 * ║                                                                    ║
 * ║  To see the bug in action, type in the search field:              ║
 * ║    <img src=x onerror="alert('XSS!')">                            ║
 * ║                                                                    ║
 * ║  Your task (with GitHub Copilot):                                  ║
 * ║  1. Fix the search preview to not execute HTML                     ║
 * ║  2. Refactor ALL innerHTML calls that use user data to use safe    ║
 * ║     DOM API equivalents (textContent, createElement, etc.)         ║
 * ║  3. If innerHTML is needed for static markup (no user data),       ║
 * ║     add a comment explaining why it is safe                        ║
 * ║                                                                    ║
 * ║  Hint: ask Copilot                                                  ║
 * ║    "Fix the XSS vulnerability in this admin component.             ║
 * ║     Replace innerHTML assignments that use user data with          ║
 * ║     safe DOM API alternatives."                                    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

/**
 * Mount the admin search panel inside the given container.
 * @param {HTMLElement} container
 * @param {object[]} cases
 */
export function renderAdminPanel(container, cases) {
  container.innerHTML = '';

  const heading = document.createElement('h2');
  heading.textContent = 'Admin — Case zoekopdracht';
  container.appendChild(heading);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'input';
  input.placeholder = 'Zoek op naam, onderwerp of ID…';
  input.setAttribute('aria-label', 'Admin zoekterm');
  container.appendChild(input);

  const preview = document.createElement('div');
  preview.className = 'admin-preview';
  preview.setAttribute('aria-live', 'polite');
  container.appendChild(preview);

  const resultList = document.createElement('ul');
  resultList.className = 'admin-results';
  container.appendChild(resultList);

  input.addEventListener('input', () => {
    const query = input.value;

    // ⚠️  BUG Lab 4: XSS vulnerability — user input is rendered as HTML!
    //     If query contains HTML tags or event handlers they will execute.
    preview.innerHTML = 'Zoeken naar: <strong>' + query + '</strong>';   // ← FIX THIS

    const matches = cases.filter(
      (c) =>
        c.customerName.toLowerCase().includes(query.toLowerCase()) ||
        c.subject.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase().includes(query.toLowerCase()),
    );

    resultList.innerHTML = '';

    for (const c of matches) {
      const li = document.createElement('li');
      li.className = 'admin-results__item';
      // ⚠️  BUG Lab 4: XSS here too — c.subject could come from user-generated input
      li.innerHTML = '<strong>' + c.customerName + '</strong> – ' + c.subject; // ← FIX THIS
      resultList.appendChild(li);
    }

    if (matches.length === 0 && query.length > 0) {
      const empty = document.createElement('li');
      empty.textContent = 'Geen resultaten gevonden.';
      resultList.appendChild(empty);
    }
  });
}
