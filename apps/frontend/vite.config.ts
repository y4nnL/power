import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/utils/setup.ts'],
    coverage: {
      provider: 'v8'
    },
    exclude: [...configDefaults.exclude, 'e2e/**']
  }
})
