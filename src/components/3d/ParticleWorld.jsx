import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleWorld = () => {
    const group = useRef()
    const frameCount = useRef(0)

    // Create multi-colored cosmic orbs for a futuristic aurora feel
    const orbs = useMemo(() => {
        return [
            { pos: [-12, 8, -12], color: '#bc00ff', size: 18 },  // Neon Purple
            { pos: [15, -10, -15], color: '#00ff8c', size: 22 }, // Emerald
            { pos: [0, 0, -25], color: '#00f0ff', size: 30 },    // Electric Blue
        ]
    }, [])

    useFrame((state) => {
        if (!group.current) return

        // Throttle to every 3rd frame for performance
        frameCount.current++
        if (frameCount.current % 3 !== 0) return

        const time = state.clock.getElapsedTime()

        group.current.children.forEach((orb, i) => {
            // Organic cosmic drift
            orb.position.x += Math.sin(time * 0.15 + i) * 0.005
            orb.position.y += Math.cos(time * 0.2 + i) * 0.005
        })

        // Slow group rotation for shifting horizon
        group.current.rotation.z = Math.sin(time * 0.05) * 0.1
    })

    return (
        <group ref={group}>
            {orbs.map((orb, i) => (
                <mesh key={i} position={orb.pos}>
                    <sphereGeometry args={[orb.size, 16, 16]} />
                    <meshBasicMaterial
                        color={new THREE.Color(orb.color)}
                        transparent={true}
                        opacity={0.06}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    )
}

export default ParticleWorld
