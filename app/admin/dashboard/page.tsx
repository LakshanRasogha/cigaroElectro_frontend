'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  TrendingUp, 
  Zap, 
  Plus, 
  Search, 
  Bell, 
  ChevronRight,
  Monitor,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Filter,
  Download,
  ShieldAlert,
  MapPin,
  History,
  Mail,
  PieChart as PieIcon,
  BarChart as BarIcon,
  Calendar,
  Globe,
  ShoppingCart
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- MOCK DATA ---
const revenueData = [
  { name: 'Mon', sales: 4000, puffs: 2400, orders: 120 },
  { name: 'Tue', sales: 3000, puffs: 1398, orders: 98 },
  { name: 'Wed', sales: 6000, puffs: 9800, orders: 210 },
  { name: 'Thu', sales: 2780, puffs: 3908, orders: 115 },
  { name: 'Fri', sales: 1890, puffs: 4800, orders: 84 },
  { name: 'Sat', sales: 8390, puffs: 3800, orders: 340 },
  { name: 'Sun', sales: 9490, puffs: 4300, orders: 412 },
];

const categoryData = [
  { name: 'Hardware', value: 45, color: '#6366f1' },
  { name: 'Disposables', value: 30, color: '#a855f7' },
  { name: 'Artisanal Liquid', value: 15, color: '#ec4899' },
  { name: 'Accessories', value: 10, color: '#f43f5e' },
];

const regionalData = [
  { region: 'North America', users: 12400, growth: '+12%' },
  { region: 'Europe', users: 8900, growth: '+8%' },
  { region: 'Asia Pacific', users: 15600, growth: '+24%' },
  { region: 'Middle East', users: 3200, growth: '+15%' },
];

// --- COMPONENTS ---

const StatCard = ({ title, value, change, isPositive, icon: Icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
        <Icon size={20} className="text-slate-700 group-hover:text-indigo-600" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {change}
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const InventoryRow = ({ name, type, stock, status, price }) => (
  <tr className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-[10px] overflow-hidden">
          {type === 'Hardware' ? <Zap size={16} /> : <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-400 font-bold uppercase tracking-tighter">IMG</div>}
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm">{name}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{type}</p>
        </div>
      </div>
    </td>
    <td className="py-4 px-2 text-sm text-slate-600 font-bold">{price}</td>
    <td className="py-4 px-2 text-sm text-slate-600 font-medium">{stock} units</td>
    <td className="py-4 px-2">
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
        status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 
        status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {status}
      </span>
    </td>
    <td className="py-4 px-6 text-right">
      <button className="text-slate-300 hover:text-slate-900 transition-colors">
        <MoreVertical size={18} />
      </button>
    </td>
  </tr>
);

const CustomerRow = ({ customer, onDetailClick, onBlock }) => (
  <tr className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
          {customer.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm">{customer.name}</p>
          <p className="text-xs text-slate-400">{customer.email}</p>
        </div>
      </div>
    </td>
    <td className="py-4 px-2 text-sm text-slate-600 font-medium">
      <div className="flex items-center gap-1.5">
        <MapPin size={14} className="text-slate-400" />
        {customer.address.city}, {customer.address.country}
      </div>
    </td>
    <td className="py-4 px-2 text-sm text-slate-600 font-bold">{customer.totalOrders} Orders</td>
    <td className="py-4 px-2">
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
        customer.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {customer.status}
      </span>
    </td>
    <td className="py-4 px-6 text-right">
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => onDetailClick(customer)}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        >
          <History size={18} />
        </button>
        <button 
          onClick={() => onBlock(customer.id)}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
        >
          <ShieldAlert size={18} />
        </button>
      </div>
    </td>
  </tr>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-lg shadow-indigo-100' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
    <span className="font-semibold text-sm">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-50" />}
  </button>
);

const CustomerDetailModal = ({ customer, isOpen, onClose }) => {
  if (!isOpen || !customer) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black">
              {customer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{customer.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-slate-500 flex items-center gap-1"><Mail size={14}/> {customer.email}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  customer.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {customer.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Shipping Profile</h3>
            <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{customer.address.street}</p>
                  <p className="text-sm text-slate-600">{customer.address.city}, {customer.address.state}</p>
                  <p className="text-sm text-slate-600">{customer.address.zip} {customer.address.country}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Recent Transmissions</h3>
            <div className="space-y-4">
              {customer.orders.map((order, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{order.id}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{order.amount}</p>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 flex gap-3">
          <button className="flex-1 py-4 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-colors shadow-sm">Send Communication</button>
          <button className="flex-1 py-4 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/10">Restrict Access</button>
        </div>
      </div>
    </div>
  );
};

const AddProductModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Hardware Drop.</h2>
            <p className="text-slate-500 text-sm font-medium">Add a new artisanal flavor engine.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Product Name</label>
              <input type="text" placeholder="e.g. Carbon X-3" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Series Type</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium text-sm appearance-none">
                <option>Hardware</option>
                <option>Disposables</option>
                <option>Artisanal Liquid</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Description</label>
            <textarea rows="3" placeholder="Explain the flavor engineering..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium text-sm resize-none"></textarea>
          </div>
        </div>
        <div className="p-8 bg-slate-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
          <button className="flex-[2] py-4 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-black/10">Initialize Product</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('7d');

  const mockCustomers = [
    { 
      id: 'CU-1042', name: 'Marcus Holloway', email: 'marcus@dedsec.io', status: 'Active', totalOrders: 14, totalSpent: '$2,420', joinedDate: 'Nov 2023',
      address: { street: '124 Market St', city: 'San Francisco', state: 'CA', zip: '94103', country: 'USA' },
      orders: [
        { id: '#ORD-9921', date: 'Feb 12, 2024', amount: '$145.00', status: 'Delivered' },
        { id: '#ORD-8810', date: 'Jan 28, 2024', amount: '$320.00', status: 'Shipped' },
      ]
    },
    { 
      id: 'CU-2091', name: 'Elena Rodriguez', email: 'elena.r@lux.co', status: 'Active', totalOrders: 8, totalSpent: '$1,150', joinedDate: 'Dec 2023',
      address: { street: '42 Plaza Mayor', city: 'Madrid', state: 'MD', zip: '28012', country: 'Spain' },
      orders: [{ id: '#ORD-7742', date: 'Feb 05, 2024', amount: '$89.00', status: 'Delivered' }]
    },
    { 
      id: 'CU-3044', name: 'James Chen', email: 'j.chen@tech.hk', status: 'Blocked', totalOrders: 2, totalSpent: '$240', joinedDate: 'Jan 2024',
      address: { street: '18 Nathan Rd', city: 'Kowloon', state: 'TST', zip: '852', country: 'Hong Kong' },
      orders: [{ id: '#ORD-5521', date: 'Jan 15, 2024', amount: '$120.00', status: 'Cancelled' }]
    },
  ];

  const handleCustomerDetail = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CustomerDetailModal customer={selectedCustomer} isOpen={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} />
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white p-6 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="mb-10 flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">CIGARO</span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Package} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <SidebarItem icon={TrendingUp} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <SidebarItem icon={Users} label="Customers" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
        </nav>

        <div className="pt-6 mt-6 border-t border-slate-100">
          <SidebarItem icon={Settings} label="Settings" />
          <div className="mt-8 p-4 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-2 -top-2 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-1 relative z-10 opacity-70">Support</p>
            <p className="text-white text-sm font-medium relative z-10">Premium Concierge 24/7</p>
            <button className="mt-3 w-full py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-100 transition-colors">Contact Us</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' ? 'The Electric Dashboard.' : 
               activeTab === 'inventory' ? 'Master Inventory.' : 
               activeTab === 'analytics' ? 'Global Metrics Hub.' : 'Global Client Base.'}
            </h1>
            <p className="text-slate-500 font-medium">
              {activeTab === 'dashboard' ? 'Monitoring hardware drops and flavor engineering.' : 
               activeTab === 'inventory' ? 'Full visibility of your artisanal collection.' : 
               activeTab === 'analytics' ? 'Real-time performance and demographic analytics.' : 'Manage high-profile customers and restricted access.'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" size={18} />
              <input 
                type="text" 
                placeholder="Search collection..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-500 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Revenue" value="$84,232.00" change="+12.5%" isPositive={true} icon={TrendingUp} />
              <StatCard title="Active Puffs" value="1.2M+" change="+34k" isPositive={true} icon={Zap} />
              <StatCard title="Orders Placed" value="1,429" change="-2.1%" isPositive={false} icon={Package} />
              <StatCard title="Return Customers" value="68%" change="+5.4%" isPositive={true} icon={Users} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Performance Trends</h3>
                    <p className="text-sm text-slate-500">Revenue vs Utilization growth</p>
                  </div>
                  <div className="flex bg-slate-50 p-1 rounded-lg">
                    <button className="px-3 py-1 text-xs font-bold text-slate-900 bg-white rounded-md shadow-sm">Sales</button>
                    <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600">Puffs</button>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Carbon X Series</h3>
                <div className="space-y-6">
                  {[
                    { name: 'Carbon X-2 Black', sales: '842 sales', icon: '⚡' },
                    { name: 'Neon Archive Pro', sales: '612 sales', icon: '💜' },
                    { name: 'Elite Pods 2.0', sales: '439 sales', icon: '⚪' },
                    { name: 'Artisanal Pear Liquid', sales: '321 sales', icon: '🍐' },
                  ].map((product, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => setActiveTab('inventory')}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-indigo-50 transition-colors">
                          {product.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-400">{product.sales}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('inventory')}
                  className="w-full mt-8 py-3 border-2 border-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl hover:border-slate-200 hover:bg-slate-50 transition-all"
                >
                  View All Inventory
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
            {/* Analytics Header Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                {['24h', '7d', '30d', '90d'].map(tf => (
                  <button 
                    key={tf}
                    onClick={() => setAnalyticsTimeframe(tf)}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                      analyticsTimeframe === tf ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                <Download size={16} />
                Generate Full Report
              </button>
            </div>

            {/* Top Row: Conversion & Growth */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-2">
                      <TrendingUp size={24} className="text-indigo-500" />
                      Revenue Velocity
                    </h3>
                    <p className="text-sm text-slate-500">Transaction volume vs base value</p>
                  </div>
                </div>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                      />
                      <Bar dataKey="sales" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                      <Bar dataKey="puffs" fill="#a855f7" radius={[8, 8, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Category Mix</h3>
                  <p className="text-sm text-slate-500">Inventory Distribution</p>
                </div>
                <div className="flex-1 h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-2xl font-black text-slate-900">100%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Share</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {categoryData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-slate-600">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Regional & Conversion Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Globe size={20} className="text-emerald-500" />
                  Regional Market Penetration
                </h3>
                <div className="space-y-6">
                  {regionalData.map((reg, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">{reg.region}</p>
                        <p className="text-xs text-slate-400">{reg.users.toLocaleString()} Active Users</p>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-500 font-bold text-sm">{reg.growth}</span>
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                          <div 
                            className="h-full bg-slate-900 rounded-full group-hover:bg-indigo-500 transition-all duration-1000" 
                            style={{ width: `${(reg.users / 20000) * 100}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#6366f1] p-8 rounded-3xl shadow-xl shadow-indigo-200 text-white flex flex-col justify-between">
                    <ShoppingCart size={32} className="opacity-50" />
                    <div>
                      <p className="text-sm font-bold opacity-70 uppercase tracking-widest">AOV</p>
                      <h4 className="text-3xl font-black mt-1">$142.50</h4>
                      <p className="text-xs mt-2 flex items-center gap-1">
                        <ArrowUpRight size={14} /> +8.2% vs last month
                      </p>
                    </div>
                 </div>
                 <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200 text-white flex flex-col justify-between">
                    <Calendar size={32} className="opacity-50" />
                    <div>
                      <p className="text-sm font-bold opacity-70 uppercase tracking-widest">Retention</p>
                      <h4 className="text-3xl font-black mt-1">74.2%</h4>
                      <p className="text-xs mt-2 flex items-center gap-1">
                        <ArrowUpRight size={14} /> Peak loyalty
                      </p>
                    </div>
                 </div>
                 <div className="col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-rose-50 rounded-2xl text-rose-500">
                          <Zap size={24} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">Real-time Puff Velocity</p>
                          <p className="text-xs text-slate-500">Average 4,200 puffs per minute across grid</p>
                       </div>
                    </div>
                    <div className="flex gap-1">
                       {[0.4, 0.7, 0.9, 0.5, 0.8, 0.3, 0.6].map((h, i) => (
                         <div key={i} className="w-1.5 bg-rose-500 rounded-full animate-pulse" style={{ height: `${h * 40}px`, animationDelay: `${i * 150}ms` }} />
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">124</div>
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">42</div>
                </div>
                <p className="text-sm font-bold text-slate-900">166 Total Stock Items</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100"><Filter size={18} /></button>
                <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100"><Download size={18} /></button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-black/10 active:scale-95"
                >
                  <Plus size={16} strokeWidth={3} />
                  Add Product
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Product Detail</th>
                    <th className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Base Price</th>
                    <th className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Units</th>
                    <th className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <InventoryRow name="Carbon X-2 Midnight" type="Hardware" stock="1,240" price="$124.00" status="In Stock" />
                  <InventoryRow name="Neon Pear (20k Puffs)" type="Disposables" stock="430" price="$29.00" status="In Stock" />
                  <InventoryRow name="Elite Series Pod Kit" type="Hardware" stock="12" price="$89.00" status="Low Stock" />
                  <InventoryRow name="Artisanal Menthol 30ml" type="Liquid" stock="890" price="$15.00" status="In Stock" />
                  <InventoryRow name="Carbon X-1 Edition" type="Hardware" stock="0" price="$99.00" status="Out of Stock" />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Premium Userbase</h3>
                  <p className="text-sm text-slate-500">Managing {mockCustomers.length} active profiles</p>
                </div>
              </div>
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-black/10">
                <Download size={16} />
                Export Data
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                    <th className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                    <th className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Activity</th>
                    <th className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockCustomers.map((customer) => (
                    <CustomerRow 
                      key={customer.id} 
                      customer={customer} 
                      onDetailClick={handleCustomerDetail}
                      onBlock={(id) => console.log('Blocking user', id)} 
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}