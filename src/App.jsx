import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import ParticleWorld from './components/3d/ParticleWorld'
import CinematicOverlay from './components/3d/CinematicOverlay'
import CinematicCursor from './components/ui/CinematicCursor'
import ScrollTimeline from './components/ui/ScrollTimeline'
import SmokeIntro from './components/ui/SmokeIntro'
import Intro from './sections/Intro'
import Works from './sections/Works'
import Reviews from './sections/Reviews'
import Application from './sections/Application'
import Contact from './sections/Contact'

function App() {
    const containerRef = useRef(null)

    return (
        <main ref={containerRef} className="relative w-full min-h-screen bg-black overflow-x-hidden">
            {/* Layer 1: Three.js Particle World (Background) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
                    <Suspense fallback={null}>
                        <ParticleWorld />
                        <CinematicOverlay />
                    </Suspense>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
                    <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
                </Canvas>
            </div>

            {/* Layer 2: Subtle Background Effect */}
            <motion.div
                className="fixed inset-0 z-[1] pointer-events-none overflow-hidden opacity-30"
                style={{
                    background: 'linear-gradient(to bottom, #0a192f 0%, #000000 50%, #1a0b2e 100%)',
                    backgroundSize: '100% 200%',
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
            <div className="relative z-10 flex flex-col gap-20 pb-20">
                <Intro />
                <Works />
                <Reviews />
                <Application />
                <Contact />
            </div>

            {/* Layer 3: UI Overlays */}
            <CinematicCursor />
            <ScrollTimeline />
            <SmokeIntro />
        </main>
    )
}

export default App

