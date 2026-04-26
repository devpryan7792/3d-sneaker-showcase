import { useGLTF } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../../store/useStore'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export function SneakerModel() {
  const { scene } = useGLTF('/sneaker.glb')
  const ref = useRef()
  const { color, rotationY, shoeY } = useStore()

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
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()
        const targetColor = new THREE.Color(color)
        gsap.to(child.material.color, {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration: 0.6,
          ease: 'power2.out'
        })
      }
    })
    
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
    <primitive
      ref={ref}
      object={scene}
      scale={2.5}
      position={[0, -0.5, 0]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp}
      onPointerMove={handlePointerMove}
    />
  )
}
