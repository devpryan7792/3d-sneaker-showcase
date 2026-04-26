import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import gsap from 'gsap'

export function Loader() {
  const { progress } = useProgress()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        gsap.to('.loader-container', {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => setHidden(true)
        })
      }, 500)
    }
  }, [progress])

  if (hidden) return null;

  return (
    <div className="loader-container fixed inset-0 z-[100] flex items-center justify-center bg-[#080808] text-[#F5F5F0]">
      <div className="text-center">
        <h1 className="font-bebas text-8xl md:text-[10vw] leading-none tracking-tight">
          {Math.round(progress)}%
        </h1>
        <p className="font-mono text-sm tracking-widest uppercase mt-4 text-[#FF4500]">
          Loading Experience
        </p>
      </div>
    </div>
  )
}
