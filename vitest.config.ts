import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/index.ts",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@models": resolve(__dirname, "./src/models"),
      "@services": resolve(__dirname, "./src/services"),
      "@repositories": resolve(__dirname, "./src/repositories"),
      "@api": resolve(__dirname, "./src/api"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@nlp": resolve(__dirname, "./src/nlp"),
    },
  },
});
