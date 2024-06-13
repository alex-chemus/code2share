import tseslint from "typescript-eslint";
import js from "@eslint/js";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";

export default tseslint.config(
  {
    ignores: [
      "vite.config.ts",
      "eslint.config.js",
      ".eslintrc.cjs",
      "playwright.config.ts",
      "tests/*",
      "dist/*",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  reactRecommended,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
    },
  }
);
