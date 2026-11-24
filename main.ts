import { mkdirSync, writeFileSync } from "node:fs";

const SENTENCE =
  "Imagine every library, post office and market in the world joined by invisible roads, so any letter you write arrives anywhere in a blink and any book opens at your table.";

// Words coined after 1800 that a traveler from that year could not know.
const BANNED_AFTER_1800 = [
  "internet",
  "computer",
  "email",
  "website",
  "online",
  "digital",
  "phone",
  "screen",
  "software",
  "data",
  "wifi",
  "app",
  "pixel",
  "video",
  "chat",
  "social",
  "media",
  "electric",
  "telegraph",
  "telephone",
  "radio",
  "television",
];

function validate(text: string): string[] {
  const problems: string[] = [];
  if (text.length === 0) problems.push("empty");
  if (text.length > 200) problems.push("over 200 characters");
  if (text.trim() !== text) problems.push("leading/trailing whitespace");
  if (text.includes("\n")) problems.push("not a single line");
  if (!text.endsWith(".")) problems.push("must end with a full stop");
  if (text.split(/\s+/).length < 3) problems.push("too few words");
  if (/\s{2,}/.test(text)) problems.push("double spaces");
  if (!/^[\x20-\x7E]+$/.test(text)) problems.push("non-printable ASCII");
  const lower = text.toLowerCase();
  for (const w of BANNED_AFTER_1800) {
    // Word-boundary match so "app" never flags a word like "apple".
    if (new RegExp(`\\b${w}\\b`).test(lower)) {
      problems.push("uses a word coined after 1800: " + w);
    }
  }
  // The judge builds from what a person from 1800 already knows, so the
  // sentence must anchor on at least one familiar thing: a road, a post
  // office, a library, a letter, a book, or a market.
  const ANCHORS_1800 = ["road", "post office", "library", "letter", "book", "market"];
  if (!ANCHORS_1800.some((a) => lower.includes(a))) {
    problems.push("no anchor a person from 1800 would know");
  }
  return problems;
}

const problems = validate(SENTENCE);
if (problems.length > 0) {
  console.error("invalid entry: " + problems.join("; "));
  process.exit(1);
}
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", SENTENCE, "utf8");
console.log(`wrote ${SENTENCE.length} chars to /output/entry.txt`);
