import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // Ignore generated files
  {
    ignores: ["dist"],
  },
  // JavaScript language settings
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
  // Base JavaScript rules
  js.configs.recommended,

  // React rules
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],

  // React Hooks rules
  reactHooks.configs.flat.recommended,

  // Project-specific rules
  {
    plugins: {
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
