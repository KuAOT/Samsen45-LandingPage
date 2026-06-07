/* ===================== TWEAKS (host protocol + UI) ===================== */
(function(){
  const root=document.documentElement;
  const KEY='ss45_tweaks';
  const defaults={hero:'minimal',primary:'green',accent:'pink',font:'anuphan',constellation:'true'};
  let state=Object.assign({},defaults);
  try{const s=JSON.parse(localStorage.getItem(KEY)); if(s)state=Object.assign(state,s);}catch(e){}

  function apply(){
    root.dataset.hero=state.hero;
    root.dataset.primary=state.primary;
    root.dataset.accent=state.accent;
    root.dataset.font=state.font;
    root.dataset.constellation=state.constellation;
    document.querySelectorAll('[data-bind]').forEach(el=>el.setAttribute('aria-pressed', el.dataset.val===state[el.dataset.bind]?'true':'false'));
    document.querySelectorAll('[data-tg]').forEach(el=>el.dataset.on = state[el.dataset.tg]==='true'?'1':'0');
    // swap brand logo to match primary color
    const RES=window.__resources||{};
    const bl=document.querySelectorAll('.brand-logo');
    bl.forEach(img=>img.src = state.primary==='pink'?(RES.resLogoPink||'assets/logo-pink.png'):(RES.resLogoGreen||'assets/logo-green.png'));
  }
  function save(){ try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){} }
  function set(k,v){ state[k]=v; apply(); save(); }

  // build interactions
  document.querySelectorAll('#tw [data-bind]').forEach(b=>{
    b.addEventListener('click',()=>set(b.dataset.bind,b.dataset.val));
  });
  document.querySelectorAll('#tw [data-tg]').forEach(b=>{
    b.addEventListener('click',()=>set(b.dataset.tg, state[b.dataset.tg]==='true'?'false':'true'));
  });

  apply();

  // panel open/close + host protocol
  const panel=document.getElementById('tw');
  const closeBtn=document.getElementById('twClose');
  function setOpen(o){ panel.classList.toggle('show',o); try{parent.postMessage({type:'tweaks:state',open:o},'*');}catch(e){} }
  closeBtn&&closeBtn.addEventListener('click',()=>setOpen(false));
  window.addEventListener('message',(e)=>{
    const d=e.data||{};
    if(d.type==='tweaks:toggle') setOpen(!panel.classList.contains('show'));
    if(d.type==='tweaks:open') setOpen(true);
    if(d.type==='tweaks:close') setOpen(false);
    if(d.type==='tweaks:ping'){ try{parent.postMessage({type:'tweaks:available'},'*');}catch(_){ } }
  });
  try{parent.postMessage({type:'tweaks:available'},'*');}catch(e){}
})();
