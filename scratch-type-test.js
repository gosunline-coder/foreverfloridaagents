const fs = require('fs');

const pageFile = 'src/app/(admin)/admin/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Add import
content = content.replace(
  'import { Button } from "@/components/ui/button";',
  'import { Button } from "@/components/ui/button";\nimport { Prisma } from "@prisma/client";\n\ntype UserWithRelations = Prisma.UserGetPayload<{\n  include: {\n    completions: { include: { module: true } },\n    docAcks: { include: { document: true } },\n    supplyRequests: true\n  }\n}>;\n\ntype DocAckWithRelations = Prisma.DocAckGetPayload<{\n  include: { user: true, document: true }\n}>;'
);

// Replace any
content = content.replace(
  'const users: any[] = await prisma.user.findMany({',
  'const users: UserWithRelations[] = (await prisma.user.findMany({\n    where: { role: { in: ["agent", "admin"] } },\n    include: {\n      completions: { include: { module: true } },\n      docAcks: { include: { document: true } },\n      supplyRequests: true\n    },\n    orderBy: { hireDate: "desc" }\n  })) as unknown as UserWithRelations[];\n  // Using unknown as cast to force TS since Accelerate loses inference here\n  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */'
);

content = content.replace(
  'const agentData = users.map((user: any) => {',
  'const agentData = users.map(user => {'
);

content = content.replace(
  'const auditData = (allAcks as any[]).map((ack: any) => ({',
  'const auditData = (allAcks as unknown as DocAckWithRelations[]).map(ack => ({'
);

fs.writeFileSync(pageFile, content);
console.log('Done page');
