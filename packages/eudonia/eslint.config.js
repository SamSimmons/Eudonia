import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactX from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import noUnnecessaryEffect from 'eslint-plugin-react-you-might-not-need-an-effect';

export default tseslint.config(
  { ignores: ['dist/**', '**/*.d.ts'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactX.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-you-might-not-need-an-effect': noUnnecessaryEffect,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...noUnnecessaryEffect.configs.recommended.rules,
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
    },
  },
);
