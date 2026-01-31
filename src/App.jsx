import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import ParticleWorld from './components/3d/ParticleWorld'
import CinematicOverlay from './components/3d/CinematicOverlay'
import CinematicCursor from './components/ui/CinematicCursor'
import ScrollTimeline from './components/ui/ScrollTimeline'
import SmokeIntro from './components/ui/SmokeIntro'
import FloatingControls from './components/ui/FloatingControls'
import ThemeToggle from './components/ui/ThemeToggle'
import Intro from './sections/Intro'
import Works from './sections/Works'
import Reviews from './sections/Reviews'
import Application from './sections/Application'
import Contact from './sections/Contact'


function App() {
    const containerRef = useRef(null)
    const [isHighPerf, setHighPerf] = useState(true)
    const [theme, setTheme] = useState('light')

    useEffect(() => {
        if (theme === 'light') {
            document.body.classList.add('light-mode')
        } else {
            document.body.classList.remove('light-mode')
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <main ref={containerRef} className={`relative w-full min-h-screen overflow-x-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-black' : 'bg-[#f0f2f5]'}`}>
            {/* Layer 1: Three.js Particle World (Background) - Works in both themes */}
            {isHighPerf && (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
                        <Suspense fallback={null}>
                            <ParticleWorld theme={theme} />
                            <CinematicOverlay theme={theme} />
                        </Suspense>
                        <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                        <pointLight position={[10, 10, 10]} intensity={1} color={theme === 'dark' ? "#3b82f6" : "#0066cc"} />
                        <pointLight position={[-10, -10, -5]} intensity={0.5} color={theme === 'dark' ? "#8b5cf6" : "#6366f1"} />
                    </Canvas>
                </div>
            )}

            {/* Layer 2: Subtle Background Effect */}
            <motion.div
                className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
                style={{
                    background: theme === 'dark'
                        ? 'linear-gradient(to bottom, #0a192f 0%, #000000 50%, #1a0b2e 100%)'
                        : 'linear-gradient(to bottom, #f0f9ff 0%, #ffffff 50%, #f5f3ff 100%)',
                    backgroundSize: '100% 200%',
                    opacity: theme === 'dark' ? 0.3 : 1
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '0% 100%']
                }}
                transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            {/* Layer 3: Content */}
            <div className={`relative z-10 flex flex-col gap-20 pb-20 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                <Intro />
                <Works />
                <Reviews />
                <Application />
                <Contact />
            </div>

            {/* Layer 3: UI Overlays - Now works in both themes */}
            <CinematicCursor theme={theme} />
            {theme === 'dark' && (
                <>
                    <ScrollTimeline />
                    <SmokeIntro />
                </>
            )}

            {/* Layer 4: Floating Controls */}
            <FloatingControls isHighPerf={isHighPerf} onToggle={() => setHighPerf(!isHighPerf)} />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </main>
    )
}

export default App

