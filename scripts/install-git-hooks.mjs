import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { execFileSync, execSync } from 'node:child_process'

const repoRoot = execSync('git rev-parse --show-toplevel', {
  encoding: 'utf8'
}).trim()
const trackedHookDir = resolve(repoRoot, 'packages/gif-config')
const gitHooksDir = join(repoRoot, '.git', 'hooks')
const HOOKS = ['pre-commit', 'commit-msg']

for (const hook of HOOKS) {
  const hookPath = join(trackedHookDir, hook)
  try {
    chmodSync(hookPath, 0o755)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }
}

try {
  execFileSync('git', ['config', '--local', 'core.hooksPath', trackedHookDir])
  const configuredPath = execSync('git config --get core.hooksPath', {
    encoding: 'utf8'
  }).trim()

  const resolvedConfiguredPath = resolve(repoRoot, configuredPath)
  if (resolvedConfiguredPath !== trackedHookDir) {
    console.warn('Git hooks path is configured unexpectedly:', configuredPath)
  }
} catch (error) {
  if (error.status !== 0) {
    console.warn('Unable to configure git hooks path automatically.')
  }
}

if (!existsSync(gitHooksDir)) {
  mkdirSync(gitHooksDir, { recursive: true })
}

for (const hook of HOOKS) {
  const wrapperPath = join(gitHooksDir, hook)
  const wrapperScript = `#!/usr/bin/env bash\nset -euo pipefail\nREPO_ROOT=\"$(cd \"$(dirname \"$0\")/../..\" && pwd)\"\nexec \"$REPO_ROOT/packages/gif-config/${hook}\" \"$@\"\n`

  writeFileSync(wrapperPath, wrapperScript)
  chmodSync(wrapperPath, 0o755)
}
