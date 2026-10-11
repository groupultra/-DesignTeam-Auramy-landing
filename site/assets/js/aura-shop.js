// "Farm aura": the whole loop in one place. People show up on your page (danmaku, hearts),
// every interaction lands on a live receipt as aura, the yellow smiley counts it up, and the
// aura mart unlocks pieces one by one. Buying one really switches it on in the mini page:
// the cursor trail follows your pointer, stickers can be dragged, the pet walks and eats.
// A browser-only demo: no accounts, no real currency.
import { doodle } from './doodles.js';

const EVENTS = {
  like: { icon: '♥', label: 'likes', value: 10 },
  visit: { icon: '👀', label: 'visits', value: 5 },
  note: { icon: '✎', label: 'guestbook notes', value: 20 },
  score: { icon: '🏆', label: 'scores beaten', value: 50 },
};
const WEIGHTS = [['like', 6], ['visit', 5], ['note', 2], ['score', 1]];
const START = { like: 3, visit: 6, note: 1, score: 0 };
const BURST_TARGET = 2680;
const STATIC_TALLY = { like: 124, visit: 210, note: 12, score: 3 };

const COMMENTS = ['ok this page is SO you', 'W playlist', 'sign my guestbook back!!', 'the pixel pet??? need', 'beat ur score lol', 'who made this', 'visiting every day ngl', 'same 🤝', 'found u from the gc', 'this is my roman empire', 'the cursor trail >>>', 'omg the stickers', 'aura farming fr', '10/10 no notes', 'pls teach me', 'the glitter text 😭', 'rematch tonight', 'ur page > my whole feed'];
const NAMES = ['noor', 'dani', 'jules', 'hannah', 'zoe', 'luis', 'dre', 'kev', 'noah', 'june', 'ollie', 'nina', 'jaz', 'priya'];
const INK = ['#2f5ef6', '#d4148f', '#0d8a6a', '#7b3ff2', '#c2410c', '#161a2e'];

const PIXEL_PET = ['..11....11..', '.1221..1221.', '.1222112221.', '.1222222221.', '122122221221', '122222222221', '122224422221', '.1222222221.', '..12222221..', '..1.1..1.1..'];
const PET_COLORS = { 1: '#2a2440', 2: '#ffb84d', 4: '#ff7ac8' };

const ITEMS = [
  { id: 'counter', name: 'hit counter', price: 100, tag: 'classic', does: 'counts every visit' },
  { id: 'trail', name: 'cursor trail', price: 150, does: 'sparkles follow your cursor' },
  { id: 'stickers', name: 'holo stickers', price: 300, does: 'drag them anywhere' },
  { id: 'glitter', name: 'glitter name', price: 450, does: 'your name, but sparkly' },
  { id: 'ipod', name: 'music player', price: 800, tag: 'hot', does: 'a mix that plays on your page' },
  { id: 'pet', name: 'pixel pet', price: 1600, tag: 'new', does: 'lives on your page. tap to feed' },
];
const TRAIL = ['✦', '★', '♥', '✧', '✦'];
const TRAIL_INK = ['#ff4fc3', '#2f5ef6', '#e8c400', '#0bb7d6', '#7b3ff2'];

const pet = () => `<svg class="pet" viewBox="0 0 12 10" shape-rendering="crispEdges" aria-hidden="true">${PIXEL_PET.map((row, y) => [...row].map((c, x) => (PET_COLORS[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${PET_COLORS[c]}"/>` : '')).join('')).join('')}</svg>`;

/** Product thumbnails in the mart: a small picture of what each piece does. */
const PIECES = {
  counter: () => `<div class="piece piece--counter"><span class="piece__lcd">${'0004210'.split('').map((d) => `<i>${d}</i>`).join('')}</span><small>visitors since 2026</small></div>`,
  trail: () => `<div class="piece piece--trail"><i class="piece__cursor"></i>${['star', 'sparkle', 'star', 'heart', 'star'].map((d, i) => doodle(d, `trail-${i}`)).join('')}</div>`,
  stickers: () => `<div class="piece piece--stickers"><span class="holo holo--a">${doodle('star')}</span><span class="holo holo--b">♥</span><span class="holo holo--c">☺</span></div>`,
  glitter: () => `<div class="piece piece--glitter"><b>hi!!</b></div>`,
  ipod: () => `<div class="piece piece--ipod"><div class="ipod"><div class="ipod__screen"><b>♪ drive home mix</b><small>12 songs</small><i></i></div><div class="ipod__wheel"><span>MENU</span><i></i></div></div></div>`,
  pet: () => `<div class="piece piece--pet">${pet()}<span class="piece__bubble">feed me</span></div>`,
};

const fmt = (n) => Math.round(n).toLocaleString('en-US');
const pickWeighted = () => {
  const total = WEIGHTS.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [id, w] of WEIGHTS) { if ((r -= w) < 0) return id; }
  return 'like';
};

const HINTS = {
  counter: 'every visit counts now',
  trail: 'move your cursor over it',
  stickers: 'drag them around',
  glitter: 'look at your name',
  ipod: 'it’s playing',
  pet: 'tap it to feed',
};
const STICKERS = [
  { html: () => doodle('star'), x: 80, y: 24, r: 14, cls: '' },
  { html: () => '♥', x: 2, y: 46, r: -12, cls: 'mini__sticker--heart' },
  { html: () => '☺', x: 82, y: 52, r: 9, cls: 'mini__sticker--smile' },
];

export function initAuraShop(root, { toast } = {}) {
  if (!root) return () => {};
  const $ = (s) => root.querySelector(s);
  const shopList = $('[data-mart]');
  const page = $('.aura-page');
  const mini = $('[data-mini]');
  const fx = $('[data-mini-fx]');
  const layer = $('[data-danmaku]');
  const pops = $('[data-pops]');
  const counter = $('[data-aura-count]');
  const balance = $('[data-mart-balance]');
  const bubble = $('[data-bubble]');
  const hereEl = $('[data-here]');
  const receipt = $('[data-receipt]');
  const orb = $('#orb');
  const noteWho = $('[data-note-who]');
  const noteText = $('[data-note-text]');
  const digits = $('[data-counter-digits]');
  const playBtn = $('[data-mini-play]');
  const stickerBox = $('[data-mini-stickers]');
  const petBtn = $('[data-mini-pet]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  const tally = { ...START };
  const spentLines = [];
  const owned = [];
  const announced = new Set();
  let aura = Object.entries(tally).reduce((s, [k, n]) => s + n * EVENTS[k].value, 0);
  let shown = 0;
  let here = 3;
  let visits = 4210;
  let visible = false;
  let started = false;
  let timer = 0;
  let frame = 0;
  let bubbleTimer = 0;
  let lane = 0;
  let lastSpark = 0;
  let ghost = null;

  const stillMode = () => reduce.matches || document.body.classList.contains('is-motion-paused');
  const motionOK = () => !stillMode() && !document.hidden;
  const earned = () => Object.entries(tally).reduce((s, [k, n]) => s + n * EVENTS[k].value, 0);
  const has = (id) => owned.includes(id);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  shopList.innerHTML = ITEMS.map((item) => `<li class="mart__item" data-item="${item.id}" data-state="locked">
    ${item.tag ? `<span class="mart__tag mart__tag--${item.tag}">${item.tag}</span>` : ''}
    <div class="mart__preview">${PIECES[item.id]()}<span class="mart__lock" aria-hidden="true">🔒 <b data-need>${item.price}</b> to go</span><span class="mart__new" aria-hidden="true">NEW!</span></div>
    <p class="mart__name">${item.name}</p>
    <p class="mart__does">${item.does}</p>
    <p class="mart__price">✦ ${fmt(item.price)}</p>
    <button type="button" class="xp-btn xp-btn--go mart__buy" data-buy-item="${item.id}">buy</button>
    <button type="button" class="mart__see" data-see>✓ on your page · see it ↑</button>
  </li>`).join('');

  function say(text, ms = 2600) {
    bubble.textContent = text;
    bubble.classList.remove('is-on'); void bubble.offsetWidth; bubble.classList.add('is-on');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('is-on'), ms);
  }

  function syncShop() {
    let fresh = null;
    ITEMS.forEach((item) => {
      const el = shopList.querySelector(`[data-item="${item.id}"]`);
      const state = has(item.id) ? 'owned' : aura >= item.price ? 'open' : 'locked';
      if (el.dataset.state !== state) el.dataset.state = state;
      el.querySelector('[data-need]').textContent = fmt(Math.max(0, item.price - aura));
      el.querySelector('.mart__buy').disabled = state !== 'open';
      el.querySelector('.mart__buy').setAttribute('aria-label', state === 'open' ? `Buy ${item.name} for ${item.price} aura` : `${item.name}: ${state === 'owned' ? 'already on your page' : `${fmt(item.price - aura)} more aura to unlock`}`);
      if (state === 'open' && !announced.has(item.id)) {
        announced.add(item.id);
        el.classList.add('is-new');
        fresh = item;
      }
    });
    if (fresh) say(`★ ${fresh.name} just unlocked`);
  }

  function syncReceipt() {
    const lines = Object.entries(EVENTS).map(([k, e]) => `<li><span>${e.icon} ${e.label}</span><i>×${fmt(tally[k])}</i><b>+${fmt(tally[k] * e.value)}</b></li>`).join('');
    const spent = spentLines.map(([name, price]) => `<li class="is-spent"><span>− ${name}</span><i></i><b>−${fmt(price)}</b></li>`).join('');
    receipt.innerHTML = `${lines}${spent}<li class="is-total"><span>balance</span><i></i><b>${fmt(aura)} ✦</b></li>`;
  }

  function drawCounter() {
    frame = 0;
    const diff = aura - shown;
    if (Math.abs(diff) < 1 || !motionOK()) shown = aura;
    else shown += diff * 0.14;
    counter.textContent = fmt(shown);
    balance.textContent = fmt(shown);
    if (shown !== aura) frame = requestAnimationFrame(drawCounter);
  }
  const kickCounter = () => { if (!frame) frame = requestAnimationFrame(drawCounter); };

  const drawVisits = () => { digits.innerHTML = String(visits).padStart(7, '0').split('').map((d) => `<i>${d}</i>`).join(''); };

  function add(type, times = 1) {
    tally[type] += times;
    aura += EVENTS[type].value * times;
    if (type === 'visit' && has('counter')) { visits += times; drawVisits(); }
    syncShop();
    syncReceipt();
    kickCounter();
  }

  function popAt(text, cls, x = 8 + Math.random() * 78, y = 30 + Math.random() * 52, host = pops) {
    if (!motionOK()) return;
    const el = document.createElement('span');
    el.className = `aura-pop ${cls}`;
    el.textContent = text;
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    host.append(el);
    setTimeout(() => el.remove(), 1200);
  }

  function danmaku(text) {
    if (!motionOK() || layer.childElementCount > 4) return;
    const el = document.createElement('span');
    el.className = 'danmaku';
    el.textContent = text;
    el.style.top = `${4 + (lane++ % 6) * 15}%`;
    el.style.color = pick(INK);
    layer.append(el);
    const width = layer.clientWidth;
    const anim = el.animate([{ transform: `translateX(${width}px)` }, { transform: `translateX(${-el.offsetWidth - 20}px)` }], { duration: 5200 + Math.random() * 2800, easing: 'linear' });
    anim.onfinish = () => el.remove();
  }

  /* ── what each piece does on the page ── */

  function sparkle(x, y, ink = pick(TRAIL_INK)) {
    if (!motionOK() || fx.childElementCount > 46) return;
    const el = document.createElement('i');
    el.className = 'mini__spark';
    el.textContent = pick(TRAIL);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = ink;
    el.style.setProperty('--dx', `${Math.round(Math.random() * 24 - 12)}px`);
    el.style.setProperty('--rot', `${Math.round(Math.random() * 160 - 80)}deg`);
    fx.append(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  // A visitor's cursor drifts across the page, trail and all, so the trail shows even on a phone.
  function ghostSweep(label) {
    if (ghost || !has('trail') || !motionOK()) return;
    const W = mini.clientWidth;
    const H = mini.clientHeight;
    ghost = document.createElement('span');
    ghost.className = 'mini__ghost';
    ghost.innerHTML = `<i></i><b>${label}</b>`;
    fx.append(ghost);
    const flip = Math.random() < 0.5;
    const start = performance.now();
    const dur = 2200;
    let n = 0;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const p = flip ? 1 - t : t;
      const x = W * (0.08 + 0.84 * p);
      const y = H * (0.42 + 0.2 * Math.sin(p * Math.PI * 2.2));
      ghost.style.transform = `translate(${x}px, ${y}px)`;
      if (n++ % 2 === 0) sparkle(x + 2, y + 2);
      if (t < 1 && motionOK()) requestAnimationFrame(step);
      else { ghost.remove(); ghost = null; }
    };
    requestAnimationFrame(step);
  }

  function slapStickers() {
    stickerBox.innerHTML = STICKERS.map((s, i) => `<span class="mini__sticker ${s.cls}" style="left:${s.x}%;top:${s.y}%;--r:${s.r}deg;--i:${i}">${s.html()}</span>`).join('');
    stickerBox.querySelectorAll('.mini__sticker').forEach((el) => {
      let id = null;
      let sx = 0;
      let sy = 0;
      let ox = 0;
      let oy = 0;
      el.addEventListener('pointerdown', (e) => {
        id = e.pointerId;
        el.setPointerCapture(id);
        el.classList.add('is-grab');
        sx = e.clientX; sy = e.clientY; ox = el.offsetLeft; oy = el.offsetTop;
      });
      el.addEventListener('pointermove', (e) => {
        if (e.pointerId !== id) return;
        const W = mini.clientWidth;
        const H = mini.clientHeight;
        el.style.left = `${Math.max(-10, Math.min(W - el.offsetWidth + 10, ox + e.clientX - sx))}px`;
        el.style.top = `${Math.max(-10, Math.min(H - el.offsetHeight + 10, oy + e.clientY - sy))}px`;
      });
      const up = (e) => { if (e.pointerId !== id) return; id = null; el.classList.remove('is-grab'); };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  }

  function feedPet() {
    petBtn.classList.remove('is-fed'); void petBtn.offsetWidth; petBtn.classList.add('is-fed');
    const bubbleEl = petBtn.querySelector('.mini__pet-say');
    bubbleEl.textContent = pick(['nom', 'more??', 'ty ♥', 'yum']);
    const box = petBtn.getBoundingClientRect();
    const r = mini.getBoundingClientRect();
    for (let i = 0; i < 4; i++) sparkle(box.left - r.left + box.width / 2 + (i - 1.5) * 8, box.top - r.top, '#ff4fc3');
  }

  function applyPiece(id, fresh) {
    mini.dataset[id] = 'on';
    if (id === 'counter') { $('[data-mini-counter]').hidden = false; drawVisits(); }
    if (id === 'stickers') { stickerBox.hidden = false; slapStickers(); }
    if (id === 'ipod') { $('[data-mini-player]').hidden = false; mini.dataset.playing = 'true'; }
    if (id === 'pet') { petBtn.hidden = false; petBtn.innerHTML = `<span class="mini__pet-body">${pet()}</span><span class="mini__pet-say">hi!!</span>`; }
    if (!fresh) return;
    page.classList.remove('is-upgraded'); void page.offsetWidth; page.classList.add('is-upgraded');
    if (id === 'trail') setTimeout(() => ghostSweep('try it ✦'), 450);
  }

  /* ── the busy evening ── */

  // 0 → 1 over the busy evening: a few people at first, then the link starts doing laps.
  const progress = () => Math.min(1, earned() / BURST_TARGET);

  function tick() {
    const burst = earned() < BURST_TARGET;
    const batch = burst ? 1 + Math.floor(progress() * 3 + Math.random() * 2) : 1;
    for (let i = 0; i < batch; i++) {
      const type = pickWeighted();
      add(type);
      if (i > 0) continue;
      if (type === 'like') popAt(`♥ +${EVENTS.like.value}`, 'aura-pop--like');
      if (type === 'visit') { here = Math.min(48, here + 1 + Math.floor(Math.random() * 3)); hereEl.textContent = here; popAt('👀 +5', 'aura-pop--visit'); }
      if (type === 'note') {
        const who = pick(NAMES);
        const text = pick(COMMENTS);
        noteWho.textContent = who;
        noteText.textContent = text;
        danmaku(`${who}: ${text}`);
      }
      if (type === 'score') popAt('🏆 +50 score beaten', 'aura-pop--score');
    }
    if (burst && Math.random() < .2) danmaku(pick(COMMENTS));
    if (!burst && here > 6 && Math.random() < .4) { here -= 1; hereEl.textContent = here; }
    if (has('trail') && Math.random() < (burst ? 0.04 : 0.22)) ghostSweep(pick(NAMES));
    orb.classList.remove('is-bump'); void orb.offsetWidth; orb.classList.add('is-bump');
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    if (!visible || !motionOK()) { timer = 0; return; }
    const burst = earned() < BURST_TARGET;
    timer = setTimeout(tick, burst ? 200 - progress() * 110 + Math.random() * 50 : 1300 + Math.random() * 900);
  }

  function settleStatic() {
    // Without motion, show where the evening ends up: a busy page, a full receipt, unlocked pieces.
    if (earned() < BURST_TARGET) {
      Object.assign(tally, STATIC_TALLY);
      aura = earned() - spentLines.reduce((s, [, p]) => s + p, 0);
      here = 37;
      hereEl.textContent = here;
    }
    layer.innerHTML = COMMENTS.slice(0, 4).map((c, i) => `<span class="danmaku is-static" style="top:${8 + i * 22}%;left:${[6, 30, 12, 38][i]}%;color:${INK[i]}">${NAMES[i]}: ${c}</span>`).join('');
    syncShop();
    syncReceipt();
    shown = aura;
    counter.textContent = fmt(aura);
    balance.textContent = fmt(aura);
  }

  function sync() {
    // A hidden tab just waits; only reduced or paused motion skips straight to the busy evening.
    if (visible && !started && !document.hidden) {
      started = true;
      if (stillMode()) settleStatic();
    }
    if (visible && motionOK()) {
      layer.querySelectorAll('.is-static').forEach((el) => el.remove());
      if (!timer) schedule();
    } else {
      clearTimeout(timer);
      timer = 0;
      if (stillMode()) {
        layer.querySelectorAll('.danmaku:not(.is-static)').forEach((el) => el.remove());
        pops.innerHTML = '';
        fx.innerHTML = '';
        ghost = null;
        if (started && !layer.querySelector('.is-static')) settleStatic();
      }
    }
  }

  function buy(id) {
    const item = ITEMS.find((it) => it.id === id);
    if (!item || has(id)) return;
    if (aura < item.price) { say(`need ${fmt(item.price - aura)} more for the ${item.name}`); return; }
    aura -= item.price;
    owned.push(id);
    spentLines.push([item.name, item.price]);
    shopList.querySelector(`[data-item="${id}"]`).classList.remove('is-new');
    applyPiece(id, true);
    syncShop();
    syncReceipt();
    kickCounter();
    say(`${item.name} is on your page ✦`);
    toast?.(`✦ <b>${item.name}</b> is on your page. ${HINTS[id]}.`);
  }

  function showPage() {
    page.scrollIntoView({ block: 'center', behavior: stillMode() ? 'auto' : 'smooth' });
    page.classList.remove('is-upgraded'); void page.offsetWidth; page.classList.add('is-upgraded');
  }

  root.addEventListener('click', (event) => {
    const b = event.target.closest('[data-buy-item]');
    if (b) { buy(b.dataset.buyItem); return; }
    if (event.target.closest('[data-see]')) { showPage(); return; }
    const locked = event.target.closest('.mart__item[data-state="locked"]');
    if (locked) {
      const item = ITEMS.find((it) => it.id === locked.dataset.item);
      say(`need ${fmt(item.price - aura)} more for the ${item.name}`);
      locked.classList.remove('is-shake'); void locked.offsetWidth; locked.classList.add('is-shake');
      return;
    }
    if (event.target.closest('[data-aura-like]')) { add('like'); popAt('♥ +10', 'aura-pop--like', 70, 18); return; }
    if (event.target.closest('[data-mini-play]')) {
      const on = mini.dataset.playing !== 'true';
      mini.dataset.playing = String(on);
      playBtn.setAttribute('aria-pressed', String(on));
      playBtn.textContent = on ? '❚❚' : '▶';
      playBtn.setAttribute('aria-label', on ? 'Pause the mix' : 'Play the mix');
      return;
    }
    if (event.target.closest('[data-mini-pet]')) { feedPet(); return; }
    if (event.target.closest('#orb')) {
      add('like');
      popAt('♥ +10', 'aura-pop--like', 30 + Math.random() * 40, 10 + Math.random() * 30, orb);
    }
  });

  // The cursor trail is real: it follows your pointer (or finger) across the page.
  mini.addEventListener('pointermove', (event) => {
    if (!has('trail')) return;
    const now = performance.now();
    if (now - lastSpark < 26) return;
    lastSpark = now;
    const r = mini.getBoundingClientRect();
    sparkle(event.clientX - r.left, event.clientY - r.top);
  });
  mini.addEventListener('pointerdown', (event) => {
    if (!has('trail') || event.target.closest('.mini__sticker')) return;
    const r = mini.getBoundingClientRect();
    for (let i = 0; i < 5; i++) sparkle(event.clientX - r.left + (i - 2) * 6, event.clientY - r.top + (i % 2) * 6);
  });

  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .2 });
  io.observe(root);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('auramy:motion-change', sync);
  reduce.addEventListener?.('change', sync);

  syncShop();
  syncReceipt();
  counter.textContent = '0';
  balance.textContent = '0';
  return () => { io.disconnect(); clearTimeout(timer); cancelAnimationFrame(frame); };
}
