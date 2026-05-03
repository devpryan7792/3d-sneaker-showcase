import { useState } from 'react'
import { X, Mail, Lock, Loader2 } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { insforge } from '../../utils/insforge'

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, setUser, fetchCart } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isLogin, setIsLogin] = useState(true)

  if (!isAuthModalOpen) return null

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (isLogin) {
        const { data, error } = await insforge.auth.signInWithPassword({ email, password })
        if (error) throw error
        setUser(data.user, data.session)
        fetchCart() // Sync cart after login
      } else {
        const { data, error } = await insforge.auth.signUp({ email, password })
        if (error) throw error
        if (data.session) {
          setUser(data.user, data.session)
        } else {
          alert('Check your email for the confirmation link!')
        }
      }
      setAuthModalOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-xl p-8 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <h2 className="font-bebas text-4xl mb-2">{isLogin ? 'WELCOME BACK' : 'JOIN THE CLUB'}</h2>
          <p className="font-mono text-xs text-white/50 tracking-widest uppercase">
            {isLogin ? 'Access your drops and orders' : 'Get exclusive access to fresh drops'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-3 font-mono text-sm focus:outline-none focus:border-[#FF4500] transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-3 font-mono text-sm focus:outline-none focus:border-[#FF4500] transition-colors"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-[#FF4500] bg-[#FF4500]/10 p-2 border border-[#FF4500]/20 rounded">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-[#F5F5F0] text-black font-bebas text-2xl py-3 rounded-lg hover:bg-[#FF4500] hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-mono text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
}
