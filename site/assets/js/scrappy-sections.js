// Small responses to real demo interactions; no gesture interception or fake progress.
const activeSections = new WeakMap();

export function initScrappySections(root = document) {
  const how = root.querySelector('.editorial-page .how');
  const safe = root.querySelector('.editorial-page .safe');
  const key = how || safe;
  if (!key) return () => {};
  activeSections.get(key)?.();

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const quietMotion = () => motion.matches || document.body.classList.contains('is-motion-paused');
  const timers = new Set();
  const animations = new Set();
  const reactions = new Map();
  const inputTimes = new WeakMap();
  const listeners = [];
  let closed = false;

  const listen = (el, event, fn, capture = false) => {
    if (!el) return;
    el.addEventListener(event, fn, capture);
    listeners.push(() => el.removeEventListener(event, fn, capture));
  };
  const later = (fn, duration) => {
    const timer = setTimeout(() => { timers.delete(timer); if (!closed) fn(); }, duration);
    timers.add(timer);
    return timer;
  };
  const bounce = (el, gentle = false) => {
    if (!el || quietMotion() || !el.animate) return;
    const animation = el.animate([
      { scale: 1 },
      { scale: gentle ? 1.018 : .94, offset: .2 },
      { scale: gentle ? .995 : 1.04, offset: .58 },
      { scale: 1 },
    ], { duration: gentle ? 280 : 380, easing: 'cubic-bezier(.22,.8,.35,1)' });
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
  };
  const stamp = (step, text) => {
    const previous = reactions.get(step);
    if (previous) {
      clearTimeout(previous.timer);
      timers.delete(previous.timer);
      previous.el.remove();
    }
    const el = document.createElement('span');
    el.className = 'scrappy-reaction';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = text;
    const screen = step.querySelector('.step__screen');
    if (!screen) return;
    screen.append(el);
    const timer = later(() => { el.remove(); reactions.delete(step); }, 1450);
    reactions.set(step, { el, timer });
  };
  const reactionsByStep = ['that’s you.', 'good taste!', 'very you.', 'group chat energy.'];

  listen(how, 'click', (event) => {
    const control = event.target.closest?.('button, a, [role="button"]');
    const step = control?.closest('.step');
    if (!step || !how.contains(step) || !control.closest('.mini')) return;
    bounce(control);
    stamp(step, reactionsByStep[Number(step.dataset.step)] || 'nice.');
  });
  listen(how, 'input', (event) => {
    const field = event.target;
    const step = field.closest?.('.step');
    if (!step || !how.contains(step) || !field.closest('.mini')) return;
    const now = performance.now();
    if (now - (inputTimes.get(field) || -Infinity) < 650) return;
    inputTimes.set(field, now);
    bounce(field, true);
    stamp(step, field.matches('[data-name]') ? 'oh hey, you.' : 'make it yours.');
  });
  listen(safe, 'toggle', (event) => {
    const note = event.target;
    if (!note.matches?.('details.safe-note') || !note.open) return;
    bounce(note.querySelector('summary strong'), true);
  }, true);

  const cleanup = () => {
    if (closed) return;
    closed = true;
    listeners.forEach(remove => remove());
    timers.forEach(clearTimeout);
    animations.forEach(animation => animation.cancel());
    reactions.forEach(({ el }) => el.remove());
    timers.clear();
    animations.clear();
    reactions.clear();
    if (activeSections.get(key) === cleanup) activeSections.delete(key);
  };
  activeSections.set(key, cleanup);
  return cleanup;
}
