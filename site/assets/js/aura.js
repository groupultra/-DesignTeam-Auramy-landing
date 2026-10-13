// Personal aura generator — every name gets a deterministic aura (palette + 3 words).
// Shared by the landing page (holo card) and the brand kit.

export const AURAS = [
  { id: 'candy', name: 'candy', colors: ['#FF5FA2', '#FF8A3C', '#E8FF5A'], words: ['loud', 'sweet', 'main character'] },
  { id: 'night-swim', name: 'night swim', colors: ['#2B1B5E', '#8B6CFF', '#5CE1E6'], words: ['mysterious', 'loyal', '3am thoughts'] },
  { id: 'matcha', name: 'matcha', colors: ['#7ED9A6', '#C7F27A', '#F4F1DE'], words: ['calm', 'grounded', 'secretly funny'] },
  { id: 'peach-fuzz', name: 'peach fuzz', colors: ['#FF7A8A', '#FFB38A', '#FFE3D3'], words: ['soft', 'warm', 'gives good advice'] },
  { id: 'y2k-chrome', name: 'y2k chrome', colors: ['#8FE3FF', '#B69CFF', '#E6ECF5'], words: ['shiny', 'extremely online', 'ahead of time'] },
  { id: 'cherry-cola', name: 'cherry cola', colors: ['#5A0F1C', '#FF3D5A', '#FFB5A7'], words: ['bold', 'dramatic', 'never boring'] },
  { id: 'dreamcore', name: 'dreamcore', colors: ['#F7C6FF', '#B5D8FF', '#FFF3B0'], words: ['floaty', 'nostalgic', 'daydreamer'] },
  { id: 'sunburn', name: 'sunburn', colors: ['#FF4E2B', '#FF9A3C', '#FFE14D'], words: ['chaotic', 'brave', 'zero chill'] },
  { id: 'moss', name: 'moss', colors: ['#2F4A2B', '#9BBF4B', '#E8FF5A'], words: ['earthy', 'curious', 'side quests'] },
  { id: 'blue-hour', name: 'blue hour', colors: ['#2D4BFF', '#8FA8FF', '#FFC7A6'], words: ['thoughtful', 'romantic', 'window seat'] },
  { id: 'bubble-tea', name: 'bubble tea', colors: ['#C98F5E', '#FFE9D2', '#FF9EC4'], words: ['cozy', 'social', 'always snacking'] },
  { id: 'static', name: 'static', colors: ['#1F1F1F', '#6E6E6E', '#D4FF3A'], words: ['cool', 'quiet', 'unexpected'] },
];

export function hash(str) {
  let h = 2166136261;
  for (const ch of str.toLowerCase().trim()) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function auraFor(name) {
  const clean = (name || '').trim();
  if (!clean) return { ...AURAS[0], angle: 135, handle: 'you', ink: '#141013', gradient: gradientOf(AURAS[0].colors, 135) };
  const h = hash(clean);
  const a = AURAS[h % AURAS.length];
  const angle = 100 + (h >> 5) % 80;
  const avg = a.colors.reduce((s, c) => s + luminance(c), 0) / a.colors.length;
  return {
    ...a,
    angle,
    handle: slug(clean) || 'you',
    ink: avg > 0.32 ? '#141013' : '#FFF8EE',
    gradient: gradientOf(a.colors, angle),
  };
}

export function gradientOf(colors, angle = 135) {
  return `linear-gradient(${angle}deg, ${colors[0]} 0%, ${colors[1]} 55%, ${colors[2]} 100%)`;
}

export function slug(s) {
  return s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9._]+/g, '').slice(0, 20);
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Minimal damped spring integrator used by draggable things.
export function spring(k = 170, c = 18) {
  return (x, v, target, dt) => {
    const a = -k * (x - target) - c * v;
    v += a * dt;
    x += v * dt;
    return [x, v];
  };
}
