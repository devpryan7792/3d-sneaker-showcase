import { useStore } from '../../store/useStore'

export function Navbar() {
  const { color } = useStore()

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md bg-[#080808]/50 border-b border-white/5">
      <div className="font-bebas text-3xl tracking-widest cursor-pointer group">
        NK.
      </div>
      <div className="flex gap-6 md:gap-8 items-center font-mono text-xs md:text-sm tracking-widest uppercase">
        <a href="#" className="hidden md:block hover:text-white/60 transition-colors">Sneakers</a>
        <a href="#" className="hidden md:block hover:text-white/60 transition-colors">About</a>
        <div 
          className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-colors duration-500"
          style={{ backgroundColor: color }}
        />
        <button className="px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer">
          Shop
        </button>
      </div>
    </nav>
  )
}
