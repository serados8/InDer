const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", ".verification/**", "artifacts/**"],
  },
  {
    files: ['tests/**/*.ts'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  }
]);
