import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useStore } from '../../store/useStore'

export function Hero() {
  const containerRef = useRef(null)
  const { cameraPos, shoeY } = useStore()

  useGSAP(() => {
    const tl = gsap.timeline()

    // Reset camera and shoe
    gsap.to(cameraPos.current, { x: 0, y: 0, z: 8, duration: 2, ease: 'expo.inOut' })
    gsap.to(shoeY, { current: -0.5, duration: 2, ease: 'expo.inOut' })

    // Character Reveal
    tl.from('.hero-char', {
      y: 150,
      scaleY: 2,
      rotateX: -110,
      opacity: 0,
      duration: 1.8,
      stagger: 0.05,
      ease: 'expo.out',
    }, 0.5)
    
    // Line & Secondary Text
    tl.from('.hero-line', {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 1.5,
      ease: 'power4.inOut'
    }, 1.2)
    
    tl.from('.hero-fade', {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)',
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.1
    }, 1.4)

    // Parallax for background
    gsap.to('.hero-bg-text', {
      y: -100,
      scale: 1.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })
  }, { scope: containerRef })

  const text1 = "AIR".split("")
  const text2 = "FORCE".split("")

  return (
    <section ref={containerRef} className="relative w-full h-screen flex items-center px-[5%] md:px-[10%] overflow-hidden">
      {/* Background Number */}
      <div className="hero-bg-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] font-outfit font-black leading-none text-white/[0.02] select-none pointer-events-none">
        AF1
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-start z-10 pointer-events-none">
        <p className="hero-fade font-mono text-[10px] tracking-[0.5em] text-[#FF4500] mb-8 uppercase opacity-80">ICONIC HERITAGE // 2025</p>
        
        <div className="overflow-hidden leading-[0.75] mb-10 perspective-[1000px]">
          <div className="flex">
            {text1.map((char, i) => <h1 key={`w1-${i}`} className="hero-char font-outfit text-[14vw] md:text-[10vw] font-black inline-block">{char}</h1>)}
          </div>
          <div className="flex">
            {text2.map((char, i) => <h1 key={`w2-${i}`} className="hero-char font-outfit text-[14vw] md:text-[10vw] font-black inline-block">{char}</h1>)}
          </div>
        </div>

        <div className="hero-line w-32 h-[2px] bg-[#FF4500] mb-10" />
        
        <div className="hero-fade pointer-events-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">NIKE AIR FORCE 1</h3>
          <p className="text-white/40 max-w-sm mb-10 leading-relaxed font-inter text-sm font-medium">
            The legendary silhouette, reimagined for the next generation of creators. Performance meets unparalleled style.
          </p>
          <a 
            href="#explore" 
            data-cursor="EXPLORE"
            className="group flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-white hover:text-[#FF4500] transition-colors duration-300"
          >
            <span>DISCOVER THE DETAILS</span>
            <div className="w-8 h-px bg-white/20 group-hover:bg-[#FF4500] group-hover:w-12 transition-all duration-300" />
          </a>
        </div>
      </div>
    </section>
  )
}
