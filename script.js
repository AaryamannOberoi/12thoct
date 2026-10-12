/* ============================================================
   JANNAT'S SCRAPBOOK
   Edit the words here (CAPTIONS and MESSAGE) — nothing else needed.
   ============================================================ */

// ---- Captions: exactly as written, page 1 to 12 ----
const CAPTIONS = [
  "when u touch my face the 5 year old boy in me smiles",
  "the typpa photo I show my kids ki mom and I used to look aise in college,magical simply",
  "I am never letting go of that hand ever again , ever in my life (you looked like a goddess btw that day",
  "meri artist hai tu, I wanna become ur lifetime canvas",
  "me and my baby in lapinoz I saw this video and I saw how u laugh w me , I promise there wont be a day I dont try to make ur day better",
  "This u wont get this but, its a part of the video of us kissing ,when u hold my hair from the back it does things to me beyond words , its like home, it does get me horny too tho but safe too-",
  "pair chune se paap lagta hoga , but apni bandi ke chune mei ni lagta ,lagega toh bhi idc",
  "yk yk ykykykkyky gengar hahahahah i love you",
  "MERE SAARE KAPDE TER",
  "I can bet, nobody would adore sleeping obi like his jaanu aise ever again , I- every thing u do in my context is so wholesome Ill never let this go, I was a fool for ever letting it go",
  "this shoulder is always gonna be urs to rest on now",
  "I love you, I love you I love you and only you"
];

// ---- Final message, one entry per paragraph ----
const MESSAGE = [
  "Jannat, I finally, in my life, am in love with the most perfect girl. And it is pure, selfless love.",
  "I hurt you in the past. We were too young, we were naive, and I was naive. I was on antidepressants. I wanted it to be you even back then, but you wanted to rush, which was fair on your part, and you didn't know my side. We didn't communicate right.",
  "But now we both know what to do and how to do it. We know each other better than ever: my bad, my good, what I was, what I want to be, and why I am how I am. You make me want to be a better person, for you, and most importantly for myself. This feeling you give me is the most soothing thing I have felt in my life.",
  "Apart from loving you, I am thankful. THANK YOU for seeing me the way you do. I am not just any boy. I am the luckiest boy in the world because of you wanting me and loving me.",
  "You may not agree, but hote hai logo ki life mei Bob the Builder. You are my Jannat the builder.",
  "I promise I will never let you down. I love you Jannat, to the moon and back and infinitely many rounds.",
  "So Jannat, will you sign this lifetime wala contract with me?"
];

const TOTAL = CAPTIONS.length;               // 12
const photoPath = n => `photos/pic${n}.jpeg`;
const TILTS = [-1.6,1.2,-0.8,1.8,-1.4,0.9,-1.9,1.5,-0.7,1.3,-1.2,1.7];
const STICKERS = ['💖','⭐','🎀','🌸','✨','☁️','🌷','💗','🍓','🦋','🧸','💕'];
const SLOTS = [
  {top:'0.5%',left:'1%'},{top:'0.5%',right:'1%'},{top:'18%',left:'0%'},{top:'20%',right:'0%'},
  {top:'44%',left:'0%'},{top:'46%',right:'0%'},{top:'66%',left:'0%'},{top:'68%',right:'0%'}
];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);

let current = 1;        // current photo page
let busy = false;       // lock during page turns

/* ---------- tiny seeded random so sticker layout is fixed per page ---------- */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* ---------- preload all photos ---------- */
for (let i = 1; i <= TOTAL; i++) { const im = new Image(); im.src = photoPath(i); }

/* ---------- floating hearts background ---------- */
(function hearts(){
  const bg = $('bg'), pool = ['💗','💖','✨','💕','🌸','💞'];
  for (let i = 0; i < 14; i++){
    const s = document.createElement('span');
    s.className = 'fh';
    s.textContent = pool[i % pool.length];
    s.style.left = (Math.random()*96) + '%';
    s.style.fontSize = (14 + Math.random()*20) + 'px';
    s.style.animationDuration = (11 + Math.random()*12) + 's';
    s.style.animationDelay = (-Math.random()*20) + 's';
    s.style.setProperty('--dx', (Math.random()*80-40) + 'px');
    bg.appendChild(s);
  }
  document.addEventListener('visibilitychange', () => bg.classList.toggle('paused', document.hidden));
})();

/* ---------- spiral binding (ring count adapts to size) ---------- */
function buildSpirals(){
  document.querySelectorAll('.spiral').forEach(sp => {
    const vertical = sp.clientHeight > sp.clientWidth;
    const len = vertical ? sp.clientHeight : sp.clientWidth;
    if (!len) return;
    const n = Math.max(6, Math.floor(len / (vertical ? 30 : 22)));
    if (sp.children.length === n) return;
    sp.innerHTML = '';
    for (let i = 0; i < n; i++){
      const c = document.createElement('div'); c.className = 'coil';
      c.innerHTML = '<span class="hole"></span><span class="wire"></span>';
      sp.appendChild(c);
    }
  });
}

/* ---------- screens ---------- */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  buildSpirals();
  fitPhoto();
}
function activeSheet(){ return document.querySelector('.screen.active .sheet'); }

/* page-turn: flip current sheet out, run swap(), flip new sheet in */
function turn(dir, swap){          // dir: 'next' | 'prev'
  if (busy) return;
  busy = true;
  if (reduceMotion){ swap(); busy = false; return; }
  const out = activeSheet();
  out.classList.add('out-' + dir);
  setTimeout(() => {
    out.classList.remove('out-' + dir);
    swap();
    const inn = activeSheet();
    inn.classList.add('in-' + dir);
    setTimeout(() => { inn.classList.remove('in-' + dir); busy = false; }, 360);
  }, 300);
}

/* ---------- photo pages ---------- */
function renderPage(n){
  current = n;
  const body = $('pageBody');
  body.innerHTML = '';

  // stickers: only in the margins, always behind the photo
  const st = document.createElement('div'); st.className = 'stickers';
  const rnd = mulberry(n * 977);
  const slots = SLOTS.slice().sort(() => rnd() - 0.5).slice(0, 4);
  slots.forEach((pos, k) => {
    const s = document.createElement('span'); s.className = 'stk';
    s.textContent = STICKERS[Math.floor(rnd() * STICKERS.length)];
    Object.assign(s.style, pos);
    s.style.fontSize = (1.4 + rnd() * 0.8) + 'rem';
    s.style.animationDelay = (0.9 + k * 0.18) + 's, ' + (rnd()*3) + 's';
    st.appendChild(s);
  });

  const box = document.createElement('div'); box.className = 'photoBox';
  const pol = document.createElement('div'); pol.className = 'polaroid';
  pol.style.setProperty('--tilt', TILTS[n-1] + 'deg');
  const tape = document.createElement('span'); tape.className = 'tape';
  const img = document.createElement('img');
  img.alt = 'Photo ' + n;
  img.decoding = 'async';
  img.onerror = () => {
    console.error('Photo not found:', photoPath(n));
    const m = document.createElement('div'); m.className = 'missing';
    m.textContent = 'photo not found: ' + photoPath(n);
    img.replaceWith(m);
  };
  img.onload = fitPhoto;
  img.src = photoPath(n);
  pol.append(tape, img); box.appendChild(pol);

  const note = document.createElement('div'); note.className = 'note';
  const cap = document.createElement('p'); cap.className = 'caption';
  cap.textContent = CAPTIONS[n-1];
  note.appendChild(cap);

  body.append(st, box, note);
  $('indicator').textContent = n + ' / ' + TOTAL;
  $('backBtn').disabled = (n === 1);
  $('nextBtn').textContent = (n === TOTAL) ? 'One last thing' : 'Next';
  requestAnimationFrame(fitPhoto);
}

/* size each photo to the space left, never cropping, never upscaling */
function fitPhoto(){
  const box = document.querySelector('#pageBody .photoBox');
  const img = document.querySelector('#pageBody .photoBox img');
  if (!box || !img) return;
  img.style.maxHeight = Math.max(120, box.clientHeight - 54 - 18) + 'px';
  img.style.maxWidth  = Math.max(120, box.clientWidth - 24 - 24) + 'px';
}

function go(delta){
  const target = current + delta;
  if (busy) return;
  if (target < 1) return;
  if (target > TOTAL){ openFinal(); return; }
  turn(delta > 0 ? 'next' : 'prev', () => renderPage(target));
}

function burst(btn){
  if (reduceMotion) return;
  const r = btn.getBoundingClientRect(), cx = r.left + r.width/2, cy = r.top + r.height/2;
  for (let i = 0; i < 8; i++){
    const h = document.createElement('span'); h.className = 'burst';
    h.textContent = ['💗','💖','💕','✨'][i % 4];
    h.style.left = cx + 'px'; h.style.top = cy + 'px';
    const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 60;
    h.style.setProperty('--bx', Math.cos(a)*d + 'px');
    h.style.setProperty('--by', (Math.sin(a)*d - 30) + 'px');
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 950);
  }
}

/* ---------- controls ---------- */
$('openBtn').addEventListener('click', e => { burst(e.currentTarget); turn('next', () => { showScreen('photos'); renderPage(1); }); });
$('nextBtn').addEventListener('click', e => { burst(e.currentTarget); go(1); });
$('backBtn').addEventListener('click', () => go(-1));
$('reviewBtn').addEventListener('click', () => turn('prev', () => { showScreen('photos'); renderPage(TOTAL); }));

document.addEventListener('keydown', e => {
  const id = document.querySelector('.screen.active').id;
  if (id === 'photos'){
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  } else if (id === 'final' && e.key === 'ArrowLeft' && e.target.tagName !== 'INPUT'){
    $('reviewBtn').click();
  } else if (id === 'cover' && (e.key === 'Enter' || e.key === 'ArrowRight')){
    $('openBtn').click();
  }
});

let tx = 0, ty = 0;
$('photos').addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, {passive:true});
$('photos').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1);
}, {passive:true});

window.addEventListener('resize', () => { buildSpirals(); fitPhoto(); });

/* ============================================================
   FINAL PAGE
   ============================================================ */
let timers = [], revealed = false;

function openFinal(){
  turn('next', () => { showScreen('final'); startMessage(); });
}

function startMessage(){
  const msg = $('message');
  if (revealed) return;                       // already read once
  msg.innerHTML = '';
  MESSAGE.forEach(t => { const p = document.createElement('p'); p.textContent = t; msg.appendChild(p); });
  const ps = [...msg.children];
  let t = 700;
  ps.forEach((p, i) => {
    const id = setTimeout(() => {
      p.classList.add('show');
      p.scrollIntoView({block:'nearest', behavior:'smooth'});
      if (i === ps.length - 1) timers.push(setTimeout(finishMessage, 1800));
    }, t);
    timers.push(id);
    const slow = i >= ps.length - 3;
    t += slow ? 3600 : 2600 + Math.min(p.textContent.length * 12, 3200);
  });
}
function finishMessage(){
  revealed = true;
  timers.forEach(clearTimeout); timers = [];
  document.querySelectorAll('#message p').forEach(p => p.classList.add('show'));
  $('skipBtn').parentElement.classList.add('hidden');
  const sb = $('signBox');
  if (sb.classList.contains('hidden')){
    sb.classList.remove('hidden');
    setTimeout(() => sb.scrollIntoView({block:'center', behavior:'smooth'}), 150);
  }
}
$('skipBtn').addEventListener('click', finishMessage);

/* ---------- signing ---------- */
let signed = false;
$('signBtn').addEventListener('click', () => {
  if (signed) return;
  const input = $('nameInput'), name = input.value.trim();
  if (!name){
    $('err').textContent = 'Please sign your name';
    input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake');
    input.focus();
    return;
  }
  signed = true;
  $('err').textContent = '';
  input.disabled = true;
  $('signBtn').disabled = true;
  $('signBtn').classList.remove('pulse');
  $('signBtn').textContent = 'Signed ✓';

  const sig = $('sigText'); sig.textContent = name; sig.classList.add('write');

  setTimeout(() => {
    $('stamp').classList.add('slam');
    const book = $('finalSheet').parentElement;
    book.classList.add('quake');
    setTimeout(() => book.classList.remove('quake'), 400);
    launchConfetti();
    const d = new Date().toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric'});
    const sl = $('signedLine');
    sl.textContent = 'Signed: ' + name + ' · ' + d;
    sl.classList.remove('hidden');
    sl.scrollIntoView({block:'center', behavior:'smooth'});
    keepHearts();
  }, reduceMotion ? 0 : 1500);
});
$('nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('signBtn').click(); });
$('nameInput').addEventListener('input', () => { $('err').textContent = ''; });

/* ---------- confetti (canvas, ~90 pieces, once) ---------- */
function launchConfetti(){
  if (reduceMotion) return;
  const cv = $('confetti'), ctx = cv.getContext('2d');
  cv.width = innerWidth; cv.height = innerHeight;
  const colors = ['#F0508A','#FF8FB1','#FFC2D6','#FFE4EC','#C2185B','#F4C27A','#ffffff'];
  const parts = Array.from({length: 90}, (_, i) => ({
    x: cv.width/2, y: cv.height*0.45,
    vx: (Math.random()-0.5)*14, vy: -Math.random()*14 - 4,
    s: 6 + Math.random()*8, r: Math.random()*6, vr: (Math.random()-0.5)*0.4,
    c: colors[i % colors.length], heart: i % 3 === 0
  }));
  let frames = 0;
  (function tick(){
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach(p => {
      p.vy += 0.28; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      if (p.heart){ ctx.font = (p.s*2) + 'px serif'; ctx.fillText('♥', -p.s, p.s); }
      else ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s*0.6);
      ctx.restore();
    });
    if (++frames < 260) requestAnimationFrame(tick); else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}
function keepHearts(){   // a few extra hearts keep floating after signing
  const bg = $('bg');
  for (let i = 0; i < 8; i++){
    const s = document.createElement('span'); s.className = 'fh'; s.textContent = '💖';
    s.style.left = (Math.random()*96) + '%'; s.style.fontSize = (20 + Math.random()*20) + 'px';
    s.style.animationDuration = (8 + Math.random()*8) + 's'; s.style.animationDelay = (-Math.random()*8) + 's';
    bg.appendChild(s);
  }
}

/* ---------- start ---------- */
buildSpirals();
