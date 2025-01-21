import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Webpage } from "@/integrations/supabase/types/database/card.types";

export const WEBPAGE_GC_TIME = 1000 * 60 * 5; // 5 minutes
export const WEBPAGE_STALE_TIME = 1000 * 60 * 2; // 2 minutes

export function useWebpageQuery(slug: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["webpage", slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("webpages")
        .select("*")
        .eq("slug_url", slug)
        .eq("is_published", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data as Webpage;
    },
    staleTime: WEBPAGE_STALE_TIME,
    gcTime: WEBPAGE_GC_TIME,
    retry: (failureCount, error: any) => {
      // No reintentar en errores 404
      if (error.code === "PGRST116") return false;
      // Máximo 3 intentos para otros errores
      return failureCount < 3;
    },
  });

  // Función para prefetch una página
  const prefetchWebpage = async (slugToPrefetch: string) => {
    await queryClient.prefetchQuery({
      queryKey: ["webpage", slugToPrefetch],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("webpages")
          .select("*")
          .eq("slug_url", slugToPrefetch)
          .eq("is_published", true)
          .single();

        if (error) {
          if (error.code === "PGRST116") return null;
          throw error;
        }

        return data as Webpage;
      },
      staleTime: WEBPAGE_STALE_TIME,
    });
  };

  return {
    ...query,
    prefetchWebpage,
  };
}
