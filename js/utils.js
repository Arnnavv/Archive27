/* ============================================================
   ARCHIVE 27 — Shared Utilities
   ============================================================ */

'use strict';

// ── Navigation ──────────────────────────────────────────────
const NAV_LINKS = [
  { href: '../index.html',                     label: 'Home',                   icon: '⌂',  id: 'home' },
  { href: '../pages/customer-intelligence.html', label: 'Customer Intel',       icon: '◉',  id: 'customer-intelligence' },
  { href: '../pages/prediction-lab.html',      label: 'Prediction Lab',         icon: '⟁',  id: 'prediction-lab' },
  { href: '../pages/recommendation-studio.html', label: 'Rec Studio',          icon: '◈',  id: 'recommendation-studio' },
  { href: '../pages/forecasting-hub.html',     label: 'Forecasting Hub',        icon: '◎',  id: 'forecasting-hub' },
  { href: '../pages/executive-insights.html',  label: 'Exec Insights',          icon: '◇',  id: 'executive-insights' },
  { href: '../pages/about.html',               label: 'About',                  icon: '○',  id: 'about' },
];

const NAV_LINKS_HOME = NAV_LINKS.map(l => ({
  ...l,
  href: l.id === 'home' ? 'index.html' : l.href.replace('../', '')
}));

function buildNav(activeId, isHome = false) {
  const links = isHome ? NAV_LINKS_HOME : NAV_LINKS;
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  nav.innerHTML = `
    <a href="${isHome ? 'index.html' : '../index.html'}" class="nav-logo">
      <div class="nav-logo-mark">A27</div>
      <span>Archive 27</span>
    </a>
    <ul class="nav-links" id="nav-links-list">
      ${links.map(l => `
        <li>
          <a href="${l.href}" class="${l.id === activeId ? 'active' : ''}">
            <span class="nav-icon">${l.icon}</span>${l.label}
          </a>
        </li>
      `).join('')}
    </ul>
    <div class="nav-cta">
      <button class="nav-hamburger" id="nav-hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  document.getElementById('nav-hamburger')?.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) nav.classList.remove('mobile-open');
  });
}

// ── Plotly default config ─────────────────────────────────
const PLOTLY_CONFIG = {
  responsive: true,
  displayModeBar: true,
  modeBarButtonsToRemove: ['select2d','lasso2d','autoScale2d','hoverClosestCartesian','hoverCompareCartesian'],
  displaylogo: false,
  toImageButtonOptions: { format: 'png', scale: 2 }
};

const PLOTLY_LAYOUT_BASE = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor:  'rgba(0,0,0,0)',
  font:  { family: 'DM Sans, system-ui', color: '#B0B5B2', size: 11 },
  xaxis: { gridcolor: '#2A2D2B', linecolor: '#2A2D2B', zerolinecolor: '#2A2D2B', tickfont: { color: '#6E7370' } },
  yaxis: { gridcolor: '#2A2D2B', linecolor: '#2A2D2B', zerolinecolor: '#2A2D2B', tickfont: { color: '#6E7370' } },
  legend: { bgcolor: 'rgba(0,0,0,0)', font: { color: '#B0B5B2' }, bordercolor: '#2A2D2B', borderwidth: 1 },
  margin: { t: 40, b: 50, l: 60, r: 20 },
  colorway: ['#00C896','#4A9EFF','#F0A500','#A78BFA','#FF5F57','#6E7370'],
  hoverlabel: { bgcolor: '#1E211F', bordercolor: '#2A2D2B', font: { color: '#E8EAE8', family: 'DM Sans' } },
};

function plotlyLayout(overrides = {}) {
  return deepMerge(PLOTLY_LAYOUT_BASE, overrides);
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// ── Persona palette ────────────────────────────────────────
const PERSONA_COLORS = {
  'Aesthetic Chaser':  '#A78BFA',
  'Conscious Spender': '#00C896',
  'Bargain Hunter':    '#F0A500',
  'Fence-Sitter':      '#4A9EFF',
  'Occasional Gifter': '#FF5F57',
  'Skeptic':           '#6E7370',
};
const PERSONA_ORDER = ['Aesthetic Chaser','Conscious Spender','Bargain Hunter','Fence-Sitter','Occasional Gifter','Skeptic'];

// ── Counter animation ──────────────────────────────────────
function animateCounter(el, target, duration = 1400, prefix = '', suffix = '', decimals = 0) {
  const start = performance.now();
  const isFloat = decimals > 0;
  function update(ts) {
    const elapsed = ts - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = prefix + (isFloat ? current.toFixed(decimals) : Math.round(current).toLocaleString('en-IN')) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Intersection Observer for animations ──────────────────
function observeElements(selector, callback, options = {}) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, ...options });
  document.querySelectorAll(selector).forEach(el => obs.observe(el));
}

// ── Tab System ────────────────────────────────────────────
function initTabs(containerSel = '.tab-nav', panelSel = '.tab-panel') {
  document.querySelectorAll(containerSel).forEach(nav => {
    const btns = nav.querySelectorAll('.tab-btn-nav');
    const parent = nav.closest('.tabs-wrapper') || nav.parentElement;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.tab;
        parent.querySelectorAll(panelSel).forEach(p => {
          p.classList.toggle('active', p.dataset.tab === target);
        });
        // Trigger Plotly resize for charts inside panels
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      });
    });
  });
}

// ── Format helpers ────────────────────────────────────────
function fmtINR(val) {
  if (val >= 10000000) return '₹' + (val/10000000).toFixed(1) + 'Cr';
  if (val >= 100000)   return '₹' + (val/100000).toFixed(1) + 'L';
  if (val >= 1000)     return '₹' + (val/1000).toFixed(1) + 'K';
  return '₹' + val;
}
function fmtPct(val, dec = 1) { return val.toFixed(dec) + '%'; }
function fmtNum(val) { return Number(val).toLocaleString('en-IN'); }

// ── Toast ─────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;
    background:#1E211F;border:1px solid #2A2D2B;color:#E8EAE8;
    padding:.75rem 1.25rem;border-radius:8px;font-size:.84rem;
    box-shadow:0 8px 24px rgba(0,0,0,.5);
    animation:fadeUp .3s ease;
    max-width:320px;line-height:1.5;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Responsive Plotly helper ──────────────────────────────
function safePlot(divId, data, layout, config = {}) {
  const el = document.getElementById(divId);
  if (!el) return;
  Plotly.newPlot(divId, data, plotlyLayout(layout), { ...PLOTLY_CONFIG, ...config });
}

window.A27 = {
  buildNav, PLOTLY_CONFIG, PLOTLY_LAYOUT_BASE, plotlyLayout,
  PERSONA_COLORS, PERSONA_ORDER, animateCounter, observeElements,
  initTabs, fmtINR, fmtPct, fmtNum, toast, safePlot
};
