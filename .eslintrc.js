module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:eslint-plugin/recommended",
    "plugin:@typescript-eslint/recommended",
    //'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],

  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  rules: {},
  ignorePatterns: ["**/*.js", "**/*.d.ts"],
}
