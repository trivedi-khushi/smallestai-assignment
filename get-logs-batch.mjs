import 'dotenv/config';
import fs from 'node:fs/promises';

const BASE = 'https://atoms-api.smallest.ai/api/v1';
const HEADERS = { Authorization: `Bearer ${process.env.SMALLEST_API_KEY}` };

const idsCsv = process.argv[2];
if (!idsCsv) {
  console.error('Usage: node get-logs-batch.mjs <id1,id2,...>');
  process.exit(1);
}
const ids = idsCsv.split(',').map(s => s.trim()).filter(Boolean);

async function getOne(id) {
  const r = await fetch(`${BASE}/conversation/${id}`, { headers: HEADERS });
  const j = await r.json();
  if (!r.ok) throw new Error(`${id}: ${JSON.stringify(j)}`);
  return { callId: id, ...(j.data ?? {}) };
}

const conversations = [];
for (const id of ids) {
  const conv = await getOne(id);
  conversations.push(conv);
  await new Promise(r => setTimeout(r, 250));
}

await fs.writeFile('conversations.json', JSON.stringify(conversations, null, 2));
console.log(`Saved ${conversations.length} conversations to conversations.json`);
