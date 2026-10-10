import { homeMarkup, mountHome } from './persona-sites.js?v=personas-1';

const clamp = (value) => Math.min(1, Math.max(0, value));
const ease = (value) => value * value * (3 - 2 * value);

/** Reveal Maddie's close-friends world through ordinary page scrolling. No wheel/touch interception. */
export function initScrollReveal(root) {
  if (!root) return () => {};
  const stage = root.querySelector('[data-reveal-stage]');
  const device = root.querySelector('[data-reveal-device]');
  const curtain = root.querySelector('[data-reveal-curtain]');
  const after = root.querySelector('.compare__after');
  const note = root.querySelector('[data-reveal-note]');
  const status = root.querySelector('[data-reveal-status]');
  if (!stage || !device || !curtain || !after) return () => {};

  const controller = new AbortController();
  const { signal } = controller;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let glitchTimer = 0;
  let previousProgress = 0;
  let complete = false;
  let inView = false;
  let mounted = false;
  let disposed = false;
  let currentNote = '';
  let stopWorld = () => {};

  after.innerHTML = homeMarkup('maddie');
  after.inert = true;
  after.dataset.off = '1';

  function stop() {
    if (mounted) stopWorld();
    mounted = false;
    stopWorld = () => {};
    after.dataset.off = '1';
  }

  function syncWorld() {
    const available = complete && inView && !document.hidden;
    after.inert = !available;
    if (available && !mounted) {
      // Mounts dispose animation loops. Fresh elements discard their old listeners.
      after.innerHTML = homeMarkup('maddie');
      stopWorld = mountHome('maddie', after);
      after.dataset.off = '0';
      mounted = true;
    } else if (!available && mounted) {
      stop();
    }
  }

  function glitch() {
    if (motion.matches || document.body.classList.contains('is-motion-paused') || !inView) return;
    clearTimeout(glitchTimer);
    device.classList.remove('is-glitch');
    // Two tiny position offsets, with no opacity or brightness flashing.
    void device.offsetWidth;
    device.classList.add('is-glitch');
    glitchTimer = setTimeout(() => device.classList.remove('is-glitch'), 190);
  }

  function update() {
    frame = 0;
    if (disposed) return;
    const staticView = motion.matches || document.body.classList.contains('is-motion-paused');
    root.classList.toggle('is-reduced', staticView);
    const bounds = root.getBoundingClientRect();
    const stageBounds = stage.getBoundingClientRect();
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    const travel = Math.max(1, root.offsetHeight - stage.offsetHeight);
    const raw = clamp((top - bounds.top) / travel);
    const progress = staticView ? 1 : ease(clamp((raw - 0.07) / 0.69));
    inView = stageBounds.bottom > Math.max(0, top) && stageBounds.top < innerHeight;

    root.style.setProperty('--reveal-progress', progress.toFixed(4));
    curtain.style.transform = `translateY(${-progress * 112}%) rotate(${-progress * 5}deg) skewY(${-Math.sin(progress * Math.PI) * 2.5}deg)`;
    curtain.style.visibility = progress >= 1 ? 'hidden' : 'visible';
    root.classList.toggle('is-peeling', progress > 0.01 && progress < 1);
    root.classList.toggle('is-revealed', progress >= 0.995);

    if (!staticView && [0.18, 0.5, 0.84].some((point) =>
      (previousProgress < point && progress >= point) || (previousProgress > point && progress <= point))) glitch();
    previousProgress = progress;

    const nextNote = staticView ? 'less motion. still very you.' : progress >= 0.995 ? 'oh. there you are. ↗' : progress > 0.14 ? 'personality.exe is starting…' : 'keep scrolling. this gets better. ↓';
    if (note && nextNote !== currentNote) { note.textContent = nextNote; currentNote = nextNote; }

    const nextComplete = progress >= 0.995;
    if (nextComplete !== complete) {
      complete = nextComplete;
      if (status) status.textContent = complete ? 'The link list has been removed. Your interactive scrapbook is ready to explore.' : 'Keep scrolling to reveal the personal scrapbook.';
    }
    syncWorld();
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  addEventListener('scroll', schedule, { passive: true, signal });
  addEventListener('resize', schedule, { passive: true, signal });
  document.addEventListener('visibilitychange', syncWorld, { signal });
  motion.addEventListener('change', schedule, { signal });
  const resize = new ResizeObserver(schedule);
  resize.observe(root);
  resize.observe(stage);
  const pauseObserver = new MutationObserver(schedule);
  pauseObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  update();

  return () => {
    disposed = true;
    controller.abort();
    resize.disconnect();
    pauseObserver.disconnect();
    cancelAnimationFrame(frame);
    clearTimeout(glitchTimer);
    stop();
    after.inert = true;
    device.classList.remove('is-glitch');
  };
}
