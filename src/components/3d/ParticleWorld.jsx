import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleWorld = () => {
    const group = useRef()
    const starsRef = useRef()

    // Create random stars
    const [starGeo, starMat] = useMemo(() => {
        const geo = new THREE.BufferGeometry()
        const count = 700 // Optimized for performance
        const positions = new Float32Array(count * 3)

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100 // Spread across space
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        const mat = new THREE.PointsMaterial({
            size: 0.1,
            color: '#ffffff',
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        })
        return [geo, mat]
    }, [])

    // Smooth scroll interpolation
    const scrollY = useRef(0)

    useFrame((state) => {
        // Linear interpolation for smooth scroll effect
        const targetScroll = window.scrollY * 0.005
        scrollY.current += (targetScroll - scrollY.current) * 0.1

        if (group.current) {
            // Rotate slightly for dynamic feel
            group.current.rotation.y = scrollY.current * 0.1

            // FLY THROUGH EFFECT: Move Z forward based on scroll
            // 5 is initial Z. We move closer as we scroll.
            // Using modulo to create infinite loop illusion if needed, but for portfolio, linear travel is fine.
            state.camera.position.z = 5 - (scrollY.current * 3)
            state.camera.position.y = -scrollY.current * 0.5 // Reduce vertical move to focus on forward motion

            // Ensure we never clip too close to singular points if not desired, 
            // but flying through is cool.
        }

        if (starsRef.current) {
            // Twinkle / Drift effect
            starsRef.current.rotation.y -= 0.0005
        }
    })

    return (
        <group ref={group}>
            {/* Background Starfield */}
            <points ref={starsRef} geometry={starGeo} material={starMat} />

            {/* Floating Geometric Shapes - Cinematic Tech Feel */}
            <mesh position={[5, 0, -10]} rotation={[0, 0, 0]}>
                <icosahedronGeometry args={[2, 0]} />
                <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.1} />
            </mesh>

            <mesh position={[-6, -5, -8]} rotation={[0.5, 0.5, 0]}>
                <dodecahedronGeometry args={[1.5, 0]} />
                <meshBasicMaterial color="#bc00ff" wireframe transparent opacity={0.1} />
            </mesh>

            <mesh position={[8, -8, -12]}>
                <octahedronGeometry args={[3, 0]} />
                <meshBasicMaterial color="#00ff8c" wireframe transparent opacity={0.05} />
            </mesh>

            {/* Original Orbs - Kept for atmosphere */}
            <mesh position={[-12, 8, -20]}>
                <sphereGeometry args={[18, 16, 16]} />
                <meshBasicMaterial color="#bc00ff" transparent opacity={0.03} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh position={[15, -10, -25]}>
                <sphereGeometry args={[22, 16, 16]} />
                <meshBasicMaterial color="#00ff8c" transparent opacity={0.03} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    )
}

export default ParticleWorld
