'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Login from '../components/Login'
import AddBookmark from '../components/AddBookmark'
import BookmarkList from '../components/BookmarkList'
import { LayoutDashboard, LogOut } from 'lucide-react'

export default function Home() {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!session) {
        return <Login />
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <LayoutDashboard className="h-6 w-6 text-indigo-600" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                Bookmarkly
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-700">
                                    {session.user.email}
                                </span>
                            </div>
                            <button
                                onClick={() => supabase.auth.signOut()}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Your Bookmarks</h1>
                        <p className="mt-1 text-gray-500">Manage and access your resources from anywhere.</p>
                    </div>

                    <AddBookmark session={session} onAdd={() => setRefreshTrigger(prev => prev + 1)} />
                    <BookmarkList session={session} refreshTrigger={refreshTrigger} />
                </div>
            </main>
        </div>
    )
}
