import { useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const ServicesScene = () => {
    const group = useRef()
    const scroll = useScroll()

    useFrame(() => {
        // Page 1 logic
        // Only visible around scroll.offset ~ 1/6
        const offset = 1
        // Logic to fade in/out based on scroll
        const alpha = scroll.range(1 / 7, 1 / 7) // visible at page 1
        group.current.visible = alpha > 0
    })

    return (
        <group ref={group} position={[0, -10, 0]}>
            {/* Position Y shifted down, or handled by camera movement */}
            <mesh position={[0, 0, 0]}>
                <torusKnotGeometry args={[1, 0.3, 100, 16]} />
                <meshStandardMaterial color="#8b5cf6" wireframe />
            </mesh>
        </group>
    )
}

export default ServicesScene
