'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Trash2, ExternalLink, Globe, Share2 } from 'lucide-react'
import { toast } from 'sonner'

export default function BookmarkList({ session, refreshTrigger }) {
    const [bookmarks, setBookmarks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBookmarks()

        const subscription = supabase
            .channel('bookmarks')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setBookmarks((prev) => [payload.new, ...prev])
                } else if (payload.eventType === 'DELETE') {
                    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== payload.old.id))
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [session.user.id, refreshTrigger])

    const fetchBookmarks = async () => {
        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setBookmarks(data)
        } catch (error) {
            console.error('Error fetching bookmarks:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Bookmark deleted')
            setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id))
        }
    }

    const handleShare = (url) => {
        navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!')
    }

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                <Globe className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookmarks</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new bookmark above.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="group relative bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col justify-between">
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div className="flex-shrink-0">
                                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600">
                                    <Globe className="h-5 w-5" />
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleShare(bookmark.url)}
                                    className="text-gray-400 hover:text-indigo-500 transition-colors p-1 rounded-full hover:bg-indigo-50"
                                    title="Share bookmark"
                                >
                                    <Share2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(bookmark.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                                    title="Delete bookmark"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900 line-clamp-1" title={bookmark.title}>
                            {bookmark.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2 break-all">
                            {bookmark.url}
                        </p>
                    </div>
                    <div className="mt-6">
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Visit Website
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </div>
                </div>
            ))}
        </div>
    )
}
