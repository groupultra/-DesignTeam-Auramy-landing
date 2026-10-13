// Brand kit: the shared doodle sprite, tap-to-copy swatches, and the skin demo that puts the
// same Auramy window into four different screens.
import { injectDoodles } from './doodles.js';

injectDoodles();

const NOTES = {
  xp: 'Blue title bar, a Start button with the smiley on it, a hill under the sky.',
  mac: 'Traffic lights, a frosted Dock with the smiley as the app icon, a blue wallpaper with a yellow glow.',
  game: 'A dark game panel, a hotbar with the smiley in slot 1, a studded baseplate.',
  sim: 'A glassy panel with a blue header, round portraits in the control bar, a sunny lawn.',
};

const status = document.querySelector('[data-copied]');
let statusTimer = 0;
document.addEventListener('click', (event) => {
  const swatch = event.target.closest('[data-hex]');
  if (!swatch) return;
  const hex = swatch.dataset.hex;
  const done = () => {
    status.textContent = `copied ${hex}`;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.textContent = ''; }, 1800);
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(hex).then(done, done);
  else done();
});

const skins = document.querySelector('[data-skins]');
if (skins) {
  const stage = skins.querySelector('[data-stage]');
  const note = skins.querySelector('[data-skin-note]');
  const tabs = [...skins.querySelectorAll('[data-skin]')];
  const pick = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    stage.dataset.stage = tab.dataset.skin;
    note.textContent = NOTES[tab.dataset.skin];
  };
  tabs.forEach((tab, i) => {
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener('click', () => pick(tab));
    tab.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const next = tabs[(i + step + tabs.length) % tabs.length];
      pick(next);
      next.focus();
    });
  });
}
