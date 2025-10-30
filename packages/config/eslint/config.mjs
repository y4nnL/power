import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import perfectionist from 'eslint-plugin-perfectionist'
import prettierConfig from 'eslint-config-prettier'

const strictRules = tseslint.configs.strict?.rules ?? {}
const stylisticRules = tseslint.configs.stylistic?.rules ?? {}

export const ignoreConfig = {
  ignores: ['dist']
}

const sortObjectsRules = {
  'perfectionist/sort-objects': [
    'error',
    {
      order: 'asc',
      type: 'natural'
    }
  ]
}

const sharedStyleConfig = {
  plugins: {
    perfectionist
  },
  rules: {
    ...sortObjectsRules
  }
}

export const typescriptConfig = {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      project: ['./tsconfig.json'],
      sourceType: 'module'
    }
  },
  plugins: {
    '@typescript-eslint': tseslint,
    import: importPlugin,
    perfectionist
  },
  rules: {
    ...strictRules,
    ...stylisticRules,
    ...sortObjectsRules,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/first': 'error',
    'import/no-relative-parent-imports': 'error',
    'no-return-await': 'error',
    'perfectionist/sort-imports': [
      'error',
      {
        groups: [
          'type-import',
          ['value-builtin', 'value-external'],
          'type-internal',
          'value-internal',
          ['type-parent', 'type-sibling', 'type-index'],
          ['value-parent', 'value-sibling', 'value-index'],
          'ts-equals-import',
          'unknown'
        ],
        ignoreCase: true,
        newlinesBetween: 'never',
        order: 'asc',
        type: 'alphabetical'
      }
    ],
    'perfectionist/sort-modules': [
      'error',
      {
        groups: [
          'declare-enum',
          'export-enum',
          'enum',
          ['declare-interface', 'declare-type'],
          ['export-interface', 'export-type'],
          ['interface', 'type'],
          'declare-class',
          'class',
          'export-class',
          'declare-function',
          'export-function',
          'function'
        ],
        ignoreCase: true,
        newlinesBetween: 'ignore',
        order: 'asc',
        type: 'alphabetical'
      }
    ]
  }
}

export const config = [
  ignoreConfig,
  sharedStyleConfig,
  js.configs.recommended,
  typescriptConfig,
  prettierConfig
]
