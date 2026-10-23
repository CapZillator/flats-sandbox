import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import stylistic from "@stylistic/eslint-plugin";
import jsxBlankLines from "./eslint-rules/jsx-blank-lines.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
    plugins: {
      "@stylistic": stylistic,
      project: { rules: { "jsx-blank-lines": jsxBlankLines } },
    },
    rules: {
      curly: ["error", "all"],
      "project/jsx-blank-lines": "error",
      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
        {
          blankLine: "always",
          prev: "*",
          next: ["if", "switch", "try", "for", "while", "do"],
        },
        {
          blankLine: "always",
          prev: ["if", "switch", "try", "for", "while", "do"],
          next: "*",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "public/maplibre/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
