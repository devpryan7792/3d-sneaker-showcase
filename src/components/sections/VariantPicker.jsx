import { useRef, useState } from 'react'
import { useStore } from '../../store/useStore'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function VariantPicker() {
  const { variants, activeVariant, setVariant, cameraPos, shoeY } = useStore()
  const activeObj = variants[activeVariant]
  const containerRef = useRef(null)

  useGSAP(() => {
    // Center camera and shoe when this section is reached
    gsap.to(cameraPos.current, {
      x: 0,
      y: 0,
      z: 8,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'top center',
        scrub: 1,
      }
    })

    gsap.to(shoeY, {
      current: -0.5,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'top center',
        scrub: 1,
      }
    })
  }, { scope: containerRef })

  const handleVariantChange = (index) => {
    if (index === activeVariant) return
    
    // Trigger Glitch effect
    useStore.setState({ glitch: true })
    setTimeout(() => useStore.setState({ glitch: false }), 200)

    // Animate text out and in
    gsap.fromTo('.variant-text', 
      { clipPath: 'inset(100% 0 0 0)' },
      { clipPath: 'inset(0% 0 0 0)', duration: 0.6, ease: 'power3.out' }
    )
    
    setVariant(index)
  }

  return (
    <section ref={containerRef} className="relative w-full h-screen flex items-center px-[5%] md:px-[10%]">
      {/* Left Text */}
      <div className="w-1/2 z-10 pointer-events-none">
        <p className="font-mono text-sm tracking-widest text-[#FF4500] mb-4">COLORWAY</p>
        <div className="w-12 h-px bg-white/30 mb-8" />
        
        <div className="variant-text">
          <h2 className="font-bebas text-5xl md:text-7xl mb-4">{activeObj.name}</h2>
          <p className="font-mono text-white/60 mb-6 italic">
            {activeVariant === 0 && '"Born in the dark."'}
            {activeVariant === 1 && '"Pure. Clean. Classic."'}
            {activeVariant === 2 && '"Heat on your feet."'}
          </p>
          <p className="font-mono text-xl mb-8">$180 USD</p>
          <button className="px-8 py-3 bg-white text-black font-bold font-mono text-sm tracking-widest hover:bg-[#FF4500] hover:text-white transition-colors pointer-events-auto cursor-pointer">
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Right Swatches */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 flex flex-col gap-6 z-10">
        {variants.map((v, i) => (
          <div 
            key={v.name}
            onClick={() => handleVariantChange(i)}
            className="swatch flex items-center gap-4 cursor-pointer group"
          >
            <div 
              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${activeVariant === i ? 'border-white scale-125' : 'border-transparent scale-100'}`}
              style={{ backgroundColor: v.color, boxShadow: activeVariant === i ? `0 0 15px ${v.accent}` : 'none' }}
            />
            <span className={`font-mono text-sm tracking-widest transition-colors ${activeVariant === i ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`}>
              {v.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
