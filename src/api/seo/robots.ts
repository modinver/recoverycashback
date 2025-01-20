import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/types/supabase";

type SeoConfig = Database['public']['Tables']['seo_config']['Row'];

export async function getRobotsContent() {
  const { data, error } = await supabase
    .from('seo_config')
    .select('robots_txt')
    .single();

  if (error) {
    console.error("Error fetching robots.txt:", error);
    return getDefaultRobotsContent();
  }

  return (data as SeoConfig)?.robots_txt || getDefaultRobotsContent();
}

export async function updateRobotsContent(content: string) {
  const { error: updateError } = await supabase
    .from('seo_config')
    .upsert({
      id: 1,
      robots_txt: content,
      updated_at: new Date().toISOString()
    } as SeoConfig);

  if (updateError) {
    console.error("Error updating robots.txt:", updateError);
    throw new Error("Failed to update robots.txt content");
  }

  return true;
}

function getDefaultRobotsContent() {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/sitemap.xml`;
}
