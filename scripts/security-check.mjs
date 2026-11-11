import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

// Heuristic scan of current tracked/unignored files, not a full history audit.
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const patterns = [
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{40,}/,
  /AKIA[A-Z0-9]{16}/,
  new RegExp(['-----BEGIN ', '(?:RSA |EC |OPENSSH )?', 'PRIVATE KEY-----'].join('')),
];
let scanned = 0;
const findings = [];
for (const file of files) {
  if (/\.(mp4|png|jpg|jpeg|ico|woff2?|ttf|zip|gz)$/i.test(file)) continue;
  if (statSync(file).size > 5_000_000) continue;
  scanned++;
  const content = readFileSync(file, 'utf8');
  if (patterns.some(pattern => pattern.test(content))) findings.push(file);
}
console.log(JSON.stringify({ check: 'secret-pattern-scan', scanned, findings: findings.length, files: findings }));
process.exitCode = findings.length ? 1 : 0;
