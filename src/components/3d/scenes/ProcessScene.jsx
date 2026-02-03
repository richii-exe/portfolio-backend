import { useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const ProcessScene = () => {
    const group = useRef()
    const scroll = useScroll()

    useFrame(() => {
        // Page 4
        const alpha = scroll.range(4 / 7, 1 / 7)
        group.current.visible = alpha > 0
    })

    return (
        <group ref={group}>
            <mesh position={[-3, 0, 0]}>
                <sphereGeometry args={[0.5]} />
                <meshStandardMaterial color="#f59e0b" />
            </mesh>
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.5]} />
                <meshStandardMaterial color="#f59e0b" />
            </mesh>
            <mesh position={[3, 0, 0]}>
                <sphereGeometry args={[0.5]} />
                <meshStandardMaterial color="#f59e0b" />
            </mesh>
        </group>
    )
}

export default ProcessScene
