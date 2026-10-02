// A compact native-scrolling feed. It uses scroll snap and never captures wheel or touch input.
export function initPlayFeed(root) {
  if (!root) return () => {};
  const feed = root.querySelector('[data-play-feed]');
  const panels = [...root.querySelectorAll('[data-play-panel]')];
  const tabs = [...root.querySelectorAll('[data-play-tab]')];
  const previous = root.querySelector('[data-play-prev]');
  const next = root.querySelector('[data-play-next]');
  const live = root.querySelector('[data-play-live]');
  const caption = root.querySelector('[data-play-caption]');
  if (!feed || !panels.length) return () => {};

  const abort = new AbortController();
  const { signal } = abort;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = -1;
  let frame = 0;
  let settleTimer = 0;
  let closed = false;

  function select(index, announce = false) {
    const selected = Math.max(0, Math.min(panels.length - 1, index));
    if (selected === active) return;
    active = selected;
    panels.forEach((panel, panelIndex) => {
      const isActive = panelIndex === active;
      panel.classList.toggle('is-active', isActive);
      panel.inert = !isActive;
    });
    tabs.forEach((tab, tabIndex) => tab.setAttribute('aria-selected', String(tabIndex === active)));
    if (previous) previous.disabled = active === 0;
    if (next) next.disabled = active === panels.length - 1;
    const title = panels[active].querySelector('header h3')?.textContent?.trim() || `Item ${active + 1}`;
    if (caption) caption.textContent = `${String(active + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')} · ${title}`;
    if (announce && live) live.textContent = `${title}. Item ${active + 1} of ${panels.length}.`;
  }

  function closestPanel() {
    const rect = feed.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    return panels.reduce((nearest, panel, index) => {
      const panelRect = panel.getBoundingClientRect();
      const distance = Math.abs(panelRect.top + panelRect.height / 2 - midpoint);
      return distance < nearest.distance ? { index, distance } : nearest;
    }, { index: 0, distance: Infinity }).index;
  }

  function goTo(index, focus = false) {
    const target = Math.max(0, Math.min(panels.length - 1, index));
    const feedRect = feed.getBoundingClientRect();
    const panelRect = panels[target].getBoundingClientRect();
    feed.scrollTo({
      top: feed.scrollTop + panelRect.top - feedRect.top,
      behavior: reduced.matches ? 'auto' : 'smooth',
    });
    if (focus) feed.focus({ preventScroll: true });
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => select(target, true), reduced.matches ? 0 : 220);
  }

  function onScroll() {
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      if (!closed) select(closestPanel());
    });
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => { if (!closed) select(closestPanel(), true); }, 150);
  }

  previous?.addEventListener('click', () => goTo(active - 1, true), { signal });
  next?.addEventListener('click', () => goTo(active + 1, true), { signal });
  tabs.forEach((tab, index) => tab.addEventListener('click', () => goTo(index, true), { signal }));
  root.addEventListener('keydown', (event) => {
    if (event.target.closest('input, textarea, select, [contenteditable="true"], button:not([data-play-tab]):not([data-play-prev]):not([data-play-next])')) return;
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') goTo(0, true);
    else if (event.key === 'End') goTo(panels.length - 1, true);
    else goTo(active + (event.key === 'ArrowDown' ? 1 : -1), true);
  }, { signal });
  feed.addEventListener('scroll', onScroll, { passive: true, signal });
  feed.addEventListener('scrollend', () => select(closestPanel(), true), { signal });

  const resize = new ResizeObserver(() => {
    if (!closed && active >= 0) goTo(active);
  });
  resize.observe(feed);
  select(0);

  return () => {
    closed = true;
    abort.abort();
    resize.disconnect();
    cancelAnimationFrame(frame);
    window.clearTimeout(settleTimer);
  };
}
