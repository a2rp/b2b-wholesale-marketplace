import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/b2b-wholesale-marketplace/",
  build: { sourcemap: false },
  plugins: [react()],
});
