import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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

export default function RobotsTxt() {
  useEffect(() => {
    const fetchAndServeRobots = async () => {
      try {
        // Obtener el contenido de robots.txt de Supabase
        const { data, error } = await supabase
          .from("seo_config")
          .select("robots_txt")
          .maybeSingle();

        if (error) throw error;

        // Establecer el tipo de contenido como texto plano
        const content = data?.robots_txt || defaultRobotsContent;
        
        // Crear un blob con el contenido
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        // Descargar el archivo
        const link = document.createElement('a');
        link.href = url;
        link.download = 'robots.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error serving robots.txt:', error);
      }
    };

    fetchAndServeRobots();
  }, []);

  return null;
}
