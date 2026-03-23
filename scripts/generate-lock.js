import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('Generating fresh package-lock.json...');

try {
  execSync('npm install --package-lock-only', {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('Successfully generated package-lock.json');
} catch (error) {
  console.error('Error generating lock file:', error.message);
  process.exit(1);
}
