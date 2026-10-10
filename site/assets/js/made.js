import { PERSONAS, ORDER, personaAvatar } from './personas.js';
import { signatureMarkup, bindSignatures } from './persona-sites.js?v=early-web-1';

// Each persona's link lives on the app they already use. Every screen should be
// recognisable from its interface alone; the link opens the signature part of their world.
const P = PERSONAS;
const ph = (name, fill = false) => `<i class="${fill ? 'ph-fill' : 'ph'} ph-${name}" aria-hidden="true"></i>`;
const img = (src, alt = '') => `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
const status = (dark = false) => `<div class="app__status${dark ? ' app__status--dark' : ''}" aria-hidden="true"><b>9:41</b><span>${ph('cell-signal-full', true)}${ph('wifi-high', true)}${ph('battery-full', true)}</span></div>`;
const link = (cls, inner, label) => `<button type="button" class="${cls}" data-open-site aria-expanded="false"${label ? ` aria-label="${label}"` : ''}>${inner}</button>`;

const screens = {
  // TikTok profile
  camila: () => `<div class="app__front tt" aria-label="Camila's TikTok profile">
    ${status()}
    <div class="tt__top">${ph('user-plus')}<b>Cami ${ph('caret-down', true)}</b>${ph('list')}</div>
    <img class="tt__avatar" src="${personaAvatar('camila')}" alt="" width="96" height="96">
    <p class="tt__handle">@camicuts</p>
    <ul class="tt__stats"><li><b>88</b>Following</li><li><b>12.4K</b>Followers</li><li><b>301.2K</b>Likes</li></ul>
    <div class="tt__btns"><button type="button" class="tt__follow" data-follow aria-pressed="false">Follow</button><span class="tt__ghost">${ph('paper-plane-tilt')}</span><span class="tt__ghost">${ph('caret-down', true)}</span></div>
    <p class="tt__bio">birthday edits on request 🎂 sd → boston</p>
    ${link('tt__link', `${ph('link-simple')}aura.my/cami`)}
    <div class="tt__tabs" aria-hidden="true">${ph('squares-four', true)}${ph('lock-simple')}${ph('heart')}</div>
    <ul class="tt__grid">${[['car', '48.1K', 1], ['grad', '12.4K', 1], ['pool', '9,812'], ['beach', '22.7K'], ['camp', '7,409'], ['bigsur', '5,233']].map(([k, n, pin]) => `<li>${img(P.camila.photos[k])}${pin ? '<em>Pinned</em>' : ''}<span>${ph('play')} ${n}</span></li>`).join('')}</ul>
  </div>`,

  // Instagram close friends story
  maddie: () => `<div class="app__front ig" aria-label="Maddie's close friends story">
    ${img(P.maddie.photos.earbuds, 'Two pairs of knees sharing wired earbuds')}
    ${status(true)}
    <div class="ig__bars" aria-hidden="true"><i class="is-done"></i><i class="is-on"></i><i></i></div>
    <div class="ig__head"><img src="${personaAvatar('maddie')}" alt="" width="32" height="32"><b>mads.cf</b><span>2h</span><em>${ph('star', true)} Close Friends</em><span class="ig__icons">${ph('dots-three')}${ph('x')}</span></div>
    <p class="ig__text"><span>drive home playlist is up</span></p>
    ${link('ig__sticker', `${ph('link-simple')}AURA.MY/MADDIE`, 'Open aura.my/maddie')}
    <div class="ig__reply" aria-hidden="true"><span>Send message</span>${ph('heart')}${ph('paper-plane-tilt')}</div>
  </div>`,

  // Snapchat story
  marcus: () => `<div class="app__front sc" aria-label="Marcus's Snapchat story">
    ${img(P.marcus.photos.table, 'Teammates at a long table after the game')}
    ${status(true)}
    <div class="sc__bars" aria-hidden="true"><i></i></div>
    <div class="sc__head"><img src="${personaAvatar('marcus')}" alt="" width="36" height="36"><span><b>Marcus</b>12m</span>${ph('dots-three-vertical')}</div>
    <p class="sc__caption">whole team on one page 🦅</p>
    ${link('sc__attach', `<span class="sc__thumb">${img(P.marcus.photos.team)}</span><span><b>EAGLES · WR ROOM</b>aura.my/eagles-wr-room</span>${ph('caret-up')}`, 'Open aura.my/eagles-wr-room')}
    <div class="sc__reply" aria-hidden="true">${ph('camera')}<span>Send a chat</span></div>
  </div>`,

  // Discord profile
  jayden: () => `<div class="app__front dc" aria-label="Jayden's Discord profile">
    <div class="dc__banner"></div>
    <div class="dc__avatar"><img src="${P.jayden.photos.avatar}" alt="" width="84" height="84"><i></i></div>
    <div class="dc__card">
      <b class="dc__name">j4y</b><span class="dc__user">jxyden</span>
      <p class="dc__activity">${ph('game-controller', true)} Playing Roblox</p>
      <h5>About me</h5>
      <p>beat my 88. i dare you.<br>${link('dc__link', 'aura.my/jayden')}</p>
      <h5>Member since</h5><p>Jun 4, 2024</p>
      <h5>Roles</h5>
      <ul class="dc__roles"><li style="--c:#c8ff3d">squad</li><li style="--c:#f47fff">jv hoops</li><li style="--c:#5865f2">2k26</li></ul>
      <p class="dc__msg">Message @jxyden</p>
    </div>
  </div>`,

  // Tumblr post on the dashboard
  river: () => `<div class="app__front tb" aria-label="River's Tumblr post">
    ${status(true)}
    <div class="tb__tabs" aria-hidden="true"><span class="is-on">Following</span><span>For you</span><span>Your tags</span></div>
    <article class="tb__post">
      <header><img src="${personaAvatar('river')}" alt="" width="32" height="32"><b>riverdraws</b><span class="tb__follow">Follow</span>${ph('dots-three')}</header>
      ${img(P.river.photos.pixel, 'Pixel art of River’s OC, Kite, running with a map')}
      <p>kite, courier of lowlight. read my carrd before you follow ☾ ${link('tb__link', 'aura.my/river')}</p>
      <p class="tb__tags">#oc #original character #lowlight #pixel art #art fight</p>
      <footer><span>1,204 notes</span><span class="tb__actions">${ph('chat-circle')}${ph('repeat')}${ph('heart')}</span></footer>
    </article>
  </div>`,

  // Letterboxd profile
  theo: () => `<div class="app__front lb" aria-label="Theo's Letterboxd profile">
    ${status(true)}
    <div class="lb__top">${ph('caret-left')}<b>theo</b>${ph('dots-three')}</div>
    <div class="lb__id"><img src="${personaAvatar('theo')}" alt="" width="56" height="56"><div><b>theo</b>${link('lb__link', `${ph('link-simple')}aura.my/theo`)}</div></div>
    <ul class="lb__stats"><li><b>212</b>Films</li><li><b>34</b>This year</li><li><b>5</b>Lists</li><li><b>98</b>Followers</li></ul>
    <p class="lb__bio">taste is just paying attention.</p>
    <h5>Favorite films</h5>
    <ol class="lb__favs">${[['paris, texas', 24], ['in the mood for love', 352], ['aftersun', 200], ['dazed and confused', 40]].map(([t, h]) => `<li style="--h:${h}"><span>${t}</span></li>`).join('')}</ol>
    <h5>Recent activity</h5>
    <ul class="lb__recent">${[['marty supreme', '★★★★', 1], ['aftersun', '★★★★★', 0], ['dazed and confused', '★★★★½', 1]].map(([t, r, liked]) => `<li><b>${t}</b><span>${r}</span>${liked ? ph('heart', true) : ''}</li>`).join('')}</ul>
  </div>`,

  // Depop shop
  aaliyah: () => `<div class="app__front dp" aria-label="Aaliyah's Depop shop">
    ${status()}
    <div class="dp__top">${ph('caret-left')}<b>aaliyahsnack</b>${ph('share-network')}</div>
    <div class="dp__id"><img src="${personaAvatar('aaliyah')}" alt="" width="64" height="64"><div><b>Aaliyah</b><span class="dp__stars">★★★★★ <em>(212)</em></span><span class="dp__meta">Active today · Newark, NJ</span></div></div>
    <p class="dp__bio">flips + press-ons. book nails on my site ↓</p>
    ${link('dp__link', `${ph('link-simple')}aura.my/aaliyah.nails`)}
    <div class="dp__btns"><button type="button" class="dp__follow" data-follow aria-pressed="false">Follow</button><span class="dp__msg">Message</span></div>
    <div class="dp__tabs" aria-hidden="true"><span class="is-on">Shop</span><span>Likes</span></div>
    <ul class="dp__grid">${[['vintage', '$38'], ['track', '$34', 1], ['cherry', '$25'], ['charms', '$12'], ['cobalt', '$25', 1], ['client', '$30']].map(([k, price, sold]) => `<li>${img(P.aaliyah.photos[k])}${sold ? '<em>Sold</em>' : `<b>${price}</b>`}</li>`).join('')}</ul>
  </div>`,
};

const card = (id, i) => `<article class="app app--${id}" data-profile="${id}" style="--i:${i}">
  ${screens[id]()}
  <section class="app__site" aria-label="${P[id].name}'s Auramy world" hidden>
    <button class="app__back" type="button" data-close-site>${ph('caret-left')} back</button>
    ${signatureMarkup(id)}
  </section>
</article>`;

export function renderMade(row) {
  if (!row) return;
  row.innerHTML = ORDER.map(card).join('');
  bindSignatures(row);
  if (row.dataset.socialProfileBound) return;
  row.dataset.socialProfileBound = 'true';
  row.addEventListener('click', (event) => {
    const app = event.target.closest('.app');
    if (!app) return;
    const follow = event.target.closest('[data-follow]');
    if (follow) {
      const following = follow.getAttribute('aria-pressed') === 'true';
      follow.setAttribute('aria-pressed', String(!following));
      follow.textContent = following ? 'Follow' : 'Following';
      return;
    }
    const opening = Boolean(event.target.closest('[data-open-site]'));
    const closing = event.target.closest('[data-close-site]');
    if (!opening && !closing) return;
    app.querySelector('.app__front').hidden = opening;
    app.querySelector('.app__site').hidden = !opening;
    app.classList.toggle('is-open', opening);
    app.querySelector('[data-open-site]').setAttribute('aria-expanded', String(opening));
    (opening ? app.querySelector('[data-close-site]') : app.querySelector('[data-open-site]')).focus();
  });
}
