import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleWorld = ({ theme = 'dark' }) => {
    const group = useRef()
    const starsRef = useRef()
    const isDark = theme === 'dark'

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
            color: isDark ? '#ffffff' : '#0066cc', // Blue dots in day mode
            transparent: true,
            opacity: isDark ? 0.6 : 0.3,
            sizeAttenuation: true
        })
        return [geo, mat]
    }, [isDark])

    // Smooth scroll interpolation
    const scrollY = useRef(0)

    useFrame((state) => {
        // SMOOTHER Linear interpolation (lower lerp factor = smoother)
        const targetScroll = window.scrollY * 0.003 // Reduced sensitivity
        scrollY.current += (targetScroll - scrollY.current) * 0.05 // Smoother lerp

        if (group.current) {
            // Rotate slightly for dynamic feel
            group.current.rotation.y = scrollY.current * 0.08

            // FLY THROUGH EFFECT: Move Z forward based on scroll
            state.camera.position.z = 5 - (scrollY.current * 2) // Reduced intensity
            state.camera.position.y = -scrollY.current * 0.3
        }

        if (starsRef.current) {
            // Twinkle / Drift effect - smoother
            starsRef.current.rotation.y -= 0.0003
        }

        // Invalidate to request next frame (for demand mode)
        state.invalidate()
    })

    // Theme-aware colors
    const geoColor1 = isDark ? '#00f0ff' : '#0066cc'
    const geoColor2 = isDark ? '#bc00ff' : '#6366f1'
    const geoColor3 = isDark ? '#00ff8c' : '#10b981'

    return (
        <group ref={group}>
            {/* Background Starfield */}
            <points ref={starsRef} geometry={starGeo} material={starMat} />

            {/* Floating Geometric Shapes - Cinematic Tech Feel */}
            <mesh position={[5, 0, -10]} rotation={[0, 0, 0]}>
                <icosahedronGeometry args={[2, 0]} />
                <meshBasicMaterial color={geoColor1} wireframe transparent opacity={isDark ? 0.1 : 0.15} />
            </mesh>

            <mesh position={[-6, -5, -8]} rotation={[0.5, 0.5, 0]}>
                <dodecahedronGeometry args={[1.5, 0]} />
                <meshBasicMaterial color={geoColor2} wireframe transparent opacity={isDark ? 0.1 : 0.15} />
            </mesh>

            <mesh position={[8, -8, -12]}>
                <octahedronGeometry args={[3, 0]} />
                <meshBasicMaterial color={geoColor3} wireframe transparent opacity={isDark ? 0.05 : 0.1} />
            </mesh>

            {/* Original Orbs - Kept for atmosphere */}
            <mesh position={[-12, 8, -20]}>
                <sphereGeometry args={[18, 16, 16]} />
                <meshBasicMaterial color={geoColor2} transparent opacity={isDark ? 0.03 : 0.02} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh position={[15, -10, -25]}>
                <sphereGeometry args={[22, 16, 16]} />
                <meshBasicMaterial color={geoColor3} transparent opacity={isDark ? 0.03 : 0.02} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    )
}

export default ParticleWorld
