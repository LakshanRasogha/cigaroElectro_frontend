"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Menu, X, Zap, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartStats, setCartStats] = useState({ count: 0, total: 0 });
  
  const pathname = usePathname();
  const router = useRouter();

  /**
   * SYNC LOGIC: Updates User and Cart data from localStorage
   * Triggered on mount and via custom event when items are added elsewhere
   */
  const syncNavbarData = () => {
    // 1. Sync User Session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    // 2. Sync Cart Data
    const savedBag = localStorage.getItem('bag');
    if (savedBag) {
      try {
        const items = JSON.parse(savedBag);
        const count = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
        const total = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
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
    
    // Listen for custom "cartUpdated" event dispatched from ProductDetailView
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', syncNavbarData);
    // Listen for storage changes in other tabs
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
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-0 shadow-sm' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-[180deg] transition-transform duration-500">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className={`text-xl font-black tracking-tighter uppercase transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-slate-800'}`}>
              Figaro<span className="text-indigo-600 italic">Electrico</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center font-bold uppercase text-[11px] tracking-[0.2em]">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path} 
                  className={`relative px-2 py-1 transition-colors duration-300 ${
                    isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span 
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-600 to-purple-400 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* --- PROFILE / USER SECTION --- */}
            <div className="relative group">
              {user ? (
                <div className={`flex items-center gap-3 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:bg-slate-100/50 ${isScrolled ? 'text-slate-900' : 'text-slate-700'}`}>
                  <div className="text-right hidden lg:block">
                    <p className="text-[10px] font-black uppercase tracking-tighter leading-none mb-0.5">
                      {user.firstName || user.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest leading-none">Member</p>
                  </div>
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm bg-slate-50">
                    <img 
                      src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=6366f1&color=fff`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              ) : (
                <Link 
                  href="/auth/login" 
                  className={`p-2.5 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-slate-100 ${isScrolled ? 'text-slate-900' : 'text-slate-600'}`}
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-52 py-2 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 -translate-y-2 group-hover:translate-y-0 hidden md:block overflow-hidden">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorized Access</p>
                        <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <LayoutDashboard size={14} /> Control Panel
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                        <Settings size={14} /> Account Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                        <LogOut size={14} /> De-authenticate
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:bg-slate-50">Log In</Link>
                    <Link href="/auth/register" className="block px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:bg-slate-50">Create Account</Link>
                  </>
                )}
              </div>
            </div>

            {/* --- CART SECTION (Dynamic) --- */}
            <Link 
              href="/cart"
              className={`flex items-center gap-3 cursor-pointer group transition-all duration-300 ${isScrolled ? 'text-slate-900' : 'text-slate-600'}`}
            >
              <div className="relative p-2.5 rounded-full group-hover:bg-slate-100 transition-colors">
                <ShoppingCart className="h-5 w-5 group-hover:text-indigo-600 transition-colors" />
                <AnimatePresence>
                  {cartStats.count > 0 && (
                    <motion.span 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white shadow-sm"
                    >
                      {cartStats.count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 leading-none mb-0.5">Your Bag</span>
                <span className="text-[10px] font-black tracking-widest leading-none">
                  Rs. {cartStats.total.toLocaleString()}
                </span>
              </div>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[90] md:hidden pt-24 px-10 flex flex-col"
          >
            <div className="flex-1 space-y-8">
              {user && (
                <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <img className="w-16 h-16 rounded-2xl border-2 border-indigo-500 shadow-md object-cover" src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}`} alt="user" />
                    <div>
                        <p className="text-2xl font-black text-slate-900 leading-none">{user.firstName || user.name}</p>
                        <p className="text-[10px] text-indigo-500 mt-1.5 uppercase font-black tracking-[0.2em]">Verified Member</p>
                    </div>
                </div>
              )}
              
              <div className="flex flex-col space-y-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={link.name}
                  >
                    <Link 
                      href={link.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-5xl font-black text-slate-900 hover:text-indigo-600 transition-colors tracking-tighter"
                    >
                      {link.name}.
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="pb-12 space-y-6">
              <div className="h-[1px] bg-slate-100 w-full" />
              <Link 
                href="/cart" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-black text-indigo-600 flex items-center justify-between"
              >
                Shopping Bag 
                <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-lg shadow-indigo-200">
                  {cartStats.count} Units
                </span>
              </Link>
              
              {user ? (
                 <button 
                  onClick={handleLogout}
                  className="text-2xl font-black text-rose-500 flex items-center gap-3 w-full"
                 >
                  De-authenticate <LogOut size={28} />
                 </button>
              ) : (
                <Link 
                  href="/auth/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-black text-slate-900 flex items-center gap-3"
                >
                  Member Access <User size={28} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;