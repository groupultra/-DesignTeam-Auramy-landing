// Hand-drawn marks in the spirit of the logo: wobbly ballpoint lines, a crayon smiley,
// a few early-web sparkles. Stroke colour follows `currentColor`, so CSS decides the ink.
const SYMBOLS = {
  underline: ['0 0 220 26', '<path d="M3 15c24-7 49-9 76-5 30 4 52 7 80 2 20-4 40-7 58-4"/><path d="M14 21c40-5 88-2 122 1s52-1 78-6" opacity=".55"/>'],
  circle: ['0 0 240 100', '<path d="M40 22C82 6 162 4 210 24c30 13 30 46-6 60-48 17-128 16-170 2C6 76 0 52 22 36c26-18 86-26 150-22"/>'],
  arrow: ['0 0 130 90', '<path d="M8 80C26 52 52 26 112 20"/><path d="M92 6l22 14-18 18"/>'],
  arrowDown: ['0 0 60 110', '<path d="M30 6c-8 26 10 46 2 74"/><path d="M14 66l18 22 16-24"/>'],
  star: ['0 0 40 40', '<path fill="currentColor" stroke="none" d="M20 3c1.4 10.6 5.6 15.4 16.6 17-11 1.6-15.2 6.2-16.6 17-1.4-10.8-5.6-15.4-16.6-17C14.4 18.4 18.6 13.6 20 3Z"/>'],
  heart: ['0 0 40 40', '<path fill="currentColor" stroke="none" d="M20 35C5 25 2 13 10 8c5-3 9 0 10 5 2-6 7-8 11-5 8 5 4 17-11 27Z"/>'],
  bolt: ['0 0 40 40', '<path fill="currentColor" stroke="none" d="M23 2 8 22h10l-6 16 20-24H21l5-12Z"/>'],
  scribble: ['0 0 80 30', '<path d="M3 20C10 3 15 30 24 13s13-12 18 4 13 14 18-6 10-12 17 2"/>'],
  cloud: ['0 0 90 50', '<path fill="#fff" d="M16 44C4 44 3 29 15 28c0-13 18-18 26-7 5-11 25-10 25 4 13-1 16 18 2 19Z"/>'],
  smile: ['0 0 64 64', '<path fill="#f6ec22" stroke="none" d="M32 4c17-1 29 12 28 29-1 17-13 28-29 27C15 59 4 47 5 31 6 15 17 5 32 4Z"/><path fill="none" stroke="#161a2e" stroke-width="4" d="M23 22l-1 8M40 20l1 8M17 37c8 10 24 10 31-2"/>'],
  sparkle: ['0 0 40 40', '<path d="M20 4v10M20 26v10M4 20h10M26 20h10M9 9l6 6M25 25l6 6M31 9l-6 6M15 25l-6 6"/>'],
};

export function injectDoodles() {
  if (document.getElementById('doodle-sprite')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'doodle-sprite';
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  // Lines that wrap around text stretch to fit; marks keep their proportions.
  const stretch = new Set(['underline', 'circle', 'scribble']);
  svg.innerHTML = Object.entries(SYMBOLS).map(([name, [box, body]]) => `<symbol id="d-${name}" viewBox="${box}"${stretch.has(name) ? ' preserveAspectRatio="none"' : ''}>${body}</symbol>`).join('');
  document.body.prepend(svg);
}

/** An inline doodle. Decorative by default. */
export const doodle = (name, cls = '') => `<svg class="doodle doodle--${name} ${cls}" aria-hidden="true" focusable="false"><use href="#d-${name}"/></svg>`;
