import 'dotenv/config';

const BASE = 'https://atoms-api.smallest.ai/api/v1';
const KEY = process.env.SMALLEST_API_KEY;
const AGENT_ID = process.env.AGENT_ID;
const PHONE = process.env.MY_PHONE_E164;

if (!KEY || !AGENT_ID || !PHONE) {
  console.error('Missing env: SMALLEST_API_KEY / AGENT_ID / MY_PHONE_E164');
  process.exit(1);
}

async function startOne() {
  const res = await fetch(`${BASE}/conversation/outbound`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId: AGENT_ID, phoneNumber: PHONE }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(j)}`);
  return j.data.conversationId;
}

const ids = [];
for (let i = 0; i < 5; i++) {
  const id = await startOne();
  console.log(`Call ${i + 1} conversationId:`, id);
  ids.push(id);
  await new Promise(r => setTimeout(r, 1500));
}

console.log('All call IDs:', ids.join(','));
