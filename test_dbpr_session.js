const https = require('https');

function fetchGet(path) {
  return new Promise((resolve) => {
    https.get({
      hostname: 'www.myfloridalicense.com',
      port: 443,
      path: path,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ body, headers: res.headers }));
    });
  });
}

function fetchPost(path, cookie, data) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.myfloridalicense.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Cookie': cookie || ''
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log("Getting session...");
  const res1 = await fetchGet('/wl11.asp?mode=1&search=LicNbr&SID=&brd=&typ=');
  const cookies = res1.headers['set-cookie'] ? res1.headers['set-cookie'].join('; ') : '';
  
  // Extract hidden fields
  const hSIDMatch = res1.body.match(/<input TYPE="hidden" NAME="hSID" VALUE="([^"]*)"/i);
  const hSID = hSIDMatch ? hSIDMatch[1] : '';
  console.log("Cookie: ", cookies, "hSID: ", hSID);

  console.log("Posting search...");
  const data = `hSID=${hSID}&hSearchType=LicNbr&hLicNbr=SL3350267&SearchType=LicNbr&LicNbr=SL3350267&Search=Search`;
  const res2 = await fetchPost(`/wl11.asp?mode=3&search=LicNbr&SID=${hSID}&brd=&typ=`, cookies, data);
  
  console.log("Length: " + res2.length);
  const clean = res2.replace(/<[^>]*>?/gm, '').replace(/\s+/g, '');
  console.log("Found HARTMAN: " + clean.includes('HARTMAN'));
  console.log("Found Active: " + clean.includes('Current,Active'));
}

run();
