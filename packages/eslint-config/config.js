import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import nodeConfig from './node.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

const configFilePatterns = [
  '**/*.config.{js,cjs,mjs,ts}',
  'commitlint.config.mjs',
  '.prettierrc.js',
  'packages/**/*.{js,ts}'
]

const ignoredGlobs = ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**']

export default [
  {
    ignores: ignoredGlobs
  },
  ...compat.config(nodeConfig).map((config) => ({
    ...config,
    files: configFilePatterns
  }))
]
