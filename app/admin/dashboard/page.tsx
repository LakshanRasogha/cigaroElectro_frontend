"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  TrendingUp,
  Zap,
  Search,
  Bell,
  ChevronRight,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  X,
  MapPin,
  History,
  Mail,
  ShoppingCart,
  Calendar,
  Globe,
  LucideIcon,
  ShieldAlert,
  ClipboardList,
  Menu, // Imported Menu icon
  Loader2,
} from "lucide-react";
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import InventoryPage from "../inventory/page";
// IMPORTANT: Ensure you have created this file at src/app/orders/page.tsx or equivalent
import OrdersPage from "../orders/page";
import { apiUrl, getAuthHeaders } from "@/app/lib/api";

// --- TYPES & INTERFACES ---

interface CustomerOrder {
  id: string;
  date: string;
  amount: string;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  status: string;
  isBlocked: boolean;
  role: string;
  phone?: string;
  profilePicture?: string;
  totalOrders: number;
  totalSpent: string;
  joinedDate: string;
  address?: {
    address?: string;
    city?: string;
    postalCode?: string;
  };
  orders: CustomerOrder[];
}

interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
  address?: {
    address?: string;
    city?: string;
    postalCode?: string;
  };
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

interface BackendOrder {
  id?: string;
  orderId: string;
  email: string;
  totalAmount: number | string;
  status: string;
  orderDate?: string;
  createdAt?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

// --- MOCK DATA ---
const revenueData = [
  { name: "Mon", sales: 4000, puffs: 2400, orders: 120 },
  { name: "Tue", sales: 3000, puffs: 1398, orders: 98 },
  { name: "Wed", sales: 6000, puffs: 9800, orders: 210 },
  { name: "Thu", sales: 2780, puffs: 3908, orders: 115 },
  { name: "Fri", sales: 1890, puffs: 4800, orders: 84 },
  { name: "Sat", sales: 8390, puffs: 3800, orders: 340 },
  { name: "Sun", sales: 9490, puffs: 4300, orders: 412 },
];

// --- SUB-COMPONENTS ---

const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
}: StatCardProps) => (
  <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group'>
    <div className='flex justify-between items-start mb-4'>
      <div className='p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors'>
        <Icon
          size={20}
          className='text-slate-700 group-hover:text-indigo-600'
        />
      </div>
      <div
        className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-emerald-500" : "text-rose-500"}`}
      >
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {change}
      </div>
    </div>
    <h3 className='text-slate-500 text-sm font-medium mb-1'>{title}</h3>
    <p className='text-2xl font-bold text-slate-900'>{value}</p>
  </div>
);

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
}: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active
        ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-lg shadow-indigo-100"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`}
  >
    <Icon
      size={20}
      className={
        active ? "text-white" : "group-hover:scale-110 transition-transform"
      }
    />
    <span className='font-semibold text-sm'>{label}</span>
    {active && (
      <div className='ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-50' />
    )}
  </button>
);

const CustomerRow = ({
  customer,
  onDetailClick,
  onToggleBlock,
  isUpdating,
}: {
  customer: Customer;
  onDetailClick: (c: Customer) => void;
  onToggleBlock: (customer: Customer) => void;
  isUpdating: boolean;
}) => (
  <tr className='group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors'>
    <td className='py-4 px-6'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold'>
          {customer.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <p className='font-bold text-slate-900 text-sm'>{customer.name}</p>
          <p className='text-xs text-slate-400'>{customer.email}</p>
        </div>
      </div>
    </td>
    <td className='py-4 px-2 text-sm text-slate-600 font-medium'>
      <div className='flex items-center gap-1.5'>
        <MapPin size={14} className='text-slate-400' />
        {customer.address?.city || "No city"}{" "}
        {customer.address?.postalCode ? `• ${customer.address.postalCode}` : ""}
      </div>
    </td>
    <td className='py-4 px-2 text-sm text-slate-600 font-bold'>
      {customer.totalOrders} Orders
    </td>
    <td className='py-4 px-2'>
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          customer.status === "Active"
            ? "bg-emerald-50 text-emerald-600"
            : "bg-rose-50 text-rose-600"
        }`}
      >
        {customer.status}
      </span>
    </td>
    <td className='py-4 px-6 text-right'>
      <div className='flex items-center justify-end gap-2'>
        <button
          onClick={() => onDetailClick(customer)}
          className='p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all'
        >
          <History size={18} />
        </button>
        <button
          onClick={() => onToggleBlock(customer)}
          disabled={isUpdating}
          className={`p-2 rounded-lg transition-all ${
            customer.isBlocked
              ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              : "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          } disabled:opacity-50`}
        >
          {isUpdating ? (
            <Loader2 size={18} className='animate-spin' />
          ) : (
            <ShieldAlert size={18} />
          )}
        </button>
      </div>
    </td>
  </tr>
);

const CustomerDetailModal = ({
  customer,
  isOpen,
  onClose,
  onToggleBlock,
  isUpdating,
}: {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleBlock: (customer: Customer) => void;
  isUpdating: boolean;
}) => {
  if (!isOpen || !customer) return null;
  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-slate-900/60 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200'>
        <div className='p-8 border-b border-slate-100 flex justify-between items-start'>
          <div className='flex gap-4'>
            <div className='w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black'>
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h2 className='text-2xl font-black text-slate-900 tracking-tight'>
                {customer.name}
              </h2>
              <div className='flex items-center gap-3 mt-1'>
                <span className='text-sm text-slate-500 flex items-center gap-1'>
                  <Mail size={14} /> {customer.email}
                </span>
                {customer.phone && (
                  <span className='text-sm text-slate-500 flex items-center gap-1'>
                    {customer.phone}
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    customer.status === "Active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {customer.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-slate-100 rounded-full transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        <div className='p-8 grid grid-cols-2 gap-8'>
          <div>
            <h3 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1'>
              Shipping Profile
            </h3>
            <div className='bg-slate-50 p-5 rounded-2xl space-y-3'>
              <div className='flex items-start gap-3'>
                <MapPin size={18} className='text-indigo-500 mt-0.5' />
                <div>
                  <p className='text-sm font-bold text-slate-900'>
                    {customer.address?.address || "No saved address"}
                  </p>
                  <p className='text-sm text-slate-600'>
                    {customer.address?.city || "No city"}
                    {customer.address?.postalCode
                      ? ` • ${customer.address.postalCode}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1'>
              Recent Transmissions
            </h3>
            <div className='space-y-4'>
              {customer.orders.length > 0 ? (
                customer.orders.map((order) => (
                  <div
                    key={order.id}
                    className='flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors'
                  >
                    <div>
                      <p className='text-xs font-bold text-slate-900'>
                        {order.id}
                      </p>
                      <p className='text-[10px] text-slate-400 uppercase tracking-widest'>
                        {order.date}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-black text-slate-900'>
                        {order.amount}
                      </p>
                      <p className='text-[10px] text-indigo-500 font-bold uppercase'>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className='p-4 border border-dashed border-slate-200 rounded-2xl text-xs font-medium text-slate-400'>
                  No orders found for this customer yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='p-8 bg-slate-50 flex gap-3'>
          <button className='flex-1 py-4 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-colors shadow-sm'>
            Send Communication
          </button>
          <button
            onClick={() => onToggleBlock(customer)}
            disabled={isUpdating}
            className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
              customer.isBlocked
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/10"
                : "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/10"
            } disabled:opacity-50`}
          >
            {isUpdating
              ? "Updating..."
              : customer.isBlocked
                ? "Unblock User"
                : "Block User"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState("");
  const [updatingCustomerId, setUpdatingCustomerId] = useState<string | null>(
    null,
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // NEW: Mobile State

  const handleCustomerDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  // Helper to handle navigation click on mobile (closes menu)
  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const buildCustomerRows = (
    users: BackendUser[],
    orders: BackendOrder[],
  ): Customer[] =>
    users
      .filter((user) => user.role !== "admin")
      .map((user) => {
        const relatedOrders = orders
          .filter((order) => order.email === user.email)
          .sort((a, b) => {
            const aTime = new Date(a.orderDate || a.createdAt || 0).getTime();
            const bTime = new Date(b.orderDate || b.createdAt || 0).getTime();
            return bTime - aTime;
          });

        const totalSpent = relatedOrders.reduce(
          (sum, order) => sum + Number(order.totalAmount || 0),
          0,
        );

        return {
          id: user.id,
          name: [user.firstName, user.lastName].filter(Boolean).join(" "),
          email: user.email,
          phone: user.phone,
          profilePicture: user.profilePicture,
          role: user.role,
          isBlocked: user.isBlocked,
          status: user.isBlocked ? "Blocked" : "Active",
          totalOrders: relatedOrders.length,
          totalSpent: `Rs. ${totalSpent.toLocaleString()}`,
          joinedDate: new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          }),
          address: user.address,
          orders: relatedOrders.slice(0, 5).map((order) => ({
            id: order.orderId,
            date: new Date(
              order.orderDate || order.createdAt || Date.now(),
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            amount: `Rs. ${Number(order.totalAmount || 0).toLocaleString()}`,
            status: order.status,
          })),
        };
      });

  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true);
      setCustomersError("");

      const [usersResponse, ordersResponse] = await Promise.all([
        axios.get(apiUrl("/users/all"), {
          headers: getAuthHeaders(),
        }),
        axios.get(apiUrl("/orders/getOrders"), {
          headers: getAuthHeaders(),
        }),
      ]);

      setCustomers(
        buildCustomerRows(
          Array.isArray(usersResponse.data) ? usersResponse.data : [],
          Array.isArray(ordersResponse.data) ? ordersResponse.data : [],
        ),
      );
    } catch (error: any) {
      setCustomersError(
        error.response?.data?.message || "Failed to load customer records.",
      );
    } finally {
      setCustomersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "customers") {
      fetchCustomers();
    }
  }, [activeTab]);

  const handleToggleBlock = async (customer: Customer) => {
    try {
      setUpdatingCustomerId(customer.id);
      await axios.put(
        apiUrl(`/users/block/${encodeURIComponent(customer.email)}`),
        { isBlocked: !customer.isBlocked },
        { headers: getAuthHeaders() },
      );

      setCustomers((prev) =>
        prev.map((entry) =>
          entry.id === customer.id
            ? {
                ...entry,
                isBlocked: !entry.isBlocked,
                status: !entry.isBlocked ? "Blocked" : "Active",
              }
            : entry,
        ),
      );
      setSelectedCustomer((prev) =>
        prev && prev.id === customer.id
          ? {
              ...prev,
              isBlocked: !prev.isBlocked,
              status: !prev.isBlocked ? "Blocked" : "Active",
            }
          : prev,
      );
    } catch (error: any) {
      setCustomersError(
        error.response?.data?.message || "Failed to update customer access.",
      );
    } finally {
      setUpdatingCustomerId(null);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.email, customer.status]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900'>
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onToggleBlock={handleToggleBlock}
        isUpdating={updatingCustomerId === selectedCustomer?.id}
      />

      {/* --- MOBILE NAVIGATION DRAWER (NEW) --- */}
      {isMobileMenuOpen && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity'
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className='absolute left-0 top-0 bottom-0 w-64 bg-white p-6 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col h-full'>
            {/* Header with Close Btn */}
            <div className='flex items-center justify-between mb-8'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-black rounded-lg flex items-center justify-center'>
                  <Zap size={18} className='text-white fill-white' />
                </div>
                <span className='text-xl font-black tracking-tighter uppercase italic'>
                  CIGARO
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className='p-2 hover:bg-slate-100 rounded-full'
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className='space-y-2 flex-1'>
              <SidebarItem
                icon={LayoutDashboard}
                label='Dashboard'
                active={activeTab === "dashboard"}
                onClick={() => handleNavClick("dashboard")}
              />
              <SidebarItem
                icon={Package}
                label='Inventory'
                active={activeTab === "inventory"}
                onClick={() => handleNavClick("inventory")}
              />
              <SidebarItem
                icon={ClipboardList}
                label='Orders'
                active={activeTab === "orders"}
                onClick={() => handleNavClick("orders")}
              />
              <SidebarItem
                icon={Users}
                label='Customers'
                active={activeTab === "customers"}
                onClick={() => handleNavClick("customers")}
              />
            </nav>

            <div className='pt-6 mt-6 border-t border-slate-100'>
              <SidebarItem icon={Settings} label='Settings' />
            </div>
          </div>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR (UNCHANGED) --- */}
      <aside className='w-64 border-r border-slate-200 bg-white p-6 hidden lg:flex flex-col sticky top-0 h-screen'>
        <div
          className='mb-10 flex items-center gap-2 cursor-pointer'
          onClick={() => setActiveTab("dashboard")}
        >
          <div className='w-8 h-8 bg-black rounded-lg flex items-center justify-center'>
            <Zap size={18} className='text-white fill-white' />
          </div>
          <span className='text-xl font-black tracking-tighter uppercase italic'>
            CIGARO
          </span>
        </div>

        <nav className='space-y-2 flex-1'>
          <SidebarItem
            icon={LayoutDashboard}
            label='Dashboard'
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarItem
            icon={Package}
            label='Inventory'
            active={activeTab === "inventory"}
            onClick={() => setActiveTab("inventory")}
          />
          <SidebarItem
            icon={ClipboardList}
            label='Orders'
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          />
          <SidebarItem
            icon={Users}
            label='Customers'
            active={activeTab === "customers"}
            onClick={() => setActiveTab("customers")}
          />
        </nav>

        <div className='pt-6 mt-6 border-t border-slate-100'>
          <SidebarItem icon={Settings} label='Settings' />
          <div className='mt-8 p-4 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl relative overflow-hidden group'>
            <p className='text-white text-xs font-bold uppercase tracking-widest relative z-10 opacity-70'>
              Support
            </p>
            <p className='text-white text-sm font-medium relative z-10'>
              Concierge 24/7
            </p>
            <button className='mt-3 w-full py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-100 transition-colors'>
              Contact Us
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full'>
        {/* Header */}
        <header className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
          <div className='flex items-center gap-4'>
            {/* NEW: Mobile Menu Trigger Button */}
            <button
              className='lg:hidden p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors'
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            <h1 className='text-2xl md:text-3xl font-black text-slate-900 tracking-tight'>
              {activeTab === "dashboard"
                ? "The Dashboard."
                : activeTab === "inventory"
                  ? "Inventory Master."
                  : activeTab === "orders"
                    ? "Order Management."
                    : "Userbase."}
            </h1>
          </div>

          <div className='flex items-center gap-3'>
            <div className='relative group'>
              <Search
                className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <input
                type='text'
                placeholder='Search...'
                className='pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className='p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-500 transition-colors relative'>
              <Bell size={20} />
              <span className='absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white' />
            </button>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <div className='animate-in fade-in slide-in-from-bottom-2 duration-500'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
              <StatCard
                title='Revenue'
                value='$84,232'
                change='+12.5%'
                isPositive={true}
                icon={TrendingUp}
              />
              <StatCard
                title='Utilization'
                value='1.2M+'
                change='+34k'
                isPositive={true}
                icon={Zap}
              />
              <StatCard
                title='Orders'
                value='1,429'
                change='-2.1%'
                isPositive={false}
                icon={Package}
              />
              <StatCard
                title='Retention'
                value='68%'
                change='+5.4%'
                isPositive={true}
                icon={Users}
              />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
                <div className='h-[300px] w-full'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient
                          id='colorSales'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='5%'
                            stopColor='#6366f1'
                            stopOpacity={0.1}
                          />
                          <stop
                            offset='95%'
                            stopColor='#6366f1'
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray='3 3'
                        vertical={false}
                        stroke='#f1f5f9'
                      />
                      <XAxis
                        dataKey='name'
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                      />
                      <Tooltip />
                      <Area
                        type='monotone'
                        dataKey='sales'
                        stroke='#6366f1'
                        strokeWidth={3}
                        fillOpacity={1}
                        fill='url(#colorSales)'
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
                <h3 className='text-lg font-bold text-slate-900 mb-6'>
                  Top Drop Performance
                </h3>
                <div className='space-y-6'>
                  {[
                    { name: "Carbon X-2 Black", sales: "842", icon: "⚡" },
                    { name: "Neon Archive Pro", sales: "612", icon: "💜" },
                    { name: "Elite Pods 2.0", sales: "439", icon: "⚪" },
                  ].map((product, i) => (
                    <div
                      key={i}
                      className='flex items-center justify-between group cursor-pointer'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-indigo-50 transition-colors'>
                          {product.icon}
                        </div>
                        <div>
                          <p className='text-sm font-bold text-slate-900'>
                            {product.name}
                          </p>
                          <p className='text-xs text-slate-400'>
                            {product.sales} sales
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className='text-slate-300' />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UPDATED: Navigates to OrdersPage when "orders" is active */}
        {activeTab === "orders" && <OrdersPage />}

        {activeTab === "inventory" && <InventoryPage />}

        {activeTab === "customers" && (
          <div className='bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden'>
            {customersError && (
              <div className='mx-6 mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600'>
                {customersError}
              </div>
            )}
            <div className='overflow-x-auto'>
              {customersLoading ? (
                <div className='py-24 flex flex-col items-center justify-center text-slate-400'>
                  <Loader2
                    size={40}
                    className='animate-spin text-indigo-500 mb-4'
                  />
                  <p className='text-[10px] font-black tracking-widest uppercase'>
                    Syncing Customers...
                  </p>
                </div>
              ) : (
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='bg-slate-50/50'>
                      <th className='py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400'>
                        Identity
                      </th>
                      <th className='py-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400'>
                        Location
                      </th>
                      <th className='py-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400'>
                        Activity
                      </th>
                      <th className='py-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400'>
                        Status
                      </th>
                      <th className='py-4 px-6'></th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-50'>
                    {filteredCustomers.map((customer) => (
                      <CustomerRow
                        key={customer.id}
                        customer={customer}
                        onDetailClick={handleCustomerDetail}
                        onToggleBlock={handleToggleBlock}
                        isUpdating={updatingCustomerId === customer.id}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
