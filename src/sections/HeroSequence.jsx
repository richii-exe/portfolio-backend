import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const TOTAL_FRAMES = 49

// Generate array of frame URLs
const frames = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
    `/hero/frame_${i.toString().padStart(3, '0')}.jpg`
)

const HeroSequence = () => {
    const containerRef = useRef(null)
    const canvasRef = useRef(null)
    const [imagesLoaded, setImagesLoaded] = useState(false)
    const [loadedCount, setLoadedCount] = useState(0)
    const [loadError, setLoadError] = useState(false)
    const imagesRef = useRef([])
    const currentFrameRef = useRef(0)
    const rafRef = useRef(null)
    const ctxRef = useRef(null)

    // Preload all images into Image objects
    useEffect(() => {
        let loaded = 0
        let errors = 0
        const images = []

        const checkComplete = () => {
            if (loaded + errors === TOTAL_FRAMES) {
                if (loaded > 0) {
                    setImagesLoaded(true)
                } else {
                    setLoadError(true)
                }
            }
        }

        frames.forEach((src, index) => {
            const img = new Image()
            // Enable cross-origin for potential CDN/different origin loading
            img.crossOrigin = 'anonymous'
            img.src = src
            img.onload = () => {
                loaded++
                setLoadedCount(loaded)
                checkComplete()
            }
            img.onerror = () => {
                errors++
                console.warn(`Failed to load hero frame: ${src}`)
                checkComplete()
            }
            images[index] = img
        })

        imagesRef.current = images

        // Cleanup
        return () => {
            images.forEach(img => {
                img.onload = null
                img.onerror = null
            })
        }
    }, [])

    // Initialize canvas context once
    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d', {
            alpha: false,
            willReadFrequently: false
        })

        if (!ctx) {
            console.error('Failed to get canvas 2d context')
            setLoadError(true)
            return
        }

        ctxRef.current = ctx
    }, [])

    // Draw frame to canvas
    const drawFrame = useCallback((index) => {
        const canvas = canvasRef.current
        const ctx = ctxRef.current

        if (!canvas || !ctx) return

        const img = imagesRef.current[index]
        if (!img || !img.complete || img.naturalWidth === 0) return

        // Get actual display dimensions
        const displayWidth = canvas.clientWidth || window.innerWidth
        const displayHeight = canvas.clientHeight || window.innerHeight

        // Set canvas buffer size for high DPI displays
        const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x for performance
        const bufferWidth = displayWidth * dpr
        const bufferHeight = displayHeight * dpr

        // Only resize canvas if dimensions changed
        if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
            canvas.width = bufferWidth
            canvas.height = bufferHeight
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        // Clear canvas
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, displayWidth, displayHeight)

        // Draw image covering the canvas (object-fit: cover)
        const imgRatio = img.naturalWidth / img.naturalHeight
        const canvasRatio = displayWidth / displayHeight

        let drawWidth, drawHeight, drawX, drawY

        if (imgRatio > canvasRatio) {
            drawHeight = displayHeight
            drawWidth = drawHeight * imgRatio
            drawX = (displayWidth - drawWidth) / 2
            drawY = 0
        } else {
            drawWidth = displayWidth
            drawHeight = drawWidth / imgRatio
            drawX = 0
            drawY = (displayHeight - drawHeight) / 2
        }

        try {
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
        } catch (e) {
            console.error('Failed to draw frame:', e)
        }
    }, [])

    // Handle scroll with requestAnimationFrame for smoothness
    useEffect(() => {
        if (!imagesLoaded) return

        // Initial draw
        drawFrame(0)

        const updateFrame = () => {
            const container = containerRef.current
            if (!container) return

            const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
            const containerTop = container.offsetTop
            const containerHeight = container.offsetHeight
            const windowHeight = window.innerHeight

            // Calculate how far we've scrolled through the section
            const scrollIntoSection = scrollTop - containerTop
            const scrollableDistance = containerHeight - windowHeight

            // Progress from 0 to 1
            let progress = scrollableDistance > 0 ? scrollIntoSection / scrollableDistance : 0
            progress = Math.max(0, Math.min(1, progress))

            // Map to frame index
            const newFrame = Math.min(
                Math.floor(progress * TOTAL_FRAMES),
                TOTAL_FRAMES - 1
            )

            // Only redraw if frame changed
            if (newFrame !== currentFrameRef.current && newFrame >= 0) {
                currentFrameRef.current = newFrame
                drawFrame(newFrame)
            }
        }

        const handleScroll = () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
            rafRef.current = requestAnimationFrame(updateFrame)
        }

        const handleResize = () => {
            drawFrame(currentFrameRef.current)
        }

        // Use passive listeners for better scroll performance
        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleResize, { passive: true })
        // Also listen for orientation change on mobile
        window.addEventListener('orientationchange', handleResize, { passive: true })

        // Initial update
        updateFrame()

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('orientationchange', handleResize)
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [imagesLoaded, drawFrame])

    // Respect reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Fallback for reduced motion or load error
    if (prefersReducedMotion || loadError) {
        return (
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
                <img
                    src={frames[0]}
                    alt="Hero"
                    className="w-full h-full object-cover"
                    loading="eager"
                />
                {/* Cinematic overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />
            </section>
        )
    }

    return (
        <section
            ref={containerRef}
            className="relative w-full"
            style={{ height: '300vh' }}
        >
            {/* Sticky container for the animation */}
            <div className="sticky top-0 w-full overflow-hidden bg-black" style={{ height: '100vh' }}>
                {/* Loading state */}
                {!imagesLoaded && (
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
                            />
                        </div>
                        <p className="text-white/50 text-xs uppercase tracking-widest mt-4">
                            Loading Cinematic Experience...
                        </p>
                    </motion.div>
                )}

                {/* Canvas for rendering frames */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0"
                    style={{
                        display: imagesLoaded ? 'block' : 'none',
                        width: '100%',
                        height: '100%'
                    }}
                />

                {/* Cinematic overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10 pointer-events-none" />

                {/* Vignette effect */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        boxShadow: 'inset 0 0 150px 50px rgba(0,0,0,0.5)'
                    }}
                />

                {/* Scroll indicator */}
                {imagesLoaded && (
                    <motion.div
                        className="absolute bottom-8 left-1/2 z-20"
                        style={{ transform: 'translateX(-50%)' }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 0.6, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        <motion.div
                            className="flex flex-col items-center gap-2"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="text-white/50 text-[10px] uppercase tracking-[0.3em]">
                                Scroll to Explore
                            </span>
                            <svg
                                className="w-4 h-4 text-white/50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    )
}

export default HeroSequence
