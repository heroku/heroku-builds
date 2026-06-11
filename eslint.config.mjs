import herokuConfig from '@heroku-cli/test-utils/eslint-config'

export default [
  ...herokuConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'warn',
      camelcase: 'off',
      'node/no-missing-import': 'off',
      'perfectionist/sort-imports': 'warn',
      'perfectionist/sort-named-imports': 'warn',
      'perfectionist/sort-objects': 'warn',
      'perfectionist/sort-switch-case': 'warn',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-useless-undefined': 'warn',
      'unicorn/prefer-node-protocol': 'warn',
      'unicorn/prefer-number-properties': 'warn',
    },
  },
  {
    files: [
      'src/commands/builds/index.ts',
      'src/commands/builds/info.ts',
    ],
    rules: {
      'perfectionist/sort-objects': 'off',
    },
  },
]
