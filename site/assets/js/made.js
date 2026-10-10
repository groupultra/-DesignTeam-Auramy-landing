import { PERSONAS, ORDER, personaAvatar } from './personas.js';
import { signatureMarkup, bindSignatures } from './persona-sites.js?v=personas-1';

// Each persona already lives on a different app. The link in their bio opens the
// signature part of their Auramy world (a simplified section of their template).
const PROFILES = {
  camila: { app: 'gram', from: 'instagram', handle: 'cami.ortg', counts: ['214', '612', '588'], bio: 'san diego → boston 🌵 birthday edits on request 🎂', link: 'the cast + birthday reel', grid: ['fries', 'pool', 'beach'] },
  maddie: { app: 'cf', from: 'instagram close friends', handle: 'mads.cf', scene: 'earbuds', caption: 'drive home playlist is up. you know who you are', link: 'aura.my/maddie' },
  marcus: { app: 'snap', from: 'snapchat team chat', handle: 'EAGLES 🦅 · 40', scene: 'table', caption: 'whole team on one page. seniors top row.', link: 'aura.my/eagles-wr-room' },
  jayden: { app: 'discord', from: 'discord', handle: 'jxyden', display: 'j4y', status: 'playing roblox (after 9 only)', about: 'beat my 88. i dare you.', roles: ['squad vc', 'jv hoops', '2k26'], link: 'open the lobby' },
  river: { app: 'carrd', from: 'carrd · tumblr bio', handle: 'river ☾', sub: 'they/them · 15 · minors dni', tags: ['oc artist', 'lowlight (my story)', 'moth enjoyer'], link: 'read this before you follow' },
  theo: { app: 'lbxd', from: 'letterboxd', handle: 'theo', films: '212 films this year', favs: ['paris, texas', 'in the mood for love', 'aftersun', 'dazed and confused'], bio: 'they rotate. these are load-bearing.', link: 'the four, explained' },
  aaliyah: { app: 'depop', from: 'depop shop', handle: 'aaliyahsnack', reviews: '★★★★★ (212)', bio: 'flips + press-ons from newark. book nails on my site ↓', link: 'aura.my/aaliyah.nails', items: [['jacket', '$38', 'navy track jacket'], ['cobalt', '$25', 'cobalt french set'], ['client', '$30', 'floral overlay']] },
};

const img = (src, alt = '') => `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
const av = (id, cls = '') => `<img class="av ${cls}" src="${personaAvatar(id)}" alt="" width="80" height="80" decoding="async">`;
const openBtn = (cls, inner, label) => `<button type="button" class="${cls}" data-open-site aria-expanded="false"${label ? ` aria-label="${label}"` : ''}>${inner}</button>`;

const fronts = {
  gram: (id, p, f) => `<div class="social-profile__chrome social-profile__chrome--gram"><span aria-hidden="true">‹</span><b>${f.handle}</b><span aria-hidden="true">•••</span></div>
    <section class="social-profile__front social-profile__front--gram" aria-label="${p.name}'s Instagram profile">
      <div class="social-profile__identity">${av(id, 'social-profile__avatar')}<div class="social-profile__counts"><span><b>${f.counts[0]}</b> posts</span><span><b>${f.counts[1]}</b> followers</span><span><b>${f.counts[2]}</b> following</span></div></div>
      <div class="social-profile__bio"><b>${p.name.toLowerCase()}</b><p>${f.bio}</p>${openBtn('social-profile__link', `${p.url}<small>${f.link} ↗</small>`)}</div>
      <button class="social-profile__follow" type="button" data-follow aria-pressed="false">follow</button>
      <div class="social-profile__tabs" aria-hidden="true"><span>▦</span><span>⌑</span></div><div class="social-profile__photos">${f.grid.map((k) => img(p.photos[k])).join('')}</div>
    </section>`,

  cf: (id, p, f) => `<section class="social-profile__front pf-story pf-story--cf" aria-label="${p.name}'s close friends story">
      ${img(p.photos[f.scene], `${p.name}'s close friends story photo`)}
      <div class="pf-story__top">${av(id)}<b>${f.handle}</b><span>2h</span><em>★ close friends</em></div>
      <p class="pf-story__caption">${f.caption}</p>
      ${openBtn('pf-story__sticker', `🔗 <span>${f.link}</span>`, `Open ${f.link}`)}
    </section>`,

  snap: (id, p, f) => `<div class="social-profile__chrome social-profile__chrome--snap"><b>${f.handle}</b><span aria-hidden="true">☰</span></div>
    <section class="social-profile__front social-profile__front--snap" aria-label="${p.name}'s Snapchat story">
      <div class="social-profile__story">${img(p.photos[f.scene], 'A photo from the team chat: teammates at a long table after the game')}<div class="social-profile__story-top">${av(id, 'social-profile__avatar')}<span>marcus · 12m</span></div><p>${f.caption}</p>${openBtn('social-profile__sticker', `↗ <span>${f.link}</span>`, `Open ${f.link}`)}</div>
      <div class="social-profile__snap-strip">${img(p.photos.tyler)}<span>tyler: "good page" (he's lying, he loves it)</span></div>
    </section>`,

  discord: (id, p, f) => `<section class="social-profile__front pf-discord" aria-label="${p.name}'s Discord profile">
      <div class="pf-discord__banner"></div>
      <div class="pf-discord__id">${av(id)}<i aria-hidden="true"></i></div>
      <div class="pf-discord__card">
        <b class="pf-discord__name">${f.display}</b><span class="pf-discord__user">${f.handle}</span>
        <p class="pf-discord__status">🎮 ${f.status}</p>
        <p class="pf-discord__h">about me</p><p>${f.about}</p>
        <p class="pf-discord__h">roles</p><ul class="pf-discord__roles">${f.roles.map((r) => `<li>${r}</li>`).join('')}</ul>
        ${openBtn('pf-discord__link', `${p.url}<small>${f.link} ↗</small>`)}
      </div>
    </section>`,

  carrd: (id, p, f) => `<div class="social-profile__chrome pf-carrd__chrome"><span>${p.short}.carrd</span><span aria-hidden="true">☾</span></div>
    <section class="social-profile__front pf-carrd" aria-label="${p.name}'s carrd">
      ${av(id, 'pf-carrd__av')}<h3>${f.handle}</h3><p>${f.sub}</p>
      <ul class="pf-carrd__tags">${f.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
      ${openBtn('pf-carrd__link', `<span>✦</span><b>${f.link}</b><i>→</i>`)}
      <div class="pf-carrd__art">${img(p.photos.pixel, 'A friend’s pixel art of River’s OC, Kite')}</div>
    </section>`,

  lbxd: (id, p, f) => `<div class="social-profile__chrome pf-lbxd__chrome"><span>film diary</span><span aria-hidden="true">≡</span></div>
    <section class="social-profile__front pf-lbxd" aria-label="${p.name}'s film diary profile">
      <div class="pf-lbxd__id">${av(id)}<div><b>${f.handle}</b><span>${f.films}</span></div></div>
      <p class="pf-lbxd__h">favorite films</p>
      <ol class="pf-lbxd__favs">${f.favs.map((t, i) => `<li style="--h:${[24, 350, 205, 40][i]}"><span>${t}</span></li>`).join('')}</ol>
      <p class="pf-lbxd__bio">${f.bio}</p>
      ${openBtn('pf-lbxd__link', `${p.url}<small>${f.link} ↗</small>`)}
    </section>`,

  depop: (id, p, f) => `<div class="social-profile__chrome pf-depop__chrome"><span aria-hidden="true">‹</span><b>@${f.handle}</b><span aria-hidden="true">♡</span></div>
    <section class="social-profile__front pf-depop" aria-label="${p.name}'s Depop shop">
      <div class="pf-depop__id">${av(id)}<div><b>${p.name.toLowerCase()}</b><span>${f.reviews}</span></div></div>
      <p class="pf-depop__bio">${f.bio}</p>
      ${openBtn('pf-depop__link', `${f.link}<small>the menu + request a set ↗</small>`)}
      <ul class="pf-depop__grid">${f.items.map(([k, price, label]) => `<li>${img(p.photos[k], label)}<b>${price}</b></li>`).join('')}</ul>
    </section>`,
};

const profileMarkup = (id) => {
  const p = PERSONAS[id];
  const f = PROFILES[id];
  return `<article class="made-card social-profile pf pf--${f.app}" style="--profile-color:${p.color}" data-profile="${id}">
    <p class="pf__from"><b>${p.name}</b> · from ${f.from}</p>
    ${fronts[f.app](id, p, f)}
    <section class="social-profile__site" aria-label="${p.name}'s Auramy world" hidden>
      <button class="social-profile__back" type="button" data-close-site>← back to ${f.from}</button>
      ${signatureMarkup(id)}
    </section>
  </article>`;
};

export function renderMade(row) {
  if (!row) return;
  row.innerHTML = ORDER.map(profileMarkup).join('');
  bindSignatures(row);
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
    const chrome = card.querySelector('.social-profile__chrome');
    front.hidden = opening;
    if (chrome) chrome.hidden = opening;
    site.hidden = !opening;
    card.classList.toggle('is-site-open', opening);
    card.querySelector('[data-open-site]').setAttribute('aria-expanded', String(opening));
    (opening ? card.querySelector('[data-close-site]') : card.querySelector('[data-open-site]')).focus();
  });
}
