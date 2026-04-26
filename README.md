# 3D Sneaker Showcase

![Showcase Preview](https://via.placeholder.com/1200x600/080808/F5F5F0?text=3D+Sneaker+Showcase)

An immersive, Awwwards-winning level 3D product showcase built with React, Three.js, and GSAP. This project demonstrates advanced scroll-driven animations, high-performance 3D rendering, and cinematic camera choreography in a web environment.

## 🚀 Features

- **High-Performance 3D Canvas**: Utilizes `@react-three/fiber` to maintain a fixed 60fps 3D canvas while standard HTML layers scroll over it.
- **Cinematic Camera Choreography**: Scroll-linked macro camera movements that focus on specific product details (sole, upper, heel) during scroll events.
- **Real-Time Material Morphing**: Dynamic colorway selection using `Zustand` to smoothly morph mesh materials and trigger post-processing glitch effects.
- **Physics-Based Scroll**: Butter-smooth scrolling via `Lenis` synced with GSAP's ticker, featuring "elastic" scroll-scrubbing for heavy, premium rotation physics.
- **Interactive Lighting**: A dynamic mouse-tracking rim light (`SpotLight`) that dances across the model's textures based on pointer position.
- **Organic Motion**: Background sine-wave floating and pointer-tracking look-at lerping to make the 3D model feel alive.

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **3D Rendering**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Animation**: [GSAP](https://gsap.com/) + ScrollTrigger
- **Scroll Smoothing**: [Lenis](https://lenis.studiofreight.com/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)

## 📂 Architecture Overview

The application uses a dual-layer architecture:
1. **The WebGL Layer (`SneakerCanvas.jsx`)**: A fixed `z-0` layer that handles all Three.js rendering, post-processing (`Bloom`, `ChromaticAberration`), and camera rigs.
2. **The DOM Layer (`main`)**: A scrollable `z-10` layer containing standard HTML sections (`Hero`, `ScrollRotate`, `HorizontalFeatures`). 

Communication between these layers is handled entirely by a mutable `Zustand` store and GSAP ScrollTriggers, avoiding costly React re-renders and ensuring maximum framerate.

## 💻 Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/3d-sneaker-showcase.git
   cd 3d-sneaker-showcase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## 🎨 Asset Attribution

- 3D Model: Nike Air Max (or equivalent placeholder) compressed via `.glb`.
- Fonts: `Bebas Neue`, `DM Sans`, and `Space Mono` via Google Fonts.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
