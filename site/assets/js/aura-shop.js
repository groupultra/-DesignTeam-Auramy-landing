// "Farm aura": the whole loop in one place. People show up on your page (danmaku, hearts),
// every interaction lands on a live receipt as aura, the yellow smiley counts it up, and the
// aura mart unlocks new pieces for your page one by one. Buying one drops it onto your page.
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

const COMMENTS = ['ok this page is SO you', 'W playlist', 'sign my guestbook back!!', 'the 3D room??? need', 'beat ur score lol', 'who made this', 'visiting every day ngl', 'same 🤝', 'found u from the gc', 'this is my roman empire', 'the cursor trail >>>', 'omg the walkman', 'aura farming fr', '10/10 no notes', 'pls teach me', 'the glitter text 😭', 'rematch tonight', 'ur page > my whole feed'];
const NAMES = ['noor', 'dani', 'jules', 'hannah', 'zoe', 'luis', 'dre', 'kev', 'noah', 'june', 'ollie', 'nina', 'jaz', 'priya'];
const INK = ['#2f5ef6', '#d4148f', '#0d8a6a', '#7b3ff2', '#c2410c', '#161a2e'];

const PIXEL_PET = ['..11....11..', '.1221..1221.', '.1222112221.', '.1222222221.', '122122221221', '122222222221', '122224422221', '.1222222221.', '..12222221..', '..1.1..1.1..'];
const PET_COLORS = { 1: '#2a2440', 2: '#ffb84d', 4: '#ff7ac8' };

const ITEMS = [
  { id: 'counter', name: 'hit counter', price: 100, tag: 'classic' },
  { id: 'trail', name: 'cursor trail', price: 150 },
  { id: 'stickers', name: 'holo sticker pack', price: 300 },
  { id: 'glitter', name: 'glitter text', price: 450 },
  { id: 'ipod', name: 'iPod-style player', price: 800, tag: 'hot' },
  { id: 'walkman', name: 'cassette walkman', price: 1200 },
  { id: 'pet', name: 'pixel pet', price: 1600, tag: 'new' },
  { id: 'room', name: '3D room world', price: 2000, tag: 'rare' },
];

const pet = () => `<svg class="pet" viewBox="0 0 12 10" shape-rendering="crispEdges" aria-hidden="true">${PIXEL_PET.map((row, y) => [...row].map((c, x) => (PET_COLORS[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${PET_COLORS[c]}"/>` : '')).join('')).join('')}</svg>`;

const room = () => `<svg class="room" viewBox="0 0 100 78" aria-hidden="true">
  <polygon points="10,58 10,18 50,0 50,40" fill="#8fb2ff"/><polygon points="50,40 50,0 90,18 90,58" fill="#c3d4ff"/>
  <polygon points="50,40 90,58 50,76 10,58" fill="#f6ec22"/>
  <polygon points="18,30 18,20 30,14 30,24" fill="#e8f3ff"/><polygon points="62,20 62,8 74,13 74,26" fill="#ff7ac8"/>
  <polygon points="44,56 58,49 72,56 58,63" fill="#2f5ef6"/><polygon points="44,56 58,63 58,67 44,60" fill="#1d43d6"/><polygon points="58,63 72,56 72,60 58,67" fill="#2449dc"/>
  <polygon points="24,52 30,49 36,52 30,55" fill="#3fb168"/><polygon points="29,49 31,40 33,49" fill="#2b8a4b"/>
</svg>`;

/** The pieces are real mini components: same markup in the shop and on your page. */
const PIECES = {
  counter: () => `<div class="piece piece--counter"><span class="piece__lcd">${'0004210'.split('').map((d) => `<i>${d}</i>`).join('')}</span><small>visitors since 2026</small></div>`,
  trail: () => `<div class="piece piece--trail"><i class="piece__cursor"></i>${['star', 'sparkle', 'star', 'heart', 'star'].map((d, i) => doodle(d, `trail-${i}`)).join('')}</div>`,
  stickers: () => `<div class="piece piece--stickers"><span class="holo holo--a">${doodle('star')}</span><span class="holo holo--b">♥</span><span class="holo holo--c">☺</span></div>`,
  glitter: () => `<div class="piece piece--glitter"><b>hi!!</b></div>`,
  ipod: () => `<div class="piece piece--ipod"><div class="ipod"><div class="ipod__screen"><b>♪ drivers license</b><small>olivia rodrigo</small><i></i></div><div class="ipod__wheel"><span>MENU</span><i></i></div></div></div>`,
  walkman: () => `<div class="piece piece--walkman"><div class="tape"><span class="tape__label">mix for the drive ♥</span><span class="tape__window"><i class="reel"></i><i class="reel"></i></span></div></div>`,
  pet: () => `<div class="piece piece--pet">${pet()}<span class="piece__bubble">feed me</span></div>`,
  room: () => `<div class="piece piece--room">${room()}</div>`,
};

const fmt = (n) => Math.round(n).toLocaleString('en-US');
const pickWeighted = () => {
  const total = WEIGHTS.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [id, w] of WEIGHTS) { if ((r -= w) < 0) return id; }
  return 'like';
};

export function initAuraShop(root, { toast } = {}) {
  if (!root) return () => {};
  const $ = (s) => root.querySelector(s);
  const shopList = $('[data-mart]');
  const slots = [...root.querySelectorAll('[data-slot]')];
  const layer = $('[data-danmaku]');
  const pops = $('[data-pops]');
  const counter = $('[data-aura-count]');
  const balance = $('[data-mart-balance]');
  const bubble = $('[data-bubble]');
  const hereEl = $('[data-here]');
  const receipt = $('[data-receipt]');
  const orb = $('#orb');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  const tally = { ...START };
  const spentLines = [];
  const owned = [];
  const announced = new Set();
  let aura = Object.entries(tally).reduce((s, [k, n]) => s + n * EVENTS[k].value, 0);
  let shown = 0;
  let here = 3;
  let visible = false;
  let started = false;
  let timer = 0;
  let frame = 0;
  let bubbleTimer = 0;
  let lane = 0;

  const stillMode = () => reduce.matches || document.body.classList.contains('is-motion-paused');
  const motionOK = () => !stillMode() && !document.hidden;
  const earned = () => Object.entries(tally).reduce((s, [k, n]) => s + n * EVENTS[k].value, 0);

  shopList.innerHTML = ITEMS.map((item) => `<li class="mart__item" data-item="${item.id}" data-state="locked">
    ${item.tag ? `<span class="mart__tag mart__tag--${item.tag}">${item.tag}</span>` : ''}
    <div class="mart__preview">${PIECES[item.id]()}<span class="mart__lock" aria-hidden="true">🔒 <b data-need>${item.price}</b> to go</span><span class="mart__new" aria-hidden="true">NEW!</span></div>
    <p class="mart__name">${item.name}</p>
    <p class="mart__price">✦ ${fmt(item.price)}</p>
    <button type="button" class="xp-btn xp-btn--go mart__buy" data-buy-item="${item.id}">buy</button>
    <p class="mart__owned">✓ on your page</p>
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
      const isOwned = owned.includes(item.id);
      const state = isOwned ? 'owned' : aura >= item.price ? 'open' : 'locked';
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

  function add(type, times = 1) {
    tally[type] += times;
    aura += EVENTS[type].value * times;
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
    if (!motionOK() || layer.childElementCount > 10) return;
    const el = document.createElement('span');
    el.className = 'danmaku';
    el.textContent = text;
    el.style.top = `${4 + (lane++ % 6) * 15}%`;
    el.style.color = INK[Math.floor(Math.random() * INK.length)];
    layer.append(el);
    const width = layer.clientWidth;
    const anim = el.animate([{ transform: `translateX(${width}px)` }, { transform: `translateX(${-el.offsetWidth - 20}px)` }], { duration: 5200 + Math.random() * 2800, easing: 'linear' });
    anim.onfinish = () => el.remove();
  }

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
      if (type === 'note') danmaku(`${NAMES[Math.floor(Math.random() * NAMES.length)]}: ${COMMENTS[Math.floor(Math.random() * COMMENTS.length)]}`);
      if (type === 'score') popAt('🏆 +50 score beaten', 'aura-pop--score');
    }
    if (burst && Math.random() < .55) danmaku(COMMENTS[Math.floor(Math.random() * COMMENTS.length)]);
    if (!burst && here > 6 && Math.random() < .4) { here -= 1; hereEl.textContent = here; }
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
        if (started && !layer.querySelector('.is-static')) settleStatic();
      }
    }
  }

  function buy(id) {
    const item = ITEMS.find((it) => it.id === id);
    if (!item || owned.includes(id)) return;
    if (aura < item.price) { say(`need ${fmt(item.price - aura)} more for the ${item.name}`); return; }
    aura -= item.price;
    owned.push(id);
    spentLines.push([item.name, item.price]);
    const el = shopList.querySelector(`[data-item="${id}"]`);
    el.classList.remove('is-new');
    // The newest piece goes onto your page; the oldest leaves when all four slots are full.
    const slot = slots.find((s) => !s.dataset.piece) || slots[(owned.length - 1) % slots.length];
    slot.dataset.piece = id;
    slot.innerHTML = PIECES[id]();
    slot.classList.remove('is-dropped'); void slot.offsetWidth; slot.classList.add('is-dropped');
    syncShop();
    syncReceipt();
    kickCounter();
    say(`${item.name} is on your page now ✦`);
    toast?.(`✦ <b>${item.name}</b> is on your page now`);
  }

  root.addEventListener('click', (event) => {
    const b = event.target.closest('[data-buy-item]');
    if (b) { buy(b.dataset.buyItem); return; }
    const locked = event.target.closest('.mart__item[data-state="locked"]');
    if (locked) {
      const item = ITEMS.find((it) => it.id === locked.dataset.item);
      say(`need ${fmt(item.price - aura)} more for the ${item.name}`);
      locked.classList.remove('is-shake'); void locked.offsetWidth; locked.classList.add('is-shake');
      return;
    }
    if (event.target.closest('[data-aura-like]')) { add('like'); popAt('♥ +10', 'aura-pop--like', 70, 18); return; }
    if (event.target.closest('#orb')) {
      add('like');
      popAt('♥ +10', 'aura-pop--like', 30 + Math.random() * 40, 10 + Math.random() * 30, orb);
    }
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
