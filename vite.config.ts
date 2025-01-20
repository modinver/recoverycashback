import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { supabase } from "./src/integrations/supabase/client";

const defaultRobotsContent = `User-agent: *
Allow: /

# Block access to admin paths
User-agent: *
Disallow: /admin/
Disallow: /api/

# Allow search engines to crawl all other content
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://yourdomain.com/sitemap.xml`;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    middleware: [
      async (req, res, next) => {
        if (req.url === '/robots.txt') {
          try {
            const { data, error } = await supabase
              .from("seo_config")
              .select("robots_txt")
              .maybeSingle();

            if (error) throw error;

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.setHeader('Content-Disposition', 'inline');
            res.write(data?.robots_txt || defaultRobotsContent);
            res.end();
            return;
          } catch (error) {
            console.error('Error serving robots.txt:', error);
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Disposition', 'inline');
            res.write(defaultRobotsContent);
            res.end();
            return;
          }
        }
        next();
      }
    ]
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
