// The hero collage: the three lead personas' worlds, cropped from their simplified templates.
// Local demos only: no links leave this page.
import { PERSONAS, personaAvatar } from './personas.js';
import { homeMarkup } from './persona-sites.js?v=personas-1';

export function renderHeroSitePreviews(host) {
  if (!host) return;
  host.classList.add('has-personas');
  const card = (id, slot) => {
    const p = PERSONAS[id];
    return `<article class="persona-card persona-card--${id} persona-collage__${slot}" aria-label="${p.name}'s world, ${p.template}">
      <header><span>${p.url}</span><b>${p.template}</b></header>
      <div class="persona-card__screen" inert>${homeMarkup(id)}</div>
      <a class="persona-card__who" href="#story-${id}"><img src="${personaAvatar(id)}" alt="" width="40" height="40"><span><b>${p.name}</b>${p.hook}</span></a>
    </article>`;
  };
  host.innerHTML = `<div class="persona-collage" aria-label="Three Auramy worlds: Camila, Maddie and Marcus">
    ${card('maddie', 'left')}${card('camila', 'main')}${card('marcus', 'right')}
    <p class="persona-collage__you" aria-hidden="true">aura.my/<b data-preview-handle>you</b> ← yours next</p>
  </div>`;
}
