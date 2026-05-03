import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../store/useStore'

export function HorizontalFeatures() {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const { cameraPos } = useStore()

  useGSAP(() => {
    const panels = gsap.utils.toArray('.feature-panel')
    
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapperRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${wrapperRef.current.offsetWidth}`
      }
    })

    // Camera transitions for each panel
    const camTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top top',
        end: () => `+=${wrapperRef.current.offsetWidth}`,
        scrub: 1,
      }
    })

    camTl.to(cameraPos.current, { x: -3, y: 0.2, z: 6 }, 0)  // Panel 1 view
         .to(cameraPos.current, { x: 0, y: 0, z: 8 }, 0.5)    // Panel 2 view
         .to(cameraPos.current, { x: 3, y: -0.2, z: 6 }, 1)   // Panel 3 view

  }, { scope: containerRef })

  return (
    <div ref={wrapperRef} className="h-screen w-full overflow-hidden bg-transparent">
      <div ref={containerRef} className="flex h-full w-[300vw]">
        
        {/* Panel 1 */}
        <section className="feature-panel w-screen h-full flex items-center justify-start px-[10%] relative" data-cursor="BUILD">
          <div className="absolute inset-0 bg-[#050505]/40 backdrop-blur-sm -z-10" />
          <div className="z-10 w-full md:w-1/2">
            <p className="font-mono text-[10px] tracking-[0.4em] text-[#FF4500] mb-6 uppercase">ENGINEERING</p>
            <h2 className="font-outfit text-[8vw] font-black leading-[0.85] mb-10 tracking-tighter">BUILT<br/><span className="text-white/20">DIFFERENT.</span></h2>
            <div className="font-inter text-sm text-white/50 space-y-4 border-l-2 border-[#FF4500] pl-8 max-w-sm">
              <p><strong className="text-white">UPPER:</strong> Hand-selected full-grain premium leather for unmatched feel and durability.</p>
              <p><strong className="text-white">SOLE:</strong> High-performance vulcanized rubber paired with our signature Air cushioning system.</p>
            </div>
          </div>
        </section>

        {/* Panel 2 */}
        <section className="feature-panel w-screen h-full flex items-center justify-center relative" data-cursor="COMFORT">
          <div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-md -z-10" />
          <div className="absolute inset-0 flex items-center justify-center text-[40vw] font-outfit font-black text-white/[0.01] pointer-events-none select-none">
            02
          </div>
          <div className="z-10 text-center max-w-2xl px-6">
            <h2 className="font-outfit text-6xl md:text-8xl font-black mb-8 tracking-tighter">CLOUDWALK.</h2>
            <p className="font-inter text-lg md:text-xl text-white/60 leading-relaxed font-medium">
              Step into the future. The redesigned interior features adaptive memory foam and a seamless liner that eliminates friction, making every step feel weightless.
            </p>
          </div>
        </section>

        {/* Panel 3 */}
        <section className="feature-panel w-screen h-full flex items-center justify-end px-[10%] relative" data-cursor="LEGACY">
          <div className="absolute inset-0 bg-[#050505]/40 backdrop-blur-sm -z-10" />
          <div className="absolute inset-0 flex items-center justify-end pr-[10%] text-[30vw] font-outfit font-black text-white/[0.01] pointer-events-none select-none">
            1982
          </div>
          <div className="z-10 w-full md:w-1/2 text-right">
            <p className="font-mono text-[10px] tracking-[0.4em] text-[#FF4500] mb-6 uppercase">HERITAGE</p>
            <h2 className="font-outfit text-6xl md:text-8xl font-black mb-8 tracking-tighter">MADE TO <br/> <span className="text-white/20">ENDURE.</span></h2>
            <p className="font-inter text-lg text-white/50 leading-relaxed ml-auto max-w-md">
              A design that transcends time. Every stitch is a tribute to our basketball roots, refined with modern innovation to ensure your pair lasts a lifetime.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
