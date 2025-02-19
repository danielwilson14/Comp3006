const eslintPluginReact = require("eslint-plugin-react");
const eslintPluginReactHooks = require("eslint-plugin-react-hooks");
const eslintPluginJsxA11y = require("eslint-plugin-jsx-a11y");
const eslintPluginImport = require("eslint-plugin-import");
const babelParser = require("@babel/eslint-parser");

module.exports = [
  {
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
      globals: {
        window: true,
        document: true,
        process: true,
      },
    },
    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
      "jsx-a11y": eslintPluginJsxA11y,
      import: eslintPluginImport,
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,
      ...eslintPluginImport.configs.recommended.rules,
      "no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off", 
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: "detect", 
      },
    },
    ignores: ["coverage/", "node_modules/", "dist/"],
  },
];
