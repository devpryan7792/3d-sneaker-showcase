import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import { CustomCursor } from './components/ui/CustomCursor'
import { Navbar } from './components/ui/Navbar'
import { SneakerCanvas } from './components/Canvas/SneakerCanvas'
import { Hero } from './components/sections/Hero'
import { ScrollRotate } from './components/sections/ScrollRotate'
import { VariantPicker } from './components/sections/VariantPicker'
import { HorizontalFeatures } from './components/sections/HorizontalFeatures'
import { CtaFooter } from './components/sections/CtaFooter'
import { Loader } from './components/ui/Loader'
import { AuthModal } from './components/ui/AuthModal'
import { CartDrawer } from './components/ui/CartDrawer'
import { insforge } from './utils/insforge'
import { useStore } from './store/useStore'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function App() {
  const lenis = useLenis(ScrollTrigger.update)
  const { setUser, fetchCart } = useStore()

  useEffect(() => {
    // Lenis / GSAP sync
    if (lenis) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)
    }

    // InsForge Auth Initialization
    insforge.auth.getCurrentUser().then(({ data, error }) => {
      if (data?.user) {
        setUser(data.user, null)
        fetchCart() // Load user's cart from DB
      } else {
        setUser(null, null)
      }
    })

    return () => {
      gsap.ticker.remove((time) => lenis?.raf(time * 1000))
    }
  }, [lenis, setUser, fetchCart])

  useGSAP(() => {
    gsap.to('#progress-bar', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    })
  })

  return (
    <>
      <Loader />
      <div className="scroll-progress" id="progress-bar" />
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
        <div className="grain-overlay" />
        <CustomCursor />
        <Navbar />
        <AuthModal />
        <CartDrawer />
        
        <SneakerCanvas />
        
        <main className="relative z-10 w-full overflow-hidden">
          <Hero />
          <ScrollRotate />
          <VariantPicker />
          <HorizontalFeatures />
          <CtaFooter />
        </main>
      </ReactLenis>
    </>
  )
}

export default App
