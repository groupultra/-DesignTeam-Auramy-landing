// "Three people. Three reasons." — the lead personas (Camila, Maddie, Marcus), each with
// the tension they live with, what Auramy gives them, and one small thing to try.
import { PERSONAS, LEADS, personaAvatar } from './personas.js';

const POLAROIDS = {
  camila: [['grad', 'grad day. all six of us.', 'Camila and five friends in graduation gowns, squeezed into one selfie'], ['airport', 'airport. ok bye. ok one more.', 'Camila and Sofia taking a selfie at airport drop-off'], ['newfriends', 'new people (still us).', 'Sofia with new college friends in a dorm hallway']],
  maddie: [['bus', 'the 3:15 bus. half of me.', 'Maddie half-reflected in a bus window'], ['mirror', 'jacket check. face not included.', 'A fitting-room mirror selfie with the phone covering Maddie’s face'], ['earbuds', 'one earbud each.', 'Two pairs of knees sharing wired earbuds']],
  marcus: [['team', 'same people. different cameras.', 'The full Eagles team with coaches on the field'], ['table', 'after the game.', 'Marcus and teammates at a long restaurant table, from a teammate’s selfie'], ['fridge', 'mom printed it.', 'A game photo of Marcus stuck on the family fridge']],
};

const PRONOUN = { camila: 'her', maddie: 'her', marcus: 'his' };

const extras = {
  camila: () => `<form class="story-maker" data-maker aria-label="Make a page for a friend">
    <p class="story-extra__label">make one for someone</p>
    <div class="story-maker__row">
      <label class="story-maker__field"><span>who's it for?</span><input name="for" maxlength="14" placeholder="noor" autocomplete="off" spellcheck="false"></label>
      <label class="story-maker__field"><span>what kind?</span><select name="kind"><option value="birthday">birthday page</option><option value="summer">last-summer yearbook</option><option value="jokes">inside-joke museum</option></select></label>
      <button type="submit">make it ↗</button>
    </div>
    <div class="story-maker__preview" aria-live="polite">
      <p class="story-maker__url">aura.my/<b data-maker-slug>noor-turns-19</b></p>
      <h4 data-maker-title>happy birthday, noor 🎂</h4>
      <ul class="story-maker__signers" aria-label="Friends who signed"><li>cami ✓</li><li>dani ✓</li><li>jules ✓</li><li class="is-waiting">priya …</li><li class="is-waiting">bea …</li></ul>
      <p class="story-maker__note">friends open it from the group chat — no app, no sign-up.</p>
    </div>
  </form>`,
  maddie: () => {
    const p = PERSONAS.maddie.photos;
    const fig = (tier, src, cap, alt) => `<figure data-tier="${tier}"><img src="${src}" alt="${alt}" loading="lazy" decoding="async"><figcaption>${cap}</figcaption></figure>`;
    return `<div class="story-lens" data-lens="anyone">
      <div class="story-lens__switch" role="group" aria-label="Who's looking at Maddie's page?"><span class="story-extra__label">who's looking?</span><button type="button" data-lens-btn="anyone" aria-pressed="true">anyone with the link</button><button type="button" data-lens-btn="cf" aria-pressed="false">★ close friends</button></div>
      <div class="story-lens__grid">
        ${fig('anyone', p.seat, 'saved me a seat', 'A library table with a coffee and an empty chair')}
        ${fig('anyone', p.soup, 'someone left soup', 'A cup of soup left on a nightstand')}
        ${fig('anyone', p.doodle, 'margin doodle', 'A doodle in the margin of a notebook')}
        ${fig('cf', p.friends, 'waiting for zoe’s shoelace', 'Hannah holding two drinks while Zoe ties her shoe')}
        ${fig('cf', p.bedtime, 'bedtime. one song.', 'Maddie’s half-hidden selfie in bed with one earbud in')}
        ${fig('cf', p.remake, 'the photo remake', 'Zoe reaching toward the camera, remaking a failed photo')}
      </div>
      <p class="story-lens__note" data-lens-note role="status" aria-live="polite">anyone sees the soup. close friends see who left it.</p>
    </div>`;
  },
  marcus: () => `<div class="story-roster">
    <header><b>EAGLES · WR ROOM</b><span>aura.my/eagles-wr-room</span></header>
    <ol data-roster>
      <li class="is-senior"><b>11</b><span>marcus</span><em>C · SR</em></li>
      <li class="is-senior"><b>14</b><span>dre</span><em>SR</em></li>
      <li class="is-senior"><b>82</b><span>luis</span><em>SR</em></li>
      <li><b>3</b><span>tre</span><em>JR</em></li>
      <li><b>7</b><span>kj</span><em>SO</em></li>
    </ol>
    <p class="story-roster__note" data-roster-note role="status" aria-live="polite">seniors get the top row. 40 in the chat · 23 on the page so far.</p>
    <button type="button" data-roster-add>+ add yourself to the roster</button>
  </div>`,
};

const story = (id) => {
  const p = PERSONAS[id];
  const pol = POLAROIDS[id].map(([key, cap, alt], i) => `<figure class="story__photo story__photo--${i}"><img src="${p.photos[key]}" alt="${alt}" loading="lazy" decoding="async"><figcaption>${cap}</figcaption></figure>`).join('');
  return `<article class="story story--${id}" id="story-${id}" aria-labelledby="story-${id}-title" style="--story-accent:${p.color}">
    <div class="story__photos">${pol}</div>
    <div class="story__copy">
      <p class="story__who"><img src="${personaAvatar(id)}" alt="" width="56" height="56"><span><b>${p.name}</b>${p.meta}<em>${p.role}</em></span></p>
      <h3 class="story__hook" id="story-${id}-title">${p.hook}</h3>
      <p class="story__tension">${p.tension}</p>
      <p class="story__makes">${p.makes}</p>
      <ul class="story__gives">${p.gives.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ul>
      <p class="story__lives"><span>shared from</span>${p.lives.map((app) => `<i>${app}</i>`).join('')}</p>
      <blockquote class="story__quote">“${p.quote}”</blockquote>
      <a class="story__cta" href="#spaces" data-world-jump="${id}">see ${PRONOUN[id]} world: ${p.template} ↓</a>
    </div>
    <div class="story__extra">${extras[id]()}</div>
  </article>`;
};

const slugFor = (name, kind) => {
  const n = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'noor';
  if (kind === 'summer') return [`last-summer-ft-${n}`, `our last summer, ft. ${n}`];
  if (kind === 'jokes') return [`${n}-museum`, `the ${n} museum (do not touch)`];
  return [`${n}-turns-19`, `happy birthday, ${n} 🎂`];
};

export function renderPeople(host) {
  if (!host) return;
  host.innerHTML = LEADS.map(story).join('');

  const maker = host.querySelector('[data-maker]');
  const syncMaker = () => {
    const [slug, title] = slugFor(maker.elements.for.value.trim(), maker.elements.kind.value);
    maker.querySelector('[data-maker-slug]').textContent = slug;
    maker.querySelector('[data-maker-title]').textContent = title;
  };
  maker?.addEventListener('input', syncMaker);
  maker?.addEventListener('change', syncMaker);
  maker?.addEventListener('submit', (event) => {
    event.preventDefault();
    syncMaker();
    maker.querySelectorAll('.is-waiting').forEach((li) => { li.classList.remove('is-waiting'); li.textContent = li.textContent.replace('…', '✓'); });
    maker.querySelector('.story-maker__note').textContent = 'link copied for the group chat (demo). everyone signed. ok, now cry.';
  });

  const lens = host.querySelector('[data-lens]');
  lens?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-lens-btn]');
    if (!btn) return;
    const tier = btn.dataset.lensBtn;
    lens.dataset.lens = tier;
    lens.querySelectorAll('[data-lens-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    lens.querySelector('[data-lens-note]').textContent = tier === 'cf'
      ? 'if you’re reading this you’re in the gc. welcome to the car.'
      : 'anyone sees the soup. close friends see who left it.';
  });

  const add = host.querySelector('[data-roster-add]');
  add?.addEventListener('click', () => {
    const list = host.querySelector('[data-roster]');
    if (!list.querySelector('.is-you')) list.insertAdjacentHTML('beforeend', '<li class="is-you"><b>??</b><span>you</span><em>walk-on</em></li>');
    host.querySelector('[data-roster-note]').textContent = 'added. dre already roasted your number. welcome to the room.';
    add.disabled = true;
    add.textContent = 'you’re on the page ✓';
  });

  host.addEventListener('click', (event) => {
    const jump = event.target.closest('[data-world-jump]');
    if (!jump) return;
    event.preventDefault();
    document.dispatchEvent(new CustomEvent('auramy:world', { detail: jump.dataset.worldJump }));
  });
}
