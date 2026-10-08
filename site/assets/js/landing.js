import { auraFor, prefersReducedMotion } from './aura.js';
import { injectSprite, pic, blobAvatar } from './sprite.js';
import { renderHow, MIA } from './spaces.js';
import { mountHow } from './interact.js?v=calm-7';
import { PEOPLE, avatar } from './people.js';
import { renderMade } from './made.js';
import { initWorldsScroll } from './worlds-scroll.js?v=calm-7';
import { initScrollReveal } from './scroll-reveal.js?v=calm-7';
import { initHowScroll } from './how-scroll.js?v=calm-7';
import { initAlbumParty } from './album-party.js?v=calm-7';
import { renderHeroSitePreviews } from './site-previews.js';
import { initEndingScenes } from './ending-scenes.js?v=materials-8';

document.documentElement.classList.add('js');
injectSprite();

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduced = prefersReducedMotion();
const candy = ['#FF5FA2', '#FF8A3C', '#E8FF5A'];

/* Shared pause control for every decorative animation on the page. It is
   deliberately independent from the former raw hero effects, so pausing does
   not restore pointer tracking, glitching, or other ambient decoration. */
{
  const preferenceKey = 'auramy-motion-paused';
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const toggles = $$('[data-motion-toggle]');
  let userChoice = null;
  try {
    const saved = localStorage.getItem(preferenceKey);
    if (saved === 'true' || saved === 'false') userChoice = saved === 'true';
  } catch { /* storage can be unavailable */ }
  let paused = userChoice ?? systemMotion.matches;

  const syncMotion = () => {
    document.body.classList.toggle('is-motion-paused', paused);
    toggles.forEach((toggle) => {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'play motion' : 'pause motion';
      toggle.setAttribute('aria-label', paused ? 'Play decorative motion' : 'Pause decorative motion');
    });
    document.dispatchEvent(new CustomEvent('auramy:motion-change', { detail: { paused } }));
  };

  toggles.forEach((toggle) => toggle.addEventListener('click', () => {
    paused = !paused;
    userChoice = paused;
    try { localStorage.setItem(preferenceKey, String(paused)); } catch { /* storage can be unavailable */ }
    syncMotion();
  }));
  systemMotion.addEventListener?.('change', () => {
    if (userChoice !== null) return;
    paused = systemMotion.matches;
    syncMotion();
  });
  syncMotion();
}

const motionPaused = () => document.body.classList.contains('is-motion-paused');

// Ambient work runs only in a visible, active tab with motion enabled.
// User-started games opt out of the decorative-motion toggle.
function whileVisible(el, start, stop, threshold = 0.25, ambient = true) {
  let on = false, visible = false;
  const sync = () => {
    const next = visible && !document.hidden && (!ambient || !motionPaused());
    if (next && !on) { on = true; start(); }
    else if (!next && on) { on = false; stop?.(); }
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, { threshold });
  observer.observe(el);
  document.addEventListener('auramy:motion-change', sync);
  document.addEventListener('visibilitychange', sync);
  return () => {
    observer.disconnect();
    document.removeEventListener('auramy:motion-change', sync);
    document.removeEventListener('visibilitychange', sync);
    if (on) stop?.();
  };
}

/* ───────── static fills ───────── */
$$('[data-pic]').forEach((el) => (el.innerHTML = pic(el.dataset.pic)));
$$('[data-blob]').forEach((el) => (el.innerHTML = blobAvatar(['#8B6CFF', '#FF8FC0', '#5CE1E6'], { mood: 'wink' })));

/* ───────── reveal + nav ───────── */
const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))), { threshold: 0.15 });
$$('.reveal').forEach((el) => io.observe(el));

{
  const nav = $('#nav');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-hidden', y > 420 && y > lastY + 4);
    if (y < lastY - 4 || y < 420) nav.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });
}

const retrigger = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

// little glyphs that float up from an element (page-level, fixed position)
function pop(el, glyphs, color) {
  if (motionPaused() || document.hidden) return;
  const r = el.getBoundingClientRect();
  glyphs.forEach((g, i) => {
    const s = document.createElement('span');
    s.className = 'plus';
    s.textContent = g;
    if (color) s.style.color = color;
    s.style.left = `${r.left + r.width / 2 - 10 + (Math.random() - 0.5) * r.width * 0.4}px`;
    s.style.top = `${r.top + r.height * 0.3}px`;
    s.style.setProperty('--dx', `${(Math.random() - 0.5) * 90}px`);
    s.style.animationDelay = `${i * 60}ms`;
    document.body.append(s);
    setTimeout(() => s.remove(), 1200);
  });
}

/* ───────── toast ───────── */
const toastEl = $('#toast');
let toastT;
function toast(html, ms = 3200) {
  toastEl.innerHTML = html;
  toastEl.classList.add('is-on');
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove('is-on'), ms);
}

/* ───────── name preview + claim ───────── */
renderHeroSitePreviews($('.hero-collage'));
const heroPreview = $('#heroPreview');
const claimInputs = () => $$('[data-claim] input[name="handle"]');
function updatePreview(raw) {
  const name = raw.trim().slice(0, 16).toLowerCase() || 'mia';
  const { handle } = auraFor(raw.trim() || 'mia');
  $$('[data-preview-name]').forEach((el) => { el.textContent = name; });
  $$('[data-preview-handle], [data-live-handle]').forEach((el) => { el.textContent = handle; });
}
updatePreview(claimInputs()[0]?.value || '');
document.addEventListener('input', (event) => {
  const input = event.target.closest?.('[data-claim] input[name="handle"]');
  if (!input) return;
  claimInputs().forEach((other) => { if (other !== input) other.value = input.value; });
  updatePreview(input.value);
});
document.addEventListener('submit', (e) => {
  const form = e.target.closest?.('[data-claim]');
  if (!form) return;
  e.preventDefault();
  const input = $('input', form);
  const value = input.value.trim();
  if (!value) {
    retrigger(form, 'is-shake');
    input.focus();
    return;
  }
  updatePreview(value);
  const { handle } = auraFor(value);
  toast(`Preview ready for <b>${handle}</b> — name claiming is coming soon.`, 4800);
});

if (heroPreview) {
  const themes = ['lime', 'pink', 'blue'];
  const remix = $('[data-preview-theme]');
  let theme = Math.max(0, themes.indexOf(heroPreview.dataset.theme));
  heroPreview.dataset.theme = themes[theme];
  const labelRemix = () => remix?.setAttribute('aria-label', `Remix preview. Current color: ${themes[theme]}.`);
  labelRemix();
  remix?.addEventListener('click', () => {
    theme = (theme + 1) % themes.length;
    heroPreview.dataset.theme = themes[theme];
    labelRemix();
    if (!reduced && !document.body.classList.contains('is-motion-paused') && !document.hidden) {
      heroPreview.animate(
        [{ scale: 1 }, { scale: 1.025 }, { scale: 1 }],
        { duration: 360, easing: 'cubic-bezier(.34,1.56,.64,1)' },
      );
    }
  });
}

/* A deliberately bounded, explicit remix control. It never starts ambient
   glitching or movement; it only swaps the hero's quiet color wash. */
{
  const remix = $('[data-chaos]');
  const hero = $('.raw-hero');
  const mood = $('[data-mood-stamp]');
  remix?.addEventListener('click', () => {
    const remixed = hero?.dataset.remixed !== 'true';
    if (hero) hero.dataset.remixed = String(remixed);
    if (mood) mood.textContent = remixed ? 'soft remix, still you.' : 'posting this anyway.';
    remix.setAttribute('aria-pressed', String(remixed));
  });
}

/* ───────── scroll-led reveal + scrappy section details ───────── */
initScrollReveal($('#vs'));

/* ───────── how it works: four inline, playable steps ───────── */
{
  const steps = $$('[data-how-step]');
  const howRoot = $('#how');
  const howScroll = initHowScroll(howRoot);
  const next = (i) => {
    const behavior = reduced ? 'auto' : 'smooth';
    howScroll.goToStep(i < steps.length - 1 ? i + 1 : 0, behavior);
  };
  $$('[data-how-panel]').forEach((mini) => {
    const step = mini.closest('[data-how-step]');
    mini.innerHTML = renderHow(mini.dataset.screen);
    mountHow(mini.dataset.screen, $('.sp', mini), () => next(+step.dataset.step));
  });
  const nameInput = $('[data-how-panel][data-screen="hi"] [data-name]');
  const sharePanel = $('[data-how-panel][data-screen="share"]');
  const syncShareIdentity = () => {
    const name = nameInput?.value.trim() || 'mia';
    const aura = auraFor(name);
    const handle = aura?.handle || 'mia';
    $('.bub--card .og b', sharePanel).textContent = name.toLowerCase();
    $('.bub--card .bub__meta b', sharePanel).textContent = `${name.toLowerCase()}'s space`;
    $('.bub--card .bub__meta span', sharePanel).textContent = `aura.my/${handle} · tap to open`;
  };
  nameInput?.addEventListener('input', syncShareIdentity);
  syncShareIdentity();
  // All four screens stay mounted, and this small snapshot also lets a reload
  // keep the name, picks, and in-progress answers from the same browser tab.
  const howStateKey = 'auramy-how-session-v1';
  const snapshot = () => Object.fromEntries($$('[data-how-panel]').map((panel) => [panel.dataset.screen, {
    fields: $$('input', panel).map((field) => field.value),
    pressed: $$('[aria-pressed]', panel).map((button) => button.getAttribute('aria-pressed') === 'true'),
    selected: $$('button', panel).map((button) => button.classList.contains('on')),
  }]));
  const persist = () => { try { sessionStorage.setItem(howStateKey, JSON.stringify(snapshot())); } catch { /* private browsing */ } };
  try {
    const saved = JSON.parse(sessionStorage.getItem(howStateKey) || '{}');
    $$('[data-how-panel]').forEach((panel) => {
      const state = saved[panel.dataset.screen];
      if (!state) return;
      $$('input', panel).forEach((field, index) => {
        if (typeof state.fields?.[index] !== 'string') return;
        field.value = state.fields[index];
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      $$('button', panel).forEach((button, index) => {
        if (state.selected?.[index] && !button.classList.contains('on')) button.click();
        const pressed = state.pressed?.[$$('[aria-pressed]', panel).indexOf(button)];
        if (pressed && button.getAttribute('aria-pressed') !== 'true' && !button.classList.contains('on')) button.click();
      });
    });
  } catch { /* malformed or unavailable session data */ }
  howRoot.addEventListener('input', persist);
  howRoot.addEventListener('click', () => queueMicrotask(persist));
}

/* ───────── worlds: a normal, vertically scrolling collection ───────── */
initWorldsScroll($('#spaces'));
initAlbumParty($('#albumParty'));
initEndingScenes($('#notify'));

/* ───────── made by actual humans ───────── */
{
  const row = $('[data-made]');
  renderMade(row);
}

/* One-time entrance beats only for fresh content, never as background motion. */
{
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = $$(' .reveal .stamp, .reveal .h2, .reveal .h2 em, .how-handheld__head .stamp, .how-handheld__head .h2, .worlds-section__head .worlds-section__eyebrow, .worlds-section__head .worlds-section__title, #made .made-card');
  const pending = new Set(targets);
  const run = (element) => {
    if (!pending.has(element) || reducedMotion.matches || motionPaused() || document.hidden) return false;
    pending.delete(element);
    element.classList.add('motion-candy--in');
    return true;
  };
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting && run(entry.target)) observer.unobserve(entry.target);
  }), { threshold: .2 });
  targets.forEach((target) => observer.observe(target));
  const retry = () => pending.forEach((target) => {
    const rect = target.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < innerHeight) run(target);
  });
  document.addEventListener('visibilitychange', retry);
  document.addEventListener('auramy:motion-change', retry);
  reducedMotion.addEventListener?.('change', retry);
}

/* ───────── social proof faces ───────── */
$$('[data-faces]').forEach((el) => (el.innerHTML = Object.keys(PEOPLE).map((k) => avatar(k)).join('')));

/* ───────── squish (jelly blob physics) ───────── */
{
  const root = $('#squish');
  const svg = $('svg', root);
  const body = $('.squish__body', svg);
  const faceG = $('.squish__face', svg);
  const countEl = $('[data-squish-count]');
  const statusEl = $('[data-squish-status]');
  const N = 30, C = { x: 150, y: 150 }, R = 104;
  const pts = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    // gumdrop: wider at the bottom, domed top
    const sx = 1 + 0.08 * Math.sin(a), sy = a > 0 && a < Math.PI ? 0.9 : 1;
    const rx = C.x + Math.cos(a) * R * sx, ry = C.y + 10 + Math.sin(a) * R * sy;
    return { rx, ry, x: rx, y: ry, vx: 0, vy: 0, tx: rx, ty: ry };
  });
  // the face is lu's photo (a pattern on the body); only the jelly gloss sits on top
  const gloss = '<ellipse cx="-38" cy="-52" rx="13" ry="7" transform="rotate(-35 -38 -52)" fill="#fff" fill-opacity=".45"/>';
  const faces = { idle: gloss, squish: gloss };
  const lines = ['oof', 'hey!', 'ok rude', '😳', 'again??', 'my face!!', 'i felt that', '🫠'];
  let squishes = 0, down = null, raf = 0, last = 0;
  let face = 'idle';
  faceG.innerHTML = faces.idle;

  const toSvg = (e) => {
    const r = svg.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 300, y: ((e.clientY - r.top) / r.height) * 300 };
  };
  function pathFrom(p) {
    let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
    for (let i = 0; i < p.length; i++) {
      const p0 = p[(i - 1 + p.length) % p.length], p1 = p[i], p2 = p[(i + 1) % p.length], p3 = p[(i + 2) % p.length];
      d += `C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d + 'Z';
  }
  function setTargets(ptr) {
    if (!down) { pts.forEach((p) => { p.tx = p.rx; p.ty = p.ry; }); return; }
    const dx = ptr.x - down.x, dy = ptr.y - down.y;
    pts.forEach((p) => {
      const d = Math.hypot(p.rx - down.x, p.ry - down.y);
      const w = Math.exp(-(d * d) / (2 * 60 * 60));
      // dent toward centre near the finger, bulge elsewhere (fake volume)
      const ux = (C.x - p.rx) / R, uy = (C.y - p.ry) / R;
      const press = 30 * w - 9 * (1 - w);
      p.tx = p.rx + ux * press + dx * w * 0.9;
      p.ty = p.ry + uy * press + dy * w * 0.9 + (1 - w) * 4;
    });
  }
  function tick(t) {
    const dt = Math.min(0.033, (t - last) / 1000 || 0.016);
    last = t;
    let energy = 0;
    pts.forEach((p) => {
      const ax = -210 * (p.x - p.tx) - 9 * p.vx, ay = -210 * (p.y - p.ty) - 9 * p.vy;
      p.vx += ax * dt; p.vy += ay * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      energy += Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.x - p.tx) + Math.abs(p.y - p.ty);
    });
    body.setAttribute('d', pathFrom(pts));
    const cx = pts.reduce((s, p) => s + p.x, 0) / N, cy = pts.reduce((s, p) => s + p.y, 0) / N;
    const top = Math.min(...pts.map((p) => p.y)), bot = Math.max(...pts.map((p) => p.y));
    const sq = clamp((bot - top) / (R * 1.9), 0.6, 1.3);
    faceG.setAttribute('transform', `translate(${cx.toFixed(1)} ${(cy + 4).toFixed(1)}) scale(${(1 / sq).toFixed(3)} ${sq.toFixed(3)})`);
    if (down || energy > 1.5) raf = requestAnimationFrame(tick);
    else raf = 0;
  }
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  const setFace = (f) => {
    if (f === face) return;
    face = f;
    faceG.innerHTML = faces[f];
  };
  function say(e) {
    const s = document.createElement('span');
    s.className = 'plus';
    s.textContent = lines[squishes % lines.length];
    s.style.left = `${e.clientX}px`; s.style.top = `${e.clientY - 30}px`;
    s.style.setProperty('--dx', `${(Math.random() - 0.5) * 60}px`);
    document.body.append(s);
    setTimeout(() => s.remove(), 1000);
  }
  function squish(point, event) {
    down = point;
    setTargets(down); setFace('squish'); kick();
    squishes++; countEl.textContent = 14 + squishes;
    statusEl.textContent = `Lu has been squished ${14 + squishes} times today.`;
    say(event);
  }
  root.addEventListener('pointerdown', (e) => {
    root.setPointerCapture(e.pointerId);
    squish(toSvg(e), e);
  });
  root.addEventListener('pointermove', (e) => { if (down) { setTargets(toSvg(e)); kick(); } });
  const up = () => { down = null; setTargets(); setFace('idle'); kick(); };
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', up);
  root.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    const rect = root.getBoundingClientRect();
    const center = { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
    squish(toSvg(center), center);
    setTimeout(up, 90);
  });
  tick(performance.now());
}

/* ───────── timing game ───────── */
{
  const root = $('#tgame');
  const marker = $('.tgame__marker', root);
  const track = $('.tgame__track', root);
  const zone = $('.tgame__zone:not(.tgame__zone--perfect)', root);
  const perfect = $('.tgame__zone--perfect', root);
  const scoreEl = $('[data-score]', root);
  const msg = $('[data-msg]', root);
  const board = $('[data-board]', root);
  const base = [{ n: 'noah', s: 345 }, { n: 'mia', s: 320 }, { n: 'jay', s: 290 }, { n: 'lu', s: 150 }];
  let you = 0, running = false, score = 0, speed = 1.6, zw = 24, pw = 6, zc = 50, phase = 0, raf = 0, last = 0, pos = 0;
  const cheers = ['clean.', 'ok pro', 'again!', 'locked in', 'too easy?', '🔥🔥'];

  const drawBoard = () => {
    const rows = [...base, ...(you ? [{ n: 'you', s: you, me: true }] : [])].sort((a, b) => b.s - a.s).slice(0, 5);
    const face = (n) => PEOPLE[n] ? avatar(n, 'board__av') : `<span class="board__av board__av--blob">${blobAvatar(n === 'you' ? ['#E8FF5A', '#5CE1E6', '#8B6CFF'] : candy, { id: 'bd' + n })}</span>`;
    board.innerHTML = rows.map((r) => `<li class="${r.me ? 'is-you' : ''}"><span class="board__who">${face(r.n)}<b>${r.n}</b></span><span>${r.s}</span></li>`).join('');
  };
  const setZone = () => {
    zone.style.setProperty('--zw', `${zw}%`);
    perfect.style.setProperty('--pw2', `${pw}%`);
    zone.style.left = `calc(${zc}% - ${zw / 2}%)`;
    perfect.style.left = `calc(${zc}% - ${pw / 2}%)`;
  };
  drawBoard(); setZone();

  const loop = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    if (running || !motionPaused()) phase += dt * speed * (running ? 1 : 0.55);
    pos = (Math.sin(phase) + 1) / 2;
    marker.style.transform = `translateX(${pos * track.clientWidth}px)`;
    raf = requestAnimationFrame(loop);
  };
  whileVisible(root, () => { last = performance.now(); raf = requestAnimationFrame(loop); }, () => cancelAnimationFrame(raf), 0.25, false);

  const flash = (cls) => { root.classList.remove('is-hit', 'is-miss'); void root.offsetWidth; root.classList.add(cls); };
  function press() {
    if (!running) {
      running = true; score = 0; speed = 2.2; zw = 24; pw = 6; zc = 50;
      scoreEl.textContent = 0; setZone();
      msg.textContent = 'go go go';
      return;
    }
    const p = pos * 100;
    if (Math.abs(p - zc) <= zw / 2) {
      const isPerfect = Math.abs(p - zc) <= pw / 2;
      score += isPerfect ? 25 : 10;
      scoreEl.textContent = score;
      msg.textContent = isPerfect ? 'perfect ✦ +25' : cheers[Math.floor(Math.random() * cheers.length)];
      speed *= 1.1; zw = Math.max(9, zw - 1.6); pw = Math.max(3, pw - 0.3);
      zc = 25 + Math.random() * 50;
      setZone(); flash('is-hit');
    } else {
      running = false;
      flash('is-miss');
      you = Math.max(you, score);
      drawBoard();
      msg.textContent = score > 345 ? `${score}! new high score. noah is shaking.` : score > 320 ? `${score} — you passed mia. noah's next.` : score > 0 ? `${score}. so close. tap to go again` : 'oops. tap to try again';
    }
  }
  root.addEventListener('pointerdown', (e) => { e.preventDefault(); press(); });
  root.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); press(); } });
}

/* ───────── sticky-note wall ───────── */
{
  const wall = $('#wall');
  const form = $('[data-wall-form]');
  const colors = ['#FFE45C', '#FFB3D1', '#B5E8FF', '#C8F59A', '#E3D4FF'];
  const seed = [
    { t: 'ur playlist saved my week', by: 'jay' },
    { t: 'rematch. tonight.', by: 'noah' },
    { t: 'this photo is the main character', by: 'lu' },
  ];
  let mine = [];
  try { mine = JSON.parse(localStorage.getItem('auramy-wall') || '[]').slice(-4); } catch { mine = []; }
  let n = 0;
  let dragging = false;
  let ambientTimer = 0;
  let ambientArrivals = 0;
  let wallVisible = false;
  let pageActive = true;
  const wallReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const friendNotes = [
    { t: 'your newest song is stuck in my head', by: 'ava' },
    { t: 'the guestbook is getting dangerously good', by: 'zara' },
    { t: 'ok but where did you get that photo?', by: 'eli' },
  ];
  const slot = (i) => {
    const W = wall.clientWidth, H = wall.clientHeight;
    const cols = Math.max(2, Math.floor(W / 140));
    const col = i % cols, row = Math.floor(i / cols) % 2;
    const cw = (W - 140) / Math.max(1, cols - 1);
    return { x: clamp(col * cw + (Math.random() - 0.5) * 18, 4, W - 138), y: clamp(14 + row * (H / 2 - 20) + (Math.random() - 0.5) * 24, 6, H - 120) };
  };
  const add = (note, isNew = false) => {
    const el = document.createElement('p');
    el.className = 'wnote' + (isNew ? ' is-new' : '');
    el.style.setProperty('--c', colors[n % colors.length]);
    el.style.setProperty('--r', `${(Math.random() - 0.5) * 12}deg`);
    const { x, y } = slot(n);
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    el.textContent = note.t;
    const by = document.createElement('span');
    by.className = 'wnote__by';
    by.innerHTML = avatar(note.by, 'wnote__av');
    by.append(`— ${note.by}`);
    el.append(by);
    wall.append(el);
    n++;
    dragInWall(el);
    const all = $$('.wnote', wall);
    if (all.length > 7) all[0].remove();
  };
  // notes can be pushed around; a still tap makes them wiggle
  let z = 1;
  function dragInWall(el) {
    let id = null, sx, sy, ox, oy, moved;
    el.addEventListener('pointerdown', (e) => {
      id = e.pointerId; dragging = true; syncAmbientNote(); el.setPointerCapture(id); moved = false;
      sx = e.clientX; sy = e.clientY; ox = el.offsetLeft; oy = el.offsetTop;
      el.style.zIndex = ++z;
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      moved = true; el.classList.add('is-grab');
      el.style.left = `${clamp(ox + dx, -20, wall.clientWidth - el.offsetWidth + 20)}px`;
      el.style.top = `${clamp(oy + dy, -10, wall.clientHeight - el.offsetHeight + 10)}px`;
    });
    const up = (e) => { if (e.pointerId !== id) return; id = null; dragging = false; syncAmbientNote(); el.classList.remove('is-grab'); if (!moved) retrigger(el, 'is-wiggle'); };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  }
  requestAnimationFrame(() => [...seed, ...mine].forEach((x) => add(x)));
  const canAddAmbient = () => pageActive && wallVisible && !document.hidden && !motionPaused()
    && !wallReducedMotion.matches && !dragging && !form.contains(document.activeElement);
  function syncAmbientNote() {
    clearTimeout(ambientTimer);
    ambientTimer = 0;
    if (!canAddAmbient() || ambientArrivals >= friendNotes.length) return;
    ambientTimer = setTimeout(() => {
      ambientTimer = 0;
      if (!canAddAmbient()) return;
      add(friendNotes[ambientArrivals++], true);
      syncAmbientNote();
    }, 1300 + Math.round(Math.random() * 400));
  }
  const wallObserver = new IntersectionObserver(([entry]) => {
    wallVisible = entry.isIntersecting;
    syncAmbientNote();
  }, { threshold: .35 });
  wallObserver.observe(wall);
  document.addEventListener('visibilitychange', syncAmbientNote);
  document.addEventListener('auramy:motion-change', syncAmbientNote);
  wallReducedMotion.addEventListener?.('change', syncAmbientNote);
  window.addEventListener('pagehide', () => {
    pageActive = false;
    syncAmbientNote();
  });
  window.addEventListener('pageshow', () => {
    pageActive = true;
    const rect = wall.getBoundingClientRect();
    wallVisible = rect.bottom > 0 && rect.top < innerHeight;
    syncAmbientNote();
  });
  form.addEventListener('focusin', syncAmbientNote);
  form.addEventListener('focusout', () => setTimeout(syncAmbientNote, 0));
  // keep notes on the wall if the layout changes (rotation, resize)
  addEventListener('resize', () => $$('.wnote', wall).forEach((el) => {
    el.style.left = `${clamp(el.offsetLeft, 4, Math.max(4, wall.clientWidth - el.offsetWidth - 4))}px`;
    el.style.top = `${clamp(el.offsetTop, 6, Math.max(6, wall.clientHeight - el.offsetHeight - 6))}px`;
  }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('input', form);
    const t = inp.value.trim();
    if (!t) { inp.focus(); return; }
    const note = { t, by: 'you' };
    add(note, true);
    mine = [...mine, note].slice(-4);
    try { localStorage.setItem('auramy-wall', JSON.stringify(mine)); } catch { /* storage unavailable */ }
    inp.value = '';
    syncAmbientNote();
  });
}

/* ───────── aura orb ───────── */
{
  const orb = $('#orb');
  const num = $('[data-aura-count]');
  let val = 0, target = 12480, counted = false;
  const fmt = (v) => Math.round(v).toLocaleString('en-US');
  whileVisible(orb, () => {
    if (counted) return;
    counted = true;
    if (reduced || motionPaused()) { val = target; num.textContent = fmt(val); return; }
    const t0 = performance.now();
    const step = (t) => {
      if (motionPaused() || document.hidden) { val = target; num.textContent = fmt(val); return; }
      const k = Math.min(1, (t - t0) / 1600);
      val = target * (1 - (1 - k) ** 3);
      num.textContent = fmt(val);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  orb.addEventListener('click', (e) => {
    const add = [5, 10, 20, 25, 50][Math.floor(Math.random() * 5)];
    target += add; val = target; num.textContent = fmt(val);
    if (motionPaused() || document.hidden) return;
    const s = document.createElement('span');
    s.className = 'plus';
    s.textContent = `+${add} ✦`;
    const rect = orb.getBoundingClientRect();
    const x = e.detail ? e.clientX : rect.left + rect.width / 2;
    const y = e.detail ? e.clientY : rect.top + rect.height / 2;
    s.style.left = `${x - 20}px`; s.style.top = `${y - 20}px`;
    s.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
    document.body.append(s);
    setTimeout(() => s.remove(), 1000);
  });

  // the shop actually spends aura
  $$('[data-buy]').forEach((b) => b.addEventListener('click', () => {
    const price = +b.dataset.buy;
    if (b.classList.contains('is-owned')) { toast(`already yours ✦ <b>${b.dataset.name}</b>`); return; }
    if (target < price) { retrigger(b, 'is-shake'); toast('need more aura — tap the orb ✦'); return; }
    const from = target;
    target -= price; val = target;
    const t0 = performance.now();
    const step = (t) => {
      if (motionPaused() || document.hidden) { num.textContent = fmt(target); return; }
      const k = Math.min(1, (t - t0) / 600);
      num.textContent = fmt(from - price * (1 - (1 - k) ** 3));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    b.classList.add('is-owned');
    $('b', b).textContent = 'yours';
    pop(b, ['✦', '✧', '★', '✦']);
    toast(`✦ unlocked <b>${b.dataset.name}</b>`);
  }));
}

/* ───────── stickers & badges ───────── */
$$('.sticker-card, .badge').forEach((el) => el.addEventListener('click', () => { retrigger(el, 'is-wiggle'); pop(el, ['✦', '♡']); }));

/* ───────── eyes follow the pointer ───────── */
{
  let px = -1, py = -1, raf = 0;
  const look = () => {
    raf = 0;
    $$('[data-look] .eyes').forEach((g) => {
      const r = g.ownerSVGElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || !r.width) return;
      const dx = clamp((px - (r.left + r.width / 2)) / 260, -1, 1), dy = clamp((py - (r.top + r.height / 2)) / 260, -1, 1);
      g.setAttribute('transform', `translate(${(dx * 6).toFixed(2)} ${(dy * 4).toFixed(2)})`);
    });
  };
  addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(look); }, { passive: true });
}

console.info('%c✦ auramy', 'font: 800 20px sans-serif; color: #ff5fa2', '— a website with your aura. hi, curious one.', MIA.url);
