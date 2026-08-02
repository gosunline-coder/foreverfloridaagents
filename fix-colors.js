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
        
        // Replace text-gray-900 and text-slate-900 with text-white
        content = content.replace(/text-gray-900/g, 'text-white');
        content = content.replace(/text-slate-900/g, 'text-white');
        
        // For bg-white, we want to replace it with bg-white/5 EXCEPT in certain cases where it might already be bg-white/5
        // A simple way is to replace 'bg-white ' with 'bg-white/5 ' and 'bg-white"' with 'bg-white/5"'
        content = content.replace(/bg-white(?=[\s"])/g, 'bg-white/5');
        
        fs.writeFileSync(filePath, content, 'utf8');
      }
    });
  });
  console.log("Done fixing colors.");
}

processFiles();
