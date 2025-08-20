import fs from "node:fs";

const csv = fs.readFileSync("smallest_assignment_output.csv", "utf-8").trim().split(/\r?\n/);

const header = csv[0];
const expected = "callid,from number,to number,did the user speak something,was the user satisfied with answers,call duration,call cost";

if (header.replace(/"/g, '') !== expected) {
  console.error("Header mismatch.\nFound:   ", header, "\nExpected:", expected);
  process.exit(1);
}

if (csv.length - 1 !== 5) {
  console.error(`Expected 5 data rows, found ${csv.length - 1}.`);
  process.exit(1);
}

console.log("CSV looks good: header + 5 rows.");
