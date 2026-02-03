import { useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const ProjectsScene = () => {
    const group = useRef()
    const scroll = useScroll()

    useFrame(() => {
        const alpha = scroll.range(2 / 7, 1 / 7)
        group.current.visible = alpha > 0
    })

    return (
        <group ref={group}>
            <mesh position={[-2, 0, 0]}>
                <boxGeometry args={[2, 3, 0.1]} />
                <meshStandardMaterial color="#10b981" />
            </mesh>
            <mesh position={[2, 0, 0]}>
                <boxGeometry args={[2, 3, 0.1]} />
                <meshStandardMaterial color="#10b981" />
            </mesh>
        </group>
    )
}

export default ProjectsScene
