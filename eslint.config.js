const jsonPlugin = require("eslint-plugin-json");
const stylistic = require("@stylistic/eslint-plugin");

/** @type {import('eslint').Linter.Config} */
module.exports = {
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
  },
  plugins: {
    "@stylistic": stylistic,
    json: jsonPlugin,
  },
  rules: {
    "@/no-console": ["error", { allow: ["warn", "error"] }],
    "@/no-debugger": "error",
    "@/no-var": "error",
    "@/prefer-const": "error",
    curly: "error",
    eqeqeq: ["error", "always"],
    "@/no-duplicate-imports": "error",
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "@/comma-dangle": ["error", "always-multiline"],
    "@/object-curly-spacing": ["error", "always"],
    "@/no-trailing-spaces": "error",
    "@/array-bracket-spacing": ["error", "never"],
    "@/arrow-parens": ["error", "as-needed"],
    "@/space-before-function-paren": ["error", "never"],
    indent: ["error", 2],
    "@/linebreak-style": ["error", "unix"],
    "@/max-len": ["error", { code: 128 }],
    "@/max-classes-per-file": ["error", 1],
    "@/no-irregular-whitespace": "error",
    "@/lines-between-class-members": ["error"],
    "@/no-duplicate-imports": "error",
  },
};
