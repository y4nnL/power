import baseConfig from './base.js';

const reactConfig = {
  ...baseConfig,
  extends: [
    ...(baseConfig.extends ?? []),
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ...(baseConfig.parserOptions ?? {}),
    ecmaFeatures: {
      ...(baseConfig.parserOptions?.ecmaFeatures ?? {}),
      jsx: true,
    },
    sourceType: 'module',
  },
  settings: {
    ...(baseConfig.settings ?? {}),
    react: {
      ...(baseConfig.settings?.react ?? {}),
      version: 'detect',
    },
  },
  rules: {
    ...(baseConfig.rules ?? {}),
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
};

export default reactConfig;
