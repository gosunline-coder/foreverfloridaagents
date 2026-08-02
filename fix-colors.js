const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function processFiles() {
  const dirs = ['src/app/(agent)', 'src/app/(admin)'];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    walkDir(dir, (filePath) => {
      if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Backgrounds
        content = content.replace(/bg-slate-50/g, 'bg-white/5');
        content = content.replace(/bg-slate-100/g, 'bg-white/10');
        content = content.replace(/bg-blue-50/g, 'bg-brand-blue/10');
        content = content.replace(/bg-emerald-50/g, 'bg-brand-green/10');
        content = content.replace(/bg-amber-50/g, 'bg-amber-500/10');
        content = content.replace(/bg-purple-100/g, 'bg-purple-500/10');
        content = content.replace(/bg-orange-100/g, 'bg-orange-500/10');
        content = content.replace(/bg-blue-100/g, 'bg-brand-blue/20');
        content = content.replace(/bg-gray-50/g, 'bg-white/5');
        
        // Borders
        content = content.replace(/border-slate-200/g, 'border-white/10');
        content = content.replace(/border-slate-300/g, 'border-white/20');
        content = content.replace(/border-blue-200/g, 'border-brand-blue/30');
        content = content.replace(/border-emerald-200/g, 'border-brand-green/30');
        content = content.replace(/border-amber-200/g, 'border-amber-500/30');

        // Texts
        content = content.replace(/text-slate-500/g, 'text-slate-400');
        content = content.replace(/text-slate-600/g, 'text-slate-300');
        content = content.replace(/text-slate-700/g, 'text-slate-200');
        content = content.replace(/text-slate-800/g, 'text-white');
        
        content = content.replace(/text-blue-900/g, 'text-brand-blue');
        content = content.replace(/text-blue-700/g, 'text-brand-blue');
        content = content.replace(/text-emerald-700/g, 'text-brand-green');
        content = content.replace(/text-amber-700/g, 'text-amber-400');
        content = content.replace(/text-purple-600/g, 'text-purple-400');
        content = content.replace(/text-orange-600/g, 'text-orange-400');
        
        fs.writeFileSync(filePath, content, 'utf8');
      }
    });
  });
  console.log("Done fixing backgrounds and borders.");
}

processFiles();
