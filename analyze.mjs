import 'dotenv/config';
import fs from 'node:fs/promises';
import OpenAI from 'openai';

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error('Missing OPENAI_API_KEY in .env');
  process.exit(1);
}
const oai = new OpenAI({ apiKey: OPENAI_KEY });

const raw = await fs.readFile('conversations.json', 'utf-8');
const conversations = JSON.parse(raw);

function transcriptToText(conv) {
  const t = conv?.transcript ?? [];
  if (!Array.isArray(t)) return String(t || '');
  return t
    .map(turn => `${turn.speaker || turn.role || 'unknown'}: ${turn.text || turn.content || ''}`)
    .join('\n');
}

async function analyze(text) {
  const resp = await oai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      { role: 'system', content: 'You are a strict JSON classifier. Output ONLY valid JSON.' },
      { role: 'user', content: `Return {"did_user_speak": true|false, "user_satisfied": true|false|null} for this transcript:\n${text}` }
    ]
  });
  const content = resp.choices?.[0]?.message?.content?.trim() || '{}';
  try {
    return JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : { did_user_speak: null, user_satisfied: null };
  }
}

const results = [];
for (const conv of conversations) {
  const text = transcriptToText(conv);
  results.push(await analyze(text));
}

await fs.writeFile('analysis.json', JSON.stringify(results, null, 2));
console.log('Saved analysis.json');
