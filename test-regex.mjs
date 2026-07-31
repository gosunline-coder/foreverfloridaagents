import fs from 'fs';
const file = fs.readFileSync('./node_modules/react-player/lib/patterns.js', 'utf8');
console.log(file);
