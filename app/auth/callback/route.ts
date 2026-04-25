import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAppUrl } from '@/lib/auth'
import { ExploitValidator } from '@/lib/security/exploitValidation'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    let next = url.searchParams.get('next') ?? '/'

    // Fix Open Redirect: Ensure `next` is a safe relative path
    const safetyCheck = ExploitValidator.validateRedirectSafety(next)
    if (safetyCheck.exploitable) {
        console.warn(`[Security] Blocked open redirect attempt to: ${next}`);
        next = safetyCheck.safePath;
    }

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
