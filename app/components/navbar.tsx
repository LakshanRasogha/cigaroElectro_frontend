"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/app/lib/wishlist";
import type { AppUser, CartItem } from "@/app/lib/types";

// --- Types ---
interface NavbarSnapshot {
  user: AppUser | null;
  cartStats: {
    count: number;
    total: number;
  };
}

const BrandLogo = ({
  mobile = false,
  onClick,
}: {
  mobile?: boolean;
  onClick?: () => void;
}) => (
  <Link href='/' onClick={onClick} className='flex items-center shrink-0'>
    <img
      src='/logo 2 gld.png'
      alt='CigaroElectro logo'
      className={`w-auto object-contain ${mobile ? "h-10" : "h-8 lg:h-9 xl:h-10"}`}
    />
  </Link>
);

const Navbar = () => {
  const readNavbarSnapshot = (): NavbarSnapshot => {
    if (typeof window === "undefined") {
      return {
        user: null,
        cartStats: { count: 0, total: 0 },
      };
    }

    let user: AppUser | null = null;
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        user = JSON.parse(savedUser) as AppUser;
      } catch {
        user = null;
      }
    }

    let cartStats = { count: 0, total: 0 };
    const savedBag = localStorage.getItem("bag");

    if (savedBag) {
      try {
        const items = JSON.parse(savedBag) as CartItem[];
        cartStats = {
          count: items.reduce(
            (acc: number, item: CartItem) => acc + item.quantity,
            0,
          ),
          total: items.reduce(
            (acc: number, item: CartItem) => acc + item.price * item.quantity,
            0,
          ),
        };
      } catch {
        cartStats = { count: 0, total: 0 };
      }
    }

    return { user, cartStats };
  };

  const [isScrolled, setIsScrolled] = useState(
    typeof window !== "undefined" ? window.scrollY > 20 : false,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navbarSnapshot, setNavbarSnapshot] = useState<NavbarSnapshot>({
    user: null,
    cartStats: { count: 0, total: 0 },
  });
  const user = navbarSnapshot.user;
  const cartStats = navbarSnapshot.cartStats;
  const { wishlist } = useWishlist();
  const profileImageSrc = user?.profilePicture
    ? user.profilePicture
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.firstName || user?.name || user?.email || "User",
      )}&background=D4AF37&color=000`;

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let rafId = 0;

    const updateScrollState = () => {
      rafId = 0;
      const nextIsScrolled = window.scrollY > 20;
      setIsScrolled((prev) =>
        prev === nextIsScrolled ? prev : nextIsScrolled,
      );
    };

    const handleScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateScrollState);
    };

    const handleNavbarSync = () => {
      setNavbarSnapshot(readNavbarSnapshot());
    };

    handleNavbarSync();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("cartUpdated", handleNavbarSync);
    window.addEventListener("storage", handleNavbarSync);

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cartUpdated", handleNavbarSync);
      window.removeEventListener("storage", handleNavbarSync);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setNavbarSnapshot((prev) => ({
      ...prev,
      user: null,
    }));
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Collections", path: "/collections" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-black/92 border-b border-[#D4AF37]/20 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          : "bg-transparent py-6"
      }`}
    >
      <div className='max-w-7xl mx-auto px-6 lg:px-10'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo Section */}
          <BrandLogo />

          {/* Desktop Navigation */}
          <div className='hidden md:flex space-x-10 items-center font-bold uppercase text-[10px] tracking-[0.25em]'>
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative px-2 py-1 transition-colors duration-300 ${
                    isActive
                      ? "text-[#D4AF37]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId='navUnderline'
                      className='absolute -bottom-2 left-0 w-full h-[1px] bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)]'
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className='flex items-center gap-1 ml-4 md:gap-8'>
            {/* User Profile */}
            <div className='relative group'>
              {user ? (
                <>
                  <Link
                    href='/profile'
                    className='md:hidden flex items-center justify-center p-1 rounded-full transition-all duration-300 hover:bg-[#D4AF37]/5 border border-transparent hover:border-[#D4AF37]/20'
                  >
                    <div className='w-9 h-9 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 shadow-xl bg-zinc-900'>
                      <img
                        src={profileImageSrc}
                        alt='Profile'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </Link>

                  <Link
                    href='/profile'
                    className='hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:bg-[#D4AF37]/5 border border-transparent hover:border-[#D4AF37]/20'
                  >
                    <div className='text-right hidden lg:block'>
                      <p className='text-[10px] font-black uppercase tracking-tighter leading-none mb-1 text-white'>
                        {user.firstName || user.name?.split(" ")[0] || "Member"}
                      </p>
                      <div className='flex items-center justify-end gap-1'>
                        <div className='w-1 h-1 rounded-full bg-[#D4AF37] animate-pulse' />
                        <p className='text-[7px] font-bold text-[#D4AF37] uppercase tracking-widest leading-none'>
                          Elite
                        </p>
                      </div>
                    </div>
                    <div className='w-9 h-9 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 shadow-xl bg-zinc-900'>
                      <img
                        src={profileImageSrc}
                        alt='Profile'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </Link>
                </>
              ) : (
                <Link
                  href='/auth/login'
                  className='p-2.5 rounded-full text-zinc-400 hover:text-[#D4AF37] hover:bg-white/5 transition-all'
                >
                  <User className='h-5 w-5' />
                </Link>
              )}

              {/* Dropdown Menu */}
              <div className='absolute top-full right-0 mt-3 w-56 py-3 bg-black/95 backdrop-blur-3xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#D4AF37]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 -translate-y-2 group-hover:translate-y-0 hidden md:block overflow-hidden'>
                {user ? (
                  <>
                    <div className='px-5 py-3 border-b border-white/5 mb-2'>
                      <p className='text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1'>
                        Authenticated
                      </p>
                      <p className='text-xs font-medium text-white truncate'>
                        {user.email}
                      </p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href='/admin'
                        className='flex items-center gap-3 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors'
                      >
                        <LayoutDashboard size={14} /> Control Panel
                      </Link>
                    )}
                    <Link
                      href='/profile'
                      className='flex items-center gap-3 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-colors'
                    >
                      <Settings size={14} /> Account
                    </Link>
                    <Link
                      href='/wishlist'
                      className='flex items-center gap-3 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-colors'
                    >
                      <Heart size={14} /> Wishlist
                      {wishlist.length > 0 && (
                        <span className='ml-auto bg-[#D4AF37] text-black text-[7px] font-black rounded-full w-4 h-4 flex items-center justify-center'>
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='w-full flex items-center gap-3 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-colors'
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </>
                ) : (
                  <div className='p-2 flex flex-col gap-1'>
                    <Link
                      href='/auth/login'
                      className='px-4 py-2 text-[10px] font-bold uppercase text-white hover:bg-[#D4AF37]/10 rounded-lg'
                    >
                      Log In
                    </Link>
                    <Link
                      href='/auth/Signin'
                      className='px-4 py-2 text-[10px] font-bold uppercase text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-lg'
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Section */}
            <Link href='/cart' className='flex items-center gap-4 group'>
              <div className='relative p-2.5 rounded-full text-zinc-400 group-hover:text-[#D4AF37] group-hover:bg-[#D4AF37]/5 transition-all'>
                <ShoppingCart className='h-5 w-5' />
                <AnimatePresence>
                  {cartStats.count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className='absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-black'
                    >
                      {cartStats.count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className='hidden lg:flex flex-col border-l border-[#D4AF37]/20 pl-4'>
                <span className='text-[7px] font-black uppercase tracking-widest text-zinc-500 leading-none mb-1'>
                  Portfolio Value
                </span>
                <span className='text-[11px] font-bold text-white leading-none tracking-tight'>
                  Rs. {cartStats.total.toLocaleString()}
                </span>
              </div>
            </Link>

            {/* Mobile Toggle */}
            <button
              className='md:hidden text-[#D4AF37] p-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors'
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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className='fixed inset-0 bg-[#050505] z-[150] md:hidden flex flex-col h-screen w-screen overflow-hidden pointer-events-auto'
          >
            {/* Header Section */}
            <div className='flex justify-between items-center p-8 shrink-0'>
              <BrandLogo mobile onClick={() => setIsMobileMenuOpen(false)} />
              <span
                className='hidden text-2xl font-normal tracking-tight text-[#D4AF37] leading-none'
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                CigarroEléctrico
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className='p-2 text-white hover:text-[#D4AF37] transition-colors'
              >
                <X size={32} />
              </button>
            </div>

            {/* Nav Links Section */}
            <div className='flex-1 flex flex-col justify-center px-10 items-end space-y-5'>
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='text-2xl font-bold text-white hover:text-[#D4AF37] transition-colors tracking-tighter block uppercase text-right'
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {user && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Link
                    href='/wishlist'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='flex items-center justify-end gap-3 text-lg font-bold text-zinc-300 hover:text-[#D4AF37] transition-colors tracking-tight uppercase'
                  >
                    {wishlist.length > 0 && (
                      <span className='bg-[#D4AF37] text-black text-[8px] font-black rounded-full w-5 h-5 flex items-center justify-center'>
                        {wishlist.length}
                      </span>
                    )}
                    Wishlist
                    <Heart size={18} className={wishlist.length > 0 ? 'fill-[#D4AF37] text-[#D4AF37]' : ''} />
                  </Link>
                </motion.div>
              )}

              {user && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <button
                    type='button'
                    onClick={handleLogout}
                    className='text-[9px] font-black text-rose-500 hover:text-rose-400 transition-colors tracking-[0.2em] block uppercase text-right'
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>

            {/* Footer / User Section */}
            <div className='p-10 border-t border-[#D4AF37]/10 shrink-0 bg-[#050505]'>
              {user ? (
                <div
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/profile");
                  }}
                  className='flex items-center gap-4 p-5 bg-[#D4AF37]/5 rounded-3xl border border-[#D4AF37]/20 cursor-pointer active:scale-95 transition-transform'
                >
                  <img
                    className='w-14 h-14 rounded-xl object-cover border-2 border-[#D4AF37]'
                    src={profileImageSrc}
                    alt='user'
                  />
                  <div className='overflow-hidden'>
                    <p className='text-xl font-bold text-white truncate'>
                      {user.firstName || user.name}
                    </p>
                    <p className='text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mt-1'>
                      View Profile
                    </p>
                  </div>
                </div>
              ) : (
                <Link
                  href='/auth/login'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='w-full py-5 bg-[#D4AF37] text-black text-center font-bold uppercase tracking-widest rounded-xl block text-sm active:scale-95 transition-transform'
                >
                  Client Login
                </Link>
              )}
              <p className='text-[8px] font-bold text-zinc-600 uppercase tracking-[0.5em] mt-8 text-center'>
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
