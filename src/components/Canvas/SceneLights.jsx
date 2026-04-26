import { Environment, ContactShadows } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SceneLights() {
  const rimLightRef = useRef()

  useFrame((state) => {
    if (rimLightRef.current) {
      // Make rim light move opposite to mouse for sharp edge lighting
      rimLightRef.current.position.x = -state.pointer.x * 10
      rimLightRef.current.position.y = -state.pointer.y * 10
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#4466ff" />
      <spotLight 
        ref={rimLightRef} 
        position={[0, 0, 5]} 
        intensity={2} 
        distance={20} 
        angle={0.5} 
        penumbra={1} 
        color="#F5F5F0"
      />
      <Environment preset="city" />
      <ContactShadows position={[0, -1.4, 0]} opacity={0.4} scale={10} blur={2.8} />
    </>
  )
}
