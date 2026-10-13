// Pages that only this version needs: Cami's full page (the "fancy" reveal) and Eli's coder
// page (one more kind of person on the wall of pages). Sized in cqw like persona-sites.js.
import { PERSONAS, personaAvatar } from './personas.js';

const P = PERSONAS;
const AV = { noor: '/assets/img/av/ava.jpg', jules: '/assets/img/av/lu.jpg', priya: '/assets/img/av/zara.jpg' };

/** Cami's page, block by block. Each block carries data-blk so the reveal can point at it. */
export const camiPage = () => `<div class="cp" data-look="edit">
  <p class="cp__top"><span>cami's cut · edit #37</span><span>boston ☾</span></p>
  <header class="cp__head"><img class="cp__av" src="${personaAvatar('camila')}" alt="" width="64" height="64"><div><h3>cami</h3><p>18 · sd → boston. i make everyone's birthday edits.</p></div></header>
  <figure class="cp__reel cp__blk" data-blk="reel"><img src="${P.camila.photos.grad}" alt="Cami and her friends in graduation gowns" loading="lazy" decoding="async"><figcaption>grad day</figcaption><i class="cp__strip" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></i></figure>
  <section class="cp__song cp__blk" data-blk="song"><i class="cp__cover" aria-hidden="true"></i><span><small>on repeat</small><b>Ribs</b><small>Lorde</small></span><span class="cp__same">same 🤝</span></section>
  <section class="cp__dump cp__blk" data-blk="dump"><b>camera roll</b><span>${['pool', 'beach', 'camp', 'car'].map((k) => `<img src="${P.camila.photos[k]}" alt="" loading="lazy" decoding="async">`).join('')}</span></section>
  <section class="cp__people cp__blk" data-blk="people"><b>my people</b><span><img src="${AV.priya}" alt=""><img src="${AV.jules}" alt=""><img src="${AV.noor}" alt=""><i>+3</i></span></section>
  <section class="cp__wall cp__blk" data-blk="wall"><b>sign the wall</b>
    <p class="cp__note" style="--r:-2deg;--c:#ffe45c">ok this page is SO you<small>jules</small></p>
    <p class="cp__note cp__note--r" style="--r:2.5deg;--c:#ffb3d1">the canoe clip. you know the one.<small>noor</small></p>
  </section>
  <section class="cp__game cp__blk" data-blk="game"><b>beat my edit time</b><span>⏱ 0:42 · tap to try</span></section>
  <p class="cp__foot">made with auramy ☺</p>
</div>`;

/** Eli: a coder's page that reads like a terminal. */
export const eliPage = () => `<div class="ps ps--eli">
  <p class="el__bar"><span>eli@aura:~</span><span>● ● ●</span></p>
  <header class="el__head"><img src="/assets/img/av/eli.jpg" alt="" loading="lazy" decoding="async"><div><h3>eli<i></i></h3><p>17 · discord bots + tiny games</p></div></header>
  <p class="el__cmd">$ ls projects/</p>
  <ul class="el__list">
    <li><b>trashtalk-chess</b><span>★ 41</span><small>a chess bot that roasts you</small></li>
    <li><b>hw-reminder</b><span>★ 18</span><small>pings the gc. nobody listens</small></li>
    <li><b>pixel-garden</b><span>★ 9</span><small>water it daily or it dies</small></li>
  </ul>
  <p class="el__cmd">$ cat streak.txt</p>
  <div class="el__grid" aria-hidden="true">${Array.from({ length: 49 }, (_, i) => `<i style="--a:${[0.15, 0.35, 0.6, 0.9][(i * 7 + (i % 5) * 3) % 4]}"></i>`).join('')}</div>
  <p class="el__cmd">$ sign --guestbook <i class="el__caret"></i></p>
</div>`;
