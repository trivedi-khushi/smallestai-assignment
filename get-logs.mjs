import 'dotenv/config';

const BASE = 'https://atoms-api.smallest.ai/api/v1';
const KEY = process.env.SMALLEST_API_KEY;
const id = process.argv[2];

if (!KEY || !id) {
  console.error('Usage: node get-logs.mjs <conversationId>');
  process.exit(1);
}

const res = await fetch(`${BASE}/conversation/${id}`, {
  headers: { Authorization: `Bearer ${KEY}` },
});
const data = await res.json();
if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data)}`);
console.log(JSON.stringify(data.data ?? data, null, 2));
