'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Loader2 } from 'lucide-react'

export default function Login() {
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error) {
            console.error('Login error:', error)
            if (error.message?.includes('provider is not enabled')) {
                alert('Login Failed: Google Auth is disabled in your Supabase Project.\n\nPlease go to Supabase Dashboard > Authentication > Providers > Google and enable it.')
            } else {
                alert(error.error_description || error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                        Bookmarkly
                    </h1>
                    <p className="text-gray-500 font-medium">Your smart, real-time bookmark manager</p>
                </div>

                <div className="mt-8 space-y-6">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-indigo-500/30"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12.61C5,8.85 8.38,5.78 12.23,5.78C14.13,5.78 15.55,6.54 16.39,7.2L18.78,4.71C17.15,2.91 14.88,2.15 12.21,2.15C6.26,2.15 2,6.88 2,12.61C2,18.33 6.22,23.36 12.23,23.36C20.66,23.36 24.3,16.29 23.35,11.1Z"
                                />
                            </svg>
                        )}
                        {loading ? 'Connecting...' : 'Continue with Google'}
                    </button>
                </div>

                <p className="mt-4 text-center text-xs text-gray-400">
                    Secure authentication powered by Supabase
                </p>
            </div>
        </div>
    )
}
