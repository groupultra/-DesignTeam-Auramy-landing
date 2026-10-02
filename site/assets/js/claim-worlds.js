const mounted = new WeakMap();

const WORLDS = [
  {
    id: 'lu',
    name: 'lu',
    portrait: '/assets/img/people/lu.jpg',
    photo: '/assets/img/social/lu-cat.jpg',
    photoLabel: 'pet shrine',
    album: '/assets/img/albums/the-art-of-loving.jpg',
    friends: ['/assets/img/av/ava.jpg', '/assets/img/av/eli.jpg', '/assets/img/av/zara.jpg'],
    browser: ['lu’s soft corner', 'tiny journal / 18 entries'],
    music: ['miso fm', 'cat nap • on repeat'],
    note: ['a tiny article', 'the sun moves across the floor and miso follows it. i’m learning to sit still.'],
  },
  {
    id: 'noah',
    name: 'noah',
    portrait: '/assets/img/people/noah.jpg',
    photo: '/assets/img/social/noah-skate.jpg',
    photoLabel: 'skate roll',
    album: '/assets/img/albums/the-great-divide.jpg',
    friends: ['/assets/img/av/lu.jpg', '/assets/img/av/ava.jpg', '/assets/img/av/jay.jpg'],
    browser: ['noah after school', 'skate spots / camera roll'],
    music: ['late push', 'the playlist for one more lap'],
    note: ['field notes', 'the best trick was not landing it. three tries, everybody cheering anyway.'],
  },
  {
    id: 'jay',
    name: 'jay',
    portrait: '/assets/img/people/jay.jpg',
    photo: '/assets/img/social/jay-studio.jpg',
    photoLabel: 'studio proof',
    album: '/assets/img/albums/pretty-sad.jpg',
    friends: ['/assets/img/av/lu.jpg', '/assets/img/av/noah.jpg', '/assets/img/av/zara.jpg'],
    art: '/assets/img/editorial/oc-courier.jpg',
    browser: ['jay’s oc archive', 'characters who need snacks'],
    music: ['studio loop', 'draw / erase / draw again'],
    note: ['studio letter', 'my newest character collects blue tickets. she is brave in a very small way.'],
  },
];

const phaseOrder = 'compressed burst expanded switch';

function artwork(world) {
  return `
    <section class="claim-worlds__world" data-world="${world.id}">
      <div class="claim-worlds__portrait">
        <img src="${world.portrait}" alt="" loading="lazy" decoding="async">
        <span>@${world.name}</span>
      </div>
      <article class="claim-worlds__facet claim-worlds__facet--photo">
        <img src="${world.photo}" alt="" loading="lazy" decoding="async">
        <b>${world.photoLabel}</b><small>photos</small>
      </article>
      <article class="claim-worlds__facet claim-worlds__facet--browser">
        <div class="claim-worlds__chrome"><i></i><i></i><i></i><span>aura.my/${world.name}</span></div>
        <strong>${world.browser[0]}</strong><small>${world.browser[1]}</small>
        <div class="claim-worlds__browser-lines"><i></i><i></i><i></i></div>
      </article>
      <article class="claim-worlds__facet claim-worlds__facet--music">
        <img class="claim-worlds__album" src="${world.album}" alt="" loading="lazy" decoding="async"><span>now playing</span>
        <strong>${world.music[0]}</strong><small>${world.music[1]}</small>
        <div class="claim-worlds__equalizer"><i></i><i></i><i></i><i></i><i></i></div>
      </article>
      <article class="claim-worlds__facet claim-worlds__facet--note">
        <b>${world.note[0]}</b><span>${world.note[1]}</span>
        <i class="claim-worlds__scribble">✦</i>
      </article>
      <article class="claim-worlds__facet claim-worlds__facet--friends">
        <div class="claim-worlds__avatar-strip">${world.friends.map((friend) => `<img src="${friend}" alt="" loading="lazy" decoding="async">`).join('')}</div>
        <span>friends<br>are here</span>
      </article>
      ${world.art ? `<article class="claim-worlds__facet claim-worlds__facet--art"><img src="${world.art}" alt="" loading="lazy" decoding="async"><span>oc<br>courier</span></article>` : ''}
      <span class="claim-worlds__burst claim-worlds__burst--pink">✦</span>
      <span class="claim-worlds__burst claim-worlds__burst--lime">✳</span>
      <span class="claim-worlds__burst claim-worlds__burst--blue">✦</span>
    </section>`;
}

function template() {
  return `<div class="claim-worlds" data-claim-worlds data-world="lu" data-phase="compressed" data-phases="${phaseOrder}" data-running="false" aria-hidden="true">
    <div class="claim-worlds__wash"></div>
    <div class="claim-worlds__marquee"><div class="claim-worlds__marquee-line"><span>music</span><b>✦</b><span>photos</span><b>✦</b><span>pets</span><b>✦</b><span>writing</span><b>✦</b><span>friends</span><b>✦</b><span>your little site</span><b>✦</b><span>music</span><b>✦</b><span>photos</span><b>✦</b></div></div>
    <div class="claim-worlds__stage">${WORLDS.map(artwork).join('')}</div>
  </div>`;
}

/**
 * Mount the decorative CTA burst. The foreground form stays outside this host,
 * so every visual fragment is inert and ignores pointer input.
 */
export function initClaimWorlds(root) {
  if (!root) return () => {};
  mounted.get(root)?.();

  root.insertAdjacentHTML('afterbegin', template());
  const host = root.querySelector(':scope > [data-claim-worlds]');
  if (!host) return () => {};

  const abort = new AbortController();
  const { signal } = abort;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  let timer = 0;
  let resumeTimer = 0;
  let focusFrame = 0;
  let visible = false;
  let running = false;
  let destroyed = false;
  let inputHasFocus = false;
  let worldIndex = 0;

  const clearTimers = () => {
    clearTimeout(timer);
    clearTimeout(resumeTimer);
    cancelAnimationFrame(focusFrame);
    timer = 0;
    resumeTimer = 0;
    focusFrame = 0;
  };
  const motionPaused = () => reduced.matches || document.body.classList.contains('is-motion-paused');
  const canAnimate = () => !destroyed && visible && !document.hidden && !motionPaused() && !inputHasFocus;
  const setPhase = (phase) => { host.dataset.phase = phase; };
  const setStatic = () => {
    running = false;
    clearTimeout(timer);
    clearTimeout(resumeTimer);
    cancelAnimationFrame(focusFrame);
    timer = 0;
    resumeTimer = 0;
    focusFrame = 0;
    host.dataset.running = 'false';
    host.dataset.static = 'true';
    setPhase('expanded');
  };
  const schedule = (callback, delay) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = 0;
      if (canAnimate()) callback();
      else setStatic();
    }, delay);
  };
  const runCycle = () => {
    if (!canAnimate()) { setStatic(); return; }
    running = true;
    host.dataset.running = 'true';
    host.dataset.static = 'false';
    setPhase('compressed');
    schedule(() => {
      setPhase('burst');
      schedule(() => {
        setPhase('expanded');
        schedule(() => {
          setPhase('switch');
          schedule(() => {
            worldIndex = (worldIndex + 1) % WORLDS.length;
            host.dataset.world = WORLDS[worldIndex].id;
            runCycle();
          }, 360);
        }, 3000);
      }, 460);
    }, 900);
  };
  const sync = () => {
    if (canAnimate()) {
      if (!running) runCycle();
      return;
    }
    setStatic();
  };
  const onFocusIn = (event) => {
    if (!event.target.matches?.('input, textarea, select, [contenteditable="true"]')) return;
    inputHasFocus = true;
    sync();
  };
  const onFocusOut = () => {
    // Let a just-focused CTA settle before decorative motion starts again.
    cancelAnimationFrame(focusFrame);
    focusFrame = requestAnimationFrame(() => {
      focusFrame = 0;
      if (destroyed) return;
      if (root.contains(document.activeElement)) return;
      inputHasFocus = false;
      if (!canAnimate()) { sync(); return; }
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        resumeTimer = 0;
        sync();
      }, 1200);
    });
  };

  root.addEventListener('focusin', onFocusIn, { signal });
  root.addEventListener('focusout', onFocusOut, { signal });
  document.addEventListener('visibilitychange', sync, { signal });
  document.addEventListener('auramy:motion-change', sync, { signal });
  // A BFCache navigation keeps this module alive. Pause it there and resume the
  // existing host on return; only an actual unload should remove the backdrop.
  const onPageHide = (event) => {
    if (event.persisted) {
      visible = false;
      setStatic();
      return;
    }
    destroy();
  };
  const onPageShow = (event) => {
    if (!event.persisted || destroyed) return;
    const rect = root.getBoundingClientRect();
    visible = rect.bottom > 0 && rect.top < innerHeight;
    const active = document.activeElement;
    inputHasFocus = root.contains(active)
      && active.matches?.('input, textarea, select, [contenteditable="true"]');
    sync();
  };
  window.addEventListener('pagehide', onPageHide, { signal });
  window.addEventListener('pageshow', onPageShow, { signal });
  reduced.addEventListener('change', sync, { signal });
  observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio > 0;
    sync();
  }, { threshold: 0.08 });
  observer.observe(root);
  // A compact portrait exists before the observer reports, so the CTA never paints blank.
  sync();

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    running = false;
    clearTimers();
    abort.abort();
    observer?.disconnect();
    host.remove();
    mounted.delete(root);
  };
  mounted.set(root, destroy);
  return destroy;
}
