import { Canvas, useFrame } from '@react-three/fiber'
import { SneakerModel } from './SneakerModel'
import { SceneLights } from './SceneLights'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Glitch } from '@react-three/postprocessing'
import { useStore } from '../../store/useStore'
import * as THREE from 'three'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function CameraRig() {
  const { cameraPos } = useStore()
  
  useFrame((state) => {
    // Dynamic FOV based on scroll speed
    const velocity = Math.abs(ScrollTrigger.getAll()[0]?.getVelocity() || 0)
    const targetFov = 45 + (velocity * 0.005)
    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, Math.min(targetFov, 70), 0.1)
    
    // Smooth camera movement to macro views
    state.camera.position.lerp(cameraPos.current, 0.05)
    state.camera.lookAt(0, 0, 0)
    state.camera.updateProjectionMatrix()
  })
  
  return null
}

export function SneakerCanvas() {
  const { glitch } = useStore()

  return (
    <div id="canvas-container" className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none">
      <Canvas frameloop="always" camera={{ position: [0, 0, 8], fov: 45 }}>
        <CameraRig />
        <SceneLights />
        <SneakerModel />
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <ChromaticAberration offset={[0.001, 0.001]} />
          {glitch && <Glitch delay={[0, 0]} duration={[0.2, 0.2]} strength={[0.3, 0.3]} />}
        </EffectComposer>
      </Canvas>
    </div>
  )
}
