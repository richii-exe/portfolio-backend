import React, { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import styles from './CinematicCursor.module.css'

const CinematicCursor = ({ theme = 'dark' }) => {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth spring physics for the cursor
    const springConfig = { damping: 25, stiffness: 700 }
    const cursorX = useSpring(mouseX, springConfig)
    const cursorY = useSpring(mouseY, springConfig)

    // Trail/Glow physics (slightly delayed)
    const trailSpringConfig = { damping: 15, stiffness: 200 }
    const trailX = useSpring(mouseX, trailSpringConfig)
    const trailY = useSpring(mouseY, trailSpringConfig)

    const [isHovering, setIsHovering] = useState(false)

    const isDark = theme === 'dark'

    useEffect(() => {
        const moveCursor = (e) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }

        const handleHover = (e) => {
            const isClickable = e.target.closest('button, a, input, select, textarea, .glass-panel')
            setIsHovering(!!isClickable)
        }

        window.addEventListener('mousemove', moveCursor)
        window.addEventListener('mouseover', handleHover)
        return () => {
            window.removeEventListener('mousemove', moveCursor)
            window.removeEventListener('mouseover', handleHover)
        }
    }, [])

    return (
        <>
            {/* Main Sharp Point */}
            <motion.div
                className={styles.cursorPoint}
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    backgroundColor: isHovering
                        ? (isDark ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)')
                        : (isDark ? '#fff' : '#000000')
                }}
                style={{
                    translateX: cursorX,
                    translateY: cursorY,
                }}
            />

            {/* Soft Glow / Intelligence Orb */}
            <motion.div
                className={`${styles.cursorGlow} ${!isDark ? styles.cursorGlowLight : ''}`}
                animate={{
                    scale: isHovering ? 2 : 1,
                    opacity: isHovering ? 0.8 : 0.4
                }}
                style={{
                    translateX: trailX,
                    translateY: trailY,
                    background: isDark
                        ? 'radial-gradient(circle, rgba(0,240,255,0.3) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(0,102,204,0.2) 0%, transparent 70%)'
                }}
            />
        </>
    )
}

export default CinematicCursor
