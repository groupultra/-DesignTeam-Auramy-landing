import { renderSpace } from './spaces.js';
import { mountSpace } from './interact.js?v=calm-7';

const WORLDS = [
  { id: 'desk', label: 'Desktop', title: 'little desktop', hint: 'Open icons, move windows, and make a little mess.' },
  { id: 'vinyl', label: 'Vinyl', title: 'vinyl room', hint: 'Scratch a record and swap what is on the shelf.' },
  { id: 'pixel', label: 'Pixel', title: 'pixel world', hint: 'Walk around, visit places, and leave a sign of life.' },
  { id: 'scrap', label: 'Scrapbook', title: 'scrapbook', hint: 'Flip photos, move notes, and sign the wall.' },
  { id: 'story', label: 'Story', title: 'story mode', hint: 'Tap through moments, vote, and send a note.' },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Mount the five original interactive worlds in one scroll-pinned phone.
 * The returned function removes listeners and stops the active demo loop.
 */
export function initWorldsScroll(root) {
  if (!root) return () => {};

  const prefix = root.id || 'spaces';
  root.innerHTML = `
    <div class="worlds-scroll__pin" data-worlds-pin>
      <div class="worlds-scroll__layout">
        <header class="worlds-scroll__head">
          <h2 id="${prefix}-title">One page. Different worlds.</h2>
          <p data-worlds-instruction>Scroll to explore. Tap a style to jump.</p>
        </header>
        <div class="worlds-scroll__stage">
          <div class="phone worlds-scroll__phone">
            <div class="screen worlds-scroll__screen" id="${prefix}-panel" role="tabpanel" aria-live="off" data-off="1" inert></div>
          </div>
          <div class="worlds-scroll__tabs" role="tablist" aria-label="Choose a world">
            ${WORLDS.map((world, index) => `<button type="button" role="tab" id="${prefix}-tab-${world.id}" aria-controls="${prefix}-panel" aria-selected="${index === 0 ? 'true' : 'false'}" tabindex="${index === 0 ? '0' : '-1'}" data-world-index="${index}">${world.label}</button>`).join('')}
          </div>
          <p class="worlds-scroll__hint" data-worlds-hint></p>
        </div>
      </div>
      <p class="worlds-scroll__progress" aria-hidden="true"><b data-worlds-count>1 / ${WORLDS.length}</b><span>keep scrolling to change worlds ↓</span></p>
    </div>`;

  const abort = new AbortController();
  const { signal } = abort;
  const screen = root.querySelector('[data-off]');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const hint = root.querySelector('[data-worlds-hint]');
  const count = root.querySelector('[data-worlds-count]');
  const instruction = root.querySelector('[data-worlds-instruction]');
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

  function syncInstruction() {
    instruction.textContent = isManual() ? 'Tap a style to explore.' : 'Scroll to explore. Tap a style to jump.';
  }

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
    screen.innerHTML = renderSpace(world.id);
    screen.dataset.off = '0';
    screen.inert = false;
    stopWorld = mountSpace(world.id, screen);
    mounted = active;
  }

  function select(index) {
    const next = clamp(index, 0, WORLDS.length - 1);
    if (next === active) return;
    active = next;
    const world = WORLDS[active];
    root.dataset.world = world.id;
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    screen.setAttribute('aria-labelledby', tabs[active].id);
    hint.textContent = world.hint;
    count.textContent = `${active + 1} / ${WORLDS.length}`;
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

  window.addEventListener('scroll', scheduleScroll, { passive: true, signal });
  window.addEventListener('resize', scheduleScroll, { passive: true, signal });
  document.addEventListener('visibilitychange', syncWorld, { signal });
  motionFallback.addEventListener('change', () => {
    lockTo = null;
    syncInstruction();
    if (!isManual()) scheduleScroll();
  }, { signal });

  // Observe the phone itself. The section stays intersecting while its sticky
  // content has already left the viewport at either end.
  const observer = new IntersectionObserver(([entry]) => {
    rootVisible = entry.isIntersecting;
    syncWorld();
  }, { threshold: 0.1 });
  observer.observe(screen);

  select(0);
  syncInstruction();
  if (!isManual()) scheduleScroll();

  return () => {
    destroyed = true;
    abort.abort();
    observer.disconnect();
    cancelAnimationFrame(frame);
    clearTimeout(lockTimer);
    unmount();
    screen.innerHTML = '';
  };
}
