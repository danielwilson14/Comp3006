import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginTestingLibrary from "eslint-plugin-testing-library";
import eslintPluginJest from "eslint-plugin-jest"; 
import babelParser from "@babel/eslint-parser";

export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
    },
    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
      "jsx-a11y": eslintPluginJsxA11y,
      "testing-library": eslintPluginTestingLibrary,
      jest: eslintPluginJest,
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,
      ...eslintPluginTestingLibrary.configs.react.rules,
      ...eslintPluginJest.configs.recommended.rules, 
      "no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "jest/valid-expect": "error", 
      "testing-library/no-wait-for-multiple-assertions": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
