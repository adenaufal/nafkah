import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Match the tsconfig path alias (@/* -> ./src/*) so tests import like the app.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node", // calculations are pure functions, no DOM needed
    include: ["src/**/*.test.ts"],
  },
});
