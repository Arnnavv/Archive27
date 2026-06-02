'use strict';

// ── Plotly layout for cream theme ──
const PLOTLY_CONFIG = {responsive:true,displayModeBar:true,displaylogo:false,
  modeBarButtonsToRemove:['select2d','lasso2d','autoScale2d']};

const PLOTLY_BASE = {
  paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
  font:{family:'Jost, system-ui',color:'#6B6B64',size:11},
  xaxis:{gridcolor:'#E0DBD0',linecolor:'#D5D0C5',zerolinecolor:'#D5D0C5',tickfont:{color:'#9A9A90'}},
  yaxis:{gridcolor:'#E0DBD0',linecolor:'#D5D0C5',zerolinecolor:'#D5D0C5',tickfont:{color:'#9A9A90'}},
  legend:{bgcolor:'rgba(0,0,0,0)',font:{color:'#3A3A36'},bordercolor:'#D5D0C5',borderwidth:1},
  margin:{t:35,b:50,l:60,r:20},
  colorway:['#8B6914','#4A6741','#2A3D5C','#6B4F9E','#8B3A2A','#6B6B64'],
  hoverlabel:{bgcolor:'#FAFAF8',bordercolor:'#D5D0C5',font:{color:'#1A1A18',family:'Jost'}},
};

function _merge(t,s){const r={...t};for(const k in s)r[k]=(s[k]&&typeof s[k]==='object'&&!Array.isArray(s[k]))?_merge(t[k]||{},s[k]):s[k];return r;}
function layout(o={}){return _merge(PLOTLY_BASE,o);}

// ── Persona palette ──
const PC={
  'Aesthetic Chaser':'#6B4F9E','Conscious Spender':'#4A6741',
  'Bargain Hunter':'#8B6914','Fence-Sitter':'#2A3D5C',
  'Occasional Gifter':'#8B3A2A','Skeptic':'#6B6B64'
};
const PO=['Aesthetic Chaser','Conscious Spender','Bargain Hunter','Fence-Sitter','Occasional Gifter','Skeptic'];

// ── Safe plot — always works ──
function plot(id,data,lay,cfg={}){
  const el=document.getElementById(id);
  if(!el)return;
  try{Plotly.newPlot(id,data,layout(lay),{...PLOTLY_CONFIG,...cfg});}
  catch(e){console.error('Plot error',id,e);}
}

// ── Counter ──
function counter(el,target,dur=1400,pre='',suf=''){
  if(!el)return;
  const start=performance.now();
  function tick(ts){
    const p=Math.min((ts-start)/dur,1),ease=1-Math.pow(1-p,3);
    el.textContent=pre+Math.round(target*ease).toLocaleString('en-IN')+suf;
    if(p<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── Tab system with lazy chart rendering ──
const _reg={}, _done=new Set();
function reg(tabId,fn){if(!_reg[tabId])_reg[tabId]=[];_reg[tabId].push(fn);}
function _run(tabId){
  if(_done.has(tabId))return;
  _done.add(tabId);
  (_reg[tabId]||[]).forEach(fn=>fn());
}
function initTabs(){
  document.querySelectorAll('.tab-nav').forEach(nav=>{
    const wrap=nav.closest('.tabs-wrap')||nav.parentElement;
    const btns=nav.querySelectorAll('.tab-btn');
    const activeBtn=nav.querySelector('.tab-btn.active');
    if(activeBtn)_run(activeBtn.dataset.tab);
    btns.forEach(btn=>btn.addEventListener('click',()=>{
      btns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const id=btn.dataset.tab;
      wrap.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.dataset.tab===id));
      _run(id);
      setTimeout(()=>window.dispatchEvent(new Event('resize')),60);
    }));
  });
}

// ── Nav builder ──
const PAGES=[
  {href:'pages/customer-intelligence.html',label:'Customer Intel',id:'ci'},
  {href:'pages/prediction-lab.html',label:'Prediction Lab',id:'pl'},
  {href:'pages/recommendation-studio.html',label:'Rec Studio',id:'rs'},
  {href:'pages/forecasting-hub.html',label:'Forecasting',id:'fh'},
  {href:'pages/executive-insights.html',label:'Exec Insights',id:'ei'},
];
function buildNav(activeId,isHome=false){
  const nav=document.getElementById('main-nav');
  if(!nav)return;
  const b=isHome?'':'../';
  const left=isHome?PAGES:PAGES.map(p=>({...p,href:'../'+p.href}));
  const aboutHref=b+'pages/about.html';
  nav.innerHTML=`
    <div class="nav-left">
      ${left.slice(0,3).map(p=>`<a href="${p.href}" class="nav-link${p.id===activeId?' active':''}">${p.label}</a>`).join('')}
    </div>
    <a href="${b}index.html" class="nav-logo">
      <img src="${b}assets/logo-dark.png" alt="Archive 27" class="nav-logo-img"/>
    </a>
    <div class="nav-right">
      ${left.slice(3).map(p=>`<a href="${p.href}" class="nav-link${p.id===activeId?' active':''}">${p.label}</a>`).join('')}
      <a href="${aboutHref}" class="nav-link${activeId==='about'?' active':''}">About</a>
    </div>
    <button class="nav-hamburger" id="nhb"><span></span><span></span><span></span></button>
  `;
  document.getElementById('nhb')?.addEventListener('click',()=>nav.classList.toggle('open'));
  document.addEventListener('click',e=>{if(!nav.contains(e.target))nav.classList.remove('open');});
}

window.A27={plot,layout,counter,reg,initTabs,buildNav,PC,PO,PLOTLY_CONFIG};
