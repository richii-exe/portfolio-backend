import { useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const HeroScene = () => {
    const group = useRef()
    const scroll = useScroll()

    useFrame((state, delta) => {
        // Move entire hero scene up as user scrolls down to mimic standard scrolling
        // The factor '18' ensures it clears the view nicely as we move to the next section
        if (group.current) {
            group.current.position.y = scroll.offset * 18
        }
    })

    return (
        <group ref={group}>
            {/* Background Atmosphere - Dark Void but reactive to light */}
            <mesh position={[0, 0, -5]} scale={[20, 10, 1]}>
                <planeGeometry />
                <meshStandardMaterial color="#050202" roughness={0.8} />
            </mesh>

            {/* Placeholder for "Cinematic Portrait" (will be replaced by Image) */}
            {/* Increased intensity for better visibility */}
            <pointLight position={[2, 2, 2]} intensity={50} color="#ff6b00" distance={20} decay={2} />
            <pointLight position={[-3, -2, 3]} intensity={30} color="#00f0ff" distance={20} decay={2} />
            <ambientLight intensity={1} />

            {/* Temporary Placeholder Shape where the person would be */}
            <mesh position={[0, -1, 0]}>
                <capsuleGeometry args={[1, 3, 4, 8]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.8} />
            </mesh>
        </group>
    )
}

export default HeroScene
