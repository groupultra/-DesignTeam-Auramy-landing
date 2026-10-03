import { PEOPLE, avatar, photoSrc } from './people.js';
import { personalSiteMarkup } from './for-previews.js';

// Each profile only uses that person's portrait and their own scene photograph.
const PROFILES = [
  { who: 'lu', app: 'gram', handle: 'lu.afterfive', color: '#ff8dbd', site: 'catdiary', scene: '/assets/img/social/lu-cat.jpg', bio: 'tiny drawings, evening walks, and a cat who has opinions.', link: 'open cat diary' },
  { who: 'noah', app: 'snap', handle: 'noah.rolls', color: '#ffe534', site: 'skatemap', scene: '/assets/img/social/noah-skate.jpg', bio: 'finding a curb, a line, and the right way home.', link: 'open skate spots' },
  { who: 'jay', app: 'gram', handle: 'jay.draws.late', color: '#b59cff', site: 'artistdesk', scene: '/assets/img/social/jay-studio.jpg', bio: 'paint on my hands. half-finished ideas everywhere.', link: 'open artist desk' },
  { who: 'ava', app: 'snap', handle: 'ava.in.stereo', color: '#58d6c3', site: 'fieldjournal', scene: '/assets/img/social/ava-camp.jpg', bio: 'campfire smoke, field notes, and one good flashlight.', link: 'open field journal' },
  { who: 'zara', app: 'links', handle: 'zara.reads.outside', color: '#ff9f5b', site: 'readinglog', scene: '/assets/img/social/zara-books.jpg', bio: 'reading slowly, underlining too much, keeping the good lines.', link: 'open reading log' },
  { who: 'eli', app: 'gram', handle: 'eli.uses.film', color: '#8ed6ff', site: 'contactsheet', scene: '/assets/img/social/eli-film.jpg', bio: 'film rolls, quiet streets, and frames worth keeping.', link: 'open contact sheet' },
];

const profilePhotos = (p) => {
  const portrait = photoSrc(p.who);
  return [p.scene, portrait, p.scene].map((src) => `<img src="${src}" alt="" loading="lazy" decoding="async">`).join('');
};

const gramMarkup = (p, person) => `<div class="social-profile__chrome social-profile__chrome--gram"><span aria-hidden="true">‹</span><b>${p.handle}</b><span aria-hidden="true">•••</span></div>
  <section class="social-profile__front social-profile__front--gram" aria-label="${person.name}'s profile">
    <div class="social-profile__identity">${avatar(p.who, 'social-profile__avatar')}<div class="social-profile__counts"><span><b>6</b> posts</span><span><b>184</b> followers</span><span><b>91</b> following</span></div></div>
    <div class="social-profile__bio"><b>${person.name}</b><p>${p.bio}</p><button type="button" class="social-profile__link" data-open-site aria-expanded="false">aura.my/${p.handle}<small>${p.link} ↗</small></button></div>
    <button class="social-profile__follow" type="button" data-follow aria-pressed="false">follow</button>
    <div class="social-profile__tabs" aria-hidden="true"><span>▦</span><span>⌑</span></div><div class="social-profile__photos">${profilePhotos(p)}</div>
  </section>`;

const snapMarkup = (p, person) => `<div class="social-profile__chrome social-profile__chrome--snap"><b>${p.handle}</b><span aria-hidden="true">☰</span></div>
  <section class="social-profile__front social-profile__front--snap" aria-label="${person.name}'s story">
    <div class="social-profile__story"><img src="${p.scene}" alt="${person.name}'s latest moment" loading="lazy" decoding="async"><div class="social-profile__story-top">${avatar(p.who, 'social-profile__avatar')}<span>today</span></div><p>${p.bio}</p><button class="social-profile__sticker" type="button" data-open-site aria-expanded="false" aria-label="${p.link}">↗ <span>${p.link}</span></button></div>
    <div class="social-profile__snap-strip"><img src="${photoSrc(p.who)}" alt="" loading="lazy" decoding="async"><span>tap the link sticker</span></div>
  </section>`;

const linksMarkup = (p, person) => `<div class="social-profile__chrome social-profile__chrome--links"><span>my links</span><span aria-hidden="true">⌁</span></div>
  <section class="social-profile__front social-profile__front--links" aria-label="${person.name}'s links">
    ${avatar(p.who, 'social-profile__avatar')}<h3>${person.name}'s reading corner</h3><p>${p.bio}</p>
    <button class="social-profile__link-card" type="button" data-open-site aria-expanded="false"><span>✦</span><b>${p.link}</b><i>→</i></button>
    <div class="social-profile__link-photo"><img src="${p.scene}" alt="A book moment from ${person.name}" loading="lazy" decoding="async"></div>
  </section>`;

const profileMarkup = (p) => {
  const person = PEOPLE[p.who];
  const front = p.app === 'gram' ? gramMarkup(p, person) : p.app === 'snap' ? snapMarkup(p, person) : linksMarkup(p, person);
  return `<article class="made-card social-profile social-profile--${p.app}" style="--profile-color:${p.color}" data-profile="${p.who}">
    ${front}
    <section class="social-profile__site" aria-label="${person.name}'s personal website" hidden>
      <button class="social-profile__back" type="button" data-close-site>← back</button>
      ${personalSiteMarkup(p.site, p)}
    </section>
  </article>`;
};

export function renderMade(row) {
  if (!row) return;
  row.innerHTML = PROFILES.map(profileMarkup).join('');
  if (row.dataset.socialProfileBound) return;
  row.dataset.socialProfileBound = 'true';
  row.addEventListener('click', (event) => {
    const card = event.target.closest('.social-profile');
    if (!card) return;
    const follow = event.target.closest('[data-follow]');
    if (follow) {
      const following = follow.getAttribute('aria-pressed') === 'true';
      follow.setAttribute('aria-pressed', String(!following));
      follow.textContent = following ? 'follow' : 'following';
      return;
    }
    const opening = Boolean(event.target.closest('[data-open-site]'));
    const closing = event.target.closest('[data-close-site]');
    if (!opening && !closing) return;
    const front = card.querySelector('.social-profile__front');
    const site = card.querySelector('.social-profile__site');
    front.hidden = opening;
    site.hidden = !opening;
    card.classList.toggle('is-site-open', opening);
    card.querySelector('[data-open-site]').setAttribute('aria-expanded', String(opening));
    (opening ? card.querySelector('[data-close-site]') : card.querySelector('[data-open-site]')).focus();
  });
}

export const LIVE = [
  ['noah', 'noah added a pin to skate spots', '1m'],
  ['zara', 'zara saved a line from a book', '2m'],
  ['ava', 'ava added a field note', '4m'],
  ['lu', 'lu added a cat drawing', 'now'],
  ['jay', 'jay pinned a new sketch', '6m'],
  ['eli', 'eli developed a roll of film', '9m'],
];
