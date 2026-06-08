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

/* ===================== COSMOS — shared memories of Samsen 45 ===================== */
(function(){
  const map=document.getElementById('dotmap'); if(!map) return;
  const svg=document.getElementById('dotlines');
  const nodes=document.getElementById('cosmosNodes');
  if(!svg||!nodes) return;
  const NS='http://www.w3.org/2000/svg';
  const R1=24, R2=39;

  // six constellations of shared school memories — what connects us, not what separates us
  const FIELDS=[
    {n:'วัยเรียน',    a:-90, c:'#EB649B', subs:['ห้องเรียน','กระดานดำ','ม้านั่ง','ตารางสอน']},
    {n:'ช่วงพัก',    a:-30, c:'#F5B921', subs:['โรงอาหาร','หน้าโรงเรียน','ขนม','เรื่องฮา']},
    {n:'กีฬาสี',     a: 30, c:'#64A231', subs:['เชียร์ลีด','วิ่งผลัด','ตะโกนเชียร์']},
    {n:'กิจกรรม',   a: 90, c:'#34A8DE', subs:['ค่ายนักเรียน','ชมรม','ดนตรีสด']},
    {n:'เพื่อน',     a:150, c:'#E84545', subs:['ซนด้วยกัน','แซวกัน','ช่วยกัน','อยู่เคียงกัน']},
    {n:'วันจบ',      a:210, c:'#8E63CE', subs:['รูปหมู่','คืนนั้น','น้ำตาปนยิ้ม']}
  ];

  const rad=d=>d*Math.PI/180;
  const px=(a,r)=>(50+r*Math.cos(rad(a)));
  const py=(a,r)=>(50+r*Math.sin(rad(a)));

  function line(x1,y1,x2,y2,cls,color,delay){
    const l=document.createElementNS(NS,'line');
    l.setAttribute('x1',x1);l.setAttribute('y1',y1);l.setAttribute('x2',x2);l.setAttribute('y2',y2);
    l.setAttribute('pathLength','1');l.setAttribute('class','link '+cls);
    l.style.setProperty('--lk',color);l.style.setProperty('--d',delay+'s');
    svg.appendChild(l);
  }
  function circ(cx,cy,r,cls){
    const c=document.createElementNS(NS,'circle');
    c.setAttribute('cx',cx);c.setAttribute('cy',cy);c.setAttribute('r',r);c.setAttribute('class',cls);
    return c;
  }

  // rotating concentric orbit rings
  const orbits=document.createElementNS(NS,'g');orbits.setAttribute('class','orbits');
  orbits.appendChild(circ(50,50,R1,'orbit'));
  orbits.appendChild(circ(50,50,R2,'orbit'));
  svg.appendChild(orbits);

  // ambient background stars (distant specialists)
  [[20,22],[78,17],[84,54],[29,83],[69,85],[14,59],[50,7],[91,37],[9,40],[58,29],[41,69],[73,47],[34,16],[66,15]]
    .forEach(s=>{const st=circ(s[0],s[1],(0.55+Math.random()*0.5).toFixed(2),'star');
      st.style.setProperty('--p',(Math.random()*3).toFixed(2)+'s');svg.appendChild(st);});

  // build the two-level tree
  FIELDS.forEach((f,fi)=>{
    const fx=px(f.a,R1), fy=py(f.a,R1);
    const co=Math.cos(rad(f.a)), si=Math.sin(rad(f.a));
    const side = co>0.4?'r' : co<-0.4?'l' : (si>0?'b':'t');
    const node=document.createElement('div');
    node.className='cn l1 lab-'+side;
    node.style.left=fx+'%';node.style.top=fy+'%';
    node.style.setProperty('--c',f.c);
    node.style.setProperty('--d',(0.1+fi*0.07).toFixed(2)+'s');
    node.innerHTML='<div class="d"></div>';
    nodes.appendChild(node);
    line(50,50,fx,fy,'l1',f.c,(0.45+fi*0.07).toFixed(2));

    const n=f.subs.length, spread=38, step=n>1?spread/(n-1):0, start=-spread/2;
    f.subs.forEach((s,si2)=>{
      const aa=f.a+(n>1?start+step*si2:0);
      const rr=R2+(si2%2?2.4:-1.6);
      const sx=px(aa,rr), sy=py(aa,rr);
      const sn=document.createElement('div');
      sn.className='cn l2';
      sn.style.left=sx+'%';sn.style.top=sy+'%';
      sn.style.setProperty('--c',f.c);
      sn.style.setProperty('--d',(0.5+fi*0.09+si2*0.05).toFixed(2)+'s');
      sn.style.setProperty('--p',(Math.random()*3).toFixed(2)+'s');
      sn.innerHTML='<div class="d"></div>';
      nodes.appendChild(sn);
      line(fx,fy,sx,sy,'l2',f.c,(0.85+fi*0.09+si2*0.05).toFixed(2));
    });
  });

  // light up when scrolled into view (IO + scroll fallback for embedded webviews)
  const lit=()=>map.classList.add('lit');
  const io=new IntersectionObserver(e=>{if(e[0].isIntersecting){lit();io.disconnect();}},{threshold:.3});
  io.observe(map);
  function chk(){if(map.getBoundingClientRect().top<window.innerHeight*0.85){lit();window.removeEventListener('scroll',chk);}}
  chk();window.addEventListener('scroll',chk,{passive:true});
})();

/* ===================== TEAM-GRID EMBLEM — draw in on scroll ===================== */
(function(){
  const el=document.getElementById('teamgrid'); if(!el) return;
  const lit=()=>el.classList.add('lit');
  const io=new IntersectionObserver(e=>{if(e[0].isIntersecting){lit();io.disconnect();}},{threshold:.3});
  io.observe(el);
  function chk(){if(el.getBoundingClientRect().top<window.innerHeight*0.85){lit();window.removeEventListener('scroll',chk);}}
  chk();window.addEventListener('scroll',chk,{passive:true});
})();

/* ===================== COUNTDOWN ===================== */
(function(){
  const target=new Date('2026-08-08T17:00:00+07:00').getTime();
  const dEl=document.getElementById('cd-d'),hEl=document.getElementById('cd-h'),mEl=document.getElementById('cd-m'),sEl=document.getElementById('cd-s');
  if(!dEl) return;
  const cd=document.getElementById('countdown');
  function pad(n){return String(n).padStart(2,'0');}
  function tick(){
    const now=Date.now(); let diff=target-now;
    if(diff<=0){ cd.innerHTML='<div style="font-family:var(--font-display);font-weight:700;font-size:26px;color:var(--brand);padding:14px 0">🎉 ถึงวันงานแล้ว — แล้วเจอกัน!</div>'; clearInterval(iv); return; }
    const d=Math.floor(diff/864e5); diff-=d*864e5;
    const h=Math.floor(diff/36e5); diff-=h*36e5;
    const m=Math.floor(diff/6e4); diff-=m*6e4;
    const s=Math.floor(diff/1e3);
    dEl.textContent=d; hEl.textContent=pad(h); mEl.textContent=pad(m); sEl.textContent=pad(s);
  }
  tick(); const iv=setInterval(tick,1000);
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
  document.querySelectorAll('.qa>button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const qa=btn.parentElement, ans=qa.querySelector('.ans'), open=qa.classList.contains('open');
      qa.parentElement.querySelectorAll('.qa.open').forEach(o=>{o.classList.remove('open');o.querySelector('.ans').style.maxHeight=null;});
      if(!open){ qa.classList.add('open'); ans.style.maxHeight=ans.scrollHeight+'px'; }
    });
  });
})();
