/**
 * components/case-detail.js
 * Renders the case detail panel with notes timeline.
 */

import { formatDateNL, maskIBAN, statusLabel, categoryLabel } from '../utils/formatters.js';

/**
 * Render the full detail view for a case.
 *
 * @param {HTMLElement} container
 * @param {object} caseItem
 * @param {object[]} summaries
 * @param {{ onStatusChange: (id: string, status: string) => void, onAddNote: (payload: object) => void }} callbacks
 */
export function renderCaseDetail(container, caseItem, summaries, { onStatusChange, onAddNote }) {
  container.innerHTML = '';

  // Header
  const header = document.createElement('header');
  header.className = 'detail__header';

  const title = document.createElement('h2');
  title.className = 'detail__title';
  title.textContent = caseItem.subject;

  const meta = document.createElement('div');
  meta.className = 'detail__meta';
  meta.textContent = `#${caseItem.id} · ${categoryLabel(caseItem.category)} · geopend ${formatDateNL(caseItem.createdAt)}`;

  header.appendChild(title);
  header.appendChild(meta);
  container.appendChild(header);

  // Customer info card
  container.appendChild(buildInfoCard(caseItem));

  // Status selector
  container.appendChild(buildStatusSelector(caseItem, onStatusChange));

  // Description
  const descSection = document.createElement('section');
  descSection.className = 'detail__section';
  const descTitle = document.createElement('h3');
  descTitle.textContent = 'Beschrijving';
  const descText = document.createElement('p');
  descText.className = 'detail__description';
  descText.textContent = caseItem.description;
  descSection.appendChild(descTitle);
  descSection.appendChild(descText);
  container.appendChild(descSection);

  // Notes timeline
  container.appendChild(buildTimeline(summaries));

  // Add note form
  container.appendChild(buildNoteForm(caseItem.id, onAddNote));
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function buildInfoCard(caseItem) {
  const card = document.createElement('div');
  card.className = 'info-card';

  const rows = [
    ['Klant', caseItem.customerName],
    ['IBAN', maskIBAN(caseItem.iban)],
    ['Agent', caseItem.assignedAgent ?? '—'],
    ['Prioriteit', caseItem.priority],
  ];

  for (const [label, value] of rows) {
    const row = document.createElement('div');
    row.className = 'info-card__row';

    const labelEl = document.createElement('span');
    labelEl.className = 'info-card__label';
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.className = 'info-card__value';
    valueEl.textContent = value;

    row.appendChild(labelEl);
    row.appendChild(valueEl);
    card.appendChild(row);
  }

  return card;
}

function buildStatusSelector(caseItem, onStatusChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'detail__status-row';

  const label = document.createElement('label');
  label.htmlFor = 'status-select';
  label.textContent = 'Status: ';

  const statuses = ['open', 'in-progress', 'waiting-customer', 'escalated', 'resolved', 'closed'];

  const select = document.createElement('select');
  select.id = 'status-select';
  select.className = 'select';
  select.setAttribute('aria-label', 'Verander case status');

  for (const s of statuses) {
    const option = document.createElement('option');
    option.value = s;
    option.textContent = statusLabel(s);
    if (s === caseItem.status) option.selected = true;
    select.appendChild(option);
  }

  select.addEventListener('change', () => onStatusChange(caseItem.id, select.value));

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  return wrapper;
}

function buildTimeline(summaries) {
  const section = document.createElement('section');
  section.className = 'detail__section';

  const heading = document.createElement('h3');
  heading.textContent = 'Notities';
  section.appendChild(heading);

  if (!summaries || summaries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'timeline__empty';
    empty.textContent = 'Nog geen notities.';
    section.appendChild(empty);
    return section;
  }

  const timeline = document.createElement('ol');
  timeline.className = 'timeline';

  for (const note of summaries) {
    const item = document.createElement('li');
    item.className = 'timeline__item' + (note.isInternal ? ' timeline__item--internal' : '');

    const noteHeader = document.createElement('div');
    noteHeader.className = 'timeline__meta';

    const agentSpan = document.createElement('strong');
    agentSpan.textContent = note.agentName;

    const dateSpan = document.createElement('time');
    dateSpan.dateTime = note.createdAt;
    dateSpan.textContent = formatDateNL(note.createdAt);

    const typeSpan = document.createElement('span');
    typeSpan.className = 'badge badge--sm';
    typeSpan.textContent = note.isInternal ? 'Intern' : 'Extern';

    noteHeader.appendChild(agentSpan);
    noteHeader.appendChild(dateSpan);
    noteHeader.appendChild(typeSpan);

    const content = document.createElement('p');
    content.textContent = note.content;

    item.appendChild(noteHeader);
    item.appendChild(content);
    timeline.appendChild(item);
  }

  section.appendChild(timeline);
  return section;
}

function buildNoteForm(caseId, onAddNote) {
  const form = document.createElement('form');
  form.className = 'note-form';
  form.setAttribute('aria-label', 'Notitie toevoegen');

  const heading = document.createElement('h3');
  heading.textContent = 'Notitie toevoegen';
  form.appendChild(heading);

  const textarea = document.createElement('textarea');
  textarea.className = 'textarea';
  textarea.placeholder = 'Schrijf een notitie…';
  textarea.rows = 3;
  textarea.required = true;
  textarea.setAttribute('aria-label', 'Notitie inhoud');
  form.appendChild(textarea);

  const checkRow = document.createElement('label');
  checkRow.className = 'checkbox-row';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'note-internal';
  const checkLabel = document.createElement('span');
  checkLabel.textContent = 'Interne notitie (niet zichtbaar voor klant)';
  checkRow.appendChild(checkbox);
  checkRow.appendChild(checkLabel);
  form.appendChild(checkRow);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn--primary';
  submitBtn.textContent = 'Opslaan';
  form.appendChild(submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = textarea.value.trim();
    if (!content) return;
    onAddNote({
      caseId,
      agentName: 'Agent (jij)',
      content,
      isInternal: checkbox.checked,
    });
    textarea.value = '';
    checkbox.checked = false;
  });

  return form;
}
