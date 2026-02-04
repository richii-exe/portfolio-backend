import { useRef } from 'react'
import { useScroll, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const ServicesScene = () => {
    const group = useRef()
    const scroll = useScroll()

    useFrame(() => {
        // Visible for Page 1 (Services)
        // range(1/7, 1/7) check is good for visibility optimization
        const alpha = scroll.range(1 / 7, 1 / 7)
        if (group.current) {
            // Optimization: Only render/update if roughly in view
            // group.current.visible = alpha > 0 // optional, might clip if transitions are tight

            // Scroll Logic: Match Hero speed (18)
            // Page 1 is approx offset 1/6.
            // Start at y = -3 (below view).
            // At offset 1/6: y = -3 + (1/6 * 18) = 0 (Center)
            group.current.position.y = -3 + (scroll.offset * 18)
        }
    })

    return (
        <group ref={group}>
            {/* Shapes representing the 3 services */}

            {/* 1. Cinematic Editing - Complex/Structured */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[-3, 0, 0]} scale={0.8}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        roughness={0.2}
                        metalness={0.8}
                        transmission={0.2}
                        thickness={1}
                        wireframe={true}
                    />
                </mesh>
            </Float>

            {/* 2. Video Editing - Fluid/Continuous */}
            <Float speed={3} rotationIntensity={1} floatIntensity={2}>
                <mesh position={[0, 0, 0]} scale={0.8}>
                    <torusGeometry args={[1.2, 0.3, 16, 100]} />
                    <meshPhysicalMaterial
                        color="#ff6b00"
                        roughness={0.1}
                        metalness={0.5}
                        emissive="#ff6b00"
                        emissiveIntensity={0.5}
                    />
                </mesh>
            </Float>

            {/* 3. VFX Compositing - Precise/Sharp */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[3, 0, 0]} scale={0.8}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshPhysicalMaterial
                        color="#00f0ff"
                        roughness={0.1}
                        metalness={0.9}
                    />
                </mesh>
            </Float>

            {/* Local Lighting for this scene */}
            <pointLight position={[0, 2, 2]} intensity={10} color="white" />
        </group>
    )
}

export default ServicesScene
