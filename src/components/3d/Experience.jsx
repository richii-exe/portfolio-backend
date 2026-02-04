import { Scroll, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useState } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'

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
            <ambientLight intensity={1.5} />
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
                {/* HERO SECTION (Page 0) */}
                <motion.section
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-screen w-full relative p-8 md:p-12 flex flex-col justify-between z-10"
                >
                    {/* Top Bar */}
                    <div className="flex justify-between items-start text-white">
                        <div className="flex flex-col overflow-hidden">
                            <motion.span
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                                className="text-sm font-bold tracking-[0.2em]"
                            >
                                RICHARD
                            </motion.span>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                                className="flex items-center gap-2 mt-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
                                <span className="text-[10px] font-medium uppercase tracking-widest opacity-60">Available for work</span>
                            </motion.div>
                        </div>
                    </div>



                    {/* Bottom Bar */}
                    <div className="flex flex-col md:flex-row items-end justify-between gap-10">
                        {/* Services */}
                        <div className="hidden md:flex gap-12 text-[10px] tracking-widest opacity-60 uppercase">
                            {[
                                { title: "Cinematic Editing", desc: "Narrative pacing & structure" },
                                { title: "Video Editing", desc: "Cinematic Stories for Brands & Creators" },
                                { title: "VFX Compositing", desc: "High-end visual integration" }
                            ].map((service, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 1, ease: 'easeOut', delay: 0.8 + (i * 0.2) }}
                                    className="max-w-[140px]"
                                >
                                    <strong className="block mb-2 text-white opacity-100">{service.title}</strong>
                                    {service.desc}
                                </motion.div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-4">
                            <motion.button
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 1.4 }}
                                className="group relative px-8 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-white hover:text-black"
                            >
                                <span className="relative z-10 text-xs font-bold tracking-widest">VIEW WORK</span>
                                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </motion.button>
                            <motion.button
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 1.6 }}
                                className="px-8 py-3 rounded-full bg-[#ff6b00] text-black border border-[#ff6b00] hover:bg-[#ff8533] hover:scale-105 transition-all duration-300 text-xs font-bold tracking-widest shadow-[0_0_20px_rgba(255,107,0,0.4)]"
                            >
                                CONTACT ME
                            </motion.button>
                        </div>
                    </div>
                </motion.section>

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
