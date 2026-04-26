import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function CtaFooter() {
  const sectionRef = useRef(null)
  const buttonRef = useRef(null)

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
      y: 150,
      opacity: 0,
      duration: 1.2,
      stagger: 0.05,
      ease: 'expo.out'
    })
    
    tl.from('.cta-price', {
      innerText: 0,
      duration: 2,
      snap: { innerText: 1 },
      ease: 'power3.out'
    }, "-=0.5")

    // Scale up canvas wrapper
    gsap.to('#canvas-container canvas', {
      scale: 4,
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
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
      const resetBtn = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
      }
      
      btn.addEventListener('mousemove', moveBtn)
      btn.addEventListener('mouseleave', resetBtn)
      return () => {
        btn.removeEventListener('mousemove', moveBtn)
        btn.removeEventListener('mouseleave', resetBtn)
      }
    }

  }, { scope: sectionRef })

  const textCTA = "GET YOURS".split("")

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex flex-col justify-end bg-transparent z-20">
      <div className="flex-1 flex flex-col items-center justify-center pointer-events-none mt-32">
        <div className="flex overflow-hidden pb-4">
          {textCTA.map((char, i) => (
            <h1 key={i} className="cta-char font-bebas text-[15vw] leading-none tracking-tighter text-[#F5F5F0]">
              {char === " " ? "\u00A0" : char}
            </h1>
          ))}
        </div>
        <div className="flex items-end gap-2 mt-4">
          <span className="font-mono text-xl text-[#FF4500] pb-1">$</span>
          <span className="cta-price font-bebas text-6xl text-[#FF4500]">180</span>
        </div>
        
        <button 
          ref={buttonRef}
          className="mt-12 px-12 py-6 rounded-full bg-[#F5F5F0] text-black font-bebas text-3xl tracking-widest hover:bg-[#FF4500] hover:text-white transition-colors duration-300 pointer-events-auto cursor-pointer shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,69,0,0.4)]"
        >
          SHOP NOW
        </button>
      </div>

      <footer className="w-full border-t border-white/10 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-xs tracking-widest text-white/50 bg-[#080808]">
        <div>
          <h4 className="text-white mb-4">NK. SNEAKERS</h4>
          <p>© 2025 All rights reserved.</p>
        </div>
        <div className="flex flex-col gap-2">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Shipping Info</a>
        </div>
        <div className="flex flex-col gap-2 md:text-right">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Twitter X</a>
          <a href="#" className="hover:text-white transition-colors">TikTok</a>
        </div>
      </footer>
    </section>
  )
}
