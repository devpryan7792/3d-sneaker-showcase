import { useRef, useState } from 'react'
import { useStore } from '../../store/useStore'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function VariantPicker() {
  const { variants, activeVariant, setVariant, cameraPos, shoeY, addToCart } = useStore()
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
      { opacity: 0, y: 20, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }
    )
    
    setVariant(index)
  }

  return (
    <section ref={containerRef} className="relative w-full h-screen flex items-center px-[5%] md:px-[10%]">
      {/* Left Text */}
      <div className="w-1/2 z-10 pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#FF4500] mb-6 uppercase">CUSTOMIZATION HUB</p>
        <div className="w-16 h-[2px] bg-white/10 mb-10" />
        
        <div className="variant-text">
          <h2 className="font-outfit text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">{activeObj.name}</h2>
          <p className="font-inter text-white/40 mb-10 italic text-lg max-w-sm leading-relaxed">
            {activeVariant === 0 && '"A bold statement for the midnight urban explorer."'}
            {activeVariant === 1 && '"Timeless purity that defines a generation."'}
            {activeVariant === 2 && '"Ignite the pavement with crimson intensity."'}
          </p>
          <div className="flex items-center gap-8 mb-12">
            <span className="font-outfit text-3xl font-bold tracking-tight text-[#FF4500]">$180.00</span>
            <div className="w-px h-8 bg-white/10" />
            <span className="font-mono text-[10px] tracking-widest uppercase opacity-40">INSTOCK // LIMITED EDITION</span>
          </div>
          
          <button 
            onClick={() => addToCart({ index: activeVariant, name: activeObj.name })}
            data-cursor="ADD"
            className="px-10 py-5 bg-white text-black font-outfit font-black text-xs tracking-[0.3em] hover:bg-[#FF4500] hover:text-white transition-all duration-500 pointer-events-auto cursor-pointer rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            ADD TO COLLECTION
          </button>
        </div>
      </div>

      {/* Right Swatches */}
      <div className="absolute right-[5%] md:right-[10%] top-1/2 -translate-y-1/2 flex flex-col gap-8 z-10">
        {variants.map((v, i) => (
          <div 
            key={v.name}
            onClick={() => handleVariantChange(i)}
            data-cursor="SELECT"
            className="swatch flex items-center gap-6 cursor-pointer group pointer-events-auto"
          >
            <div className="relative">
              <div 
                className={`w-10 h-10 rounded-full border-2 transition-all duration-500 ${activeVariant === i ? 'border-white scale-125' : 'border-transparent scale-100 group-hover:scale-110'}`}
                style={{ backgroundColor: v.color, boxShadow: activeVariant === i ? `0 0 30px ${v.color}66` : 'none' }}
              />
              {activeVariant === i && (
                <div className="absolute inset-0 rounded-full border border-white animate-ping opacity-20" />
              )}
            </div>
            <span className={`font-mono text-[10px] tracking-[0.3em] uppercase transition-all duration-300 ${activeVariant === i ? 'text-white translate-x-2' : 'text-white/20 group-hover:text-white/60'}`}>
              {v.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
