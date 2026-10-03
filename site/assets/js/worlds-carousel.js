import { renderSpace } from './spaces.js';
import { mountSpace } from './interact.js?v=motion-6';

const WORLDS = [
  { style: 'desk', title: 'little desktop', tag: 'organized chaos', detail: 'Open a folder. Move a window. Make yourself at home.', color: '#c6b4fc', tilt: -3 },
  { style: 'vinyl', title: 'vinyl room', tag: 'for the repeat offenders', detail: 'Drop the needle. Scratch a record. Find your next favorite.', color: '#ff98c6', tilt: 2 },
  { style: 'pixel', title: 'pixel world', tag: 'main character energy', detail: 'Take a walk. Play a game. Leave a little sign of life.', color: '#e9ff76', tilt: -2 },
  { style: 'scrap', title: 'scrapbook', tag: 'beautifully unfiltered', detail: 'Flip the photos. Move the notes. Leave something sweet.', color: '#bedfd9', tilt: 3 },
  { style: 'story', title: 'story mode', tag: 'life, in little moments', detail: 'Tap through the moments. Vote. Send a little note.', color: '#ffc282', tilt: -2 },
  { style: 'claim', title: 'make your own', tag: 'your turn', detail: 'Your camera roll has been waiting for this.', color: '#e9ff76', tilt: 0, claim: true },
];

/** Mount a native, non-autoplaying gallery. Returns a complete teardown function. */
export function initWorldsCarousel(root) {
  if (!root) return () => {};
  const track = root.querySelector('[data-worlds-track]');
  const pagination = root.querySelector('[data-worlds-dots]');
  const previous = root.querySelector('[data-worlds-prev]');
  const next = root.querySelector('[data-worlds-next]');
  const caption = root.querySelector('[data-worlds-caption]');
  const counter = root.querySelector('[data-worlds-counter]');
  const live = root.querySelector('[data-worlds-live]');
  if (!track || !pagination || !previous || !next) return () => {};

  const abort = new AbortController();
  const { signal } = abort;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const prefix = root.id || 'worlds';
  const initial = Math.max(0, Math.min(WORLDS.length - 1, Number(root.dataset.worldsStart) || 0));
  let active = -1;
  let requested = initial;
  let frame = 0;
  let settleTimer = 0;
  let resizeFrame = 0;
  let destroyed = false;
  let scrolling = false;
  let visible = false;
  let mounted = -1;
  let stopWorld = () => {};

  const total = WORLDS.length;
  const demoCard = (world, index) => `
    <article class="world-slide" id="${prefix}-world-${world.style}" data-world-slide="${world.style}"
      role="group" aria-roledescription="slide" aria-label="${index + 1} of ${total}: ${world.title}"
      style="--world-color:${world.color};--world-tilt:${world.tilt}deg">
      <div class="world-slide__plinth">
        <div class="world-slide__top"><span>${world.tag}</span><span aria-hidden="true">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></div>
        <div class="world-slide__phone-wrap">
          <div class="phone world-slide__phone"><div class="screen" data-world-screen data-off="1" inert>${renderSpace(world.style)}</div></div>
        </div>
        <span class="world-slide__try" aria-hidden="true">a whole world. go touch it. <span>↗</span></span>
        <button class="world-slide__preview" type="button" data-world-open="${index}" aria-label="Explore ${world.title}"></button>
      </div>
      <h3 class="world-slide__title">${world.title}<span aria-hidden="true">↗</span></h3>
    </article>`;
  const claimCard = (world, index) => `
    <article class="world-slide world-slide--claim" id="${prefix}-world-${world.style}" data-world-slide="${world.style}"
      role="group" aria-roledescription="slide" aria-label="${index + 1} of ${total}: ${world.title}"
      style="--world-color:${world.color};--world-tilt:${world.tilt}deg">
      <div class="world-slide__plinth">
        <div class="world-slide__top"><span>${world.tag}</span><span aria-hidden="true">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></div>
        <div class="world-slide__blank-site" aria-label="A blank personal website ready to build">
          <div class="world-slide__blank-bar"><span>aura.my/<b data-live-handle>yourname</b></span><i aria-hidden="true">− □ ×</i></div>
          <div class="world-slide__blank-page">
            <span class="world-slide__blank-avatar" aria-hidden="true"></span>
            <i class="world-slide__blank-line world-slide__blank-line--title" aria-hidden="true"></i>
            <i class="world-slide__blank-line world-slide__blank-line--short" aria-hidden="true"></i>
            <div class="world-slide__blank-blocks" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="world-slide__blank-claim">
              <p>this one’s yours.</p>
              <form class="worlds-claim" data-claim>
                <label class="worlds-claim__field"><span>aura.my/</span><input name="handle" autocomplete="off" spellcheck="false" maxlength="20" placeholder="yourname" aria-label="Your name"></label>
                <button type="submit">claim your name <span aria-hidden="true">↗</span></button>
              </form>
            </div>
          </div>
        </div>
        <span class="world-slide__try" aria-hidden="true">nothing here yet. on purpose. <span>↗</span></span>
      </div>
      <h3 class="world-slide__title">${world.title}<span aria-hidden="true">↗</span></h3>
    </article>`;
  track.innerHTML = WORLDS.map((world, index) => world.claim ? claimCard(world, index) : demoCard(world, index)).join('');

  pagination.innerHTML = WORLDS.map((world, index) => `<button class="worlds-dot" type="button"
    aria-label="Show ${world.title}" aria-controls="${prefix}-world-${world.style}" data-world-dot="${index}"><span></span></button>`).join('');
  const slides = [...track.querySelectorAll('[data-world-slide]')];
  const screens = slides.map((slide) => slide.querySelector('[data-world-screen]'));
  const previews = slides.map((slide) => slide.querySelector('[data-world-open]'));
  const dots = [...pagination.querySelectorAll('[data-world-dot]')];

  function unmount() {
    if (mounted < 0) return;
    stopWorld();
    if (screens[mounted]) screens[mounted].dataset.off = '1';
    mounted = -1;
    stopWorld = () => {};
  }

  function syncWorld() {
    const shouldRun = visible && !document.hidden && !scrolling && active >= 0;
    if (!shouldRun || mounted !== active) unmount();
    screens.forEach((screen, index) => { if (screen) screen.inert = index !== active; });
    if (shouldRun && screens[active] && mounted !== active) {
      // Existing mounts clean up loops; fresh DOM also discards their element listeners.
      screens[active].innerHTML = renderSpace(WORLDS[active].style);
      screens[active].dataset.off = '0';
      stopWorld = mountSpace(WORLDS[active].style, screens[active]);
      mounted = active;
    }
  }

  function select(index) {
    if (index === active) return;
    active = index;
    slides.forEach((slide, i) => {
      const selected = i === active;
      slide.classList.toggle('is-active', selected);
      if (previews[i]) previews[i].hidden = selected;
      // The CTA has no preview overlay. Keep its form out of the tab order while it is offscreen,
      // without re-rendering it, so a typed handle remains intact when the card is revisited.
      if (!previews[i]) slide.inert = !selected;
      dots[i].setAttribute('aria-current', String(selected));
    });
    previous.disabled = active === 0;
    next.disabled = active === WORLDS.length - 1;
    if (counter) counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(WORLDS.length).padStart(2, '0')}`;
    if (caption) caption.textContent = WORLDS[active].detail;
    syncWorld();
  }

  function closestSlide() {
    const bounds = track.getBoundingClientRect();
    const center = bounds.left + bounds.width / 2;
    let distance = Infinity;
    let nearest = active < 0 ? initial : active;
    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const delta = Math.abs(rect.left + rect.width / 2 - center);
      if (delta < distance) { distance = delta; nearest = index; }
    });
    return nearest;
  }

  function announce() {
    if (live) live.textContent = `${WORLDS[active].title}, ${active + 1} of ${WORLDS.length}. ${WORLDS[active].detail}`;
  }

  function settled() {
    if (destroyed) return;
    clearTimeout(settleTimer);
    scrolling = false;
    select(closestSlide());
    requested = active;
    syncWorld();
    announce();
  }

  function goTo(index, behavior = motion.matches ? 'auto' : 'smooth') {
    requested = Math.max(0, Math.min(WORLDS.length - 1, index));
    const trackRect = track.getBoundingClientRect();
    const slideRect = slides[requested].getBoundingClientRect();
    const left = track.scrollLeft + slideRect.left + slideRect.width / 2 - trackRect.left - trackRect.width / 2;
    track.scrollTo({ left, behavior });
    // Scroll events do not fire when already at the requested position.
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settled, behavior === 'auto' ? 0 : 180);
  }

  function onScroll() {
    scrolling = true;
    unmount();
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settled, 150);
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      if (!destroyed) select(closestSlide());
    });
  }

  previous.addEventListener('click', () => goTo(requested - 1), { signal });
  next.addEventListener('click', () => goTo(requested + 1), { signal });
  dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index), { signal }));
  previews.forEach((preview, index) => preview?.addEventListener('click', () => {
    // The preview button disappears on selection; preserve keyboard focus in the gallery.
    track.focus({ preventScroll: true });
    goTo(index);
  }, { signal }));
  track.addEventListener('scroll', onScroll, { passive: true, signal });
  track.addEventListener('scrollend', settled, { signal });
  root.addEventListener('keydown', (event) => {
    // Arrow keys belong to the live demos while focus is inside a phone.
    if (event.target.closest('.screen, input, textarea, select, [contenteditable="true"]')) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.target.closest('[data-world-open]')) track.focus({ preventScroll: true });
    if (event.key === 'Home') goTo(0);
    else if (event.key === 'End') goTo(WORLDS.length - 1);
    else goTo(requested + (event.key === 'ArrowRight' ? 1 : -1));
  }, { signal });
  document.addEventListener('visibilitychange', syncWorld, { signal });

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncWorld();
  }, { threshold: 0.08 });
  observer.observe(track);

  let width = 0;
  const resize = new ResizeObserver(([entry]) => {
    const newWidth = entry.contentRect.width;
    if (Math.abs(newWidth - width) < 1) return;
    width = newWidth;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (!destroyed) goTo(active < 0 ? initial : active, 'auto');
    });
  });
  resize.observe(track);
  select(initial);
  goTo(initial, 'auto');

  return () => {
    destroyed = true;
    abort.abort();
    observer.disconnect();
    resize.disconnect();
    cancelAnimationFrame(frame);
    cancelAnimationFrame(resizeFrame);
    clearTimeout(settleTimer);
    unmount();
    screens.forEach((screen) => { if (screen) { screen.inert = true; screen.dataset.off = '1'; } });
  };
}
