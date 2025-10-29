// @ts-check

import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

/** @typedef {import('eslint').Linter.FlatConfig} FlatConfig */

const typescriptRecommendedRules = tseslint.configs.recommended.rules ?? {}

/** @type {FlatConfig} */
export const recommendedConfig = js.configs.recommended

/** @type {FlatConfig} */
export const typescriptConfig = {
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: process.cwd()
    }
  },
  plugins: {
    '@typescript-eslint': tseslint
  },
  rules: {
    ...typescriptRecommendedRules
  }
}

/** @type {FlatConfig} */
export const ignoreConfig = {
  ignores: ['dist', 'coverage']
}

/** @type {FlatConfig[]} */
const config = [
  recommendedConfig,
  typescriptConfig,
  ignoreConfig
]

export default config
