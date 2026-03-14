import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    const url = request.nextUrl

    // Fix: OAuth code landing on wrong page (e.g. /?code=... instead of /auth/callback)
    // Happens when Supabase Site URL is set to root; redirect to proper callback
    if (url.pathname === '/' && url.searchParams.has('code')) {
        const callbackUrl = new URL('/auth/callback', url.origin)
        url.searchParams.forEach((v, k) => callbackUrl.searchParams.set(k, v))
        if (!callbackUrl.searchParams.has('next')) callbackUrl.searchParams.set('next', '/dashboard')
        return NextResponse.redirect(callbackUrl)
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    return response
}
