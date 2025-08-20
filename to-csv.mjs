import fs from "fs";
import { parse } from "json2csv";

// load JSON files
const conversations = JSON.parse(fs.readFileSync("conversations.json", "utf-8"));
const analysis = JSON.parse(fs.readFileSync("analysis.json", "utf-8"));

// merge analysis into conversations
const merged = conversations.map(conv => {
  const extra = analysis.find(a => a.callId === conv.callId) || {};
  return { ...conv, ...extra };
});

// select columns
const fields = [
  "callId",
  "fromNumber",
  "toNumber",
  "did_user_speak",
  "user_satisfied",
  "callDuration",
  "callCost"
];

const csv = parse(merged, { fields });
fs.writeFileSync("output.csv", csv);

console.log("CSV written to output.csv");
