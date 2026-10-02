// A scroll-led, horizontal story. It observes normal page scroll; it never captures it.
const activeSections = new WeakMap();

export function initHowScroll(root) {
  if (!root) return () => {};
  const previous = activeSections.get(root);
  previous?.destroy?.();

  const stage = root.querySelector('[data-how-scroll-stage]');
  const rail = root.querySelector('[data-how-scroll-rail]');
  const steps = [...root.querySelectorAll('[data-how-step]')];
  const status = root.querySelector('[data-how-scroll-status]');
  if (!stage || !rail || steps.length < 2) return () => {};

  const abort = new AbortController();
  const { signal } = abort;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const shortLandscape = matchMedia('(max-height: 640px) and (orientation: landscape)');
  let frame = 0;
  let active = -1;
  let closed = false;

  root.style.setProperty('--how-step-count', steps.length);
  root.style.setProperty('--how-scroll-length', `${(steps.length - 1) * 82}svh`);

  function setActive(index) {
    const next = Math.max(0, Math.min(steps.length - 1, index));
    if (next === active) return;
    active = next;
    steps.forEach((step, stepIndex) => {
      const selected = stepIndex === active;
      step.classList.toggle('is-active', selected);
      step.setAttribute('aria-current', selected ? 'step' : 'false');
      step.inert = !staticMode() && !selected;
    });
    const indicator = root.querySelector('[data-how-scroll-progress]');
    if (indicator) indicator.setAttribute('aria-valuenow', String(active + 1));
    // Keep the live message terse so assistive tech only reports an actual step change.
    if (status) status.textContent = `Step ${active + 1} of ${steps.length}: ${steps[active].querySelector('h3')?.textContent?.trim() || ''}`;
  }

  function staticMode() {
    return reduced.matches || shortLandscape.matches || document.body.classList.contains('is-motion-paused');
  }

  function update() {
    frame = 0;
    if (closed) return;
    const staticLayout = staticMode();
    root.classList.toggle('is-how-static', staticLayout);
    if (staticLayout) {
      root.style.setProperty('--how-progress', '0');
      root.style.setProperty('--how-translate', '0%');
      active = -1;
      setActive(0);
      return;
    }
    const bounds = root.getBoundingClientRect();
    const range = Math.max(1, root.offsetHeight - stage.offsetHeight);
    const progress = Math.max(0, Math.min(1, -bounds.top / range));
    root.style.setProperty('--how-progress', progress.toFixed(4));
    root.style.setProperty('--how-translate', `${progress * -((steps.length - 1) / steps.length) * 100}%`);
    setActive(Math.min(steps.length - 1, Math.round(progress * (steps.length - 1))));
  }

  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function goToStep(index, behavior = staticMode() ? 'auto' : 'smooth') {
    const target = Math.max(0, Math.min(steps.length - 1, index));
    if (staticMode()) {
      steps[target].scrollIntoView({ behavior, block: 'start' });
      return;
    }
    const range = Math.max(1, root.offsetHeight - stage.offsetHeight);
    const top = scrollY + root.getBoundingClientRect().top + (range * target) / (steps.length - 1);
    scrollTo({ top, behavior });
  }

  addEventListener('scroll', requestUpdate, { passive: true, signal });
  addEventListener('resize', requestUpdate, { passive: true, signal });
  const refreshStaticLayout = () => { active = -1; requestUpdate(); };
  reduced.addEventListener?.('change', refreshStaticLayout, { signal });
  shortLandscape.addEventListener?.('change', refreshStaticLayout, { signal });
  document.addEventListener('auramy:motion-change', refreshStaticLayout, { signal });
  setActive(0);
  requestUpdate();

  const destroy = () => {
    if (closed) return;
    closed = true;
    abort.abort();
    cancelAnimationFrame(frame);
    root.style.removeProperty('--how-step-count');
    root.style.removeProperty('--how-scroll-length');
    root.style.removeProperty('--how-progress');
    root.style.removeProperty('--how-translate');
    root.classList.remove('is-how-static');
    steps.forEach((step) => { step.inert = false; step.classList.remove('is-active'); step.removeAttribute('aria-current'); });
    if (activeSections.get(root) === controller) activeSections.delete(root);
  };
  const controller = { goToStep, destroy };
  activeSections.set(root, controller);
  return controller;
}
