// Four unrelated small sites for FOR, plus compact personal sites in the feed.
const personal = {
  catdiary: (p) => `<article class="personal-site personal-site--cat"><header><b>crumb's cat diary</b><span>issue 08</span></header><img src="${p.scene}" alt="A cat moment from Lu's diary" loading="lazy"><div><p>today's important finding</p><h3>the sun patch moved.</h3><span>lu is taking notes.</span></div></article>`,
  skatemap: (p) => `<article class="personal-site personal-site--map"><header><b>SKATE SPOTS</b><span>brooklyn / saved</span></header><div class="map-grid"><i>01</i><b>under the bridge</b><i>02</i><b>red curb at sunset</b><i>03</i><b>the long ledge</b><span>+ pin your own</span></div><img src="${p.scene}" alt="A skate spot from Noah's map" loading="lazy"></article>`,
  artistdesk: (p) => `<article class="personal-site personal-site--desk"><header><span>jay's desk</span><b>✦ open files</b></header><div class="desk-note"><p>making room for</p><h3>loud<br>little<br>ideas.</h3><span>sketchbook no. 12</span></div><img src="${p.scene}" alt="Jay's studio desk" loading="lazy"></article>`,
  fieldjournal: (p) => `<article class="personal-site personal-site--field"><header><b>FIELD JOURNAL</b><span>06 / 18</span></header><img src="${p.scene}" alt="A camp view from Ava's field journal" loading="lazy"><div><p>weather: warm wind</p><h3>found a trail that ended at water.</h3><span>ava, after dinner</span></div></article>`,
  readinglog: (p) => `<article class="personal-site personal-site--reading"><header><b>zara's reading log</b><span>currently open</span></header><div class="book-stack"><b>THE LAST GOOD LINE</b><b>margins full of stars</b><b>walking home slowly</b></div><img src="${p.scene}" alt="Books from Zara's reading log" loading="lazy"></article>`,
  contactsheet: (p) => `<article class="personal-site personal-site--film"><header><span>ELI / ROLL 27</span><b>CONTACT SHEET</b></header><div class="film-cells"><img src="${p.scene}" alt="A film image from Eli's contact sheet" loading="lazy"><img src="${p.scene}" alt="" loading="lazy"><img src="${p.scene}" alt="" loading="lazy"><img src="${p.scene}" alt="" loading="lazy"></div><footer>keep frames 02, 03, 04</footer></article>`,
};

export const personalSiteMarkup = (kind, profile) => personal[kind]?.(profile) || '';

const previews = [
  `<article class="for-preview for-preview--birthday"><header><span>HAPPY BIRTHDAY, CAM!</span><b>08 days</b></header><p class="for-preview__address">aura.my/cam-turns-17</p><div class="birthday-yearbook"><p>the internet yearbook is open</p><h3>turning<br>seventeen<br>loudly.</h3><button type="button" data-for-action="gift" aria-expanded="false">open the gift ✦</button><small data-for-result role="status" aria-live="polite" hidden>confetti coupon: one extremely serious cake vote.</small></div></article>`,
  `<article class="for-preview for-preview--setlist"><header><b>MOON TAXI</b><span>garage show / fri</span></header><p class="for-preview__address">aura.my/moon-taxi</p><ol><li>01 <b>car keys</b></li><li>02 <b>fluorescent</b></li><li>03 <b>last bus home</b></li></ol><button type="button" data-for-action="setlist" aria-pressed="false">flip to encore</button><p data-for-result role="status" aria-live="polite">doors at 7. bring a friend.</p></article>`,
  `<article class="for-preview for-preview--museum"><header><b>inside joke museum</b><span>exhibit 03</span></header><p class="for-preview__address">aura.my/spoon-museum</p><div class="museum-plaque"><span>please do not touch</span><svg class="museum-spoon" viewBox="0 0 130 74" aria-hidden="true"><ellipse cx="28" cy="27" rx="21" ry="17" fill="#d8c9a8" stroke="#6b5940" stroke-width="4"/><path d="M45 35C72 42 94 53 119 65" fill="none" stroke="#6b5940" stroke-width="12" stroke-linecap="round"/><path d="M45 34C71 41 93 51 119 64" fill="none" stroke="#e6dac0" stroke-width="5" stroke-linecap="round"/></svg><button type="button" data-for-action="plaque" aria-pressed="false">THE FORBIDDEN SPOON</button><p data-for-result role="status" aria-live="polite">the spoon is currently behaving.</p></div></article>`,
  `<article class="for-preview for-preview--game"><header><b>tiny game jam</b><span>build 0.7</span></header><p class="for-preview__address">aura.my/little-comet</p><div class="game-screen"><p>catch the little comet</p><button class="game-comet" type="button" data-for-action="comet" aria-label="Catch the little comet">☄</button><span data-for-result role="status" aria-live="polite">comets caught: 0</span></div></article>`,
];

export function renderForPreviews(host) {
  if (!host) return;
  host.innerHTML = previews.join('');
  if (host.dataset.forPreviewsBound) return;
  host.dataset.forPreviewsBound = 'true';
  host.addEventListener('click', (event) => {
    const button = event.target.closest('[data-for-action]');
    if (!button) return;
    const card = button.closest('.for-preview');
    const result = card.querySelector('[data-for-result]');
    if (button.dataset.forAction === 'gift') { result.hidden = !result.hidden; button.setAttribute('aria-expanded', String(!result.hidden)); button.textContent = result.hidden ? 'open the gift ✦' : 'wrap it back up'; }
    if (button.dataset.forAction === 'setlist') { const on = button.getAttribute('aria-pressed') === 'true'; button.setAttribute('aria-pressed', String(!on)); button.textContent = on ? 'flip to encore' : 'back to set one'; result.textContent = on ? 'doors at 7. bring a friend.' : 'encore: one more song, obviously.'; }
    if (button.dataset.forAction === 'plaque') { const on = button.getAttribute('aria-pressed') === 'true'; button.setAttribute('aria-pressed', String(!on)); result.textContent = on ? 'the spoon is currently behaving.' : 'SPOON NOISE: BONGGG!'; }
    if (button.dataset.forAction === 'comet') { const count = +(card.dataset.comets || 0) + 1; card.dataset.comets = count; button.style.setProperty('--comet-x', `${11 + (count * 29) % 67}%`); button.style.setProperty('--comet-y', `${22 + (count * 17) % 53}%`); result.textContent = `comets caught: ${count}`; }
  });
}

// Transitional alias for any page still importing the old renderer name.
export const renderSitePreviewCards = renderForPreviews;
