import { PERSONAS, ORDER, personaAvatar } from './personas.js';
import { homeMarkup, mountHome } from './persona-sites.js?v=early-web-1';

// After the seven people comes an eighth, empty world: yours. It ends the scroll on a claim form.
const SMILEY = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#f6ec22" d="M32 4c17-1 29 12 28 29-1 17-13 28-29 27C15 59 4 47 5 31 6 15 17 5 32 4Z"/><path fill="none" stroke="#161a2e" stroke-width="4" stroke-linecap="round" d="M23 22l-1 8M40 20l1 8M17 37c8 10 24 10 31-2"/></svg>')}`;
const YOU = { id: 'you', label: 'You', name: 'You', meta: 'aura.my/yourname', template: 'blank page', url: 'aura.my/you', madeFor: 'you. yes, you.', line: 'Seven people, seven worlds. Yours is next.' };
const WORLDS = [...ORDER.map((id) => ({ id, label: PERSONAS[id].name, ...PERSONAS[id] })), YOU];
const avatarFor = (id) => (id === 'you' ? SMILEY : personaAvatar(id));

const youMarkup = () => `<div class="ps ps--you">
  <p class="ps-you__bar"><span>aura.my/</span><b>???</b></p>
  <div class="ps-you__avatar" aria-hidden="true">+</div>
  <p class="ps-you__name">your name here</p>
  <ul class="ps-you__blocks" aria-label="Empty spots on your page"><li>your photos</li><li>your songs</li><li>your people</li></ul>
  <p class="ps-you__empty">this one’s still empty.<br><b>it’s waiting for you.</b></p>
  <form class="ps-you__claim" data-claim>
    <label><span>aura.my/</span><input name="handle" autocomplete="off" spellcheck="false" maxlength="20" placeholder="yourname" aria-label="Your name"></label>
    <button type="submit">claim it →</button>
  </form>
  <a class="ps-you__build" href="#how">or build it first ↓</a>
</div>`;
const yourHome = (id) => (id === 'you' ? youMarkup() : homeMarkup(id));
// The blank page's claim box starts with whatever name was typed anywhere else on the page.
const mountYours = (id, host) => {
  if (id !== 'you') return mountHome(id, host);
  const typed = [...document.querySelectorAll('[data-claim] input[name="handle"]')].find((el) => el.value.trim());
  const input = host.querySelector('input[name="handle"]');
  if (typed && input) input.value = typed.value;
  return () => {};
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Each world re-skins the whole section: a backdrop photo, two pinned-up pictures in that
// template's style and one signature effect (film running, rain + wiper, field lines,
// rising skulls, stars + moths, projector flicker, nail glints). Photos load lazily.
const BACKDROPS = {
  camila: { bg: 'car', pics: ['fries', 'pool'] },
  maddie: { bg: 'bus', pics: ['earbuds', 'doodle'], caps: ['cf only', ''] },
  marcus: { bg: 'stands', pics: ['mom', 'lift'], caps: ['SENIOR NIGHT', '6AM LIFT'] },
  jayden: { bg: null, pics: ['catmeme', 'drift'] },
  river: { bg: 'zine', pics: ['sheet', 'charm'], caps: ['kite, ref v3', ''] },
  theo: { bg: 'matinee', pics: ['ticket', 'street'], caps: ['ADMIT ONE', 'REEL 2'] },
  aaliyah: { bg: 'floral', pics: ['cobalt', 'braids'], caps: ['$25', 'knotless'] },
  you: { bg: null, pics: [], empty: ['+ your pic', '+ your song'] },
};
const spread = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');
const DECOR = {
  camila: '<i class="wbg__strip"></i><i class="wbg__strip wbg__strip--r"></i><i class="wbg__clips"></i>',
  maddie: '<i class="wbg__bokeh"></i><i class="wbg__rain"></i><i class="wbg__wiper"></i>',
  marcus: '<i class="wbg__yards"></i><i class="wbg__light"></i><i class="wbg__light wbg__light--r"></i>',
  jayden: `<i class="wbg__grid"></i>${spread(8, (i) => `<b class="wbg__skull" style="--x:${(i * 13 + 5) % 96}%;--d:${(i * 0.83).toFixed(2)}s;--s:${0.7 + (i % 3) * 0.25}">💀</b>`)}`,
  river: `<i class="wbg__stars"></i><i class="wbg__moon"></i><i class="wbg__lamp"></i>${spread(3, (i) => `<b class="wbg__moth" style="--d:${-i * 1.1}s;--r:${34 + i * 14}px"></b>`)}`,
  theo: '<i class="wbg__beam"></i><i class="wbg__grain"></i><i class="wbg__bars"></i>',
  you: `<i class="wbg__dots"></i>${spread(7, (i) => `<b class="wbg__twinkle" style="--x:${[8, 86, 22, 72, 50, 14, 92][i]}%;--y:${[12, 20, 70, 64, 8, 40, 46][i]}%;--d:${(i * 0.41).toFixed(2)}s">✦</b>`)}`,
  aaliyah: `<i class="wbg__braid"></i><i class="wbg__braid wbg__braid--r"></i>${spread(6, (i) => `<b class="wbg__glint" style="--x:${[12, 82, 30, 70, 8, 90][i]}%;--y:${[18, 30, 62, 74, 44, 56][i]}%;--d:${(i * 0.47).toFixed(2)}s">✦</b>`)}`,
};

const backdropMarkup = () => `<div class="wbg" aria-hidden="true">${WORLDS.map(({ id }) => {
  const { pics, caps = [], empty = [] } = BACKDROPS[id];
  const photos = pics.map((key, i) => `<figure class="wbg__pic wbg__pic--${i ? 'b' : 'a'}"><img alt="" data-src="${PERSONAS[id].photos[key]}" decoding="async">${caps[i] ? `<figcaption>${caps[i]}</figcaption>` : ''}</figure>`).join('');
  const blanks = empty.map((label, i) => `<figure class="wbg__pic wbg__pic--${i ? 'b' : 'a'} wbg__pic--empty"><span>${label}</span></figure>`).join('');
  return `<div class="wbg__layer" data-bg="${id}"><i class="wbg__photo"></i>${DECOR[id]}${photos}${blanks}</div>`;
}).join('')}</div>`;

/**
 * Mount the seven persona template worlds in one scroll-pinned phone.
 * The returned function removes listeners and stops the active demo loop.
 */
export function initWorldsScroll(root) {
  if (!root) return () => {};

  const prefix = root.id || 'spaces';
  root.innerHTML = `
    <div class="worlds-scroll__pin" data-worlds-pin>
      ${backdropMarkup()}
      <div class="worlds-scroll__layout">
        <header class="worlds-scroll__head">
          <h2 class="sec-title" id="${prefix}-title">Whoever you are,<br><em>there’s a world for it.</em></h2>
          <div class="worlds-scroll__who" data-worlds-who aria-live="polite">
            <p class="worlds-scroll__name"><img data-who-avatar src="" alt="" width="44" height="44"><span><b data-who-name></b><small data-who-meta></small></span></p>
            <p class="worlds-scroll__for">made for <em data-who-for></em></p>
            <p class="worlds-scroll__line" data-who-line></p>
          </div>
        </header>
        <div class="worlds-scroll__stage">
          <div class="phone worlds-scroll__phone">
            <div class="screen worlds-scroll__screen" id="${prefix}-panel" role="tabpanel" aria-live="off" data-off="1" inert></div>
          </div>
          <p class="worlds-scroll__url" data-who-url aria-hidden="true"></p>
        </div>
      </div>
      <div class="worlds-scroll__tabs" role="tablist" aria-label="Choose a world">
        ${WORLDS.map((world, index) => `<button type="button" role="tab" id="${prefix}-tab-${world.id}" aria-controls="${prefix}-panel" aria-selected="${index === 0 ? 'true' : 'false'}" tabindex="${index === 0 ? '0' : '-1'}" data-world-index="${index}"><img src="${avatarFor(world.id)}" alt="" width="20" height="20"><span>${world.label}</span></button>`).join('')}
      </div>
    </div>`;

  const abort = new AbortController();
  const { signal } = abort;
  const screen = root.querySelector('[data-off]');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const who = {
    avatar: root.querySelector('[data-who-avatar]'),
    name: root.querySelector('[data-who-name]'),
    meta: root.querySelector('[data-who-meta]'),
    madeFor: root.querySelector('[data-who-for]'),
    line: root.querySelector('[data-who-line]'),
    url: root.querySelector('[data-who-url]'),
  };
  const layers = [...root.querySelectorAll('.wbg__layer')];
  let switchTimer = 0;
  const motionFallback = matchMedia('(prefers-reduced-motion: reduce), (max-height: 640px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = -1;
  let mounted = -1;
  let stopWorld = () => {};
  let rootVisible = false;
  let destroyed = false;
  let frame = 0;
  let lockTo = null;
  let lockTimer = 0;

  const isManual = () => motionFallback.matches;
  const shouldAvoidSmoothScroll = () => reducedMotion.matches || document.body.classList.contains('is-motion-paused');
  const range = () => Math.max(1, root.offsetHeight - window.innerHeight);

  function unmount() {
    if (mounted < 0) return;
    stopWorld();
    stopWorld = () => {};
    mounted = -1;
    screen.dataset.off = '1';
    screen.inert = true;
  }

  function syncWorld() {
    const shouldRun = active >= 0 && rootVisible && !document.hidden;
    if (!shouldRun || mounted !== active) unmount();
    if (!shouldRun || mounted === active) return;

    const world = WORLDS[active];
    screen.innerHTML = yourHome(world.id);
    screen.dataset.off = '0';
    screen.inert = false;
    stopWorld = mountYours(world.id, screen);
    mounted = active;
  }

  // Show the active backdrop; load its photos (and its neighbours') only when needed.
  function paintBackdrop() {
    layers.forEach((layer, index) => {
      layer.classList.toggle('is-on', index === active);
      if (Math.abs(index - active) > 1 || layer.dataset.loaded) return;
      layer.dataset.loaded = 'true';
      const bg = BACKDROPS[layer.dataset.bg].bg;
      if (bg) layer.querySelector('.wbg__photo').style.backgroundImage = `url("${PERSONAS[layer.dataset.bg].photos[bg]}")`;
      layer.querySelectorAll('img[data-src]').forEach((img) => { img.src = img.dataset.src; });
    });
  }

  function select(index) {
    const next = clamp(index, 0, WORLDS.length - 1);
    if (next === active) return;
    active = next;
    const world = WORLDS[active];
    const first = !root.dataset.world;
    root.dataset.world = world.id;
    paintBackdrop();
    if (!first) {
      root.classList.remove('is-switching');
      void root.offsetWidth;
      root.classList.add('is-switching');
      clearTimeout(switchTimer);
      switchTimer = setTimeout(() => root.classList.remove('is-switching'), 450);
    }
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    screen.setAttribute('aria-labelledby', tabs[active].id);
    who.avatar.src = avatarFor(world.id);
    who.name.textContent = world.name;
    who.meta.textContent = world.meta;
    who.madeFor.textContent = world.madeFor;
    who.line.textContent = world.line;
    who.url.textContent = `${world.url} · ${world.template}`;
    syncWorld();
  }

  function indexFromScroll() {
    const progress = clamp(-root.getBoundingClientRect().top / range(), 0, 0.999999);
    return Math.floor(progress * WORLDS.length);
  }

  function onScroll() {
    if (destroyed || isManual()) return;
    const next = indexFromScroll();
    if (lockTo !== null && next !== lockTo) return;
    lockTo = null;
    select(next);
  }

  function scheduleScroll() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      onScroll();
    });
  }

  function goTo(index) {
    const next = clamp(index, 0, WORLDS.length - 1);
    select(next);
    if (isManual()) return;

    lockTo = next;
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => {
      lockTo = null;
      onScroll();
    }, 1400);
    const target = window.scrollY + root.getBoundingClientRect().top + ((next + 0.5) / WORLDS.length) * range();
    window.scrollTo({ top: target, behavior: shouldAvoidSmoothScroll() ? 'auto' : 'smooth' });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => goTo(index), { signal });
    tab.addEventListener('keydown', (event) => {
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index + 1;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index - 1;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = WORLDS.length - 1;
      if (next === null) return;
      event.preventDefault();
      goTo(clamp(next, 0, WORLDS.length - 1));
      tabs[clamp(next, 0, WORLDS.length - 1)].focus({ preventScroll: true });
    }, { signal });
  });

  // Links elsewhere on the page ("see her world") jump straight to one persona.
  document.addEventListener('auramy:world', (event) => {
    const index = WORLDS.findIndex((world) => world.id === event.detail);
    if (index < 0) return;
    if (isManual()) root.scrollIntoView({ behavior: shouldAvoidSmoothScroll() ? 'auto' : 'smooth' });
    goTo(index);
  }, { signal });

  window.addEventListener('scroll', scheduleScroll, { passive: true, signal });
  window.addEventListener('resize', scheduleScroll, { passive: true, signal });
  document.addEventListener('visibilitychange', syncWorld, { signal });
  motionFallback.addEventListener('change', () => {
    lockTo = null;
    if (!isManual()) scheduleScroll();
  }, { signal });

  // Observe the phone itself. The section stays intersecting while its sticky
  // content has already left the viewport at either end.
  const observer = new IntersectionObserver(([entry]) => {
    rootVisible = entry.isIntersecting;
    root.classList.toggle('is-visible', rootVisible);
    syncWorld();
  }, { threshold: 0.1 });
  observer.observe(screen);

  select(0);
  if (!isManual()) scheduleScroll();

  return () => {
    destroyed = true;
    abort.abort();
    observer.disconnect();
    cancelAnimationFrame(frame);
    clearTimeout(lockTimer);
    clearTimeout(switchTimer);
    unmount();
    screen.innerHTML = '';
  };
}
