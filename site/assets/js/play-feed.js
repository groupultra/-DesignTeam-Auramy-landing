// Play uses the document's normal vertical scroll. The sticky frame is visual
// only: wheel, touch, PageDown, and focus keep their native browser behavior.
export function initPlayFeed(root) {
  if (!root) return () => {};
  const stage = root.querySelector('[data-play-feed]');
  const panels = [...root.querySelectorAll('[data-play-panel]')];
  const live = root.querySelector('[data-play-live]');
  const caption = root.querySelector('[data-play-caption]');
  if (!stage || !panels.length) return () => {};
  const abort = new AbortController();
  const { signal } = abort;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const shortViewport = matchMedia('(max-height: 640px)');
  let active = -1;
  let frame = 0;
  let closed = false;
  const staticMode = () => reduced.matches || shortViewport.matches || document.body.classList.contains('is-motion-paused');
  const stickyOffset = () => Number.parseFloat(getComputedStyle(stage).top) || 0;
  const panelRange = () => Math.max(1, root.offsetHeight - stage.offsetHeight - stickyOffset());
  const titleAt = (index) => panels[index].querySelector('header h3')?.textContent?.trim() || `Demo ${index + 1}`;
  const controlsFor = (panel) => [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
  const focusPanel = (index, last = false) => {
    const controls = controlsFor(panels[index]);
    (last ? controls.at(-1) : controls[0])?.focus({ preventScroll: true });
  };
  function setActive(index, announce = false) {
    const selected = Math.max(0, Math.min(panels.length - 1, index));
    const staticLayout = staticMode();
    root.classList.toggle('is-play-static', staticLayout);
    if (!staticLayout && selected === active) return;
    const focusedPanel = panels.findIndex((panel) => panel.contains(document.activeElement));
    active = selected;
    panels.forEach((panel, panelIndex) => {
      const visible = staticLayout || panelIndex === active;
      panel.classList.toggle('is-active', panelIndex === active);
      panel.setAttribute('aria-hidden', String(!visible));
      panel.inert = !visible;
    });
    const label = `${String(active + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')} · ${titleAt(active)}`;
    if (caption) caption.textContent = staticLayout ? 'all four demos are open below' : label;
    if (announce && live) live.textContent = `${titleAt(active)}. Demo ${active + 1} of ${panels.length}.`;
    if (!staticLayout && focusedPanel >= 0 && focusedPanel !== active) focusPanel(active);
    root.dispatchEvent(new CustomEvent('auramy:play-panelchange', { detail: { active, staticLayout } }));
  }
  function update() {
    frame = 0;
    if (closed) return;
    if (staticMode()) { setActive(0); return; }
    const bounds = root.getBoundingClientRect();
    const range = panelRange();
    const progress = Math.max(0, Math.min(1, -bounds.top / range));
    setActive(Math.min(panels.length - 1, Math.round(progress * (panels.length - 1))));
  }
  const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
  function goToPanel(index, last = false) {
    const target = Math.max(0, Math.min(panels.length - 1, index));
    const range = panelRange();
    const top = scrollY + root.getBoundingClientRect().top + range * target / (panels.length - 1);
    scrollTo({ top, behavior: 'auto' });
    setActive(target, true);
    focusPanel(target, last);
  }
  const refresh = () => { active = -1; requestUpdate(); };
  addEventListener('scroll', requestUpdate, { passive: true, signal });
  addEventListener('resize', refresh, { passive: true, signal });
  reduced.addEventListener?.('change', refresh, { signal });
  shortViewport.addEventListener?.('change', refresh, { signal });
  document.addEventListener('auramy:motion-change', refresh, { signal });
  stage.addEventListener('keydown', (event) => {
    if (staticMode() || event.key !== 'Tab') return;
    const panelIndex = panels.findIndex((panel) => panel.contains(event.target));
    if (panelIndex < 0) return;
    const controls = controlsFor(panels[panelIndex]);
    const atStart = event.target === controls[0];
    const atEnd = event.target === controls.at(-1);
    if (!event.shiftKey && atEnd && panelIndex < panels.length - 1) { event.preventDefault(); goToPanel(panelIndex + 1); }
    if (event.shiftKey && atStart && panelIndex > 0) { event.preventDefault(); goToPanel(panelIndex - 1, true); }
  }, { signal });
  setActive(0);
  requestUpdate();
  return () => { closed = true; abort.abort(); cancelAnimationFrame(frame); panels.forEach((panel) => { panel.inert = false; panel.removeAttribute('aria-hidden'); }); };
}
