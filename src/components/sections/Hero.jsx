import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useStore } from '../../store/useStore'

export function Hero() {
  const containerRef = useRef(null)
  const { cameraPos, shoeY } = useStore()

  useGSAP(() => {
    // Reset camera to default
    gsap.to(cameraPos.current, { x: 0, y: 0, z: 8, duration: 1.5, ease: 'power3.inOut' })
    gsap.to(shoeY, { current: -0.5, duration: 1.5, ease: 'power3.inOut' })

    gsap.from('.hero-char', {
      y: 150,
      opacity: 0,
      duration: 1.2,
      stagger: 0.05,
      ease: 'expo.out',
      delay: 0.5
    })
    
    gsap.from('.hero-line', {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 1,
      delay: 1.2,
      ease: 'power3.out'
    })
    
    gsap.from('.hero-fade', {
      opacity: 0,
      y: 20,
      duration: 1,
      delay: 1.4,
      ease: 'power2.out'
    })
  }, { scope: containerRef })

  const text1 = "FRESH".split("")
  const text2 = "DROP".split("")

  return (
    <section ref={containerRef} className="relative w-full h-screen flex items-center px-[5%] md:px-[10%]">
      {/* Background Number */}
      <div className="absolute bottom-10 right-10 text-[30vw] font-bebas leading-none text-white/5 select-none pointer-events-none">
        01
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-start z-10 pointer-events-none">
        <p className="hero-fade font-mono text-sm tracking-[0.3em] text-[#FF4500] mb-6">EDITION 2025</p>
        
        <div className="overflow-hidden leading-[0.8] mb-8">
          <div className="flex">
            {text1.map((char, i) => <h1 key={`w1-${i}`} className="hero-char font-bebas text-[12vw] md:text-[8vw] block">{char}</h1>)}
          </div>
          <div className="flex">
            {text2.map((char, i) => <h1 key={`w2-${i}`} className="hero-char font-bebas text-[12vw] md:text-[8vw] block">{char}</h1>)}
          </div>
        </div>

        <div className="hero-line w-24 h-px bg-white/30 mb-8" />
        
        <div className="hero-fade pointer-events-auto">
          <h3 className="text-xl md:text-2xl font-bold mb-2">Nike Air Force 1</h3>
          <p className="text-white/60 max-w-sm mb-8 leading-relaxed font-mono text-sm">
            The icon. Reborn. Engineered for the streets with next-gen comfort.
          </p>
          <a href="#explore" className="font-mono text-xs tracking-widest border-b border-[#FF4500] text-[#FF4500] pb-1 hover:text-white hover:border-white transition-colors cursor-pointer">
            EXPLORE ↓
          </a>
        </div>
      </div>
    </section>
  )
}
