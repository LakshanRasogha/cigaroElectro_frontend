"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, Mail, Phone, MapPin, Camera, X, 
  Loader2, Package, LogOut,
  Clock, CheckCircle2, Truck, AlertCircle,
  Flame, Droplets, Zap,
  ShoppingBag, ChevronRight, Cloud, Calendar,
  Star, Award, Shield, Sparkles, Crown, Gem,
  Heart
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../componenets/navbar';

const ProfilePage = () => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    bio: '',
    favoriteFlavor: '',
    vapeStyle: ''
  });

  const coverPhoto = "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?q=80&w=2070&auto=format&fit=crop";

  const fetchOrderHistory = async () => {
    setIsLoadingOrders(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoadingOrders(false);
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/orders/getOrders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const loadUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setEditForm({
          firstName: parsed.firstName || "",
          lastName: parsed.lastName || "",
          phone: parsed.phone || "",
          streetAddress: parsed.address?.address || "",
          city: parsed.address?.city || "",
          postalCode: parsed.address?.postalCode || "",
          bio: parsed.bio || "Cloud chaser and flavor enthusiast.",
          favoriteFlavor: parsed.favoriteFlavor || "Strawberry Ice",
          vapeStyle: parsed.vapeStyle || "DTL"
        });
        fetchOrderHistory();
      } catch (error) {
        router.push("/auth/login");
      }
    } else {
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    loadUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/');
    router.refresh();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMsg(null);

    const payload = {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phone: editForm.phone,
      bio: editForm.bio,
      favoriteFlavor: editForm.favoriteFlavor,
      vapeStyle: editForm.vapeStyle,
      address: {
        address: editForm.streetAddress,
        city: editForm.city,
        postalCode: editForm.postalCode
      }
    };

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API}/api/users/update/${user._id}`, payload);
      if (response.status === 200) {
        const updatedUser = { ...user, ...payload };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('storage'));
        setUser(updatedUser);
        setIsEditModalOpen(false);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]" />
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full mb-4"
        />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Synchronizing Profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white pb-12 sm:pb-16 md:pb-20 selection:bg-[#D4AF37]/30 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-20" />
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10"
        />
      </div>

      <Navbar />
      
      {/* Cover Section */}
      <div className="relative h-40 sm:h-48 md:h-64 lg:h-80 w-full overflow-hidden">
        <img src={coverPhoto} className="w-full h-full object-cover opacity-30" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 -mt-16 sm:-mt-20 md:-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5 md:space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl"
            >
              {/* Gold border accent */}
              <div className="absolute inset-0 border border-[#D4AF37]/10 rounded-2xl sm:rounded-3xl pointer-events-none" />
              
              <div className="relative">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-5 md:mb-6">
                  <div className="w-full h-full rounded-xl sm:rounded-2xl border-2 border-[#D4AF37]/30 overflow-hidden bg-gradient-to-br from-[#D4AF37] to-[#B49450]">
                    <img 
                      src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=D4AF37&color=000&size=200&bold=true`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black p-1.5 sm:p-2 rounded-lg border-2 border-[#030303] hover:scale-110 transition-transform"
                  >
                    <Camera size={12} className="sm:hidden" />
                    <Camera size={14} className="hidden sm:block md:hidden" />
                    <Camera size={16} className="hidden md:block" />
                  </motion.button>
                </div>

                <div className="text-center mb-4 sm:mb-5 md:mb-6">
                  <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2">
                    <Crown size={10} className="text-[#D4AF37]" />
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#D4AF37] px-2 py-0.5 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20">
                      {user.role} Member
                    </p>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black rounded-xl sm:rounded-2xl font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 hover:shadow-[0_5px_20px_rgba(212,175,55,0.3)] transition-all relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Edit3 size={10} className="sm:hidden" />
                      <Edit3 size={12} className="hidden sm:block" />
                      Edit Details
                    </span>
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </motion.button>
                  
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full py-2.5 sm:py-3 md:py-4 bg-white/5 text-zinc-400 border border-white/5 rounded-xl sm:rounded-2xl font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all"
                  >
                    <LogOut size={10} className="sm:hidden" />
                    <LogOut size={12} className="hidden sm:block" />
                    End Session
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 backdrop-blur-xl">
              <h3 className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
                <Shield size={10} /> Contact Archive
              </h3>
              <DetailRow 
                icon={<Mail size={12} className="sm:hidden" />}
                iconSm={<Mail size={14} className="hidden sm:block" />}
                label="Email" 
                value={user.email} 
              />
              <DetailRow 
                icon={<Phone size={12} className="sm:hidden" />}
                iconSm={<Phone size={14} className="hidden sm:block" />}
                label="Mobile" 
                value={user.phone || "Not Set"} 
              />
              <DetailRow 
                icon={<MapPin size={12} className="sm:hidden" />}
                iconSm={<MapPin size={14} className="hidden sm:block" />}
                label="City" 
                value={user.address?.city || "Not Set"} 
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              <StatCard 
                icon={<Cloud size={14} className="sm:hidden" />}
                iconSm={<Cloud size={16} className="hidden sm:block" />}
                label="Fav Flavor" 
                value={editForm.favoriteFlavor} 
              />
              <StatCard 
                icon={<Zap size={14} className="sm:hidden" />}
                iconSm={<Zap size={16} className="hidden sm:block" />}
                label="Style" 
                value={editForm.vapeStyle} 
              />
              <StatCard 
                icon={<Package size={14} className="sm:hidden" />}
                iconSm={<Package size={16} className="hidden sm:block" />}
                label="Orders" 
                value={orders.length} 
              />
            </div>

            {/* Orders Feed */}
            <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden backdrop-blur-xl">
              <div className="p-4 sm:p-5 md:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 sm:gap-2">
                  <ShoppingBag size={14} className="text-[#D4AF37]" />
                  Recent Manifests
                </h3>
                <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-600">
                  {orders.length} Deliveries Logged
                </span>
              </div>

              <div className="divide-y divide-white/5 max-h-[350px] sm:max-h-[400px] md:max-h-[450px] overflow-y-auto no-scrollbar">
                {isLoadingOrders ? (
                  <div className="p-10 sm:p-12 md:p-16 text-center flex flex-col items-center">
                    <Loader2 className="animate-spin text-[#D4AF37] mb-2 sm:mb-3" size={16} />
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-600">Accessing Secure Logs...</p>
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order, idx) => (
                    <OrderRow key={order._id} order={order} index={idx} />
                  ))
                ) : (
                  <div className="p-10 sm:p-12 md:p-16 text-center">
                    <Package size={28} className="mx-auto text-zinc-700 mb-2 sm:mb-3" />
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-600">Zero Manifests Recorded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 backdrop-blur-xl">
              <div className="flex items-start gap-2 sm:gap-3">
                <Heart size={14} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] sm:text-xs text-zinc-400 font-light italic leading-relaxed">
                  "{editForm.bio}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-[#0a0a0a] to-[#030303] border border-[#D4AF37]/20 rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 md:p-6 flex justify-between items-center border-b border-white/10">
                <h2 className="text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-tighter flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#D4AF37]" />
                  Patch Identity
                </h2>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditModalOpen(false)} 
                  className="p-1.5 sm:p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-[#D4AF37] transition-colors"
                >
                  <X size={14} className="sm:hidden" />
                  <X size={16} className="hidden sm:block" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)] no-scrollbar">
                <form onSubmit={handleUpdate} className="space-y-3 sm:space-y-4 md:space-y-5">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <SimpleInput 
                      label="First Name" 
                      value={editForm.firstName} 
                      onChange={(v) => setEditForm({...editForm, firstName: v})} 
                    />
                    <SimpleInput 
                      label="Last Name" 
                      value={editForm.lastName} 
                      onChange={(v) => setEditForm({...editForm, lastName: v})} 
                    />
                  </div>
                  
                  <SimpleInput 
                    label="Secure Phone" 
                    value={editForm.phone} 
                    onChange={(v) => setEditForm({...editForm, phone: v})} 
                  />
                  
                  {/* Vape Preferences */}
                  <div className="pt-2 sm:pt-3 border-t border-white/5 space-y-2 sm:space-y-3">
                    <h4 className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
                      <Zap size={10} /> Vape Personalization
                    </h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <SimpleInput 
                        label="Fav Flavor" 
                        value={editForm.favoriteFlavor} 
                        onChange={(v) => setEditForm({...editForm, favoriteFlavor: v})} 
                      />
                      <div className="space-y-1">
                        <label className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1 sm:ml-2">
                          Style
                        </label>
                        <select 
                          value={editForm.vapeStyle}
                          onChange={(e) => setEditForm({...editForm, vapeStyle: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 sm:py-2.5 text-[10px] sm:text-xs text-white focus:border-[#D4AF37]/50 outline-none transition-all"
                        >
                          <option value="MTL">MTL</option>
                          <option value="DTL">DTL</option>
                          <option value="RDL">RDL</option>
                        </select>
                      </div>
                    </div>
                    <SimpleInput 
                      label="Bio" 
                      value={editForm.bio} 
                      onChange={(v) => setEditForm({...editForm, bio: v})} 
                    />
                  </div>

                  {/* Address Section */}
                  <div className="pt-2 sm:pt-3 border-t border-white/5 space-y-2 sm:space-y-3">
                    <h4 className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
                      <MapPin size={10} /> Dispatch Location
                    </h4>
                    <SimpleInput 
                      label="Street" 
                      value={editForm.streetAddress} 
                      onChange={(v) => setEditForm({...editForm, streetAddress: v})} 
                    />
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <SimpleInput 
                        label="City" 
                        value={editForm.city} 
                        onChange={(v) => setEditForm({...editForm, city: v})} 
                      />
                      <SimpleInput 
                        label="Postal" 
                        value={editForm.postalCode} 
                        onChange={(v) => setEditForm({...editForm, postalCode: v})} 
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <div className="p-2 sm:p-3 bg-rose-500/10 text-rose-500 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest border border-rose-500/20">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button 
                    type="submit" 
                    disabled={isUpdating}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black rounded-xl sm:rounded-2xl font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest hover:shadow-[0_5px_20px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                      {isUpdating ? (
                        <>
                          <Loader2 size={10} className="animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        "Authorize Sync"
                      )}
                    </span>
                    {!isUpdating && (
                      <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile-Optimized Detail Row
const DetailRow = ({ icon, iconSm, label, value }: any) => (
  <div className="flex items-center gap-2 sm:gap-3 group">
    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-all">
      <span className="sm:hidden text-[#D4AF37]">{icon}</span>
      <span className="hidden sm:block text-[#D4AF37]">{iconSm || icon}</span>
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-600">{label}</p>
      <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white truncate">{value}</p>
    </div>
  </div>
);

// Mobile-Optimized Stat Card
const StatCard = ({ icon, iconSm, label, value }: any) => (
  <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center group hover:border-[#D4AF37]/30 transition-all">
    <div className="mb-1.5 sm:mb-2 p-1.5 sm:p-2 rounded-lg bg-white/5 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
      <span className="sm:hidden">{icon}</span>
      <span className="hidden sm:block">{iconSm || icon}</span>
    </div>
    <p className="text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">{label}</p>
    <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-white truncate max-w-full px-1">{value || "None"}</p>
  </div>
);

// Mobile-Optimized Input
const SimpleInput = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-1 flex-1">
    <label className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1 sm:ml-2">
      {label}
    </label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-[10px] md:text-xs text-white focus:border-[#D4AF37]/50 outline-none transition-all placeholder:text-zinc-700" 
    />
  </div>
);

// Mobile-Optimized Order Row
const OrderRow = ({ order, index }: { order: any; index: number }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.05 }}
    className="p-3 sm:p-4 hover:bg-white/[0.02] transition-colors group cursor-pointer border-b border-white/5 last:border-0"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
          <Package size={14} className="sm:hidden" />
          <Package size={16} className="hidden sm:block" />
        </div>
        <div>
          <p className="text-[9px] sm:text-[10px] md:text-xs font-black text-white uppercase tracking-tight">
            Order #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="text-[6px] sm:text-[7px] md:text-[8px] text-zinc-600 flex items-center gap-1 mt-0.5">
            <Calendar size={8} className="sm:hidden" />
            <Calendar size={9} className="hidden sm:block" />
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[9px] sm:text-[10px] md:text-xs font-black text-white">Rs. {order.totalAmount?.toLocaleString()}</p>
        <StatusBadge status={order.status} />
      </div>
    </div>
  </motion.div>
);

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toLowerCase() || 'pending';
  const config = {
    pending: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    shipped: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    delivered: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    cancelled: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
  }[s as 'pending' | 'shipped' | 'delivered' | 'cancelled'] || 'text-gray-500 bg-gray-500/10 border-gray-500/20';

  return (
    <span className={`inline-block text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full border ${config} backdrop-blur-md`}>
      {s}
    </span>
  );
};

export default ProfilePage;