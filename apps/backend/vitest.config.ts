import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '@power/vitest-config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['test/**/*.test.ts'],
      globals: false
    }
  })
)
