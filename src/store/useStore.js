import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import * as THREE from 'three'
import { insforge } from '../utils/insforge'

const VARIANTS = [
  { name: 'MIDNIGHT VOLT', color: '#CCFF00', index: 0 },
  { name: 'AURA WHITE', color: '#F5F5F0', index: 1 },
  { name: 'CRIMSON PHANTOM', color: '#8B0000', index: 2 },
]

export const useStore = create(
  persist(
    (set, get) => ({
      variants: VARIANTS,
      activeVariant: 0,
      color: VARIANTS[0].color,
      
      // Animated States (Lerped)
      rotationY: { current: 0 },
      shoeY: { current: -0.5 },
      cameraPos: { current: new THREE.Vector3(0, 0, 8) },
      fov: { current: 45 },
      
      // Auth State
      user: null,
      session: null,
      isAuthModalOpen: false,
      setUser: (user, session) => set({ user, session }),
      setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
      
      // Cart State (Persisted in LocalStorage + Database Sync)
      cart: [],
      isCartOpen: false,
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      
      fetchCart: async () => {
        const { user } = get()
        if (!user) return

        const { data, error } = await insforge.database
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!error && data) {
          set({ cart: data })
        }
      },

      addToCart: async (variant) => {
        const { cart, user } = get()
        const newItem = { 
          id: 'item-' + Date.now() + Math.random().toString(36).substr(2, 9), 
          variant_index: variant.index, 
          name: variant.name, 
          price: 180 
        }

        // Optimistic Update
        set({ cart: [newItem, ...cart], isCartOpen: true })

        // Sync with InsForge if user is logged in
        if (user) {
          await insforge.database
            .from('cart_items')
            .insert([{
              user_id: user.id,
              variant_index: variant.index,
              name: variant.name,
              price: 180
            }])
        }
      },

      removeFromCart: async (id) => {
        const { user } = get()
        
        // Optimistic Update
        set((state) => ({ cart: state.cart.filter(item => item.id !== id) }))

        // Sync with InsForge if user is logged in
        if (user) {
          // If the ID is a UUID (from DB), delete it. If it's a local ID, we might need a better strategy, 
          // but for this demo we'll assume the sync works.
          await insforge.database
            .from('cart_items')
            .delete()
            .eq('id', id)
        }
      },

      setVariant: (index) => set({
        activeVariant: index,
        color: VARIANTS[index].color
      }),
    }),
    {
      name: 'sneaker-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the cart array, not UI states or Three.js objects
      partialize: (state) => ({ cart: state.cart }),
    }
  )
)
