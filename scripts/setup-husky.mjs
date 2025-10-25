import { chmodSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const hooksPath = path.join(repoRoot, 'packages', 'husky-config')

function ensureGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { cwd: repoRoot, stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}

if (!ensureGitRepository()) {
  console.warn('Skipping Husky setup because the current directory is not a Git repository.')
  process.exit(0)
}

try {
  execSync(`git config core.hooksPath ${path.relative(repoRoot, hooksPath)}`, {
    cwd: repoRoot,
    stdio: 'inherit'
  })

  for (const hook of ['pre-commit', 'commit-msg']) {
    const hookPath = path.join(hooksPath, hook)
    if (existsSync(hookPath)) {
      chmodSync(hookPath, 0o755)
    }
  }
} catch (error) {
  console.error('Failed to configure Husky hooks:', error)
  process.exit(1)
}
