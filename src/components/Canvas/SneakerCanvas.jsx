import { Canvas, useFrame } from '@react-three/fiber'
import { SneakerModel } from './SneakerModel'
import { SceneLights } from './SceneLights'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Glitch, Scanline, Noise, DepthOfField } from '@react-three/postprocessing'
import { Environment, Float, PerspectiveCamera } from '@react-three/drei'
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
      <Canvas frameloop="always" dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <CameraRig />
        <SceneLights />
        
        <Environment preset="city" />
        
        <Float 
          speed={1.5} 
          rotationIntensity={0.5} 
          floatIntensity={0.5} 
          floatingRange={[-0.1, 0.1]}
        >
          <SneakerModel />
        </Float>
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.2} radius={0.4} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <ChromaticAberration offset={[0.001, 0.001]} />
          <Noise opacity={0.05} />
          <DepthOfField 
            focusDistance={0} 
            focalLength={0.02} 
            bokehScale={2} 
            height={480} 
          />
          <Scanline opacity={0.02} />
          {glitch && <Glitch delay={[0, 0]} duration={[0.2, 0.2]} strength={[0.3, 0.3]} mode={THREE.NormalBlending} />}
        </EffectComposer>
      </Canvas>
    </div>
  )
}
