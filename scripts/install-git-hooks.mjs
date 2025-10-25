import { chmodSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync, execFileSync } from 'node:child_process';

const repoRoot = execSync('git rev-parse --show-toplevel', {
  encoding: 'utf8'
}).trim();
const HOOK_DIR = resolve(repoRoot, 'packages/gif-config');
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
  execFileSync('git', ['config', '--local', 'core.hooksPath', HOOK_DIR]);
  const configuredPath = execSync('git config --get core.hooksPath', {
    encoding: 'utf8'
  }).trim();

  if (resolve(repoRoot, configuredPath) !== HOOK_DIR) {
    console.warn('Git hooks path is configured unexpectedly:', configuredPath);
  }
} catch (error) {
  if (error.status !== 0) {
    console.warn('Unable to configure git hooks path automatically.');
  }
}
