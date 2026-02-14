"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Mail, Phone, MapPin, Zap, Camera, X, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '../componenets/navbar';

const ProfilePage = () => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          firstName: parsedUser.firstName || "User",
          lastName: parsedUser.lastName || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "Not provided",
          address: parsedUser.address || "No address set",
          role: parsedUser.role || "customer",
          avatar: parsedUser.profilePicture || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400",
        });
      } catch (error) {
        console.error("Failed to parse user data", error);
        router.push("/auth/login");
      }
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // API logic goes here
    setIsEditModalOpen(false);
  };

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen pt-32 pb-20 px-6 relative overflow-hidden flex justify-center items-start">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-50/30 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full relative z-10"
        >
          <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-800 relative">
               <div className="absolute top-6 right-8">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                      <Zap size={14} className="text-purple-400" fill="currentColor" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        {user.role} Member
                      </span>
                  </div>
               </div>
            </div>

            <div className="px-8 md:px-12 pb-12 -mt-16">
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-100">
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 bg-purple-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white">
                  <Camera size={18} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-slate-400 font-medium text-lg italic">Premium Studio Member</p>
                </div>
                <motion.button 
                  onClick={() => setIsEditModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-slate-200"
                >
                  Edit Profile <Edit3 size={16} />
                </motion.button>
              </div>

              <div className="grid gap-6">
                <InfoRow icon={<Mail size={20} />} label="Email Address" value={user.email} />
                <InfoRow icon={<Phone size={20} />} label="Phone Contact" value={user.phone} />
                <InfoRow icon={<MapPin size={20} />} label="Primary Location" value={user.address} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- POPUP MODAL --- */}
        <AnimatePresence>
          {isEditModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditModalOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
              >
                <div className="p-8 md:p-12">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Update Identity</h2>
                    <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                      <X size={24} className="text-slate-400" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <EditInput 
                        label="First Name" 
                        value={user.firstName} 
                        onChange={(v) => setUser({...user, firstName: v})} 
                      />
                      <EditInput 
                        label="Last Name" 
                        value={user.lastName} 
                        onChange={(v) => setUser({...user, lastName: v})} 
                      />
                    </div>
                    <EditInput 
                      label="Phone Number" 
                      value={user.phone} 
                      onChange={(v) => setUser({...user, phone: v})} 
                    />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Shipping Address</label>
                      <textarea 
                        value={user.address}
                        onChange={(e) => setUser({...user, address: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-purple-500/20 outline-none resize-none h-24"
                      />
                    </div>

                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-purple-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-purple-200"
                    >
                      Save Changes <Save size={18} />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

/* --- UI HELPERS --- */
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-colors group">
    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-purple-600 group-hover:shadow-md transition-all">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</h4>
      <p className="text-slate-900 font-bold tracking-tight">{value}</p>
    </div>
  </div>
);

const EditInput = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{label}</label>
    <input 
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
    />
  </div>
);

export default ProfilePage;