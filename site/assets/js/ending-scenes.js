const instances = new WeakMap();

const paused = () => document.body.classList.contains('is-motion-paused');

// Decorative only: when the page is quiet, hidden, or out of view, the first
// slide is a complete, intentional still instead of a half-finished transition.
export function initEndingScenes(root = document.querySelector('[data-ending-slideshow]')) {
  if (!root || instances.has(root)) return instances.get(root)?.destroy;

  const slides = [...root.querySelectorAll('[data-notify-slide]')];
  const count = root.querySelector('[data-notify-count]');
  const stack = root.querySelector('[data-notify-stack]');
  if (!slides.length) return undefined;

  const controller = new AbortController();
  const { signal } = controller;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let active = 0;
  let slideTimer = 0;
  let messageTimer = 0;
  let cleanupTimer = 0;
  let running = false;
  const transitions = ['push', 'wipe', 'cut'];
  // Calm and specific: who came by, what they liked, what they said.
  const messages = [
    ['Hannah', 'left a note: “the canoe clip. you know the one.”'],
    ['Jules', 'has your song on repeat too 🤝'],
    ['Noor', 'stopped by your page'],
    ['Priya', 'added a clip to your edit 🎬'],
    ['Coach D', 'signed the team page: film at 3:15.'],
    ['June', 'drew a moth in your guestbook ☾'],
  ];
  // The static stack already shows the first three, so the first live pop is a
  // new person rather than a duplicate.
  let messageIndex = 3;

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
    clearTimeout(slideTimer);
    clearTimeout(messageTimer);
    clearTimeout(cleanupTimer);
    slideTimer = 0;
    messageTimer = 0;
    cleanupTimer = 0;
  };

  const popMessage = () => {
    if (!stack || !running) return;
    const [name, copy] = messages[messageIndex++ % messages.length];
    const node = document.createElement('div');
    node.className = 'ntf is-new';
    node.innerHTML = `<span class="ntf__ico"><img src="/assets/img/brand/auramy-monitor.jpg?v=materials-8" alt=""></span><b>Auramy</b><small>now</small><p>${name[0].toUpperCase()}${name.slice(1)} ${copy}</p>`;
    stack.prepend(node);
    [...stack.children].slice(3).forEach((item) => item.remove());
    messageTimer = setTimeout(popMessage, 3600 + Math.round(Math.random() * 900));
  };

  const next = () => {
    const previous = active;
    const nextIndex = (active + 1) % slides.length;
    draw(nextIndex, transitions[active % transitions.length], previous);
    cleanupTimer = setTimeout(() => {
      slides.forEach((slide) => slide.classList.remove('is-exiting'));
    }, 500);
    slideTimer = setTimeout(next, 3100);
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
    slideTimer = setTimeout(next, 3100);
    messageTimer = setTimeout(popMessage, 400);
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
