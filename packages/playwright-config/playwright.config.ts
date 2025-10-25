import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, devices } from '@playwright/test'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const repoRoot = resolve(__dirname, '..', '..')
const frontendDir = resolve(repoRoot, 'apps', 'frontend')
const PORT = Number.parseInt(process.env.FRONTEND_PORT ?? '5173', 10)
const HOST = process.env.FRONTEND_HOST ?? 'localhost'

export default defineConfig({
  testDir: resolve(frontendDir, 'e2e'),
  fullyParallel: true,
  use: {
    baseURL: `http://${HOST}:${PORT}`
  },
  webServer: {
    command: `pnpm dev -- --host ${HOST} --port ${PORT} --strictPort`,
    url: `http://${HOST}:${PORT}`,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    cwd: frontendDir
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
})
