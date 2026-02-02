import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TOTAL_FRAMES = 49
const FPS = 18 // Slower speed as requested
const LOOP_DELAY = 3000 // 3 seconds pause

// Generate array of frame URLs
const frames = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
    `/hero/frame_${i.toString().padStart(3, '0')}.jpg`
)

const HeroSequence = () => {
    const canvasRef = useRef(null)
    const [imagesLoaded, setImagesLoaded] = useState(false)
    const [loadedCount, setLoadedCount] = useState(0)
    const [loadError, setLoadError] = useState(false)
    const [opacity, setOpacity] = useState(0) // Control canvas opacity for fade effect

    const imagesRef = useRef([])
    const frameIndexRef = useRef(0)
    const lastTimeRef = useRef(0)
    const rafRef = useRef(null)
    const ctxRef = useRef(null)
    const timeoutRef = useRef(null)

    // Preload all images into Image objects
    useEffect(() => {
        let loaded = 0
        let errors = 0
        const images = []

        const checkComplete = () => {
            if (loaded + errors === TOTAL_FRAMES) {
                if (loaded > 0) setImagesLoaded(true)
                else setLoadError(true)
            }
        }

        frames.forEach((src, index) => {
            const img = new Image()
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
        const ctx = canvas.getContext('2d', { alpha: false })
        if (!ctx) return
        ctxRef.current = ctx
    }, [])

    // Draw frame to canvas
    const drawFrame = useCallback((index) => {
        const canvas = canvasRef.current
        const ctx = ctxRef.current
        if (!canvas || !ctx) return

        // Round index to nearest integer for array access
        const frameIndex = Math.min(Math.max(Math.round(index), 0), TOTAL_FRAMES - 1)
        const img = imagesRef.current[frameIndex]

        if (!img || !img.complete || img.naturalWidth === 0) return

        const displayWidth = canvas.clientWidth || window.innerWidth
        const displayHeight = canvas.clientHeight || window.innerHeight
        const dpr = Math.min(window.devicePixelRatio || 1, 2)

        const bufferWidth = displayWidth * dpr
        const bufferHeight = displayHeight * dpr

        if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
            canvas.width = bufferWidth
            canvas.height = bufferHeight
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

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

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
    }, [])

    // Animation Loop with Reset/Fade Logic
    useEffect(() => {
        if (!imagesLoaded) return

        // Initial Start
        setOpacity(1)
        frameIndexRef.current = 0
        lastTimeRef.current = 0

        // Initial draw check
        if (imagesRef.current[0]) drawFrame(0)

        const startLoop = () => {
            rafRef.current = requestAnimationFrame(animate)
        }

        const animate = (time) => {
            if (!lastTimeRef.current) lastTimeRef.current = time

            const deltaTime = time - lastTimeRef.current
            const interval = 1000 / FPS

            if (deltaTime > interval) {
                if (frameIndexRef.current < TOTAL_FRAMES - 1) {
                    // NEXT FRAME
                    frameIndexRef.current += 1
                    drawFrame(frameIndexRef.current)
                    lastTimeRef.current = time - (deltaTime % interval)
                    rafRef.current = requestAnimationFrame(animate)
                } else {
                    // SEQUENCE FINISHED
                    cancelAnimationFrame(rafRef.current)

                    // Wait 3 seconds, then fade out and reset
                    timeoutRef.current = setTimeout(() => {
                        // Fade OUT
                        setOpacity(0)

                        // Wait for fade out transition (0.5s), then reset and Fade IN
                        setTimeout(() => {
                            frameIndexRef.current = 0
                            drawFrame(0)
                            setOpacity(1)

                            // Restart loop after Fade IN completes
                            setTimeout(() => {
                                lastTimeRef.current = 0
                                startLoop()
                            }, 500)

                        }, 500) // Match CSS transition duration

                    }, LOOP_DELAY)
                }
            } else {
                rafRef.current = requestAnimationFrame(animate)
            }
        }

        // Small delay to ensure clear layout before starting
        const t = setTimeout(() => {
            startLoop()
        }, 100)

        return () => {
            clearTimeout(t)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [imagesLoaded, drawFrame])

    if (loadError) return null

    return (
        <section className="relative w-full h-screen bg-black overflow-hidden">
            {!imagesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs tracking-widest z-20">
                    LOADING CINEMATIC... {Math.round((loadedCount / TOTAL_FRAMES) * 100)}%
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    opacity: imagesLoaded ? opacity : 0,
                    transition: 'opacity 0.5s ease-in-out'
                }}
            />

            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none z-10" />
        </section>
    )
}

export default HeroSequence
