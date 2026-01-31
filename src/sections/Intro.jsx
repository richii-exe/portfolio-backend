import React from 'react'
import { motion } from 'framer-motion'

const nameColors = [
    'var(--c-blue-electric)',
    'var(--c-purple-neon)',
    'var(--c-blue-electric)',
    'var(--c-emerald-neon)',
    'var(--c-blue-electric)',
    'var(--c-tangerine-neon)'
]

const Intro = () => {
    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-20 z-10">

            {/* Container for Profile Content */}
            <div className="flex flex-col items-center text-center space-y-16 max-w-6xl mx-auto">

                {/* Photo Container - 'Backlit' Feeling */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2, duration: 1.5, ease: [0.6, 0.01, 0.05, 0.95] }}
                    className="relative group"
                >
                    {/* Multi-colored Backlight */}
                    <div className="absolute -inset-10 bg-purple-600 rounded-full blur-[120px] opacity-10 group-hover:opacity-30 transition-all duration-1000 animate-pulse"></div>
                    <div className="absolute -inset-10 bg-blue-600 rounded-full blur-[100px] opacity-10 group-hover:opacity-30 transition-all duration-1000"></div>

                    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border border-white/20 bg-black/60 shadow-2xl flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                        <img
                            src="/profile.jpg"
                            alt="Richie"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 scale-110 group-hover:scale-100 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                </motion.div>

                {/* Text Content - 'High-Speed' Detail */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="space-y-8"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-bold font-heading tracking-tighter leading-[0.75] text-white flex flex-wrap justify-center overflow-hidden h1-cinematic text-glow">
                        {"RICHIE".split("").map((char, i) => (
                            <motion.span
                                key={i}
                                initial={{ y: "110%", rotateX: -90 }}
                                animate={{
                                    y: 0,
                                    rotateX: 0,
                                    color: ['#fff', nameColors[i], '#fff']
                                }}
                                transition={{
                                    y: { delay: 2.5 + (i * 0.1), duration: 1.2, ease: [0.6, 0.01, 0.05, 0.95] },
                                    rotateX: { delay: 2.5 + (i * 0.1), duration: 1.2 },
                                    color: { delay: 4, duration: 5, repeat: Infinity, repeatType: 'reverse' }
                                }}
                                className="inline-block transform-gpu"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </h1>

                    <div className="flex flex-col items-center space-y-6">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 120 }}
                            transition={{ delay: 3.5, duration: 1.5 }}
                            className="h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                        />
                        <motion.p
                            initial={{ opacity: 0, letterSpacing: "1em" }}
                            animate={{ opacity: 1, letterSpacing: "0.5em" }}
                            transition={{ delay: 3.8, duration: 1.5 }}
                            className="text-blue-500 text-xs md:text-sm font-bold uppercase"
                        >
                            Visionary Editor
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 4.2, duration: 1 }}
                            className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-lg md:text-2xl font-light italic px-4"
                        >
                            "Freezing time in the edit, highlighting the raw textures of human emotion."
                        </motion.p>
                    </div>

                    <div className="pt-8 flex justify-center gap-4">
                        <div className="h-[1px] w-12 bg-white/20 self-center" />
                        <span className="text-white/40 text-xs tracking-widest uppercase">Explore the timeline</span>
                        <div className="h-[1px] w-12 bg-white/20 self-center" />
                    </div>
                </motion.div>

            </div>
        </section>
    )
}

export default Intro
