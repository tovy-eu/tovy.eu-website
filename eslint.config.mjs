import { defineConfig } from "eslint/config";
import nextConfig from "eslint-config-next";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  {
    ignores: [
      ".next/*",
      ".firebase/*",
      "out/*",
      "functions/lib/*",
      "functions/node_modules/*",
      "node_modules/*",
      "convertImages.js",
      "next-env.d.ts",
    ],
  },
  ...nextConfig.map(config => ({
    ...config,
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
  })),
  ...nextTypescript.map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
    }
  }
]);
