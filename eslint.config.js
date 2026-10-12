import parser from '@typescript-eslint/parser';

export default [
  { ignores: ['dist/**', 'dist-node/**', 'public/widget/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'] },
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: {
      'no-eval': 'error', 'no-implied-eval': 'error', 'no-debugger': 'error',
      'no-unreachable': 'error', 'no-constant-condition': 'error', 'no-duplicate-case': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }], 'eqeqeq': 'error',
      'no-restricted-syntax': ['error',
        { selector: "AssignmentExpression[left.property.name='innerHTML']", message: 'Use DOM nodes and textContent; never interpolate HTML.' },
        { selector: "AssignmentExpression[left.property.name='outerHTML']", message: 'Use DOM nodes and textContent.' },
        { selector: "CallExpression[callee.property.name='insertAdjacentHTML']", message: 'Use DOM nodes and textContent.' }
      ]
    }
  }
];
