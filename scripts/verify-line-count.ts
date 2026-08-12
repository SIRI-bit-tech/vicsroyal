import fs from 'fs';
import path from 'path';

function getFilesRecursively(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'drizzle' || file === 'public') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allCodeFiles = getFilesRecursively(process.cwd());
let passed = true;

console.log('=== AUDITING CODEBASE FILE LINE COUNTS (CEILING: 200 LOC) ===');
allCodeFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n').length;
  const relPath = path.relative(process.cwd(), file);

  if (lines > 200) {
    console.error(`❌ EXCEEDED LIMIT: ${relPath} (${lines} lines)`);
    passed = false;
  } else {
    console.log(`✓ OK: ${relPath} (${lines} lines)`);
  }
});

if (!passed) {
  console.error('\nFAIL: Some files exceed the 200 LOC limit.');
  process.exit(1);
} else {
  console.log('\nPASS: All files are strictly under 200 LOC!');
  process.exit(0);
}
