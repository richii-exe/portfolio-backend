import { useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const ContactScene = () => {
    const group = useRef()
    const scroll = useScroll()

    useFrame(() => {
        // Page 6 (Last page)
        const alpha = scroll.range(6 / 7, 1 / 7)
        group.current.visible = alpha > 0
    })

    return (
        <group ref={group}>
            <mesh position={[0, 0, 0]}>
                <dodecahedronGeometry args={[1.5]} />
                <meshStandardMaterial color="#6366f1" />
            </mesh>
        </group>
    )
}

export default ContactScene
