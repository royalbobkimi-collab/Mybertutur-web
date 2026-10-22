import fs from 'fs';
const c = fs.readFileSync('c:/xampp/htdocs/projek saja saja/mybertutur-web/src/app/data/naskahCalon.ts', 'utf8');
const emptyCount = (c.match(/"instruction": ""/g) || []).length;
const totalCount = (c.match(/"instruction":/g) || []).length;
console.log('Empty instructions:', emptyCount);
console.log('Total instruction fields:', totalCount);

// Find themes with empty individual instructions
const dataMatch = c.match(/export const BM_ORAL_THEMES_T4: BmOralTheme\[\] = \[([\s\S]*?)\];\n\nexport const BM_ORAL_THEMES_T5/);
if (dataMatch) {
  const t4Content = dataMatch[1];
  const themeIds = t4Content.match(/"id": "([^"]+)"/g) || [];
  console.log('T4 themes:', themeIds.length);
}

const dataMatch5 = c.match(/export const BM_ORAL_THEMES_T5: BmOralTheme\[\] = \[([\s\S]*?)\];\n\nexport const BM_ORAL_THEMES/);
if (dataMatch5) {
  const t5Content = dataMatch5[1];
  const themeIds = t5Content.match(/"id": "([^"]+)"/g) || [];
  console.log('T5 themes:', themeIds.length);
}