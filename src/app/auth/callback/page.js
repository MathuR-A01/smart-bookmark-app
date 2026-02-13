'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

function CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const handleAuth = async () => {
            const code = searchParams.get('code')
            if (code) {
                try {
                    const { error } = await supabase.auth.exchangeCodeForSession(code)
                    if (error) throw error
                } catch (error) {
                    console.error('Auth error:', error.message)
                }
            }
            router.replace('/')
        }
        handleAuth()
    }, [router, searchParams])

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="ml-3 text-indigo-600 font-medium">Finishing sign in...</p>
        </div>
    )
}

export default function AuthCallback() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    )
}
