// Real titles, abstract placeholder art. The shapes are our own designs (not the official artwork);
// in the product, covers come from the music / movie / book APIs.

const T = (x, y, size, fill, txt, extra = '') =>
  `<text x="${x}" y="${y}" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="${size}" fill="${fill}" letter-spacing="-.5" ${extra}>${txt}</text>`;

// Songs: 100×100. `art` works on its own (vinyl labels); `txt` adds the title for sleeves.
export const SONGS = {
  birds: {
    t: 'Birds of a Feather', a: 'Billie Eilish',
    art: '<rect width="100" height="100" fill="#1D3557"/><circle cx="74" cy="26" r="11" fill="#F1FAEE" opacity=".9"/><path d="M14 52q9-9 18 0q9-9 18 0M46 34q6-6 12 0q6-6 12 0M34 70q5-5 10 0q5-5 10 0" stroke="#A8DADC" stroke-width="3.6" fill="none" stroke-linecap="round"/>',
    txt: T(8, 92, 11, '#F1FAEE', 'birds of a feather'),
  },
  espresso: {
    t: 'Espresso', a: 'Sabrina Carpenter',
    art: '<rect width="100" height="100" fill="#F3D9B1"/><circle cx="46" cy="58" r="25" fill="#6B3E26"/><circle cx="46" cy="58" r="17" fill="#8C5634"/><path d="M70 50q13 0 13 9t-13 9" stroke="#6B3E26" stroke-width="6" fill="none"/><path d="M38 24q4-6 0-12M50 26q4-6 0-12" stroke="#6B3E26" stroke-width="3" fill="none" stroke-linecap="round"/>',
    txt: T(8, 94, 15, '#6B3E26', 'espresso'),
  },
  luck: {
    t: 'Good Luck, Babe!', a: 'Chappell Roan',
    art: '<rect width="100" height="100" fill="#FF6FAE"/><path d="M60 12c2 14 10 22 24 24-14 2-22 10-24 24-2-14-10-22-24-24 14-2 22-10 24-24Z" fill="#fff"/><path d="M24 44c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill="#FFE3F0"/>',
    txt: `${T(8, 80, 13, '#fff', 'good luck,')}${T(8, 94, 13, '#fff', 'babe!')}`,
  },
  apt: {
    t: 'APT.', a: 'ROSÉ & Bruno Mars',
    art: '<rect width="100" height="100" fill="#141013"/><g fill="#FF5FA2"><rect x="14" y="14" width="14" height="14" rx="2"/><rect x="43" y="14" width="14" height="14" rx="2" opacity=".35"/><rect x="72" y="14" width="14" height="14" rx="2"/><rect x="14" y="40" width="14" height="14" rx="2" opacity=".35"/><rect x="43" y="40" width="14" height="14" rx="2"/><rect x="72" y="40" width="14" height="14" rx="2" opacity=".35"/></g>',
    txt: T(8, 90, 24, '#FF5FA2', 'APT.'),
  },
  smile: {
    t: 'Die With A Smile', a: 'Lady Gaga & Bruno Mars',
    art: '<rect width="100" height="100" fill="#7A0F1F"/><circle cx="40" cy="44" r="24" fill="#F4E6D4"/><circle cx="62" cy="44" r="24" fill="none" stroke="#F4E6D4" stroke-width="3"/><path d="M30 50q10 10 20 0" stroke="#7A0F1F" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
    txt: T(8, 92, 12, '#F4E6D4', 'die with a smile'),
  },
};

// Movies & books: 100×133.
export const MOVIES = {
  spider: {
    t: 'Across the Spider-Verse', a: '2023',
    art: '<rect width="100" height="133" fill="#1B0B2E"/><g fill="#FF3D7F" opacity=".85"><circle cx="20" cy="28" r="5"/><circle cx="34" cy="20" r="3.5"/><circle cx="30" cy="38" r="3"/><circle cx="14" cy="46" r="2.5"/></g><g fill="#5CE1E6" opacity=".85"><circle cx="78" cy="66" r="5"/><circle cx="66" cy="76" r="3.5"/><circle cx="84" cy="84" r="3"/></g><path d="M-10 108 110 18" stroke="#fff" stroke-width="7" opacity=".9"/>',
    txt: `${T(8, 112, 15, '#fff', 'SPIDER-')}${T(8, 126, 15, '#FF3D7F', 'VERSE')}`,
  },
  inside: {
    t: 'Inside Out 2', a: '2024',
    art: '<rect width="100" height="133" fill="#FFD84D"/><rect x="20" width="20" height="133" fill="#5AA9F0"/><rect x="40" width="20" height="133" fill="#F25C54"/><rect x="60" width="20" height="133" fill="#7ED957"/><rect x="80" width="20" height="133" fill="#A77DF0"/><rect y="94" width="100" height="39" fill="#141013"/>',
    txt: `${T(8, 112, 14, '#fff', 'INSIDE')}${T(8, 126, 14, '#FFD84D', 'OUT 2')}`,
  },
  wicked: {
    t: 'Wicked', a: '2024',
    art: '<rect width="100" height="133" fill="#1F6B3A"/><path d="M50 14 86 96H14Z" fill="#F7A8C8"/><circle cx="50" cy="60" r="10" fill="#1F6B3A"/>',
    txt: T(10, 122, 22, '#F7A8C8', 'WICKED', 'font-family="Instrument Serif, serif" font-weight="400"'),
  },
};

export const BOOKS = {
  heart: {
    t: 'Heartstopper', a: 'Alice Oseman',
    art: '<rect width="100" height="133" fill="#BFE3F2"/><path d="M40 58s-14-9-14-18c0-5 4-8 8-8 3 0 5 2 6 4 1-2 3-4 6-4 4 0 8 3 8 8 0 9-14 18-14 18ZM66 80s-10-6-10-13c0-3 3-6 6-6 2 0 3 1 4 3 1-2 2-3 4-3 3 0 6 3 6 6 0 7-10 13-10 13Z" fill="#E94F64"/>',
    txt: `${T(12, 114, 14, '#24486B', 'Heart-')}${T(12, 127, 14, '#24486B', 'stopper')}`,
  },
  hunger: {
    t: 'The Hunger Games', a: 'Suzanne Collins',
    art: '<rect width="100" height="133" fill="#141013"/><circle cx="52" cy="56" r="24" fill="none" stroke="#D9A441" stroke-width="5"/><path d="M38 56h28M52 42v28" stroke="#D9A441" stroke-width="3"/>',
    txt: `${T(12, 110, 11, '#D9A441', 'THE HUNGER')}${T(12, 123, 11, '#D9A441', 'GAMES')}`,
  },
  crows: {
    t: 'Six of Crows', a: 'Leigh Bardugo',
    art: '<rect width="100" height="133" fill="#6E1423"/><g fill="#141013"><path d="M22 30l10 4-10 4 3-4Z"/><path d="M54 22l10 4-10 4 3-4Z"/><path d="M78 38l10 4-10 4 3-4Z"/><path d="M32 56l10 4-10 4 3-4Z"/><path d="M64 62l10 4-10 4 3-4Z"/><path d="M46 80l10 4-10 4 3-4Z"/></g>',
    txt: `${T(12, 114, 13, '#F4E6D4', 'SIX OF')}${T(12, 127, 13, '#F4E6D4', 'CROWS')}`,
  },
};

// Square song art (sleeves, music windows). `text` adds the title typography.
export const songArt = (id, text = false) =>
  `<svg class="pic" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${SONGS[id].art}${text ? SONGS[id].txt : ''}</svg>`;
// Portrait art for movie frames and book covers.
export const tallArt = (item, text = true) =>
  `<svg class="pic" viewBox="0 0 100 133" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${item.art}${text ? item.txt : ''}</svg>`;
// Vinyl record: grooves + the song's art on the centre label.
export const vinyl = (id, cls = '') =>
  `<span class="vx ${cls}"><span class="vx__label">${songArt(id)}</span></span>`;
