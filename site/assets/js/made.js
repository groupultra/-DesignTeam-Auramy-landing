// "Made by actual humans": a row of real-looking spaces (one per world) + a live activity pill.
import { PEOPLE, avatar, photoSrc } from './people.js';
import { vinyl } from './covers.js';

const img = (who, cls = '', pos = '50% 40%') =>
  `<img class="${cls}" src="${photoSrc(who)}" alt="" loading="lazy" decoding="async" style="object-position:${pos}">`;
const star = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4l12.9 29.2 31.8 3.2-23.8 21.3 6.8 31.2L50 73 22.3 88.9l6.8-31.2L5.3 36.4l31.8-3.2Z"/></svg>';

const SPACES = [
  {
    who: 'noah', world: 'arcade', likes: '2.1k', quote: 'people come to beat my score and stay for the skate clips.',
    shot: `<div class="shot shot--game">${img('noah', 'shot__bg', '35% 30%')}<div class="shot__shade"></div>
      <p class="g-hud"><span>NOAH'S PARK</span><span>HI 412</span></p>
      <div class="g-board"><p>TOP SKATERS</p><ol>
        <li>${avatar('jay')}jay<b>398</b></li><li>${avatar('eli')}eli<b>377</b></li><li><i>?</i>you<b>—</b></li></ol></div>
      <span class="g-play">▶ beat my score</span></div>`,
  },
  {
    who: 'lu', world: 'scrapbook', likes: '3.4k', quote: 'my friends leave notes every morning. it’s basically our group chat now.',
    shot: `<div class="shot shot--scrap"><p class="s-title">lu’s corner <span>✧</span></p>
      <figure class="s-pol"><i class="tape"></i>${img('lu', '', '50% 30%')}<figcaption>junior year, day one</figcaption></figure>
      <p class="s-note">come say hi!! ♡<span>— lu</span></p>
      <p class="s-note s-note--2">ur hair is so pretty<span>— ava</span></p>
      <span class="s-star">${star}</span><span class="s-likes">♥<b>3.4k</b></span></div>`,
  },
  {
    who: 'jay', world: 'vinyl room', likes: '1.8k', quote: 'i change the record every friday. like 40 people check what’s spinning.',
    shot: `<div class="shot shot--vinyl"><p class="v-kick">jay’s room · now spinning</p><p class="v-name">jay</p>
      <div class="v-sleeve">${vinyl('apt', 'v-disc is-spin')}<span class="v-cover">${img('jay', '', '30% 25%')}</span></div>
      <p class="v-track"><b>APT.</b><span>ROSÉ & Bruno Mars</span></p><p class="v-req">✦ 12 song requests</p></div>`,
  },
  {
    who: 'ava', world: 'story mode', likes: '4.0k', quote: 'made it in the lunch line. 200 votes on my ice cream poll by 5pm.',
    shot: `<div class="shot shot--story">${img('ava', 'shot__bg', '50% 35%')}<div class="shot__shade shot__shade--top"></div>
      <div class="t-bars"><i style="--p:1"></i><i style="--p:.55"></i><i></i></div>
      <div class="t-head">${avatar('ava')}<b>ava</b><span>1h</span></div>
      <div class="t-poll"><p>best flavor?</p><span style="--w:71%"><i></i>cookies &amp; cream<b>71%</b></span><span style="--w:29%"><i></i>mint chip<b>29%</b></span></div></div>`,
  },
  {
    who: 'zara', world: 'little desktop', likes: '1.2k', quote: 'it’s my reading list but cute. people ask what i’m reading next.',
    shot: `<div class="shot shot--desk"><div class="d-bar"><b>◖ zara’s desktop</b><span>9:41</span></div>
      <div class="d-win d-win--photo"><div class="d-winbar"><i></i><i></i><i></i>library.jpg</div>${img('zara', '', '50% 30%')}</div>
      <div class="d-win d-win--txt"><div class="d-winbar"><i></i><i></i><i></i>reading.txt</div><p>six of crows (again)<br>the secret history<br>next: ??? <u>tell me</u></p></div>
      <div class="d-dock"><i></i><i></i><i></i><i></i></div></div>`,
  },
  {
    who: 'eli', world: 'night', likes: '3.2k', quote: 'shared it once in the group chat. 3k visits later, here we are.',
    shot: `<div class="shot shot--night"><div class="n-glow"></div>${img('eli', 'n-photo', '40% 30%')}
      <p class="n-name">eli</p><p class="n-meta">3,210 visitors · 212 notes</p>
      <p class="n-note">that bonfire night &gt;&gt;&gt;<span>— zara</span></p></div>`,
  },
];

export function renderMade(row) {
  row.innerHTML = SPACES.map((s) => {
    const p = PEOPLE[s.who];
    return `<article class="made-card">
      <div class="made-card__shot">${s.shot}<span class="made-card__world">${s.world}</span></div>
      <div class="made-card__who">${avatar(s.who)}<div><b>${p.name}, ${p.age}</b><span>aura.my/${p.name} · ${p.city}</span></div><span class="made-card__stat">♥ ${s.likes}</span></div>
      <p class="made-card__quote">“${s.quote}”</p>
    </article>`;
  }).join('');
}

export const LIVE = [
  ['noah', 'noah just beat jay’s high score', '1m'],
  ['zara', 'zara signed eli’s wall', '2m'],
  ['ava', 'ava’s poll hit 200 votes', '4m'],
  ['lu', 'lu made a scrapbook space', 'now'],
  ['jay', 'jay swapped the record to APT.', '6m'],
  ['eli', 'eli’s space passed 3,000 visitors', '9m'],
];
