"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Menu, X, User, LogOut, Settings, LayoutDashboard, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface CartItem {
  quantity: number;
  price: number;
  [key: string]: any; 
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartStats, setCartStats] = useState({ count: 0, total: 0 });
  
  const pathname = usePathname();
  const router = useRouter();

  const syncNavbarData = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (err) { setUser(null); }
    } else { setUser(null); }

    const savedBag = localStorage.getItem('bag');
    if (savedBag) {
      try {
        const items: CartItem[] = JSON.parse(savedBag);
        const count = items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
        const total = items.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0);
        setCartStats({ count, total });
      } catch (err) { 
        setCartStats({ count: 0, total: 0 }); 
      }
    } else { 
      setCartStats({ count: 0, total: 0 }); 
    }
  };

  useEffect(() => {
    syncNavbarData();
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', syncNavbarData);
    window.addEventListener('storage', syncNavbarData);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', syncNavbarData);
      window.removeEventListener('storage', syncNavbarData);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Collections', path: '/collections' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav 
      className={`fixed w-full z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-2xl border-b border-[#D4AF37]/20 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl font-normal tracking-tight text-white flex flex-col md:flex-row md:gap-1 leading-none" 
                  style={{ fontFamily: "'Dancing Script', cursive" }}>
              <span className="text-[#D4AF37]">CigarroEléctrico</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-10 items-center font-bold uppercase text-[10px] tracking-[0.25em]">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path} 
                  className={`relative px-2 py-1 transition-colors duration-300 ${
                    isActive ? 'text-[#D4AF37]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span 
                      layoutId="navUnderline"
                      className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-4 md:gap-8">
            
            {/* User Profile */}
            <div className="relative group">
              {user ? (
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:bg-[#D4AF37]/5 border border-transparent hover:border-[#D4AF37]/20">
                  <div className="text-right hidden lg:block">
                    <p className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1 text-white">
                      {user.firstName || user.name?.split(' ')[0] || 'Member'}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-1 h-1 rounded-full bg-[#D4AF37] animate-pulse" />
                      <p className="text-[7px] font-bold text-[#D4AF37] uppercase tracking-widest leading-none">Elite</p>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 shadow-xl bg-zinc-900">
                    <img 
                      src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=D4AF37&color=000`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              ) : (
                <Link 
                  href="/auth/login" 
                  className="p-2.5 rounded-full text-zinc-400 hover:text-[#D4AF37] hover:bg-white/5 transition-all"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-3 w-56 py-3 bg-black/95 backdrop-blur-3xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#D4AF37]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 -translate-y-2 group-hover:translate-y-0 hidden md:block overflow-hidden">
                {user ? (
                  <>
                    <div className="px-5 py-3 border-b border-white/5 mb-2">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Authenticated</p>
                        <p className="text-xs font-medium text-white truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-3 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                        <LayoutDashboard size={14} /> Control Panel
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-3 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Settings size={14} /> Account
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="p-2 flex flex-col gap-1">
                    <Link href="/auth/login" className="px-4 py-2 text-[10px] font-bold uppercase text-white hover:bg-[#D4AF37]/10 rounded-lg">Log In</Link>
                    <Link href="/auth/Signin" className="px-4 py-2 text-[10px] font-bold uppercase text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-lg">Create Account</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Section */}
            <Link 
              href="/cart"
              className="flex items-center gap-4 group"
            >
              <div className="relative p-2.5 rounded-full text-zinc-400 group-hover:text-[#D4AF37] group-hover:bg-[#D4AF37]/5 transition-all">
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {cartStats.count > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-black"
                    >
                      {cartStats.count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="hidden lg:flex flex-col border-l border-[#D4AF37]/20 pl-4">
                <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500 leading-none mb-1">Portfolio Value</span>
                <span className="text-[11px] font-bold text-white leading-none tracking-tight">
                  Rs. {cartStats.total.toLocaleString()}
                </span>
              </div>
            </Link>
            
            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-[#D4AF37] p-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
  {isMobileMenuOpen && (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      // Ensures the background remains solid and overrides any scroll-based parent opacity
      className="fixed inset-0 bg-[#050505] z-[150] md:hidden flex flex-col h-screen w-screen overflow-hidden pointer-events-auto"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center p-8 shrink-0">
          <span className="text-xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Cigaro
          </span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="p-2 text-white hover:text-[#D4AF37] transition-colors"
          >
            <X size={32} />
          </button>
      </div>

      {/* Nav Links Section - Aligned to the right and text size reduced to 2xl */}
      <div className="flex-1 flex flex-col justify-center px-10 items-end space-y-5">
          {navLinks.map((link, i) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }} // Sliding in from the right to match alignment
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={link.name}
            >
              <Link 
                href={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                // text-2xl is smaller and more sophisticated; text-right ensures alignment
                className="text-2xl font-bold text-white hover:text-[#D4AF37] transition-colors tracking-tighter block uppercase text-right"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
      </div>

      {/* Footer / User Section */}
      <div className="p-10 border-t border-[#D4AF37]/10 shrink-0 bg-[#050505]">
        {user ? (
          <div className="flex items-center gap-4 p-5 bg-[#D4AF37]/5 rounded-3xl border border-[#D4AF37]/20">
              <img 
                className="w-14 h-14 rounded-xl object-cover border-2 border-[#D4AF37]" 
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName || user.name}&background=D4AF37&color=000`} 
                alt="user" 
              />
              <div className="overflow-hidden">
                  <p className="text-xl font-bold text-white truncate">
                    {user.firstName || user.name}
                  </p>
                  <button 
                    onClick={handleLogout} 
                    className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mt-1 hover:text-rose-400 transition-colors"
                  >
                    Terminate Session
                  </button>
              </div>
          </div>
        ) : (
          <Link 
            href="/auth/login" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="w-full py-5 bg-[#D4AF37] text-black text-center font-bold uppercase tracking-widest rounded-xl block text-sm active:scale-95 transition-transform"
          >
            Client Login
          </Link>
        )}
        <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.5em] mt-8 text-center">
          Cigaro Electrico MMXXVI
        </p>
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </nav>
  );
};

export default Navbar;