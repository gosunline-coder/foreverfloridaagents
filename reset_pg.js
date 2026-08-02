const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();

  const res = await client.query('SELECT * FROM "User"');
  const users = res.rows;

  const gosunlineUser = users.find(u => u.email.includes("gosunline@gmail.com"));
  if (gosunlineUser) {
    await client.query('DELETE FROM "Completion" WHERE "userId" = $1', [gosunlineUser.id]);
    await client.query('DELETE FROM "DocAck" WHERE "userId" = $1', [gosunlineUser.id]);
    await client.query('DELETE FROM "User" WHERE id = $1', [gosunlineUser.id]);
    console.log("Deleted gosunline user.");
  }
  await client.end();
}

main().catch(console.error);
