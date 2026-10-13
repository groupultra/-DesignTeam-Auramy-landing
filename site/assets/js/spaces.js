// Demo spaces for "mia" rendered in different worlds. All sizing lives in spaces.css (cqw units),
// so the same markup scales to any phone frame. Behaviour is wired up in interact.js.
import { pic, blobAvatar } from './sprite.js';
import { SONGS, MOVIES, BOOKS, songArt, tallArt, vinyl } from './covers.js';
import { avatar } from './people.js';

export const MIA = {
  name: 'mia',
  url: 'aura.my/mia',
  song: { id: 'birds', title: SONGS.birds.t, artist: SONGS.birds.a },
  movie: MOVIES.spider.t,
  book: BOOKS.heart.t,
  likes: '1,204',
  visitors: '3,481',
  notes: [
    { t: 'ur playlist saved my week', by: 'jay', c: '#FFE45C' },
    { t: 'rematch. tonight.', by: 'noah', c: '#FFB3D1' },
    { t: 'this photo is the main character', by: 'lu', c: '#B5E8FF' },
  ],
};

export const PHOTOS = [
  { id: 'ph-cat', name: 'self-portrait.jpg', cap: 'a little more me' },
  { id: 'ph-sea', name: 'sunset-with-eli.jpg', cap: 'eli, after sunset' },
  { id: 'ph-gig', name: 'my-people.jpg', cap: 'my kind of people' },
  { id: 'ph-city', name: 'skate-day.jpg', cap: 'noah, one more try' },
  { id: 'ph-flowers', name: 'ava-outside.jpg', cap: 'ava + an ice cream break' },
  { id: 'ph-bff', name: 'us.jpg', cap: 'us, unfiltered' },
];

export const TRACKS = ['birds', 'espresso', 'luck', 'apt', 'smile'].map((id) => ({ id, t: SONGS[id].t, a: SONGS[id].a }));

const statusBar = (dark = false) =>
  `<div class="sb${dark ? ' sb--dark' : ''}"><b>9:41</b><span class="sb__isl"></span><span class="sb__ico"><i></i><i></i><i></i></span></div>`;

const candy = ['#FF5FA2', '#FF8A3C', '#E8FF5A'];

const PIXEL_BLOB = (() => {
  const rows = ['..AAAAAA..', '.AAAAAAAA.', 'BBBBBBBBBB', 'BBEBBBBEBB', 'CCECCCCECC', 'CCCCCCCCCC', 'DDDDDDDDDD', '.DDDDDDDD.'];
  const col = { A: '#FF8FC0', B: '#FF5FA2', C: '#FF7A6B', D: '#FF8A3C', E: '#141013' };
  let r = '';
  rows.forEach((row, y) => [...row].forEach((ch, x) => { if (col[ch]) r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${col[ch]}"/>`; }));
  return `<svg viewBox="0 0 10 8" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
})();

const winBar = (title) =>
  `<div class="win__bar"><button data-w="close" aria-label="close"></button><button data-w="min" aria-label="minimize"></button><button data-w="max" aria-label="maximize"></button><span data-title>${title}</span></div>`;

const ptoast = '<div class="ptoast" aria-live="polite"></div>';

const spaces = {
  desk: (d) => `
    <div class="sp sp-desk" data-wall="0">
      ${statusBar()}
      <div class="desk-bar"><b>◖ ${d.name}'s desktop</b><button class="desk-now" data-play>♪ ${d.song.title}</button></div>
      <div class="desk-icons">
        <button class="di" data-open="photos"><i class="di-ico di-folder"></i><span>photos</span></button>
        <button class="di" data-open="about"><i class="di-ico di-doc"></i><span>about.txt</span></button>
        <button class="di" data-open="game"><i class="di-ico di-game"></i><span>game.exe</span></button>
        <button class="di" data-open="guest"><i class="di-ico di-mail"></i><span>guestbook</span></button>
      </div>
      <section class="win win--photo" data-win="photos">${winBar(PHOTOS[0].name)}
        <button class="win__body photo" data-next-photo aria-label="next photo">${pic(PHOTOS[0].id)}<span class="photo__n">1 / ${PHOTOS.length} · tap</span></button></section>
      <div class="desk-sticky" data-sticky>rematch tonight.<span>— noah</span></div>
      <section class="win win--music" data-win="music">${winBar('now playing')}
        <div class="win__body music"><button class="music__art" data-play aria-label="play or pause">${songArt(d.song.id)}<i class="music__pp"></i></button>
        <div class="music__meta"><b>${d.song.title}</b><span>${d.song.artist}</span><div class="music__bar" data-seek><i></i></div></div></div></section>
      <section class="win win--game" data-win="game">${winBar('game.exe — tap to flap')}
        <div class="win__body gamewin" data-flappy><span class="gw-pipe gw-pipe--1"></span><span class="gw-pipe gw-pipe--2"></span><span class="gw-bird">${blobAvatar(candy, { id: 'gwb' })}</span><b class="gw-msg">tap to flap</b></div></section>
      <section class="win win--about is-closed" data-win="about">${winBar('about.txt')}
        <div class="win__body about"><p>hi i'm ${d.name} ✦</p><p>indie music · camera-roll collector</p><p>currently: missing the last bus</p><p>fav word: <i>tomorrow</i><span class="cursor">▍</span></p></div></section>
      <section class="win win--guest is-closed" data-win="guest">${winBar('guestbook')}
        <div class="win__body guest"><ul data-guest>${d.notes.map((n) => `<li><b>${n.by}</b>${n.t}</li>`).join('')}</ul><button class="guest__sign" data-sign>sign it ✎</button></div></section>
      <div class="dock"><button class="dk dk--blob" data-auri aria-label="say hi">${blobAvatar(candy, { id: 'dkb' })}</button><button class="dk dk--music" data-open="music" aria-label="music"></button><button class="dk dk--photo" data-open="photos" aria-label="photos"></button><button class="dk dk--game" data-open="game" aria-label="game"></button><button class="dk dk--heart" data-like aria-label="like"></button></div>
      ${ptoast}
    </div>`,

  vinyl: (d) => `
    <div class="sp sp-vinyl is-playing">
      ${statusBar(true)}
      <p class="vn-kicker">${d.name}'s room · <span data-state>now spinning</span></p>
      <h3 class="vn-name" data-wave>${[...d.name].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('')}</h3>
      <div class="tt">
        <div class="tt__rec" data-rec><div class="tt__label" data-label>${songArt(TRACKS[0].id)}</div></div>
        <button class="tt__arm" data-arm aria-label="tonearm"></button>
        <button class="tt__start" data-toggle>start<br>stop</button>
        <button class="tt__knob" data-knob aria-label="speed"></button><span class="tt__rpm" data-rpm>33</span>
        <i class="tt__led"></i>
      </div>
      <div class="vn-track"><div class="vn-titlerow"><b data-title>${TRACKS[0].t}</b><button class="vn-heart" data-heart aria-label="love">♡</button></div><span data-artist>${TRACKS[0].a}</span>
        <div class="vn-prog" data-seek><i data-prog></i></div><div class="vn-time"><span data-time>0:00</span><span>0:30 preview</span></div></div>
      <p class="vn-shelf-h">on the shelf · tap to swap</p>
      <div class="vn-shelf">${TRACKS.slice(1).map((t, i) => `<button data-track="${i + 1}" aria-label="${t.t}">${songArt(t.id, true)}</button>`).join('')}</div>
      <button class="vn-req" data-req>✦ request a song for ${d.name}</button>
      ${ptoast}
    </div>`,

  pixel: (d) => `
    <div class="sp sp-pixel" data-night="0">
      ${statusBar()}
      <div class="px-hud"><span>${d.name.toUpperCase()}'S WORLD</span><span data-hearts>♥ 1204</span></div>
      <i class="px-stars"></i>
      <button class="px-cloud px-cloud--1" data-cloud aria-label="cloud"></button><button class="px-cloud px-cloud--2" data-cloud aria-label="cloud"></button>
      <button class="px-sun" data-sun aria-label="day or night"></button>
      <div class="px-ground" data-ground></div>
      <div class="px-path"></div>
      <button class="px-house" data-obj="photos" aria-label="photos house"><i class="px-roof"></i><i class="px-wall"><i class="px-win"></i></i><i class="px-door"></i><span class="px-sign">PHOTOS</span></button>
      <button class="px-arcade" data-obj="arcade" aria-label="arcade"><i class="px-screen">HI<br>345</i><span class="px-sign">PLAY</span></button>
      <button class="px-post" data-obj="guest" aria-label="guestbook sign"><span class="px-sign">GUESTBOOK</span></button>
      <button class="px-tree px-tree--1" data-tree aria-label="tree"></button><button class="px-tree px-tree--2" data-tree aria-label="tree"></button>
      <div class="px-me" data-me><span class="px-say" data-say>hi! i'm ${d.name}</span>${document.body.classList.contains('editorial-page') ? blobAvatar(candy, { id: 'pixelportrait' }) : PIXEL_BLOB}</div>
      <div class="px-dialog" data-dialog hidden><button class="px-x" data-close aria-label="close">✕</button><div data-dbody></div></div>
      <div class="px-stick" data-stick aria-label="joystick"><i></i></div><button class="px-a" data-a>A</button>
      <p class="px-tip">TAP TO WALK</p>
    </div>`,

  scrap: (d) => `
    <div class="sp sp-scrap">
      ${statusBar()}
      <button class="sc-title" data-title>welcome 2 ${d.name}'s page <span>✧</span></button>
      <figure class="sc-pol sc-pol--1" data-pol><div class="sc-pol__in"><div class="sc-pol__f"><i class="tape"></i>${pic('ph-cat')}<figcaption>a little more me</figcaption></div><div class="sc-pol__b"><p>camera on.<br>overthinking off ♡</p><span>jun '26</span></div></div></figure>
      <figure class="sc-pol sc-pol--2" data-pol><div class="sc-pol__in"><div class="sc-pol__f"><i class="tape tape--b"></i>${pic('ph-sea')}<figcaption>eli, after sunset</figcaption></div><div class="sc-pol__b"><p>one sunset.<br>our entire camera roll.</p><span>aug '26</span></div></div></figure>
      <button class="sc-star" data-star aria-label="star sticker"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#star"/></svg></button>
      <button class="sc-likes" data-likes aria-label="like"><b>♥</b><span data-n>${d.likes}</span></button>
      <div class="sc-tape-cass"><button class="cass" data-cass aria-label="play or pause tape"><span>♪ ${d.song.title}</span><i></i><i></i></button><p data-cass-l>currently on repeat · tap</p></div>
      <div class="sc-notes">${d.notes.map((n, i) => `<p class="sc-note" data-note style="--c:${n.c};--r:${[-5, 4, -2][i]}deg">${n.t}<span>— ${n.by}</span></p>`).join('')}</div>
      <button class="sc-sign" data-sign>sign my wall ✎</button>
      ${ptoast}
    </div>`,

  story: (d) => `
    <div class="sp sp-story">
      <div class="st-frame is-on">${pic('ph-sea')}<div class="st-shade"></div><div class="st-zone" data-zone></div>
        <p class="st-big">things that are<br><em>very</em> ${d.name}:</p>
        <div class="st-stickers"><button data-pop style="--r:-4deg">📷 camera-roll chaos</button><button data-pop style="--r:3deg">🎧 ${d.song.title}</button><button data-pop style="--r:-2deg">🌊 sunsets with friends</button></div></div>
      <div class="st-frame">${pic('ph-gig')}<div class="st-shade"></div><div class="st-zone" data-zone></div>
        <div class="st-poll" data-poll><p>best memories of 2026?</p><button data-vote="0"><i></i><span>yes!!</span><b></b></button><button data-vote="1"><i></i><span>also yes</span><b></b></button></div></div>
      <div class="st-frame">${pic('ph-cat')}<div class="st-shade"></div><div class="st-zone" data-zone></div>
        <form class="st-ask" data-ask><p>ask ${d.name} anything</p><input maxlength="60" placeholder="type something…" aria-label="Your question"><button type="submit">send</button></form></div>
      ${statusBar(true)}
      <div class="st-bars"><i></i><i></i><i></i></div>
      <div class="st-head"><button class="st-av" data-wink aria-label="mia">${blobAvatar(candy, { id: 'sth' })}</button><b>${d.name}</b><span>2h</span><span class="st-paused">❚❚</span></div>
      <form class="st-reply" data-reply><input maxlength="60" placeholder="send ${d.name} a note…" aria-label="Reply"><button type="button" data-like aria-label="like">♡</button></form>
      ${ptoast}
    </div>`,
};

export function renderSpace(style, data = MIA) {
  return spaces[style](data);
}

// Favorites picker: each kind is shown as the object it becomes — records, film, books.
const PICKS = {
  // start empty — the tap demo (interact.js) picks a song, a movie and two books
  song: [['birds', false], ['espresso', false], ['luck', false]],
  movie: [['spider', false], ['inside', false], ['wicked', false]],
  book: [['heart', false], ['hunger', false], ['crows', false]],
};
const SRC = { song: SONGS, movie: MOVIES, book: BOOKS };
const objFor = {
  song: (id) => vinyl(id),
  movie: (id) => `<span class="film"><span class="film__frame">${tallArt(MOVIES[id])}</span><i class="film__mark">▸ 24A</i></span>`,
  book: (id) => `<span class="bk"><i class="bk__ribbon"></i><span class="bk__cover">${tallArt(BOOKS[id])}</span></span>`,
};
const faveTile = (kind, id, on) => {
  const f = SRC[kind][id];
  return `<button class="fv-t fv-t--${kind}${on ? ' is-on' : ''}" aria-pressed="${on}" data-id="${id}" data-q="${`${f.t} ${f.a}`.toLowerCase()}">
    <span class="fv-obj">${objFor[kind](id)}<em class="fv-check"></em></span><b>${f.t}</b><small>${f.a}</small></button>`;
};
const LABELS = { song: ['♪', 'songs', 'become records you can spin'], movie: ['▶', 'movies', 'go on your film reel'], book: ['▤', 'books', 'line up on your shelf'] };

// "How it works" screens
const how = {
  hi: () => `
    <div class="sp sp-flow">
      ${statusBar()}
      <p class="fl-step">1 / 3</p>
      <h4 class="fl-title">hi! what should we call you?</h4>
      <label class="fl-input"><input data-name value="cami" maxlength="14" spellcheck="false" autocomplete="off" aria-label="Your name"></label>
      <button class="fl-selfie" data-selfie>${blobAvatar(candy, { id: 'flh', mood: 'happy' })}<span>add a selfie<br><small>from your camera roll · tap</small></span></button>
      <div class="fl-card"><div class="fl-card__art" data-card-art>${blobAvatar(candy, { id: 'flc' })}</div><b data-card-name>cami</b><span>aura.my/<i data-card-handle>cami</i></span><i class="fl-card__shine"></i></div>
      <button class="fl-btn" data-next-step>next →</button>
    </div>`,
  faves: () => `
    <div class="sp sp-flow">
      ${statusBar()}
      <p class="fl-step">2 / 3</p>
      <h4 class="fl-title">add your favorites <span class="fl-opt">optional</span></h4>
      <label class="fl-search"><i aria-hidden="true">⌕</i><input data-search placeholder="search songs, movies, books…" autocomplete="off" spellcheck="false" aria-label="Search favorites"></label>
      <div class="fv" data-faves>${Object.entries(PICKS).map(([kind, list]) => `
        <section class="fv-row fv-row--${kind}"><p class="fv-h"><i>${LABELS[kind][0]}</i><b>${LABELS[kind][1]}</b><span>${LABELS[kind][2]}</span></p>
          <div class="fv-grid">${list.map(([id, on]) => faveTile(kind, id, on)).join('')}</div></section>`).join('')}
        <p class="fv-empty">no match here — in the app, search covers every song, movie & book</p>
      </div>
      <button class="fl-btn fl-btn--aura" data-next-step>build my space ✦</button>
    </div>`,
  ask: () => `
    <div class="sp sp-flow sp-flow--ask">
      ${statusBar()}
      <div class="fl-ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42"/><circle class="fl-ring__v" data-ring cx="50" cy="50" r="42"/></svg><b data-pct>73%</b></div>
      <p class="fl-building" data-building>building your space…</p>
      <p class="fl-pill" data-pill>✦ hanging your photos</p>
      <div class="fl-q"><p>which song is basically your personality?</p>
        <div class="fl-chips" data-q="single"><button>Espresso</button><button>Birds of a Feather</button><button>something loud</button></div></div>
      <div class="fl-q fl-q--2"><p>3 words your friends would use for you</p>
        <div class="fl-chips" data-q="multi"><button>chaotic</button><button>loyal</button><button>sleepy</button><button>funny</button><button>dramatic</button></div></div>
      <button class="fl-btn fl-cta" data-next-step>skip for now →</button>
    </div>`,
  share: () => `
    <div class="sp sp-flow sp-flow--chat">
      ${statusBar()}
      <div class="ch-head"><span class="ch-av"></span><b>the group 🫧</b></div>
      <div class="ch-body" data-chat>
        <p class="bub bub--me">look what i made 👀</p>
        <button class="bub bub--me bub--card" data-next-step><span class="og">${blobAvatar(['#FFF8EE', '#FFE3F0', '#FFF3C4'], { id: 'ogb' })}<b>cami</b></span><span class="bub__meta"><b>cami's space</b><span>aura.my/cami · tap to open</span></span></button>
        <div class="bubrow">${avatar('maddie', 'bub__av')}<p class="bub"><small>maddie</small>WAIT how</p></div>
        <div class="bubrow">${avatar('marcus', 'bub__av')}<p class="bub"><small>marcus</small>signing ur wall rn</p></div>
        <div class="bubrow">${avatar('jayden', 'bub__av')}<p class="bub"><small>jayden</small>beat ur score btw. 345.</p></div>
      </div>
      <form class="ch-input" data-send><input placeholder="iMessage" maxlength="40" aria-label="Message"><button aria-label="send">↑</button></form>
    </div>`,
};

export function renderHow(key) {
  return how[key]();
}

// `who` = a friend (avatar + app badge, iOS communication style); no `who` = Auramy itself.
export const NOTIFS = [
  { who: 'noah', t: 'noah', b: 'beat your high score 👀 345 vs your 320. rematch?' },
  { who: 'lu', t: 'lu', b: 'left a note on your wall: “this photo is the main character”' },
  { t: 'auramy', b: 'your space hit 100 visitors ✦ badge unlocked, +500 aura' },
  { who: 'jay', t: 'jay', b: 'loves “Birds of a Feather” too 🎧' },
  { who: 'ava', t: 'ava', b: 'sent you a photo — it’s you, mid-laugh. keep it?' },
  { who: 'zara', t: 'zara', b: 'signed your guestbook ✎ “your desktop is so cute”' },
  { who: 'eli', t: 'eli', b: 'is on your space right now 👀' },
  { t: 'auramy', b: '14 squishes today. your face has been through a lot' },
];
