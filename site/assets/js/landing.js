import { auraFor, prefersReducedMotion } from './aura.js';
import { injectSprite, pic, blobAvatar } from './sprite.js';
import { renderSpace, renderHow, NOTIFS, MIA } from './spaces.js';
import { mountSpace, mountHow } from './interact.js';
import { songArt, vinyl } from './covers.js';
import { PEOPLE, avatar } from './people.js';
import { renderMade, LIVE } from './made.js';

document.documentElement.classList.add('js');
injectSprite();

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduced = prefersReducedMotion();
const candy = ['#FF5FA2', '#FF8A3C', '#E8FF5A'];

// Run fn while el is on screen; stop it when it scrolls away.
function whileVisible(el, start, stop, threshold = 0.25) {
  let on = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !on) { on = true; start(); }
    else if (!e.isIntersecting && on) { on = false; stop?.(); }
  }, { threshold }).observe(el);
}

/* ───────── static fills ───────── */
$$('[data-pic]').forEach((el) => (el.innerHTML = pic(el.dataset.pic)));
$$('[data-blob]').forEach((el) => (el.innerHTML = blobAvatar(['#8B6CFF', '#FF8FC0', '#5CE1E6'], { mood: 'wink' })));
{
  const after = $('.compare__after');
  after.innerHTML = renderSpace('scrap');
  mountSpace('scrap', after);
}

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

/* ───────── holo card + claim ───────── */
const holo = $('#holo');
const card = {
  name: $('[data-name]', holo), handle: $('[data-handle]', holo), aura: $('[data-aura]', holo),
  words: $('[data-words]', holo), avatar: $('[data-avatar]', holo),
};
let lastAuraId = '';
// fake-but-cute scan code for the back of the card, seeded by the handle
function scanCode(seed) {
  const n = 11;
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const finder = (x, y) => [[0, 0], [n - 3, 0], [0, n - 3]].some(([fx, fy]) => x >= fx && x < fx + 3 && y >= fy && y < fy + 3);
  let cells = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const on = finder(x, y) ? !(x % (n - 3) === 1 && y % (n - 3) === 1) : (h >> 16) % 3 === 0;
    if (on) cells += `<rect x="${x}" y="${y}" width="1" height="1" rx=".25"/>`;
  }
  return `<svg viewBox="-1 -1 ${n + 2} ${n + 2}" aria-hidden="true">${cells}</svg>`;
}
function updateCard(raw) {
  const a = auraFor(raw);
  const shown = raw.trim().slice(0, 16) || 'you';
  card.name.textContent = shown.toLowerCase();
  card.handle.textContent = a.handle;
  $('[data-back-handle]', holo).textContent = a.handle;
  $('[data-qr]', holo).innerHTML = scanCode(a.handle);
  if (a.id !== lastAuraId || !raw.trim()) {
    lastAuraId = raw.trim() ? a.id : '';
    holo.style.setProperty('--aura-g', a.gradient);
    holo.style.setProperty('--aura-ink', a.ink);
    card.aura.textContent = a.name;
    card.words.innerHTML = a.words.map((w) => `<li>${w}</li>`).join('');
    card.avatar.innerHTML = blobAvatar(a.colors, { id: 'holoav', mood: raw.trim() ? 'happy' : 'idle' });
    $('[data-back-avatar]', holo).innerHTML = blobAvatar([...a.colors].reverse(), { id: 'holob' });
    if (!reduced) holo.animate([{ scale: 1 }, { scale: 1.04 }, { scale: 1 }], { duration: 450, easing: 'cubic-bezier(.34,1.6,.64,1)' });
  }
}
updateCard('');

const claimInputs = $$('[data-claim] input');
claimInputs.forEach((inp) => inp.addEventListener('input', () => {
  claimInputs.forEach((o) => o !== inp && (o.value = inp.value));
  updateCard(inp.value);
}));
$$('[data-claim]').forEach((form) => form.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = $('input', form).value.trim();
  if (!v) {
    form.classList.remove('is-shake'); void form.offsetWidth; form.classList.add('is-shake');
    $('input', form).focus();
    return;
  }
  const a = auraFor(v);
  toast(`ready to upgrade your aura? ✦ <b>aura.my/${a.handle}</b> is reserved for you for 4 hours — finish signing up in the app to keep it.`, 4800);
}));

// tilt
{
  let hovering = false, t0 = performance.now();
  const setTilt = (px, py) => {
    holo.style.setProperty('--rx', `${(0.5 - py) * 18}deg`);
    holo.style.setProperty('--ry', `${(px - 0.5) * 22}deg`);
    holo.style.setProperty('--mx', `${px * 100}%`);
    holo.style.setProperty('--my', `${py * 100}%`);
  };
  holo.addEventListener('pointermove', (e) => {
    const r = holo.getBoundingClientRect();
    hovering = true;
    holo.classList.remove('is-snap');
    setTilt(clamp((e.clientX - r.left) / r.width, 0, 1), clamp((e.clientY - r.top) / r.height, 0, 1));
  });
  holo.addEventListener('pointerleave', () => {
    hovering = false;
    holo.classList.add('is-snap');
    setTilt(0.5, 0.5);
    setTimeout(() => holo.classList.remove('is-snap'), 900);
  });
  // tap to flip
  let down = null;
  const flip = () => { holo.classList.toggle('is-flipped'); pop(holo, ['✦', '✧']); };
  holo.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  holo.addEventListener('pointerup', (e) => {
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 8 && performance.now() - down.t < 450) flip();
    down = null;
  });
  holo.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  // idle drift so it's alive on phones (no hover there)
  if (!reduced) {
    let raf;
    const idle = (t) => {
      if (!hovering && !holo.classList.contains('is-snap')) {
        const s = (t - t0) / 1000;
        setTilt(0.5 + Math.sin(s * 0.9) * 0.28, 0.5 + Math.cos(s * 0.7) * 0.18);
      }
      raf = requestAnimationFrame(idle);
    };
    whileVisible(holo, () => (raf = requestAnimationFrame(idle)), () => cancelAnimationFrame(raf), 0.1);
  }
}

/* ───────── hero toys (drag + inertia) ───────── */
{
  const hero = $('.hero');
  const toys = $$('.toy');
  const mobileAnchors = {
    'toy--vinyl': ['.hero__card .holo', -0.2, -0.07],
    'toy--note': ['.hero__card .holo', 0.8, 0.02],
    'toy--polaroid': ['.hero__card .holo', -0.16, 0.78],
    'toy--game': ['.hero__card .holo', 0.84, 0.8],
    'toy--star': ['.hero__title', 0.82, 0.62],
    'toy--likes': ['.hero__card .holo', 0.52, -0.16],
  };
  const state = new Map();
  let lastW = 0;

  function place(force = false) {
    const hr = hero.getBoundingClientRect();
    const mobile = innerWidth <= 960;
    if (!force && Math.abs(hr.width - lastW) < 2) return;
    lastW = hr.width;
    toys.forEach((el) => {
      const w = el.offsetWidth, h = el.offsetHeight;
      let x, y;
      if (mobile) {
        const key = [...el.classList].find((c) => mobileAnchors[c]);
        const [sel, fx, fy] = mobileAnchors[key];
        const ar = $(sel).getBoundingClientRect();
        x = ar.left - hr.left + fx * ar.width;
        y = ar.top - hr.top + fy * ar.height;
      } else {
        x = +el.dataset.x * hr.width - w / 2;
        y = +el.dataset.y * hr.height - h / 2;
      }
      x = clamp(x, -w * 0.15, hr.width - w * 0.85);
      y = clamp(y, 60, hr.height - h * 0.6);
      const r = +(el.dataset.r || 0);
      state.set(el, { x, y, vx: 0, vy: 0, r, r0: r, raf: 0 });
      apply(el);
      el.classList.add('is-placed');
    });
  }
  function apply(el) {
    const s = state.get(el);
    el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.r}deg)`;
  }

  // tap (no drag) on a toy does its own little thing
  let likes = 1204, hiScore = 345, noteI = 0;
  const noteLines = ['u have<br>aura fr', '+1000<br>aura', 'main<br>character', 'ok slay', 'rematch?'];
  const taps = {
    'toy--vinyl': (el) => { const v = $('.vinyl', el); v.classList.add('is-boost'); clearTimeout(v._t); v._t = setTimeout(() => v.classList.remove('is-boost'), 1400); pop(el, ['♪', '♫', '♪']); },
    'toy--polaroid': (el) => $('.polaroid', el).classList.toggle('is-flipped'),
    'toy--note': (el) => { const n = $('.note-toy', el); retrigger(n, 'is-peel'); setTimeout(() => { noteI = (noteI + 1) % noteLines.length; n.innerHTML = noteLines[noteI]; }, 200); },
    'toy--likes': (el) => { likes++; $('b', el).textContent = likes.toLocaleString('en-US'); retrigger($('.pill-toy', el), 'is-thump'); pop(el, ['♥', '♥', '♥'], '#FF3D5A'); },
    'toy--game': (el) => { const c = $('.cart', el); hiScore++; retrigger(c, 'is-flash'); setTimeout(() => { $('b', c).textContent = hiScore; $('em', c).textContent = 'you'; }, 250); pop(el, ['★', '+1']); },
    'toy--star': (el) => { retrigger($('.star-toy', el), 'is-spin'); pop(el, ['✦', '✧', '✦', '★']); },
  };

  toys.forEach((el) => {
    let sx, sy, ox, oy, lastT, lastX, lastY, moved = false;
    el.addEventListener('pointerdown', (e) => {
      const s = state.get(el);
      cancelAnimationFrame(s.raf);
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-drag');
      moved = false;
      sx = e.clientX; sy = e.clientY; ox = s.x; oy = s.y;
      lastT = performance.now(); lastX = e.clientX; lastY = e.clientY; s.vx = s.vy = 0;
    });
    el.addEventListener('pointermove', (e) => {
      if (!el.classList.contains('is-drag')) return;
      if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) < 6) return;
      moved = true;
      const s = state.get(el);
      const now = performance.now(), dt = Math.max(1, now - lastT);
      s.vx = s.vx * 0.6 + ((e.clientX - lastX) / dt) * 16 * 0.4;
      s.vy = s.vy * 0.6 + ((e.clientY - lastY) / dt) * 16 * 0.4;
      lastT = now; lastX = e.clientX; lastY = e.clientY;
      s.x = ox + e.clientX - sx; s.y = oy + e.clientY - sy;
      s.r = s.r0 + clamp(s.vx * 1.2, -20, 20);
      apply(el);
    });
    const release = () => {
      if (!el.classList.contains('is-drag')) return;
      el.classList.remove('is-drag');
      const s = state.get(el);
      if (!moved) {
        const key = [...el.classList].find((c) => taps[c]);
        taps[key]?.(el);
        return;
      }
      const hr = hero.getBoundingClientRect();
      const w = el.offsetWidth, h = el.offsetHeight;
      const step = () => {
        s.vx *= 0.93; s.vy *= 0.93;
        s.x += s.vx; s.y += s.vy;
        if (s.x < -w * 0.3 || s.x > hr.width - w * 0.7) { s.vx *= -0.6; s.x = clamp(s.x, -w * 0.3, hr.width - w * 0.7); }
        if (s.y < 50 || s.y > hr.height - h * 0.5) { s.vy *= -0.6; s.y = clamp(s.y, 50, hr.height - h * 0.5); }
        s.r += (s.r0 + clamp(s.vx * 1.2, -20, 20) - s.r) * 0.15;
        apply(el);
        if (Math.hypot(s.vx, s.vy) > 0.15 || Math.abs(s.r - s.r0) > 0.2) s.raf = requestAnimationFrame(step);
      };
      s.raf = requestAnimationFrame(step);
    };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
  });

  const go = () => requestAnimationFrame(() => place(true));
  if (document.fonts?.ready) document.fonts.ready.then(go); else go();
  addEventListener('resize', () => place());
}

/* ───────── before / after ───────── */
{
  const phone = $('#compare');
  const handle = $('.compare__handle', phone);
  const screen = $('.screen', phone);
  let p = 62;
  const set = (v) => {
    p = clamp(v, 0, 100);
    screen.style.setProperty('--p', `${p}%`);
    handle.setAttribute('aria-valuenow', Math.round(p));
  };
  set(p);
  const fromEvent = (e) => {
    const r = screen.getBoundingClientRect();
    set(((e.clientX - r.left) / r.width) * 100);
  };
  handle.addEventListener('pointerdown', (e) => { handle.setPointerCapture(e.pointerId); handle.dataset.drag = '1'; fromEvent(e); });
  handle.addEventListener('pointermove', (e) => handle.dataset.drag && fromEvent(e));
  handle.addEventListener('pointerup', () => delete handle.dataset.drag);
  handle.addEventListener('pointercancel', () => delete handle.dataset.drag);
  handle.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { set(p - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { set(p + 5); e.preventDefault(); }
  });
  // one-time hint sweep
  if (!reduced) {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const frames = [[0, 62], [700, 30], [1500, 78], [2300, 46]];
      const t0 = performance.now();
      const tick = (t) => {
        if (handle.dataset.drag) return;
        const el = t - t0;
        let i = frames.findIndex(([ft]) => ft > el);
        if (i === -1) { set(frames.at(-1)[1]); return; }
        const [ta, va] = frames[i - 1], [tb, vb] = frames[i];
        const k = (el - ta) / (tb - ta), ease = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        set(va + (vb - va) * ease);
        requestAnimationFrame(tick);
      };
      setTimeout(() => requestAnimationFrame(tick), 400);
    }, { threshold: 0.6 });
    obs.observe(phone);
  }
}

/* ───────── how it works ───────── */
{
  const keys = ['hi', 'faves', 'ask', 'share'];
  const steps = $$('.step');
  // each screen's CTA glides the page to the next step; the last one hands off to the worlds
  const next = (i) => {
    const behavior = reduced ? 'auto' : 'smooth';
    if (i < steps.length - 1) {
      const desk = innerWidth > 960;
      const t = desk ? steps[i + 1] : $('.step__screen', steps[i + 1]) || steps[i + 1];
      t.scrollIntoView({ behavior, block: desk ? 'center' : 'start' });
    } else {
      $('#spaces').scrollIntoView({ behavior, block: 'start' });
    }
  };
  $$('.step .mini').forEach((m) => {
    m.innerHTML = renderHow(m.dataset.screen);
    const ctl = mountHow(m.dataset.screen, $('.sp', m), () => next(+m.closest('.step').dataset.step));
    // phones stack the screens inline: start the question demo once it's properly in view
    if (m.dataset.screen === 'ask' || m.dataset.screen === 'faves') {
      new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); ctl.demo(); } }, { threshold: 0.6 }).observe(m);
    }
  });
  const phoneScreen = $('#howScreen');
  phoneScreen.innerHTML = keys.map(renderHow).join('');
  const layers = $$('.sp', phoneScreen);
  const ctls = layers.map((l, j) => mountHow(keys[j], l, () => next(j)));
  const setActive = (i) => {
    steps.forEach((s, j) => s.classList.toggle('is-active', i === j));
    layers.forEach((l, j) => {
      const on = i === j;
      if (on && !l.classList.contains('is-on')) {
        // restart CSS animations inside (chat bubbles etc.)
        l.querySelectorAll('.ch-body > *').forEach((b) => { b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; });
      }
      l.classList.toggle('is-on', on);
    });
    if (innerWidth > 960) ctls[i].demo();
  };
  setActive(0);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.isIntersecting && setActive(+e.target.dataset.step));
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach((s) => obs.observe(s));
}

/* ───────── worlds: pinned, scroll-driven ───────── */
// The section is several screens tall and its content is sticky; scroll progress through it picks
// the world, so all five play through before the page moves on (and rewind on the way back up).
{
  const section = $('#spaces');
  const tabs = $$('.styles [role=tab]');
  const strip = $('.styles');
  const screen = $('#spaceScreen');
  const hint = $('[data-world-hint]');
  const cueN = $('[data-cue-n]'), cueT = $('[data-cue-t]');
  const hints = {
    desk: 'open the icons · drag windows · play game.exe · tap the wallpaper',
    vinyl: 'scratch the record · lift the arm · swap records from the shelf',
    pixel: 'tap to walk or use the stick · visit the house, arcade & sign · tap the sun',
    scrap: 'flip the polaroids · drag the notes · sign the wall',
    story: 'tap left / right · hold to pause · vote & ask',
  };
  const N = tabs.length;
  let idx = -1, cleanup = () => {}, lockTo = null, lockT;

  const show = (i) => {
    if (i === idx) return;
    idx = i;
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; });
    const style = tabs[i].dataset.style;
    cleanup();
    screen.innerHTML = renderSpace(style);
    cleanup = mountSpace(style, screen);
    hint.textContent = hints[style];
    cueN.textContent = `${i + 1} / ${N}`;
    cueT.textContent = i < N - 1 ? 'keep scrolling to flip worlds ↓' : 'that\'s all five — next up ↓';
    // phones show the tabs as a strip: keep the active one in view without moving the page
    if (strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left: tabs[i].offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' });
  };
  const range = () => Math.max(1, section.offsetHeight - innerHeight);
  const onScroll = () => {
    const p = clamp(-section.getBoundingClientRect().top / range(), 0, 0.9999);
    const i = Math.floor(p * N), local = p * N - i;
    tabs.forEach((t, j) => t.style.setProperty('--prog', j < i ? 1 : j === i ? local.toFixed(3) : 0));
    // a tab click scrolls to its world; don't flash the ones in between on the way
    if (lockTo !== null) { if (i !== lockTo) return; lockTo = null; }
    show(i);
  };
  const goTo = (i) => {
    show(i);
    lockTo = i;
    clearTimeout(lockT);
    lockT = setTimeout(() => { lockTo = null; onScroll(); }, 1400);
    const y = section.getBoundingClientRect().top + scrollY + ((i + 0.5) / N) * range();
    scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => goTo(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.min(N - 1, i + 1)); tabs[idx].focus(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.max(0, i - 1)); tabs[idx].focus(); }
    });
  });
  addEventListener('scroll', onScroll, { passive: true }); // scroll events already arrive once per frame
  addEventListener('resize', onScroll);
  show(0);
  onScroll();
  whileVisible(screen, () => { screen.dataset.off = '0'; }, () => { screen.dataset.off = '1'; }, 0.35);
}

/* ───────── made by actual humans ───────── */
{
  const row = $('[data-made]');
  renderMade(row);
  const by = (dir) => row.scrollBy({ left: dir * (row.firstElementChild.offsetWidth + 20), behavior: reduced ? 'auto' : 'smooth' });
  $('[data-made-prev]').addEventListener('click', () => by(-1));
  $('[data-made-next]').addEventListener('click', () => by(1));
  // live activity pill cycles while the section is on screen
  const live = $('[data-live]');
  let li = 0, lt;
  const tick = () => {
    const [who, text, when] = LIVE[li++ % LIVE.length];
    live.classList.remove('is-in'); void live.offsetWidth;
    live.innerHTML = `<i class="made__pulse"></i>${avatar(who)}<span>${text}</span><small>${when}</small>`;
    live.classList.add('is-in');
  };
  tick();
  whileVisible(row, () => { lt = setInterval(tick, 2600); }, () => clearInterval(lt), 0.2);
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
  root.addEventListener('pointerdown', (e) => {
    root.setPointerCapture(e.pointerId);
    down = toSvg(e);
    setTargets(down); setFace('squish'); kick();
    squishes++; countEl.textContent = 14 + squishes;
    say(e);
  });
  root.addEventListener('pointermove', (e) => { if (down) { setTargets(toSvg(e)); kick(); } });
  const up = () => { down = null; setTargets(); setFace('idle'); kick(); };
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', up);
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
    phase += dt * speed * (running ? 1 : 0.55);
    pos = (Math.sin(phase) + 1) / 2;
    marker.style.transform = `translateX(${pos * track.clientWidth}px)`;
    raf = requestAnimationFrame(loop);
  };
  whileVisible(root, () => { last = performance.now(); raf = requestAnimationFrame(loop); }, () => cancelAnimationFrame(raf));

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
    { t: 'mochi is the main character', by: 'lu' },
  ];
  let mine = [];
  try { mine = JSON.parse(localStorage.getItem('auramy-wall') || '[]').slice(-4); } catch { mine = []; }
  let n = 0;
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
      id = e.pointerId; el.setPointerCapture(id); moved = false;
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
    const up = (e) => { if (e.pointerId !== id) return; id = null; el.classList.remove('is-grab'); if (!moved) retrigger(el, 'is-wiggle'); };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  }
  requestAnimationFrame(() => [...seed, ...mine].forEach((x) => add(x)));
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
  });
}

/* ───────── love it too ───────── */
{
  const btn = $('#album');
  const out = $('.tile--love footer');
  $('.album__art', btn).innerHTML = songArt('birds', true);
  $('.album__disc', btn).outerHTML = vinyl('birds', 'album__disc');
  let taps = 0;
  const heartSvg = '<svg viewBox="0 0 100 100" class="fheart"><use href="#heart"/></svg>';
  let outT;
  btn.addEventListener('pointerdown', (e) => {
    taps++;
    // the record slides out of its sleeve while you're tapping
    btn.classList.add('is-out');
    clearTimeout(outT);
    outT = setTimeout(() => btn.classList.remove('is-out'), 2600);
    const x = e.clientX || btn.getBoundingClientRect().left + btn.offsetWidth / 2;
    const y = e.clientY || btn.getBoundingClientRect().top + btn.offsetHeight / 2;
    for (let i = 0; i < 4; i++) {
      const wrap = document.createElement('div');
      wrap.innerHTML = heartSvg;
      const h = wrap.firstChild;
      h.style.left = `${x}px`; h.style.top = `${y}px`;
      h.style.setProperty('--dx', `${(Math.random() - 0.5) * 140}px`);
      h.style.setProperty('--s', (0.8 + Math.random() * 0.9).toFixed(2));
      h.style.setProperty('--rot', `${(Math.random() - 0.5) * 60}deg`);
      h.style.animationDelay = `${i * 60}ms`;
      document.body.append(h);
      setTimeout(() => h.remove(), 1400);
    }
    out.innerHTML = taps > 20
      ? `ok we get it 😭 <b>you</b> + 38 others love this`
      : `<b>you</b> + 38 others love this · ${taps} tap${taps > 1 ? 's' : ''}`;
  });
  btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.dispatchEvent(new PointerEvent('pointerdown')); } });
}

/* ───────── notifications ───────── */
{
  const stack = $('#lockStack');
  const icon = '<img src="/assets/img/app-icon-180.png" alt="" width="60" height="60">';
  let i = 0, timer;
  const push = () => {
    const n = NOTIFS[i % NOTIFS.length];
    i++;
    const el = document.createElement('div');
    el.className = 'ntf';
    // from a friend: their face, with the app as a little corner badge; from Auramy: just the app icon
    const lead = n.who ? `<span class="ntf__av">${avatar(n.who)}<i class="ntf__badge">${icon}</i></span>` : `<span class="ntf__ico">${icon}</span>`;
    el.className = n.who ? 'ntf ntf--person' : 'ntf';
    el.innerHTML = `${lead}<b>${n.t}</b><small></small><p>${n.b}</p>`;
    stack.prepend(el);
    $$('.ntf', stack).forEach((x, j) => {
      x.classList.toggle('is-old', j > 0);
      $('small', x).textContent = j === 0 ? 'now' : `${j * 3}m ago`;
      if (j > 3) x.remove();
    });
  };
  push(); push();
  whileVisible(stack, () => { push(); timer = setInterval(push, 2600); }, () => clearInterval(timer), 0.3);
  // tap a notification to swipe it away
  stack.addEventListener('click', (e) => {
    const n = e.target.closest('.ntf');
    if (!n || n.classList.contains('is-gone')) return;
    n.classList.add('is-gone');
    setTimeout(() => n.remove(), 420);
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
    if (reduced) { val = target; num.textContent = fmt(val); return; }
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1600);
      val = target * (1 - (1 - k) ** 3);
      num.textContent = fmt(val);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  orb.addEventListener('pointerdown', (e) => {
    const add = [5, 10, 20, 25, 50][Math.floor(Math.random() * 5)];
    target += add; val = target; num.textContent = fmt(val);
    const s = document.createElement('span');
    s.className = 'plus';
    s.textContent = `+${add} ✦`;
    s.style.left = `${e.clientX - 20}px`; s.style.top = `${e.clientY - 20}px`;
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

/* ───────── rotating word ───────── */
{
  const el = $('.rotator');
  const words = el.dataset.rotator.split('|');
  let i = 0;
  if (!reduced) whileVisible(el, () => {
    el._t = setInterval(() => {
      el.classList.remove('is-in'); el.classList.add('is-out');
      setTimeout(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove('is-out'); el.classList.add('is-in');
      }, 330);
    }, 1900);
  }, () => clearInterval(el._t));
}

/* ───────── Auri ───────── */
{
  const btn = $('#auri');
  const body = $('[data-auri]');
  body.innerHTML = blobAvatar(candy, { id: 'auri' });
  let t;
  btn.addEventListener('click', () => {
    btn.classList.remove('is-squish'); void btn.offsetWidth; btn.classList.add('is-squish');
    body.innerHTML = blobAvatar(candy, { id: 'auri', mood: 'love' });
    clearTimeout(t);
    t = setTimeout(() => { body.innerHTML = blobAvatar(candy, { id: 'auri' }); btn.classList.remove('is-squish'); }, 1100);
  });
}

console.info('%c✦ auramy', 'font: 800 20px sans-serif; color: #ff5fa2', '— a website with your aura. hi, curious one.', MIA.url);
