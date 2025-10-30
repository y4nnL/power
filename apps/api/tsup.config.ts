import { tsupConfig } from '@power/config'
import { defineConfig } from 'tsup'

export default defineConfig({
  ...tsupConfig,
  entry: ['src/index.ts', 'src/server/index.ts'],
  outDir: 'dist'
})
