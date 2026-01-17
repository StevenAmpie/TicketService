// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "no-compare-neg-zero": "error",  
      "no-constructor-return": "warn",  
      "no-debugger": "warn",  
      "no-dupe-args": "error",  
      "no-dupe-class-members": "error",  
      "no-dupe-else-if": "warn",  
      "no-dupe-keys": "error",  
      "no-duplicate-case": "error",  
      "no-duplicate-imports": "error",  
      "no-empty-character-class": "error",  
      "no-empty-pattern": "warn",  
      "no-ex-assign": "error",  
      "no-func-assign": "error",  
      "no-inner-declarations": "warn",  
      "no-self-assign": "warn",  
      "no-self-compare": "error",  
      "no-template-curly-in-string": "error",  
      "no-this-before-super": "error",  
      "no-undef": "error",  
      "no-unreachable": "error",  
      "no-unreachable-loop": "error",  
      "no-unused-vars": "error",  
      "no-useless-assignment": "error",  
      "use-isnan": "error",  
      "no-console": "warn",  
      "prefer-const": "warn",  
      "prefer-regex-literals": "warn",  
      "require-await": "error",  
      curly: "error",  
      eqeqeq: "error",  
      camelcase: [  
        "error",  
        {  
          properties: "always",  
          ignoreDestructuring: false,  
        }
      ]
    },
  },
);
