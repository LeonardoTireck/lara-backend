// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import markdown from '@eslint/markdown';

export default tseslint.config(
  {
    ignores: ['coverage/', 'node_modules/', 'jest.config.js'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic,
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      'no-empty': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-confusing-non-null-assertion': 'off',
    },
  },
  ...markdown.configs.recommended,
  {
    files: ['**/*.md'],
    rules: {
      'markdown/no-missing-label-refs': 'off',
    },
  },
);