import React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

const ScrollTimeline = () => {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    return (
        <div className="fixed bottom-10 left-10 right-10 h-[2px] bg-white/10 z-50 overflow-hidden pointer-events-none rounded-full">
            <motion.div
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-blue-500 origin-left"
                style={{ scaleX, boxShadow: '0 0 10px rgba(255, 77, 0, 0.5)' }}
            />

            {/* Time markers (decorative) */}
            <div className="absolute top-0 w-full h-full flex justify-between px-10 opacity-20">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-[1px] h-2 bg-white -mt-1" />
                ))}
            </div>
        </div>
    )
}

export default ScrollTimeline
