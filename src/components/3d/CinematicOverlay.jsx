import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Procedural texture for "Film Strip"
const createFilmStripTexture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 64, 512)

    // Sprocket holes
    ctx.fillStyle = '#ffffff'
    for (let i = 0; i < 20; i++) {
        const y = i * (512 / 20) + 5
        ctx.fillRect(4, y, 8, 12)
        ctx.fillRect(52, y, 8, 12)
    }

    // Frames
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 2
    for (let i = 0; i < 5; i++) {
        const y = i * 100 + 10
        ctx.strokeRect(16, y, 32, 90)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    return tex
}

const LensAssembly = () => {
    const group = useRef()

    // Lens Elements (Glass Rings)
    const rings = useMemo(() => [
        { size: [2.2, 0.1, 32, 100], pos: 0, color: '#00f0ff' }, // Front element
        { size: [2.0, 0.2, 32, 100], pos: -0.5, color: '#ffffff' },
        { size: [1.5, 0.4, 32, 100], pos: -1.2, color: '#bc00ff' }, // Inner glass
        { size: [1.8, 0.1, 32, 100], pos: -2, color: '#00ff8c' },
        { size: [1.0, 0.5, 32, 100], pos: -3, color: '#ffffff' }, // Rear element
    ], [])

    useFrame((state) => {
        // Scroll Logic: 0 to 1 based on page height approx
        const scrollY = window.scrollY
        const docHeight = document.body.scrollHeight - window.innerHeight
        const progress = Math.min(scrollY / 1000, 1) // Active in first section primarily

        if (group.current) {
            // Explode effect: Spread Z positions based on scroll
            group.current.children.forEach((child, i) => {
                const baseZ = rings[i].pos
                // Explosion factor: deeper elements move back further
                const explosion = progress * (i * 2)

                // Lerp current position
                child.position.z = THREE.MathUtils.lerp(child.position.z, baseZ + explosion, 0.1)

                // Rotate elements for dynamic feel
                child.rotation.z += 0.002 * (i + 1)
                child.rotation.x = THREE.MathUtils.lerp(child.rotation.x, progress * Math.PI * 0.5, 0.05)
            })

            // Group movement: Fades out and moves up as you scroll past intro
            group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, progress * 5, 0.1)
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, progress * Math.PI, 0.05)
        }
    })

    return (
        <group ref={group} position={[0, 0, 2]}> {/* Foreground */}
            {rings.map((ring, i) => (
                <mesh key={i} position={[0, 0, ring.pos]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={ring.size} />
                    <meshPhysicalMaterial
                        color={ring.color}
                        transmission={0.6} // Glass-like
                        opacity={0.5}
                        transparent
                        roughness={0}
                        metalness={0.8}
                        thickness={2}
                    />
                </mesh>
            ))}
        </group>
    )
}

const FloatingCode = () => {
    const group = useRef()

    // Create random blocks suggestive of code/data
    const blocks = useMemo(() => {
        return new Array(20).fill(0).map((_, i) => ({
            pos: [
                (Math.random() - 0.5) * 15, // X
                -10 - Math.random() * 20,   // Y (Start lower)
                (Math.random() - 0.5) * 5   // Z
            ],
            scale: [Math.random() * 2 + 0.5, 0.1, 0.1],
            color: Math.random() > 0.5 ? '#00f0ff' : '#00ff8c'
        }))
    }, [])

    useFrame((state) => {
        const scrollY = window.scrollY

        if (group.current) {
            // Move blocks up based on scroll (Parallax)
            const lift = scrollY * 0.01
            group.current.position.y = lift

            // Subtle float
            group.current.children.forEach((child, i) => {
                child.rotation.x += 0.01
                child.rotation.y += 0.01
            })
        }
    })

    return (
        <group ref={group}>
            {blocks.map((block, i) => (
                <mesh key={i} position={block.pos}>
                    <boxGeometry args={block.scale} />
                    <meshBasicMaterial color={block.color} wireframe opacity={0.3} transparent />
                </mesh>
            ))}
        </group>
    )
}

const FilmStripHelix = () => {
    const ref = useRef()
    const texture = useMemo(() => createFilmStripTexture(), [])

    useFrame((state) => {
        const scrollY = window.scrollY
        const progress = scrollY * 0.001

        if (ref.current) {
            // Rotate the helix as you scroll
            ref.current.rotation.y = -progress * 2
            ref.current.position.y = -progress * 5 + 2
        }
    })

    // Create a spiral tube? No, let's just make floating planes for now, simulating a fragmented strip
    const segments = 10

    return (
        <group ref={ref} position={[4, -5, 0]} rotation={[0, 0, 0.2]}>
            {Array.from({ length: segments }).map((_, i) => (
                <mesh key={i} position={[Math.sin(i) * 2, -i * 1.5, Math.cos(i) * 2]} rotation={[0, -i * 0.5, 0]}>
                    <planeGeometry args={[1.5, 1]} />
                    <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    )
}

const CinematicOverlay = () => {
    return (
        <group>
            {/* Scene 1: Exploding Lens Assembly (Top / Intro) */}
            <LensAssembly />

            {/* Scene 2: Floating Code/Data "Splash" (Middle) */}
            <FloatingCode />

            {/* Scene 3: Film Strip DNA (Side) */}
            <FilmStripHelix />
        </group>
    )
}

export default CinematicOverlay
