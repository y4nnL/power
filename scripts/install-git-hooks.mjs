import { chmodSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const HOOK_DIR = 'packages/git-config';
const HOOKS = ['pre-commit', 'commit-msg'];

for (const hook of HOOKS) {
  try {
    chmodSync(join(HOOK_DIR, hook), 0o755);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

try {
  execSync(`git config core.hooksPath ${HOOK_DIR}`, { stdio: 'ignore' });
} catch (error) {
  if (error.status !== 0) {
    console.warn('Unable to configure git hooks path automatically.');
  }
}
