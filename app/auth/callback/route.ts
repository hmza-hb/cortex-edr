import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAppUrl } from '@/lib/auth'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const next = url.searchParams.get('next') ?? '/'

    // Always use canonical app URL for redirects (never trust request origin - Supabase
    // may have sent user to wrong host if Site URL / Redirect URLs are misconfigured)
    const appUrl = getAppUrl(url.origin)

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${appUrl}${next}`)
        }
    }

    return NextResponse.redirect(`${appUrl}/auth/auth-code-error`)
}
