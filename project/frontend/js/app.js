/**
 * app.js
 * Application entry point — bootstraps the app and wires everything together.
 *
 * Loaded as <script type="module"> from index.html.
 */

import { state, setState, subscribe } from './state.js';
import { getCases, getCaseById, getSummaries, updateCaseStatus, addSummary } from './api.js';
import { USE_REAL_BACKEND } from './config.js';
import { renderCaseList, bindSearchInput } from './components/case-list.js';
import { renderCaseDetail } from './components/case-detail.js';
import { renderAdminPanel } from './components/admin.js';
import { showNotification } from './components/notification.js';

// ---------------------------------------------------------------------------
// DOM references (cached once on load)
// ---------------------------------------------------------------------------
const caseListEl = document.getElementById('case-list');
const searchInputEl = document.getElementById('search-input');
const statusFilterEl = document.getElementById('status-filter');
const detailPanelEl = document.getElementById('case-detail');
const detailPlaceholderEl = document.getElementById('detail-placeholder');
const adminPanelEl = document.getElementById('admin-panel');
const loadingOverlayEl = document.getElementById('loading-overlay');
const modeBadgeEl = document.getElementById('mode-badge');

const navItems = document.querySelectorAll('[data-nav]');

// ---------------------------------------------------------------------------
// Mode badge — shows whether the app is using mock data or the real backend
// ---------------------------------------------------------------------------
if (modeBadgeEl) {
  if (USE_REAL_BACKEND) {
    modeBadgeEl.textContent = '● Live backend';
    modeBadgeEl.classList.add('mode-badge--live');
  } else {
    modeBadgeEl.textContent = '◉ Mock data';
    modeBadgeEl.classList.add('mode-badge--mock');
  }
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
function setActiveView(view) {
  const views = document.querySelectorAll('[data-view]');
  for (const v of views) {
    v.hidden = v.dataset.view !== view;
  }
  for (const item of navItems) {
    item.classList.toggle('nav__item--active', item.dataset.nav === view);
  }
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    setActiveView(item.dataset.nav);
    if (item.dataset.nav === 'admin') {
      renderAdminPanel(adminPanelEl, state().cases);
    }
  });
});

// ---------------------------------------------------------------------------
// Loading indicator
// ---------------------------------------------------------------------------
function setLoading(isLoading) {
  setState({ isLoading });
  loadingOverlayEl.hidden = !isLoading;
}

// ---------------------------------------------------------------------------
// Case list
// ---------------------------------------------------------------------------
async function loadCases() {
  setLoading(true);
  try {
    const cases = await getCases({
      statusFilter: state().statusFilter,
      search: state().filter,
    });
    setState({ cases, error: null });
  } catch (err) {
    setState({ error: err.message });
    showNotification(err.message, 'error');
  } finally {
    setLoading(false);
  }
}

subscribe('cases', () => {
  renderCaseList(caseListEl, state().cases, state().selectedCaseId, handleSelectCase);
});

subscribe('selectedCaseId', () => {
  renderCaseList(caseListEl, state().cases, state().selectedCaseId, handleSelectCase);
});

// ---------------------------------------------------------------------------
// Case detail
// ---------------------------------------------------------------------------
async function handleSelectCase(caseItem) {
  setState({ selectedCaseId: caseItem.id });
  detailPlaceholderEl.hidden = true;
  detailPanelEl.hidden = false;

  setLoading(true);
  try {
    const [fullCase, summaries] = await Promise.all([
      getCaseById(caseItem.id),
      getSummaries(caseItem.id),
    ]);
    setState({ summaries: { ...state().summaries, [caseItem.id]: summaries } });

    renderCaseDetail(detailPanelEl, fullCase, summaries, {
      onStatusChange: handleStatusChange,
      onAddNote: handleAddNote,
    });
  } catch (err) {
    showNotification(err.message, 'error');
  } finally {
    setLoading(false);
  }
}

async function handleStatusChange(caseId, newStatus) {
  try {
    await updateCaseStatus(caseId, newStatus);
    showNotification(`Status bijgewerkt naar "${newStatus}".`, 'success');
    await loadCases();
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function handleAddNote(payload) {
  try {
    await addSummary(payload);
    showNotification('Notitie opgeslagen.', 'success');
    // Refresh detail view
    const caseId = state().selectedCaseId;
    const summaries = await getSummaries(caseId);
    const caseItem = state().cases.find((c) => c.id === caseId);
    setState({ summaries: { ...state().summaries, [caseId]: summaries } });
    renderCaseDetail(detailPanelEl, caseItem, summaries, {
      onStatusChange: handleStatusChange,
      onAddNote: handleAddNote,
    });
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------
bindSearchInput(searchInputEl, (term) => {
  setState({ filter: term });
  loadCases();
});

statusFilterEl.addEventListener('change', () => {
  setState({ statusFilter: statusFilterEl.value });
  loadCases();
});

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
setActiveView('cases');
loadCases();
