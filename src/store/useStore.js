import { create } from 'zustand'
import * as THREE from 'three'

const VARIANTS = [
  { name: 'Triple Black',  color: '#111111', accent: '#FF4500' },
  { name: 'Classic White', color: '#F0EDE8', accent: '#222222' },
  { name: 'Infrared',      color: '#CC2200', accent: '#FF6644' },
]

export const useStore = create((set) => ({
  variants: VARIANTS,
  activeVariant: 0,
  color: VARIANTS[0].color,
  glitch: false,
  rotationY: { current: 0 },
  shoeY: { current: -0.5 },
  cameraPos: { current: new THREE.Vector3(0, 0, 8) },
  fov: { current: 45 },
  setVariant: (index) => set({
    activeVariant: index,
    color: VARIANTS[index].color
  }),
}))
