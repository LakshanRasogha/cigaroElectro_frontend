"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, Search, Plus, Minus, Trash2, X, ChevronRight, CheckCircle2 } from 'lucide-react';

// --- Types ---
interface Variant {
  id: string;
  flavor: string;
  emoji: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  tagline: string;
  basePrice: number;
  deliveryFee: number;
  variants: Variant[];
  imageUrl?: string;
}

interface CartItem extends Variant {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  {
    id: 'vozol-vista-20k',
    name: 'VOZOL VISTA – 20,000 PUFFS',
    tagline: '💨 Smooth • Long-lasting • Premium taste',
    basePrice: 8900,
    deliveryFee: 400,
    variants: [
      { id: 'vv-sm', flavor: 'Strawberry Mango', emoji: '🍓', stock: 10 },
      { id: 'vv-sa', flavor: 'Sour Apple Ice ❄️', emoji: '🍏', stock: 5 },
      { id: 'vv-gi', flavor: 'Grape Ice ❄️', emoji: '🍇', stock: 12 },
      { id: 'vv-pi', flavor: 'Peach Ice ❄️', emoji: '🍑', stock: 3 },
    ],
  },
  {
    id: 'waka-so-pro',
    name: 'WAKA SOPro – 10,000 PUFFS',
    tagline: '🔥 High Performance • Dual Mesh Coil',
    basePrice: 6500,
    deliveryFee: 400,
    variants: [
      { id: 'wk-bb', flavor: 'Blueberry Raspberry', emoji: '🫐', stock: 8 },
      { id: 'wk-wm', flavor: 'Watermelon Chill', emoji: '🍉', stock: 0 },
    ],
  }
];

export default function Home() {
  // Authentication State (Mocking for now - integrate NextAuth later)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cigaroelectro_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('cigaroelectro_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, variant: Variant) => {
    if (variant.stock === 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.id === variant.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          ...variant,
          productId: product.id,
          productName: product.name,
          price: product.basePrice,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== variantId));
  };

  const updateQuantity = (variantId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === variantId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      setIsCartOpen(false);
    } else {
      // Proceed to order placement logic
      console.log("Proceeding to checkout with items:", cart);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-6 h-6 md:hidden text-zinc-600" />
          <h1 className="text-xl font-black tracking-tighter text-zinc-900">CIGARO<span className="text-indigo-600">ELECTRO</span></h1>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
          <a href="#" className="text-indigo-600">Home</a>
          <a href="#" className="hover:text-indigo-600 transition">Shop</a>
          <a href="#" className="hover:text-indigo-600 transition">Categories</a>
          <a href="#" className="hover:text-indigo-600 transition">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-zinc-100 rounded-full px-3 py-1.5 border border-zinc-200">
            <Search className="w-4 h-4 text-zinc-400 mr-2" />
            <input type="text" placeholder="Search vapes..." className="bg-transparent text-xs outline-none w-32 focus:w-48 transition-all" />
          </div>
          <button onClick={() => setIsLoggedIn(!isLoggedIn)} className="p-2 hover:bg-zinc-100 rounded-full transition relative group">
            <User className={`w-5 h-5 ${isLoggedIn ? 'text-indigo-600' : 'text-zinc-500'}`} />
            {isLoggedIn && <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>}
          </button>
          <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
            <div className="p-2 hover:bg-zinc-100 rounded-full transition">
              <ShoppingCart className="w-6 h-6 text-zinc-900" />
            </div>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-zinc-900 text-white py-16 px-6">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-gradient-to-l from-indigo-500 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <span className="inline-block bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">New Arrivals 2024</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">Premium Vapes.<br/><span className="text-indigo-500 italic">No Compromise.</span></h2>
          <p className="text-zinc-400 text-lg max-w-xl mb-10 leading-relaxed">Experience the peak of flavor technology with our curated collection of 20,000+ puff disposables.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-white text-zinc-900 hover:bg-zinc-100 px-10 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2">
              Browse Collection <ChevronRight className="w-4 h-4" />
            </button>
            <button className="bg-zinc-800 text-white hover:bg-zinc-700 px-10 py-4 rounded-xl font-bold transition">
              Our Story
            </button>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-3xl font-black flex items-center gap-3 tracking-tight">
              🔥 Featured Drops
            </h3>
            <p className="text-zinc-500 text-sm mt-1">First come, first served. Limited stock available.</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <div className="h-10 w-10 border rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-100 transition"><Minus className="w-4 h-4" /></div>
            <div className="h-10 w-10 border rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-100 transition"><Plus className="w-4 h-4" /></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group bg-white rounded-[2.5rem] border border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden flex flex-col transition-all hover:translate-y-[-4px] hover:shadow-2xl">
              <div className="p-8">
                <div className="mb-6">
                  <h4 className="text-2xl font-black mb-2 uppercase tracking-tighter text-zinc-800 leading-tight">✨ {product.name} ✨</h4>
                  <p className="text-indigo-600 text-sm font-bold tracking-tight">{product.tagline}</p>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Select Flavor</p>
                  {product.variants.map((v) => (
                    <button 
                      key={v.id} 
                      onClick={() => addToCart(product, v)}
                      disabled={v.stock === 0}
                      className="w-full group/item flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className="text-3xl bg-zinc-50 w-12 h-12 flex items-center justify-center rounded-xl group-hover/item:bg-white transition-colors">
                          {v.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-800 leading-none mb-1">{v.flavor}</p>
                          <p className={`text-[10px] uppercase font-black tracking-widest ${v.stock > 0 ? 'text-green-500' : 'text-red-400'}`}>
                            {v.stock > 0 ? `${v.stock} in stock` : 'Out of Stock'}
                          </p>
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg transition-all ${v.stock > 0 ? 'bg-zinc-900 text-white group-hover/item:scale-110' : 'bg-zinc-100 text-zinc-300'}`}>
                        <Plus className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-auto border-t border-zinc-100 pt-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Price per unit</p>
                      <p className="text-3xl font-black text-indigo-600 leading-none">{product.basePrice.toLocaleString()}<span className="text-sm font-medium text-indigo-400 ml-1">LKR</span></p>
                      <p className="text-xs text-zinc-400 font-medium mt-2">🚚 Delivery: {product.deliveryFee}/=</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-zinc-400 uppercase font-black leading-tight tracking-widest opacity-60">
                        📲 DM TO ORDER<br/>
                        LIMITED STOCK
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Authentication Modal (Redirect Emulator) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-black tracking-tight">Login Required</h2>
              <button onClick={() => setShowAuthModal(false)} className="p-1 hover:bg-zinc-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-zinc-500 text-sm mb-8">You need to be a registered user to place an order. Sign in or create an account to proceed.</p>
            
            <div className="space-y-4">
              <button onClick={() => { setIsLoggedIn(true); setShowAuthModal(false); }} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                Sign In with Email
              </button>
              <button className="w-full bg-zinc-100 text-zinc-900 py-4 rounded-xl font-bold hover:bg-zinc-200 transition border border-zinc-200">
                Register New Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
            <div className="p-8 border-b flex items-center justify-between bg-zinc-50">
              <div>
                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-indigo-600" /> YOUR CART
                </h2>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">CigaroElectro Premium</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-3 bg-white border rounded-2xl hover:bg-zinc-100 transition shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="w-10 h-10 text-zinc-300" />
                  </div>
                  <p className="text-zinc-500 font-black uppercase tracking-widest">Empty Space</p>
                  <p className="text-zinc-400 text-sm mt-2">Your premium selection will appear here.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="group flex gap-5 items-center">
                    <div className="w-20 h-20 bg-zinc-100 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner group-hover:bg-indigo-50 transition-colors">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-sm tracking-tight text-zinc-800">{item.productName}</h4>
                          <p className="text-xs font-bold text-indigo-500 mt-1 uppercase tracking-widest">{item.flavor}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-zinc-300 hover:text-red-500 transition-colors p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center bg-zinc-50 rounded-xl border border-zinc-100 p-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-white rounded-lg transition-all"><Minus className="w-3 h-3" /></button>
                          <span className="w-8 text-center text-sm font-black text-zinc-800">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-white rounded-lg transition-all"><Plus className="w-3 h-3" /></button>
                        </div>
                        <p className="font-black text-zinc-900">{(item.price * item.quantity).toLocaleString()}/=</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t bg-zinc-50 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-zinc-500 text-sm font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>{cartTotal.toLocaleString()} LKR</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-500 text-sm font-bold uppercase tracking-widest">
                    <span>Delivery (Flat)</span>
                    <span>400 LKR</span>
                  </div>
                  <div className="pt-4 flex justify-between items-center border-t border-zinc-200">
                    <span className="text-lg font-black tracking-tight">GRAND TOTAL</span>
                    <span className="text-2xl font-black text-indigo-600">{(cartTotal + 400).toLocaleString()} LKR</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-zinc-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                >
                  Place Order <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3 text-green-500" /> Secure Checkout Enabled
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-zinc-900 mb-2">CIGARO<span className="text-indigo-600">ELECTRO</span></h1>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em]">Premium Vaping Equipment</p>
          </div>
          <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-zinc-500">
            <a href="#" className="hover:text-indigo-600 transition">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition">Wholesale</a>
          </div>
          <p className="text-zinc-400 text-[10px] font-medium tracking-tight">© 2024 CigaroElectro SL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}