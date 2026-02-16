"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, Mail, Phone, MapPin, Zap, Camera, X, 
  Save, Loader2, ShieldCheck, Package, ShoppingBag, LogOut 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../componenets/navbar';

const ProfilePage = () => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State for editing
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    streetAddress: '',
    city: '',
    postalCode: ''
  });

  const coverPhoto = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop";

  const loadUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        // Sync the edit form state with current user data
        setEditForm({
          firstName: parsed.firstName || "",
          lastName: parsed.lastName || "",
          phone: parsed.phone || "",
          streetAddress: parsed.address?.address || "",
          city: parsed.address?.city || "",
          postalCode: parsed.address?.postalCode || ""
        });
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

    // Structure payload according to your Mongoose Schema
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
      // Assuming your backend update endpoint uses user._id
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API}/api/users/update/${user._id}`, payload);
      
      if (response.status === 200) {
        // 1. Update localStorage with new data
        const updatedUser = { ...user, ...payload };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // 2. Trigger Navbar refresh
        window.dispatchEvent(new Event('storage'));
        
        // 3. Update local state and close
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
    <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  return (
    <div className="bg-[#020617] min-h-screen text-slate-200 selection:bg-indigo-500/30">
      <Navbar />
      
      {/* --- HERO SECTION: COVER PHOTO --- */}
      <div className="relative h-[350px] w-full overflow-hidden">
        <img src={coverPhoto} className="w-full h-full object-cover opacity-60 scale-105" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
        
        <div className="absolute top-1/2 left-10 -translate-y-1/2">
           <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl"
           >
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Live Connection: Secure</span>
           </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10 pb-32">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: IDENTITY CARD --- */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 relative overflow-hidden"
            >
              <div className="relative w-32 h-32 mx-auto mb-6 group">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl relative z-10">
                  <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}&background=6366f1&color=fff`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-0 z-20 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl border-4 border-slate-900 group-hover:scale-110 transition-transform">
                  <Camera size={18} />
                </button>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-white tracking-tighter leading-none">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest mt-2">{user.role} Authorization</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-indigo-50 hover:text-white transition-all shadow-xl"
                >
                  <Edit3 size={16} /> Edit Terminal
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-white transition-all"
                >
                  <LogOut size={16} /> De-Authenticate
                </button>
              </div>
            </motion.div>

            <div className="bg-indigo-600 p-6 rounded-[2.5rem] flex items-center gap-4 text-white shadow-lg shadow-indigo-600/20">
              <ShieldCheck size={32} strokeWidth={3} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Security Status</p>
                <p className="text-sm font-bold">Identity Verified</p>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: ACTIVITY & DATA --- */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-3 gap-4">
              <StatBadge icon={<Package />} label="Transmissions" value="12" />
              <StatBadge icon={<ShoppingBag />} label="Bag Value" value="Active" />
              <StatBadge icon={<Zap />} label="Tier" value="Elite" />
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 space-y-10">
              <header className="flex justify-between items-center">
                <h2 className="text-2xl font-black tracking-tighter uppercase text-white">System Data.</h2>
                <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-widest uppercase opacity-60">
                   STATUS: ONLINE
                </div>
              </header>

              <div className="grid gap-10">
                <DetailRow icon={<Mail className="text-indigo-400" />} label="Comm Link" value={user.email} />
                <DetailRow icon={<Phone className="text-cyan-400" />} label="Secure Line" value={user.phone || "Not Set"} />
                <DetailRow icon={<MapPin className="text-purple-400" />} label="Dispatch Zone" value={user.address?.address || "No Address Set"} />
                <DetailRow icon={<Zap className="text-amber-400" />} label="City HQ" value={user.address?.city || "Unknown"} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- EDIT MODAL: DARK FROSTED GLASS --- */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[3rem] relative z-10 overflow-hidden shadow-2xl">
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Update Identity.</h2>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white"><X size={20}/></button>
                </div>

                {errorMsg && <p className="mb-4 text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 p-4 rounded-xl">{errorMsg}</p>}

                <form className="space-y-6" onSubmit={handleUpdate}>
                  <div className="grid grid-cols-2 gap-4">
                    <DarkInput label="First Name" value={editForm.firstName} onChange={(v:any) => setEditForm({...editForm, firstName: v})} />
                    <DarkInput label="Last Name" value={editForm.lastName} onChange={(v:any) => setEditForm({...editForm, lastName: v})} />
                  </div>
                  <DarkInput label="Secure Phone" value={editForm.phone} onChange={(v:any) => setEditForm({...editForm, phone: v})} />
                  
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <DarkInput label="Dispatch Address" value={editForm.streetAddress} onChange={(v:any) => setEditForm({...editForm, streetAddress: v})} />
                    <div className="grid grid-cols-2 gap-4">
                      <DarkInput label="City" value={editForm.city} onChange={(v:any) => setEditForm({...editForm, city: v})} />
                      <DarkInput label="Postal Code" value={editForm.postalCode} onChange={(v:any) => setEditForm({...editForm, postalCode: v})} />
                    </div>
                  </div>

                  <button disabled={isUpdating} type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] shadow-xl hover:bg-indigo-500 transition-all disabled:opacity-50">
                    {isUpdating ? <Loader2 className="animate-spin mx-auto" size={20}/> : "Synchronize Updates"}
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

/* --- MINI COMPONENTS --- */

const StatBadge = ({ icon, label, value }: any) => (
  <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] flex flex-col items-center text-center">
    <div className="text-indigo-500 mb-2">{icon}</div>
    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
    <p className="text-sm font-black text-white">{value}</p>
  </div>
);

const DetailRow = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-6 group">
    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:border-indigo-500/50">
      {icon}
    </div>
    <div>
      <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</h4>
      <p className="text-white font-bold tracking-tight text-lg">{value}</p>
    </div>
  </div>
);

const DarkInput = ({ label, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-indigo-500 transition-all outline-none" 
    />
  </div>
);

export default ProfilePage;