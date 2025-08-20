import 'dotenv/config';

const BASE = 'https://atoms-api.smallest.ai/api/v1';
const KEY = process.env.SMALLEST_API_KEY;
const AGENT_ID = process.env.AGENT_ID;
const PHONE = process.env.MY_PHONE_E164;

if (!KEY || !AGENT_ID || !PHONE) {
  console.error('Missing env: SMALLEST_API_KEY / AGENT_ID / MY_PHONE_E164');
  process.exit(1);
}

async function startOutboundCall(agentId, phoneNumber) {
  const res = await fetch(`${BASE}/conversation/outbound`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ agentId, phoneNumber }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data)}`);
  console.log('Call started, conversationId:', data?.data?.conversationId);
  return data?.data?.conversationId;
}

await startOutboundCall(AGENT_ID, PHONE);
