import { useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const HeroScene = () => {
    const group = useRef()
    const scroll = useScroll()

    useFrame((state, delta) => {
        // Page 0 behavior
        // Visible when scroll.offset is between 0 and 1/7
        // Adjust opacity based on scroll position
    })

    return (
        <group ref={group}>
            {/* Placeholder 3D Visual (e.g. Floating Sphere related to Cinematic Hero) */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#ffffff" wireframe />
            </mesh>
            <mesh position={[2, 1, -2]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#3b82f6" />
            </mesh>
        </group>
    )
}

export default HeroScene
