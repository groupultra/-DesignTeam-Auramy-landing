// Behaviour for everything inside the phone mockups: the five worlds and the creation flow.
// Every mount returns a cleanup function (listeners on replaced DOM are GC'd; loops/timers are not).
import { pic, blobAvatar } from './sprite.js';
import { PHOTOS, TRACKS, MIA } from './spaces.js';
import { auraFor } from './aura.js';
import { songArt } from './covers.js';
import { avatar } from './people.js';

const $ = (s, r) => r.querySelector(s);
const $$ = (s, r) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const candy = ['#FF5FA2', '#FF8A3C', '#E8FF5A'];
const motionPaused = () => document.body.classList.contains('is-motion-paused');

/* ───────── shared helpers ───────── */
function local(e, sp) {
  const r = sp.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top, cx: ((e.clientX - r.left) / r.width) * 100, cy: ((e.clientY - r.top) / r.width) * 100 };
}

export function burst(sp, x, y, glyphs = ['♥'], n = 6) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'pburst';
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = `${x}px`; s.style.top = `${y}px`;
    s.style.setProperty('--dx', `${(Math.random() - 0.5) * 90}px`);
    s.style.setProperty('--dy', `${-(30 + Math.random() * 70)}px`);
    s.style.setProperty('--r', `${(Math.random() - 0.5) * 100}deg`);
    s.style.animationDelay = `${i * 35}ms`;
    sp.append(s);
    setTimeout(() => s.remove(), 1200);
  }
}
function burstAt(sp, el, glyphs, n) {
  const r = el.getBoundingClientRect(), s = sp.getBoundingClientRect();
  burst(sp, r.left - s.left + r.width / 2, r.top - s.top + r.height / 2, glyphs, n);
}
function toast(sp, text) {
  const t = $('.ptoast', sp);
  if (!t) return;
  t.textContent = text;
  t.classList.add('is-on');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('is-on'), 1800);
}
function retrigger(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

// rAF loop that idles while the phone is off-screen or the node is gone.
function loop(sp, fn, activeInteraction = () => false) {
  let raf, last = performance.now();
  const tick = (t) => {
    if (!sp.isConnected) return;
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    if (!document.hidden && !sp.closest('[data-off="1"]') && (!motionPaused() || activeInteraction())) fn(dt, t);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

// Drag with `translate` (keeps any CSS rotate), clamped inside `within`; a still press counts as a tap.
function draggable(el, { within, handle = el, onTap, onStart } = {}) {
  let id = null, sx = 0, sy = 0, ox = 0, oy = 0, moved = false, lim;
  el._tx = el._tx || 0; el._ty = el._ty || 0;
  handle.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || e.target.closest('[data-nodrag]')) return;
    e.stopPropagation();
    id = e.pointerId; moved = false;
    try { handle.setPointerCapture(id); } catch { /* synthetic pointer */ }
    sx = e.clientX; sy = e.clientY; ox = el._tx; oy = el._ty;
    const wr = within.getBoundingClientRect(), tr = el.getBoundingClientRect();
    lim = { l: wr.left - tr.left + ox - tr.width * 0.3, r: wr.right - tr.right + ox + tr.width * 0.3, t: wr.top - tr.top + oy, b: wr.bottom - tr.bottom + oy + tr.height * 0.3 };
    onStart?.(e);
  });
  handle.addEventListener('pointermove', (e) => {
    if (e.pointerId !== id) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!moved && Math.hypot(dx, dy) < 6) return;
    if (!moved) { moved = true; el.classList.add('is-grab'); }
    el._tx = clamp(ox + dx, lim.l, lim.r);
    el._ty = clamp(oy + dy, lim.t, lim.b);
    el.style.translate = `${el._tx}px ${el._ty}px`;
  });
  handle.addEventListener('pointerup', (e) => {
    if (e.pointerId !== id) return;
    id = null; el.classList.remove('is-grab');
    if (!moved) onTap?.(e);
  });
  handle.addEventListener('pointercancel', (e) => { if (e.pointerId === id) { id = null; el.classList.remove('is-grab'); } });
  handle.addEventListener('click', (e) => { if (e.detail === 0) onTap?.(e); }); // keyboard
}

const zStack = (start = 10) => { let z = start; return (el) => { el.style.zIndex = ++z; }; };

/* ───────── little desktop ───────── */
function mountDesk(sp) {
  const front = zStack(10);
  const wins = Object.fromEntries($$('[data-win]', sp).map((w) => [w.dataset.win, w]));
  let playing = true, likes = 1204, photo = 0;

  const open = (name) => {
    const w = wins[name];
    w.classList.remove('is-closed', 'is-min');
    front(w);
    retrigger(w, 'is-pop');
    if (name === 'game') flappy.ready();
  };
  Object.values(wins).forEach((w) => {
    const bar = $('.win__bar', w);
    $$('[data-w]', bar).forEach((b) => b.setAttribute('data-nodrag', ''));
    draggable(w, { within: sp, handle: bar, onStart: () => front(w) });
    w.addEventListener('pointerdown', () => front(w));
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('[data-w]');
      if (!b) return;
      const a = b.dataset.w;
      if (a === 'close') { w.classList.add('is-closed'); w.classList.remove('is-max'); }
      if (a === 'min') { w.classList.add('is-min'); setTimeout(() => w.classList.contains('is-min') && w.classList.add('is-closed'), 320); }
      if (a === 'max') {
        w.classList.toggle('is-max');
        w._tx = 0; w._ty = 0; w.style.translate = '';
        front(w);
      }
    });
  });
  $$('[data-open]', sp).forEach((b) => b.addEventListener('click', () => { retrigger(b, 'is-bounce'); open(b.dataset.open); }));

  // photos
  const pb = $('[data-next-photo]', sp);
  pb.addEventListener('click', () => {
    photo = (photo + 1) % PHOTOS.length;
    pb.innerHTML = `${pic(PHOTOS[photo].id)}<span class="photo__n">${photo + 1} / ${PHOTOS.length} · tap</span>`;
    $('[data-title]', wins.photos).textContent = PHOTOS[photo].name;
    retrigger(pb, 'is-flash');
  });

  // sticky note
  const notes = [['rematch tonight.', 'noah'], ['ur playlist saved my week', 'jay'], ['this photo is the main character', 'lu'], ['call me when ur bus comes', 'sam']];
  let ni = 0;
  const sticky = $('[data-sticky]', sp);
  draggable(sticky, { within: sp, onStart: () => front(sticky), onTap: () => {
    ni = (ni + 1) % notes.length;
    retrigger(sticky, 'is-peel');
    setTimeout(() => { sticky.innerHTML = `${notes[ni][0]}<span>— ${notes[ni][1]}</span>`; }, 180);
  } });

  // music
  const nowBtn = $('.desk-now', sp);
  const setPlay = (p) => {
    playing = p;
    sp.classList.toggle('is-paused', !p);
    nowBtn.textContent = p ? `♪ ${MIA.song.title}` : '❚❚ paused';
  };
  $$('[data-play]', sp).forEach((b) => b.addEventListener('click', () => { setPlay(!playing); toast(sp, playing ? `♪ playing ${MIA.song.title}` : 'paused'); }));
  const seek = $('[data-seek]', sp);
  seek.addEventListener('click', (e) => {
    const r = seek.getBoundingClientRect();
    const bar = $('i', seek);
    bar.style.animation = 'none'; void bar.offsetWidth;
    bar.style.animation = '';
    bar.style.animationDelay = `${-((e.clientX - r.left) / r.width) * 6}s`;
  });

  // guestbook
  const guest = $('[data-guest]', sp);
  $('[data-sign]', sp).addEventListener('click', () => {
    const li = document.createElement('li');
    li.innerHTML = `<b>you</b>${pick(['hi mia!!', 'ur desktop is so cute', 'camera roll supremacy', 'rematch me next'])}`;
    li.className = 'is-new';
    guest.append(li);
    guest.scrollTop = guest.scrollHeight;
    toast(sp, 'signed ✎ mia gets a ping');
  });

  // dock
  $('[data-auri]', sp).addEventListener('click', (e) => { retrigger(e.currentTarget, 'is-bounce'); toast(sp, 'hi!! welcome to my desktop ✦'); burstAt(sp, e.currentTarget, ['✦', '♥'], 5); });
  $('[data-like]', sp).addEventListener('click', (e) => { likes++; retrigger(e.currentTarget, 'is-bounce'); burstAt(sp, e.currentTarget, ['♥'], 6); toast(sp, `♥ ${likes.toLocaleString('en-US')}`); });

  // wallpaper
  sp.addEventListener('click', (e) => {
    if (e.target !== sp && !e.target.classList.contains('desk-icons')) return;
    sp.dataset.wall = (+sp.dataset.wall + 1) % 3;
    toast(sp, 'new wallpaper ✦');
  });

  // flappy
  const flappy = (() => {
    const body = $('[data-flappy]', sp), bird = $('.gw-bird', body), top = $('.gw-pipe--1', body), bot = $('.gw-pipe--2', body), msg = $('.gw-msg', body), title = $('[data-title]', wins.game);
    let state = 'ready', y = 0, v = 0, px = 0, gap = 0.5, score = 0, best = 345, passed = false;
    const reset = () => { y = body.clientHeight * 0.45; v = 0; px = body.clientWidth + 10; gap = 0.35 + Math.random() * 0.3; score = 0; passed = false; };
    const flap = () => {
      if (state !== 'play') { reset(); state = 'play'; msg.textContent = ''; }
      v = -body.clientHeight * 2.3;
    };
    body.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); flap(); });
    const step = (dt) => {
      if (wins.game.classList.contains('is-closed')) return;
      const h = body.clientHeight, w = body.clientWidth, bs = w * 0.1, pw = w * 0.13, gh = h * 0.44, bx = w * 0.22;
      if (!h) return;
      if (state === 'play') {
        v += h * 7.5 * dt; y += v * dt; px -= w * 0.42 * dt;
        if (px < -pw) { px = w + 10; gap = 0.3 + Math.random() * 0.4; passed = false; }
        if (!passed && px + pw < bx) { passed = true; score++; title.textContent = `game.exe — ${score} · hi ${Math.max(best, score)}`; }
        const gt = gap * h - gh / 2, gb = gap * h + gh / 2;
        const inPipe = bx + bs * 0.75 > px && bx - bs * 0.25 < px + pw && (y - bs * 0.3 < gt || y + bs * 0.3 > gb);
        if (y > h - bs * 0.3 || y < -bs || inPipe) {
          state = 'over';
          msg.textContent = score > best ? `${score}! new high score` : `${score} · tap to retry`;
          if (score > best) { best = score; toast(sp, 'new high score. noah is shaking.'); }
        }
      } else if (state === 'ready') {
        y = h * 0.45 + Math.sin(performance.now() / 300) * h * 0.06;
      }
      bird.style.transform = `translate(${bx - bs / 2}px, ${y - bs / 2}px) rotate(${clamp((v / h) * 12, -25, 60)}deg)`;
      const gt = gap * h - gh / 2;
      top.style.cssText = `left:${px}px;top:0;height:${Math.max(0, gt)}px;width:${pw}px`;
      bot.style.cssText = `left:${px}px;top:${gt + gh}px;height:${Math.max(0, h - gt - gh)}px;width:${pw}px`;
    };
    return { step, isPlaying: () => state === 'play', ready: () => { state = 'ready'; reset(); msg.textContent = 'tap to flap'; } };
  })();
  flappy.ready();
  flappy.step(0); // Paint the ready state even when decorative motion starts paused.
  return loop(sp, (dt) => flappy.step(dt), flappy.isPlaying);
}

/* ───────── vinyl room ───────── */
function mountVinyl(sp) {
  const rec = $('[data-rec]', sp), label = $('[data-label]', sp), state = $('[data-state]', sp);
  const prog = $('[data-prog]', sp), time = $('[data-time]', sp), title = $('[data-title]', sp), artist = $('[data-artist]', sp);
  const knob = $('[data-knob]', sp), rpmEl = $('[data-rpm]', sp), name = $('[data-wave]', sp);
  let playing = true, angle = 0, rpm = 33, t = 0, cur = 0, scratching = false, loved = false;
  const setPlaying = (p) => {
    playing = p;
    sp.classList.toggle('is-playing', p);
    state.textContent = p ? 'now spinning' : 'paused';
  };
  const load = (i) => {
    cur = i; t = 0;
    prog.style.width = '0%';
    time.textContent = '0:00';
    label.innerHTML = songArt(TRACKS[i].id);
    title.textContent = TRACKS[i].t; artist.textContent = TRACKS[i].a;
    retrigger(rec, 'is-drop');
    setPlaying(true);
  };

  // record: drag to scratch, tap to play/pause
  let pid = null, lastA = 0, travel = 0;
  const angleAt = (e) => { const r = rec.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)); };
  rec.addEventListener('pointerdown', (e) => { pid = e.pointerId; rec.setPointerCapture(pid); lastA = angleAt(e); travel = 0; scratching = true; });
  rec.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pid) return;
    const a = angleAt(e);
    let d = a - lastA;
    if (d > Math.PI) d -= 2 * Math.PI;
    if (d < -Math.PI) d += 2 * Math.PI;
    lastA = a; travel += Math.abs(d);
    angle += (d * 180) / Math.PI;
    rec.style.transform = `rotate(${angle % 360}deg)`;
    if (travel > 0.08) { state.textContent = 'scratchin’ ✦'; sp.classList.add('is-scratch'); }
  });
  const up = (e) => {
    if (e.pointerId !== pid) return;
    pid = null; scratching = false; sp.classList.remove('is-scratch');
    if (travel <= 0.08) setPlaying(!playing);
    else state.textContent = playing ? 'now spinning' : 'paused';
  };
  rec.addEventListener('pointerup', up);
  rec.addEventListener('pointercancel', up);

  $('[data-arm]', sp).addEventListener('click', () => setPlaying(!playing));
  $('[data-toggle]', sp).addEventListener('click', (e) => { retrigger(e.currentTarget, 'is-press'); setPlaying(!playing); });
  knob.addEventListener('click', () => {
    rpm = rpm === 33 ? 45 : rpm === 45 ? 78 : 33;
    knob.style.setProperty('--k', `${rpm === 33 ? 0 : rpm === 45 ? 70 : 140}deg`);
    rpmEl.textContent = rpm;
    toast(sp, `${rpm} rpm${rpm === 78 ? ' — chipmunk mode' : ''}`);
  });
  const seek = $('[data-seek]', sp);
  seek.addEventListener('click', (e) => {
    const r = seek.getBoundingClientRect();
    t = clamp((e.clientX - r.left) / r.width, 0, 1) * 30;
    prog.style.width = `${(t / 30) * 100}%`;
    time.textContent = `0:${String(Math.floor(t)).padStart(2, '0')}`;
  });
  $('[data-heart]', sp).addEventListener('click', (e) => {
    loved = !loved;
    e.currentTarget.textContent = loved ? '♥' : '♡';
    e.currentTarget.classList.toggle('is-on', loved);
    if (loved) { burstAt(sp, e.currentTarget, ['♥'], 7); toast(sp, 'you + 38 others love this'); }
  });
  $$('[data-track]', sp).forEach((b) => b.addEventListener('click', () => {
    const i = +b.dataset.track;
    b.dataset.track = cur;
    b.innerHTML = songArt(TRACKS[cur].id, true);
    retrigger(b, 'is-swap');
    load(i);
    toast(sp, `now spinning: ${TRACKS[i].t}`);
  }));
  const req = $('[data-req]', sp);
  req.addEventListener('click', () => {
    burstAt(sp, req, ['♪', '♫', '✦'], 7);
    req.textContent = '✦ sent! mia gets a ping';
    req.classList.add('is-sent');
    clearTimeout(req._t);
    req._t = setTimeout(() => { req.textContent = '✦ request a song for mia'; req.classList.remove('is-sent'); }, 2600);
  });
  const wave = () => retrigger(name, 'is-wave');
  name.addEventListener('pointerenter', wave);
  name.addEventListener('click', wave);

  return loop(sp, (dt) => {
    if (playing && !scratching) {
      angle += dt * rpm * 6 * 0.55;
      t += dt * (rpm / 33);
      if (t >= 30) load((cur + 1) % TRACKS.length);
    }
    rec.style.transform = `rotate(${angle % 360}deg)`;
    prog.style.width = `${(t / 30) * 100}%`;
    time.textContent = `0:${String(Math.floor(t)).padStart(2, '0')}`;
  });
}

/* ───────── pixel world ───────── */
function mountPixel(sp) {
  const me = $('[data-me]', sp), say = $('[data-say]', sp), dlg = $('[data-dialog]', sp), dbody = $('[data-dbody]', sp);
  const stick = $('[data-stick]', sp), knob = $('i', stick), tip = $('.px-tip', sp), hud = $('[data-hearts]', sp);
  const pos = { x: 50, y: 160 };
  const OBJ = { photos: { x: 22, y: 118 }, arcade: { x: 81, y: 134 }, guest: { x: 16, y: 163 } };
  let target = null, joy = null, facing = 1, walking = false, hearts = 1204, sayT, timers = [];
  const notes = MIA.notes.map((n) => ({ ...n }));

  const talk = (txt, ms = 1800) => {
    say.textContent = txt;
    say.classList.add('is-on');
    clearTimeout(sayT);
    sayT = setTimeout(() => say.classList.remove('is-on'), ms);
  };
  talk(`hi! i'm ${MIA.name}`, 2600);
  const addHeart = (n = 1) => { hearts += n; hud.textContent = `♥ ${hearts}`; };
  const hideTip = () => tip.classList.add('is-gone');

  sp.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, [data-dialog], [data-stick], [data-me]')) return;
    const p = local(e, sp);
    if (p.cy < 80) return;
    target = { x: clamp(p.cx, 6, 94), y: clamp(p.cy, 86, 204) };
    const m = document.createElement('i');
    m.className = 'px-mark';
    m.style.left = `${target.x}cqw`; m.style.top = `${target.y}cqw`;
    sp.append(m);
    setTimeout(() => m.remove(), 600);
    hideTip();
  });
  $$('[data-obj]', sp).forEach((b) => b.addEventListener('click', () => {
    const kind = b.dataset.obj;
    target = { ...OBJ[kind], then: () => openDlg(kind) };
    talk(pick(['omw!', 'coming!', 'hold on…']));
    hideTip();
  }));
  $$('[data-tree]', sp).forEach((b) => b.addEventListener('click', () => { retrigger(b, 'is-shake'); burstAt(sp, b, ['♥', '🍎', '♥'], 5); addHeart(); }));
  $('[data-sun]', sp).addEventListener('click', () => {
    const night = sp.dataset.night !== '1';
    sp.dataset.night = night ? '1' : '0';
    talk(night ? 'night mode ✦' : 'good morning!!');
  });
  $$('[data-cloud]', sp).forEach((b) => b.addEventListener('click', () => { retrigger(b, 'is-puff'); talk('☁ poof'); }));
  $('[data-a]', sp).addEventListener('click', () => {
    const near = Object.entries(OBJ).find(([, o]) => Math.hypot(o.x - pos.x, o.y - pos.y) < 18);
    if (near) openDlg(near[0]);
    else { retrigger(me, 'is-jump'); talk(pick(['!', 'wheee', 'boing', 'hi :)'])); }
  });

  // joystick
  let jid = null;
  stick.addEventListener('pointerdown', (e) => { jid = e.pointerId; stick.setPointerCapture(jid); moveJoy(e); hideTip(); });
  const moveJoy = (e) => {
    const r = stick.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const max = r.width * 0.32, d = Math.hypot(dx, dy);
    if (d > max) { dx = (dx / d) * max; dy = (dy / d) * max; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    joy = d > 4 ? { x: dx / max, y: dy / max } : null;
    target = null;
  };
  stick.addEventListener('pointermove', (e) => e.pointerId === jid && moveJoy(e));
  const endJoy = (e) => { if (e.pointerId !== jid) return; jid = null; joy = null; knob.style.transform = ''; };
  stick.addEventListener('pointerup', endJoy);
  stick.addEventListener('pointercancel', endJoy);

  // dialogs
  $('[data-close]', sp).addEventListener('click', () => { dlg.hidden = true; timers.forEach(clearTimeout); });
  function openDlg(kind) {
    timers.forEach(clearTimeout); timers = [];
    dlg.hidden = false;
    retrigger(dlg, 'is-open');
    dbody.onclick = null; dbody.onpointerdown = null;
    if (kind === 'photos') {
      let i = 0;
      const draw = () => { dbody.innerHTML = `<p class="px-dh">PHOTOS ${i + 1}/${PHOTOS.length}</p><div class="px-photo">${pic(PHOTOS[i].id)}</div><p class="px-cap">${PHOTOS[i].cap}</p><div class="px-nav"><button data-p="-1">◀</button><button data-p="1">▶</button></div>`; };
      draw();
      dbody.onclick = (e) => { const b = e.target.closest('[data-p]'); if (b) { i = (i + +b.dataset.p + PHOTOS.length) % PHOTOS.length; draw(); } };
      talk('my photo house!');
    }
    if (kind === 'arcade') {
      let st = 'idle', t0 = 0, best = 212;
      dbody.innerHTML = '<p class="px-dh">REACTION TEST</p><button class="px-react">PRESS TO START</button><p class="px-small" data-best>BEST: NOAH 212MS</p>';
      const btn = $('.px-react', dbody), bestEl = $('[data-best]', dbody);
      const set = (txt, cls = '') => { btn.textContent = txt; btn.className = `px-react ${cls}`; };
      btn.onpointerdown = (e) => {
        e.preventDefault();
        if (st === 'idle' || st === 'done') {
          st = 'wait'; set('WAIT…', 'is-wait');
          timers.push(setTimeout(() => { st = 'go'; t0 = performance.now(); set('NOW!!', 'is-go'); }, 900 + Math.random() * 1800));
        } else if (st === 'wait') {
          timers.forEach(clearTimeout); st = 'done'; set('TOO SOON! AGAIN?', 'is-bad');
        } else if (st === 'go') {
          const ms = Math.round(performance.now() - t0);
          st = 'done';
          if (ms < best) { best = ms; bestEl.textContent = `BEST: YOU ${ms}MS`; talk('new record!!'); addHeart(5); }
          set(`${ms}MS · AGAIN?`, ms <= best ? 'is-go' : '');
        }
      };
      talk('beat noah!');
    }
    if (kind === 'guest') {
      const draw = () => { dbody.innerHTML = `<p class="px-dh">GUESTBOOK</p><ul class="px-notes">${notes.map((n) => `<li><b>${n.by.toUpperCase()}:</b> ${n.t}</li>`).join('')}</ul><button class="px-btn" data-sign>SIGN IT ✎</button>`; const ul = $('.px-notes', dbody); ul.scrollTop = ul.scrollHeight; };
      draw();
      dbody.onclick = (e) => {
        if (!e.target.closest('[data-sign]')) return;
        notes.push({ t: pick(['hi mia!!', 'cute world', 'ur photos are everything', 'visiting again tmrw']), by: 'you' });
        draw(); addHeart(); talk('thank u ♥');
      };
    }
  }

  const place = () => {
    me.style.left = `${pos.x - 5.5}cqw`;
    me.style.top = `${pos.y - 9}cqw`;
  };
  place();
  const stop = loop(sp, (dt) => {
    let vx = 0, vy = 0;
    if (joy) { vx = joy.x; vy = joy.y; }
    else if (target) {
      const dx = target.x - pos.x, dy = target.y - pos.y, d = Math.hypot(dx, dy);
      if (d < 1.2) { const then = target.then; target = null; then?.(); }
      else { vx = dx / d; vy = dy / d; }
    }
    pos.x = clamp(pos.x + vx * 32 * dt, 6, 94);
    pos.y = clamp(pos.y + vy * 32 * dt, 86, 204);
    const mv = Math.abs(vx) + Math.abs(vy) > 0.05;
    if (mv !== walking) { walking = mv; me.classList.toggle('is-walk', mv); }
    if (Math.abs(vx) > 0.15) { facing = vx < 0 ? -1 : 1; me.style.setProperty('--face', facing); }
    place();
  }, () => Boolean(joy || target));
  return () => { stop(); timers.forEach(clearTimeout); clearTimeout(sayT); };
}

/* ───────── scrapbook ───────── */
function mountScrap(sp) {
  const front = zStack(5);
  $$('[data-pol]', sp).forEach((p) => draggable(p, { within: sp, onStart: () => front(p), onTap: () => p.classList.toggle('is-flipped') }));
  const star = $('[data-star]', sp);
  draggable(star, { within: sp, onStart: () => front(star), onTap: () => { retrigger(star, 'is-spin'); burstAt(sp, star, ['✦', '★', '✧'], 7); } });
  let likes = parseInt(MIA.likes.replace(/,/g, ''), 10);
  const likeBtn = $('[data-likes]', sp);
  likeBtn.addEventListener('click', () => {
    likes++;
    $('[data-n]', likeBtn).textContent = likes.toLocaleString('en-US');
    retrigger(likeBtn, 'is-thump');
    burstAt(sp, likeBtn, ['♥'], 6);
  });
  const cass = $('[data-cass]', sp), cassL = $('[data-cass-l]', sp);
  cass.addEventListener('click', () => {
    const paused = cass.classList.toggle('is-paused');
    cassL.textContent = paused ? 'paused · tap to play' : 'currently on repeat · tap';
    if (!paused) burstAt(sp, cass, ['♪', '♫'], 5);
  });
  $$('[data-note]', sp).forEach((n) => draggable(n, { within: sp, onStart: () => front(n), onTap: () => retrigger(n, 'is-wiggle') }));
  const colors = ['#FFE45C', '#FFB3D1', '#B5E8FF', '#C8F59A', '#E3D4FF'];
  const lines = ['hi mia!!', 'ur page is so pretty', 'this photo belongs on a wall', 'rematch me', 'we need more days like this!!', 'playlist pls'];
  const extras = [];
  $('[data-sign]', sp).addEventListener('click', () => {
    const n = document.createElement('p');
    n.className = 'sc-note sc-note--new';
    n.style.setProperty('--c', pick(colors));
    n.style.setProperty('--r', `${(Math.random() - 0.5) * 16}deg`);
    n.style.left = `${6 + Math.random() * 56}cqw`;
    n.style.top = `${96 + Math.random() * 60}cqw`;
    n.innerHTML = `${pick(lines)}<span>— you</span>`;
    sp.append(n);
    front(n);
    draggable(n, { within: sp, onStart: () => front(n), onTap: () => retrigger(n, 'is-wiggle') });
    extras.push(n);
    if (extras.length > 5) extras.shift().remove();
    toast(sp, 'stuck it ✎ mia gets a ping');
  });
  const title = $('[data-title]', sp);
  let c = 0;
  title.addEventListener('click', () => { c = (c + 1) % 4; title.dataset.c = c; burstAt(sp, title, ['✧', '✦', '♡'], 6); });
  return () => {};
}

/* ───────── story mode ───────── */
function mountStory(sp) {
  const frames = $$('.st-frame', sp), bars = $$('.st-bars i', sp);
  let i = 0, p = 0, held = false, holdT;
  const DUR = 5;
  const show = (n) => {
    i = (n + frames.length) % frames.length; p = 0;
    frames.forEach((f, j) => f.classList.toggle('is-on', j === i));
    bars.forEach((bar, j) => bar.style.setProperty('--p', j < i ? 1 : 0));
  };
  $$('[data-zone]', sp).forEach((z) => {
    z.addEventListener('pointerdown', () => { clearTimeout(holdT); holdT = setTimeout(() => { held = true; }, 230); });
    z.addEventListener('pointerup', (e) => {
      clearTimeout(holdT);
      if (held) { held = false; return; }
      const r = sp.getBoundingClientRect();
      show((e.clientX - r.left) / r.width < 0.33 ? i - 1 : i + 1);
    });
    z.addEventListener('pointerleave', () => { clearTimeout(holdT); held = false; });
  });
  $$('[data-pop]', sp).forEach((b) => b.addEventListener('click', () => { retrigger(b, 'is-pop'); burstAt(sp, b, [[...b.textContent][0]], 5); }));
  const poll = $('[data-poll]', sp);
  poll.addEventListener('click', (e) => {
    const b = e.target.closest('[data-vote]');
    if (!b || poll.classList.contains('is-voted')) return;
    const mine = +b.dataset.vote;
    const pct = mine === 0 ? [73, 27] : [70, 30];
    poll.classList.add('is-voted');
    $$('[data-vote]', poll).forEach((x, j) => { x.style.setProperty('--w', `${pct[j]}%`); $('b', x).textContent = `${pct[j]}%`; x.classList.toggle('is-mine', j === mine); });
    toast(sp, 'voted ✓ mia will see it');
  });
  const ask = $('[data-ask]', sp);
  ask.addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('input', ask);
    if (!inp.value.trim()) { retrigger(ask, 'is-shake'); inp.focus(); return; }
    ask.innerHTML = '<p>ask mia anything</p><span class="st-sent">sent ✓ mia will answer in her story</span>';
  });
  const reply = $('[data-reply]', sp);
  reply.addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('input', reply);
    if (!inp.value.trim()) return;
    inp.value = '';
    inp.blur();
    toast(sp, 'note sent ✎');
  });
  $('[data-like]', reply).addEventListener('click', (e) => {
    const b = e.currentTarget;
    b.textContent = '♥'; b.classList.add('is-on');
    burstAt(sp, b, ['♥'], 7);
  });
  const av = $('[data-wink]', sp);
  av.addEventListener('click', () => {
    av.innerHTML = blobAvatar(candy, { id: 'sthw', mood: 'wink' });
    setTimeout(() => { av.innerHTML = blobAvatar(candy, { id: 'sth' }); }, 900);
  });
  return loop(sp, (dt) => {
    const typing = sp.contains(document.activeElement) && document.activeElement.tagName === 'INPUT';
    const paused = held || typing;
    sp.classList.toggle('is-held', paused);
    if (!paused) { p += dt / DUR; if (p >= 1) show(i + 1); }
    bars.forEach((b, j) => b.style.setProperty('--p', j < i ? 1 : j === i ? p : 0));
  });
}

const mounts = { desk: mountDesk, vinyl: mountVinyl, pixel: mountPixel, scrap: mountScrap, story: mountStory };
export function mountSpace(style, screen) {
  const sp = $('.sp', screen);
  return sp ? mounts[style](sp) : () => {};
}

/* ───────── creation flow ───────── */
// A touch indicator that taps through `plan().targets` on its own, to show what picking feels like.
// It runs once, and stops for good the moment a real finger or mouse touches the screen.
function tapDemo(sp, plan) {
  const finger = document.createElement('i');
  finger.className = 'fl-finger';
  finger.setAttribute('aria-hidden', 'true');
  sp.append(finger);
  let ran = false, touched = false, timers = [];
  const stopDemo = () => {
    timers.forEach(clearTimeout); timers = [];
    finger.classList.remove('is-on');
    document.removeEventListener('auramy:motion-change', onMotion);
    document.removeEventListener('visibilitychange', onMotion);
  };
  const onMotion = () => { if (motionPaused() || document.hidden) stopDemo(); };
  sp.addEventListener('pointerdown', (e) => {
    if (!e.isTrusted) return;
    touched = true;
    stopDemo();
  }, true);
  const moveTo = (el) => {
    const r = el.getBoundingClientRect(), s = sp.getBoundingClientRect(), k = 100 / s.width;
    finger.style.left = `${(r.left - s.left + r.width * 0.55) * k}cqw`;
    finger.style.top = `${(r.top - s.top + r.height * 0.6) * k}cqw`;
  };
  return () => {
    if (ran || touched || motionPaused() || document.hidden) return;
    ran = true;
    const { targets, aim = (el) => el, isOn, done } = plan();
    const press = (b) => { if (!isOn(b)) b.click(); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { targets.forEach(press); done?.(); return; }
    document.addEventListener('auramy:motion-change', onMotion);
    document.addEventListener('visibilitychange', onMotion);
    let t = 500;
    timers.push(setTimeout(() => { moveTo(aim(targets[0])); finger.classList.add('is-on'); }, t));
    targets.forEach((b, i) => {
      if (i) timers.push(setTimeout(() => moveTo(aim(b)), t));
      t += 520;
      timers.push(setTimeout(() => { retrigger(finger, 'is-tap'); press(b); }, t));
      t += 420;
    });
    timers.push(setTimeout(() => { stopDemo(); done?.(); }, t + 300));
  };
}

// onNext() is called by each screen's call-to-action. Returns a small controller
// (the question screen exposes demo(): it taps a few answers itself to show how picking feels).
export function mountHow(key, sp, onNext) {
  const ctl = { demo() {} };
  $$('[data-next-step]', sp).forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); retrigger(b, 'is-press'); onNext(); }));

  if (key === 'hi') {
    const inp = $('[data-name]', sp), nameEl = $('[data-card-name]', sp), handle = $('[data-card-handle]', sp), art = $('[data-card-art]', sp);
    const moods = ['happy', 'wink', 'wow', 'love'];
    let m = 0, colors = candy;
    const paint = () => {
      const v = inp.value.trim();
      const a = v ? auraFor(v) : null;
      colors = a ? a.colors : candy;
      nameEl.textContent = v.toLowerCase() || 'you';
      handle.textContent = a ? a.handle : 'you';
      art.style.background = a ? a.gradient : '';
      art.innerHTML = blobAvatar(colors, { id: 'flc' });
    };
    inp.addEventListener('input', paint);
    const selfie = $('[data-selfie]', sp);
    selfie.addEventListener('click', () => {
      m = (m + 1) % moods.length;
      retrigger(sp, 'is-flash');
      $('svg', selfie).outerHTML = blobAvatar(colors, { id: 'flh', mood: moods[m] });
      $('small', selfie).textContent = pick(['looking good', 'one more?', 'iconic', 'serve']);
    });
  }

  if (key === 'faves') {
    const grid = $('[data-faves]', sp), search = $('[data-search]', sp), cta = $('[data-next-step]', sp);
    const count = () => {
      const n = $$('.fv-t.is-on', grid).length;
      cta.textContent = n ? `build my space · ${n} picked ✦` : 'skip — build my space ✦';
    };
    grid.addEventListener('click', (e) => {
      const b = e.target.closest('.fv-t');
      if (!b) return;
      const on = b.classList.toggle('is-on');
      b.setAttribute('aria-pressed', on);
      retrigger(b, 'is-tick');
      if (on) burstAt(sp, $('.fv-obj', b), b.classList.contains('fv-t--song') ? ['♪', '♫'] : ['✦'], 4);
      count();
    });
    // search narrows the grid (no translucent "disabled" look — misses simply leave)
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      let any = false;
      $$('.fv-row', grid).forEach((row) => {
        let hit = false;
        $$('.fv-t', row).forEach((t) => { const ok = !q || t.dataset.q.includes(q); t.hidden = !ok; hit ||= ok; });
        row.hidden = !hit;
        any ||= hit;
      });
      grid.classList.toggle('is-empty', !any);
    });
    count();

    // auto-demo: one song, one movie, two books
    ctl.demo = tapDemo(sp, () => ({
      targets: ['birds', 'spider', 'heart', 'hunger'].map((id) => $(`[data-id="${id}"]`, grid)),
      aim: (b) => $('.fv-obj', b),
      isOn: (b) => b.classList.contains('is-on'),
      done: () => retrigger(cta, 'is-press'),
    }));
  }

  if (key === 'ask') {
    const ring = $('[data-ring]', sp), pct = $('[data-pct]', sp), pill = $('[data-pill]', sp), building = $('[data-building]', sp), cta = $('.fl-cta', sp);
    const single = $('[data-q="single"]', sp), multi = $('[data-q="multi"]', sp);
    const pills = ['✦ hanging your photos', '✦ tuning the record player', '✦ all set · polishing the last bits'];
    const update = () => {
      const a = $$('.on', single).length ? 1 : 0, b = $$('.on', multi).length;
      const v = Math.min(100, 73 + a * 13 + Math.min(b, 2) * 7);
      ring.style.strokeDashoffset = 264 * (1 - v / 100);
      pct.textContent = `${v}%`;
      pill.textContent = pills[Math.min(pills.length - 1, a + (b ? 1 : 0))];
      const done = v >= 100;
      building.textContent = done ? 'your space is ready ✦' : 'building your space…';
      cta.textContent = done ? 'see my space →' : 'skip for now →';
      cta.classList.toggle('is-ready', done);
      sp.classList.toggle('is-done', done);
    };
    single.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      $$('button', single).forEach((x) => x.classList.toggle('on', x === b));
      retrigger(b, 'is-tick');
      update();
    });
    multi.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (!b.classList.contains('on') && $$('.on', multi).length >= 3) { retrigger(multi, 'is-shake'); pill.textContent = '✦ three words max, drama queen'; return; }
      b.classList.toggle('on');
      retrigger(b, 'is-tick');
      update();
    });
    update();

    // auto-demo: tap a song and three words, then nudge the button
    const chip = (group, label) => $$('button', group).find((b) => b.textContent === label);
    ctl.demo = tapDemo(sp, () => ({
      targets: [chip(single, 'Birds of a Feather'), chip(multi, 'chaotic'), chip(multi, 'funny'), chip(multi, 'loyal')],
      isOn: (b) => b.classList.contains('on'),
      done: () => retrigger(cta, 'is-press'),
    }));
  }

  if (key === 'share') {
    const chat = $('[data-chat]', sp), form = $('[data-send]', sp);
    const replies = ['lmaooo', 'ok but that photo 😭', 'teach me pls', 'rematch?', 'SQUISHED', 'signing ur wall rn'];
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = $('input', form);
      const v = inp.value.trim();
      if (!v) return;
      const me = document.createElement('p');
      me.className = 'bub bub--me';
      me.textContent = v;
      chat.append(me);
      inp.value = '';
      setTimeout(() => {
        const who = pick(['jay', 'lu', 'noah', 'ava']);
        const r = document.createElement('div');
        r.className = 'bubrow';
        r.innerHTML = `${avatar(who, 'bub__av')}<p class="bub"><small>${who}</small>${pick(replies)}</p>`;
        chat.append(r);
        trim();
      }, 900);
      trim();
    });
    const trim = () => { const rows = [...chat.children].filter((c) => !c.matches('.bub--card')); if (rows.length > 6) rows[1]?.remove(); };
  }
  return ctl;
}
