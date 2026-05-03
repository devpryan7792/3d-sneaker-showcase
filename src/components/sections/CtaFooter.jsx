import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../store/useStore'

export function CtaFooter() {
  const sectionRef = useRef(null)
  const buttonRef = useRef(null)
  const { variants, activeVariant, addToCart } = useStore()

  useGSAP(() => {
    // Reveal animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        end: 'bottom bottom',
        toggleActions: 'play none none reverse'
      }
    })

    tl.from('.cta-char', {
      y: 200,
      opacity: 0,
      duration: 1.5,
      stagger: 0.05,
      ease: 'expo.out'
    })
    
    tl.from('.cta-price', {
      innerText: 0,
      duration: 2,
      snap: { innerText: 1 },
      ease: 'power3.out'
    }, "-=0.8")

    // Scale up canvas wrapper - Removing scope restriction to target global #canvas-container
    gsap.to('#canvas-container', {
      scale: 5,
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom bottom',
        scrub: true
      }
    })

    // Magnetic button
    const btn = buttonRef.current
    if (btn) {
      const moveBtn = (e) => {
        const rect = btn.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        gsap.to(btn, {
          x: x * 0.4,
          y: y * 0.4,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
      const resetBtn = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
      }
      
      btn.addEventListener('mousemove', moveBtn)
      btn.addEventListener('mouseleave', resetBtn)
      return () => {
        btn.removeEventListener('mousemove', moveBtn)
        btn.removeEventListener('mouseleave', resetBtn)
      }
    }

  }, { scope: sectionRef })

  const textCTA = "THE ICON REBORN".split(" ")

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex flex-col justify-end bg-transparent z-20 overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center pointer-events-none mt-32 pb-40">
        <p className="font-mono text-[10px] tracking-[0.5em] text-[#FF4500] mb-8 uppercase opacity-60">LIMITED QUANTITIES REMAINING</p>
        
        <div className="flex flex-col items-center overflow-hidden pb-4">
          {textCTA.map((word, i) => (
            <div key={i} className="flex overflow-hidden">
              {word.split("").map((char, j) => (
                <h1 key={j} className="cta-char font-outfit text-[12vw] font-black leading-[0.8] tracking-tighter text-white">
                  {char}
                </h1>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6 mt-12 bg-white/5 backdrop-blur-xl px-12 py-6 rounded-full border border-white/10">
          <span className="font-outfit text-xl text-[#FF4500] font-bold">$</span>
          <span className="cta-price font-outfit text-6xl font-black text-white tracking-tighter">180</span>
          <div className="w-px h-8 bg-white/10 mx-4" />
          <button 
            ref={buttonRef}
            onClick={() => addToCart({ index: activeVariant, name: variants[activeVariant].name })}
            data-cursor="BUY NOW"
            className="px-12 py-4 rounded-full bg-white text-black font-outfit font-black text-xs tracking-[0.3em] hover:bg-[#FF4500] hover:text-white transition-all duration-500 pointer-events-auto cursor-pointer shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
          >
            SECURE YOUR PAIR
          </button>
        </div>
      </div>

      <footer className="w-full border-t border-white/5 p-12 grid grid-cols-1 md:grid-cols-4 gap-12 font-inter text-[10px] tracking-widest text-white/30 bg-[#050505]">
        <div className="col-span-1 md:col-span-2">
          <h4 className="text-white font-outfit font-black text-xl mb-6 tracking-tighter">AF1<span className="text-[#FF4500]">.</span></h4>
          <p className="max-w-xs leading-relaxed">Pioneering the streets since 1982. This isn't just a sneaker; it's a movement of self-expression and performance.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="text-white font-bold mb-2">NAVIGATE</h5>
          <a href="#" className="hover:text-[#FF4500] transition-colors">COLLECTIONS</a>
          <a href="#" className="hover:text-[#FF4500] transition-colors">THE LAB</a>
          <a href="#" className="hover:text-[#FF4500] transition-colors">STORE LOCATOR</a>
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="text-white font-bold mb-2">CONNECT</h5>
          <a href="#" className="hover:text-[#FF4500] transition-colors">INSTAGRAM</a>
          <a href="#" className="hover:text-[#FF4500] transition-colors">TWITTER</a>
          <a href="#" className="hover:text-[#FF4500] transition-colors">DISCORD</a>
        </div>
      </footer>
    </section>
  )
}
