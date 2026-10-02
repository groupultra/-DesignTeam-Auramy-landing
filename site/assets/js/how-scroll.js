// A single handheld phone that swaps setup screens in place. The page stays a
// normal document: progression always comes from an explicit button or CTA.
const activeSections = new WeakMap();
const SESSION_KEY = 'auramy-how-step';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function readStep(total) {
  try { return clamp(Number(sessionStorage.getItem(SESSION_KEY)) || 0, 0, total - 1); }
  catch { return 0; }
}

export function initHowScroll(root) {
  if (!root) return { goToStep() {}, destroy() {} };
  activeSections.get(root)?.destroy?.();
  const panels = [...root.querySelectorAll('[data-how-panel]')];
  const previous = root.querySelector('[data-how-back]');
  const next = root.querySelector('[data-how-next]');
  const number = root.querySelector('[data-how-number]');
  const title = root.querySelector('[data-how-step-title]');
  const copy = root.querySelector('[data-how-step-copy]');
  const progress = root.querySelector('[data-how-scroll-progress]');
  const status = root.querySelector('[data-how-scroll-status]');
  if (!panels.length) return { goToStep() {}, destroy() {} };

  const abort = new AbortController();
  const { signal } = abort;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const shortViewport = matchMedia('(max-height: 640px)');
  let active = -1;
  let pressTimer = 0;
  let transitionTimer = 0;
  const isStill = () => reduced.matches || document.body.classList.contains('is-motion-paused');
  const copyFor = (panel) => ({
    number: String(Number(panel.dataset.step) + 1).padStart(2, '0'),
    title: panel.dataset.screen === 'hi' ? 'say hi.' : panel.dataset.screen === 'faves' ? 'dump your obsessions.' : panel.dataset.screen === 'ask' ? 'overshare a little.' : 'drop the link.',
    text: panel.dataset.screen === 'hi' ? 'name. face. questionable selfie.' : panel.dataset.screen === 'faves' ? 'the stuff living rent-free in your head.' : panel.dataset.screen === 'ask' ? 'weird answers encouraged.' : 'send it. let the group chat do its thing.',
  });
  function tapHand() {
    if (isStill()) return;
    root.classList.remove('is-how-press');
    void root.offsetWidth;
    root.classList.add('is-how-press');
  }
  function popBursts() {
    if (isStill()) return;
    root.classList.remove('is-how-pop');
    void root.offsetWidth;
    root.classList.add('is-how-pop');
  }
  function setActive(index, announce = false) {
    const selected = clamp(index, 0, panels.length - 1);
    if (selected === active) return;
    active = selected;
    const details = copyFor(panels[active]);
    root.dataset.howStep = String(active + 1);
    root.classList.toggle('is-how-short', shortViewport.matches);
    panels.forEach((panel, panelIndex) => {
      const visible = panelIndex === active;
      panel.classList.toggle('is-active', visible);
      panel.setAttribute('aria-hidden', String(!visible));
      panel.inert = !visible;
    });
    if (number) number.textContent = details.number;
    if (title) title.textContent = details.title;
    if (copy) copy.textContent = details.text;
    if (progress) { progress.setAttribute('aria-valuenow', String(active + 1)); progress.textContent = `step ${active + 1} of ${panels.length}`; }
    if (previous) previous.disabled = active === 0;
    if (next) next.textContent = active === panels.length - 1 ? 'restart ↺' : 'next →';
    if (announce && status) status.textContent = `Step ${active + 1} of ${panels.length}: ${details.title}`;
    try { sessionStorage.setItem(SESSION_KEY, String(active)); } catch { /* private browsing */ }
  }
  function focusNewScreen(trigger) {
    if (!trigger?.closest?.('[data-how-panel]')) return;
    panels[active].querySelector('input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')?.focus({ preventScroll: true });
  }
  function goToStep(index, behavior = 'auto') {
    const selected = clamp(index, 0, panels.length - 1);
    if (selected === active) return;
    const trigger = document.activeElement;
    window.clearTimeout(transitionTimer);
    window.clearTimeout(pressTimer);
    if (behavior !== 'auto' && !isStill()) {
      tapHand();
      transitionTimer = window.setTimeout(() => {
        setActive(selected, true);
        focusNewScreen(trigger);
        root.classList.remove('is-how-press');
        popBursts();
      }, 150);
      return;
    }
    setActive(selected, true);
    focusNewScreen(trigger);
    popBursts();
  }
  previous?.addEventListener('click', () => goToStep(active - 1, 'smooth'), { signal });
  next?.addEventListener('click', () => goToStep(active === panels.length - 1 ? 0 : active + 1, 'smooth'), { signal });
  const refresh = () => root.classList.toggle('is-how-short', shortViewport.matches);
  reduced.addEventListener?.('change', refresh, { signal });
  shortViewport.addEventListener?.('change', refresh, { signal });
  document.addEventListener('auramy:motion-change', refresh, { signal });
  setActive(readStep(panels.length));
  const controller = { goToStep, destroy() { abort.abort(); window.clearTimeout(pressTimer); window.clearTimeout(transitionTimer); panels.forEach((panel) => { panel.inert = false; panel.removeAttribute('aria-hidden'); panel.classList.remove('is-active'); }); root.classList.remove('is-how-press', 'is-how-pop', 'is-how-short'); activeSections.delete(root); } };
  activeSections.set(root, controller);
  return controller;
}
