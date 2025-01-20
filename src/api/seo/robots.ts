import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { promises as fs } from 'fs';
import path from 'path';

type SeoConfig = Database['public']['Tables']['seo_config']['Row'];

export async function getRobotsContent() {
  const { data, error } = await supabase
    .from('seo_config')
    .select()
    .single();

  if (error) {
    console.error("Error fetching robots.txt:", error);
    return getDefaultRobotsContent();
  }

  return (data as SeoConfig)?.robots_txt || getDefaultRobotsContent();
}

export async function updateRobotsContent(content: string) {
  const now = new Date().toISOString();
  
  const seoConfig = {
    id: 1,
    robots_txt: content,
    created_at: now,
    updated_at: now
  };

  const { error: updateError } = await supabase
    .from('seo_config')
    .upsert(seoConfig, {
      onConflict: 'id'
    });

  if (updateError) {
    console.error("Error updating robots.txt:", updateError);
    throw new Error("Failed to update robots.txt content");
  }

  return true;
}

async function ensureRobotsTxt() {
    const filePath = path.join(__dirname, '../../..', 'robots.txt'); // Ruta a la raíz del proyecto
    console.log('Verificando la existencia de robots.txt en:', filePath);
    try {
        await fs.access(filePath);
        console.log('robots.txt ya existe.');
    } catch (error) {
        console.log('robots.txt no encontrado, intentando crear uno nuevo...');
        // Si el archivo no existe, obtener el contenido de la base de datos
        const { data, error: dbError } = await supabase
          .from('seo_config')
          .select()
          .single();

        if (dbError) {
          console.error("Error fetching robots.txt:", dbError);
          return;
        }

        console.log('Datos obtenidos de la base de datos:', data);
        const seoConfig = data as SeoConfig;
        if (seoConfig && seoConfig.robots_txt) {
            await fs.writeFile(filePath, seoConfig.robots_txt);
            console.log('robots.txt creado con éxito.');
        } else {
            console.log('No se pudo obtener contenido para robots.txt.');
        }
    }
}

// Llamar a la función para asegurar que el robots.txt esté presente
ensureRobotsTxt();

function getDefaultRobotsContent() {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/`;
}
