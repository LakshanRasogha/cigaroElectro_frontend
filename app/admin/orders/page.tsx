"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Search,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  MoreVertical,
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { apiUrl, getAuthHeaders } from "@/app/lib/api";
import { getEntityId, getListKey } from "@/app/lib/entity_id";

// --- TYPES ---

interface Variant {
  vKey: string;
  flavor: string;
  variantImage: string[];
  qty: number;
}

interface OrderedItem {
  id?: string;
  _id: string;
  productKey: string;
  name: string;
  basePrice: number;
  deliveryFee: number;
  variant: Variant;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode?: string;
  phone: string;
}

interface Order {
  id?: string;
  _id: string;
  orderId: string;
  email: string;
  // Added these fields based on your backend update
  firstName?: string;
  lastName?: string;
  shippingAddress: ShippingAddress;
  orderDate: string;
  orderedItems: OrderedItem[];
  isApproved: boolean;
  status: string;
  totalAmount: number;
}

// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status ? status.toLowerCase() : "pending";

  let style = "bg-slate-100 text-slate-600 border-slate-200";
  let icon = <Clock size={12} />;

  if (normalizedStatus === "approved") {
    style = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    icon = <CheckCircle2 size={12} />;
  } else if (normalizedStatus === "shipped") {
    style = "bg-sky-500/10 text-sky-600 border-sky-500/20";
    icon = <Truck size={12} />;
  } else if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "rejected"
  ) {
    style = "bg-rose-500/10 text-rose-500 border-rose-500/20";
    icon = <XCircle size={12} />;
  } else if (normalizedStatus === "pending") {
    style = "bg-amber-500/10 text-amber-500 border-amber-500/20";
    icon = <Clock size={12} />;
  }

  return (
    <span
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${style}`}
    >
      {icon}
      {status}
    </span>
  );
};

// Props interface for the card
interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: string) => Promise<void>;
}

const OrderCard = ({ order, onUpdateStatus }: OrderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const totalItems =
    order.orderedItems?.reduce(
      (acc, item) => acc + (item.variant?.qty || 0),
      0,
    ) || 0;

  // Construct Full Name
  const fullName = order.firstName
    ? `${order.firstName} ${order.lastName || ""}`
    : "Guest User";

  // Generate avatar URL based on name
  const avatarUrl = `https://ui-avatars.com/api/?name=${fullName}&background=0f172a&color=fff&size=128`;

  // Handler for status updates
  const handleAction = async (e: React.MouseEvent, status: string) => {
    e.stopPropagation();
    setShowActions(false);

    if (confirm(`Change order status to ${status}?`)) {
      setIsProcessing(true);
      await onUpdateStatus(order.orderId, status);
      setIsProcessing(false);
    }
  };

  return (
    <div className='bg-white border border-slate-100 rounded-2xl overflow-visible hover:shadow-md transition-shadow duration-300 relative'>
      {/* --- Card Header --- */}
      <div
        className='p-5 cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition-colors rounded-t-2xl'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          {/* Left: ID, User & Date */}
          <div className='flex items-center gap-4'>
            {/* User Avatar */}
            <div className='w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0 overflow-hidden relative'>
              <img
                src={avatarUrl}
                alt='User'
                className='w-full h-full object-cover'
              />
            </div>

            <div>
              <div className='flex items-center gap-2'>
                <h3 className='text-sm font-black text-slate-900 uppercase tracking-wide'>
                  {order.orderId}
                </h3>
                {/* User Name Badge */}
                <span className='hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full'>
                  <UserIcon size={10} className='text-indigo-500' />
                  {fullName}
                </span>
              </div>
              <div className='flex items-center gap-2 text-xs text-slate-500 font-medium mt-1'>
                <Calendar size={12} />
                {new Date(order.orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          {/* Right: Status & Amount & Actions */}
          <div className='flex items-center gap-6 w-full md:w-auto justify-between md:justify-end'>
            <div className='flex flex-col items-end'>
              <p className='text-sm font-bold text-slate-900'>
                Rs. {order.totalAmount.toLocaleString()}
              </p>
              <p className='text-[10px] text-slate-500 uppercase tracking-wider'>
                {totalItems} Items
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <StatusBadge status={order.status} />

              <button className='p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-colors'>
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              <div className='relative'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className='p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors'
                >
                  {isProcessing ? (
                    <Loader2 size={16} className='animate-spin' />
                  ) : (
                    <MoreVertical size={16} />
                  )}
                </button>

                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className='absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className='p-1'>
                        <button
                          onClick={(e) => handleAction(e, "Approved")}
                          className='w-full text-left px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-2'
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button
                          onClick={(e) => handleAction(e, "Cancelled")}
                          className='w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2'
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                        <button
                          onClick={(e) => handleAction(e, "Shipped")}
                          className='w-full text-left px-3 py-2 text-xs font-bold text-sky-600 hover:bg-sky-50 rounded-lg flex items-center gap-2'
                        >
                          <Truck size={14} /> Mark Shipped
                        </button>
                        <button
                          onClick={(e) => handleAction(e, "Pending")}
                          className='w-full text-left px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 rounded-lg flex items-center gap-2'
                        >
                          <Clock size={14} /> Set Pending
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Expandable Details --- */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='border-t border-slate-100'
          >
            <div className='p-6 grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Items List */}
              <div className='lg:col-span-2 space-y-4'>
                <h4 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2'>
                  Items Ordered
                </h4>
                {order.orderedItems?.map((item) => (
                  <div
                    key={getListKey(
                      item,
                      `${item.productKey}-${item.variant?.vKey || item.name}`,
                    )}
                    className='flex gap-4 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors'
                  >
                    <div className='w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200'>
                      <img
                        src={
                          item.variant?.variantImage?.[0] || "/placeholder.png"
                        }
                        alt={item.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='flex-1'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h5 className='text-sm font-bold text-slate-900'>
                            {item.name}
                          </h5>
                          <p className='text-[10px] text-slate-500 mt-0.5'>
                            Key: {item.productKey}
                          </p>
                        </div>
                        <span className='text-xs font-bold text-slate-900'>
                          Rs. {item.basePrice.toLocaleString()}
                        </span>
                      </div>
                      <div className='mt-2 flex gap-2'>
                        <span className='text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold border border-indigo-100'>
                          {item.variant?.flavor || "Standard"}
                        </span>
                        <span className='text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold border border-slate-200'>
                          Qty: {item.variant?.qty || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer & Shipping Info */}
              <div className='flex flex-col gap-4'>
                <div className='bg-slate-50 p-5 rounded-2xl h-fit border border-slate-100'>
                  <h4 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4'>
                    Customer Profile
                  </h4>
                  <div className='space-y-4 mb-6'>
                    <div className='flex items-start gap-3'>
                      <div className='bg-white p-2 rounded-lg border border-slate-200'>
                        <UserIcon size={16} className='text-indigo-500' />
                      </div>
                      <div className='text-xs text-slate-600 font-medium'>
                        <p className='font-bold text-slate-900 text-sm'>
                          {fullName}
                        </p>
                        <p className='text-slate-500'>{order.email}</p>
                      </div>
                    </div>
                  </div>

                  <h4 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-t border-slate-200 pt-4'>
                    Shipping Address
                  </h4>

                  <div className='space-y-4'>
                    <div className='flex items-start gap-3'>
                      <MapPin
                        size={16}
                        className='text-indigo-500 mt-0.5 shrink-0'
                      />
                      <div className='text-xs text-slate-600 font-medium leading-relaxed'>
                        <p className='font-bold text-slate-900 mb-1'>Address</p>
                        <p>{order.shippingAddress?.address}</p>
                        <p>{order.shippingAddress?.city}</p>
                        {order.shippingAddress?.postalCode && (
                          <p>Postal: {order.shippingAddress.postalCode}</p>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <Phone size={16} className='text-indigo-500 shrink-0' />
                      <p className='text-xs text-slate-600 font-medium'>
                        {order.shippingAddress?.phone}
                      </p>
                    </div>

                    <div className='pt-4 mt-4 border-t border-slate-200'>
                      <div className='flex justify-between text-sm mt-3 pt-3 border-t border-slate-200'>
                        <span className='font-black text-slate-900'>
                          Grand Total
                        </span>
                        <span className='font-black text-indigo-600'>
                          Rs. {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Buttons for Pending Orders (Optional Visibility) */}
                {order.status.toLowerCase() === "pending" && (
                  <div className='grid grid-cols-2 gap-3 mt-auto'>
                    <button
                      onClick={(e) => handleAction(e, "Approved")}
                      disabled={isProcessing}
                      className='flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50'
                    >
                      {isProcessing ? (
                        <Loader2 className='animate-spin' size={14} />
                      ) : (
                        <ThumbsUp size={14} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={(e) => handleAction(e, "Cancelled")}
                      disabled={isProcessing}
                      className='flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-50 transition-all disabled:opacity-50'
                    >
                      {isProcessing ? (
                        <Loader2 className='animate-spin' size={14} />
                      ) : (
                        <ThumbsDown size={14} />
                      )}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN PAGE ---

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not Authenticated");
        setLoading(false);
        return;
      }

      const response = await axios.get(apiUrl("/orders/getOrders"), {
        headers: getAuthHeaders(),
      });

      setOrders(response.data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError(
          "Unauthorized: You do not have permission to view these orders.",
        );
      } else {
        setError("Failed to load orders. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Status Update ---
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.put(
        apiUrl(`/orders/status/${encodeURIComponent(orderId)}`),
        { status: newStatus },
        { headers: getAuthHeaders() },
      );

      // Optimistically update the UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? {
                ...order,
                status: newStatus,
                isApproved: newStatus === "Approved",
              }
            : order,
        ),
      );
    } catch (err: any) {
      console.error("Update status error:", err);
      alert("Failed to update status. Please check permissions or network.");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900'>
      <div className='max-w-5xl mx-auto'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8'>
          <div>
            <h1 className='text-3xl font-black text-slate-900 tracking-tight mb-2'>
              Order History
            </h1>
            <p className='text-sm text-slate-500 font-medium'>
              Manage and track all incoming orders.
            </p>
          </div>

          <div className='flex gap-3'>
            <div className='relative'>
              <Search
                className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <input
                type='text'
                placeholder='Search ID, Status or Email...'
                className='pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl w-full md:w-80 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={fetchOrders}
              className='p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors'
              title='Refresh Orders'
            >
              <Clock size={18} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mb-4'></div>
            <p className='text-xs font-black uppercase tracking-widest text-slate-400'>
              Syncing Orders...
            </p>
          </div>
        ) : error ? (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <AlertCircle size={48} className='text-rose-400 mb-4' />
            <p className='text-slate-900 font-bold mb-1'>Access Error</p>
            <p className='text-sm text-slate-500 mb-6'>{error}</p>
            <div className='flex gap-4'>
              <button
                onClick={fetchOrders}
                className='px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors'
              >
                Retry
              </button>
              {error.includes("Authenticated") && (
                <button
                  onClick={() => router.push("/")}
                  className='px-6 py-2 bg-white border border-slate-200 text-slate-900 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors'
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed'>
            <Package size={48} className='text-slate-200 mb-4' />
            <p className='text-slate-900 font-bold'>No orders found</p>
            <p className='text-sm text-slate-500 mt-1'>
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "Your order list is currently empty."}
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {filteredOrders.map((order) => (
              <OrderCard
                key={getListKey(order, order.orderId || getEntityId(order))}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
