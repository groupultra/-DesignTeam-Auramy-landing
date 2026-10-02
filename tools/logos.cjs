const fs=require('fs');
const path=require('path');
const SITE=path.join(__dirname,'..','site')+'/';
const W=JSON.parse(fs.readFileSync(path.join(__dirname,'wordmark.json')));
const out=SITE+'assets/logo/';
const INK='#141013', PAPER='#FFF8EE';
const BLOB='M60 12C88 12 104 34 107 62C110 88 100 106 60 106C20 106 10 88 13 62C16 34 32 12 60 12Z';
const grad=(id)=>`<linearGradient id="${id}" x1="0.18" y1="0.02" x2="0.82" y2="1"><stop offset="0" stop-color="#FF5FA2"/><stop offset=".52" stop-color="#FF8A3C"/><stop offset="1" stop-color="#E8FF5A"/></linearGradient>`;
const face=(eye, hl=true)=>`<ellipse cx="47" cy="64" rx="5.4" ry="8.6" fill="${eye}"/><ellipse cx="73" cy="64" rx="5.4" ry="8.6" fill="${eye}"/>${hl?`<ellipse cx="38" cy="33" rx="8.5" ry="4.6" transform="rotate(-35 38 33)" fill="#fff" fill-opacity=".72"/>`:''}`;
// mark variants
const mark=(v)=>{
  if(v==='color') return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs>${grad('a')}</defs><path d="${BLOB}" fill="url(#a)"/>${face(INK)}</svg>`;
  if(v==='ink') return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><path d="${BLOB}" fill="${INK}"/>${face(PAPER,false)}</svg>`;
  if(v==='paper') return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><path d="${BLOB}" fill="${PAPER}"/>${face(INK,false)}</svg>`;
};
fs.writeFileSync(out+'auramy-mark.svg',mark('color'));
fs.writeFileSync(out+'auramy-mark-ink.svg',mark('ink'));
fs.writeFileSync(out+'auramy-mark-paper.svg',mark('paper'));
// wordmark: bbox x 3..422, y -78.7..18.2
const W2=Math.ceil(W.bb.x2)+4;
const wy=Math.floor(W.bb.y1)-5, wh=Math.ceil(W.bb.y2)+4-wy;
const wmVB=`0 ${wy} ${W2} ${wh}`;
fs.writeFileSync(out+'auramy-wordmark-ink.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${wmVB}"><path d="${W.d}" fill="${INK}"/></svg>`);
fs.writeFileSync(out+'auramy-wordmark-paper.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${wmVB}"><path d="${W.d}" fill="${PAPER}"/></svg>`);
// horizontal lockup: mark height 104 aligned to wordmark box, gap 22
const lock=(txt, eye, markFill, gid)=>{
  const markG = markFill==='grad' ? `<defs>${grad(gid)}</defs><g transform="translate(0 -84) scale(0.9)"><path d="${BLOB}" fill="url(#${gid})"/>${face(eye)}</g>` : `<g transform="translate(0 -84) scale(0.9)"><path d="${BLOB}" fill="${markFill}"/>${face(eye,false)}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 -80 ${120+W2-4} 100">${markG}<g transform="translate(120 0)"><path d="${W.d}" fill="${txt}"/></g></svg>`;
};
fs.writeFileSync(out+'auramy-lockup.svg',lock(INK,INK,'grad','g1'));
fs.writeFileSync(out+'auramy-lockup-reverse.svg',lock(PAPER,INK,'grad','g2'));
fs.writeFileSync(out+'auramy-lockup-ink.svg',lock(INK,PAPER,INK));
fs.writeFileSync(out+'auramy-lockup-paper.svg',lock(PAPER,INK,PAPER));
// app icon 1024
const icon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><defs>${grad('ga')}<radialGradient id="g1" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF5FA2" stop-opacity=".95"/><stop offset=".6" stop-color="#FF5FA2" stop-opacity=".35"/><stop offset="1" stop-color="#FF5FA2" stop-opacity="0"/></radialGradient><radialGradient id="g2" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#E8FF5A" stop-opacity=".8"/><stop offset="1" stop-color="#E8FF5A" stop-opacity="0"/></radialGradient><radialGradient id="g3" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8B6CFF" stop-opacity=".9"/><stop offset="1" stop-color="#8B6CFF" stop-opacity="0"/></radialGradient></defs><rect width="1024" height="1024" fill="${INK}"/><circle cx="330" cy="330" r="420" fill="url(#g3)"/><circle cx="700" cy="760" r="380" fill="url(#g2)"/><circle cx="512" cy="540" r="470" fill="url(#g1)"/><g transform="translate(128 118) scale(6.4)"><path d="${BLOB}" fill="url(#ga)"/>${face(INK)}</g></svg>`;
fs.writeFileSync(out+'auramy-app-icon.svg',icon);
// favicon (simple, rounded bg)
fs.writeFileSync(SITE+'favicon.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs>${grad('f')}</defs><path d="${BLOB}" fill="url(#f)"/>${face(INK,false)}</svg>`);
fs.writeFileSync(SITE+'assets/js/wordmark-path.js',`export const WORDMARK_D=${JSON.stringify(W.d)};\nexport const BLOB_D=${JSON.stringify(BLOB)};\n`);
console.log('ok');
