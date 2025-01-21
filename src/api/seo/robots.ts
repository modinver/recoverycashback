import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

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

function getDefaultRobotsContent() {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/`;
}
