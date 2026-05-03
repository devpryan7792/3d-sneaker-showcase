import { useStore } from '../../store/useStore'
import { insforge } from '../../utils/insforge'
import { ShoppingBag } from 'lucide-react'

export function Navbar() {
  const { color, user, setAuthModalOpen, cart, setCartOpen, setUser } = useStore()

  const handleAuthClick = async () => {
    if (user) {
      await insforge.auth.signOut()
      setUser(null, null)
    } else {
      setAuthModalOpen(true)
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 md:px-16 py-10 flex justify-between items-center pointer-events-none">
      <div 
        className="font-outfit text-3xl font-black tracking-tighter cursor-pointer group pointer-events-auto"
        data-cursor="HOME"
      >
        AF1<span className="text-[#FF4500] group-hover:text-white transition-colors duration-500">.</span>
      </div>
      
      <div className="flex gap-4 md:gap-8 items-center pointer-events-auto">
        <div className="hidden lg:flex gap-10 font-mono text-[10px] tracking-[0.4em] uppercase opacity-40">
          <a href="#" className="hover:text-white hover:opacity-100 transition-all underline-offset-[12px] hover:underline decoration-[#FF4500] decoration-2">Collection</a>
          <a href="#" className="hover:text-white hover:opacity-100 transition-all underline-offset-[12px] hover:underline decoration-[#FF4500] decoration-2">Legacy</a>
          <a href="#" className="hover:text-white hover:opacity-100 transition-all underline-offset-[12px] hover:underline decoration-[#FF4500] decoration-2">Custom</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCartOpen(true)}
            data-cursor="CART"
            className="flex items-center gap-4 px-8 py-4 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full hover:bg-[#FF4500] hover:border-[#FF4500] hover:scale-105 transition-all duration-500 cursor-pointer group shadow-2xl"
          >
            <ShoppingBag size={16} className="group-hover:rotate-12 transition-transform" />
            <span className="font-mono text-[11px] font-bold tracking-widest uppercase">[{cart.length}]</span>
          </button>
          
          <button 
            onClick={handleAuthClick}
            data-cursor="AUTH"
            className="w-14 h-14 flex items-center justify-center bg-white text-black rounded-full hover:bg-[#FF4500] hover:text-white hover:scale-110 transition-all duration-500 cursor-pointer shadow-xl"
          >
            <div className="font-outfit font-black text-[10px] uppercase tracking-tighter">{user ? 'EXIT' : 'JOIN'}</div>
          </button>
        </div>
      </div>
    </nav>
  )
}
