import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import ParticleWorld from './components/3d/ParticleWorld'
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
                <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <ParticleWorld />
                    </Suspense>
                </Canvas>
            </div>

            {/* Layer 2: Subtle Background Effect */}
            <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden opacity-20">
                {/* Static gradient overlay for subtle depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 via-transparent to-purple-900/5" />
            </div>

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

