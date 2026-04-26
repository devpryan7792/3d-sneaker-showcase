import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power3' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power3' })

    const move = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const onHoverEnter = () => {
      gsap.to(cursor, { scale: 3, backgroundColor: '#fff', mixBlendMode: 'difference', duration: 0.3 })
    }
    const onHoverLeave = () => {
      gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', mixBlendMode: 'normal', duration: 0.3 })
    }

    window.addEventListener('mousemove', move)

    // Select interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .swatch')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onHoverEnter)
      el.addEventListener('mouseleave', onHoverLeave)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onHoverEnter)
        el.removeEventListener('mouseleave', onHoverLeave)
      })
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 rounded-full border border-white z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[4px] font-bold text-black"
    />
  )
}
