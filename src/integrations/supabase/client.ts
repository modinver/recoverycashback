import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gniyienfkslaaylalzir.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaXlpZW5ma3NsYWF5bGFsemlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NTU4NzMsImV4cCI6MjA1MjUzMTg3M30.b-jEJGxKQpblI9u_yC6zbhjEt9fLxQEBt0Z27kzB_uA";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);