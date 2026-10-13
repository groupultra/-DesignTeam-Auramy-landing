// The hero: a little early-2000s desktop with three Auramy worlds open (the lead personas)
// and the other four waiting as desktop icons. Windows can be focused, dragged by their
// title bar, minimised to the taskbar and reopened. Local demo only.
import { PERSONAS, ORDER, LEADS, personaAvatar } from './personas.js';
import { homeMarkup } from './persona-sites.js?v=early-web-1';
import { doodle } from './doodles.js';

const TITLES = { camila: "cami's cut", maddie: 'drive home', marcus: 'friday night drive', jayden: 'lobby.exe', river: 'porchlight', theo: 'late show', aaliyah: 'knotless' };
const ICONS = ORDER.filter((id) => !LEADS.includes(id));
const SLOTS = { maddie: 'left', camila: 'main', marcus: 'right' };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const windowMarkup = (id, slot) => {
  const p = PERSONAS[id];
  return `<article class="xpwin desk-win desk-win--${slot}" data-win="${id}" aria-label="${p.name}'s world: ${p.template}">
    <header class="xpwin__bar" data-drag>
      <img class="xpwin__icon" src="${personaAvatar(id)}" alt="" width="16" height="16">
      <b class="xpwin__title">${TITLES[id]}</b>
      <span class="xpwin__btns"><button type="button" data-win-min aria-label="Minimize ${TITLES[id]}">_</button><button type="button" tabindex="-1" aria-hidden="true">□</button><button type="button" class="is-close" data-win-min aria-label="Close ${TITLES[id]}">×</button></span>
    </header>
    <p class="xpwin__addr"><span>Address</span><i>${p.url}</i></p>
    <div class="desk-win__screen" inert>${homeMarkup(id)}</div>
  </article>`;
};

const taskMarkup = (id) => `<button type="button" class="desk-task" data-task="${id}" aria-pressed="true"><img src="${personaAvatar(id)}" alt="" width="16" height="16"><span>${TITLES[id]}</span></button>`;

export function initHeroDesktop(host) {
  if (!host) return () => {};
  host.innerHTML = `
    <div class="desktop__wall" aria-hidden="true">
      ${doodle('cloud', 'desk-cloud desk-cloud--a')}${doodle('cloud', 'desk-cloud desk-cloud--b')}${doodle('cloud', 'desk-cloud desk-cloud--c')}
      <i class="desk-hill"></i>
    </div>
    <ul class="desktop__icons" aria-label="More worlds">${ICONS.map((id) => `<li><button type="button" class="desk-icon" data-open="${id}"><img src="${personaAvatar(id)}" alt="" width="44" height="44"><span>${TITLES[id]}</span></button></li>`).join('')}</ul>
    <div class="desktop__windows" data-windows>${LEADS.map((id) => windowMarkup(id, SLOTS[id])).join('')}</div>
    <div class="desktop__taskbar">
      <button type="button" class="desk-start" data-start aria-expanded="false" aria-controls="desk-menu">${doodle('smile')}<b>start</b></button>
      <div class="desk-menu" id="desk-menu" hidden>
        <p class="desk-menu__head">${doodle('smile')}<b>all worlds</b></p>
        <ul>${ORDER.map((id) => `<li><button type="button" data-open="${id}"><img src="${personaAvatar(id)}" alt="" width="24" height="24"><span><b>${TITLES[id]}</b>${PERSONAS[id].name}</span></button></li>`).join('')}</ul>
      </div>
      <div class="desk-tasks" data-tasks>${LEADS.map(taskMarkup).join('')}</div>
      <p class="desk-marquee" aria-hidden="true"><span>★ under construction ★ best viewed at 800×600 ★ sign my guestbook ★ under construction ★ best viewed at 800×600 ★ sign my guestbook ★</span></p>
      <p class="desk-tray">${doodle('smile', 'desk-tray__smile')}<time data-clock>4:12 PM</time></p>
    </div>`;

  const abort = new AbortController();
  const { signal } = abort;
  const layer = host.querySelector('[data-windows]');
  const tasks = host.querySelector('[data-tasks]');
  const menu = host.querySelector('#desk-menu');
  const start = host.querySelector('[data-start]');
  let z = 10;

  const win = (id) => layer.querySelector(`[data-win="${id}"]`);
  const task = (id) => tasks.querySelector(`[data-task="${id}"]`);

  function focus(el) {
    layer.querySelectorAll('.desk-win').forEach((w) => w.classList.toggle('is-active', w === el));
    el.style.zIndex = String(++z);
  }

  function setMinimized(id, minimized) {
    const el = win(id);
    if (!el) return;
    el.classList.toggle('is-min', minimized);
    task(id)?.setAttribute('aria-pressed', String(!minimized));
    if (!minimized) focus(el);
  }

  function open(id) {
    if (!win(id)) {
      // One extra window at a time keeps the little desktop readable.
      layer.querySelector('.desk-win--extra')?.remove();
      tasks.querySelector('.desk-task.is-extra')?.remove();
      layer.insertAdjacentHTML('beforeend', windowMarkup(id, 'extra'));
      tasks.insertAdjacentHTML('beforeend', taskMarkup(id));
      task(id).classList.add('is-extra');
    }
    setMinimized(id, false);
  }

  function closeMenu() {
    menu.hidden = true;
    start.setAttribute('aria-expanded', 'false');
  }

  host.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-open]');
    if (opener) { open(opener.dataset.open); closeMenu(); return; }
    const min = event.target.closest('[data-win-min]');
    if (min) { setMinimized(min.closest('[data-win]').dataset.win, true); return; }
    const t = event.target.closest('[data-task]');
    if (t) {
      const el = win(t.dataset.task);
      const isFront = el && !el.classList.contains('is-min') && el.classList.contains('is-active');
      setMinimized(t.dataset.task, isFront);
      return;
    }
    if (event.target.closest('[data-start]')) {
      menu.hidden = !menu.hidden;
      start.setAttribute('aria-expanded', String(!menu.hidden));
      return;
    }
    if (!event.target.closest('#desk-menu')) closeMenu();
  }, { signal });

  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); start.focus(); } }, { signal });

  layer.addEventListener('pointerdown', (event) => {
    const el = event.target.closest('.desk-win');
    if (!el) return;
    focus(el);
    const bar = event.target.closest('[data-drag]');
    if (!bar || event.target.closest('button') || event.button !== 0) return;
    const bounds = host.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const startX = event.clientX, startY = event.clientY;
    const baseX = parseFloat(el.style.getPropertyValue('--dx')) || 0;
    const baseY = parseFloat(el.style.getPropertyValue('--dy')) || 0;
    bar.setPointerCapture(event.pointerId);
    el.classList.add('is-dragging');
    const move = (e) => {
      const dx = clamp(e.clientX - startX, bounds.left - rect.left - rect.width * .5, bounds.right - rect.right + rect.width * .5);
      const dy = clamp(e.clientY - startY, bounds.top - rect.top, bounds.bottom - rect.top - 60);
      el.style.setProperty('--dx', `${baseX + dx}px`);
      el.style.setProperty('--dy', `${baseY + dy}px`);
    };
    const up = () => {
      el.classList.remove('is-dragging');
      bar.removeEventListener('pointermove', move);
      bar.removeEventListener('pointerup', up);
      bar.removeEventListener('pointercancel', up);
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up);
    bar.addEventListener('pointercancel', up);
  }, { signal });

  focus(win('camila'));

  const clock = host.querySelector('[data-clock]');
  const tick = () => { clock.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); };
  tick();
  const clockTimer = setInterval(tick, 30_000);

  return () => { abort.abort(); clearInterval(clockTimer); };
}

/* "make it weird": an explicit, reversible toggle. Glitch trails, a louder wallpaper, a few
   stickers. Under reduced motion it changes colours and positions without animating. */
export function initWeird(button, hero) {
  if (!button || !hero) return () => {};
  const mood = hero.querySelector('[data-mood]');
  const stickers = hero.querySelector('[data-stickers]');
  const marks = ['star', 'heart', 'bolt', 'sparkle', 'smile', 'star', 'heart', 'bolt'];
  const sync = (on) => {
    document.documentElement.dataset.weird = on ? 'on' : 'off';
    button.setAttribute('aria-pressed', String(on));
    button.querySelector('span').textContent = on ? 'make it normal' : 'make it weird';
    if (mood) mood.textContent = on ? 'ok it’s weird now. still you.' : 'posting this anyway.';
    if (stickers) {
      stickers.innerHTML = on ? marks.map((m, i) => doodle(m, `weird-sticker weird-sticker--${i}`)).join('') : '';
    }
    hero.querySelectorAll('.desk-win').forEach((w, i) => w.style.setProperty('--wobble', on ? `${[-3.5, 2.5, -1.5, 3][i % 4]}deg` : '0deg'));
  };
  const toggle = () => sync(document.documentElement.dataset.weird !== 'on');
  button.addEventListener('click', toggle);
  document.addEventListener('auramy:weird', toggle);
  sync(false);
  return () => { button.removeEventListener('click', toggle); document.removeEventListener('auramy:weird', toggle); };
}
