import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { Leva } from 'leva'
import Experience from './components/3d/Experience'
import LoadingScreen from './components/ui/LoadingScreen'

function App() {
    const [theme, setTheme] = useState('dark')

    return (
        <main className="w-full h-screen bg-black overflow-hidden relative">
            {/* 3D Scene */}
            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 30 }}
                dpr={[1, 1.5]} // Performance optimization
            >
                <color attach="background" args={['#000000']} />

                <Suspense fallback={null}>
                    {/* ScrollControls manages the 3D scroll timeline. 
                        pages = 7 (Hero, Services, Projects, Story, Process, Testimonials, Contact) 
                        damping = 0.2 (Smoothness)
                    */}
                    <ScrollControls pages={7} damping={0.2}>
                        <Experience theme={theme} />
                    </ScrollControls>
                </Suspense>
            </Canvas>

            {/* UI Overlay (Absolute on top of Canvas) */}
            <LoadingScreen />

            {/* Debug Controls - Hidden in Production */}
            <Leva hidden={import.meta.env.PROD} />
        </main>
    )
}

export default App
