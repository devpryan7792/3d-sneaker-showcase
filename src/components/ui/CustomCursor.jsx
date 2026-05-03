import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export function CustomCursor() {
  const cursorRef = useRef(null)
  const [text, setText] = useState('')

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power3' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power3' })

    const move = (e) => {
      let x = e.clientX
      let y = e.clientY

      // Magnetic logic
      const magneticElements = document.querySelectorAll('[data-cursor]')
      magneticElements.forEach(el => {
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distanceX = Math.abs(centerX - e.clientX)
        const distanceY = Math.abs(centerY - e.clientY)

        if (distanceX < 100 && distanceY < 100) {
          x = centerX + (e.clientX - centerX) * 0.4
          y = centerY + (e.clientY - centerY) * 0.4
        }
      })

      xTo(x)
      yTo(y)
    }

    const onHoverEnter = (e) => {
      const el = e.currentTarget
      const content = el.getAttribute('data-cursor') || ''
      setText(content)
      gsap.to(cursor, { 
        scale: content ? 5 : 2, 
        backgroundColor: content ? '#ff4500' : '#fff',
        mixBlendMode: content ? 'normal' : 'difference',
        borderColor: content ? 'transparent' : '#fff',
        duration: 0.4,
        ease: 'power3.out'
      })
    }
    
    const onHoverLeave = () => {
      setText('')
      gsap.to(cursor, { 
        scale: 1, 
        backgroundColor: 'transparent', 
        mixBlendMode: 'normal', 
        borderColor: '#fff',
        duration: 0.3 
      })
    }

    window.addEventListener('mousemove', move)

    // Select interactive elements
    const updateListeners = () => {
      const interactiveElements = document.querySelectorAll('button, a, .swatch, #canvas-container')
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', onHoverEnter)
        el.addEventListener('mouseleave', onHoverLeave)
      })
    }

    updateListeners()
    
    // Observer for dynamic elements
    const observer = new MutationObserver(updateListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 rounded-full border border-white z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[3px] font-bold text-white uppercase tracking-tighter"
    >
      {text}
    </div>
  )
}
