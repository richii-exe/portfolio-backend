import React from 'react'
import { motion } from 'framer-motion'

const reviews = [
    { id: 1, name: 'Alex Rivera', role: 'Director at Cineflow', content: 'Absolute professional. The color grading and pacing brought our project to a whole new level.' },
    { id: 2, name: 'Sarah Chen', role: 'Founder, TechVision', content: 'The website design is not only visually stunning but also incredibly intuitive. Highly recommend for creative web solutions.' },
    { id: 3, name: 'Marcus Thorne', role: 'Music Producer', content: 'The energy in the reels is unmatched. They perfectly captured the essence of my music visually.' },
]

const Reviews = () => {
    return (
        <section className="w-full py-20 px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading uppercase tracking-tighter">
                        Client <span className="text-blue-500">Feedback</span>
                    </h2>
                    <div className="h-1 w-20 bg-blue-600 mt-4" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-blue-500/30 transition-colors"
                        >
                            <p className="text-gray-300 italic mb-6">"{review.content}"</p>
                            <div>
                                <h4 className="font-bold text-white">{review.name}</h4>
                                <p className="text-sm text-blue-500 uppercase tracking-widest">{review.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Reviews
