import baseConfig from './base.js';

const nodeConfig = {
  ...baseConfig,
  extends: [...(baseConfig.extends ?? []), 'plugin:n/recommended', 'prettier'],
  env: {
    ...(baseConfig.env ?? {}),
    node: true,
  },
  parserOptions: {
    ...(baseConfig.parserOptions ?? {}),
    sourceType: 'module',
  },
  rules: {
    ...(baseConfig.rules ?? {}),
    'n/no-missing-import': 'off',
    'n/no-process-exit': 'off',
  },
};

export default nodeConfig;
