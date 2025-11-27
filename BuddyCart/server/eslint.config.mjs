import js from "@eslint/js";
import globals from "globals";

export default [

  {
    ignores: ["coverage/**"],
  },


  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    
      "no-unused-vars": "off",
      "no-empty": "off",
    },
  },


  {
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
];
