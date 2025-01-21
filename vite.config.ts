import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    componentTagger(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    host: true,
    proxy: {
      '/api': 'http://localhost:3000',
      '/images': 'http://localhost:3000'
    }
  },
  publicDir: 'public', // Esto hace que Vite sirva la carpeta public directamente
});
