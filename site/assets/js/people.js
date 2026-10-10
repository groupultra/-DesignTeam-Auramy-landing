// The recurring cast who show up across the page (notifications, leaderboard, wall, chat):
// the seven Auramy personas, with avatars cropped from their persona photos.
export const PEOPLE = {
  camila: { name: 'camila', age: 18, city: 'boston' },
  maddie: { name: 'maddie', age: 16, city: 'columbus' },
  marcus: { name: 'marcus', age: 17, city: 'georgia' },
  jayden: { name: 'jayden', age: 15, city: 'atlanta' },
  river: { name: 'river', age: 15, city: 'kansas' },
  theo: { name: 'theo', age: 18, city: 'austin' },
  aaliyah: { name: 'aaliyah', age: 17, city: 'newark' },
  // Earlier demo cast, still used inside the older interactive spaces.
  noah: { name: 'noah', age: 17, city: 'brooklyn' },
  lu: { name: 'lu', age: 16, city: 'vancouver' },
  jay: { name: 'jay', age: 18, city: 'chicago' },
  ava: { name: 'ava', age: 16, city: 'austin' },
  zara: { name: 'zara', age: 17, city: 'boston' },
  eli: { name: 'eli', age: 19, city: 'portland' },
};

export const avatarSrc = (who) => `/assets/img/av/${who}.jpg`;
export const photoSrc = (who) => `/assets/img/people/${who}.jpg`;
export const avatar = (who, cls = '') =>
  PEOPLE[who] ? `<img class="av ${cls}" src="${avatarSrc(who)}" alt="" width="80" height="80" decoding="async">` : '';
