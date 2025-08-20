import 'dotenv/config';

const BASE = 'https://atoms-api.smallest.ai/api/v1';
const KEY = process.env.SMALLEST_API_KEY;

if (!KEY) {
  console.error('Missing SMALLEST_API_KEY in .env');
  process.exit(1);
}

async function sfetch(path, init = {}) {
  const headers = {
    Authorization: `Bearer ${KEY}`,
    ...(init.method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
    ...(init.headers || {}),
  };
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`);
  return JSON.parse(text);
}

async function main() {
  const t = await sfetch('/agent/template');
  const templates = t?.data || [];
  if (!templates.length) throw new Error('No templates available');
  const chosen = templates[0];

  const body = {
    agentName: `DevRel Test Agent ${Date.now()}`,
    agentDescription: 'Created via Node.js',
    templateId: chosen.id,
  };
  const created = await sfetch('/agent/from-template', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  console.log('Agent created. agentId =', created.data);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
