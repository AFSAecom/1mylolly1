import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  cacheDir: "node_modules/.vite-cache",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    force: true,
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tabs",

      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-switch",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-toast",
      "@radix-ui/react-toggle",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
  },
  plugins: [react(), tempo()],
  resolve: {
    preserveSymlinks: false,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
    host: true,
    port: 5173,
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-tabs"],
        },
      },
    },
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    target: "esnext",
    keepNames: true,
  },
  define: {
    __DEV__: JSON.stringify(true),
    "process.env.NODE_ENV": JSON.stringify("development"),
  },
  clearScreen: false,
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
  },
});
