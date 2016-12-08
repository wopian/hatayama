module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  plugins: ['jasmine', 'jasmine-jquery'],
  extends: ['airbnb-base', 'plugin:jasmine/recommended', 'plugin:jasmine-jquery/recommended'],
  env: {
    'browser': true,
    'node': true,
    'jquery': true,
    'jasmine': true
  },
  globals: {
    'google': true,
    'map': true,
  },
  rules: {
    // enable
    'curly': 'error',
    'one-var': ['error', 'always'],
    'no-multi-spaces': ['error', { exceptions: { 'VariableDeclarator': true } }],
    'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true, 'align': 'value' }],
    'indent': ['error', 2, { 'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 } }],
    'object-shorthand': ['error', 'always', { 'ignoreConstructors': true }],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    // disable
    'no-console': 'off',
    'comma-dangle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'space-before-function-paren': 'off',
    'prefer-rest-params': 'off',
    'func-names': 'off',
    'no-useless-escape': 'off',
    'linebreak-style': 'off'
  }
};