"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, Mail, Phone, MapPin, Camera, X, 
  Loader2, Package, LogOut,
  Clock, CheckCircle2, Truck, AlertCircle,
  Flame, Droplets, Zap,
  ShoppingBag, ChevronRight, Cloud, Calendar
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

  // FIXED: Fetching orders using the Authorization Token
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
      
      // Backend already filters by role/email, so we just set the response data
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
          bio: parsed.bio || "Cloud chaser and flavor enthusiast. Living that vape life! 💨",
          favoriteFlavor: parsed.favoriteFlavor || "Strawberry Ice",
          vapeStyle: parsed.vapeStyle || "DTL"
        });
        // Trigger order fetch after user is loaded
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
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0b0e]">
      <Loader2 className="animate-spin text-purple-500 mb-4" size={40} />
      <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Synchronizing Profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-gray-200 pb-20 selection:bg-purple-500/30">
      <Navbar />
      
      {/* Cover Section */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img src={coverPhoto} className="w-full h-full object-cover opacity-40" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Essential Profile Info */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111216] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full rounded-2xl border-4 border-[#0a0b0e] overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-600">
                  <img 
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=8b5cf6&color=fff&size=200&bold=true`} 
                    alt="Avatar" className="w-full h-full object-cover" 
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-2.5 rounded-xl border-4 border-[#0a0b0e] hover:scale-110 transition-transform">
                  <Camera size={16} />
                </button>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h1>
                <p className="text-purple-400 text-xs font-black uppercase tracking-widest mt-2 px-3 py-1 bg-purple-500/10 rounded-full inline-block border border-purple-500/20">
                  {user.role} Member
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full py-4 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all shadow-xl"
                >
                  <Edit3 size={16} /> Edit Details
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-white/5 text-gray-400 border border-white/5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  <LogOut size={16} /> End Session
                </button>
              </div>
            </motion.div>

            {/* Quick Summary Info */}
            <div className="bg-[#111216] border border-white/5 rounded-[2rem] p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Contact Archive</h3>
              <DetailRow icon={<Mail className="text-purple-400" />} label="Email" value={user.email} />
              <DetailRow icon={<Phone className="text-blue-400" />} label="Mobile" value={user.phone || "Not Set"} />
              <DetailRow icon={<MapPin className="text-green-400" />} label="Dispatch City" value={user.address?.city || "Not Set"} />
            </div>
          </div>

          {/* Right Column: Experience and History */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={<Cloud className="text-purple-400" />} label="Preferred Flavor" value={editForm.favoriteFlavor} />
              <StatCard icon={<Zap className="text-blue-400" />} label="Vape Style" value={editForm.vapeStyle} />
              <StatCard icon={<Package className="text-pink-400" />} label="Total Orders" value={orders.length} />
            </div>

            {/* Order Feed */}
            <div className="bg-[#111216] border border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <ShoppingBag size={20} className="text-purple-400" />
                  Recent Manifests
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {orders.length} Deliveries Logged
                </span>
              </div>

              <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto no-scrollbar">
                {isLoadingOrders ? (
                  <div className="p-20 text-center flex flex-col items-center">
                    <Loader2 className="animate-spin text-purple-500 mb-4" />
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Accessing Secure Logs...</p>
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order, idx) => (
                    <motion.div 
                      key={order._id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-6 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-white uppercase tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1 font-mono">
                              <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-white">Rs. {order.totalAmount?.toLocaleString()}</p>
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-20 text-center">
                    <ShoppingBag size={48} className="mx-auto text-gray-700 mb-4 opacity-20" />
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Zero Manifests Recorded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111216] border border-white/10 rounded-[2.5rem] w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl"
            >
              <div className="p-8 flex justify-between items-center border-b border-white/10">
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter italic">Patch Identity</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(90vh-160px)] no-scrollbar">
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <SimpleInput label="First Name" value={editForm.firstName} onChange={(v) => setEditForm({...editForm, firstName: v})} />
                    <SimpleInput label="Last Name" value={editForm.lastName} onChange={(v) => setEditForm({...editForm, lastName: v})} />
                  </div>
                  <SimpleInput label="Secure Phone" value={editForm.phone} onChange={(v) => setEditForm({...editForm, phone: v})} />
                  
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-400">Vape Personalization</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <SimpleInput label="Fav Flavor" value={editForm.favoriteFlavor} onChange={(v) => setEditForm({...editForm, favoriteFlavor: v})} />
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Style</label>
                        <select 
                          value={editForm.vapeStyle}
                          onChange={(e) => setEditForm({...editForm, vapeStyle: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none appearance-none transition-all"
                        >
                          <option value="MTL">MTL</option>
                          <option value="DTL">DTL</option>
                          <option value="RDL">RDL</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-400">Dispatch Location</h4>
                    <SimpleInput label="Street" value={editForm.streetAddress} onChange={(v) => setEditForm({...editForm, streetAddress: v})} />
                    <div className="grid grid-cols-2 gap-4">
                      <SimpleInput label="City" value={editForm.city} onChange={(v) => setEditForm({...editForm, city: v})} />
                      <SimpleInput label="Postal" value={editForm.postalCode} onChange={(v) => setEditForm({...editForm, postalCode: v})} />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdating ? <Loader2 size={16} className="animate-spin" /> : "Authorize Sync"}
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

const DetailRow = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</p>
      <p className="text-sm font-bold text-white truncate">{value}</p>
    </div>
  </div>
);

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-[#111216] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center group hover:border-purple-500/30 transition-all">
    <div className="mb-3 p-3 rounded-xl bg-white/5 group-hover:bg-purple-500 group-hover:text-white transition-all">
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-bold text-white">{value || "None"}</p>
  </div>
);

const SimpleInput = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition-all placeholder-gray-700" 
    />
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toLowerCase() || 'pending';
  const config = {
    pending: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    shipped: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    delivered: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    cancelled: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
  }[s as 'pending' | 'shipped' | 'delivered' | 'cancelled'] || 'text-gray-500 bg-gray-500/10 border-gray-500/20';

  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${config} backdrop-blur-md`}>
      {s}
    </span>
  );
};

export default ProfilePage;