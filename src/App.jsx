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

gsap.registerPlugin(ScrollTrigger, useGSAP)

function App() {
  const lenis = useLenis(ScrollTrigger.update)

  useEffect(() => {
    if (lenis) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)
    }
    return () => {
      gsap.ticker.remove((time) => lenis?.raf(time * 1000))
    }
  }, [lenis])

  return (
    <>
      <Loader />
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
        <div className="grain-overlay" />
        <CustomCursor />
        <Navbar />
        
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
