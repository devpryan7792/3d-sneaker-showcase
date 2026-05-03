import { useStore } from '../../store/useStore'
import { X, Trash2, ShoppingBag } from 'lucide-react'

export function CartDrawer() {
  const { isCartOpen, setCartOpen, cart, removeFromCart } = useStore()
  
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-screen w-full md:w-[450px] bg-[#080808] border-l border-white/10 z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        
        {/* Header */}
        <div className="p-8 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} className="text-[#FF4500]" />
            <h2 className="font-bebas text-3xl">YOUR CART ({cart.length})</h2>
          </div>
          <button 
            onClick={() => setCartOpen(false)}
            className="text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X size={28} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/50 font-mono text-sm">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 items-center">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="font-bebas text-2xl opacity-50">NK</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bebas text-xl">{item.name}</h3>
                  <p className="font-mono text-xs text-[#FF4500]">${item.price}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-white/30 hover:text-[#FF4500] hover:bg-[#FF4500]/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        <div className="p-8 border-t border-white/10 bg-[#080808]">
          <div className="flex justify-between items-center mb-6 font-mono">
            <span className="text-white/60">SUBTOTAL</span>
            <span className="text-xl">${totalPrice} USD</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={() => alert("Payment Gateway Coming Soon! Your cart is safely stored in the database.")}
            className="w-full bg-[#F5F5F0] text-black font-bebas text-2xl py-4 rounded-xl hover:bg-[#FF4500] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </>
  )
}
