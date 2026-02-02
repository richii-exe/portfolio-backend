import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TOTAL_FRAMES = 49
const FPS = 18 // Cinematic speed
const LOOP_DELAY = 3000 // 3 seconds pause

// Generate array of frame URLs
const frames = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
    `/hero/frame_${i.toString().padStart(3, '0')}.jpg`
)

const HeroSequence = () => {
    const canvasRef = useRef(null)

    // Loading State
    const [firstFrameLoaded, setFirstFrameLoaded] = useState(false)
    const [allImagesLoaded, setAllImagesLoaded] = useState(false)
    const [loadedCount, setLoadedCount] = useState(0)

    // Animation State
    const [opacity, setOpacity] = useState(0)

    const imagesRef = useRef([])
    const frameIndexRef = useRef(0)
    const lastTimeRef = useRef(0)
    const rafRef = useRef(null)
    const ctxRef = useRef(null)
    const timeoutRef = useRef(null)

    // 1. Initial Setup & First Frame Load
    useEffect(() => {
        // Initialize images array
        imagesRef.current = new Array(TOTAL_FRAMES).fill(null)

        // Load Frame 0 immediately
        const img0 = new Image()
        img0.crossOrigin = 'anonymous'
        img0.src = frames[0]
        img0.onload = () => {
            imagesRef.current[0] = img0
            setFirstFrameLoaded(true)
            setLoadedCount(prev => prev + 1)
        }
    }, [])

    // 2. Background Load Remaining Frames
    useEffect(() => {
        if (!firstFrameLoaded) return

        let loaded = 1 // Frame 0 is already done

        frames.slice(1).forEach((src, i) => {
            const realIndex = i + 1
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = src
            img.onload = () => {
                imagesRef.current[realIndex] = img
                loaded++
                setLoadedCount(loaded)
                if (loaded === TOTAL_FRAMES) {
                    setAllImagesLoaded(true)
                }
            }
            // Non-blocking error handling
            img.onerror = () => {
                console.warn(`Failed frame: ${src}`)
                loaded++
                if (loaded === TOTAL_FRAMES) setAllImagesLoaded(true)
            }
        })
    }, [firstFrameLoaded])

    // 3. Canvas Context
    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d', { alpha: false })
        if (ctx) ctxRef.current = ctx
    }, [])

    // 4. Draw Logic
    const drawFrame = useCallback((index) => {
        const canvas = canvasRef.current
        const ctx = ctxRef.current
        if (!canvas || !ctx) return

        const frameIndex = Math.min(Math.max(Math.round(index), 0), TOTAL_FRAMES - 1)
        const img = imagesRef.current[frameIndex]

        // If specific frame missing, try frame 0 fallback, else return
        if (!img || !img.complete || img.naturalWidth === 0) {
            if (imagesRef.current[0]) ctx.drawImage(imagesRef.current[0], 0, 0, canvas.width, canvas.height)
            return
        }

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

    // 5. Initial Draw (Frame 0)
    useEffect(() => {
        if (firstFrameLoaded && !allImagesLoaded) {
            setOpacity(1)
            drawFrame(0)

            // Resize listener for static frame
            const handleResize = () => drawFrame(0)
            window.addEventListener('resize', handleResize)
            return () => window.removeEventListener('resize', handleResize)
        }
    }, [firstFrameLoaded, allImagesLoaded, drawFrame])

    // 6. Animation Loop (Only when ALL loaded)
    useEffect(() => {
        if (!allImagesLoaded) return

        // Start Loop
        frameIndexRef.current = 0
        lastTimeRef.current = 0
        setOpacity(1)

        const startLoop = () => {
            rafRef.current = requestAnimationFrame(animate)
        }

        const animate = (time) => {
            if (!lastTimeRef.current) lastTimeRef.current = time

            const deltaTime = time - lastTimeRef.current
            const interval = 1000 / FPS

            if (deltaTime > interval) {
                if (frameIndexRef.current < TOTAL_FRAMES - 1) {
                    frameIndexRef.current += 1
                    drawFrame(frameIndexRef.current)
                    lastTimeRef.current = time - (deltaTime % interval)
                    rafRef.current = requestAnimationFrame(animate)
                } else {
                    cancelAnimationFrame(rafRef.current)

                    // Loop Delay
                    timeoutRef.current = setTimeout(() => {
                        setOpacity(0) // Fade Out
                        setTimeout(() => {
                            frameIndexRef.current = 0
                            drawFrame(0)
                            setOpacity(1) // Fade In

                            setTimeout(() => {
                                lastTimeRef.current = 0
                                startLoop()
                            }, 500)
                        }, 500)
                    }, LOOP_DELAY)
                }
            } else {
                rafRef.current = requestAnimationFrame(animate)
            }
        }

        startLoop()

        // Handle Resize during animation
        const handleResize = () => drawFrame(frameIndexRef.current)
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [allImagesLoaded, drawFrame])

    return (
        <section className="relative w-full h-[100dvh] bg-black overflow-hidden">
            {/* Loading Indicator (Only shows until Frame 0 loads - very fast) */}
            {!firstFrameLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs tracking-widest z-20">
                    INITIALIZING...
                </div>
            )}

            {/* Interactive Loading Status (Optional: Show buffering progress while viewing frame 0) */}
            {firstFrameLoaded && !allImagesLoaded && (
                <div className="absolute bottom-10 right-10 text-white/30 text-[10px] tracking-widest z-20">
                    BUFFERING SEQUENCE: {Math.round((loadedCount / TOTAL_FRAMES) * 100)}%
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    opacity: firstFrameLoaded ? opacity : 0,
                    transition: 'opacity 0.5s ease-in-out'
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none z-10" />
        </section>
    )
}

export default HeroSequence
