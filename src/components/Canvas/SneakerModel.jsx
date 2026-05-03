import { useGLTF } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../../store/useStore'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Hotspots } from './Hotspots'

export function SneakerModel() {
  const { scene } = useGLTF('/sneaker.glb')
  const ref = useRef()
  const { color, rotationY, shoeY } = useStore()

  // Clone materials once
  const materialsCloned = useRef(false)
  useEffect(() => {
    if (!materialsCloned.current) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const applyShader = (m) => {
            const newMat = m.clone()
            newMat.userData.uTintColor = { value: new THREE.Color(color) }
            
            newMat.onBeforeCompile = (shader) => {
              shader.uniforms.uTintColor = newMat.userData.uTintColor
              shader.fragmentShader = `
                uniform vec3 uTintColor;
                
                vec3 rgb2hsl(vec3 c) {
                  float cMin = min(min(c.r, c.g), c.b);
                  float cMax = max(max(c.r, c.g), c.b);
                  float l = (cMax + cMin) / 2.0;
                  if (cMax == cMin) return vec3(0.0, 0.0, l);
                  float d = cMax - cMin;
                  float s = l > 0.5 ? d / (2.0 - cMax - cMin) : d / (cMax + cMin);
                  vec3 dsc = (vec3(cMax) - c) / d;
                  if (c.r == cMax) dsc.r = dsc.b - dsc.g;
                  else if (c.g == cMax) dsc.r = dsc.r - dsc.b + 2.0;
                  else dsc.r = dsc.g - dsc.r + 4.0;
                  float h = fract(dsc.r / 6.0);
                  return vec3(h, s, l);
                }
                
                float hue2rgb(float p, float q, float t) {
                  if(t < 0.0) t += 1.0;
                  if(t > 1.0) t -= 1.0;
                  if(t < 1.0/6.0) return p + (q - p) * 6.0 * t;
                  if(t < 1.0/2.0) return q;
                  if(t < 2.0/3.0) return p + (q - p) * (2.0/3.0 - t) * 6.0;
                  return p;
                }
                
                vec3 hsl2rgb(vec3 c) {
                  if(c.y == 0.0) return vec3(c.z);
                  float q = c.z < 0.5 ? c.z * (1.0 + c.y) : c.z + c.y - c.z * c.y;
                  float p = 2.0 * c.z - q;
                  return vec3(hue2rgb(p, q, c.x + 1.0/3.0), hue2rgb(p, q, c.x), hue2rgb(p, q, c.x - 1.0/3.0));
                }
                
                ${shader.fragmentShader}
              `.replace(
                `#include <map_fragment>`,
                `
                #ifdef USE_MAP
                  vec4 texelColor = texture2D( map, vMapUv );
                  vec3 texelHsl = rgb2hsl(texelColor.rgb);
                  vec3 targetHsl = rgb2hsl(uTintColor);
                  
                  // Only hue-shift the saturated parts (e.g. the red accents)
                  float blend = smoothstep(0.1, 0.4, texelHsl.y); 
                  
                  // Scale the lightness so white variants get brightened and dark variants stay dark
                  // The original red texture has an average lightness around 0.25
                  float adjustedLightness = clamp(texelHsl.z * (targetHsl.z / 0.25), 0.0, 1.0);
                  
                  vec3 finalHsl = vec3(
                    mix(texelHsl.x, targetHsl.x, blend),
                    mix(texelHsl.y, targetHsl.y, blend), 
                    mix(texelHsl.z, adjustedLightness, blend) // Blend the lightness!
                  );
                  
                  diffuseColor *= vec4(hsl2rgb(finalHsl), texelColor.a);
                #else
                  diffuseColor *= vec4(1.0);
                #endif
                `
              )
            }
            return newMat
          }

          if (Array.isArray(child.material)) {
            child.material = child.material.map(applyShader)
          } else {
            child.material = applyShader(child.material)
          }
        }
      })
      materialsCloned.current = true
    }
  }, [scene])

  useGSAP(() => {
    // Initial float up animation
    if (ref.current) {
      gsap.from(shoeY, {
        current: -200,
        duration: 2,
        ease: 'power3.out'
      })
      gsap.from(ref.current.position, {
        y: -5,
        duration: 2,
        ease: 'power3.out'
      })
    }
  }, [])

  useEffect(() => {
    if (materialsCloned.current) {
      const targetColor = new THREE.Color(color)
      
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          
          mats.forEach(mat => {
            if (mat.userData && mat.userData.uTintColor) {
              gsap.to(mat.userData.uTintColor.value, {
                r: targetColor.r,
                g: targetColor.g,
                b: targetColor.b,
                duration: 0.6,
                ease: 'power2.out'
              })
            }
          })
        }
      })
    }
    
    // Celebration spin
    if (ref.current) {
      gsap.to(ref.current.rotation, {
        y: '+=0.8',
        duration: 0.4,
        ease: 'power2.out'
      })
    }
  }, [color, scene])

  const dragRotation = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })

  const localRotationY = useRef(0)

  useFrame((state) => {
    if (ref.current) {
      // 1. Calculate Auto-rotation (always running in the background)
      localRotationY.current += 0.003
      
      // 2. Calculate the Scroll-Driven Target
      // If rotationY.current is 0 (outside scroll area), we use localRotationY
      // If it's active, we lerp localRotationY towards the store's rotationY.current
      const scrollTargetY = rotationY.current === 0 ? localRotationY.current : rotationY.current
      
      let finalTargetX = 0
      let finalTargetY = scrollTargetY

      if (isDragging.current) {
        // 3. Manual Drag Override
        finalTargetX = dragRotation.current.x
        finalTargetY = dragRotation.current.y
        // Sync localRotationY so we don't jump when letting go
        localRotationY.current = ref.current.rotation.y
      } else {
        // 4. Scroller / Auto-rotate + Mouse tilt
        finalTargetX = -(state.pointer.y * 0.2)
        finalTargetY = scrollTargetY + (state.pointer.x * 0.3)
        
        dragRotation.current.y = ref.current.rotation.y
        dragRotation.current.x = ref.current.rotation.x
      }
      
      // 5. THE BLENDING: Graceful catch-up (using a smaller lerp factor for handover)
      const lerpFactor = rotationY.current !== 0 ? 0.04 : 0.08
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, finalTargetY, lerpFactor)
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, finalTargetX, 0.08)
      
      // 5. Breathing motion
      const floatY = Math.sin(state.clock.elapsedTime * 1.5) * 0.15
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, shoeY.current + floatY, 0.1)
    }
  })

  const handlePointerDown = (e) => {
    e.stopPropagation()
    isDragging.current = true
    lastPointer.current = { x: e.clientX, y: e.clientY }
    // Add a visual cue
    document.body.style.cursor = 'grabbing'
  }

  const handlePointerUp = () => {
    isDragging.current = false
    document.body.style.cursor = 'none'
  }

  const handlePointerMove = (e) => {
    if (isDragging.current) {
      const deltaX = e.clientX - lastPointer.current.x
      const deltaY = e.clientY - lastPointer.current.y
      
      dragRotation.current.y += deltaX * 0.01
      dragRotation.current.x += deltaY * 0.01
      
      lastPointer.current = { x: e.clientX, y: e.clientY }
    }
  }

  return (
    <group ref={ref}>
      <primitive
        object={scene}
        scale={2.5}
        position={[0, -0.5, 0]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerMove={handlePointerMove}
      />
      <Hotspots />
    </group>
  )
}
