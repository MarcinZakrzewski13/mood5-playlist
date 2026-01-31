import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";

const protectedRoutes = [
  "/generate",
  "/history",
  "/api/generate",
  "/api/history",
];

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key) cookies[key] = rest.join("=");
  }
  return cookies;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (!isProtected) {
    return next();
  }

  const cookieHeader = context.request.headers.get("cookie") ?? "";
  const cookies = parseCookies(cookieHeader);
  const accessToken = cookies["sb-access-token"];
  const refreshToken = cookies["sb-refresh-token"];

  if (!accessToken) {
    if (pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return context.redirect("/auth/login");
  }

  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
  );

  // Set session so RLS policies work with auth.uid()
  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken ?? "",
    });

  const user = sessionData?.user;
  const error = sessionError;

  if (error || !user) {
    // Try refresh
    if (refreshToken) {
      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession({ refresh_token: refreshToken });

      if (!refreshError && refreshData.session && refreshData.user) {
        context.locals.user = refreshData.user;
        context.locals.supabase = supabase;

        const response = await next();

        // Update cookies with new tokens
        response.headers.append(
          "Set-Cookie",
          `sb-access-token=${refreshData.session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`,
        );
        response.headers.append(
          "Set-Cookie",
          `sb-refresh-token=${refreshData.session.refresh_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
        );

        return response;
      }
    }

    if (pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return context.redirect("/auth/login");
  }

  context.locals.user = user;
  context.locals.supabase = supabase;

  return next();
});
