// The recurring cast of friends who show up across the page (notifications, leaderboard, wall, chat,
// showcase). Mia is the demo owner and keeps her Auri avatar; everyone else is a real-looking person.
export const PEOPLE = {
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
