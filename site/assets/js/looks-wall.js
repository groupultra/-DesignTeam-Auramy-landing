// "Everyone's looks different": one screen of other people's pages, for a quick glance
// (an art kid, an athlete, a film nerd, a gamer, a coder…), ending on an empty one for you.
// Pages are static previews; the full stories live on the ad landing pages.
import { PERSONAS } from './personas.js';
import { homeMarkup } from './persona-sites.js?v=early-web-1';
import { eliPage } from './showcase-pages.js?v=1';

const TILES = [
  { id: 'river', who: 'art kid' },
  { id: 'marcus', who: 'athlete' },
  { id: 'theo', who: 'film nerd' },
  { id: 'jayden', who: 'gamer' },
  { id: 'eli', who: 'coder', url: 'aura.my/eli', look: 'Terminal' },
  { id: 'camila', who: 'the group chat' },
  { id: 'maddie', who: 'close friends only' },
];
const TILT = [-2.2, 1.6, -1.2, 2.4, -1.8, 1.2, -2.6, 1.8];

export function renderLooksWall(host) {
  if (!host) return;
  const tiles = TILES.map(({ id, who, url, look }, i) => {
    const p = PERSONAS[id];
    const page = id === 'eli' ? eliPage() : homeMarkup(id);
    return `<li class="lw__tile" style="--r:${TILT[i]}deg">
      <div class="lw__win"><p class="lw__bar"><i aria-hidden="true"></i><span>${url || p.url}</span></p><div class="lw__screen" inert aria-hidden="true">${page}</div></div>
      <p class="lw__label"><b>${who}</b><small>${look || p.template}</small></p>
    </li>`;
  });
  tiles.push(`<li class="lw__tile lw__tile--you" style="--r:${TILT[7]}deg">
      <a class="lw__win" href="#how"><p class="lw__bar"><i aria-hidden="true"></i><span>aura.my/you</span></p><span class="lw__blank"><b>+</b>yours goes here<em>make one ↓</em></span></a>
      <p class="lw__label"><b>you</b><small>any look you want</small></p>
    </li>`);
  host.innerHTML = tiles.join('');
}
