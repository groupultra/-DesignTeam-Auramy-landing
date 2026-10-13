// The hero: one phone, open in a mobile browser at aura.my/<name>. It flips through a few
// friends' pages, each a completely different look, so the first thing a visitor sees is
// "this makes a website I open on my phone, and it can look like anything".
// The chips pick a look, 🎲 shuffles. Pages inside the phone are live (tap them). Local demo only.
import { PERSONAS } from './personas.js';
import { homeMarkup, mountHome } from './persona-sites.js?v=early-web-1';
import { doodle } from './doodles.js';

const LOOKS = ['camila', 'maddie', 'marcus', 'river', 'theo', 'jayden'];
const VIBE = { camila: 'film edit', maddie: 'rainy drive', marcus: 'game night', river: 'night sky', theo: 'old cinema', jayden: 'game lobby' };
const CYCLE_MS = 3800;
const ph = (name, fill = false) => `<i class="${fill ? 'ph-fill' : 'ph'} ph-${name}" aria-hidden="true"></i>`;
const handleOf = (id) => PERSONAS[id].url.replace('aura.my/', '');

export function initHeroPhone(host) {
  if (!host) return () => {};
  host.innerHTML = `
    <div class="hp__sky" aria-hidden="true">${doodle('cloud', 'hp__cloud hp__cloud--a')}${doodle('cloud', 'hp__cloud hp__cloud--b')}<i class="desk-hill"></i></div>
    <p class="hp__note" aria-hidden="true">a real website.<br>phone or laptop.${doodle('arrow', 'hp__note-arrow')}</p>
    <div class="hp__laptop" aria-hidden="true">
      <div class="hp__lid"><div class="hp__desk">${doodle('cloud', 'hp__cloud hp__cloud--l')}<i class="desk-hill"></i>
        <div class="hp__win"><p class="hp__winbar"><i></i><i></i><i></i><span>${ph('lock-simple', true)}aura.my/<b data-hp-lap-handle>${handleOf(LOOKS[0])}</b></span></p><div class="hp__winview"><div class="hp__col" data-hp-lap></div></div></div>
      </div></div>
      <i class="hp__base"></i>
    </div>
    <div class="phone hp__phone">
      <div class="screen hp__screen">
        <div class="hp__status" aria-hidden="true"><b>9:41</b><span>${ph('cell-signal-full', true)}${ph('wifi-high', true)}${ph('battery-full', true)}</span></div>
        <div class="hp__bar">
          <span class="hp__aa" aria-hidden="true">aA</span>
          <p class="hp__url">${ph('lock-simple', true)}<span>aura.my/<b data-hp-handle>${handleOf(LOOKS[0])}</b></span></p>
          <span class="hp__reload" aria-hidden="true">${ph('arrow-clockwise')}</span>
          <i class="hp__load" aria-hidden="true"></i>
        </div>
        <div class="hp__view" data-hp-view aria-live="off"></div>
        <div class="hp__tools" aria-hidden="true">${ph('caret-left')}${ph('caret-right')}${ph('export')}${ph('book-open')}${ph('copy')}</div>
      </div>
    </div>
    <div class="xpwin hp__picker">
      <header class="xpwin__bar"><img class="xpwin__icon" src="/assets/img/brand/auramy-monitor.jpg?v=materials-8" alt="" width="16" height="16"><b class="xpwin__title" id="hp-pick">pick a look</b></header>
      <div class="hp__picker-body">
        <div class="hp__looks" role="radiogroup" aria-labelledby="hp-pick">${LOOKS.map((id, i) => `<button type="button" role="radio" data-hp-look="${id}" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" style="--look:${PERSONAS[id].color}"><i aria-hidden="true"></i><span><b>${PERSONAS[id].template}</b><small>${VIBE[id]}</small></span></button>`).join('')}</div>
        <button type="button" class="xp-btn hp__dice" data-hp-dice><span class="hp__die" aria-hidden="true">🎲</span>shuffle</button>
      </div>
    </div>
    <p class="sr-only" role="status" data-hp-status></p>`;

  const view = host.querySelector('[data-hp-view]');
  const lap = host.querySelector('[data-hp-lap]');
  const lapHandle = host.querySelector('[data-hp-lap-handle]');
  const wide = matchMedia('(min-width: 961px)');
  const handle = host.querySelector('[data-hp-handle]');
  const bar = host.querySelector('.hp__bar');
  const status = host.querySelector('[data-hp-status]');
  const chips = [...host.querySelectorAll('[data-hp-look]')];
  const dice = host.querySelector('[data-hp-dice]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const still = () => reduced.matches || document.body.classList.contains('is-motion-paused');
  const abort = new AbortController();
  const { signal } = abort;

  let current = -1;
  let stopPage = () => {};
  let typeTimer = 0;
  let cycleTimer = 0;
  let visible = false;
  let touched = false;

  function typeHandle(text) {
    clearInterval(typeTimer);
    if (still()) { handle.textContent = text; return; }
    let n = 0;
    handle.textContent = '';
    typeTimer = setInterval(() => {
      handle.textContent = text.slice(0, ++n);
      if (n >= text.length) clearInterval(typeTimer);
    }, 38);
  }

  function render(index) {
    const id = LOOKS[index];
    stopPage();
    const page = document.createElement('div');
    page.className = 'hp__page';
    page.innerHTML = homeMarkup(id);
    view.querySelectorAll('.hp__page').forEach((old) => {
      old.classList.add('is-out');
      old.inert = true;
      setTimeout(() => old.remove(), still() ? 0 : 420);
    });
    view.append(page);
    stopPage = visible ? mountHome(id, page) : () => {};
    page.dataset.mounted = visible ? '1' : '0';
    // The laptop shows the same page as a desktop browser would: one column, centred.
    if (lap && wide.matches) lap.innerHTML = homeMarkup(id);
    if (lapHandle) lapHandle.textContent = handleOf(id);
  }

  function show(index, { announce = false } = {}) {
    const next = (index + LOOKS.length) % LOOKS.length;
    if (next === current) return;
    current = next;
    const id = LOOKS[current];
    chips.forEach((chip, i) => {
      chip.setAttribute('aria-checked', String(i === current));
      chip.tabIndex = i === current ? 0 : -1;
    });
    typeHandle(handleOf(id));
    bar.classList.remove('is-loading');
    void bar.offsetWidth;
    bar.classList.add('is-loading');
    render(current);
    if (announce) status.textContent = `Showing ${PERSONAS[id].template}, a ${VIBE[id]} look, at ${PERSONAS[id].url}.`;
  }

  // Pages only run their little loops while the hero is on screen.
  function syncLive() {
    const page = view.querySelector('.hp__page:not(.is-out)');
    if (!page) return;
    if (visible && page.dataset.mounted !== '1') {
      page.innerHTML = homeMarkup(LOOKS[current]);
      stopPage = mountHome(LOOKS[current], page);
      page.dataset.mounted = '1';
    } else if (!visible && page.dataset.mounted === '1') {
      stopPage();
      stopPage = () => {};
      page.dataset.mounted = '0';
    }
  }

  function syncCycle() {
    clearInterval(cycleTimer);
    cycleTimer = 0;
    if (touched || !visible || document.hidden || still()) return;
    cycleTimer = setInterval(() => show(current + 1), CYCLE_MS);
  }

  const takeOver = () => { touched = true; syncCycle(); };

  chips.forEach((chip, i) => {
    chip.addEventListener('click', () => { takeOver(); show(i, { announce: true }); }, { signal });
    chip.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      takeOver();
      show(i + step, { announce: true });
      chips[current].focus();
    }, { signal });
  });

  dice.addEventListener('click', () => {
    takeOver();
    let next = current;
    while (next === current) next = Math.floor(Math.random() * LOOKS.length);
    dice.classList.remove('is-rolling');
    void dice.offsetWidth;
    dice.classList.add('is-rolling');
    show(next, { announce: true });
  }, { signal });

  // Tapping inside the page also counts as "I'm looking at this one".
  view.addEventListener('pointerdown', takeOver, { signal });

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncLive();
    syncCycle();
  }, { threshold: 0.35 });
  observer.observe(host.querySelector('.hp__phone'));
  document.addEventListener('visibilitychange', syncCycle, { signal });
  document.addEventListener('auramy:motion-change', syncCycle, { signal });
  reduced.addEventListener('change', syncCycle, { signal });
  wide.addEventListener('change', () => { if (wide.matches && lap && !lap.firstChild) lap.innerHTML = homeMarkup(LOOKS[current]); }, { signal });

  show(0);

  return () => {
    abort.abort();
    observer.disconnect();
    clearInterval(typeTimer);
    clearInterval(cycleTimer);
    stopPage();
  };
}
