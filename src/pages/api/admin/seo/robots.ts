import { getRobotsContent, updateRobotsContent } from "@/api/seo/robots";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(req: any, res: any) {
  // Asegurar que siempre respondemos con JSON
  res.setHeader('Content-Type', 'application/json');

  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "GET") {
      const content = await getRobotsContent();
      return res.status(200).json({ content });
    } 
    
    if (req.method === "POST") {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      await updateRobotsContent(content);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error handling robots.txt:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}
