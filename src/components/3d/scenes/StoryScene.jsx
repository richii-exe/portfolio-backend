import { useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const StoryScene = () => {
    const group = useRef()
    const scroll = useScroll()

    useFrame(() => {
        // Page 3
        const alpha = scroll.range(3 / 7, 1 / 7)
        group.current.visible = alpha > 0
    })

    return (
        <group ref={group}>
            <mesh position={[0, 0, 0]}>
                <octahedronGeometry args={[1.5]} />
                <meshStandardMaterial color="#ef4444" wireframe />
            </mesh>
        </group>
    )
}

export default StoryScene
