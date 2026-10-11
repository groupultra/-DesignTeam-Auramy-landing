// "Make yours": a four-step setup wizard in a Mac installer window, next to a phone that builds
// your page as you click (name → what it's for → look → live). Back / Next only; no
// accounts or real domains. The finished page is fully tappable.
import { PERSONAS, ORDER } from './personas.js';
import { doodle } from './doodles.js';
import { mountYourPage } from './your-page.js?v=early-web-2';

const FOR = { camila: 'the group chat', maddie: 'close friends', marcus: 'the team', jayden: 'memes', river: 'my OC', theo: 'movies', aaliyah: 'my shop' };
const STEPS = ['Name it', 'What’s it for?', 'Pick a look', 'It’s live'];
const SHARE = [['tiktok-logo', 'TikTok'], ['instagram-logo', 'Instagram'], ['snapchat-logo', 'Snapchat'], ['discord-logo', 'Discord']];
const PUBLISH_MS = 1100;

const slug = (raw) => (raw || '').trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '').slice(0, 20) || 'you';
const motionOff = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('is-motion-paused');

export function initSetupWizard(build, { onName, toast } = {}) {
  const host = build?.querySelector('[data-wizard]');
  const screen = build?.querySelector('[data-your-page]');
  if (!host || !screen) return {};
  host.innerHTML = `
    <header class="xpwin__bar"><img class="xpwin__icon" src="/assets/img/brand/auramy-monitor.jpg?v=materials-8" alt="" width="16" height="16"><b class="xpwin__title">Auramy Setup</b><span class="xpwin__btns" aria-hidden="true"><button type="button" tabindex="-1">_</button><button type="button" class="is-close" tabindex="-1">×</button></span></header>
    <div class="wizard__body">
      <aside class="wizard__side" aria-hidden="true"><span class="wizard__appicon">${doodle('smile')}</span><ol class="wizard__steps">${STEPS.map((label) => `<li>${label}</li>`).join('')}</ol></aside>
      <div class="wizard__main">
        <section class="wizard__step" data-step="0" aria-labelledby="wiz-0">
          <h3 id="wiz-0">What should we call you?</h3>
          <label class="addr addr--small"><span class="addr__prefix">aura.my/</span><input data-wiz-name data-handle-sync maxlength="20" autocomplete="off" spellcheck="false" placeholder="yourname" aria-label="Your name"></label>
          <p class="wizard__hint">${doodle('arrow')}<span>watch it build itself</span></p>
        </section>
        <section class="wizard__step" data-step="1" aria-labelledby="wiz-1" hidden>
          <h3 id="wiz-1">What’s it for?</h3>
          <div class="wizard__chips" role="group" aria-labelledby="wiz-1">${ORDER.map((id) => `<button type="button" data-wiz-for="${id}" aria-pressed="${id === 'camila'}">${FOR[id]}</button>`).join('')}</div>
        </section>
        <section class="wizard__step" data-step="2" aria-labelledby="wiz-2" hidden>
          <h3 id="wiz-2">Pick a look.</h3>
          <div class="wizard__looks" role="radiogroup" aria-labelledby="wiz-2">${ORDER.map((id) => `<button type="button" role="radio" data-wiz-look="${id}" aria-checked="false" style="--look:${PERSONAS[id].color}"><i></i><b>${PERSONAS[id].template}</b></button>`).join('')}</div>
        </section>
        <section class="wizard__step" data-step="3" aria-labelledby="wiz-3" hidden>
          <h3 id="wiz-3">It’s live. Go tap it.</h3>
          <div class="wizard__done"><p>aura.my/<b data-wiz-final>you</b></p><button type="button" class="xp-btn" data-wiz-copy>copy link</button></div>
          <p class="wizard__share"><span>put it in your bio:</span>${SHARE.map(([icon, label]) => `<button type="button" data-wiz-share="${label}" aria-label="Add to ${label} bio"><i class="ph-fill ph-${icon}" aria-hidden="true"></i></button>`).join('')}</p>
        </section>
      </div>
    </div>
    <footer class="wizard__foot">
      <div class="wizard__progress" role="progressbar" aria-label="Setup progress" aria-valuemin="1" aria-valuemax="4" aria-valuenow="1">${STEPS.map(() => '<i></i>').join('')}</div>
      <p class="wizard__count" data-wiz-count aria-live="polite">Step 1 of 4</p>
      <button type="button" class="xp-btn" data-wiz-back disabled>Go Back</button>
      <button type="button" class="xp-btn xp-btn--go" data-wiz-next>Continue</button>
    </footer>`;

  const $ = (s) => host.querySelector(s);
  const steps = [...host.querySelectorAll('[data-step]')];
  const nameInput = $('[data-wiz-name]');
  const nextBtn = $('[data-wiz-next]');
  const page = mountYourPage(screen);
  let step = 0;
  let forId = 'camila';
  let look = 'camila';
  let lookTouched = false;
  let publishing = 0;

  const onPhone = matchMedia('(max-width: 899px)');
  const section = build.closest('section');
  let snapTimer = 0;

  // Phones: the builder is one screen, its bottom on the bottom of the screen. Typing opens the
  // keyboard and pushes it up; once the keyboard goes away (or a step changes) put it back so
  // the page preview is in view again.
  function snapBack(delay = 0) {
    if (!onPhone.matches || !section || build.hasAttribute('data-live')) return;
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      const box = section.getBoundingClientRect();
      if (box.top > window.innerHeight * 0.6 || box.bottom < window.innerHeight * 0.4) return; // they scrolled away
      const dy = box.bottom - window.innerHeight;
      if (Math.abs(dy) > 2) window.scrollBy({ top: dy, behavior: motionOff() ? 'auto' : 'smooth' });
    }, delay);
  }
  // Leaving the name field closes the keyboard; snap once it has slid away.
  const leaveField = () => {
    if (document.activeElement !== nameInput) { snapBack(); return; }
    nameInput.blur();
    snapBack(380);
  };

  const pageName = () => nameInput.value.trim().toLowerCase() || 'you';
  const syncPage = () => page.update({ name: pageName(), slug: slug(nameInput.value), forId, look, stage: Math.min(step, 2) });
  const syncName = () => { $('[data-wiz-final]').textContent = slug(nameInput.value); syncPage(); };
  const syncLook = () => host.querySelectorAll('[data-wiz-look]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.wizLook === look)));

  function go(next) {
    clearTimeout(publishing);
    publishing = 0;
    step = Math.max(0, Math.min(STEPS.length - 1, next));
    steps.forEach((s, i) => { s.hidden = i !== step; });
    host.querySelectorAll('.wizard__progress i').forEach((bar, i) => bar.classList.toggle('is-on', i <= step));
    host.classList.remove('is-publishing');
    build.classList.remove('is-publishing');
    $('.wizard__progress').setAttribute('aria-valuenow', String(step + 1));
    $('[data-wiz-count]').textContent = `Step ${step + 1} of ${STEPS.length}`;
    $('[data-wiz-back]').disabled = step === 0;
    nextBtn.disabled = false;
    nextBtn.textContent = step === 2 ? 'Publish' : step === 3 ? 'Start Over' : 'Continue';
    host.querySelectorAll('.wizard__steps li').forEach((li, i) => { li.classList.toggle('is-on', i === step); li.classList.toggle('is-done', i < step); });
    if (step === 2) { if (!lookTouched) look = forId; syncLook(); }
    syncPage();
    const live = step === 3;
    build.toggleAttribute('data-live', live);
    if (live) page.goLive(); else page.offline();
  }

  function publish() {
    host.classList.add('is-publishing');
    build.classList.add('is-publishing');
    nextBtn.disabled = true;
    $('[data-wiz-count]').textContent = 'Publishing…';
    publishing = setTimeout(() => {
      go(3);
      // On a phone the result sits above the window: bring all of it into view, below the nav.
      const box = build.querySelector('.build__device').getBoundingClientRect();
      if (box.top < 60 || box.bottom > window.innerHeight) window.scrollBy({ top: box.top - 72, behavior: motionOff() ? 'auto' : 'smooth' });
    }, motionOff() ? 0 : PUBLISH_MS);
  }

  nameInput.addEventListener('input', () => { syncName(); onName?.(nameInput.value); });
  nameInput.addEventListener('blur', () => snapBack(380));
  nameInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    go(1);
    leaveField();
  });
  host.addEventListener('click', (event) => {
    const pick = event.target.closest('[data-wiz-for]');
    if (pick) {
      forId = pick.dataset.wizFor;
      host.querySelectorAll('[data-wiz-for]').forEach((b) => b.setAttribute('aria-pressed', String(b === pick)));
      syncPage();
      return;
    }
    const lk = event.target.closest('[data-wiz-look]');
    if (lk) { look = lk.dataset.wizLook; lookTouched = true; syncLook(); syncPage(); return; }
    if (event.target.closest('[data-wiz-back]')) { go(step - 1); leaveField(); return; }
    const share = event.target.closest('[data-wiz-share]');
    if (share || event.target.closest('[data-wiz-copy]')) {
      const link = `aura.my/${slug(nameInput.value)}`;
      navigator.clipboard?.writeText(link).catch(() => {});
      toast?.(share ? `copied <b>${link}</b>. paste it in your ${share.dataset.wizShare} bio.` : `copied <b>${link}</b>. paste it in the group chat.`);
      return;
    }
    if (event.target.closest('[data-wiz-next]')) {
      if (step === 2) { if (document.activeElement === nameInput) nameInput.blur(); publish(); return; }
      if (step === 3) { page.reset(); lookTouched = false; go(0); leaveField(); return; }
      go(step + 1);
      leaveField();
    }
  });

  syncName();
  go(0);
  return {
    setName(value) { if (document.activeElement !== nameInput) { nameInput.value = value; syncName(); } },
  };
}
