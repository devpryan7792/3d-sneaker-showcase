import { Html } from '@react-three/drei'
import { useState } from 'react'
import { useStore } from '../../store/useStore'
import gsap from 'gsap'

const HOTSPOTS = [
  {
    id: 'air-sole',
    position: [0.5, -0.6, 0.8],
    title: 'AIR-SOLE UNIT',
    description: 'Revolutionary pressurized air that provides lightweight cushioning.',
  },
  {
    id: 'leather',
    position: [-0.8, 0.4, 0.5],
    title: 'PREMIUM LEATHER',
    description: 'Selected top-grain leather for maximum durability and style.',
  },
  {
    id: 'traction',
    position: [0.2, -1.2, -0.5],
    title: 'PIVOT POINT',
    description: 'Classic rubber outsole with pivot circles for traction.',
  }
]

export function Hotspots() {
  const [active, setActive] = useState(null)

  const toggleHotspot = (id) => {
    setActive(active === id ? null : id)
  }

  return (
    <group>
      {HOTSPOTS.map((h) => (
        <Html
          key={h.id}
          position={h.position}
          distanceFactor={10}
          occlude
          transform
          style={{ transition: 'all 0.2s', opacity: active && active !== h.id ? 0.2 : 1 }}
        >
          <div className="relative flex items-center justify-center">
            {/* Pulsing Marker */}
            <button
              onClick={() => toggleHotspot(h.id)}
              className="group relative w-6 h-6 flex items-center justify-center pointer-events-auto cursor-pointer"
            >
              <div className="absolute inset-0 rounded-full bg-white/20 scale-150 animate-ping" />
              <div className="w-3 h-3 rounded-full bg-white border-2 border-[#ff4500] group-hover:scale-125 transition-transform" />
            </button>

            {/* Info Box */}
            {active === h.id && (
              <div 
                className="absolute left-8 top-0 w-48 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-lg pointer-events-auto"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <h4 className="font-outfit text-xs font-bold text-[#ff4500] mb-1">{h.title}</h4>
                <p className="font-inter text-[10px] leading-relaxed text-white/60">{h.description}</p>
              </div>
            )}
          </div>
        </Html>
      ))}
    </group>
  )
}
