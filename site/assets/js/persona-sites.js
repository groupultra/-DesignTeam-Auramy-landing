// Simplified versions of the seven persona template sites (auramy-<name>.vercel.app).
// Everything is sized in cqw, so the same markup works in the worlds phone, the hero
// windows and the opened social-profile cards. Local demos only: nothing leaves the page.
import { PERSONAS } from './personas.js';

const P = PERSONAS;
const motionOff = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('is-motion-paused');
const pic = (src, alt = '') => `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`;

const CAM_CLIPS = [
  { key: 'grad', cap: 'grad day', alt: 'Camila and her friends in graduation gowns', color: '#ffd84d' },
  { key: 'car', cap: 'road trip choir', alt: 'A road-trip selfie with friends singing in the back seats', color: '#ff7aa8' },
  { key: 'pool', cap: 'pool was cold. we stayed.', alt: 'Friends with their feet in a motel pool at night', color: '#62d2ff' },
  { key: 'beach', cap: 'last beach night', alt: 'A flash selfie on the beach at dusk', color: '#b48cff' },
  { key: 'airport', cap: 'airport. ok bye. ok one more', alt: 'Camila and Sofia taking a selfie at the airport', color: '#7ee08a' },
  { key: 'newfriends', cap: 'new people!! (still us)', alt: 'New college friends in a dorm hallway', color: '#ffa04d' },
];

const MEMES = [
  { key: 'catmeme', alt: 'Cat meme captioned one more game, me six games ago', skulls: 41 },
  { key: 'drift', alt: 'Controller meme: when I win, skill. When I lose, stick drift', skulls: 33 },
  { key: 'calculated', alt: 'Jayden’s block avatar captioned calculated', skulls: 27 },
  { key: 'fanart', alt: 'Kev’s scribbled fan art of Jayden’s avatar', skulls: 58 },
];

/* ───────── home screens (the first screen of each template) ───────── */

const homes = {
  maddie: () => `<div class="ps ps--maddie" data-fog="0" data-view="cf">
    <div class="ps-md__glass" aria-hidden="true"><i class="ps-md__bokeh"></i><i class="ps-md__drops"></i><i class="ps-md__wiper"></i></div>
    <div class="ps-md__view" role="group" aria-label="Who is looking at this page">
      <button type="button" data-md-view="cf" aria-pressed="true">★ close friends</button><button type="button" data-md-view="anyone" aria-pressed="false">anyone</button>
    </div>
    <figure class="ps-md__mirror">${pic(P.maddie.photos.bedtime, 'Maddie’s half-hidden selfie, framed like a rearview mirror')}<figcaption>close friends only</figcaption></figure>
    <div class="ps-md__note">
      <h3>maddie</h3>
      <p class="ps-md__meta">16 · junior · columbus-ish, ohio</p>
      <p class="ps-md__line ps-md__line--cf">my main is for my grandma. the real stuff is here.</p>
      <p class="ps-md__line ps-md__line--anyone">this page is for close friends. ask maddie for the link.</p>
      <ul class="ps-md__links"><li><b>instagram</b>@mads.cf</li><li><b>snapchat</b>irl only</li><li><b>pinterest</b>30 boards</li><li><b>apple music</b>drive home</li></ul>
      <div class="ps-md__dump ps-md__dump--cf">${pic(P.maddie.photos.friends)}${pic(P.maddie.photos.earbuds)}${pic(P.maddie.photos.remake)}</div>
      <div class="ps-md__dump ps-md__dump--anyone">${pic(P.maddie.photos.seat)}${pic(P.maddie.photos.soup)}${pic(P.maddie.photos.doodle)}</div>
    </div>
    <div class="ps-md__glovebox"><p><b>currently into</b>gilmore girls rewatch #4 · 48° mornings · corn maze pics</p><ul><li>iced coffee 365</li><li>yearbook staff</li><li>cd player club</li><li>no mayo</li><li>passenger princess</li></ul></div>
    <div class="ps-md__dash"><p class="ps-md__clock"><b data-md-time>3:11 pm</b><small data-md-stop>to the lot</small></p><button type="button" data-md-drive>drive →</button></div>
  </div>`,

  camila: () => `<div class="ps ps--camila">
    <header class="ps-cm__top"><span>cami's cut · edit #37</span><span>boston · 4:12am ☾</span></header>
    <figure class="ps-cm__frame"><img data-cm-img src="${P.camila.photos.grad}" alt="${CAM_CLIPS[0].alt}" loading="lazy" decoding="async"><figcaption class="ps-cm__cap" data-cm-cap>grad day</figcaption></figure>
    <div class="ps-cm__timeline" role="group" aria-label="Clips in Camila's edit">${CAM_CLIPS.map((c, i) => `<button type="button" data-cm-clip="${i}" style="--c:${c.color}" aria-label="Play clip: ${c.cap}" aria-pressed="${i === 0}"></button>`).join('')}<i class="ps-cm__head" aria-hidden="true"></i></div>
    <h3 class="ps-cm__name">cami</h3>
    <p class="ps-cm__bio">18 · san diego → boston. i make everyone's birthday edits (and i'll make yours).</p>
    <p class="ps-cm__ft"><b>ft.</b><span>priya</span><span>jules</span><span>noor</span><span>bea</span><span>dani</span></p>
    <div class="ps-cm__btns"><button type="button" data-cm-drop>drop a clip →</button><span>6 friends added clips</span></div>
    <div class="ps-cm__kc"><p><b>✓ keep</b>golden hour · horchata · 6-way facetimes</p><p><b>✂ cut</b>“seen” with no reply · the T at 8am</p></div>
    <p class="ps-cm__motto">take the picture. you'll want it later.</p>
  </div>`,

  marcus: () => `<div class="ps ps--marcus" data-mode="me">
    <div class="ps-mc__score" aria-label="Scoreboard"><span>EAGLES <b>21</b></span><span>VISITORS <b>14</b></span><em>4TH &amp; 2 · OWN 20</em></div>
    <div class="ps-mc__tabs" role="group" aria-label="Marcus's pages">${['me', 'team', 'scouts'].map((m, i) => `<button type="button" data-mc-mode="${m}" aria-pressed="${i === 0}">${m.toUpperCase()}</button>`).join('')}</div>
    <section class="ps-mc__panel ps-mc__panel--me">
      <figure class="ps-mc__hero">${pic(P.marcus.photos.catch, 'Marcus, number 11, running after a catch')}</figure>
      <h3 class="ps-mc__name"><span>MARCUS</span><span>REED</span></h3>
      <p class="ps-mc__meta">#11 · WR · CAPTAIN · NORTH HOLLIS</p>
      <p class="ps-mc__line">captain. wide receiver. professional group-chat menace.</p>
      <ul class="ps-mc__chips"><li>WR #11</li><li>4×100</li><li>CFB DYNASTY</li><li>SWEET TEA</li></ul>
      <div class="ps-mc__row"><button type="button" data-mc-lock>LOCK IN ▸</button><span data-mc-count>locked in ×0</span></div>
    </section>
    <section class="ps-mc__panel ps-mc__panel--team">
      <figure class="ps-mc__team">${pic(P.marcus.photos.team, 'The Eagles team with coaches on the field')}</figure>
      <h3 class="ps-mc__sub">EAGLES · WR ROOM</h3>
      <ol class="ps-mc__roster"><li class="is-sr"><b>11</b>marcus <em>C</em></li><li class="is-sr"><b>14</b>dre</li><li class="is-sr"><b>82</b>luis</li><li><b>3</b>tre</li><li><b>7</b>kj</li><li><b>+</b>you?</li></ol>
      <p class="ps-mc__note">seniors get the top row. no debate.</p>
    </section>
    <section class="ps-mc__panel ps-mc__panel--scouts">
      <h3 class="ps-mc__sub">SCOUTING REPORT</h3>
      <p class="ps-mc__note">if a coach is reading this: hi. i'm coachable.</p>
      <dl class="ps-mc__stats"><div><dt>40 YD</dt><dd>4.5<small>hand-timed</small></dd></div><div><dt>HT</dt><dd>6'1"</dd></div><div><dt>SPRING</dt><dd>4×100</dd></div></dl>
      <figure class="ps-mc__film">${pic(P.marcus.photos.stands, 'A zoomed-in phone photo of number 11 from the stands')}<figcaption>hudl ▸ full highlights</figcaption></figure>
    </section>
    <div class="ps-mc__ticker"><b>AROUND THE ROOM ▸</b><p data-mc-quote role="status" aria-live="polite">LUIS #82 · good page</p></div>
  </div>`,

  jayden: () => `<div class="ps ps--jayden">
    <nav class="ps-jy__nav" aria-label="Jayden's site"><b>lobby</b><span>memes</span><span>clips</span><span>board</span></nav>
    <div class="ps-jy__head">${pic(P.jayden.photos.avatar, 'Jayden’s block avatar with a backwards cap and headphones')}<div><p class="ps-jy__live"><i></i>LIVE · squad vc · 1:12 am</p><h3>jayden</h3><p>if you're reading this you're in my lobby now.</p></div></div>
    <div class="ps-jy__memes">${MEMES.map((m, i) => `<figure>${pic(P.jayden.photos[m.key], m.alt)}<button type="button" data-jy-skull="${i}" aria-label="React with a skull">💀 <b>${m.skulls}</b></button></figure>`).join('')}</div>
    <div class="ps-jy__board"><p>the board <small>best per person</small></p><ol data-jy-board></ol><button type="button" data-jy-beat>beat my 88 →</button></div>
    <p class="ps-jy__msg" data-jy-msg role="status" aria-live="polite"><b>noah:</b> jay you're actually washed</p>
  </div>`,

  river: () => `<div class="ps ps--river" data-porch="on">
    <div class="ps-rv__sky" aria-hidden="true"><i class="ps-rv__moon"></i><i class="ps-rv__moths"></i></div>
    <div class="ps-rv__porch"><div class="ps-rv__window">${pic(P.river.photos.avatar, 'River’s self-drawn avatar')}</div><button type="button" class="ps-rv__lamp" data-rv-lamp aria-pressed="true">porch light: on</button></div>
    <h3>river</h3>
    <p class="ps-rv__meta">they/them · 15 · kansas (flat)</p>
    <p class="ps-rv__bio">i draw ocs and write about a night city where every map lies a little.</p>
    <ul class="ps-rv__links"><li>tumblr</li><li>toyhouse</li><li>ao3</li><li>art fight</li><li>discord</li></ul>
    <div class="ps-rv__note"><b>currently</b><ul><li>re-drawing kite's ears (41st time)</li><li>silksong act 3</li><li>inktober (day 4. it's day 9)</li></ul></div>
    <figure class="ps-rv__map">${pic(P.river.photos.map, 'River’s hand-drawn lore map in a drawing app')}<figcaption>“every map lies a little.” <small>lowlight, ch. 1</small></figcaption></figure>
    <p class="ps-rv__time" data-rv-status role="status" aria-live="polite">8:47 pm · 3 moths on the porch</p>
  </div>`,

  theo: () => `<div class="ps ps--theo">
    <header class="ps-th__bar"><span>THEO · REEL 1</span><span><i></i>LATE SHOW</span></header>
    <button type="button" class="ps-th__screen" data-th-screen aria-label="Next subtitle">${pic(P.theo.photos.mirror, 'Theo’s mirror selfie, a point-and-shoot camera covering his face')}<span class="ps-th__sub" data-th-sub role="status" aria-live="polite">[theo] oh. you're early. the previews haven't even started.</span></button>
    <h3>theo.</h3>
    <p class="ps-th__meta">18 · he/him · houston to austin</p>
    <p class="ps-th__line">i watch movies and then i don't shut up about them. in my head, mostly.</p>
    <p class="ps-th__motto"><b>MOTTO</b> taste is just paying attention.</p>
    <ul class="ps-th__tags"><li>film</li><li>vinyl</li><li>point-and-shoot</li><li>thrifting</li></ul>
    <div class="ps-th__log"><b>LIFE, LOGGED</b><div>${pic(P.theo.photos.matinee, 'Afternoon light across a cinema exit')}${pic(P.theo.photos.records, 'Theo flipping through a record bin')}${pic(P.theo.photos.tacos, 'A friend eating post-movie tacos at night')}</div></div>
    <p class="ps-th__links">letterboxd ↗ · spotify ↗ · depop ↗</p>
    <div class="ps-th__seats" aria-hidden="true">${'<i></i>'.repeat(9)}</div>
  </div>`,

  aaliyah: () => `<div class="ps ps--aaliyah" data-shape="almond">
    <header class="ps-al__top"><span>aaliyah.nails</span><b>♥ 2,318</b></header>
    <i class="ps-al__braid" aria-hidden="true"></i>
    <figure class="ps-al__nail">${pic(P.aaliyah.photos.portrait, 'Aaliyah showing her nails')}</figure>
    <div class="ps-al__shapes" role="group" aria-label="Try a nail shape">${['almond', 'square', 'coffin'].map((s, i) => `<button type="button" data-al-shape="${s}" aria-pressed="${i === 0}">${s}</button>`).join('')}</div>
    <h3>Aaliyah</h3>
    <p class="ps-al__open">PRESS-ONS · BRAIDS · FLIPS · OPEN</p>
    <p class="ps-al__bio">17. newark. nails on saturdays, braids on sundays, other people's old clothes in between.</p>
    <ul class="ps-al__chips"><li>gel-x + builder</li><li>knotless</li><li>depop flips</li></ul>
    <div class="ps-al__fresh"><b>FRESH OFF THE TABLE</b><div>${pic(P.aaliyah.photos.client, 'A client’s floral nails')}${pic(P.aaliyah.photos.market, 'A customer showing new nails at the market stall')}${pic(P.aaliyah.photos.jacket, 'Aaliyah trying on a thrifted corduroy jacket')}</div></div>
    <div class="ps-al__cta"><button type="button" data-al-request>request a set →</button><span data-al-client role="status" aria-live="polite">client #01,384</span></div>
  </div>`,
};

/* ───────── signature sections (what the bio link opens) ───────── */

const CAST = [
  ['cami', 'the editor', 'boston, ma', 'may 9', 211, 'someone’s making mine?? priya is being weird'],
  ['noor', 'the book one', 'seattle, wa', 'oct 21', 11, 'exporting… 64%'],
  ['dani', 'the chaos', 'houston, tx', 'nov 30', 51, 'storyboarding · 22%'],
  ['jules', 'the deadpan', 'austin, tx', 'jan 14', 96, 'collecting footage · 8%'],
  ['priya', 'the planner', 'chicago, il', 'mar 3', 144, 'not started (it’s october, relax)'],
  ['bea', 'the one who stayed', 'san diego, ca', 'jul 27', 290, 'shipped jul 27 ✓'],
];

const TRACKS = [
  ['drivers license', 'Olivia Rodrigo', 'got my license june 12. played this first. obviously.'],
  ['That’s So True', 'Gracie Abrams', 'jess does the second voice. she is not good at it'],
  ['Good Luck, Babe!', 'Chappell Roan', 'midwest princess anthem. pearl’s ceiling can take it'],
  ['Ribs', 'Lorde', 'for when it’s dark at 5:40 and you miss being 12'],
  ['Dreams', 'Fleetwood Mac', 'my dad’s song. i stole it. he knows'],
];

const FOUR = [
  ['paris, texas', '1984', 'seen 6×. the phone booth scene lives in my head rent free.'],
  ['in the mood for love', '2000', 'the hallway. the rain. the noodles. say less.'],
  ['aftersun', '2022', 'i was fine until the last four minutes. i was not fine.'],
  ['dazed and confused', '1993', 'austin homework. alright alright alright.'],
];

const signatures = {
  camila: () => `<section class="ps-sig ps-sig--camila" aria-label="Camila's cast page">
    <p class="ps-sig__kicker">aura.my/cami · the cast</p>
    <h4>the cast</h4>
    <p class="ps-sig__sub">6 of us · 5 states · 3 time zones · 1 braincell (rotating)</p>
    <ol class="ps-cast">${CAST.map(([n, role, city, bday, days, status]) => `<li><b>${n}</b><span>${role} · ${city}</span><em>🎂 ${bday} · in ${days} days</em><small>${status}</small></li>`).join('')}</ol>
    <form class="ps-sig__form" data-sig-form="camila"><label><span>drop a line for noor's 19th edit</span><input maxlength="60" placeholder="it goes in the final cut" autocomplete="off"></label><button type="submit">add it</button></form>
    <ul class="ps-sig__lines" data-sig-lines aria-live="polite"><li><b>dani:</b> the canoe clip. you know the one.</li></ul>
  </section>`,

  maddie: () => `<section class="ps-sig ps-sig--maddie" aria-label="Maddie's drive home playlist">
    <p class="ps-sig__kicker">aura.my/maddie · aux</p>
    <h4>the drive home playlist</h4>
    <p class="ps-sig__sub">aux is shared. i have veto.</p>
    <ol class="ps-tracks">${TRACKS.map(([t, a, note], i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><div><b>${t}</b><small>${a}</small><p>${note}</p></div><button type="button" data-same aria-pressed="false">same 🤝</button></li>`).join('')}</ol>
  </section>`,

  marcus: () => `<section class="ps-sig ps-sig--marcus" aria-label="The Eagles team page">
    <p class="ps-sig__kicker">aura.my/eagles-wr-room</p>
    <h4>AROUND THE ROOM</h4>
    <ul class="ps-roast">
      <li><b>LUIS #82</b>good page</li>
      <li><b>DRE #14</b>replay review: the slide celebration at the 5. ruling on the field: embarrassing.</li>
      <li><b>COACH D</b>Film at 3:15. Not 3:16. Proud of you.</li>
      <li><b>MOM</b>i printed it. it's on the fridge. ❤️</li>
    </ul>
    <div class="ps-vote" data-vote><p>highest aura this week</p>${['dre #14', 'luis #82', 'tre #3', 'kj #7'].map((n, i) => `<button type="button" data-vote-pick="${i}"><span>${n}</span><i style="--v:${[34, 28, 22, 16][i]}%"></i><b>${[34, 28, 22, 16][i]}%</b></button>`).join('')}<small data-vote-status role="status" aria-live="polite">tap to vote. results friday after film.</small></div>
  </section>`,

  jayden: () => `<section class="ps-sig ps-sig--jayden" aria-label="Jayden's wall">
    <p class="ps-sig__kicker">aura.my/jayden · # the-wall</p>
    <ul class="ps-wall" data-sig-lines aria-live="polite">
      <li><b>guest-3307</b><span>who is ant and why is he in every photo</span></li>
      <li><b>jayden</b><span>my dog. show respect</span></li>
      <li><b>mom</b><span>Jayden it is 1:14 AM. School is in 6 hours. Love, Mom</span><em>💀 14</em></li>
    </ul>
    <form class="ps-sig__form" data-sig-form="jayden"><label><span>say something</span><input maxlength="60" placeholder="say something" autocomplete="off"></label><button type="submit">send</button></form>
    <ul class="ps-handles"><li><b>discord</b>jxyden</li><li><b>epic</b>jxydn4</li><li><b>roblox</b>jxydnnn <small>after 9 only</small></li><li><b>youtube</b>@jxydenclips</li></ul>
  </section>`,

  river: () => `<section class="ps-sig ps-sig--river" aria-label="River's before-you-follow page">
    <p class="ps-sig__kicker">aura.my/river · read this first</p>
    <h4>before you follow ☾</h4>
    <div class="ps-byf"><div><b>byf</b><ul><li>ocs + lore, not irl stuff</li><li>i'm 15. be normal</li><li>slow replies. i'm drawing</li></ul></div><div><b>dni</b><ul><li>adults being weird</li><li>reposts without credit</li><li>"draw my oc for free"</li></ul></div></div>
    <figure class="ps-oc">${pic(P.river.photos.sheet, 'River’s hand-drawn reference sheet for their OC, Kite')}<figcaption><b>kite</b> · courier of lowlight · ref sheet v3</figcaption></figure>
    <button type="button" class="ps-locked" data-locked aria-expanded="false">🔒 the server room. ask a mutual</button>
    <p class="ps-locked__msg" data-locked-msg hidden>nice try. ask june or ollie for the password ☾</p>
  </section>`,

  theo: () => `<section class="ps-sig ps-sig--theo" aria-label="Theo's four favorites">
    <p class="ps-sig__kicker">aura.my/theo · reel 2</p>
    <h4>the four.</h4>
    <p class="ps-sig__sub">fall '26 edition. they rotate. these are load-bearing.</p>
    <ol class="ps-four">${FOUR.map(([t, y, note], i) => `<li><button type="button" data-flip aria-pressed="false"><span class="ps-four__front"><i>0${i + 1}</i><b>${t}</b><small>${y}</small></span><span class="ps-four__back">${note}</span></button></li>`).join('')}</ol>
    <form class="ps-sig__form" data-sig-form="theo"><label><span>send me your four favs</span><input maxlength="60" placeholder="one is enough to start" autocomplete="off"></label><button type="submit">compare</button></form>
    <p class="ps-sig__sub" data-sig-result role="status" aria-live="polite"></p>
  </section>`,

  aaliyah: () => `<section class="ps-sig ps-sig--aaliyah" aria-label="Aaliyah's menu">
    <p class="ps-sig__kicker">aaliyah.nails · the menu</p>
    <h4>the menu</h4>
    <div class="ps-work">${pic(P.aaliyah.photos.floral, 'A floral press-on set in a tray')}${pic(P.aaliyah.photos.braids, 'Finished knotless braids from behind')}${pic(P.aaliyah.photos.cobalt, 'Cobalt French-tip press-ons in sunlight')}</div>
    <ul class="ps-menu">${[['press-on set (custom)', '$25+'], ['gel-x, short', '$35'], ['builder gel overlay', '$30'], ['knotless, mid-back', '$160']].map(([s, p], i) => `<li><label><input type="radio" name="al-svc" value="${s}" ${i === 0 ? 'checked' : ''}><span>${s}</span><b>${p}</b></label></li>`).join('')}</ul>
    <button type="button" class="ps-book" data-book>request a set →</button>
    <p class="ps-sig__sub" data-sig-result role="status" aria-live="polite"></p>
    <blockquote class="ps-review">“she did my nails ON THE BUS to the game. still perfect.” <cite>jaz, guestbook</cite></blockquote>
  </section>`,
};

export const homeMarkup = (id) => homes[id]?.() || '';
export const signatureMarkup = (id) => signatures[id]?.() || '';

/* ───────── behaviour ───────── */

const on = (root, sel, type, fn, signal) => root.querySelectorAll(sel).forEach((el) => el.addEventListener(type, fn, { signal }));

/** Wire up a home screen. Returns a cleanup function that removes listeners and timers. */
export function mountHome(id, host) {
  const root = host.querySelector('.ps');
  if (!root) return () => {};
  const abort = new AbortController();
  const { signal } = abort;
  let timer = 0;
  const stopTimer = () => { clearInterval(timer); timer = 0; };

  if (id === 'maddie') {
    const stops = [['3:11 pm', 'to the lot'], ['3:19 pm', 'the forever red light'], ['3:26 pm', 'aux: drivers license'], ['3:34 pm', 'visor down'], ['3:41 pm', 'home. text me']];
    let i = 0;
    on(root, '[data-md-drive]', 'click', () => {
      i = (i + 1) % stops.length;
      root.querySelector('[data-md-time]').textContent = stops[i][0];
      root.querySelector('[data-md-stop]').textContent = stops[i][1];
      root.dataset.fog = String(Math.min(i, 3));
    }, signal);
    on(root, '[data-md-view]', 'click', (e) => {
      root.dataset.view = e.currentTarget.dataset.mdView;
      root.querySelectorAll('[data-md-view]').forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget)));
    }, signal);
  }

  if (id === 'camila') {
    const img = root.querySelector('[data-cm-img]');
    const cap = root.querySelector('[data-cm-cap]');
    const clips = [...root.querySelectorAll('[data-cm-clip]')];
    let i = 0;
    const show = (n) => {
      i = (n + CAM_CLIPS.length) % CAM_CLIPS.length;
      const c = CAM_CLIPS[i];
      img.src = P.camila.photos[c.key];
      img.alt = c.alt;
      cap.textContent = c.cap;
      root.style.setProperty('--head', `${(i + .5) / CAM_CLIPS.length * 100}%`);
      clips.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    };
    clips.forEach((b) => b.addEventListener('click', () => { stopTimer(); show(+b.dataset.cmClip); }, { signal }));
    on(root, '[data-cm-drop]', 'click', (e) => { e.currentTarget.textContent = 'clip added ✓'; root.querySelector('.ps-cm__btns span').textContent = '7 friends added clips'; }, signal);
    show(0);
    if (!motionOff()) timer = setInterval(() => { if (!document.hidden && !motionOff()) show(i + 1); }, 2600);
  }

  if (id === 'marcus') {
    const quotes = ['LUIS #82 · good page', 'COACH D · Film at 3:15. Not 3:16.', 'DRE #14 · ruling on the field: embarrassing.', 'TRE #3 · my left cleat is not in the cooler', 'MOM · i printed it. it\'s on the fridge.'];
    let q = 0, n = 0;
    const quote = root.querySelector('[data-mc-quote]');
    on(root, '[data-mc-mode]', 'click', (e) => {
      root.dataset.mode = e.currentTarget.dataset.mcMode;
      root.querySelectorAll('[data-mc-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget)));
    }, signal);
    on(root, '[data-mc-lock]', 'click', () => {
      n++;
      root.querySelector('[data-mc-count]').textContent = `locked in ×${n}`;
      root.classList.remove('is-locked'); void root.offsetWidth; root.classList.add('is-locked');
    }, signal);
    if (!motionOff()) timer = setInterval(() => { if (!document.hidden && !motionOff()) quote.textContent = quotes[++q % quotes.length]; }, 2800);
  }

  if (id === 'jayden') {
    const board = root.querySelector('[data-jy-board]');
    const msg = root.querySelector('[data-jy-msg]');
    const rows = [['jayden', 88], ['noah', 84], ['deshawn', 79]];
    let you = 0;
    const draw = () => {
      const all = [...rows, ...(you ? [['you', you]] : [])].sort((a, b) => b[1] - a[1]).slice(0, 3);
      board.innerHTML = all.map(([name, s], k) => `<li class="${name === 'you' ? 'is-you' : ''}"><span>${k + 1}</span><b>${name}</b><em>${s}</em></li>`).join('');
    };
    draw();
    on(root, '[data-jy-beat]', 'click', () => {
      const s = Math.random() < .2 ? 89 + Math.floor(Math.random() * 6) : 48 + Math.floor(Math.random() * 38);
      you = Math.max(you, s);
      draw();
      msg.innerHTML = s > 88 ? `<b>jayden:</b> ${s}?? ok run it back. right now.` : `<b>jayden:</b> ${s}. 💀 not even close`;
    }, signal);
    on(root, '[data-jy-skull]', 'click', (e) => {
      const count = e.currentTarget.querySelector('b');
      count.textContent = String(+count.textContent + 1);
      e.currentTarget.classList.remove('is-pop'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('is-pop');
    }, signal);
  }

  if (id === 'river') {
    let moths = 3;
    const status = root.querySelector('[data-rv-status]');
    on(root, '[data-rv-lamp]', 'click', (e) => {
      const lit = root.dataset.porch !== 'on';
      root.dataset.porch = lit ? 'on' : 'off';
      e.currentTarget.setAttribute('aria-pressed', String(lit));
      e.currentTarget.textContent = `porch light: ${lit ? 'on' : 'off'}`;
      if (lit) moths++;
      status.textContent = lit ? `8:47 pm · ${moths} moths on the porch` : '8:47 pm · light off. nobody’s home (we’re home)';
    }, signal);
  }

  if (id === 'theo') {
    const subs = ['[theo] oh. you\'re early. the previews haven\'t even started.', 'tap the screen if you want. the flash is temperamental.', 'the motto? read that somewhere. i\'m not that deep.', 'it\'s a slow burn but it gets good.'];
    let s = 0;
    on(root, '[data-th-screen]', 'click', () => {
      s = (s + 1) % subs.length;
      root.querySelector('[data-th-sub]').textContent = subs[s];
      root.classList.remove('is-flash'); void root.offsetWidth; root.classList.add('is-flash');
    }, signal);
  }

  if (id === 'aaliyah') {
    let client = 1384;
    on(root, '[data-al-shape]', 'click', (e) => {
      root.dataset.shape = e.currentTarget.dataset.alShape;
      root.querySelectorAll('[data-al-shape]').forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget)));
    }, signal);
    on(root, '[data-al-request]', 'click', (e) => {
      client++;
      root.querySelector('[data-al-client]').textContent = `request sent ✦ client #0${client.toLocaleString('en-US')}`;
      e.currentTarget.textContent = 'requested ✓';
    }, signal);
  }

  return () => { stopTimer(); abort.abort(); };
}

/** Delegated behaviour for the signature sections; bind once on a stable ancestor. */
export function bindSignatures(host) {
  if (!host || host.dataset.sigBound) return;
  host.dataset.sigBound = 'true';
  host.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-sig-form]');
    if (!form) return;
    event.preventDefault();
    const input = form.querySelector('input');
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    const sig = form.closest('.ps-sig');
    const kind = form.dataset.sigForm;
    if (kind === 'theo') {
      const hits = FOUR.filter(([t]) => text.toLowerCase().includes(t.split(',')[0])).length;
      sig.querySelector('[data-sig-result]').textContent = hits ? `taste match: ${hits}/4. ok. we can be friends.` : 'taste match: 0/4. we can work with that.';
    } else {
      const list = sig.querySelector('[data-sig-lines]');
      const li = document.createElement('li');
      const who = document.createElement('b');
      who.textContent = kind === 'jayden' ? 'you' : 'you:';
      const span = document.createElement('span');
      span.textContent = ` ${text}`;
      li.append(who, span);
      list.append(li);
    }
    input.value = '';
  });
  host.addEventListener('click', (event) => {
    const same = event.target.closest('[data-same]');
    if (same) {
      const pressed = same.getAttribute('aria-pressed') !== 'true';
      same.setAttribute('aria-pressed', String(pressed));
      same.textContent = pressed ? 'same 🤝 ✓' : 'same 🤝';
      return;
    }
    const pick = event.target.closest('[data-vote-pick]');
    if (pick) {
      const vote = pick.closest('[data-vote]');
      vote.querySelectorAll('[data-vote-pick]').forEach((b) => b.classList.toggle('is-picked', b === pick));
      vote.querySelector('[data-vote-status]').textContent = `vote counted for ${pick.querySelector('span').textContent}. results friday after film.`;
      return;
    }
    const flip = event.target.closest('[data-flip]');
    if (flip) { flip.setAttribute('aria-pressed', String(flip.getAttribute('aria-pressed') !== 'true')); return; }
    const locked = event.target.closest('[data-locked]');
    if (locked) {
      const msg = locked.parentElement.querySelector('[data-locked-msg]');
      msg.hidden = !msg.hidden;
      locked.setAttribute('aria-expanded', String(!msg.hidden));
      return;
    }
    const book = event.target.closest('[data-book]');
    if (book) {
      const sig = book.closest('.ps-sig');
      const svc = sig.querySelector('input[name="al-svc"]:checked')?.value || 'a set';
      sig.querySelector('[data-sig-result]').textContent = `request sent for ${svc} ✦ she’ll dm you to confirm.`;
    }
  });
}
