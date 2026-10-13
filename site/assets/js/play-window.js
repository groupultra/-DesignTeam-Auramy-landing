// "Your people can play too" is one Auramy window. Scrolling into the section grows it from
// a small window to the whole screen; scrolling on moves through four friends' pages inside it
// (each in its own style), and the title bar + address bar follow whichever page you're on.
// At the end the window shrinks back to the small one before the next section.
// Reduced motion and very short screens get the same window as a plain, scrolling block.

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (x) => x * x * x * (x * (6 * x - 15) + 10);
// Hold the small window for a beat, then expand fast.
const growCurve = (g) => smooth(clamp((g - 0.12) / 0.72, 0, 1));

export function initPlayWindow(section) {
  const stage = section?.querySelector('.pw__stage');
  const scroller = section?.querySelector('[data-pw-scroll]');
  if (!stage || !scroller) return () => {};
  const win = section.querySelector('.pw__win');
  const chrome = section.querySelector('.pw__chrome');
  const titleEl = section.querySelector('[data-pw-title]');
  const urlEl = section.querySelector('[data-pw-url]');
  const iconEl = section.querySelector('[data-pw-icon]');
  const sites = [...scroller.querySelectorAll('[data-site]')];
  const fallback = matchMedia('(prefers-reduced-motion: reduce), (max-height: 520px)');
  const abort = new AbortController();
  const { signal } = abort;
  let runway = 0;
  let travel = 0;
  let viewH = 0;
  let chromeH = 0;
  let frame = 0;
  let current = -1;
  let loadTimer = 0;

  const pinned = () => section.dataset.pwMode === 'pin';

  function setSite(index) {
    if (index === current) return;
    current = index;
    const site = sites[index];
    titleEl.textContent = site.dataset.title;
    urlEl.textContent = site.dataset.url;
    iconEl.src = `/assets/img/av/${site.dataset.site}.jpg`;
    section.dataset.pwSite = site.dataset.site;
    chrome.classList.remove('is-loading');
    void chrome.offsetWidth;
    chrome.classList.add('is-loading');
    clearTimeout(loadTimer);
    loadTimer = setTimeout(() => chrome.classList.remove('is-loading'), 700);
  }

  function siteAt(y) {
    let index = 0;
    sites.forEach((site, i) => { if (site.offsetTop <= y + viewH * 0.45) index = i; });
    return index;
  }

  function update() {
    frame = 0;
    if (!pinned()) {
      const view = section.getBoundingClientRect();
      const probe = window.innerHeight * 0.45;
      let index = 0;
      sites.forEach((site, i) => { if (site.getBoundingClientRect().top <= probe) index = i; });
      if (view.bottom > 0 && view.top < window.innerHeight) setSite(index);
      return;
    }
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const scrolled = -section.getBoundingClientRect().top;
    // Grow over the first runway, stay full while the pages scroll, then shrink back over
    // the last runway (the same curve played backwards) before the section scrolls away.
    const outroStart = runway + travel;
    const g = scrolled < outroStart ? scrolled / runway : 1 - (scrolled - outroStart) / runway;
    const e = growCurve(clamp(g, 0, 1));
    // The small window: centred, sitting under the heading.
    const w0 = Math.min(560, W * 0.74);
    const h0 = Math.min(360, H * 0.4);
    const l0 = (W - w0) / 2;
    const t0 = Math.max(H * 0.38, (H - h0) * 0.6);
    const b0 = Math.max(0, H - t0 - h0);
    const k = 1 - e;
    const y = clamp(scrolled - runway, 0, travel);
    const t = t0 * k;
    win.style.setProperty('--t', `${t.toFixed(1)}px`);
    win.style.setProperty('--l', `${(l0 * k).toFixed(1)}px`);
    win.style.setProperty('--b', `${(b0 * k).toFixed(1)}px`);
    win.style.setProperty('--rad', `${(12 * k).toFixed(1)}px`);
    win.style.setProperty('--y', `${(t + chromeH - y).toFixed(1)}px`);
    section.style.setProperty('--h-o', clamp(1 - e * 1.6, 0, 1).toFixed(3));
    section.style.setProperty('--h-y', `${(-e * 60).toFixed(1)}px`);
    section.classList.toggle('is-full', e >= 0.999);
    // Inside the maximised window the page nav steps aside so the title bar is the top of the screen.
    document.documentElement.classList.toggle('is-in-window', e >= 0.999 && scrolled > 0 && scrolled < outroStart + runway);
    setSite(siteAt(y));
  }

  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

  function measure() {
    section.dataset.pwMode = fallback.matches ? 'static' : 'pin';
    if (!pinned()) {
      section.style.removeProperty('height');
      ['--t', '--l', '--b', '--rad', '--y', '--ch'].forEach((name) => win.style.removeProperty(name));
      section.style.removeProperty('--pw-view-h');
      section.classList.remove('is-full');
      document.documentElement.classList.remove('is-in-window');
      update();
      return;
    }
    const H = stage.clientHeight;
    chromeH = chrome.offsetHeight;
    viewH = H - chromeH;
    win.style.setProperty('--ch', `${chromeH}px`);
    section.style.setProperty('--pw-view-h', `${viewH}px`);
    travel = Math.max(0, scroller.offsetHeight - viewH);
    runway = H * 0.9;
    section.style.height = `${Math.round(H + runway * 2 + travel)}px`;
    update();
  }

  // Keyboard users: bring whatever got focus inside the window into view.
  scroller.addEventListener('focusin', (event) => {
    if (!pinned()) return;
    const box = event.target.getBoundingClientRect();
    if (box.top >= chromeH && box.bottom <= window.innerHeight) return;
    const y = clamp(box.top - scroller.getBoundingClientRect().top - viewH * 0.3, 0, travel);
    const top = window.scrollY + section.getBoundingClientRect().top + runway + y;
    window.scrollTo({ top, behavior: 'auto' });
  }, { signal });

  // Content height changes (notes pinned, scores, images) keep the scroll range honest.
  const resize = new ResizeObserver(() => { if (pinned()) measure(); });
  resize.observe(scroller);
  const seen = new IntersectionObserver(([entry]) => section.classList.toggle('is-visible', entry.isIntersecting));
  seen.observe(section);

  window.addEventListener('scroll', schedule, { passive: true, signal });
  window.addEventListener('resize', measure, { passive: true, signal });
  fallback.addEventListener('change', measure, { signal });
  measure();

  return () => {
    abort.abort();
    resize.disconnect();
    seen.disconnect();
    cancelAnimationFrame(frame);
    clearTimeout(loadTimer);
  };
}
