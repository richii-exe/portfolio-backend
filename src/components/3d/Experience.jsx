import { Scroll, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useState } from 'react'
import * as THREE from 'three'

// Scene Imports (Placeholders for now)
import HeroScene from './scenes/HeroScene'
import ServicesScene from './scenes/Services3D'
import ProjectsScene from './scenes/Projects3D'
import StoryScene from './scenes/StoryScene'
import ProcessScene from './scenes/ProcessScene'
import TestimonialsScene from './scenes/TestimonialsScene'
import ContactScene from './scenes/ContactScene'

const Experience = ({ theme }) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            {/* 3D Layer: content that exists in 3D space */}
            <HeroScene />
            <ServicesScene />
            <ProjectsScene />
            <StoryScene />
            <ProcessScene />
            <TestimonialsScene />
            <ContactScene />

            {/* HTML Layer: text overlay that scrolls with the page */}
            <Scroll html style={{ width: '100vw', height: '100vh' }}>
                <section className="h-screen w-full p-20 flex items-center justify-center pointer-events-none">
                    <h1 className="text-white text-9xl font-bold tracking-tighter">HERO</h1>
                </section>
                <section className="h-screen w-full p-20 flex items-center justify-center pointer-events-none">
                    <h1 className="text-white text-9xl font-bold tracking-tighter">SERVICES</h1>
                </section>
                <section className="h-screen w-full p-20 flex items-center justify-center pointer-events-none">
                    <h1 className="text-white text-9xl font-bold tracking-tighter">PROJECTS</h1>
                </section>
                <section className="h-screen w-full p-20 flex items-center justify-center pointer-events-none">
                    <h1 className="text-white text-9xl font-bold tracking-tighter">STORY</h1>
                </section>
                <section className="h-screen w-full p-20 flex items-center justify-center pointer-events-none">
                    <h1 className="text-white text-9xl font-bold tracking-tighter">PROCESS</h1>
                </section>
                <section className="h-screen w-full p-20 flex items-center justify-center pointer-events-none">
                    <h1 className="text-white text-9xl font-bold tracking-tighter">TESTIMONIALS</h1>
                </section>
                <section className="h-screen w-full p-20 flex items-center justify-center pointer-events-none">
                    <h1 className="text-white text-9xl font-bold tracking-tighter">CONTACT</h1>
                </section>
            </Scroll>
        </>
    )
}

export default Experience
