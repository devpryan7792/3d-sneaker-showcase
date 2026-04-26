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

    // Camera transitions for each panel (Tamed to keep shoe centered)
    const camTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top top',
        end: () => `+=${wrapperRef.current.offsetWidth}`,
        scrub: 1,
      }
    })

    camTl.to(cameraPos.current, { x: -2.5, y: 0, z: 6 }, 0)  // Panel 1 view
         .to(cameraPos.current, { x: 0, y: 0, z: 8 }, 0.5)    // Panel 2 view
         .to(cameraPos.current, { x: 2.5, y: 0, z: 6 }, 1)   // Panel 3 view

  }, { scope: containerRef })

  return (
    <div ref={wrapperRef} className="h-screen w-full overflow-hidden bg-transparent">
      <div ref={containerRef} className="flex h-full w-[300vw]">
        
        {/* Panel 1 */}
        <section className="feature-panel w-screen h-full flex items-center justify-start px-[10%] relative">
          <div className="absolute inset-0 bg-[#080808]/80 backdrop-blur-sm -z-10" />
          <div className="z-10 w-1/2">
            <h2 className="font-bebas text-[8vw] leading-none mb-8">BUILT<br/>DIFFERENT</h2>
            <div className="font-mono text-sm text-white/60 space-y-2 border-l border-[#FF4500] pl-6">
              <p>UPPER: Full-grain premium leather</p>
              <p>SOLE: Vulcanized rubber with Air cushioning</p>
            </div>
          </div>
        </section>

        {/* Panel 2 */}
        <section className="feature-panel w-screen h-full flex items-center justify-center relative">
          <div className="absolute inset-0 bg-[#080808]/80 backdrop-blur-sm -z-10" />
          <div className="absolute inset-0 flex items-center justify-center text-[40vw] font-bebas text-white/5 pointer-events-none select-none">
            02
          </div>
          <div className="z-10 text-center max-w-lg px-4">
            <h2 className="font-bebas text-5xl mb-6">FEELS LIKE NOTHING</h2>
            <p className="font-dm text-lg text-white/80 leading-relaxed">
              Step into the future of comfort. The redesigned interior features memory foam padding and an adaptive fit system that molds to your foot.
            </p>
          </div>
        </section>

        {/* Panel 3 */}
        <section className="feature-panel w-screen h-full flex items-center justify-end px-[10%] relative">
          <div className="absolute inset-0 bg-[#080808]/80 backdrop-blur-sm -z-10" />
          <div className="absolute inset-0 flex items-center justify-end pr-[10%] text-[30vw] font-bebas text-white/5 pointer-events-none select-none">
            1982
          </div>
          <div className="z-10 w-1/2 text-right">
            <h2 className="font-bebas text-6xl mb-6">MADE TO LAST</h2>
            <p className="font-dm text-lg text-white/80 leading-relaxed ml-auto max-w-md">
              Heritage meets modern innovation. Every stitch is engineered for durability, ensuring your pair looks better with every wear.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
