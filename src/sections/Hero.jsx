import React from 'react'
import { motion } from 'framer-motion'

const Hero = () => {
    return (
        <section className="h-screen w-full flex flex-col justify-center items-center text-center px-4 relative">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.6, 0.01, 0.05, 0.95] }}
            >
                <h2 className="text-orange-500 tracking-[0.2em] text-sm uppercase mb-4">
                    Cinematic Reel Editor
                </h2>
                <h1 className="h1-cinematic text-6xl md:text-9xl mb-6 mix-blend-overlay">
                    VISUAL <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                        NARRATIVE
                    </span>
                </h1>

                <p className="max-w-md mx-auto text-gray-400 text-sm md:text-base leading-relaxed">
                    Crafting stories from light, shadow, and time.
                    Enter the timeline universe.
                </p>
            </motion.div>

            <motion.div
                className="absolute bottom-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1, duration: 1 }}
            >
                <span className="text-[10px] uppercase tracking-widest animate-pulse">
                    Scroll to Enter
                </span>
            </motion.div>
        </section>
    )
}

export default Hero
