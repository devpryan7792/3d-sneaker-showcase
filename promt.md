# 🚀 Sneaker Product Showcase — Full React App Prompt

## PROJECT OVERVIEW
Build a **viral, Awwwards-level sneaker product showcase website** in React. This is a premium, scroll-driven 3D product page with real-time color variant switching. The vibe is dark luxury streetwear — think Nike SNKRS app meets a Bruno Simon portfolio. Every interaction should feel cinematic and intentional.

---

## TECH STACK (exact packages)

```
React (Vite)
@react-three/fiber        → Three.js React renderer
@react-three/drei         → helpers: useGLTF, Environment, ContactShadows, OrbitControls
three                     → core 3D
gsap                      → animations
@gsap/react               → GSAP React hook (useGSAP)
gsap/ScrollTrigger        → scroll-driven animations (register as plugin)
lenis                     → smooth scroll (wrap app with Lenis ReactLenis)
tailwindcss               → utility styling
```

Install all of the above. Do NOT use framer-motion — use GSAP only for all animations.

---

## DESIGN DIRECTION

**Aesthetic:** Dark luxury editorial. NOT purple gradient AI slop.
- **Background:** Deep matte black `#080808` with very subtle noise texture overlay
- **Accent:** Electric orange `#FF4500` OR raw white `#F5F5F0` depending on section
- **Typography:**
  - Display: `Bebas Neue` (Google Fonts) — for hero numbers, big labels
  - Body: `DM Sans` (Google Fonts) — clean, modern
  - Accent label: `Space Mono` — for technical spec text
- **Cursor:** Custom cursor — a small white circle that grows/morphs on hover over interactive elements
- **Grain overlay:** A subtle SVG/CSS grain texture on top of everything at ~4% opacity

---

## FILE STRUCTURE

```
src/
├── components/
│   ├── Canvas/
│   │   ├── SneakerModel.jsx       ← loads and renders the GLB
│   │   ├── SceneLights.jsx        ← lighting setup
│   │   └── SneakerCanvas.jsx      ← R3F Canvas wrapper (fixed position)
│   ├── sections/
│   │   ├── Hero.jsx
│   │   ├── ScrollRotate.jsx
│   │   ├── VariantPicker.jsx
│   │   ├── HorizontalFeatures.jsx
│   │   └── CtaFooter.jsx
│   ├── ui/
│   │   ├── CustomCursor.jsx
│   │   ├── Navbar.jsx
│   │   └── Loader.jsx
├── hooks/
│   ├── useScrollAnimation.js
│   └── useSneakerColor.js
├── store/
│   └── useStore.js               ← Zustand store for variant state
├── assets/
│   └── sneaker.glb               ← USER WILL REPLACE THIS FILE
├── App.jsx
├── main.jsx
└── index.css
```

---

## CORE ARCHITECTURE — IMPORTANT

The 3D canvas must be **position: fixed, full screen, z-index: 0** at all times. It never scrolls. All HTML sections scroll OVER it. The sneaker model inside the canvas reacts to scroll position via a shared Zustand store or ref — GSAP ScrollTrigger updates a ref value, and the R3F `useFrame` loop reads that ref to animate the shoe.

```jsx
// App.jsx structure
<Lenis root>
  <CustomCursor />
  <Navbar />
  <SneakerCanvas />        {/* fixed, behind everything */}
  <main style={{position: 'relative', zIndex: 1}}>
    <Hero />
    <ScrollRotate />
    <VariantPicker />
    <HorizontalFeatures />
    <CtaFooter />
  </main>
</Lenis>
```

---

## GLB MODEL SETUP

File path: `src/assets/sneaker.glb`

```jsx
// SneakerModel.jsx
import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../../store/useStore'

export function SneakerModel() {
  const { scene } = useGLTF('/sneaker.glb')
  const ref = useRef()
  const { color, rotationY } = useStore()

  // Apply color variant to all meshes
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()
        child.material.color.set(color)
      }
    })
  }, [color, scene])

  // Read scroll-driven rotation from store
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = rotationY.current ?? 0
    }
  })

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={2.5}
      position={[0, -0.5, 0]}
    />
  )
}
```

---

## ZUSTAND STORE

```js
// store/useStore.js
import { create } from 'zustand'

const VARIANTS = [
  { name: 'Triple Black',  color: '#111111', accent: '#FF4500' },
  { name: 'Classic White', color: '#F0EDE8', accent: '#222222' },
  { name: 'Infrared',      color: '#CC2200', accent: '#FF6644' },
]

export const useStore = create((set) => ({
  variants: VARIANTS,
  activeVariant: 0,
  color: VARIANTS[0].color,
  rotationY: { current: 0 },   // mutable ref — not reactive
  shoeY: { current: -0.5 },    // vertical position ref
  setVariant: (index) => set({
    activeVariant: index,
    color: VARIANTS[index].color
  }),
}))
```

---

## SECTION 1 — HERO

**Visual:** Full viewport. Sneaker is visible through the fixed canvas centered-right. Left side has the text.

**Animations (GSAP, trigger on mount):**
- `"FRESH\nDROP"` in Bebas Neue — each word slides up from below with staggered delay
- Shoe floats UP from `y: -200, opacity: 0` to position using `gsap.from` on the store's `shoeY` ref
- Shoe auto-rotates slowly (0.003 rad/frame in useFrame when no scroll is happening)
- Subtle horizontal line and edition label fade in after 0.8s
- A large background number `"01"` in 30vw Bebas Neue, opacity 0.04, positioned bottom-right

**HTML layout:**
```
[LEFT COLUMN - 50%]                    [RIGHT COLUMN - 50% = canvas shows shoe here]
EDITION 2025                           [3D Sneaker]
FRESH
DROP
──────────────
Nike Air Force 1
The icon. Reborn.
[EXPLORE ↓]
```

---

## SECTION 2 — SCROLL ROTATE (Pinned)

This section pins for `300vh` of scroll. During those 300vh, the scroll progress drives the shoe's Y rotation from `0` to `Math.PI * 2` (full 360°).

Additionally, 3 callout labels animate in at specific scroll progress points:
- 25% scroll → `"Air-Sole Unit"` label flies in from left pointing at sole
- 50% scroll → `"Perforated Toe Box"` label flies in from right  
- 75% scroll → `"Premium Leather"` label flies in from left

Each label is an HTML element with a thin line connecting it to approximate shoe coordinates (fake it with absolute positioning).

```js
// ScrollRotate.jsx
useGSAP(() => {
  gsap.to(rotationY, {
    current: Math.PI * 2,
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1.5,
    }
  })
}, [])
```

Section background: stays dark. A large "360°" text fades in behind the shoe as subtitle.

---

## SECTION 3 — VARIANT PICKER

**Visual:** Full viewport. Shoe stays in canvas center. Left side shows variant info. Right side shows 3 color swatches.

**Layout:**
```
[LEFT]                        [RIGHT]
COLORWAY                      ●  Triple Black
──────────                    ●  Classic White  
Triple Black                  ●  Infrared
"Born in the dark."
$180 USD
[ADD TO CART]
```

**Behavior:**
- Clicking a swatch calls `setVariant(index)` from Zustand
- In SneakerModel, the color change triggers a smooth transition: use `gsap.to(material.color, { r, g, b, duration: 0.6 })`
- The shoe does a quick `gsap.to(ref.current.rotation, { y: '+=0.8', duration: 0.4, ease: 'power2.out' })` spin on variant change — a little celebration spin
- The tagline and name text swap with a clip-path reveal animation (`clipPath: 'inset(100% 0 0 0)'` → `'inset(0% 0 0 0)'`)
- Active swatch has a glowing border in the variant's accent color

---

## SECTION 4 — HORIZONTAL FEATURES (Pinned)

Pins for `400vh`. Horizontal scroll panels slide in as user scrolls vertically.

**3 Panels:**

Panel 1 — "BUILT DIFFERENT"
- Left: big Bebas Neue heading + 2 spec lines in Space Mono
- Specs: `UPPER: Full-grain leather / SOLE: Vulcanized rubber`

Panel 2 — "FEELS LIKE NOTHING"
- Centered panel
- Large number `"02"` background
- Short paragraph about comfort in DM Sans

Panel 3 — "MADE TO LAST"
- Right-aligned text
- Year `"1982"` in huge Bebas Neue opacity 0.05 background
- Heritage copy

```js
// HorizontalFeatures.jsx
useGSAP(() => {
  const panels = gsap.utils.toArray('.feature-panel')
  gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: containerRef.current,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => `+=${containerRef.current.offsetWidth}`
    }
  })
}, [])
```

---

## SECTION 5 — CTA / FOOTER

**Visual:** Dark section, shoe is still visible in canvas (center). Large CTA.

**Animations:**
- On scroll into view: shoe rapidly scales up (`scale: 4`) and fades out — like it's flying at the camera
- Simultaneously: `"GET YOURS"` text in massive Bebas Neue slams down from top
- Price appears with a counter animation: `0 → 180` counting up
- A magnetic button effect on `[SHOP NOW]`: on mouse enter/move, button slightly follows cursor (use `mousemove` event + `gsap.to`)
- Footer: 3 columns — Brand, Links, Social. Thin `1px` separator lines. Space Mono font.

---

## LIGHTING SETUP

```jsx
// SceneLights.jsx
export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#4466ff" />
      <pointLight position={[0, -2, 3]} intensity={0.8} color="#FF4500" />
      <Environment preset="city" />
    </>
  )
}
```

Add `ContactShadows` below the shoe:
```jsx
<ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={10} blur={2.5} />
```

---

## CUSTOM CURSOR

```jsx
// CustomCursor.jsx
// A div that follows mouse position via GSAP quickTo for lag effect
// Default: 12px white circle, border 1px white, mix-blend-mode: difference
// On hover of buttons/links: scale to 40px, filled white
// On hover of canvas area: show "DRAG" text inside cursor
```

---

## LOADER

Show a fullscreen black loader that counts `0% → 100%` in Bebas Neue while the GLB loads. Use `useProgress` from `@react-three/drei`. When progress hits 100%, animate loader out with a vertical wipe (clip-path or scaleY to 0).

---

## NAVBAR

Fixed top. Transparent background with backdrop-blur on scroll.
```
[LOGO — "NK."] ————————————————————— [SNEAKERS] [ABOUT] [●] [SHOP]
```
The `[●]` is a color dot showing the active variant color. Updates reactively.

---

## IMPORTANT NOTES FOR THE AI BUILDING THIS

1. The GLB file will be at `public/sneaker.glb` — use `useGLTF('/sneaker.glb')` with a leading slash so it resolves from public directory
2. DO NOT use `<Suspense>` without a proper fallback — use the Loader component
3. ALL ScrollTrigger instances must be created inside `useGSAP` with a cleanup or inside `useEffect` with `return () => ScrollTrigger.kill()`
4. Register plugins at the top of files that use them: `gsap.registerPlugin(ScrollTrigger)`
5. Lenis must be initialized and its `raf` connected to GSAP ticker:
```js
const lenis = new Lenis()
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```
6. The R3F Canvas `frameloop` should be `"always"` so useFrame runs continuously
7. Use `@react-three/drei`'s `Html` component for any 3D-anchored labels if needed
8. Make sure `OrbitControls` is disabled during scroll sections — only enable on the variant picker section for user drag interaction (optional)
9. All sections should have enough `min-height` so the page scrolls correctly and ScrollTrigger has room to work
10. Test that pinned sections don't fight each other — use `ScrollTrigger.refresh()` after fonts load

---

## DELIVERABLE CHECKLIST

- [ ] Vite + React project scaffolded
- [ ] All packages installed
- [ ] Folder structure matches above
- [ ] GLB loads from `/public/sneaker.glb` with Suspense + Loader
- [ ] Canvas is fixed, all sections scroll over it
- [ ] Hero: text animation + shoe float-in
- [ ] Scroll section: pinned 360° rotation with callout labels
- [ ] Variant picker: 3 swatches, color tint change, celebration spin
- [ ] Horizontal scroll: 3 feature panels
- [ ] CTA: shoe explode effect + magnetic button + counter
- [ ] Custom cursor works site-wide
- [ ] Lenis smooth scroll active
- [ ] Responsive enough for 1280px+ screens (desktop-first is fine)