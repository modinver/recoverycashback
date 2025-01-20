import { Request, Response } from 'express';
import { supabase } from '../supabase';

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

export async function serveRobotsTxt(req: Request, res: Response) {
  try {
    const { data, error } = await supabase
      .from("seo_config")
      .select("robots_txt")
      .maybeSingle();

    if (error) throw error;

    // Establecer las cabeceras apropiadas
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache por 1 hora

    // Enviar el contenido
    res.send(data?.robots_txt || defaultRobotsContent);
  } catch (error) {
    console.error('Error serving robots.txt:', error);
    res.setHeader('Content-Type', 'text/plain');
    res.send(defaultRobotsContent);
  }
}
