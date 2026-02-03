import { useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const TestimonialsScene = () => {
    const group = useRef()
    const scroll = useScroll()

    useFrame(() => {
        // Page 5
        const alpha = scroll.range(5 / 7, 1 / 7)
        group.current.visible = alpha > 0
    })

    return (
        <group ref={group}>
            <mesh position={[0, 1, 0]}>
                <coneGeometry args={[1, 2, 4]} />
                <meshStandardMaterial color="#ec4899" wireframe />
            </mesh>
        </group>
    )
}

export default TestimonialsScene
