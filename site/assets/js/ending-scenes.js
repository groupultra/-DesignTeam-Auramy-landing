const instances = new WeakMap();

const paused = () => document.body.classList.contains('is-motion-paused');

// Decorative only: when the page is quiet, hidden, or out of view, the first
// slide is a complete, intentional still instead of a half-finished transition.
export function initEndingScenes(root = document.querySelector('[data-ending-slideshow]')) {
  if (!root || instances.has(root)) return instances.get(root)?.destroy;

  const slides = [...root.querySelectorAll('[data-notify-slide]')];
  const count = root.querySelector('[data-notify-count]');
  if (!slides.length) return undefined;

  const controller = new AbortController();
  const { signal } = controller;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let active = 0;
  let timer = 0;
  let cleanupTimer = 0;
  let running = false;
  const transitions = ['push', 'wipe', 'cut'];

  const draw = (index, style = 'still', previous = -1) => {
    active = index;
    root.dataset.notifyTransition = style;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      slide.classList.toggle('is-exiting', style !== 'still' && i === previous);
      slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    if (count) count.textContent = String(index + 1).padStart(2, '0');
  };

  const clearTimers = () => {
    clearTimeout(timer);
    clearTimeout(cleanupTimer);
    timer = 0;
    cleanupTimer = 0;
  };

  const next = () => {
    const previous = active;
    const nextIndex = (active + 1) % slides.length;
    draw(nextIndex, transitions[active % transitions.length], previous);
    cleanupTimer = setTimeout(() => {
      slides.forEach((slide) => slide.classList.remove('is-exiting'));
    }, 760);
    timer = setTimeout(next, 4400);
  };

  const sync = () => {
    const shouldRun = inView && !document.hidden && !reduced.matches && !paused();
    if (shouldRun === running) return;
    running = shouldRun;
    clearTimers();
    if (!running) {
      draw(0);
      return;
    }
    timer = setTimeout(next, 4400);
  };

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }, { threshold: 0.2 });
  observer.observe(root);
  document.addEventListener('visibilitychange', sync, { signal });
  window.addEventListener('pagehide', () => {
    inView = false;
    sync();
  }, { signal });
  window.addEventListener('pageshow', () => {
    const rect = root.getBoundingClientRect();
    inView = rect.bottom > 0 && rect.top < innerHeight;
    sync();
  }, { signal });
  document.addEventListener('auramy:motion-change', sync, { signal });
  reduced.addEventListener('change', sync, { signal });

  draw(0);
  const destroy = () => {
    clearTimers();
    observer.disconnect();
    controller.abort();
    instances.delete(root);
  };
  instances.set(root, { destroy });
  return destroy;
}
