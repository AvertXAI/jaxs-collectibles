import { updateSession } from "@/lib/supabase/proxy";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // 1. Run the Supabase Session Update (from your old proxy logic)
    const sessionResponse = await updateSession(request);

    // 2. Initialize Supabase for Role Checking
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return request.cookies.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const isAdmin = user?.user_metadata?.role === 'admin'
    const isProtectedPath = request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/studio')

    // 3. SILENT REDIRECT: If they aren't an admin, send them home
    if (isProtectedPath && !isAdmin) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return sessionResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except static assets and images
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};