const fs = require('fs');
const buf = fs.readFileSync('public/crane.stl');
const n = buf.readUInt32LE(80);
const out = [];
for (let i = 0; i < n; i++) {
  const o = 84 + i * 50;
  const cx = ((buf.readFloatLE(o+12)+buf.readFloatLE(o+24)+buf.readFloatLE(o+36))/3);
  const cy = ((buf.readFloatLE(o+16)+buf.readFloatLE(o+28)+buf.readFloatLE(o+40))/3);
  const cz = ((buf.readFloatLE(o+20)+buf.readFloatLE(o+32)+buf.readFloatLE(o+44))/3);
  out.push({ i, cx, cy, cz });
}
out.sort((a,b) => a.cy - b.cy);
let result = 'tris=' + n + '\n';
out.forEach(c => {
  result += `tri${c.i} cx=${c.cx.toFixed(2)} cy=${c.cy.toFixed(2)} cz=${c.cz.toFixed(2)}\n`;
});
fs.writeFileSync('stl_analysis.txt', result);
console.log('done');
