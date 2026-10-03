const ALBUMS = [
  { title: 'The Art of Loving', artist: 'Olivia Dean', cover: '/assets/img/albums/the-art-of-loving.jpg' },
  { title: 'The Great Divide', artist: 'Noah Kahan', cover: '/assets/img/albums/the-great-divide.jpg' },
  { title: 'you seem pretty sad for a girl so in love', artist: 'Olivia Rodrigo', cover: '/assets/img/albums/pretty-sad.jpg' },
];

// A visual listening party: cover selection and hearts only; it makes no audio request or playback claim.
export function initAlbumParty(root) {
  if (!root) return () => {};
  const abort = new AbortController();
  const { signal } = abort;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  const likes = [38, 24, 31];
  let visible = false;
  let timer = 0;
  let closed = false;

  root.innerHTML = `
    <p class="album-party__eyebrow">the group chat is listening</p>
    <div class="album-party__covers" aria-label="Choose an album">${ALBUMS.map((album, index) => `
      <button class="album-party__cover" type="button" data-album-index="${index}" aria-label="${album.title} by ${album.artist}. ${index === 0 ? 'Selected; tap again to like it.' : 'Select this album.'}">
        <img src="${album.cover}" alt="" width="600" height="600">
      </button>`).join('')}</div>
    <div class="album-party__now"><p>now in the room</p><h4 data-album-title></h4><span data-album-artist></span></div>
    <p class="album-party__likes"><b data-album-likes>38</b> hearts are in this room <span aria-hidden="true">♥</span></p>
    <p class="album-party__hint">tap a cover to choose it. tap it again to send love.</p>
    <p class="album-party__live" role="status" aria-live="polite" data-album-live></p>`;

  const covers = [...root.querySelectorAll('[data-album-index]')];
  const title = root.querySelector('[data-album-title]');
  const artist = root.querySelector('[data-album-artist]');
  const likesEl = root.querySelector('[data-album-likes]');
  const live = root.querySelector('[data-album-live]');

  function quiet() {
    return closed || reduced.matches || document.hidden || document.body.classList.contains('is-motion-paused');
  }
  function clearAmbient() {
    window.clearInterval(timer);
    timer = 0;
    root.querySelectorAll('.album-party__heart--ambient').forEach((heart) => heart.remove());
  }
  function ambientHeart() {
    if (quiet() || root.querySelectorAll('.album-party__heart--ambient').length >= 7) return;
    const heart = document.createElement('span');
    heart.className = 'album-party__heart album-party__heart--ambient';
    heart.setAttribute('aria-hidden', 'true');
    heart.textContent = '♥';
    heart.style.setProperty('--x', `${12 + Math.random() * 76}%`);
    heart.style.setProperty('--drift', `${-28 + Math.random() * 56}px`);
    heart.style.setProperty('--delay', `${Math.random() * 160}ms`);
    root.append(heart);
    window.setTimeout(() => heart.remove(), 3200);
  }
  function syncAmbient() {
    clearAmbient();
    const awake = visible && !quiet();
    root.classList.toggle('is-awake', awake);
    root.dataset.awake = String(awake);
    if (!awake) return;
    ambientHeart();
    timer = window.setInterval(ambientHeart, 980);
  }
  function burst() {
    likes[active] += 1;
    likesEl.textContent = likes[active];
    if (quiet()) {
      live.textContent = `Love sent to ${ALBUMS[active].title}. ${likes[active]} hearts are in this room.`;
      return;
    }
    const selected = covers[active].getBoundingClientRect();
    const bounds = root.getBoundingClientRect();
    for (let index = 0; index < 7; index += 1) {
      const heart = document.createElement('span');
      heart.className = 'album-party__heart album-party__heart--burst';
      heart.setAttribute('aria-hidden', 'true');
      heart.textContent = '♥';
      heart.style.setProperty('--x', `${selected.left - bounds.left + selected.width / 2}px`);
      heart.style.setProperty('--y', `${selected.top - bounds.top + selected.height / 2}px`);
      heart.style.setProperty('--dx', `${-75 + Math.random() * 150}px`);
      heart.style.setProperty('--dy', `${-85 - Math.random() * 105}px`);
      heart.style.setProperty('--spin', `${-40 + Math.random() * 80}deg`);
      root.append(heart);
      window.setTimeout(() => heart.remove(), 920);
    }
    live.textContent = `Love sent to ${ALBUMS[active].title}. ${likes[active]} hearts are in this room.`;
  }
  function select(index, announce = false) {
    active = index;
    covers.forEach((cover, coverIndex) => {
      const selected = coverIndex === active;
      cover.classList.toggle('is-selected', selected);
      cover.setAttribute('aria-pressed', String(selected));
      cover.setAttribute('aria-label', `${ALBUMS[coverIndex].title} by ${ALBUMS[coverIndex].artist}. ${selected ? 'Selected; tap again to like it.' : 'Select this album.'}`);
    });
    title.textContent = ALBUMS[active].title;
    artist.textContent = ALBUMS[active].artist;
    likesEl.textContent = likes[active];
    if (announce) live.textContent = `${ALBUMS[active].title} by ${ALBUMS[active].artist} selected.`;
  }

  covers.forEach((cover, index) => cover.addEventListener('click', () => {
    if (index === active) burst();
    else select(index, true);
  }, { signal }));
  document.addEventListener('visibilitychange', syncAmbient, { signal });
  document.addEventListener('auramy:motion-change', syncAmbient, { signal });
  reduced.addEventListener?.('change', syncAmbient, { signal });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .25;
    syncAmbient();
  }, { threshold: .25 });
  observer.observe(root);
  select(0);

  return () => {
    closed = true;
    abort.abort();
    observer.disconnect();
    clearAmbient();
    root.classList.remove('is-awake');
    delete root.dataset.awake;
    root.replaceChildren();
  };
}
