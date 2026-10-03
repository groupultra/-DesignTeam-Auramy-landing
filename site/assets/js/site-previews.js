// Distinct, self-contained examples of the kinds of tiny websites Auramy can make.
// They are local demos: no links leave this page.

const assets = {
  pet: '/assets/img/editorial/miso.jpg',
  oc: '/assets/img/editorial/oc-courier.jpg',
  selfie: '/assets/img/editorial/raw-selfie.jpg',
};

export const previewMarkup = (kind, compact = false) => {
  const size = compact ? ' site-preview--compact' : '';
  if (kind === 'pet') return `<article class="site-preview site-preview--pet${size}" aria-label="Miso's pet website">
    <header><b>aura.my/miso</b><nav aria-label="Miso's site"><span>about me</span><span>diary</span></nav></header>
    <div class="pet-hero"><img src="${assets.pet}" alt="Miso, a cream scruffy dog in an indoor close-up" loading="lazy"><div><p>HELLO I AM</p><h3>MISO!</h3><span>tiny mayor of the park</span></div></div>
    <footer><span>today's agenda: <b>sniff · nap · bark</b></span><i>♥ 47 treats</i></footer>
  </article>`;
  if (kind === 'oc') return `<article class="site-preview site-preview--oc${size}" aria-label="Sora Courier original character website">
    <header><span>aura.my/jay/sora</span><b>● ONLINE</b></header>
    <div class="oc-body"><img src="${assets.oc}" alt="Illustration of Sora, an original anime courier character" loading="lazy"><div class="oc-copy"><p>ORIGINAL CHARACTER</p><h3>SORA<br>KURO</h3><dl><div><dt>class</dt><dd>night courier</dd></div><div><dt>delivers</dt><dd>lost letters</dd></div></dl></div></div>
    <footer><span>archive 04 / 12</span><span>read lore →</span></footer>
  </article>`;
  if (kind === 'sheet') return `<article class="site-preview site-preview--sheet${size}" aria-label="Weekend money spreadsheet website">
    <header><b>aura.my/noah/fund</b><span>saved just now</span></header>
    <div class="sheet-grid" role="table" aria-label="Weekend fund spreadsheet"><span></span><b>A</b><b>B</b><b>C</b><b>1</b><strong>thing</strong><strong>cost</strong><strong>yes?</strong><b>2</b><span>movie</span><i>$14</i><em>✓</em><b>3</b><span>noodles</span><i>$11</i><em>✓</em><b>4</b><span>thrift hunt</span><i>$18</i><em>?</em><b>5</b><strong>TOTAL</strong><strong>$43</strong><em>!</em></div>
    <footer><span>goal: $60</span><b>72% there</b></footer>
  </article>`;
  return `<article class="site-preview site-preview--selfie${size}" aria-label="Maya's personal photo website">
    <header><span>aura.my/maya · 2:14am</span><b>✦</b></header>
    <div class="selfie-body"><img src="${assets.selfie}" alt="A close-up personal selfie" loading="lazy"><p>hi, i made a place for<br><b>everything i can't stop<br>thinking about.</b></p><span>currently: too many tabs</span></div>
    <footer><span>leave a note ↗</span><span>est. today</span></footer>
  </article>`;
};

export function renderHeroSitePreviews(host) {
  if (!host) return;
  const heroSelfie = previewMarkup('selfie')
    .replace('<article class="site-preview site-preview--selfie', '<article id="heroPreview" data-theme="lime" class="site-preview site-preview--selfie')
    .replace('<header><span>aura.my/maya · 2:14am</span><b>✦</b></header>', '<header><span>aura.my/<b data-preview-handle>mia</b> · 2:14am</span><b>✦</b></header>')
    .replace("hi, i made a place for<br><b>everything i can't stop<br>thinking about.</b>", 'oh hey, <b data-preview-name>mia</b>.<br>this is my whole<br>internet.')
    .replace('<footer><span>leave a note ↗</span><span>est. today</span></footer>', '<footer><span>aura.my/<b data-preview-handle>mia</b></span><button type="button" data-preview-theme>remix ↯</button></footer>');
  host.innerHTML = `<div class="site-preview-collage" aria-label="Four wildly different personal website previews">
    <div class="site-preview-collage__main">${heroSelfie}</div>
    <div class="site-preview-collage__pet">${previewMarkup('pet', true)}</div>
    <div class="site-preview-collage__oc">${previewMarkup('oc', true)}</div>
    <div class="site-preview-collage__sheet">${previewMarkup('sheet', true)}</div>
  </div>`;
}

export function renderSitePreviewCards(host) {
  if (!host) return;
  host.innerHTML = `${previewMarkup('pet')}${previewMarkup('oc')}${previewMarkup('sheet')}${previewMarkup('selfie')}`;
}
