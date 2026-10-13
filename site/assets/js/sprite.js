// Shared glyphs and brand illustrations, injected once as an SVG sprite.
// The editorial landing page uses locally hosted photography for its demo spaces.

const INK = '#141013';

const symbols = {
  'ph-cat': `
    <rect width="100" height="100" fill="#FFD7B5"/>
    <rect x="0" y="0" width="100" height="36" fill="#FFE7CF"/>
    <rect x="62" y="6" width="30" height="24" rx="3" fill="#BFE7F0"/><path d="M77 6v24M62 18h30" stroke="#FFE7CF" stroke-width="2"/>
    <ellipse cx="50" cy="86" rx="32" ry="20" fill="#E98B3F"/>
    <path d="M30 44 27 22 44 34Z M70 44 73 22 56 34Z" fill="#F4A259"/>
    <path d="M32 40 30 27 40 35Z M68 40 70 27 60 35Z" fill="#FF9EB5"/>
    <circle cx="50" cy="52" r="23" fill="#F4A259"/>
    <path d="M44 31q6 5 12 0M41 36q9 6 18 0" stroke="#D97A2E" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="41.5" cy="52" rx="2.8" ry="4.4" fill="${INK}"/><ellipse cx="58.5" cy="52" rx="2.8" ry="4.4" fill="${INK}"/>
    <path d="M47.5 59h5l-2.5 3Z" fill="#FF7A9C"/>
    <path d="M50 62q-3 4-6 2M50 62q3 4 6 2" stroke="${INK}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M30 58 16 55M30 62 16 64M70 58l14-3M70 62l14 2" stroke="${INK}" stroke-opacity=".45" stroke-width="1"/>`,
  'ph-sea': `
    <defs><linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7F7F"/><stop offset=".7" stop-color="#FFC08A"/><stop offset="1" stop-color="#FFE1A8"/></linearGradient></defs>
    <rect width="100" height="100" fill="url(#sky1)"/>
    <circle cx="50" cy="60" r="17" fill="#FFF3D1"/>
    <rect y="60" width="100" height="40" fill="#3F5BD9"/>
    <path d="M36 66h28M40 72h20M44 78h12M47 84h6" stroke="#FFE7B0" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M6 70h14M78 76h16M10 88h20M70 92h22" stroke="#7F95F0" stroke-width="2" stroke-linecap="round"/>
    <path d="M12 24q4-3 8 0 4-3 8 0M70 18q3-2 6 0 3-2 6 0" stroke="#fff" stroke-opacity=".8" stroke-width="1.6" fill="none"/>`,
  'ph-city': `
    <rect width="100" height="100" fill="#1B1740"/>
    <circle cx="76" cy="20" r="9" fill="#FFF1C9"/><circle cx="80" cy="17" r="8" fill="#1B1740"/>
    <circle cx="18" cy="14" r="1" fill="#fff"/><circle cx="40" cy="8" r="1" fill="#fff"/><circle cx="58" cy="22" r=".8" fill="#fff"/>
    <rect x="4" y="46" width="20" height="54" fill="#2E2A66"/><rect x="26" y="30" width="18" height="70" fill="#3B3680"/>
    <rect x="46" y="52" width="22" height="48" fill="#2E2A66"/><rect x="70" y="38" width="26" height="62" fill="#3B3680"/>
    <g fill="#FFD66B"><rect x="8" y="52" width="4" height="4"/><rect x="16" y="64" width="4" height="4"/><rect x="30" y="38" width="4" height="4"/><rect x="36" y="50" width="4" height="4"/><rect x="30" y="70" width="4" height="4"/><rect x="50" y="60" width="4" height="4"/><rect x="58" y="74" width="4" height="4"/><rect x="74" y="46" width="4" height="4"/><rect x="86" y="58" width="4" height="4"/><rect x="80" y="76" width="4" height="4"/></g>
    <g fill="#FF5FA2" opacity=".9"><rect x="16" y="82" width="4" height="4"/><rect x="62" y="88" width="4" height="4"/></g>`,
  'ph-gig': `
    <rect width="100" height="100" fill="#240C36"/>
    <path d="M20 0 4 70h26Z" fill="#FF5FA2" opacity=".5"/><path d="M80 0 70 70h26Z" fill="#5CE1E6" opacity=".45"/>
    <path d="M50 0 34 70h32Z" fill="#E8FF5A" opacity=".35"/>
    <rect y="68" width="100" height="4" fill="#8B6CFF"/>
    <g fill="${INK}"><circle cx="10" cy="84" r="8"/><circle cx="26" cy="88" r="9"/><circle cx="44" cy="84" r="8"/><circle cx="60" cy="89" r="9"/><circle cx="78" cy="85" r="8"/><circle cx="94" cy="89" r="8"/><rect y="88" width="100" height="12"/></g>
    <path d="M43 76l3-10M61 78l-2-11" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
  'ph-flowers': `
    <rect width="100" height="100" fill="#CDEBC0"/>
    <path d="M28 100V56M52 100V44M76 100V60" stroke="#3F7D3A" stroke-width="3"/>
    <path d="M52 76q10-8 18-4-8 10-18 4ZM28 80q-10-8-16-3 7 9 16 3Z" fill="#5C9E4F"/>
    <g fill="#FF7AB6"><circle cx="28" cy="48" r="7"/><circle cx="20" cy="56" r="7"/><circle cx="36" cy="56" r="7"/><circle cx="24" cy="64" r="7"/><circle cx="32" cy="64" r="7"/></g>
    <g fill="#FF8A3C"><circle cx="52" cy="34" r="8"/><circle cx="43" cy="43" r="8"/><circle cx="61" cy="43" r="8"/><circle cx="47" cy="53" r="8"/><circle cx="57" cy="53" r="8"/></g>
    <g fill="#8B6CFF"><circle cx="76" cy="52" r="6"/><circle cx="69" cy="59" r="6"/><circle cx="83" cy="59" r="6"/><circle cx="72" cy="66" r="6"/><circle cx="80" cy="66" r="6"/></g>
    <circle cx="28" cy="57" r="4.5" fill="#FFE14D"/><circle cx="52" cy="44" r="5" fill="#FFE14D"/><circle cx="76" cy="60" r="4" fill="#FFE14D"/>`,
  'ph-bff': `
    <defs><linearGradient id="bff1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B5D8FF"/><stop offset="1" stop-color="#F7C6FF"/></linearGradient></defs>
    <rect width="100" height="100" fill="url(#bff1)"/>
    <path d="M10 100C10 70 22 52 36 52s26 18 26 48Z" fill="#FF8A3C"/>
    <path d="M44 100c0-34 12-54 28-54s24 20 24 54Z" fill="#8B6CFF"/>
    <ellipse cx="30" cy="72" rx="2.6" ry="4" fill="${INK}"/><ellipse cx="42" cy="72" rx="2.6" ry="4" fill="${INK}"/>
    <ellipse cx="66" cy="68" rx="2.6" ry="4" fill="${INK}"/><ellipse cx="78" cy="68" rx="2.6" ry="4" fill="${INK}"/>
    <path d="M58 44l-3-12M64 43l2-12" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <circle cx="24" cy="80" r="4" fill="#FF5FA2" opacity=".5"/><circle cx="84" cy="76" r="4" fill="#FF5FA2" opacity=".5"/>`,
  'ph-bus': `
    <rect width="100" height="100" fill="#131A3A"/>
    <rect x="8" y="14" width="84" height="56" rx="8" fill="#223066"/>
    <rect x="14" y="20" width="34" height="30" rx="4" fill="#FFB86B"/><rect x="52" y="20" width="34" height="30" rx="4" fill="#FF8A6B"/>
    <circle cx="30" cy="40" r="6" fill="#131A3A"/><path d="M22 50c0-6 4-9 8-9s8 3 8 9Z" fill="#131A3A"/>
    <rect x="8" y="58" width="84" height="6" fill="#FF5FA2"/>
    <circle cx="28" cy="74" r="7" fill="#0B0F24"/><circle cx="72" cy="74" r="7" fill="#0B0F24"/>
    <path d="M0 88h100" stroke="#FFD66B" stroke-width="2" stroke-dasharray="10 8"/>`,
  'star': `<path d="M50 4l12.9 29.2 31.8 3.2-23.8 21.3 6.8 31.2L50 73 22.3 88.9l6.8-31.2L5.3 36.4l31.8-3.2Z"/>`,
  'heart': `<path d="M50 88S10 62 10 34c0-13 10-22 21-22 9 0 15 5 19 12 4-7 10-12 19-12 11 0 21 9 21 22 0 28-40 54-40 54Z"/>`,
  'spark': `<path d="M50 0c3 27 23 47 50 50-27 3-47 23-50 50-3-27-23-47-50-50C27 47 47 27 50 0Z"/>`,
};

export function injectSprite() {
  if (document.getElementById('auramy-sprite')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'auramy-sprite';
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML = Object.entries(symbols)
    .map(([id, body]) => `<symbol id="${id}" viewBox="0 0 100 100">${body}</symbol>`)
    .join('');
  document.body.prepend(svg);
}

const EDITORIAL_PHOTOS = {
  'ph-cat': '/assets/img/editorial/raw-selfie.jpg',
  'ph-sea': '/assets/img/people/eli.jpg',
  'ph-gig': '/assets/img/editorial/raw-friends.jpg',
  'ph-city': '/assets/img/people/noah.jpg',
  'ph-flowers': '/assets/img/people/ava.jpg',
  'ph-bff': '/assets/img/editorial/raw-friends.jpg',
  'ph-bus': '/assets/img/people/jay.jpg',
};
const editorialPage = () => document.body.classList.contains('editorial-page');

export function pic(id, cls = '') {
  const source = editorialPage() && EDITORIAL_PHOTOS[id];
  // Keep the SVG wrapper: phone scenes rely on its viewBox sizing and cover crop.
  const content = source
    ? `<image href="${source}" width="100" height="100" preserveAspectRatio="xMidYMid slice"/>`
    : `<use href="#${id}"/>`;
  return `<svg class="pic ${cls}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${content}</svg>`;
}

export const BLOB = 'M60 12C88 12 104 34 107 62C110 88 100 106 60 106C20 106 10 88 13 62C16 34 32 12 60 12Z';

// Auri / blob avatar in any gradient. Gradient ids get a per-render suffix: the same avatar is often
// rendered twice (e.g. a hidden mobile copy), and url(#id) resolving into a display:none subtree paints nothing.
let blobSeq = 0;
export function blobAvatar(colors, { eyes = '#141013', id = 'b', mood = 'idle' } = {}) {
  id = `${id}-${++blobSeq}`;
  const [c1, c2, c3] = colors;
  if (editorialPage()) {
    // Preserve the SVG API used by the selfie, story, desktop and game controls.
    return `<svg class="blob-avatar portrait-avatar" viewBox="0 0 120 120" aria-hidden="true"><defs><clipPath id="${id}-portrait"><circle cx="60" cy="60" r="54"/></clipPath></defs><image href="/assets/img/editorial/raw-selfie.jpg" x="6" y="6" width="108" height="108" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id}-portrait)"/><circle cx="60" cy="60" r="55" fill="none" stroke="${mood === 'idle' ? '#F7F6F0' : c1}" stroke-width="4"/></svg>`;
  }
  const face = {
    idle: `<g class="eyes"><g class="eyes__b" style="animation-delay:${-(blobSeq % 7) * 0.9}s"><ellipse cx="47" cy="64" rx="5.4" ry="8.6" fill="${eyes}"/><ellipse cx="73" cy="64" rx="5.4" ry="8.6" fill="${eyes}"/></g></g>`,
    happy: `<path d="M41 66q6-8 12 0M67 66q6-8 12 0" stroke="${eyes}" stroke-width="4.4" fill="none" stroke-linecap="round"/>`,
    wow: `<circle cx="47" cy="62" r="7" fill="${eyes}"/><circle cx="73" cy="62" r="7" fill="${eyes}"/><circle cx="49" cy="59" r="2.2" fill="#fff"/><circle cx="75" cy="59" r="2.2" fill="#fff"/><ellipse cx="60" cy="80" rx="4" ry="5" fill="${eyes}"/>`,
    love: `<path d="M47 72s-9-6-9-11c0-3 2-5 4.5-5 2 0 3.5 1.2 4.5 3 1-1.8 2.5-3 4.5-3 2.5 0 4.5 2 4.5 5 0 5-9 11-9 11ZM73 72s-9-6-9-11c0-3 2-5 4.5-5 2 0 3.5 1.2 4.5 3 1-1.8 2.5-3 4.5-3 2.5 0 4.5 2 4.5 5 0 5-9 11-9 11Z" fill="${eyes}"/>`,
    sleepy: `<path d="M40 66h13M67 66h13" stroke="${eyes}" stroke-width="4.4" stroke-linecap="round"/>`,
    squish: `<path d="M40 60l10 5-10 5M80 60l-10 5 10 5" stroke="${eyes}" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    wink: `<ellipse cx="47" cy="64" rx="5.4" ry="8.6" fill="${eyes}"/><path d="M66 66q7-7 14 0" stroke="${eyes}" stroke-width="4.4" fill="none" stroke-linecap="round"/>`,
  }[mood];
  return `<svg class="blob-avatar" viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="${id}" x1=".18" y1=".02" x2=".82" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset=".52" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient></defs><path d="${BLOB}" fill="url(#${id})"/>${face}<ellipse cx="38" cy="33" rx="8.5" ry="4.6" transform="rotate(-35 38 33)" fill="#fff" fill-opacity=".7"/></svg>`;
}
