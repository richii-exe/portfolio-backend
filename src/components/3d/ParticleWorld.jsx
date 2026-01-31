import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleWorld = ({ theme = 'dark' }) => {
    const group = useRef()
    const starsRef = useRef()
    const mesh1Ref = useRef()
    const mesh2Ref = useRef()
    const mesh3Ref = useRef()
    const orb1Ref = useRef()
    const orb2Ref = useRef()
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

    useFrame((state, delta) => {
        // SMOOTHER Linear interpolation (lower lerp factor = smoother)
        const targetScroll = window.scrollY * 0.003 // Reduced sensitivity
        scrollY.current += (targetScroll - scrollY.current) * 0.05 // Smoother lerp
        const time = state.clock.getElapsedTime()

        if (group.current) {
            // Rotate slightly for dynamic feel
            group.current.rotation.y = scrollY.current * 0.08

            // FLY THROUGH EFFECT: Move Z forward based on scroll
            state.camera.position.z = 5 - (scrollY.current * 2) // Reduced intensity
            state.camera.position.y = -scrollY.current * 0.3
        }

        if (starsRef.current) {
            // Twinkle / Drift effect - continuous rotation
            starsRef.current.rotation.y += delta * 0.02
            starsRef.current.rotation.x += delta * 0.01
        }

        // Animate geometric shapes - CONTINUOUS MOVEMENT
        if (mesh1Ref.current) {
            mesh1Ref.current.rotation.x += delta * 0.3
            mesh1Ref.current.rotation.y += delta * 0.2
            mesh1Ref.current.position.y = Math.sin(time * 0.5) * 0.5
        }
        if (mesh2Ref.current) {
            mesh2Ref.current.rotation.x += delta * 0.2
            mesh2Ref.current.rotation.z += delta * 0.3
            mesh2Ref.current.position.x = -6 + Math.sin(time * 0.3) * 0.3
        }
        if (mesh3Ref.current) {
            mesh3Ref.current.rotation.y += delta * 0.15
            mesh3Ref.current.rotation.z += delta * 0.1
            mesh3Ref.current.position.y = -8 + Math.cos(time * 0.4) * 0.4
        }

        // Animate orbs - slow pulsing drift
        if (orb1Ref.current) {
            orb1Ref.current.position.x = -12 + Math.sin(time * 0.1) * 2
            orb1Ref.current.position.y = 8 + Math.cos(time * 0.15) * 1.5
        }
        if (orb2Ref.current) {
            orb2Ref.current.position.x = 15 + Math.cos(time * 0.12) * 2
            orb2Ref.current.position.y = -10 + Math.sin(time * 0.1) * 1.5
        }
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
            <mesh ref={mesh1Ref} position={[5, 0, -10]}>
                <icosahedronGeometry args={[2, 0]} />
                <meshBasicMaterial color={geoColor1} wireframe transparent opacity={isDark ? 0.15 : 0.2} />
            </mesh>

            <mesh ref={mesh2Ref} position={[-6, -5, -8]}>
                <dodecahedronGeometry args={[1.5, 0]} />
                <meshBasicMaterial color={geoColor2} wireframe transparent opacity={isDark ? 0.15 : 0.2} />
            </mesh>

            <mesh ref={mesh3Ref} position={[8, -8, -12]}>
                <octahedronGeometry args={[3, 0]} />
                <meshBasicMaterial color={geoColor3} wireframe transparent opacity={isDark ? 0.1 : 0.15} />
            </mesh>

            {/* Original Orbs - Kept for atmosphere */}
            <mesh ref={orb1Ref} position={[-12, 8, -20]}>
                <sphereGeometry args={[18, 16, 16]} />
                <meshBasicMaterial color={geoColor2} transparent opacity={isDark ? 0.03 : 0.02} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh ref={orb2Ref} position={[15, -10, -25]}>
                <sphereGeometry args={[22, 16, 16]} />
                <meshBasicMaterial color={geoColor3} transparent opacity={isDark ? 0.03 : 0.02} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    )
}

export default ParticleWorld
