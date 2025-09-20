import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/types/prismaTypes.d.ts", // Ignore generated Prisma types
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn", // Change to warning instead of error
      "@typescript-eslint/no-empty-object-type": "warn", // Change to warning
      "@typescript-eslint/no-require-imports": "warn", // Change to warning
      "react/no-unescaped-entities": "error",
      "@next/next/no-img-element": "warn", // Change to warning
    },
  },
];

export default eslintConfig;
