import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'

const CinematicCursor = () => {
    const cursorRef = useRef(null)
    const [isHovering, setIsHovering] = useState(false)
    const [isClicking, setIsClicking] = useState(false)

    // Mouse position trackers
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth spring physics for the "Laggy" follower
    const smoothX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 })
    const smoothY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }

        const handleMouseDown = () => setIsClicking(true)
        const handleMouseUp = () => setIsClicking(false)

        // Hover detection for cinematic interactions
        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
                setIsHovering(true)
            } else {
                setIsHovering(false)
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('mouseover', handleMouseOver)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('mouseover', handleMouseOver)
        }
    }, [mouseX, mouseY])

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] mix-blend-difference top-0 left-0">
            {/* The Main Dot (Instant Follow) */}
            <motion.div
                className="absolute w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ x: mouseX, y: mouseY }}
            />


        </div>
    )
}

export default CinematicCursor
