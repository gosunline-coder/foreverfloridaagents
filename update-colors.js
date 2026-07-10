const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
          }
          next();
        }
      });
    })();
  });
};

walk('src', (err, results) => {
  if (err) throw err;
  
  results.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Blues to brand-blue
    content = content.replace(/text-blue-600/g, 'text-brand-blue');
    content = content.replace(/bg-blue-600/g, 'bg-brand-blue');
    content = content.replace(/border-blue-600/g, 'border-brand-blue');
    
    // Emeralds to brand-green
    content = content.replace(/text-emerald-[456]00/g, 'text-brand-green');
    content = content.replace(/bg-emerald-[456]00/g, 'bg-brand-green');
    content = content.replace(/border-emerald-[456]00/g, 'border-brand-green');
    
    // Oranges to brand-blue (secondary action buttons)
    content = content.replace(/bg-orange-[56]00/g, 'bg-brand-blue');
    
    // Fix gradients
    content = content.replace(/from-blue-900 to-indigo-800/g, 'from-brand-blue to-blue-900');
    content = content.replace(/from-emerald-800 to-teal-900/g, 'from-brand-green to-emerald-900');
    
    fs.writeFileSync(file, content, 'utf8');
  });
  console.log("Colors updated!");
});
