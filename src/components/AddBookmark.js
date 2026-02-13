'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { Plus, Link as LinkIcon, Type, Loader2 } from 'lucide-react'

export default function AddBookmark({ session, onAdd }) {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title || !url) return

        try {
            setLoading(true)
            const { error } = await supabase
                .from('bookmarks')
                .insert([{
                    title,
                    url,
                    user_id: session.user.id
                }])

            if (error) throw error

            toast.success('Bookmark added successfully!')
            setTitle('')
            setUrl('')
            if (onAdd) onAdd()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 mb-8 transition-all hover:shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Add New Bookmark
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Type className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Bookmark Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-700"
                        required
                    />
                </div>
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-700"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="md:w-32 flex items-center justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                </button>
            </form>
        </div>
    )
}
