import oclif from 'eslint-config-oclif'

export default [
  ...oclif,
  {
    ignores: [
      './dist',
      './lib',
      '**/*.js',
      'coverage/**/*',
      'workflows-repo/**/*',
    ],
  },
  {
    files: [
      '**/*.ts',
    ],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          modules: true,
        },
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    rules: {
      '@stylistic/comma-dangle': 'warn',
      '@stylistic/function-call-argument-newline': 'warn',
      '@stylistic/function-paren-newline': 'warn',
      '@stylistic/indent': 'warn',
      '@stylistic/lines-between-class-members': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      camelcase: 'off',
      'import/namespace': 'warn',
      'mocha/no-mocha-arrows': 'warn',
      'n/shebang': 'warn',
      'node/no-missing-import': 'off',
      'perfectionist/sort-imports': 'warn',
      'perfectionist/sort-named-imports': 'warn',
      'perfectionist/sort-objects': 'warn',
      'perfectionist/sort-switch-case': 'warn',
      'prefer-arrow-callback': 'warn',
      'unicorn/import-style': 'warn',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-useless-undefined': 'warn',
      'unicorn/prefer-node-protocol': 'warn',
      'unicorn/prefer-number-properties': 'warn',
    },
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      'prefer-arrow-callback': 'off',
    },
  },
]
