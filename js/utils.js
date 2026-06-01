/* ============================================================
   ARCHIVE 27 — Shared Utilities  |  Dark Theme  |  Fixed Tabs
   ============================================================ */
'use strict';

// ── Navigation pages ──────────────────────────────────────
const NAV_PAGES = [
  { href:'pages/customer-intelligence.html', label:'Customer Intel',  icon:'◉', id:'customer-intelligence' },
  { href:'pages/prediction-lab.html',        label:'Prediction Lab',  icon:'⟁', id:'prediction-lab' },
  { href:'pages/recommendation-studio.html', label:'Rec Studio',      icon:'◈', id:'recommendation-studio' },
  { href:'pages/forecasting-hub.html',       label:'Forecasting Hub', icon:'◎', id:'forecasting-hub' },
  { href:'pages/executive-insights.html',    label:'Exec Insights',   icon:'◇', id:'executive-insights' },
];

function buildNav(activeId, isHome = false) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const base  = isHome ? '' : '../';
  const pages = isHome ? NAV_PAGES : NAV_PAGES.map(l => ({ ...l, href: '../' + l.href }));

  nav.innerHTML = `
    <a href="${base}index.html" class="nav-logo">
      <img src="${base}assets/logo-white.png" class="nav-logo-img" alt="Archive 27" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
      <div class="nav-logo-mark" style="display:none">A27</div>
      <span>Archive 27</span>
    </a>
    <ul class="nav-links" id="nav-links-list">
      <li>
        <div class="nav-dropdown-wrap">
          <button class="nav-dropdown-btn">Platform <span class="chevron">▾</span></button>
          <div class="nav-dropdown">
            ${pages.map(l => `<a href="${l.href}" class="${l.id===activeId?'active':''}"><span class="nd-icon">${l.icon}</span>${l.label}</a>`).join('')}
          </div>
        </div>
      </li>
      <li><a href="${base}pages/about.html" class="${activeId==='about'?'active':''}">About</a></li>
    </ul>
    <div><button class="nav-hamburger" id="nav-hamburger" aria-label="Menu"><span></span><span></span><span></span></button></div>
  `;

  document.getElementById('nav-hamburger')?.addEventListener('click', () => nav.classList.toggle('mobile-open'));
  document.addEventListener('click', e => { if (!nav.contains(e.target)) nav.classList.remove('mobile-open'); });
}

// ── Plotly config (dark theme) ─────────────────────────────
const PLOTLY_CONFIG = {
  responsive: true,
  displayModeBar: true,
  modeBarButtonsToRemove: ['select2d','lasso2d','autoScale2d','hoverClosestCartesian','hoverCompareCartesian'],
  displaylogo: false,
};
const PLOTLY_LAYOUT_BASE = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor:  'rgba(0,0,0,0)',
  font:  { family:'DM Sans, system-ui', color:'#B0B5B2', size:11 },
  xaxis: { gridcolor:'#2A2D2B', linecolor:'#2A2D2B', zerolinecolor:'#2A2D2B', tickfont:{color:'#6E7370'} },
  yaxis: { gridcolor:'#2A2D2B', linecolor:'#2A2D2B', zerolinecolor:'#2A2D2B', tickfont:{color:'#6E7370'} },
  legend:{ bgcolor:'rgba(0,0,0,0)', font:{color:'#B0B5B2'}, bordercolor:'#2A2D2B', borderwidth:1 },
  margin:{ t:40, b:50, l:60, r:20 },
  colorway:['#00C896','#4A9EFF','#F0A500','#A78BFA','#FF5F57','#6E7370'],
  hoverlabel:{ bgcolor:'#1E211F', bordercolor:'#2A2D2B', font:{color:'#E8EAE8',family:'DM Sans'} },
};
function deepMerge(t, s) {
  const r = { ...t };
  for (const k in s) r[k] = (s[k] && typeof s[k]==='object' && !Array.isArray(s[k])) ? deepMerge(t[k]||{}, s[k]) : s[k];
  return r;
}
function plotlyLayout(o = {}) { return deepMerge(PLOTLY_LAYOUT_BASE, o); }

// ── Personas ──────────────────────────────────────────────
const PERSONA_COLORS = {
  'Aesthetic Chaser': '#A78BFA', 'Conscious Spender':'#00C896',
  'Bargain Hunter':   '#F0A500', 'Fence-Sitter':     '#4A9EFF',
  'Occasional Gifter':'#FF5F57', 'Skeptic':           '#6E7370',
};
const PERSONA_ORDER = ['Aesthetic Chaser','Conscious Spender','Bargain Hunter','Fence-Sitter','Occasional Gifter','Skeptic'];

// ── Counter ───────────────────────────────────────────────
function animateCounter(el, target, duration=1400, prefix='', suffix='', decimals=0) {
  if (!el) return;
  const start = performance.now();
  function update(ts) {
    const p = Math.min((ts-start)/duration, 1);
    const ease = 1 - Math.pow(1-p, 3);
    el.textContent = prefix + (decimals>0 ? (target*ease).toFixed(decimals) : Math.round(target*ease).toLocaleString('en-IN')) + suffix;
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Tab System — FIXED (lazy render) ──────────────────────
const _chartReg   = {};   // tabId → [renderFn, ...]
const _rendered   = new Set();

function registerCharts(tabId, fn) {
  if (!_chartReg[tabId]) _chartReg[tabId] = [];
  _chartReg[tabId].push(fn);
}

function _runCharts(tabId) {
  if (_rendered.has(tabId)) return;
  _rendered.add(tabId);
  (_chartReg[tabId] || []).forEach(fn => fn());
}

function initTabs() {
  document.querySelectorAll('.tab-nav').forEach(tabNav => {
    const wrapper = tabNav.closest('.tabs-wrapper') || tabNav.parentElement;
    const btns    = tabNav.querySelectorAll('.tab-btn-nav');

    // Render charts for the initially active tab right now
    const activeBtn = tabNav.querySelector('.tab-btn-nav.active');
    if (activeBtn) _runCharts(activeBtn.dataset.tab);

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        wrapper.querySelectorAll('.tab-panel').forEach(p => {
          p.classList.toggle('active', p.dataset.tab === tabId);
        });
        _runCharts(tabId);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
      });
    });
  });
}

// ── Helpers ───────────────────────────────────────────────
function fmtINR(v) { return v>=1e7?'₹'+(v/1e7).toFixed(1)+'Cr':v>=1e5?'₹'+(v/1e5).toFixed(1)+'L':v>=1e3?'₹'+(v/1e3).toFixed(1)+'K':'₹'+v; }
function fmtPct(v,d=1) { return v.toFixed(d)+'%'; }
function fmtNum(v) { return Number(v).toLocaleString('en-IN'); }

function safePlot(divId, data, layout, config={}) {
  const el = document.getElementById(divId);
  if (!el) return;
  Plotly.newPlot(divId, data, plotlyLayout(layout), { ...PLOTLY_CONFIG, ...config });
}

function observeElements(sel, cb, opts={}) {
  const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){cb(e.target);obs.unobserve(e.target);} }), {threshold:.15,...opts});
  document.querySelectorAll(sel).forEach(el => obs.observe(el));
}

window.A27 = {
  buildNav, PLOTLY_CONFIG, PLOTLY_LAYOUT_BASE, plotlyLayout,
  PERSONA_COLORS, PERSONA_ORDER, animateCounter, observeElements,
  initTabs, registerCharts, fmtINR, fmtPct, fmtNum, safePlot,
};
