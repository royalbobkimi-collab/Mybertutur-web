import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bankPath = path.resolve(__dirname, '../src/app/data/spm_soalan_bank.json');

if (!fs.existsSync(bankPath)) {
  console.error(`ERROR: Question bank not found at ${bankPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(bankPath, 'utf8');
let bank;
try {
  bank = JSON.parse(raw);
} catch (e) {
  console.error('ERROR: Failed to parse spm_soalan_bank.json:', e);
  process.exit(1);
}

if (!bank.bm || !Array.isArray(bank.bm) || bank.bm.length === 0) {
  console.error('ERROR: bank.bm array missing or empty');
  process.exit(1);
}

let failed = false;

bank.bm.forEach((set, idx) => {
  const prefix = `[BM Set ${idx + 1} (${set.id || 'no-id'})]`;
  if (!set.tema || typeof set.tema !== 'string' || !set.tema.trim()) {
    console.error(`${prefix} Missing or empty tema`);
    failed = true;
  }

  // Check individu
  if (!set.individu) {
    console.error(`${prefix} Missing individu section`);
    failed = true;
    return;
  }
  if (!set.individu.bahan || !set.individu.bahan.trim()) {
    console.error(`${prefix} Missing or empty individu.bahan`);
    failed = true;
  }
  if (!Array.isArray(set.individu.soalan) || set.individu.soalan.length !== 4) {
    console.error(
      `${prefix} Individu questions must have EXACTLY 4 questions (found ${
        set.individu.soalan ? set.individu.soalan.length : 0
      })`
    );
    failed = true;
  } else {
    const bahanCount = set.individu.soalan.filter((q) => q.jenis === 'bahan').length;
    const kbatCount = set.individu.soalan.filter((q) => q.jenis === 'kbat').length;
    if (bahanCount !== 2 || kbatCount !== 2) {
      console.error(
        `${prefix} Questions must have 2 'bahan' and 2 'kbat' (found ${bahanCount} bahan, ${kbatCount} kbat)`
      );
      failed = true;
    }
    set.individu.soalan.forEach((q) => {
      if (!q.teks || !q.teks.trim()) {
        console.error(`${prefix} Question ${q.n} is empty`);
        failed = true;
      }
    });
  }

  // Check kumpulan
  if (!set.kumpulan) {
    console.error(`${prefix} Missing kumpulan section`);
    failed = true;
    return;
  }
  if (!set.kumpulan.bahan || !set.kumpulan.bahan.trim()) {
    console.error(`${prefix} Missing or empty kumpulan.bahan`);
    failed = true;
  }
  if (!set.kumpulan.soalanPerbincangan || !set.kumpulan.soalanPerbincangan.trim()) {
    console.error(`${prefix} Missing or empty kumpulan.soalanPerbincangan`);
    failed = true;
  }
});

if (failed) {
  console.error('\nFAIL: Question bank validation failed. Build aborted.');
  process.exit(1);
}

console.log(`PASS: All ${bank.bm.length} SPM BM sets validated (4 questions each, 2 bahan + 2 kbat).`);
