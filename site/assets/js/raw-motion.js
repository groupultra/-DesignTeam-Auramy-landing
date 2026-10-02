/** Small, bounded hero effects. CSS owns the artwork and idle animation. */
export function initRawMotion() {
  const hero = document.querySelector('.raw-hero');
  const toggles = [...document.querySelectorAll('[data-motion-toggle]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const abort = new AbortController();
  const { signal } = abort;
  const stamps = ['main character loading…', 'too much? good.', 'posting this anyway.'];
  const stamp = hero?.querySelector('[data-mood-stamp]');
  let paused = motion.matches;
  let visible = false;
  let destroyed = false;
  let pointerFrame = 0;
  let chaosTimer = 0;
  let pointerX = 0;
  let pointerY = 0;
  let mood = -1;

  const awake = () => Boolean(hero && visible && !paused && !document.hidden && !destroyed);
  function resetPointer() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    pointerX = 0;
    pointerY = 0;
    hero?.style.setProperty('--pointer-x', '0');
    hero?.style.setProperty('--pointer-y', '0');
  }
  function clearChaos() {
    clearTimeout(chaosTimer);
    chaosTimer = 0;
    hero?.classList.remove('is-chaos');
  }
  function syncAwake() {
    if (hero) hero.dataset.awake = String(awake());
    if (!awake()) { resetPointer(); clearChaos(); }
  }
  function syncMotion() {
    document.body.classList.toggle('is-motion-paused', paused);
    toggles.forEach((toggle) => {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'play motion' : 'pause motion';
      toggle.setAttribute('aria-label', paused ? 'Play decorative motion' : 'Pause decorative motion');
    });
    syncAwake();
    document.dispatchEvent(new CustomEvent('auramy:motion-change', { detail: { paused } }));
  }
  function chaos() {
    if (!hero || document.hidden) return;
    mood = (mood + 1) % stamps.length;
    if (stamp) stamp.textContent = stamps[mood];
    if (!awake()) return;
    clearChaos();
    // The effect stays local to decorative hero elements; its duration is bounded.
    void hero.offsetWidth;
    hero.classList.add('is-chaos');
    chaosTimer = setTimeout(clearChaos, 700);
  }

  toggles.forEach((toggle) => toggle.addEventListener('click', () => {
    paused = !paused;
    syncMotion();
  }, { signal }));
  motion.addEventListener('change', () => {
    paused = motion.matches;
    syncMotion();
  }, { signal });
  finePointer.addEventListener('change', () => {
    if (!finePointer.matches) resetPointer();
  }, { signal });
  document.addEventListener('visibilitychange', syncAwake, { signal });

  let observer;
  if (hero) {
    hero.querySelectorAll('[data-chaos], [data-preview-theme]').forEach((button) => {
      button.addEventListener('click', chaos, { signal });
    });
    hero.addEventListener('pointermove', (event) => {
      if (!awake() || !finePointer.matches || event.pointerType !== 'mouse') return;
      const bounds = hero.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointerX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      pointerY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        if (!awake() || !finePointer.matches) return;
        hero.style.setProperty('--pointer-x', pointerX.toFixed(4));
        hero.style.setProperty('--pointer-y', pointerY.toFixed(4));
      });
    }, { passive: true, signal });
    hero.addEventListener('pointerleave', resetPointer, { signal });
    hero.addEventListener('pointercancel', resetPointer, { signal });
    observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0;
      syncAwake();
    }, { threshold: 0.01 });
    observer.observe(hero);
  }
  syncMotion();

  return () => {
    destroyed = true;
    abort.abort();
    observer?.disconnect();
    clearChaos();
    resetPointer();
    if (hero) hero.dataset.awake = 'false';
  };
}
