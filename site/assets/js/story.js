// Auramy · phone storyboard. One sticky phone, eight scenes, driven by ordinary page scrolling
// (no wheel or touch interception). The story follows Cami: her post gets lost in a feed, she
// makes a page, puts the link in her bio, Noor drops by, Cami hears about it, then everyone
// else's pages, then yours. Local demo only: nothing leaves the page.
import { PERSONAS, personaAvatar } from './personas.js';
import { homeMarkup, mountHome } from './persona-sites.js?v=early-web-1';
import { injectSprite } from './sprite.js';
import { injectDoodles, doodle } from './doodles.js';

document.documentElement.classList.add('js');
injectSprite();
injectDoodles();

const P = PERSONAS;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const seg = (t, a, b) => clamp01((t - a) / (b - a));
const ease = (t) => t * t * (3 - 2 * t);
const ph = (name, fill = false) => `<i class="${fill ? 'ph-fill' : 'ph'} ph-${name}" aria-hidden="true"></i>`;
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('is-motion-paused');
const AV = { cami: personaAvatar('camila'), noor: '/assets/img/av/ava.jpg', jules: '/assets/img/av/lu.jpg', priya: '/assets/img/av/zara.jpg' };

/* ───────── shared phone chrome ───────── */
const status = (tone = 'dark') => `<div class="sb sb--${tone}" aria-hidden="true"><b>9:41</b><span>${ph('cell-signal-full', true)}${ph('wifi-high', true)}${ph('battery-full', true)}</span></div>`;
const chrome = (handle, attr = '') => `<div class="bz" ${attr}><span class="bz__aa" aria-hidden="true">aA</span><p class="bz__url">${ph('lock-simple', true)}<span>aura.my/<b>${handle}</b></span></p><span class="bz__re" aria-hidden="true">${ph('arrow-clockwise')}</span><i class="bz__load" aria-hidden="true"></i></div>`;
const tools = () => `<div class="bt" aria-hidden="true">${ph('caret-left')}${ph('caret-right')}${ph('export')}${ph('book-open')}${ph('copy')}</div>`;

/* ───────── Cami's page (used by the feed, builder, visit and digest scenes) ───────── */
const camiPage = () => `<div class="cp" data-look="edit">
  <p class="cp__top"><span>cami's cut · edit #37</span><span>boston ☾</span></p>
  <header class="cp__head"><img class="cp__av" src="${AV.cami}" alt="" width="64" height="64"><div><h3>cami</h3><p>18 · sd → boston. i make everyone's birthday edits.</p></div></header>
  <figure class="cp__reel cp__blk" data-blk="reel"><img src="${P.camila.photos.grad}" alt="Cami and her friends in graduation gowns" loading="lazy" decoding="async"><figcaption>grad day</figcaption><i class="cp__strip" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></i></figure>
  <section class="cp__song cp__blk" data-blk="song"><i class="cp__cover" aria-hidden="true"></i><span><small>on repeat</small><b>Ribs</b><small>Lorde</small></span><span class="cp__same" data-same>same 🤝</span></section>
  <section class="cp__people cp__blk" data-blk="people"><b>my people</b><span><img src="${AV.priya}" alt=""><img src="${AV.jules}" alt=""><img src="${AV.noor}" alt=""><i>+3</i></span></section>
  <section class="cp__wall cp__blk" data-blk="wall"><b>sign the wall</b>
    <p class="cp__note" style="--r:-2deg;--c:#ffe45c">ok this page is SO you<small>jules</small></p>
    <p class="cp__note cp__note--noor" style="--r:2.5deg;--c:#ffb3d1" data-noor-note>the canoe clip. you know the one.<small>noor</small></p>
    <p class="cp__input" data-noor-input><span data-noor-typing></span><i class="cp__caret"></i><b>sign</b></p>
  </section>
  <section class="cp__game cp__blk" data-blk="game"><b>beat my edit time</b><span>⏱ 0:42 · tap to try</span></section>
  <p class="cp__foot">made with auramy ☺</p>
</div>`;

/* ───────── scenes ───────── */
const HERO_LOOKS = ['camila', 'maddie', 'marcus', 'river', 'theo', 'jayden'];
const WORLDS = ['maddie', 'marcus', 'river', 'theo', 'jayden'];
const handleOf = (id) => P[id].url.replace('aura.my/', '');
const NOTES = [
  ['Noor stopped by your page', 'now'],
  ['Noor has Ribs on repeat too 🤝', 'now'],
  ['Noor left a note: “the canoe clip. you know the one.”', 'now'],
];
const NOOR_NOTE = 'the canoe clip. you know the one.';

const scenesMarkup = () => `
  <div class="scn scn--hero" data-scn="hero">
    ${status()}${chrome(`<span data-hero-handle>${handleOf(HERO_LOOKS[0])}</span>`, 'data-hero-bar')}
    <div class="scn__view" data-hero-view></div>
    <div class="hero-look"><span>look: <b data-hero-look>${P.camila.template}</b></span><button type="button" data-hero-dice aria-label="Shuffle the look"><span aria-hidden="true">🎲</span></button></div>
    ${tools()}
  </div>

  <div class="scn scn--feed" data-scn="feed">
    ${status()}
    <div class="fd" data-feed>
      <div class="fd__top"><b>feed</b><span>${ph('heart')}${ph('paper-plane-tilt')}</span></div>
      <div class="fd__scroll">
        <ul class="fd__stories" aria-hidden="true"><li><i style="background-image:url(${AV.cami})"></i></li><li><i style="background-image:url(${AV.noor})"></i></li><li><i style="background-image:url(${AV.jules})"></i></li><li><i style="--c:#ffb36b"></i></li><li><i style="--c:#9ec3ff"></i></li></ul>
        <article class="fp"><header><img class="fp__av" src="${AV.cami}" alt=""><b>camicuts</b><small>3h</small></header><div class="fp__img"><img src="${P.camila.photos.bigsur}" alt="" loading="lazy" decoding="async"></div><p class="fp__acts">${ph('heart')}${ph('chat-circle')}${ph('paper-plane-tilt')}</p><p class="fp__meta"><b>14 likes</b></p><p class="fp__cap"><b>camicuts</b> big sur w the girls ☀︎</p></article>
        <article class="fp"><header><i class="fp__av" style="--c:#ffb3d1"></i><b>glowbae</b><small>Sponsored</small></header><div class="fp__img fp__img--ad"><span>48% OFF<br>everything ✦</span></div><p class="fp__cta">Shop now ${ph('caret-right')}</p></article>
        <article class="fp"><header><i class="fp__av" style="--c:#9ec3ff"></i><b>suggested reel</b><small>for you</small></header><div class="fp__img fp__img--reel"><span>${ph('play', true)} 2.1M</span></div></article>
        <article class="fp"><header><i class="fp__av" style="--c:#c8f59a"></i><b>snackbox</b><small>Sponsored</small></header><div class="fp__img fp__img--ad2"><span>you deserve<br>a treat</span></div></article>
      </div>
    </div>
    <div class="fd-page" data-feed-page>
      ${chrome('<span data-feed-handle></span>', 'data-feed-bar')}
      <div class="scn__view"><div class="cp-scroll" data-feed-scroll>${camiPage()}</div></div>
      ${tools()}
    </div>
  </div>

  <div class="scn scn--build" data-scn="build">
    ${status()}${chrome('cami <em>· editing</em>')}
    <div class="bd__preview" aria-hidden="true"><div class="bd__frame"><div class="bd__inner" data-build-inner>${camiPage()}</div></div></div>
    <div class="bd__drawer">
      <p class="bd__tabs"><span data-build-tab="looks">Looks</span><span data-build-tab="blocks">Blocks</span></p>
      <ul class="bd__looks" data-build-pane="looks">
        <li data-look-pick="notebook" style="--a:#fbfaf4;--b:#2541d8"><i></i>notebook</li>
        <li data-look-pick="night" style="--a:#2b2366;--b:#c9b8ff"><i></i>night sky</li>
        <li data-look-pick="y2k" style="--a:#ffd1ec;--b:#8a5cff"><i></i>y2k</li>
        <li data-look-pick="edit" style="--a:#f39a5c;--b:#2f1a10"><i></i>the edit</li>
        <li style="--a:#2a2c2e;--b:#7fe0c4"><i></i>rainy drive</li>
        <li style="--a:#173d2a;--b:#f2c230"><i></i>game night</li>
      </ul>
      <ul class="bd__blocks" data-build-pane="blocks">
        <li data-blk-pick="reel">${ph('film-strip')}clip reel</li>
        <li data-blk-pick="song">${ph('music-notes')}on repeat</li>
        <li data-blk-pick="people">${ph('users-three')}my people</li>
        <li data-blk-pick="wall">${ph('note-pencil')}guestbook</li>
        <li data-blk-pick="game">${ph('timer')}mini game</li>
        <li>${ph('calendar-blank')}countdown</li>
        <li>${ph('chart-bar')}poll</li>
        <li>${ph('image-square')}photo dump</li>
      </ul>
    </div>
  </div>

  <div class="scn scn--bio" data-scn="bio">
    ${status()}
    <div class="tk">
      <div class="tk__top">${ph('user-plus')}<b>Cami ${ph('caret-down', true)}</b>${ph('list')}</div>
      <img class="tk__av" src="${AV.cami}" alt="" width="96" height="96">
      <p class="tk__handle">@camicuts</p>
      <ul class="tk__stats"><li><b>88</b>Following</li><li><b>1,204</b>Followers</li><li><b>9,812</b>Likes</li></ul>
      <p class="tk__btns"><span>Edit profile</span><span>Share profile</span></p>
      <p class="tk__bio">birthday edits on request 🎂 sd → boston</p>
      <p class="tk__link" data-bio-link>${ph('link-simple')}<span>aura.my/<b data-bio-typed></b></span>${doodle('circle', 'tk__circle')}</p>
      <p class="tk__tabs" aria-hidden="true">${ph('squares-four', true)}${ph('lock-simple')}${ph('heart')}</p>
      <ul class="tk__grid">${['car', 'grad', 'pool', 'beach', 'camp', 'work'].map((k) => `<li><img src="${P.camila.photos[k]}" alt="" loading="lazy" decoding="async"></li>`).join('')}</ul>
    </div>
  </div>

  <div class="scn scn--visit" data-scn="visit">
    ${status()}${chrome('cami')}
    <p class="vt__who"><img src="${AV.noor}" alt="">noor is looking around</p>
    <div class="scn__view"><div class="cp-scroll" data-visit-scroll>${camiPage()}</div></div>
    <i class="tap" data-tap aria-hidden="true"></i>
    ${tools()}
  </div>

  <div class="scn scn--ping" data-scn="ping">
    <div class="lk" data-lock>
      ${status('light')}
      <p class="lk__date">Friday, October 9</p>
      <p class="lk__time">9:41</p>
      <div class="lk__stack">${NOTES.map(([text, when], i) => `<div class="nt" data-note="${i}"><span class="nt__ico"><img src="/assets/img/brand/auramy-monitor.jpg?v=materials-8" alt=""></span><b>Auramy</b><small>${when}</small><p>${text}</p></div>`).join('')}</div>
      <p class="lk__hint">swipe up</p>
    </div>
    <div class="dg" data-digest>
      ${status()}${chrome('cami/today')}
      <div class="dg__body">
        <h3>today on your page</h3>
        <ul class="dg__stats"><li><b>3</b>visits</li><li><b>1</b>note</li><li><b>2</b>same</li><li><b>✦40</b>aura</li></ul>
        <ol class="dg__list">
          <li><img src="${AV.noor}" alt=""><p><b>noor</b> left a note<small>“the canoe clip. you know the one.”</small></p><time>4m</time></li>
          <li><img src="${AV.noor}" alt=""><p><b>noor</b> has Ribs on repeat too 🤝</p><time>5m</time></li>
          <li><img src="${AV.jules}" alt=""><p><b>jules</b> stopped by</p><time>1h</time></li>
          <li><img src="${AV.priya}" alt=""><p><b>priya</b> added a clip to your edit 🎬</p><time>2h</time></li>
        </ol>
        <p class="dg__foot">no follower count. no like totals.<br>just who came by.</p>
      </div>
    </div>
  </div>

  <div class="scn scn--worlds" data-scn="worlds">
    ${status()}${chrome(`<span data-w-handle>${handleOf(WORLDS[0])}</span>`)}
    <div class="scn__view wv"><div class="wv__track" data-w-track>${WORLDS.map((id) => `<div class="wv__pg" data-w-page="${id}">${homeMarkup(id)}</div>`).join('')}</div></div>
    <p class="wv__dots" aria-hidden="true">${WORLDS.map(() => '<i></i>').join('')}</p>
    ${tools()}
  </div>

  <div class="scn scn--claim" data-scn="claim">
    ${status()}${chrome('<span data-claim-handle>yourname</span><i class="bz__caret"></i>')}
    <div class="scn__view cl">
      <span class="cl__av" aria-hidden="true">+</span>
      <p class="cl__name">your page goes here</p>
      <ul class="cl__blocks" aria-hidden="true"><li>+ your clips</li><li>+ your song</li><li>+ your people</li><li>+ a guestbook</li></ul>
      <form class="cl__form" data-claim>
        <label><span>aura.my/</span><input name="handle" autocomplete="off" spellcheck="false" maxlength="20" placeholder="yourname" aria-label="Your name"></label>
        <button type="submit">claim it →</button>
      </form>
      <p class="cl__fine">free · 4 taps · no app</p>
    </div>
    ${tools()}
  </div>`;

/* ───────── scene behaviour ───────── */
const story = $('[data-story]');
const screen = $('[data-story-screen]');
screen.innerHTML = scenesMarkup();
const stage = $('[data-story-stage]');
const scenes = $$('[data-scn]', screen);
const captions = $$('[data-cap]', story);
const rail = $$('[data-rail] button', story);
const WEIGHTS = { hero: 1, feed: 1.7, build: 1.7, bio: 1.1, visit: 1.9, ping: 1.6, worlds: 1.7, claim: 1 };
const ORDER = scenes.map((el) => el.dataset.scn);
const total = ORDER.reduce((sum, id) => sum + WEIGHTS[id], 0);
story.style.setProperty('--units', String(total));

function retrigger(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

// Where a child sits inside the screen, in screen pixels (for the tap ring).
function within(el) {
  const s = screen.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
}

/* 1 · hero: looks flip by themselves until you pick one */
const hero = (() => {
  const view = $('[data-hero-view]');
  const handle = $('[data-hero-handle]');
  const look = $('[data-hero-look]');
  const bar = $('[data-hero-bar]');
  let i = -1, stop = () => {}, timer = 0, live = false, touched = false;
  function show(n) {
    i = (n + HERO_LOOKS.length) % HERO_LOOKS.length;
    const id = HERO_LOOKS[i];
    stop();
    view.querySelectorAll('.pg').forEach((old) => { old.classList.add('is-out'); setTimeout(() => old.remove(), still() ? 0 : 420); });
    const pg = document.createElement('div');
    pg.className = 'pg';
    pg.innerHTML = homeMarkup(id);
    view.append(pg);
    stop = live ? mountHome(id, pg) : () => {};
    handle.textContent = handleOf(id);
    look.textContent = P[id].template;
    retrigger(bar, 'is-loading');
  }
  function sync(on) {
    live = on;
    clearInterval(timer);
    if (on) {
      const pg = view.querySelector('.pg:not(.is-out)');
      if (pg) { pg.innerHTML = homeMarkup(HERO_LOOKS[i]); stop = mountHome(HERO_LOOKS[i], pg); }
      if (!touched && !still()) timer = setInterval(() => { if (!document.hidden) show(i + 1); }, 2800);
    } else { stop(); stop = () => {}; }
  }
  $('[data-hero-dice]').addEventListener('click', (event) => {
    touched = true;
    clearInterval(timer);
    let n = i;
    while (n === i) n = Math.floor(Math.random() * HERO_LOOKS.length);
    retrigger(event.currentTarget, 'is-rolling');
    show(n);
  });
  view.addEventListener('pointerdown', () => { touched = true; clearInterval(timer); });
  show(0);
  return { enter: () => sync(true), leave: () => sync(false), progress() {} };
})();

/* 2 · feed: your post scrolls away between ads, then her page opens */
const feed = (() => {
  const root = $('[data-scn="feed"]');
  const handle = $('[data-feed-handle]');
  const scroll = $('[data-feed-scroll]');
  const text = 'cami';
  return {
    progress(t) {
      root.style.setProperty('--fd', ease(seg(t, 0.04, 0.5)).toFixed(4));
      const open = seg(t, 0.5, 0.6);
      root.style.setProperty('--open', ease(open).toFixed(4));
      root.classList.toggle('is-open', open > 0);
      handle.textContent = text.slice(0, Math.round(seg(t, 0.52, 0.62) * text.length));
      scroll.style.transform = `translateY(${-ease(seg(t, 0.68, 0.98)) * 70}cqw)`;
      setCaptionPart('feed', t >= 0.5 ? 'b' : 'a');
    },
  };
})();

/* 3 · build: pick a look, then add blocks one by one */
const build = (() => {
  const root = $('[data-scn="build"]');
  const page = $('.cp', root);
  const inner = $('[data-build-inner]');
  const looks = ['notebook', 'night', 'y2k', 'edit'];
  const blocks = ['reel', 'song', 'people', 'wall', 'game'];
  return {
    progress(t) {
      const lookIndex = Math.min(looks.length - 1, Math.floor(seg(t, 0.04, 0.4) * looks.length));
      const look = looks[lookIndex];
      page.dataset.look = look;
      root.querySelectorAll('[data-look-pick]').forEach((el) => el.classList.toggle('is-on', el.dataset.lookPick === look));
      const tab = t < 0.44 ? 'looks' : 'blocks';
      root.dataset.tab = tab;
      root.querySelectorAll('[data-build-tab]').forEach((el) => el.classList.toggle('is-on', el.dataset.buildTab === tab));
      const added = t < 0.48 ? 0 : Math.min(blocks.length, 1 + Math.floor(seg(t, 0.48, 0.92) * blocks.length));
      blocks.forEach((id, k) => {
        $(`[data-blk="${id}"]`, page).classList.toggle('is-on', k < added);
        $(`[data-blk-pick="${id}"]`, root).classList.toggle('is-on', k < added);
      });
      // Keep the newest block in the little preview.
      const last = added ? $(`[data-blk="${blocks[added - 1]}"]`, page) : null;
      const frameH = inner.parentElement.clientHeight / 0.56;
      const want = last ? last.offsetTop + last.offsetHeight + 12 - frameH : 0;
      inner.style.setProperty('--pv', `${-Math.max(0, want)}px`);
    },
  };
})();

/* 4 · bio: the link types itself into the TikTok bio */
const bio = (() => {
  const root = $('[data-scn="bio"]');
  const typed = $('[data-bio-typed]');
  return {
    progress(t) {
      const text = 'cami';
      const shown = seg(t, 0.12, 0.42);
      root.classList.toggle('has-link', shown > 0);
      typed.textContent = text.slice(0, Math.round(shown * text.length));
      root.classList.toggle('is-circled', t > 0.5);
    },
  };
})();

/* 5 · visit: Noor scrolls slowly, taps "same", signs the wall */
const visit = (() => {
  const root = $('[data-scn="visit"]');
  const scroll = $('[data-visit-scroll]');
  const same = $('[data-same]', root);
  const note = $('[data-noor-note]', root);
  const typing = $('[data-noor-typing]', root);
  const input = $('[data-noor-input]', root);
  const tap = $('[data-tap]', root);
  let tapped = false;
  let tapFor = '';
  function ring(el, key) {
    if (tapFor === key) return;
    tapFor = key;
    const { x, y } = within(el);
    tap.style.left = `${x}px`;
    tap.style.top = `${y}px`;
    retrigger(tap, 'is-on');
  }
  return {
    progress(t) {
      const song = $('[data-blk="song"]', scroll);
      const wall = $('[data-blk="wall"]', scroll);
      const view = scroll.parentElement.clientHeight;
      const toSong = Math.max(0, song.offsetTop + song.offsetHeight / 2 - view * 0.5);
      const toWall = Math.max(0, wall.offsetTop + wall.offsetHeight - view * 0.92);
      const y = toSong * ease(seg(t, 0.04, 0.3)) + (toWall - toSong) * ease(seg(t, 0.44, 0.62));
      scroll.style.transform = `translateY(${-y}px)`;
      const sameOn = t >= 0.36;
      same.classList.toggle('is-on', sameOn);
      same.textContent = sameOn ? 'same 🤝 noor' : 'same 🤝';
      if (sameOn && !tapped) { tapped = true; ring(same, 'same'); }
      if (!sameOn) { tapped = false; if (tapFor === 'same') tapFor = ''; }
      const typed = seg(t, 0.64, 0.86);
      typing.textContent = NOOR_NOTE.slice(0, Math.round(typed * NOOR_NOTE.length));
      input.classList.toggle('is-typing', typed > 0 && typed < 1);
      const signed = t >= 0.9;
      note.classList.toggle('is-on', signed);
      input.classList.toggle('is-done', signed);
      if (signed) ring($('b', input), 'sign'); else if (tapFor === 'sign') tapFor = '';
    },
  };
})();

/* 6 · ping: three calm notifications, then today's digest */
const ping = (() => {
  const root = $('[data-scn="ping"]');
  const notes = $$('[data-note]', root);
  return {
    progress(t) {
      notes.forEach((el, k) => el.classList.toggle('is-on', t >= 0.08 + k * 0.14));
      root.style.setProperty('--up', ease(seg(t, 0.56, 0.7)).toFixed(4));
      root.classList.toggle('is-digest', t >= 0.6);
    },
  };
})();

/* 7 · worlds: swipe through friends' pages, each a different look */
const worlds = (() => {
  const root = $('[data-scn="worlds"]');
  const track = $('[data-w-track]');
  const handle = $('[data-w-handle]');
  const dots = $$('.wv__dots i', root);
  const sides = $$('[data-side]', stage);
  let current = -1;
  return {
    progress(t) {
      const pos = ease(seg(t, 0.06, 0.94)) * (WORLDS.length - 1);
      track.style.transform = `translateX(${-pos * 100}%)`;
      const idx = Math.round(pos);
      if (idx !== current) {
        current = idx;
        handle.textContent = handleOf(WORLDS[idx]);
        dots.forEach((d, k) => d.classList.toggle('is-on', k === idx));
        sides.forEach((s) => s.classList.toggle('is-on', s.dataset.side === WORLDS[idx]));
      }
    },
  };
})();

/* 8 · claim: a blank page and the form, inside the phone */
const claim = (() => {
  const root = $('[data-scn="claim"]');
  const input = $('input', root);
  const handle = $('[data-claim-handle]');
  input.addEventListener('input', () => {
    const value = input.value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '').slice(0, 20);
    handle.textContent = value || 'yourname';
  });
  return { progress() {} };
})();

const BEHAVIOUR = { hero, feed, build, bio, visit, ping, worlds, claim };

/* ───────── captions ───────── */
function setCaptionPart(id, part) {
  const cap = captions.find((c) => c.dataset.cap === id);
  if (cap && cap.dataset.part !== part) cap.dataset.part = part;
}

/* ───────── the scroll engine ───────── */
let active = -1;
let frame = 0;
let inView = false;

function select(index) {
  if (index === active) return;
  const previous = active;
  active = index;
  const id = ORDER[index];
  stage.dataset.scene = id;
  scenes.forEach((el, k) => {
    el.classList.toggle('is-on', k === index);
    el.classList.toggle('is-past', k < index);
    el.inert = k !== index;
  });
  captions.forEach((el, k) => {
    el.classList.toggle('is-on', k === index);
    el.classList.toggle('is-past', k < index);
    el.setAttribute('aria-hidden', String(k !== index));
  });
  rail.forEach((b, k) => b.setAttribute('aria-current', k === index ? 'step' : 'false'));
  if (previous >= 0) BEHAVIOUR[ORDER[previous]].leave?.();
  if (inView) BEHAVIOUR[id].enter?.();
}

function update() {
  frame = 0;
  const range = Math.max(1, story.offsetHeight - innerHeight);
  const p = clamp01(-story.getBoundingClientRect().top / range) * total;
  let acc = 0;
  for (let k = 0; k < ORDER.length; k++) {
    const w = WEIGHTS[ORDER[k]];
    if (p < acc + w || k === ORDER.length - 1) {
      select(k);
      BEHAVIOUR[ORDER[k]].progress(clamp01((p - acc) / w));
      story.style.setProperty('--p', (p / total).toFixed(4));
      return;
    }
    acc += w;
  }
}
const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule, { passive: true });

new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting;
  const id = ORDER[active];
  if (!id) return;
  if (inView) BEHAVIOUR[id].enter?.(); else BEHAVIOUR[id].leave?.();
}, { threshold: 0.2 }).observe(stage);

// The rail and any "#make" link jump to a scene's middle.
function goTo(index) {
  const range = Math.max(1, story.offsetHeight - innerHeight);
  let acc = 0;
  for (let k = 0; k < index; k++) acc += WEIGHTS[ORDER[k]];
  const mid = index === ORDER.length - 1 ? total : acc + WEIGHTS[ORDER[index]] * 0.55;
  window.scrollTo({ top: story.offsetTop + (mid / total) * range, behavior: still() ? 'auto' : 'smooth' });
}
rail.forEach((b, k) => b.addEventListener('click', () => goTo(k)));
$$('a[href="#make"]').forEach((a) => a.addEventListener('click', (event) => {
  event.preventDefault();
  goTo(ORDER.length - 1);
  setTimeout(() => $('[data-scn="claim"] input').focus({ preventScroll: true }), still() ? 0 : 900);
}));

/* ───────── claim + toast ───────── */
const toastEl = $('#toast');
let toastTimer = 0;
document.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-claim]');
  if (!form) return;
  event.preventDefault();
  const input = $('input', form);
  const value = input.value.trim();
  if (!value) { retrigger(form, 'is-shake'); input.focus(); return; }
  toastEl.innerHTML = `<b>aura.my/${value.toLowerCase().replace(/[^a-z0-9._-]+/g, '')}</b> is saved as a preview. Claiming names opens soon.`;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 4800);
});

/* ───────── pause motion ───────── */
{
  const key = 'auramy-motion-paused';
  const toggle = $('[data-motion-toggle]');
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { const saved = localStorage.getItem(key); if (saved) paused = saved === 'true'; } catch { /* storage can be unavailable */ }
  const sync = () => {
    document.body.classList.toggle('is-motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'play motion' : 'pause motion';
  };
  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem(key, String(paused)); } catch { /* storage can be unavailable */ }
    sync();
    if (ORDER[active] === 'hero') { hero.leave(); hero.enter(); }
  });
  sync();
}

update();
