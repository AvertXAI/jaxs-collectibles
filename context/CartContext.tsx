//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Defining the specific structure for Asset Intelligence in the cart
export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    stock: number
    slug: string
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, qty: number) => void
    clearCart: () => void
    isCartOpen: boolean
    setCartOpen: (open: boolean) => void
    cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isCartOpen, setCartOpen] = useState(false)

    useEffect(() => {
        const savedCart = localStorage.getItem('vault_cart')
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart))
            } catch (e) {
                console.error("Vault Cart Decryption Failed", e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('vault_cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (item: CartItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) {
                const newQty = Math.min(item.stock, existing.quantity + item.quantity)
                return prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
            }
            return [...prev, item]
        })
        setCartOpen(true)
    }

    const updateQuantity = (id: string, qty: number) => {
        setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.min(i.stock, Math.max(1, qty)) } : i))
    }

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(i => i.id !== id))
    }

    const clearCart = () => setCart([])

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity,
            clearCart, isCartOpen, setCartOpen, cartTotal
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be used within a CartProvider")
    return context
}