// "Your page": the result of the setup wizard, built live in a phone as you click through.
// Stage 0 = just your name, 1 = what it's for fills in the content, 2 = the look skins it,
// 3 = live (friends show up, like it and sign the wall). Everything on it is tappable.
// Local demo only: nothing leaves the page. Sized in cqw like the persona sites.
import { doodle } from './doodles.js';

const FOR_TAG = {
  camila: 'for the group chat', maddie: 'close friends only', marcus: 'for the team', jayden: 'meme dump',
  river: 'oc + lore', theo: 'movies, mostly', aaliyah: 'shop is open',
};

const CLIPS = ['the canoe one', '3am drive-thru', 'her laugh', 'grad day', 'airport cry', 'pool was cold', 'karaoke (bad)', 'beach night'];
const CLIP_COLORS = ['#ffd84d', '#ff7aa8', '#62d2ff', '#b48cff', '#7ee08a', '#ffa04d'];
const MEMES = [
  ['me: one more game', '6 games later', '#ffe14d'],
  ['when i win: skill', 'when i lose: lag', '#8fd3ff'],
  ['group chat at 2am', 'it’s always 2am', '#ff9ec7'],
  ['homework due 8am', 'me at 7:58', '#b7f27a'],
];
const FOUR = [['comfort movie', '#5b2333'], ['cried at it', '#1f3a5f'], ['seen it 9×', '#3d5a3a'], ['no one gets it', '#5a4520']];
const ROSTER = [['14', 'dre'], ['82', 'luis'], ['3', 'tre']];
const JOINERS = [['7', 'kj'], ['22', 'mo'], ['5', 'eli']];

const LIVE = [
  { who: 'maddie', text: 'WAIT how', like: 1 },
  { who: 'jayden', text: 'beat ur score btw. 88.', wall: true },
  { who: 'camila', text: 'making u a birthday edit', like: 2 },
  { who: 'marcus', text: 'GOOD PAGE.', wall: true },
  { who: 'theo', text: '★★★★½', like: 3 },
];

const modules = {
  camila: () => `<h4>the reel</h4>
    <ul class="yp-cast" aria-label="In the group chat">${['pri', 'jules', 'noor', 'bea', 'dani'].map((n, i) => `<li style="--c:${CLIP_COLORS[i]}">${n}</li>`).join('')}</ul>
    <ol class="yp-reel" data-yp-reel>${CLIPS.slice(0, 3).map((cap, i) => `<li style="--c:${CLIP_COLORS[i]}">${cap}</li>`).join('')}</ol>
    <button type="button" class="yp-btn" data-yp-act="clip">drop a clip +</button>`,

  maddie: () => `<div class="yp-seg" role="group" aria-label="Who is looking"><button type="button" data-yp-act="cf" aria-pressed="true">★ close friends</button><button type="button" data-yp-act="anyone" aria-pressed="false">anyone</button></div>
    <ul class="yp-cf">
      <li>🎧 the drive home mix</li><li>📸 pics nobody else gets</li><li>💭 2am thoughts (12)</li>
    </ul>
    <p class="yp-cf__lock">🔒 close friends only. ask me for the link.</p>
    <div class="yp-player"><button type="button" data-yp-act="play" aria-pressed="false" aria-label="Play the mix">▶</button><span><b>drive home mix</b><small>aux is shared. i have veto.</small></span><i class="yp-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></i></div>`,

  marcus: (name) => `<div class="yp-score" aria-hidden="true"><span>HOME <b>21</b></span><span>AWAY <b>14</b></span><em>4TH QTR</em></div>
    <h4>the roster</h4>
    <ol class="yp-roster" data-yp-roster><li class="is-cap"><b>11</b><span data-yp-name>${name}</span><em>C</em></li>${ROSTER.map(([n, who]) => `<li><b>${n}</b><span>${who}</span></li>`).join('')}<li class="yp-roster__add"><button type="button" data-yp-act="join">+ join</button></li></ol>
    <button type="button" class="yp-btn" data-yp-act="lock">LOCK IN ▸ <span data-yp-lock>×0</span></button>`,

  jayden: () => `<h4>meme dump</h4>
    <ul class="yp-memes">${MEMES.map(([top, bottom, c], i) => `<li style="--c:${c}"><p><span>${top}</span><span>${bottom}</span></p><button type="button" data-yp-act="skull" aria-label="React with a skull">💀 <b>${[12, 31, 7, 19][i]}</b></button></li>`).join('')}</ul>`,

  river: () => `<div class="yp-oc">
      <div class="yp-oc__art" aria-hidden="true">${doodle('star')}${doodle('cloud')}${doodle('sparkle')}</div>
      <div><b>nova</b><small>star courier · chaotic good</small>
      <ul class="yp-oc__stats"><li>courage<i style="--v:78%"></i></li><li>snacks<i style="--v:96%"></i></li><li>sleep<i style="--v:14%"></i></li></ul></div>
    </div>
    <button type="button" class="yp-btn" data-yp-act="lore" aria-expanded="false">read the lore ☾</button>
    <p class="yp-oc__lore" data-yp-lore hidden>every map in her city lies a little. she draws the true ones.</p>`,

  theo: () => `<h4>the four.</h4>
    <ol class="yp-four">${FOUR.map(([label, c], i) => `<li style="--c:${c}"><button type="button" data-yp-act="rate" data-stars="0" aria-label="Rate ${label}"><i>0${i + 1}</i><b>${label}</b><span>☆☆☆☆☆</span></button></li>`).join('')}</ol>
    <p class="yp-four__hint">tap to rate</p>`,

  aaliyah: () => `<h4>the menu</h4>
    <ul class="yp-menu">${[['custom press-ons', '$25'], ['short gel-x', '$35'], ['flip of the week', '$18']].map(([s, p], i) => `<li><label><input type="radio" name="yp-svc" value="${s}"${i === 0 ? ' checked' : ''}><span>${s}</span><b>${p}</b></label></li>`).join('')}</ul>
    <button type="button" class="yp-btn" data-yp-act="book">request a set →</button>
    <p class="yp-menu__ok" data-yp-booked role="status" aria-live="polite"></p>`,
};

const skeleton = () => '<div class="yp__skel" aria-hidden="true"><i></i><i></i><i></i></div>';
const motionOff = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('is-motion-paused');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Mount the page into a phone screen. Returns { update(state), goLive(), offline(), reset() }. */
export function mountYourPage(host) {
  host.innerHTML = `<div class="yp" data-look="plain" data-stage="0">
    <div class="yp__scroll">
      <p class="yp__bar"><span>9:41</span><span class="yp__url">aura.my/<b data-yp-slug>you</b></span><span class="yp__dot" aria-hidden="true"></span></p>
      <header class="yp__head">
        <div class="yp__face">${doodle('smile')}</div>
        <h3 class="yp__name" data-yp-name>you</h3>
        <p class="yp__tag" data-yp-tag>your little corner</p>
        <div class="yp__stats"><button type="button" class="yp__like" data-yp-act="like" aria-label="Like this page">♥ <b data-yp-likes>0</b></button><span class="yp__aura">✦ <b data-yp-aura>0</b> aura</span></div>
      </header>
      <section class="yp__mod" data-yp-mod>${skeleton()}</section>
      <section class="yp__wall">
        <h4>sign my wall</h4>
        <ul data-yp-wall aria-live="polite"><li class="is-empty">nobody yet. send the link.</li></ul>
        <form data-yp-sign><input maxlength="40" placeholder="say hi" autocomplete="off" aria-label="Sign the wall"><button type="submit">sign</button></form>
      </section>
      <p class="yp__made">made with auramy ☺</p>
    </div>
    <div class="yp__pops" data-yp-pops aria-hidden="true"></div>
    <p class="yp__live" aria-hidden="true">● LIVE</p>
  </div>`;

  const root = host.querySelector('.yp');
  const $ = (s) => root.querySelector(s);
  const mod = $('[data-yp-mod]');
  const wall = $('[data-yp-wall]');
  const pops = $('[data-yp-pops]');
  let state = { name: 'you', slug: 'you', forId: 'camila', look: 'camila', stage: 0 };
  let renderedFor = null;
  let likes = 0;
  let aura = 0;
  let timers = [];
  let clipCount = 3;
  let joined = 0;
  let locks = 0;

  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  function bump(el) {
    el.classList.remove('is-bump');
    void el.offsetWidth;
    el.classList.add('is-bump');
  }
  function addAura(n) {
    aura += n;
    const el = $('[data-yp-aura]');
    el.textContent = aura.toLocaleString('en-US');
    bump(el.parentElement);
  }
  function addLike(from) {
    likes += 1;
    $('[data-yp-likes]').textContent = likes;
    bump($('.yp__like'));
    addAura(10);
    if (motionOff()) return;
    const heart = document.createElement('i');
    heart.className = 'yp__heart';
    heart.textContent = from ? '+10' : '♥';
    heart.style.setProperty('--x', `${Math.round(Math.random() * 30 - 15)}cqw`);
    $('.yp__stats').append(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }
  function sign(who, text) {
    wall.querySelector('.is-empty')?.remove();
    const li = document.createElement('li');
    li.innerHTML = `<b>${esc(who)}</b> ${esc(text)}`;
    wall.prepend(li);
    while (wall.children.length > 4) wall.lastElementChild.remove();
    addAura(20);
  }
  function pop(who, text) {
    const el = document.createElement('p');
    el.className = 'yp__pop';
    el.innerHTML = `<img src="/assets/img/av/${who}.jpg" alt="" width="24" height="24"><span><b>${who}</b>${esc(text)}</span>`;
    pops.append(el);
    while (pops.children.length > 3) pops.firstElementChild.remove();
    later(() => el.classList.add('is-out'), 2600);
    later(() => el.remove(), 3100);
  }

  function renderModule() {
    if (state.stage < 1) {
      if (renderedFor !== null) { mod.innerHTML = skeleton(); renderedFor = null; }
      return;
    }
    if (renderedFor === state.forId) return;
    renderedFor = state.forId;
    clipCount = 3; joined = 0; locks = 0;
    delete mod.dataset.view;
    mod.innerHTML = modules[state.forId](esc(state.name));
    if (!motionOff()) { mod.classList.remove('is-in'); void mod.offsetWidth; mod.classList.add('is-in'); }
  }

  function update(next) {
    const prevLook = root.dataset.look;
    state = { ...state, ...next };
    root.dataset.stage = String(state.stage);
    root.dataset.for = state.forId;
    root.dataset.look = state.stage >= 2 ? state.look : 'plain';
    root.querySelectorAll('[data-yp-name]').forEach((el) => { el.textContent = state.name; });
    $('[data-yp-slug]').textContent = state.slug;
    $('[data-yp-tag]').textContent = state.stage >= 1 ? FOR_TAG[state.forId] : 'your little corner';
    renderModule();
    if (prevLook !== root.dataset.look && !motionOff()) { root.classList.remove('is-reskin'); void root.offsetWidth; root.classList.add('is-reskin'); }
  }

  function goLive() {
    clearTimers();
    root.classList.add('is-live');
    $('.yp__scroll').scrollTo({ top: 0 });
    const gap = motionOff() ? 0 : 1100;
    LIVE.forEach((event, i) => later(() => {
      pop(event.who, event.text);
      if (event.like) for (let k = 0; k < event.like; k += 1) later(() => addLike(true), k * 160);
      if (event.wall) sign(event.who, event.text);
    }, 500 + i * gap));
  }

  function offline() {
    clearTimers();
    root.classList.remove('is-live');
    pops.innerHTML = '';
  }

  function reset() {
    offline();
    likes = 0; aura = 0;
    $('[data-yp-likes]').textContent = '0';
    $('[data-yp-aura]').textContent = '0';
    wall.innerHTML = '<li class="is-empty">nobody yet. send the link.</li>';
    renderedFor = null;
  }

  root.addEventListener('click', (event) => {
    const act = event.target.closest('[data-yp-act]');
    if (!act) return;
    const kind = act.dataset.ypAct;
    if (kind === 'like') { addLike(false); return; }
    if (kind === 'clip') {
      const reel = $('[data-yp-reel]');
      const li = document.createElement('li');
      li.style.setProperty('--c', CLIP_COLORS[clipCount % CLIP_COLORS.length]);
      li.textContent = CLIPS[clipCount % CLIPS.length];
      li.className = 'is-new';
      reel.append(li);
      reel.scrollTo({ left: reel.scrollWidth, behavior: motionOff() ? 'auto' : 'smooth' });
      clipCount += 1;
      return;
    }
    if (kind === 'cf' || kind === 'anyone') {
      mod.dataset.view = kind;
      mod.querySelectorAll('.yp-seg button').forEach((b) => b.setAttribute('aria-pressed', String(b === act)));
      return;
    }
    if (kind === 'play') {
      const on = act.getAttribute('aria-pressed') !== 'true';
      act.setAttribute('aria-pressed', String(on));
      act.textContent = on ? '❚❚' : '▶';
      act.setAttribute('aria-label', on ? 'Pause the mix' : 'Play the mix');
      return;
    }
    if (kind === 'join') {
      const [n, who] = JOINERS[joined % JOINERS.length];
      const li = document.createElement('li');
      li.className = 'is-new';
      li.innerHTML = `<b>${n}</b><span>${who}</span>`;
      act.parentElement.before(li);
      joined += 1;
      if (joined >= JOINERS.length) act.parentElement.remove();
      return;
    }
    if (kind === 'lock') { locks += 1; $('[data-yp-lock]').textContent = `×${locks}`; bump(act); return; }
    if (kind === 'skull') { const b = act.querySelector('b'); b.textContent = Number(b.textContent) + 1; bump(act); return; }
    if (kind === 'lore') {
      const lore = $('[data-yp-lore]');
      lore.hidden = !lore.hidden;
      act.setAttribute('aria-expanded', String(!lore.hidden));
      return;
    }
    if (kind === 'rate') {
      const stars = (Number(act.dataset.stars) % 5) + 1;
      act.dataset.stars = String(stars);
      act.querySelector('span').textContent = '★'.repeat(stars) + '☆'.repeat(5 - stars);
      return;
    }
    if (kind === 'book') {
      const pick = mod.querySelector('input[name="yp-svc"]:checked')?.value || 'a set';
      $('[data-yp-booked]').textContent = `requested: ${pick} · sat 2pm ✓`;
    }
  });

  $('[data-yp-sign]').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector('input');
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    sign('guest', text);
    input.value = '';
  });

  update({});
  return { update, goLive, offline, reset };
}
