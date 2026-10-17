import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function git(...args) {
  return execFileSync("git", ["-c", `safe.directory=${root.replaceAll("\\", "/")}`, ...args], { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
}
const textFile = /(?:\.(?:tsx?|m?[cj]s|json|md|toml|ya?ml|txt|config|example)|(?:^|\/)\.env[^/]*|(?:^|\/)(?:Dockerfile|\.npmrc))$/i;
const rules = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["GitHub token", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ["provider secret key", /\bsk[-_](?:proj[-_])?[A-Za-z0-9_-]{24,}\b/],
  ["Google API/OAuth secret", /\b(?:AIza[A-Za-z0-9_-]{30,}|GOCSPX-[A-Za-z0-9_-]{20,})\b/],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ["persisted JWT", /\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\b/],
  ["literal credential assignment", /\b(?:api[_-]?key|client[_-]?secret|password|webhook[_-]?(?:url|secret)|authorization)\b\s*[:=]\s*["'`](?!https?:\/\/(?:your-|example\.)|your[-_]|example|placeholder|test|secret|\s*["'`])[A-Za-z0-9_\-:/+.=]{24,}["'`]/i],
];
const findings = new Set();
function scan(label, content) {
  content.split(/\r?\n/).forEach((line, index) => {
    const candidate = line.replace(/https?:\/\/[a-z0-9.-]+\.(?:example|test)(?:\/[a-z0-9/._-]*)?/gi, "https://example.test");
    for (const [kind, expression] of rules) {
      if (expression.test(candidate)) findings.add(`${label}:${index + 1} (${kind}; value withheld)`);
    }
  });
}
const files = [...new Set(git("ls-files", "-c", "-o", "--exclude-standard", "-z").split("\0").filter(Boolean))];
let workingFiles = 0;
for (const file of files) {
  if (!textFile.test(file) || !existsSync(path.join(root, file))) continue;
  scan(file, readFileSync(path.join(root, file), "utf8"));
  workingFiles++;
}
const blobs = new Map();
for (const row of git("rev-list", "--objects", "--all").trim().split("\n")) {
  const separator = row.indexOf(" ");
  if (separator === -1) continue;
  const file = row.slice(separator + 1);
  if (textFile.test(file)) blobs.set(row.slice(0, separator), file);
}
for (const [hash, file] of blobs) scan(`history/${hash.slice(0, 10)}/${file}`, git("show", hash));
let clientBundles = 0;
function scanClientBuild(directory) {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) scanClientBuild(file);
    else if (/\.(?:js|json|map)$/.test(entry.name)) {
      scan(path.relative(root, file), readFileSync(file, "utf8"));
      clientBundles++;
    }
  }
}
scanClientBuild(path.join(root, ".next", "static"));
const trackedEnv = git("ls-files", "-z").split("\0").filter(file => /(^|\/)\.env(?:\.|$)/.test(file) && file !== ".env.example");
for (const file of trackedEnv) findings.add(`${file} (environment file tracked by Git)`);
console.log(`Scanned ${workingFiles} working-tree text files, ${blobs.size} historical text blobs, and ${clientBundles} built client assets. Values are never printed.`);
if (findings.size) {
  console.error([...findings].join("\n"));
  process.exitCode = 1;
} else {
  console.log("No private credential patterns detected. This is a heuristic scan, not a guarantee or a hosted-account audit.");
}
