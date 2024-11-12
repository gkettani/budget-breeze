/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  ignorePatterns: ["node_modules", ".next", "out", "tailwind.config.cjs"],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "no-trailing-spaces": 1,
    "comma-dangle": ["error", "always-multiline"],
    "semi": ["error", "always"],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        pathGroups: [
          {
            pattern: "~/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        "newlines-between": "never",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "@typescript-eslint/no-misused-promises": [2, {
      "checksVoidReturn": {
        "attributes": false,
      },
    }],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn"t contain any source code, like `@types/unist`

        // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

        // use <root>/path/to/folder/tsconfig.json
        project: "tsconfig.json",
      },
    },
  },
};

module.exports = config;
