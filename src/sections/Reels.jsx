import React from 'react'
import { motion } from 'framer-motion'

const projects = [
    { id: 1, title: 'Neon Nights', category: 'Commercial' },
    { id: 2, title: 'Apex Speed', category: 'Automotive' },
    { id: 3, title: 'Void State', category: 'Art Film' },
]

const Reels = () => {
    return (
        <section className="min-h-screen w-full flex flex-col justify-center px-6 md:px-20 py-20 relative z-10">
            <div className="mb-20">
                <h2 className="text-4xl font-bold mb-2">ARCHIVE</h2>
                <div className="h-1 w-20 bg-orange-600/80" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="group relative aspect-video bg-white/5 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm hover:border-orange-500/50 transition-colors duration-500"
                    >
                        {/* Holographic noise/grid overlay */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/60">
                            <span className="text-orange-500 tracking-widest uppercase text-xs mb-2">Play Reel</span>
                            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center">
                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-xl font-bold">{project.title}</h3>
                            <p className="text-sm text-gray-400">{project.category}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Reels
