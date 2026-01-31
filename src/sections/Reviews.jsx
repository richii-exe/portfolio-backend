import React from 'react'
import { motion } from 'framer-motion'

const Reviews = () => {
    const [reviews, setReviews] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [formData, setFormData] = React.useState({ name: '', role: '', content: '' })
    const [submitting, setSubmitting] = React.useState(false)

    React.useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews`)
            const data = await res.json()
            if (data.success) {
                setReviews(data.data)
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name || !formData.content) return

        setSubmitting(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()

            if (data.success) {
                // Optimistically add to UI or re-fetch
                setFormData({ name: '', role: '', content: '' })
                fetchReviews()
                alert('Feedback added successfully!')
            }
        } catch (error) {
            console.error('Error submitting review:', error)
            alert('Failed to send feedback.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="w-full py-20 px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading uppercase tracking-tighter">
                        Client <span className="text-blue-500">Feedback</span>
                    </h2>
                    <div className="h-1 w-20 bg-blue-600 mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Reviews List */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center text-gray-500 animate-pulse">Loading feedback...</div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {reviews.length === 0 && <p className="text-gray-500">No feedback yet. Be the first!</p>}
                                {reviews.map((review, i) => (
                                    <motion.div
                                        key={review.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-blue-500/30 transition-colors"
                                    >
                                        <p className="text-gray-300 italic mb-4 text-sm md:text-base">"{review.content}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{review.name}</h4>
                                                <p className="text-xs text-blue-500 uppercase tracking-widest">{review.role || 'Client'}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Feedback Form */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 h-fit sticky top-20">
                        <h3 className="text-2xl font-bold font-heading uppercase mb-6">Add Your Feedback</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2 block">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your Name"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2 block">Role / Company (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="e.g. Director, Artist"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2 block">Feedback</label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Share your experience..."
                                    rows={4}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-bold uppercase tracking-widest transition-all transform hover:scale-[1.02] disabled:opacity-50"
                            >
                                {submitting ? 'Posting...' : 'Post Feedback'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Reviews
