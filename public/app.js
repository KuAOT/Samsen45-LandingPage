/* ===================== CONSTELLATION BACKGROUND ===================== */
(function(){
  const cv = document.getElementById('constellation');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  let w,h,dpr,pts,raf;
  // 5 official SS45 house colors: pink, green, neon green, yellow, pastel pink
  const COLORS = ['rgba(235,100,155,OPA)','rgba(100,162,49,OPA)','rgba(189,255,60,OPA)','rgba(255,236,34,OPA)','rgba(231,150,190,OPA)'];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    dpr = Math.min(window.devicePixelRatio||1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w*dpr; cv.height = h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const density = Math.min(86, Math.round(w*h/16000));
    pts = Array.from({length:density},()=>({
      x:Math.random()*w, y:Math.random()*h,
      vx:(Math.random()-.5)*.18, vy:(Math.random()-.5)*.18,
      r:Math.random()*0.8+0.5,
      c: Math.floor(Math.random()*COLORS.length)
    }));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    // links
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const a=pts[i],b=pts[j];
        const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
        if(d<132){
          const o=(1-d/132)*0.14;
          ctx.strokeStyle = COLORS[a.c].replace('OPA', o.toFixed(3));
          ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
      }
    }
    // dots
    for(const p of pts){
      ctx.fillStyle = COLORS[p.c].replace('OPA','0.55');
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();
      if(!reduce){ p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1; }
    }
    raf = requestAnimationFrame(draw);
  }
  resize(); 
  if(reduce){ draw(); cancelAnimationFrame(raf); }
  else draw();
  let to; window.addEventListener('resize',()=>{clearTimeout(to);to=setTimeout(resize,180)});
})();

/* ===================== NAV ===================== */
(function(){
  const nav=document.querySelector('.nav');
  const onScroll=()=>nav.classList.toggle('scrolled', window.scrollY>20);
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
  const mBtn=document.getElementById('menuBtn'), mMenu=document.getElementById('mobileMenu');
  if(mBtn){ mBtn.addEventListener('click',()=>mMenu.classList.toggle('show'));
    mMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mMenu.classList.remove('show'))); }
})();

/* ===================== SCROLL SPINE (connecting dots) ===================== */
(function(){
  const connectors=[...document.querySelectorAll('.connector')];
  const nodes=[...document.querySelectorAll('.node')];
  function update(){
    const vh=window.innerHeight;
    connectors.forEach(c=>{
      const r=c.getBoundingClientRect();
      const start=vh*0.82, end=vh*0.34;
      let p=(start-r.top)/(start-end);
      p=Math.max(0,Math.min(1,p));
      c.querySelector('.fill').style.transform='scaleY('+p+')';
      const comet=c.querySelector('.comet');
      comet.style.top=(p*r.height)+'px';
      c.classList.toggle('drawing', p>0.02 && p<0.99);
    });
    nodes.forEach(n=>{
      const r=n.getBoundingClientRect();
      if(r.top < vh*0.72) n.classList.add('lit');
    });
  }
  update();
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
})();

/* ===================== REVEAL ON SCROLL (scroll-based; IO unreliable here) ===================== */
(function(){
  const els=[...document.querySelectorAll('.reveal')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){ els.forEach(e=>e.classList.add('show')); return; }
  // above-fold content shows instantly so nothing depends on a scroll event to appear
  const vh0=window.innerHeight;
  const pending=[];
  els.forEach(e=>{
    if(e.getBoundingClientRect().top < vh0*0.9) e.classList.add('show');
    else pending.push(e);
  });
  function check(){
    const vh=window.innerHeight;
    for(let i=pending.length-1;i>=0;i--){
      const e=pending[i];
      if(e.getBoundingClientRect().top < vh*0.86){ e.classList.add('in'); pending.splice(i,1); }
    }
  }
  check();
  window.addEventListener('scroll',check,{passive:true});
  window.addEventListener('resize',check);
})();

/* ===================== SINCE — time elapsed since the night ===================== */
(function(){
  const start=new Date('2026-08-08T17:00:00+07:00').getTime();
  const dEl=document.getElementById('sc-d'),hEl=document.getElementById('sc-h'),
        mEl=document.getElementById('sc-m'),sEl=document.getElementById('sc-s');
  if(!dEl) return;
  const pad=n=>String(n).padStart(2,'0');
  function tick(){
    let diff=Date.now()-start;
    if(diff<0) diff=0;                       // before the event, show zeros rather than negatives
    const d=Math.floor(diff/864e5); diff-=d*864e5;
    const h=Math.floor(diff/36e5);  diff-=h*36e5;
    const m=Math.floor(diff/6e4);   diff-=m*6e4;
    dEl.textContent=d; hEl.textContent=pad(h); mEl.textContent=pad(m); sEl.textContent=pad(Math.floor(diff/1e3));
  }
  tick(); setInterval(tick,1000);
})();

/* ===================== RE + SUFFIX KINETIC WORDPLAY (45 RE stays fixed) ===================== */
(function(){
  const img=document.getElementById('reword'); if(!img) return;
  // suffixes that join "45 RE" → REUNION · REMEMBER · REPLAY · RECONNECT
  // (resolve via window.__resources when bundled standalone, else direct path)
  const RES=window.__resources||{};
  const srcs=[
    {src:RES.resUnion  ||'assets/re-union-c.png',   alt:'UNION'},
    {src:RES.resUnite  ||'assets/re-unite-c.png',   alt:'UNITE'},
    {src:RES.resMember ||'assets/re-member-c.png',  alt:'MEMBER'},
    {src:RES.resPlay   ||'assets/re-play-c.png',    alt:'PLAY'},
    {src:RES.resConnect||'assets/re-connect-c.png', alt:'CONNECT'},
    {src:RES.resCharge ||'assets/re-charge-c.png',  alt:'CHARGE'}
  ];
  // preload all
  srcs.forEach(s=>{const i=new Image();i.src=s.src;});

  /* --- keep size/ratio consistent: cap height so the WIDEST word (RECONNECT)
     always fits the column; every suffix then renders at the same scale.
     The swap window is locked to the widest word's width so "45 RE" never
     shifts and each suffix butts up against "RE" with the same gap. --- */
  const banner=document.querySelector('.rebanner');
  const swap=img.parentElement;            // .re-swap
  const WIDEST_AR=(217+8+400)/84;          // 45 RE + gap + CONNECT (widest assembly)
  const SUF_AR=400/84;                     // widest suffix (CONNECT) aspect
  function fit(){
    const avail=banner.parentElement.clientWidth;
    const ideal=Math.min(112, Math.max(56, window.innerWidth*0.10));
    const fitH=(avail*0.96)/WIDEST_AR;
    const h=Math.max(40, Math.min(ideal, fitH));
    banner.style.height=h+'px';
    swap.style.width=(h*SUF_AR)+'px';       // reserve room for widest suffix
  }
  fit();
  let _to; window.addEventListener('resize',()=>{clearTimeout(_to);_to=setTimeout(fit,120);});

  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const DUR=2600;  // ms per word
  const OUT=420;   // exit ms
  const IN =460;   // enter ms
  const EASEOUT='transform '+OUT+'ms cubic-bezier(.5,0,.2,1), opacity '+OUT+'ms ease';
  const EASEIN ='transform '+IN +'ms cubic-bezier(.2,.85,.25,1), opacity '+IN+'ms ease';

  /* two stacked layers → both states are always painted, so the new word
     truly slides in instead of blinking (no mid-frame src swap / reflow race) */
  swap.style.position='relative';
  const b=img.cloneNode(false);
  b.removeAttribute('id'); b.alt='';
  swap.appendChild(b);
  [img,b].forEach(el=>{
    el.style.position='absolute'; el.style.left='0'; el.style.top='0';
    el.style.height='100%'; el.style.width='auto'; el.style.willChange='transform,opacity';
  });

  let cur=img, nxt=b, idx=0;
  cur.style.transform='translateY(0)';  cur.style.opacity='1';
  nxt.style.transform='translateY(110%)'; nxt.style.opacity='0';

  setInterval(()=>{
    idx=(idx+1)%srcs.length;
    // stage the incoming word below, fully painted, no transition
    nxt.style.transition='none';
    nxt.src=srcs[idx].src; nxt.alt=srcs[idx].alt;
    nxt.style.transform='translateY(110%)'; nxt.style.opacity='0';
    // small delay lets the staged frame paint, robust to rAF throttling
    setTimeout(()=>{
      cur.style.transition=EASEOUT;
      cur.style.transform='translateY(-110%)'; cur.style.opacity='0';
      nxt.style.transition=EASEIN;
      nxt.style.transform='translateY(0)'; nxt.style.opacity='1';
      const t=cur; cur=nxt; nxt=t;     // swap roles
    }, 40);
  }, DUR);
})();

/* ===================== FAQ ===================== */
(function(){
  // an item marked open in the markup needs its height applied — CSS starts every answer at 0
  document.querySelectorAll('.qa.open .ans').forEach(ans=>{ ans.style.maxHeight=ans.scrollHeight+'px'; });
  document.querySelectorAll('.qa>button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const qa=btn.parentElement, ans=qa.querySelector('.ans'), open=qa.classList.contains('open');
      qa.parentElement.querySelectorAll('.qa.open').forEach(o=>{o.classList.remove('open');o.querySelector('.ans').style.maxHeight=null;});
      if(!open){ qa.classList.add('open'); ans.style.maxHeight=ans.scrollHeight+'px'; }
    });
  });
})();

/* ===================== LIGHTBOX ===================== */
(function(){
  const lb=document.getElementById('lb'); if(!lb) return;
  const img=document.getElementById('lbImg'),
        numEl=document.getElementById('lbNum'), totalEl=document.getElementById('lbTotal');
  let group=[], idx=0, lastFocus=null;

  function preload(i){ if(group[i]){ const p=new Image(); p.src=group[i].dataset.full; } }

  function paint(){
    const btn=group[idx];
    lb.classList.add('loading');
    img.src=btn.dataset.full;
    img.alt=btn.querySelector('img').alt;
    numEl.textContent=idx+1; totalEl.textContent=group.length;
    preload(idx+1); preload(idx-1);
  }
  img.addEventListener('load',()=>lb.classList.remove('loading'));
  img.addEventListener('error',()=>lb.classList.remove('loading'));

  function open(btn){
    group=[...btn.closest('#masonry').querySelectorAll('.shot')];
    idx=group.indexOf(btn);
    lastFocus=btn;
    paint();
    lb.classList.add('show');
    document.body.style.overflow='hidden';
    document.getElementById('lbClose').focus();
  }
  function close(){
    lb.classList.remove('show');
    document.body.style.overflow='';
    img.src='';
    if(lastFocus) lastFocus.focus();
  }
  const step=n=>{ idx=(idx+n+group.length)%group.length; paint(); };

  document.addEventListener('click',e=>{
    const btn=e.target.closest('.shot'); if(!btn) return;
    e.preventDefault(); open(btn);
  });
  document.getElementById('lbClose').addEventListener('click',close);
  document.getElementById('lbPrev').addEventListener('click',()=>step(-1));
  document.getElementById('lbNext').addEventListener('click',()=>step(1));
  lb.addEventListener('click',e=>{ if(e.target===lb||e.target.classList.contains('lb-stage')) close(); });

  document.addEventListener('keydown',e=>{
    if(!lb.classList.contains('show')) return;
    if(e.key==='Escape') close();
    else if(e.key==='ArrowRight') step(1);
    else if(e.key==='ArrowLeft') step(-1);
  });

  // swipe on touch devices
  let x0=null;
  lb.addEventListener('touchstart',e=>{ x0=e.changedTouches[0].clientX; },{passive:true});
  lb.addEventListener('touchend',e=>{
    if(x0===null) return;
    const dx=e.changedTouches[0].clientX-x0; x0=null;
    if(Math.abs(dx)>50) step(dx<0?1:-1);
  },{passive:true});
})();

/* ===================== PHOTO-BOOTH BOOMERANG =====================
   Deliberately one clip at a time: a grid of looping video reads as noise beside
   the stills, and constant motion is a vestibular-discomfort trigger. Only the
   selected clip is ever fetched, so the section costs ~750KB instead of 8.5MB.
   Scroll-driven rather than IntersectionObserver, matching the reveal code above. */
(function(){
  const wrap=document.getElementById('boomer'); if(!wrap) return;
  const vid=document.getElementById('boomVid');
  const toggle=document.getElementById('boomToggle');
  const thumbs=[...document.querySelectorAll('#boomThumbs .bt')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  let wantPlay=!reduce;                    // the viewer's intent, not the current state
  toggle.setAttribute('aria-pressed', String(wantPlay));
  toggle.setAttribute('aria-label', wantPlay?'หยุดเล่นคลิป':'เล่นคลิป');

  function tryPlay(){
    if(!wantPlay) return;
    if(!vid.src) vid.src=vid.dataset.src;  // fetch only once actually wanted
    const p=vid.play();
    if(p&&p.catch) p.catch(()=>{});        // refusal or no codec: the poster stays
  }
  function inView(){
    const r=wrap.getBoundingClientRect();
    return r.top < innerHeight*0.9 && r.bottom > innerHeight*0.1;
  }
  function sync(){ inView() ? tryPlay() : vid.pause(); }

  thumbs.forEach(bt=>bt.addEventListener('click',()=>{
    thumbs.forEach(o=>o.classList.remove('is-active'));
    bt.classList.add('is-active');
    vid.poster=bt.dataset.poster;
    vid.removeAttribute('src');
    vid.dataset.src=bt.dataset.src;
    vid.load();                            // drop the previous clip before the next
    tryPlay();
  }));

  toggle.addEventListener('click',()=>{
    wantPlay=!wantPlay;
    toggle.setAttribute('aria-pressed', String(wantPlay));
    toggle.setAttribute('aria-label', wantPlay?'หยุดเล่นคลิป':'เล่นคลิป');
    wantPlay ? tryPlay() : vid.pause();
  });

  sync();
  addEventListener('scroll',sync,{passive:true});
  addEventListener('resize',sync);
})();
