"use client";

import React, { useEffect, useState, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Mail,
  Phone,
  MapPin,
  Camera,
  X,
  Loader2,
  Package,
  ShoppingBag,
  Calendar,
  Shield,
  Sparkles,
  Crown,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import Navbar from "../components/navbar";
import { apiUrl, getAuthHeaders } from "@/app/lib/api";
import { getErrorMessage } from "@/app/lib/errors";
import PhoneRegionSelect from "@/app/components/phone_region_select";
import {
  DEFAULT_PHONE_REGION,
  combinePhoneNumber,
  normalizePhoneDigits,
  splitPhoneNumber,
} from "@/app/lib/phone";
import type { AppUser } from "@/app/lib/types";

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// --- Interfaces ---
interface OrderedItem {
  id: string;
  name: string;
  basePrice: number;
  variant: {
    vKey: string;
    flavor: string;
    variantImage: string[];
    qty: number;
  };
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface User extends AppUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    address: string;
    city: string;
    postalCode: string;
  };
  profilePicture: string;
  role: string;
  createdAt: string;
  isBlocked: boolean;
}

interface Order {
  id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderedItems: OrderedItem[];
  shippingAddress: ShippingAddress;
}

interface EditForm {
  firstName: string;
  lastName: string;
  phoneRegion: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  profilePicture: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [editForm, setEditForm] = useState<EditForm>({
    firstName: "",
    lastName: "",
    phoneRegion: DEFAULT_PHONE_REGION,
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    profilePicture: "",
  });

  const coverPhoto =
    "https://images.unsplash.com/photo-1479669732031-affb2ce2d265?q=80&w=1332&auto=format&fit=crop";

  const fetchOrderHistory = async () => {
    setIsLoadingOrders(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoadingOrders(false);
      return;
    }

    try {
      const response = await axios.get(apiUrl("/orders/getOrders"), {
        headers: getAuthHeaders(),
      });
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const loadUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed: User = JSON.parse(storedUser);
        const parsedPhone = splitPhoneNumber(parsed.phone);
        setUser(parsed);
        setEditForm({
          firstName: parsed.firstName || "",
          lastName: parsed.lastName || "",
          phoneRegion: parsedPhone.regionCode,
          phoneNumber: parsedPhone.localNumber,
          address: parsed.address?.address || "",
          city: parsed.address?.city || "",
          postalCode: parsed.address?.postalCode || "",
          profilePicture: parsed.profilePicture || "",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user._id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile").getPublicUrl(filePath);

      const response = await axios.put(
        apiUrl(`/users/edit/${encodeURIComponent(user.email)}`),
        {
          profilePicture: publicUrl,
        },
        {
          headers: getAuthHeaders(),
        },
      );

      if (response.status === 200) {
        const updatedUser = { ...user, profilePicture: publicUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditForm((prev) => ({ ...prev, profilePicture: publicUrl }));
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error: unknown) {
      alert(`Upload failed: ${getErrorMessage(error, "Upload failed.")}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdating(true);
    setErrorMsg(null);

    const payload = {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phone: combinePhoneNumber(editForm.phoneRegion, editForm.phoneNumber),
      address: {
        address: editForm.address,
        city: editForm.city,
        postalCode: editForm.postalCode,
      },
    };

    try {
      const response = await axios.put(
        apiUrl(`/users/edit/${encodeURIComponent(user.email)}`),
        payload,
        {
          headers: getAuthHeaders(),
        },
      );

      if (response.status === 200) {
        const updatedUser = { ...user, ...payload };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditModalOpen(false);
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error: unknown) {
      setErrorMsg(getErrorMessage(error, "Update failed."));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black'>
        <Loader2 className='animate-spin text-[#D4AF37]' size={40} />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#030303] text-white pb-20 selection:bg-[#D4AF37]/30 overflow-x-hidden'>
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]' />
        <div className='absolute top-20 right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-5' />
      </div>

      <Navbar />

      <div className='relative h-48 md:h-64 w-full overflow-hidden'>
        <img
          src={coverPhoto}
          className='w-full h-full object-cover opacity-20'
          alt='Cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-[#030303] to-transparent' />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 -mt-24'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          <div className='lg:col-span-4 space-y-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl'
            >
              <div className='relative w-32 h-32 mx-auto mb-6'>
                <div className='w-full h-full rounded-2xl border-2 border-[#D4AF37]/30 overflow-hidden bg-zinc-800'>
                  {isUploading ? (
                    <div className='w-full h-full flex items-center justify-center'>
                      <Loader2 className='animate-spin text-[#D4AF37]' />
                    </div>
                  ) : (
                    <img
                      src={
                        user.profilePicture ||
                        `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=D4AF37&color=000&bold=true`
                      }
                      className='w-full h-full object-cover'
                      alt='Profile'
                    />
                  )}
                </div>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept='image/*'
                  className='hidden'
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='absolute -bottom-2 -right-2 bg-[#D4AF37] text-black p-2 rounded-lg hover:scale-110 transition-transform'
                >
                  <Camera size={18} />
                </button>
              </div>

              <div className='text-center mb-8'>
                <h1 className='text-2xl font-black'>
                  {user.firstName} {user.lastName}
                </h1>
                <div className='flex items-center justify-center gap-2 mt-2'>
                  <Crown
                    size={14}
                    className={user.isBlocked ? "text-rose-400" : "text-[#D4AF37]"}
                  />
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                      user.isBlocked
                        ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                        : "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20"
                    }`}
                  >
                    {user.isBlocked ? "User Blocked" : user.role}
                  </span>
                </div>
              </div>

              <div className='space-y-3'>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className='w-full py-4 bg-[#D4AF37] text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2'
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
                {user.isBlocked && (
                  <button
                    onClick={() => router.push("/contact")}
                    className='w-full py-4 bg-rose-500/10 text-rose-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/15 transition-colors'
                  >
                    Contact Us
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className='w-full py-4 bg-white/5 text-zinc-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 transition-colors'
                >
                  Logout
                </button>
              </div>
            </motion.div>

            <div className='bg-zinc-900/50 border border-white/5 rounded-3xl p-6 space-y-4'>
              <h3 className='text-[10px] font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-2'>
                <Shield size={14} /> Account Details
              </h3>
              <DetailRow
                icon={<Mail size={16} />}
                label='Email'
                value={user.email}
              />
              <DetailRow
                icon={<Phone size={16} />}
                label='Contact'
                value={user.phone}
              />
              <DetailRow
                icon={<MapPin size={16} />}
                label='City'
                value={user.address?.city}
              />
            </div>
          </div>

          <div className='lg:col-span-8 space-y-6'>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              <StatCard
                icon={<ShoppingBag size={20} />}
                label='Total Orders'
                value={orders.length}
              />
              <StatCard
                icon={<Calendar size={20} />}
                label='Joined'
                value={new Date(user.createdAt).toLocaleDateString()}
              />
              <StatCard
                icon={<Zap size={20} />}
                label='Status'
                value={user.isBlocked ? "Suspended" : "Active"}
              />
            </div>

            <div className='bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col'>
              <div className='p-6 border-b border-white/5'>
                <h3 className='text-lg font-black flex items-center gap-2'>
                  <ShoppingBag size={20} className='text-[#D4AF37]' /> Order
                  History
                </h3>
              </div>

              {/* FIXED: Removed max-h constraint on mobile so the page scrolls naturally.
                  Added lg:max-h-[500px] and lg:overflow-y-auto to restrict height ONLY on desktop. */}
              <div className='divide-y divide-white/5 min-h-[300px] lg:max-h-[500px] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-[#D4AF37]/20 scrollbar-track-transparent'>
                {isLoadingOrders ? (
                  <div className='p-20 text-center'>
                    <Loader2 className='animate-spin text-[#D4AF37] mx-auto' />
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))
                ) : (
                  <div className='p-20 text-center text-zinc-600 font-black uppercase text-xs tracking-widest'>
                    No orders found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md'>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='bg-zinc-900 border border-[#D4AF37]/20 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden'
            >
              <div className='p-6 flex justify-between items-center border-b border-white/10'>
                <h2 className='text-lg font-black uppercase tracking-tighter flex items-center gap-2'>
                  <Sparkles size={18} className='text-[#D4AF37]' /> Update
                  Profile
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className='text-zinc-500 hover:text-white'
                >
                  <X size={24} />
                </button>
              </div>

              <div className='p-6 overflow-y-auto max-h-[calc(90vh-100px)]'>
                <form onSubmit={handleUpdate} className='space-y-6'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <SimpleInput
                      label='First Name'
                      value={editForm.firstName}
                      onChange={(v) =>
                        setEditForm({ ...editForm, firstName: v })
                      }
                    />
                    <SimpleInput
                      label='Last Name'
                      value={editForm.lastName}
                      onChange={(v) =>
                        setEditForm({ ...editForm, lastName: v })
                      }
                    />
                  </div>

                  <PhoneField
                    label='WhatsApp Number'
                    regionCode={editForm.phoneRegion}
                    localNumber={editForm.phoneNumber}
                    onRegionChange={(value) =>
                      setEditForm({ ...editForm, phoneRegion: value })
                    }
                    onLocalNumberChange={(value) =>
                      setEditForm({
                        ...editForm,
                        phoneNumber: normalizePhoneDigits(value),
                      })
                    }
                  />

                  <div className='space-y-4 pt-4 border-t border-white/5'>
                    <h4 className='text-[10px] font-black uppercase tracking-widest text-[#D4AF37]'>
                      Shipping Address
                    </h4>
                    <SimpleInput
                      label='Street Address'
                      value={editForm.address}
                      onChange={(v) => setEditForm({ ...editForm, address: v })}
                      autoComplete='shipping address-line1'
                    />
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <SimpleInput
                        label='City'
                        value={editForm.city}
                        onChange={(v) => setEditForm({ ...editForm, city: v })}
                        autoComplete='shipping address-level2'
                      />
                      <SimpleInput
                        label='Postal Code'
                        value={editForm.postalCode}
                        onChange={(v) =>
                          setEditForm({ ...editForm, postalCode: v })
                        }
                        autoComplete='shipping postal-code'
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className='p-3 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black border border-rose-500/20'>
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type='submit'
                    disabled={isUpdating}
                    className='w-full py-4 bg-[#D4AF37] text-black rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50'
                  >
                    {isUpdating ? "Syncing..." : "Save Changes"}
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

// --- Sub-Components ---

const OrderRow = ({ order }: { order: Order }) => {
  const [isHovered, setIsHovered] = useState(false);
  const normalizedStatus = order.status?.toLowerCase() || "pending";

  const statusClassName =
    normalizedStatus === "delivered" || normalizedStatus === "approved"
      ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
      : normalizedStatus === "shipped"
        ? "border-sky-500/20 text-sky-400 bg-sky-500/5"
        : normalizedStatus === "pending" ||
            normalizedStatus === "cancelled" ||
            normalizedStatus === "rejected"
          ? "border-rose-500/20 text-rose-400 bg-rose-500/5"
          : "border-amber-500/20 text-amber-400 bg-amber-500/5";

  return (
    <motion.div
      // Mobile: Toggle on tap, Desktop: Toggle on hover
      onClick={() => setIsHovered(!isHovered)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='relative overflow-hidden transition-all duration-300 border-b border-white/5 last:border-0'
    >
      <div className='p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition-colors'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0'>
            <Package size={20} />
          </div>
          <div className='min-w-0'>
            <div className='flex items-center gap-2'>
              <p className='text-sm font-black uppercase tracking-tight truncate'>
                {order.orderId || `Order #${order.id.slice(-6).toUpperCase()}`}
              </p>
              <ChevronRight
                size={14}
                className={`text-zinc-600 transition-transform duration-300 ${
                  isHovered ? "rotate-90 text-[#D4AF37]" : ""
                }`}
              />
            </div>
            <p className='text-[10px] text-zinc-500'>
              {new Date(order.createdAt).toDateString()}
            </p>
          </div>
        </div>

        <div className='text-right shrink-0 ml-2'>
          <p className='font-black text-white text-sm'>
            Rs. {order.totalAmount?.toLocaleString()}
          </p>
          <span
            className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border backdrop-blur-md ${statusClassName}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className='bg-black/40 px-5 pb-5'
          >
            <div className='pt-2 space-y-4'>
              <div className='flex justify-between items-center border-b border-white/5 pb-2'>
                <p className='text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]/60'>
                  Manifest Items
                </p>
                {order.shippingAddress && (
                  <p className='text-[8px] text-zinc-500 uppercase tracking-widest'>
                    Dispatch to: {order.shippingAddress.city}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {order.orderedItems.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center gap-3 bg-white/[0.02] border border-white/5 p-2 rounded-xl group/item transition-colors hover:border-[#D4AF37]/30'
                  >
                    <div className='w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800 border border-white/5'>
                      <img
                        src={item.variant.variantImage[0]}
                        alt={item.name}
                        className='w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-[10px] font-bold text-white truncate'>
                        {item.name}
                      </p>
                      <div className='flex items-center gap-2'>
                        <span className='text-[9px] text-[#D4AF37] font-medium'>
                          {item.variant.flavor}
                        </span>
                        <span className='text-[9px] text-zinc-600'>
                          x{item.variant.qty}
                        </span>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-[10px] font-black text-zinc-300'>
                        Rs.{" "}
                        {(item.basePrice * item.variant.qty).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Helper Components ---
const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
}) => (
  <div className='flex items-center gap-4'>
    <div className='text-[#D4AF37]'>{icon}</div>
    <div>
      <p className='text-[8px] font-black uppercase text-zinc-500'>{label}</p>
      <p className='text-xs font-bold'>{value || "N/A"}</p>
    </div>
  </div>
);

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className='bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-center'>
    <div className='text-[#D4AF37] mb-2 flex justify-center'>{icon}</div>
    <p className='text-[8px] font-black uppercase text-zinc-500'>{label}</p>
    <p className='text-sm font-black'>{value}</p>
  </div>
);

const SimpleInput = ({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) => (
  <div className='space-y-1'>
    <label className='text-[9px] font-black uppercase text-zinc-500 ml-2'>
      {label}
    </label>
    <input
      type='text'
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37]/50 outline-none transition-all'
    />
  </div>
);

const PhoneField = ({
  label,
  regionCode,
  localNumber,
  onRegionChange,
  onLocalNumberChange,
}: {
  label: string;
  regionCode: string;
  localNumber: string;
  onRegionChange: (value: string) => void;
  onLocalNumberChange: (value: string) => void;
}) => (
  <div className='space-y-1'>
    <label className='text-[9px] font-black uppercase text-zinc-500 ml-2'>
      {label}
    </label>
    <div className='grid grid-cols-[108px_minmax(0,1fr)] sm:grid-cols-[120px_minmax(0,1fr)] gap-3'>
      <PhoneRegionSelect
        value={regionCode}
        onChange={onRegionChange}
        buttonClassName='bg-white/5 border-white/10 rounded-xl px-2.5 sm:px-3 py-3 text-sm'
      />
      <input
        type='tel'
        inputMode='numeric'
        required
        value={localNumber}
        onChange={(e) => onLocalNumberChange(e.target.value)}
        placeholder='WhatsApp number'
        className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37]/50 outline-none transition-all placeholder:text-zinc-500 placeholder:opacity-100'
      />
    </div>
  </div>
);

export default ProfilePage;
