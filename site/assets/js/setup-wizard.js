// "Make yours": a four-step setup wizard in an XP-style window. Back / Next only; no
// accounts or real domains. Step 2 echoes the seven personas: whatever it's for, there's a look.
import { PERSONAS, ORDER } from './personas.js';
import { homeMarkup } from './persona-sites.js?v=early-web-1';
import { doodle } from './doodles.js';

const FOR = { camila: 'the group chat', maddie: 'close friends', marcus: 'the team', jayden: 'memes', river: 'my OC', theo: 'movies', aaliyah: 'my shop' };
const STEPS = ['Name it', 'What’s it for?', 'Pick a look', 'Send it'];
const REPLIES = [['maddie', 'WAIT how'], ['marcus', 'signing ur wall rn'], ['jayden', 'beat ur score btw. 88.']];

const slug = (raw) => (raw || '').trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '').slice(0, 20) || 'you';

export function initSetupWizard(host, { onName, toast } = {}) {
  if (!host) return () => {};
  host.innerHTML = `
    <header class="xpwin__bar"><img class="xpwin__icon" src="/assets/img/brand/auramy-monitor.jpg?v=materials-8" alt="" width="16" height="16"><b class="xpwin__title">Auramy Setup</b><span class="xpwin__btns" aria-hidden="true"><button type="button" tabindex="-1">_</button><button type="button" class="is-close" tabindex="-1">×</button></span></header>
    <div class="wizard__body">
      <aside class="wizard__side" aria-hidden="true">${doodle('smile')}<span>auramy</span></aside>
      <div class="wizard__main">
        <section class="wizard__step" data-step="0" aria-labelledby="wiz-0">
          <h3 id="wiz-0">What should we call you?</h3>
          <label class="addr addr--small"><span class="addr__prefix">aura.my/</span><input data-wiz-name data-handle-sync maxlength="20" autocomplete="off" spellcheck="false" placeholder="yourname" aria-label="Your name"></label>
          <p class="wizard__card"><span>${doodle('smile')}</span><b data-wiz-show-name>you</b><i>aura.my/<span data-wiz-show-slug>you</span></i></p>
        </section>
        <section class="wizard__step" data-step="1" aria-labelledby="wiz-1" hidden>
          <h3 id="wiz-1">What’s it for?</h3>
          <div class="wizard__chips" role="group" aria-labelledby="wiz-1">${ORDER.map((id) => `<button type="button" data-wiz-for="${id}" aria-pressed="${id === 'camila'}">${FOR[id]}</button>`).join('')}</div>
          <div class="wizard__peek" data-wiz-peek inert></div>
        </section>
        <section class="wizard__step" data-step="2" aria-labelledby="wiz-2" hidden>
          <h3 id="wiz-2">Pick a look.</h3>
          <div class="wizard__looks" role="radiogroup" aria-labelledby="wiz-2">${ORDER.map((id) => `<button type="button" role="radio" data-wiz-look="${id}" aria-checked="false" style="--look:${PERSONAS[id].color}"><i></i><b>${PERSONAS[id].template}</b></button>`).join('')}</div>
        </section>
        <section class="wizard__step" data-step="3" aria-labelledby="wiz-3" hidden>
          <h3 id="wiz-3">Send it to your people.</h3>
          <div class="wizard__done"><p>aura.my/<b data-wiz-final>you</b></p><button type="button" class="xp-btn" data-wiz-copy>copy link</button></div>
          <ol class="wizard__chat" aria-label="Group chat preview">
            <li class="is-me">look what i made 👀</li>
            ${REPLIES.map(([who, text]) => `<li><img src="/assets/img/av/${who}.jpg" alt="" width="24" height="24"><span><b>${who}</b>${text}</span></li>`).join('')}
          </ol>
        </section>
      </div>
    </div>
    <footer class="wizard__foot">
      <div class="wizard__progress" role="progressbar" aria-label="Setup progress" aria-valuemin="1" aria-valuemax="4" aria-valuenow="1">${STEPS.map(() => '<i></i>').join('')}</div>
      <p class="wizard__count" data-wiz-count>Step 1 of 4</p>
      <button type="button" class="xp-btn" data-wiz-back disabled>&lt; Back</button>
      <button type="button" class="xp-btn xp-btn--go" data-wiz-next>Next &gt;</button>
    </footer>`;

  const $ = (s) => host.querySelector(s);
  const steps = [...host.querySelectorAll('[data-step]')];
  const nameInput = $('[data-wiz-name]');
  const peek = $('[data-wiz-peek]');
  let step = 0;
  let forId = 'camila';
  let look = 'camila';

  const syncName = () => {
    const value = nameInput.value.trim();
    $('[data-wiz-show-name]').textContent = value.toLowerCase() || 'you';
    $('[data-wiz-show-slug]').textContent = slug(value);
    $('[data-wiz-final]').textContent = slug(value);
  };
  const syncPeek = () => { peek.innerHTML = homeMarkup(forId); };
  const syncLook = () => host.querySelectorAll('[data-wiz-look]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.wizLook === look)));

  function go(next) {
    step = Math.max(0, Math.min(STEPS.length - 1, next));
    steps.forEach((s, i) => { s.hidden = i !== step; });
    host.querySelectorAll('.wizard__progress i').forEach((bar, i) => bar.classList.toggle('is-on', i <= step));
    $('.wizard__progress').setAttribute('aria-valuenow', String(step + 1));
    $('[data-wiz-count]').textContent = `Step ${step + 1} of ${STEPS.length}`;
    $('[data-wiz-back]').disabled = step === 0;
    $('[data-wiz-next]').innerHTML = step === STEPS.length - 1 ? 'Finish' : 'Next &gt;';
    if (step === 1 && !peek.innerHTML) syncPeek();
    if (step === 2) { look = forId; syncLook(); }
  }

  nameInput.addEventListener('input', () => { syncName(); onName?.(nameInput.value); });
  host.addEventListener('click', (event) => {
    const pick = event.target.closest('[data-wiz-for]');
    if (pick) {
      forId = pick.dataset.wizFor;
      host.querySelectorAll('[data-wiz-for]').forEach((b) => b.setAttribute('aria-pressed', String(b === pick)));
      syncPeek();
      return;
    }
    const lk = event.target.closest('[data-wiz-look]');
    if (lk) { look = lk.dataset.wizLook; syncLook(); return; }
    if (event.target.closest('[data-wiz-back]')) { go(step - 1); return; }
    if (event.target.closest('[data-wiz-copy]')) {
      const link = `aura.my/${slug(nameInput.value)}`;
      navigator.clipboard?.writeText(link).catch(() => {});
      toast?.(`copied <b>${link}</b>. paste it in the group chat.`);
      return;
    }
    if (event.target.closest('[data-wiz-next]')) {
      if (step === STEPS.length - 1) {
        toast?.(`<b>aura.my/${slug(nameInput.value)}</b> is a preview for now. claiming opens soon.`, 4200);
        go(0);
        return;
      }
      go(step + 1);
    }
  });

  syncName();
  go(0);
  return {
    setName(value) { if (document.activeElement !== nameInput) { nameInput.value = value; syncName(); } },
  };
}
