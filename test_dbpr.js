const https = require('https');

async function search() {
  const data = "board=&LicenseType=&hSearchType=LicNbr&LicNbr=SL3350267&Search=Search";
  
  const options = {
    hostname: 'www.myfloridalicense.com',
    port: 443,
    path: '/wl11.asp?mode=3&search=LicNbr&SID=&brd=&typ=',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  };

  const html = await new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.write(data);
    req.end();
  });

  console.log("Length: " + html.length);
  const clean = html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, '');
  console.log("Found HARTMAN: " + clean.includes('HARTMAN'));
  console.log("Found Active: " + clean.includes('Current,Active'));
  
  const fs = require('fs');
  fs.writeFileSync('dbpr_out.html', html);
}

search();
