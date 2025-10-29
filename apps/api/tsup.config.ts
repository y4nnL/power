import { config as baseConfig } from '@power/tsup-config'
import { defineConfig } from 'tsup'

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts', 'src/server/index.ts'],
  outDir: 'dist'
})
