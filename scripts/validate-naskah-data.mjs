import fs from 'fs';

const filePath = 'c:/xampp/htdocs/projek saja saja/mybertutur-web/src/app/data/naskahCalon.ts';
const content = fs.readFileSync(filePath, 'utf8');

const emptyCount = (content.match(/"instruction": ""/g) || []).length;

if (emptyCount > 0) {
  console.error(`VALIDATION FAILED: ${emptyCount} empty instruction fields found in naskahCalon.ts`);
  process.exit(1);
}

console.log('VALIDATION PASSED: No empty instruction fields found.');