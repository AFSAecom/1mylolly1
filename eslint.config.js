import eslintPluginTs from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{ts,tsx}", "!node_modules/**"],
    languageOptions: {
      parser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } }
    },
    plugins: { '@typescript-eslint': eslintPluginTs },
    rules: {}
  }
];
