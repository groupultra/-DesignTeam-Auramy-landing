import { AURAS, auraFor, gradientOf, spring, prefersReducedMotion } from './aura.js';
import { injectSprite, pic, blobAvatar, BLOB } from './sprite.js';

injectSprite();
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const candy = ['#FF5FA2', '#FF8A3C', '#E8FF5A'];
const reduced = prefersReducedMotion();

const toastEl = $('#toast');
let toastT;
const toast = (t) => {
  toastEl.textContent = t;
  toastEl.classList.add('is-on');
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove('is-on'), 1800);
};

$('#coverMark').innerHTML = blobAvatar(candy, { id: 'cover' });

/* toc highlight */
{
  const links = $$('.toc a');
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove('is-on'));
      const a = map.get(e.target.id);
      if (a) {
        a.classList.add('is-on');
        a.scrollIntoView?.({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  $$('.ch').forEach((s) => obs.observe(s));
}

/* logo misuse */
{
  const eyes = (c = '#141013') => `<ellipse cx="47" cy="64" rx="5.4" ry="8.6" fill="${c}"/><ellipse cx="73" cy="64" rx="5.4" ry="8.6" fill="${c}"/>`;
  const g = (id, stops) => `<defs><linearGradient id="${id}" x1=".18" y1=".02" x2=".82" y2="1">${stops.map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`;
  const mark = (inner, attrs = '') => `<svg viewBox="0 0 120 120" ${attrs}>${inner}</svg>`;
  const items = [
    ['don\'t stretch or squash the logo', mark(`${g('d1', candy)}<g transform="translate(-30 20) scale(1.5 .66)"><path d="${BLOB}" fill="url(#d1)"/>${eyes()}</g>`)],
    ['don\'t recolor the eyes', mark(`${g('d2', candy)}<path d="${BLOB}" fill="url(#d2)"/>${eyes('#8B6CFF')}`)],
    ['don\'t rotate it', mark(`${g('d3', candy)}<g transform="rotate(28 60 60)"><path d="${BLOB}" fill="url(#d3)"/>${eyes()}</g>`)],
    ['don\'t outline it', mark(`<path d="${BLOB}" fill="none" stroke="#141013" stroke-width="4"/>${eyes()}`)],
    ['don\'t swap the gradient for a rainbow', mark(`${g('d5', ['#ff0000', '#ffee00', '#00ff44', '#0066ff', '#aa00ff'])}<path d="${BLOB}" fill="url(#d5)"/>${eyes()}`)],
    ['don\'t give the logo a mouth', mark(`${g('d6', candy)}<path d="${BLOB}" fill="url(#d6)"/>${eyes()}<path d="M48 82q12 10 24 0" stroke="#141013" stroke-width="4" fill="none" stroke-linecap="round"/>`)],
    ['don\'t drop it on busy photos without a sticker edge', `<div style="position:absolute;inset:0">${pic('ph-gig')}</div>` + mark(`<path d="${BLOB}" fill="#FF5FA2" fill-opacity=".85"/>${eyes()}`, 'style="position:relative"')],
    ['don\'t retype the wordmark', `<span style="font:700 34px Arial, sans-serif;letter-spacing:0">Auramy</span>`],
  ];
  $('#donts').innerHTML = items.map(([cap, art]) => `<figure class="dont"><div class="dont__box">${art}</div><figcaption>${cap}</figcaption></figure>`).join('');
}

/* moods */
{
  const moods = [
    ['idle', 'logo, default avatar'], ['happy', 'published, saved'], ['wow', 'new record, milestone'], ['love', 'likes, “love it too”'],
    ['sleepy', 'empty states, quiet days'], ['squish', 'tap feedback'], ['wink', 'share, easter eggs'],
  ];
  $('#moods').innerHTML = moods.map(([m, use], i) => `<figure class="mood" style="--d:${-i * 0.4}s">${blobAvatar(candy, { id: 'm' + m, mood: m })}<b>${m}</b><span>${use}</span></figure>`).join('');
}

/* squishy Auri with spring */
{
  const btn = $('#squishy');
  const body = $('span', btn);
  body.innerHTML = blobAvatar(candy, { id: 'sq' });
  const s = spring(260, 12);
  let sx = 1, sy = 1, vx = 0, vy = 0, tx = 1, ty = 1, raf = 0, start = null, last = 0;
  const loop = (t) => {
    const dt = Math.min(0.033, (t - last) / 1000 || 0.016); last = t;
    [sx, vx] = s(sx, vx, tx, dt);
    [sy, vy] = s(sy, vy, ty, dt);
    body.style.transform = `scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
    if (start || Math.abs(vx) + Math.abs(vy) + Math.abs(sx - tx) + Math.abs(sy - ty) > 0.002) raf = requestAnimationFrame(loop);
    else raf = 0;
  };
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  btn.addEventListener('pointerdown', (e) => {
    btn.setPointerCapture(e.pointerId);
    start = { x: e.clientX, y: e.clientY };
    tx = 1.25; ty = 0.72;
    body.innerHTML = blobAvatar(candy, { id: 'sq', mood: 'squish' });
    kick();
  });
  btn.addEventListener('pointermove', (e) => {
    if (!start) return;
    const dy = (start.y - e.clientY) / 160, dx = Math.abs(e.clientX - start.x) / 200;
    ty = Math.max(0.6, Math.min(1.7, 0.72 + dy * 1.4));
    tx = Math.max(0.7, Math.min(1.5, 1.25 - dy * 0.6 + dx));
    kick();
  });
  const up = () => {
    if (!start) return;
    start = null; tx = 1; ty = 1;
    body.innerHTML = blobAvatar(candy, { id: 'sq', mood: 'happy' });
    setTimeout(() => !start && (body.innerHTML = blobAvatar(candy, { id: 'sq' })), 900);
    kick();
  };
  btn.addEventListener('pointerup', up);
  btn.addEventListener('pointercancel', up);
}

/* swatches */
{
  const sets = {
    core: [['ink', '#141013', 'text, dark scenes'], ['graphite', '#3A3236', 'secondary text'], ['stone', '#9B9189', 'meta, hints'], ['sand', '#F3E9DA', 'quiet panels'], ['paper', '#FFF8EE', 'the base'], ['white', '#FFFFFF', 'cards, die-cut']],
    aura: [['bubblegum', '#FF5FA2', 'primary aura'], ['tangerine', '#FF8A3C', 'warmth'], ['lemon', '#E8FF5A', 'highlighter'], ['aqua', '#5CE1E6', 'cool accent'], ['violet', '#8B6CFF', 'night, focus'], ['cherry', '#FF3D5A', 'likes, alerts']],
  };
  $$('[data-swatches]').forEach((el) => {
    el.innerHTML = sets[el.dataset.swatches].map(([n, hex, use]) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      return `<button class="sw" data-hex="${hex}"><i style="background:${hex}"></i><span><b>${n}</b><small>${hex} · ${r} ${g} ${b}<br>${use}</small></span></button>`;
    }).join('');
  });
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-hex]');
    if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.hex); toast(`copied ${b.dataset.hex}`); }
    catch { toast(b.dataset.hex); }
  });
}

/* personal aura generator */
{
  const input = $('#genInput');
  const out = $('.gen__out');
  const render = () => {
    const a = auraFor(input.value);
    out.style.setProperty('--g', a.gradient);
    out.style.setProperty('--gi', a.ink);
    $('#genBlob').innerHTML = blobAvatar(a.colors, { id: 'gen', mood: input.value.trim() ? 'happy' : 'idle' });
    $('#genName').textContent = a.name;
    $('#genWords').innerHTML = a.words.map((w) => `<li>${w}</li>`).join('');
    $('#genHex').innerHTML = a.colors.map((c) => `<span data-hex="${c}"><i style="background:${c}"></i>${c}</span>`).join('');
  };
  input.addEventListener('input', render);
  render();
  $('#auraGrid').innerHTML = AURAS.map((a) => {
    const g = gradientOf(a.colors, 150);
    const dark = ['night-swim', 'cherry-cola', 'moss', 'static', 'blue-hour'].includes(a.id);
    return `<figure class="ag" style="background:${g};color:${dark ? '#FFF8EE' : '#141013'}">${blobAvatar(a.colors.slice().reverse(), { id: 'ag' + a.id })}<b>${a.name}</b><span>${a.words.join(' · ')}</span></figure>`;
  }).join('');
}

/* illustrations */
$('#illos').innerHTML = ['ph-cat', 'ph-sea', 'ph-city', 'ph-gig', 'ph-flowers', 'ph-bff'].map((p) => pic(p)).join('');

/* spring demo */
{
  const box = $('#springbox');
  const ball = $('#springball');
  const s = spring(170, 18);
  let x = 0, y = 0, vx = 0, vy = 0, drag = null, raf = 0, last = 0;
  const loop = (t) => {
    const dt = Math.min(0.033, (t - last) / 1000 || 0.016); last = t;
    if (!drag) { [x, vx] = s(x, vx, 0, dt); [y, vy] = s(y, vy, 0, dt); }
    const stretch = Math.min(0.35, Math.hypot(vx, vy) / 3000);
    const ang = Math.atan2(vy, vx) * 180 / Math.PI;
    ball.style.transform = `translate(${x}px, ${y}px) rotate(${ang}deg) scale(${1 + stretch}, ${1 - stretch * 0.6})`;
    if (drag || Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) > 0.3) raf = requestAnimationFrame(loop);
    else { raf = 0; ball.style.transform = ''; }
  };
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  ball.addEventListener('pointerdown', (e) => { ball.setPointerCapture(e.pointerId); drag = { sx: e.clientX - x, sy: e.clientY - y, lx: e.clientX, ly: e.clientY, lt: performance.now() }; kick(); });
  ball.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const r = box.getBoundingClientRect();
    const now = performance.now(), dt = Math.max(1, now - drag.lt) / 1000;
    vx = (e.clientX - drag.lx) / dt; vy = (e.clientY - drag.ly) / dt;
    drag.lx = e.clientX; drag.ly = e.clientY; drag.lt = now;
    x = Math.max(-r.width / 2 + 32, Math.min(r.width / 2 - 32, e.clientX - drag.sx));
    y = Math.max(-r.height / 2 + 32, Math.min(r.height / 2 - 32, e.clientY - drag.sy));
  });
  const up = () => { drag = null; kick(); };
  ball.addEventListener('pointerup', up);
  ball.addEventListener('pointercancel', up);
  // a little nudge so it's obviously alive
  if (!reduced) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); x = -80; y = -30; kick(); } }, { threshold: 0.8 }).observe(box);
}

/* home screen */
{
  const names = ['Photos', 'Music', 'Camera', 'Maps', 'Notes', 'Auramy', 'Clock', 'Weather', 'Games', 'Mail', 'Files', 'Settings'];
  $('#hsGrid').innerHTML = names.map((n) => n === 'Auramy'
    ? `<span><img src="/assets/logo/auramy-app-icon.svg" alt="">${n}</span>`
    : `<span><i></i>${n}</span>`).join('');
}

/* share cards */
{
  const people = [
    { n: 'mia', line: 'indie music & a cat called mochi', sticker: 'come squish me', aura: { ...AURAS[0], ink: '#141013', gradient: gradientOf(AURAS[0].colors, 135) } },
    { n: 'noah', line: 'beat my score. i dare you.', sticker: 'hi-score 345', aura: auraFor('noah') },
  ];
  $('#ogs').innerHTML = people.map((p) => `
    <div class="og" style="--g:${p.aura.gradient};--gi:${p.aura.ink}">
      <p class="og__name">${p.n}</p>
      <p class="og__line">${p.line}</p>
      <span class="og__sticker">${p.sticker}</span>
      <div class="og__blob">${blobAvatar(p.aura.colors.slice().reverse(), { id: 'og' + p.n, mood: 'wink' })}</div>
      <span class="og__url">aura.my/${p.n}</span>
      <img class="og__brand" src="/assets/logo/auramy-wordmark-${p.aura.ink === '#141013' ? 'ink' : 'paper'}.svg" alt="">
    </div>`).join('');
}

/* story templates */
{
  const tpl = [
    { k: 'new high score', n: 'noah', a: auraFor('noah'), cta: 'beat 345 →', mood: 'wow' },
    { k: 'sign my wall', n: 'mia', a: { ...AURAS[0], ink: '#141013', gradient: gradientOf(AURAS[0].colors, 160) }, cta: 'leave a note ✎', mood: 'happy' },
    { k: '100 visitors ✦', n: 'jay', a: auraFor('jay'), cta: 'come see →', mood: 'love' },
    { k: 'new world just dropped', n: 'lu', a: auraFor('lu'), cta: 'aura.my/lu', mood: 'wink' },
  ];
  $('#stories').innerHTML = tpl.map((t) => `
    <div class="story" style="--g:${t.a.gradient};--gi:${t.a.ink}">
      <p class="story__kick">${t.k}</p>
      <div class="story__blob">${blobAvatar(t.a.colors.slice().reverse(), { id: 'st' + t.n, mood: t.mood })}</div>
      <p class="story__name">${t.n}</p>
      <span class="story__cta">${t.cta}</span>
    </div>`).join('');
}
