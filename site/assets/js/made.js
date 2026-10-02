// Fictional profiles displayed as a local social feed. Opening the highlighted
// bio link reveals the person's Auramy space inside that same card.
import { PEOPLE, avatar, photoSrc } from './people.js';
import { previewMarkup } from './site-previews.js';

const PROFILES = [
  { who: 'noah', kind: 'sheet', handle: 'noah.rolls', posts: '18', followers: '284', following: '91', bio: 'skate clips, snack rankings & my deeply serious weekend fund.', link: 'open my weekend spreadsheet', color: '#d5ff00' },
  { who: 'lu', kind: 'pet', handle: 'lu.afterfive', posts: '27', followers: '419', following: '203', bio: 'scraps, tiny joys, and official fan account for Miso.', link: 'meet Miso on his own website', color: '#ffb7dc' },
  { who: 'jay', kind: 'oc', handle: 'jay.draws.late', posts: '42', followers: '1,092', following: '366', bio: 'I make playlists and characters who have more lore than me.', link: 'read Sora’s courier file', color: '#a5d8ff' },
  { who: 'ava', kind: 'selfie', handle: 'ava.in.stereo', posts: '31', followers: '672', following: '188', bio: 'photos I almost deleted, now with somewhere to live.', link: 'peek at my midnight page', color: '#ffd674' },
  { who: 'zara', kind: 'oc', handle: 'zara.reads.outside', posts: '14', followers: '351', following: '107', bio: 'books, walks, annotated margins, accidental sunsets.', link: 'my current character obsession', color: '#d6c4ff' },
  { who: 'eli', kind: 'pet', handle: 'eli.uses.film', posts: '23', followers: '538', following: '154', bio: 'film grain, friends, and Miso’s unauthorized close-ups.', link: 'Miso’s park diary', color: '#c7f5d5' },
];

const thumbnailSources = {
  noah: [photoSrc('noah'), '/assets/img/editorial/raw-friends.jpg', '/assets/img/editorial/oc-courier.jpg'],
  lu: [photoSrc('lu'), '/assets/img/editorial/miso.jpg', '/assets/img/editorial/raw-friends.jpg'],
  jay: [photoSrc('jay'), '/assets/img/editorial/oc-courier.jpg', '/assets/img/editorial/raw-friends.jpg'],
  ava: [photoSrc('ava'), '/assets/img/editorial/raw-selfie.jpg', '/assets/img/editorial/miso.jpg'],
  zara: [photoSrc('zara'), '/assets/img/editorial/oc-courier.jpg', '/assets/img/editorial/raw-friends.jpg'],
  eli: [photoSrc('eli'), '/assets/img/editorial/miso.jpg', '/assets/img/editorial/raw-friends.jpg'],
};
const thumbnails = (who) => (thumbnailSources[who] || [photoSrc(who)]).map((src) => `<img src="${src}" alt="" loading="lazy" decoding="async">`).join('');

const profileMarkup = (p) => {
  const person = PEOPLE[p.who];
  return `<article class="made-card social-profile" style="--profile-color:${p.color}" data-profile="${p.who}">
    <div class="social-profile__appbar"><span aria-hidden="true">‹</span><b>${p.handle}</b><span class="social-profile__dots" aria-hidden="true">•••</span></div>
    <section class="social-profile__front" aria-label="${person.name}'s fictional social profile">
      <div class="social-profile__identity">${avatar(p.who, 'social-profile__avatar')}<div class="social-profile__stats"><span><b>${p.posts}</b> posts</span><span><b>${p.followers}</b> followers</span><span><b>${p.following}</b> following</span></div></div>
      <div class="social-profile__bio"><b>${person.name} ${person.age}</b><p>${p.bio}</p><button class="social-profile__bio-link" type="button" data-open-site aria-expanded="false">aura.my/${person.name} ↗<small>${p.link}</small></button></div>
      <div class="social-profile__actions"><button type="button" data-follow aria-pressed="false">follow</button><span class="social-profile__demo-inbox">demo inbox ♡</span></div>
      <p class="social-profile__demo-status">a preview of your social profile</p>
      <div class="social-profile__tabs" aria-hidden="true"><span>▦</span><span>♙</span></div>
      <div class="social-profile__thumbs">${thumbnails(p.who)}</div>
    </section>
    <section class="social-profile__site" aria-label="${person.name}'s local website preview" hidden>
      <button class="social-profile__back" type="button" data-close-site>← back to profile</button>
      <p class="social-profile__local">LOCAL DEMO · AURAMY SPACE</p>${previewMarkup(p.kind, true)}
    </section>
    <footer class="social-profile__caption">fictional person · local demo</footer>
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
    const open = event.target.closest('[data-open-site]');
    const close = event.target.closest('[data-close-site]');
    const follow = event.target.closest('[data-follow]');
    if (follow) {
      const isFollowing = follow.getAttribute('aria-pressed') === 'true';
      follow.setAttribute('aria-pressed', String(!isFollowing));
      follow.textContent = isFollowing ? 'follow' : 'following ✓';
      return;
    }
    if (!open && !close) return;
    const front = card.querySelector('.social-profile__front');
    const site = card.querySelector('.social-profile__site');
    const isOpening = Boolean(open);
    front.hidden = isOpening;
    site.hidden = !isOpening;
    card.classList.toggle('is-site-open', isOpening);
    card.querySelector('[data-open-site]').setAttribute('aria-expanded', String(isOpening));
    (isOpening ? card.querySelector('[data-close-site]') : card.querySelector('[data-open-site]')).focus();
  });
}

export const LIVE = [
  ['noah', 'noah just topped up the noodle budget', '1m'],
  ['zara', 'zara added a chapter to her reading list', '2m'],
  ['ava', 'ava posted another impossible-to-delete photo', '4m'],
  ['lu', 'lu updated Miso’s park diary', 'now'],
  ['jay', 'jay finished Sora’s character file', '6m'],
  ['eli', 'eli scanned a roll of film', '9m'],
];
