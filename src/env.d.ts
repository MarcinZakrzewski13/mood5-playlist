/// <reference types="astro/client" />

import type { SupabaseClient, User } from "@supabase/supabase-js";

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
  readonly OPENROUTER_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user: User;
    supabase: SupabaseClient;
  }
}
