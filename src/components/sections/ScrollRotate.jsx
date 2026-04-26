import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../store/useStore'

export function ScrollRotate() {
  const sectionRef = useRef(null)
  const { rotationY, cameraPos } = useStore()

  useGSAP(() => {
    // 1. Seamless Handover: Sync rotationY to current value on enter
    const syncRotation = () => {
      // We don't want a jump, so we just let the lerp in SneakerModel 
      // handle the transition to the new 0-point.
    }

    // Drive rotationY with "Lazy" scrub for weight
    gsap.to(rotationY, {
      current: rotationY.current + Math.PI * 2, // Rotate relative to current pos
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom', // Start syncing early
        end: '+=300%',
        pin: true,
        scrub: 3, // Increased for "Elastic" feel
        onEnter: syncRotation
      }
    })

    // Camera Macro Choreography (Tamed to keep shoe in focus)
    const camTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300%',
        scrub: 1,
      }
    })

    // Keep Y closer to 0 so it doesn't go into the header
    camTl.to(cameraPos.current, { x: 2, y: -0.2, z: 5.5 }, 0.5) // Side/Heel view
         .to(cameraPos.current, { x: -2, y: 0.2, z: 5.5 }, 1.5)  // Toe view
         .to(cameraPos.current, { x: 0, y: 0, z: 8 }, 2.5)   // Back to default

    // Labels animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300%',
        scrub: 1,
      }
    })

    tl.to('.label-1', { opacity: 1, x: 0, duration: 1 }, 0.5)
      .to('.label-1', { opacity: 0, x: -50, duration: 1 }, 1.5)
      .to('.label-2', { opacity: 1, x: 0, duration: 1 }, 1.5)
      .to('.label-2', { opacity: 0, x: 50, duration: 1 }, 2.5)
      .to('.label-3', { opacity: 1, x: 0, duration: 1 }, 2.5)
      .to('.label-3', { opacity: 0, x: -50, duration: 1 }, 3.5)

  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[20vw] font-bebas text-white/5 opacity-50">360°</h2>
      </div>

      {/* Callouts */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Label 1 */}
        <div className="label-1 opacity-0 -translate-x-10 absolute top-[60%] left-[10%] md:left-[20%] flex items-center gap-4">
          <div className="w-16 md:w-32 h-px bg-white/40" />
          <div className="font-mono text-xs md:text-sm tracking-widest bg-black/50 px-4 py-2 border border-white/10 backdrop-blur-sm">
            Air-Sole Unit
          </div>
        </div>

        {/* Label 2 */}
        <div className="label-2 opacity-0 translate-x-10 absolute top-[40%] right-[10%] md:right-[20%] flex items-center gap-4 flex-row-reverse">
          <div className="w-16 md:w-32 h-px bg-white/40" />
          <div className="font-mono text-xs md:text-sm tracking-widest bg-black/50 px-4 py-2 border border-white/10 backdrop-blur-sm">
            Perforated Toe Box
          </div>
        </div>

        {/* Label 3 */}
        <div className="label-3 opacity-0 -translate-x-10 absolute top-[30%] left-[10%] md:left-[25%] flex items-center gap-4">
          <div className="w-16 md:w-32 h-px bg-white/40" />
          <div className="font-mono text-xs md:text-sm tracking-widest bg-black/50 px-4 py-2 border border-white/10 backdrop-blur-sm">
            Premium Leather
          </div>
        </div>
      </div>
    </section>
  )
}
