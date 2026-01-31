import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SmokeIntro = () => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 2500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-black pointer-events-none flex items-center justify-center overflow-hidden"
                >
                    {/* Simplified Smoke Effect - 4 particles instead of 15 */}
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                scale: 0.8,
                                x: (i - 2) * 200,
                                y: (i % 2 - 0.5) * 200,
                                opacity: 0.3
                            }}
                            animate={{
                                scale: 2,
                                opacity: 0,
                            }}
                            transition={{
                                duration: 2,
                                ease: "easeOut",
                                delay: i * 0.1
                            }}
                            className="absolute w-[300px] h-[300px] rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
                                filter: 'blur(40px)',
                            }}
                        />
                    ))}

                    {/* Logo/Name placeholder */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, times: [0, 0.4, 1] }}
                        className="relative z-10 text-center"
                    >
                        <h2 className="text-white text-xs font-bold uppercase tracking-[1em] opacity-40">Loading...</h2>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SmokeIntro
