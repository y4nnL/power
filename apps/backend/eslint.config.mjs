import { baseConfigs, ignoreConfig } from '@power/eslint-config'
import globals from 'globals'

export default [
  ...baseConfigs,
  {
    languageOptions: {
      globals: globals.node
    }
  },
  ...(ignoreConfig ? [ignoreConfig] : [])
]
