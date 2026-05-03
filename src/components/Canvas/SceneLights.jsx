import { ContactShadows } from '@react-three/drei'
import { useStore } from '../../store/useStore'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SceneLights() {
  const keyLightRef = useRef()
  const { color } = useStore()

  useFrame((state) => {
    if (keyLightRef.current) {
      // Dynamic key light follows mouse
      keyLightRef.current.position.x = THREE.MathUtils.lerp(keyLightRef.current.position.x, state.pointer.x * 12, 0.1)
      keyLightRef.current.position.y = THREE.MathUtils.lerp(keyLightRef.current.position.y, state.pointer.y * 12, 0.1)
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      
      {/* Key Light */}
      <spotLight 
        ref={keyLightRef} 
        position={[10, 10, 10]} 
        intensity={80} 
        distance={50} 
        angle={0.2} 
        penumbra={1} 
        castShadow
        color="#ffffff"
      />

      {/* Dynamic Rim Light */}
      <directionalLight position={[-10, 5, -10]} intensity={2.5} color={color} />
      
      {/* Neutral Fill Light */}
      <pointLight position={[5, -5, 5]} intensity={20} color="#ffffff" />
      
      <ContactShadows 
        position={[0, -1.4, 0]} 
        opacity={0.6} 
        scale={10} 
        blur={2} 
        far={2}
      />
    </>
  )
}
