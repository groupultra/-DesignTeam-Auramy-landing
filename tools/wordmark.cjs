const opentype = require('opentype.js');
const font = opentype.loadSync(require('path').join(__dirname,'unbounded800.ttf'));
const size = 100, tracking = -0.045 * size; // tight tracking
let x = 0; const paths = [];
const glyphs = font.stringToGlyphs(process.argv[2] || 'auramy');
glyphs.forEach((g, i) => {
  const p = g.getPath(x, 0, size);
  paths.push(p.toPathData(2));
  let adv = g.advanceWidth * size / font.unitsPerEm;
  if (i < glyphs.length - 1) adv += font.getKerningValue(g, glyphs[i+1]) * size / font.unitsPerEm;
  x += adv + tracking;
});
// compute bbox
const all = new opentype.Path(); let xx=0;
glyphs.forEach((g,i)=>{ const p=g.getPath(xx,0,size); all.extend(p); let adv=g.advanceWidth*size/font.unitsPerEm; if(i<glyphs.length-1) adv+=font.getKerningValue(g,glyphs[i+1])*size/font.unitsPerEm; xx+=adv+tracking;});
const bb = all.getBoundingBox();
console.log(JSON.stringify({d: paths.join(' '), bb, asc: font.ascender*size/font.unitsPerEm, desc: font.descender*size/font.unitsPerEm, xh: font.tables.os2.sxHeight*size/font.unitsPerEm}));
