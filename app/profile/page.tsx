"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, Mail, Phone, MapPin, Zap, Camera, X, 
  Loader2, ShieldCheck, Package, ShoppingBag, LogOut,
  Clock, CheckCircle2, Truck, AlertCircle, ChevronRight
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
    postalCode: ''
  });

  const coverPhoto = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop";

  // Fetch Orders for the logged-in user
  const fetchOrderHistory = async (userId: string) => {
    setIsLoadingOrders(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/orders/getOrders`);
      // Filter orders where the user ID matches the current profile
      const userOrders = response.data.filter((order: any) => 
        (order.user?._id === userId || order.user === userId)
      );
      // Sort by newest first
      userOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(userOrders);
    } catch (err) {
      console.error("Failed to fetch order manifest:", err);
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
          postalCode: parsed.address?.postalCode || ""
        });
        fetchOrderHistory(parsed._id);
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
      setErrorMsg(err.response?.data?.message || "Failed to synchronize profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617]">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">Accessing Terminal...</p>
    </div>
  );

  return (
    <div className="bg-[#020617] min-h-screen text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* --- HERO COVER --- */}
      <div className="relative h-[350px] w-full overflow-hidden">
        <img src={coverPhoto} className="w-full h-full object-cover opacity-40 scale-105" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-32">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* --- SIDEBAR: IDENTITY CARD --- */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 relative overflow-hidden shadow-2xl"
            >
              <div className="relative w-36 h-36 mx-auto mb-8 group">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl relative z-10">
                  <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}&background=6366f1&color=fff`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-1 right-1 z-20 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl border-4 border-slate-900 group-hover:scale-110 transition-transform">
                  <Camera size={18} />
                </button>
              </div>

              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-3">
                  {user.firstName}
                </h1>
                <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.3em] bg-indigo-500/10 py-2 rounded-full border border-indigo-500/20 inline-block px-6">
                    {user.role} Authority
                </p>
              </div>

              <div className="space-y-4">
                <button onClick={() => setIsEditModalOpen(true)} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95">
                  <Edit3 size={16} /> Edit Terminal
                </button>
                <button onClick={handleLogout} className="w-full py-5 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-rose-500 hover:text-white transition-all active:scale-95">
                  <LogOut size={16} /> De-Authenticate
                </button>
              </div>
            </motion.div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-[3rem] flex items-center gap-6 text-white shadow-2xl shadow-indigo-600/20">
              <ShieldCheck size={40} strokeWidth={2.5} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Security Protocol</p>
                <p className="text-lg font-bold">Identity Verified</p>
              </div>
            </div>
          </div>

          {/* --- MAIN CONTENT: ORDER MANIFEST --- */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <StatBadge icon={<Package size={20}/>} label="Orders" value={orders.length} />
              <StatBadge icon={<ShoppingBag size={20}/>} label="Bag Status" value="Active" />
              <StatBadge icon={<Zap size={20}/>} label="Rank" value="Elite" />
            </div>

            {/* ORDER LIST PANEL */}
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase text-white">Order Manifest.</h2>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Live fulfillment sequence</p>
                </div>
                <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black tracking-widest text-indigo-400 uppercase">
                    Sync_Status: Online
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoadingOrders ? (
                  <div className="py-24 flex flex-col items-center justify-center gap-4 text-zinc-600">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Deciphering archives...</p>
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={order._id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all gap-4"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-indigo-500 border border-white/5 group-hover:scale-110 transition-transform">
                           <Package size={24} />
                        </div>
                        <div>
                          <p className="text-white font-bold tracking-tight mb-1">Transmission #{order._id.slice(-6).toUpperCase()}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                Rs. {order.totalAmount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-none border-white/5 pt-4 sm:pt-0">
                         <StatusBadge status={order.status} />
                         <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 group-hover:text-white group-hover:border-white/30 transition-all">
                            <ChevronRight size={18} />
                         </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                    <AlertCircle className="mx-auto text-zinc-800 mb-4" size={40} />
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Zero Transmissions Detected</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* TERMINAL DATA PANEL */}
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-10 space-y-10">
              <h2 className="text-xl font-black tracking-tighter uppercase text-white/40">Core Metadata.</h2>
              <div className="grid gap-8">
                <DetailRow icon={<Mail className="text-indigo-400" />} label="Comm link" value={user.email} />
                <DetailRow icon={<Phone className="text-cyan-400" />} label="Secure line" value={user.phone || "Not Set"} />
                <DetailRow icon={<MapPin className="text-purple-400" />} label="Dispatch zone" value={user.address?.address || "Pending Coordinate Data"} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- EDIT TERMINAL MODAL --- */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#020617] border border-white/10 w-full max-w-xl rounded-[3.5rem] relative z-10 overflow-hidden shadow-2xl">
              <div className="p-12">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Patch Identity.</h2>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-3 bg-white/5 rounded-full hover:bg-rose-500/20 hover:text-rose-500 transition-all text-white"><X size={20}/></button>
                </div>

                {errorMsg && <p className="mb-6 text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">{errorMsg}</p>}

                <form className="space-y-8" onSubmit={handleUpdate}>
                  <div className="grid grid-cols-2 gap-6">
                    <DarkInput label="First Callname" value={editForm.firstName} onChange={(v:string) => setEditForm({...editForm, firstName: v})} />
                    <DarkInput label="Last Callname" value={editForm.lastName} onChange={(v:string) => setEditForm({...editForm, lastName: v})} />
                  </div>
                  <DarkInput label="Secure Line" value={editForm.phone} onChange={(v:string) => setEditForm({...editForm, phone: v})} />
                  
                  <div className="pt-8 border-t border-white/5 space-y-6">
                    <DarkInput label="Dispatch Coordinates" value={editForm.streetAddress} onChange={(v:string) => setEditForm({...editForm, streetAddress: v})} />
                    <div className="grid grid-cols-2 gap-6">
                      <DarkInput label="City HQ" value={editForm.city} onChange={(v:string) => setEditForm({...editForm, city: v})} />
                      <DarkInput label="Postal Index" value={editForm.postalCode} onChange={(v:string) => setEditForm({...editForm, postalCode: v})} />
                    </div>
                  </div>

                  <button disabled={isUpdating} type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50">
                    {isUpdating ? <Loader2 className="animate-spin mx-auto" size={20}/> : "Execute Synchronize"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- MINI UI COMPONENTS --- */

const StatusBadge = ({ status }: { status: string }) => {
    const s = status?.toLowerCase() || 'pending';
    
    const config: Record<string, { color: string, icon: React.ReactNode }> = {
        'pending': { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: <Clock size={12} /> },
        'shipped': { color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', icon: <Truck size={12} /> },
        'delivered': { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: <CheckCircle2 size={12} /> },
        'cancelled': { color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', icon: <X size={12} className="rotate-45" /> }
    };

    const active = config[s] || config['pending'];

    return (
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${active.color} backdrop-blur-md`}>
            {active.icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{s}</span>
        </div>
    );
};

const StatBadge = ({ icon, label, value }: any) => (
  <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center text-center shadow-xl flex-1">
    <div className="text-indigo-400 mb-3">{icon}</div>
    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">{label}</p>
    <p className="text-lg font-black text-white">{value}</p>
  </div>
);

const DetailRow = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-8 group">
    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1">{label}</h4>
      <p className="text-white font-bold tracking-tight text-xl break-all">{value}</p>
    </div>
  </div>
);

const DarkInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-6">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-white font-bold focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-zinc-800" 
    />
  </div>
);

export default ProfilePage;