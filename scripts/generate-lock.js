import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

console.log('Script dir:', __dirname);
console.log('Project root:', projectRoot);
console.log('CWD:', process.cwd());

try {
  // First check what package.json looks like
  const pkg = execSync('cat package.json', { cwd: projectRoot, encoding: 'utf8' });
  console.log('package.json found, running npm install --package-lock-only...');

  const result = execSync('npm install --package-lock-only', {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  console.log(result || 'Done');
  console.log('Successfully generated package-lock.json');
} catch (error) {
  console.error('Error:', error.message);
  console.error('stdout:', error.stdout);
  console.error('stderr:', error.stderr);
}
