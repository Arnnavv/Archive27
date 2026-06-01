/* ============================================================
   ARCHIVE 27 — Shared Utilities  (Light Theme + Fixed Tabs)
   ============================================================ */
'use strict';

// ── Navigation ──────────────────────────────────────────────
const NAV_PAGES = [
  { href: 'pages/customer-intelligence.html', label: 'Customer Intel',      icon: '◉', id: 'customer-intelligence' },
  { href: 'pages/prediction-lab.html',        label: 'Prediction Lab',      icon: '⟁', id: 'prediction-lab' },
  { href: 'pages/recommendation-studio.html', label: 'Rec Studio',          icon: '◈', id: 'recommendation-studio' },
  { href: 'pages/forecasting-hub.html',       label: 'Forecasting Hub',     icon: '◎', id: 'forecasting-hub' },
  { href: 'pages/executive-insights.html',    label: 'Exec Insights',       icon: '◇', id: 'executive-insights' },
];
const NAV_PAGES_SUB = NAV_PAGES.map(l => ({ ...l, href: '../' + l.href }));

function buildNav(activeId, isHome = false) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const base     = isHome ? '' : '../';
  const pages    = isHome ? NAV_PAGES : NAV_PAGES_SUB;
  const aboutHref= base + (isHome ? 'pages/about.html' : '../pages/about.html').replace('../','');
  const homeHref = base + 'index.html';

  nav.innerHTML = `
    <a href="${homeHref}" class="nav-logo">
      <img src="${base}assets/logo-dark.png" class="nav-logo-img" alt="Archive 27"/>
      <span>Archive 27</span>
    </a>
    <ul class="nav-links" id="nav-links-list">
      <li>
        <div class="nav-dropdown-wrap">
          <button class="nav-dropdown-btn">
            Platform <span class="chevron">▾</span>
          </button>
          <div class="nav-dropdown">
            ${pages.map(l => `
              <a href="${l.href}" class="${l.id === activeId ? 'active' : ''}">
                <span class="nd-icon">${l.icon}</span>${l.label}
              </a>`).join('')}
          </div>
        </div>
      </li>
      <li>
        <a href="${isHome ? 'pages/about.html' : '../pages/about.html'}" class="${activeId === 'about' ? 'active' : ''}">
          About
        </a>
      </li>
    </ul>
    <div>
      <button class="nav-hamburger" id="nav-hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  document.getElementById('nav-hamburger')?.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) nav.classList.remove('mobile-open');
  });
}

// ── Plotly config (light theme) ───────────────────────────
const PLOTLY_CONFIG = {
  responsive: true,
  displayModeBar: true,
  modeBarButtonsToRemove: ['select2d','lasso2d','autoScale2d','hoverClosestCartesian','hoverCompareCartesian'],
  displaylogo: false,
};

const PLOTLY_LAYOUT_BASE = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor:  'rgba(0,0,0,0)',
  font:  { family: 'DM Sans, system-ui', color: '#3D3D40', size: 11 },
  xaxis: { gridcolor: '#E8E8ED', linecolor: '#E8E8ED', zerolinecolor: '#E8E8ED', tickfont: { color: '#86868B' } },
  yaxis: { gridcolor: '#E8E8ED', linecolor: '#E8E8ED', zerolinecolor: '#E8E8ED', tickfont: { color: '#86868B' } },
  legend: { bgcolor: 'rgba(0,0,0,0)', font: { color: '#3D3D40' }, bordercolor: '#E8E8ED', borderwidth: 1 },
  margin: { t: 40, b: 50, l: 60, r: 20 },
  colorway: ['#00916E','#1A6FCC','#C07800','#6E40C9','#D93025','#86868B'],
  hoverlabel: { bgcolor: '#FFFFFF', bordercolor: '#E0E0E5', font: { color: '#1D1D1F', family: 'DM Sans' } },
};

function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else { result[key] = source[key]; }
  }
  return result;
}
function plotlyLayout(overrides = {}) { return deepMerge(PLOTLY_LAYOUT_BASE, overrides); }

// ── Personas ──────────────────────────────────────────────
const PERSONA_COLORS = {
  'Aesthetic Chaser':  '#6E40C9',
  'Conscious Spender': '#00916E',
  'Bargain Hunter':    '#C07800',
  'Fence-Sitter':      '#1A6FCC',
  'Occasional Gifter': '#D93025',
  'Skeptic':           '#86868B',
};
const PERSONA_ORDER = ['Aesthetic Chaser','Conscious Spender','Bargain Hunter','Fence-Sitter','Occasional Gifter','Skeptic'];

// ── Counter ───────────────────────────────────────────────
function animateCounter(el, target, duration = 1400, prefix = '', suffix = '', decimals = 0) {
  const start = performance.now();
  function update(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = prefix + (decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString('en-IN')) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Tab System — FIXED ─────────────────────────────────────
// chartRegistry: { tabId: [fn1, fn2, ...] } — lazy render on first open
const _chartRegistry = {};
const _renderedTabs  = new Set();

function registerCharts(tabId, renderFn) {
  if (!_chartRegistry[tabId]) _chartRegistry[tabId] = [];
  _chartRegistry[tabId].push(renderFn);
}

function initTabs() {
  document.querySelectorAll('.tab-nav').forEach(tabNav => {
    const wrapper = tabNav.closest('.tabs-wrapper') || tabNav.parentElement;
    const btns    = tabNav.querySelectorAll('.tab-btn-nav');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Switch active button
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.dataset.tab;

        // Switch active panel
        wrapper.querySelectorAll('.tab-panel').forEach(p => {
          p.classList.toggle('active', p.dataset.tab === tabId);
        });

        // Lazy-render charts registered for this tab
        if (!_renderedTabs.has(tabId) && _chartRegistry[tabId]) {
          _renderedTabs.add(tabId);
          _chartRegistry[tabId].forEach(fn => fn());
        }
        // Also trigger resize for already-rendered Plotly charts
        setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
      });
    });

    // Render charts for the initially active tab immediately
    const activeBtn = tabNav.querySelector('.tab-btn-nav.active');
    if (activeBtn) {
      const tabId = activeBtn.dataset.tab;
      if (!_renderedTabs.has(tabId) && _chartRegistry[tabId]) {
        _renderedTabs.add(tabId);
        _chartRegistry[tabId].forEach(fn => fn());
      }
    }
  });
}

// ── Helpers ───────────────────────────────────────────────
function fmtINR(val) {
  if (val >= 10000000) return '₹' + (val/10000000).toFixed(1) + 'Cr';
  if (val >= 100000)   return '₹' + (val/100000).toFixed(1) + 'L';
  if (val >= 1000)     return '₹' + (val/1000).toFixed(1) + 'K';
  return '₹' + val;
}
function fmtPct(val, dec = 1) { return val.toFixed(dec) + '%'; }
function fmtNum(val) { return Number(val).toLocaleString('en-IN'); }

function safePlot(divId, data, layout, config = {}) {
  const el = document.getElementById(divId);
  if (!el) return;
  Plotly.newPlot(divId, data, plotlyLayout(layout), { ...PLOTLY_CONFIG, ...config });
}

function observeElements(selector, callback, options = {}) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { callback(entry.target); obs.unobserve(entry.target); } });
  }, { threshold: 0.15, ...options });
  document.querySelectorAll(selector).forEach(el => obs.observe(el));
}

window.A27 = {
  buildNav, PLOTLY_CONFIG, PLOTLY_LAYOUT_BASE, plotlyLayout,
  PERSONA_COLORS, PERSONA_ORDER, animateCounter, observeElements,
  initTabs, registerCharts, fmtINR, fmtPct, fmtNum, safePlot,
};
