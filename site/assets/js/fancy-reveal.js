// "Your feed shows one side. Your page shows the rest." Ordinary scrolling drives three beats:
// Cami's post scrolls past between ads, the feed peels off, then her page scrolls block by
// block while a list beside the phone names each block. No wheel or touch interception.
import { camiPage } from './showcase-pages.js?v=1';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const seg = (t, a, b) => clamp01((t - a) / (b - a));
const ease = (t) => t * t * (3 - 2 * t);

export function initFancyReveal(root) {
  if (!root) return () => {};
  const stage = root.querySelector('[data-reveal-stage]');
  const curtain = root.querySelector('[data-reveal-curtain]');
  const scroller = root.querySelector('[data-fancy-scroll]');
  const note = root.querySelector('[data-reveal-note]');
  const status = root.querySelector('[data-reveal-status]');
  const spots = [...root.querySelectorAll('[data-spot]')];
  if (!stage || !curtain || !scroller) return () => {};

  scroller.innerHTML = camiPage();
  const view = scroller.parentElement;
  const blocks = spots.map((li) => scroller.querySelector(`[data-blk="${li.dataset.spot}"]`));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const { signal } = controller;
  let frame = 0;
  let lastNote = '';
  let lastSpot = -2;

  // Scroll offset that centres a block in the phone, kept inside the page.
  const centre = (el) => {
    const max = Math.max(0, scroller.scrollHeight - view.clientHeight);
    return Math.min(max, Math.max(0, el.offsetTop + el.offsetHeight / 2 - view.clientHeight / 2));
  };

  function update() {
    frame = 0;
    const still = motion.matches || document.body.classList.contains('is-motion-paused');
    root.classList.toggle('is-reduced', still);
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    const travel = Math.max(1, root.offsetHeight - stage.offsetHeight);
    const p = still ? 1 : clamp01((top - root.getBoundingClientRect().top) / travel);

    const feed = ease(seg(p, 0.03, 0.26));
    const lift = ease(seg(p, 0.2, 0.4));
    root.style.setProperty('--feed', feed.toFixed(4));
    root.style.setProperty('--reveal-progress', lift.toFixed(4));
    curtain.style.transform = `translateY(${-lift * 112}%) rotate(${-lift * 5}deg) skewY(${-Math.sin(lift * Math.PI) * 2.5}deg)`;
    curtain.style.visibility = lift >= 1 ? 'hidden' : 'visible';

    // Block by block: glide between block centres, light up the matching label.
    const s = seg(p, 0.44, 0.97);
    const pos = s * blocks.length - 0.5;
    const k = Math.max(0, Math.min(blocks.length - 1, Math.floor(pos)));
    const next = Math.min(blocks.length - 1, k + 1);
    const frac = pos < 0 ? 0 : ease(clamp01(pos - k));
    const y = still ? 0 : centre(blocks[k]) + (centre(blocks[next]) - centre(blocks[k])) * frac;
    scroller.style.transform = `translateY(${-y}px)`;
    const spot = still ? -1 : lift < 1 ? -1 : Math.min(blocks.length - 1, Math.floor(s * blocks.length));
    if (spot !== lastSpot) {
      lastSpot = spot;
      spots.forEach((li, i) => {
        li.classList.toggle('is-on', i === spot);
        li.classList.toggle('is-past', spot >= 0 && i < spot);
      });
      blocks.forEach((el, i) => el.classList.toggle('is-spot', i === spot));
      if (status) status.textContent = spot >= 0 ? `Cami's page: ${spots[spot].textContent}` : '';
    }

    const text = still ? '' : lift < 1 ? `leaving the feed… ${Math.round(lift * 100)}%` : spot >= 0 ? `✦ ${spots[spot].textContent}` : 'aura.my/cami';
    if (note && text !== lastNote) { note.textContent = text; lastNote = text; }
  }

  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', schedule, { passive: true, signal });
  addEventListener('resize', schedule, { passive: true, signal });
  motion.addEventListener('change', schedule, { signal });
  const pauseObserver = new MutationObserver(schedule);
  pauseObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  // Images change block heights once they load.
  scroller.querySelectorAll('img').forEach((img) => img.addEventListener('load', schedule, { once: true, signal }));
  update();

  return () => { controller.abort(); pauseObserver.disconnect(); cancelAnimationFrame(frame); };
}
