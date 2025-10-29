import config from '@power/eslint-config'
import globals from 'globals'

const baseConfigs = config.slice(0, -1)
const ignoreConfig = config.at(-1)

export default [
  ...baseConfigs,
  {
    languageOptions: {
      globals: globals.node
    }
  },
  ...(ignoreConfig ? [ignoreConfig] : [])
]
