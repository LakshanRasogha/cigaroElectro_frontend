'use client';
import React, { useState, useEffect } from 'react';
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
  ShieldAlert
} from 'lucide-react';
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
  YAxis
} from 'recharts';
import InventoryPage from '../inventory/page';

// --- TYPES & INTERFACES ---

interface Order {
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
  totalOrders: number;
  totalSpent: string;
  joinedDate: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  orders: Order[];
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

interface InventoryRowProps {
  name: string;
  type: string;
  stock: number;
  status: string;
  price: string;
}

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

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, change, isPositive, icon: Icon }: StatCardProps) => (
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

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
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

const CustomerRow = ({ customer, onDetailClick, onBlock }: { customer: Customer, onDetailClick: (c: Customer) => void, onBlock: (id: string) => void }) => (
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

const CustomerDetailModal = ({ customer, isOpen, onClose }: { customer: Customer | null, isOpen: boolean, onClose: () => void }) => {
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

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('7d');

  const mockCustomers: Customer[] = [
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
  ];

  const handleCustomerDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <CustomerDetailModal 
        customer={selectedCustomer} 
        isOpen={isCustomerModalOpen} 
        onClose={() => setIsCustomerModalOpen(false)} 
      />
      
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
            <p className="text-white text-xs font-bold uppercase tracking-widest relative z-10 opacity-70">Support</p>
            <p className="text-white text-sm font-medium relative z-10">Concierge 24/7</p>
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
              {activeTab === 'dashboard' ? 'The Dashboard.' : 
               activeTab === 'inventory' ? 'Inventory Master.' : 
               activeTab === 'analytics' ? 'Global Metrics.' : 'Userbase.'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
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
              <StatCard title="Revenue" value="$84,232" change="+12.5%" isPositive={true} icon={TrendingUp} />
              <StatCard title="Utilization" value="1.2M+" change="+34k" isPositive={true} icon={Zap} />
              <StatCard title="Orders" value="1,429" change="-2.1%" isPositive={false} icon={Package} />
              <StatCard title="Retention" value="68%" change="+5.4%" isPositive={true} icon={Users} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
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
                      <Tooltip />
                      <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Top Drop Performance</h3>
                <div className="space-y-6">
                  {[
                    { name: 'Carbon X-2 Black', sales: '842', icon: '⚡' },
                    { name: 'Neon Archive Pro', sales: '612', icon: '💜' },
                    { name: 'Elite Pods 2.0', sales: '439', icon: '⚪' },
                  ].map((product, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-indigo-50 transition-colors">
                          {product.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-400">{product.sales} sales</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
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
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && <InventoryPage />}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
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
                      onBlock={(id) => console.log('Block', id)} 
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