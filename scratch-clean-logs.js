const fs = require('fs');

const agentFile = 'src/app/actions/agent.ts';
let agentContent = fs.readFileSync(agentFile, 'utf8');
agentContent = agentContent.split('\n').filter(line => !line.includes('console.log("[syncUser]')).join('\n');
fs.writeFileSync(agentFile, agentContent);

const authFile = 'src/components/AuthProvider.tsx';
let authContent = fs.readFileSync(authFile, 'utf8');
authContent = authContent.split('\n').filter(line => !line.includes('console.log(`[AuthProvider] Effect run') && !line.includes('console.log("[AuthProvider] syncUserByEmail returned status')).join('\n');

// Remove the state evaluated useEffect entirely
const stateEffectRegex = /\s*useEffect\(\(\) => \{\n\s*if \(fullyLoaded\) \{\n\s*console\.log\(`\[AuthProvider\] State evaluated[\s\S]*?\}\n\s*\}, \[fullyLoaded, clerkSignedIn, internalUser, isUnauthorized, authError\]\);\n/;
authContent = authContent.replace(stateEffectRegex, '');

fs.writeFileSync(authFile, authContent);
console.log("Logs removed.");
