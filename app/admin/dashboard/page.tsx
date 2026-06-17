"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronRight,
  ClipboardList,
  Folder,
  History,
  LayoutDashboard,
  Loader2,
  LogOut,
  LucideIcon,
  Mail,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import InventoryPage from "../inventory/page";
import OrdersPage from "../orders/page";
import CategoriesPage from "../categories/page";
import { clearAuthSession, isUnauthorizedError } from "@/app/lib/auth";
import { apiUrl, getAuthHeaders, apiFetch } from "@/app/lib/api";
import { getErrorMessage } from "@/app/lib/errors";

type ActiveTab =
  | "dashboard"
  | "inventory"
  | "categories"
  | "orders"
  | "customers"
  | "admins";

interface CustomerOrder {
  id: string;
  date: string;
  amount: string;
  status: string;
}

interface ManagedUser {
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

const revenueData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 6000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 8390 },
  { name: "Sun", sales: 9490 },
];

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

const UserRow = ({
  user,
  isCurrentAdmin,
  onDetailClick,
  onToggleBlock,
  onRoleToggle,
  isBlocking,
  isRoleUpdating,
}: {
  user: ManagedUser;
  isCurrentAdmin: boolean;
  onDetailClick: (user: ManagedUser) => void;
  onToggleBlock: (user: ManagedUser) => void;
  onRoleToggle: (user: ManagedUser) => void;
  isBlocking: boolean;
  isRoleUpdating: boolean;
}) => {
  const canEditOwnAccess = !isCurrentAdmin;
  const roleActionLabel =
    user.role === "admin" ? "Remove admin access" : "Make admin";

  return (
    <tr className='group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors'>
      <td className='py-4 px-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold overflow-hidden'>
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className='w-full h-full object-cover'
              />
            ) : (
              user.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
            )}
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <p className='font-bold text-slate-900 text-sm'>{user.name}</p>
              {isCurrentAdmin && (
                <span className='rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white'>
                  You
                </span>
              )}
            </div>
            <p className='text-xs text-slate-400'>{user.email}</p>
          </div>
        </div>
      </td>
      <td className='py-4 px-2 text-sm text-slate-600 font-medium'>
        <div className='flex items-center gap-1.5'>
          <MapPin size={14} className='text-slate-400' />
          {user.address?.city || "No city"}
          {user.address?.postalCode ? ` • ${user.address.postalCode}` : ""}
        </div>
      </td>
      <td className='py-4 px-2 text-sm text-slate-600 font-bold'>
        {user.totalOrders} Orders
      </td>
      <td className='py-4 px-2'>
        <div className='flex items-center gap-2 flex-wrap'>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              user.status === "Active"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {user.status}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              user.role === "admin"
                ? "bg-indigo-50 text-indigo-600"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {user.role}
          </span>
        </div>
      </td>
      <td className='py-4 px-6 text-right'>
        <div className='flex items-center justify-end gap-2'>
          <button
            onClick={() => onDetailClick(user)}
            className='p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all'
            title='View details'
          >
            <History size={18} />
          </button>
          <button
            onClick={() => onRoleToggle(user)}
            disabled={isBlocking || isRoleUpdating || !canEditOwnAccess}
            className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
              user.role === "admin"
                ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                : "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            }`}
            title={isCurrentAdmin ? "You cannot change your own access" : roleActionLabel}
          >
            {isRoleUpdating ? (
              <Loader2 size={18} className='animate-spin' />
            ) : user.role === "admin" ? (
              <ShieldOff size={18} />
            ) : (
              <ShieldCheck size={18} />
            )}
          </button>
          <button
            onClick={() => onToggleBlock(user)}
            disabled={isBlocking || isRoleUpdating || isCurrentAdmin}
            className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
              user.isBlocked
                ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                : "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            }`}
            title={
              isCurrentAdmin
                ? "You cannot block your own account"
                : user.isBlocked
                  ? "Unblock user"
                  : "Block user"
            }
          >
            {isBlocking ? (
              <Loader2 size={18} className='animate-spin' />
            ) : (
              <ShieldAlert size={18} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

const UserDetailModal = ({
  user,
  isOpen,
  isCurrentAdmin,
  onClose,
  onToggleBlock,
  onRoleToggle,
  isBlocking,
  isRoleUpdating,
}: {
  user: ManagedUser | null;
  isOpen: boolean;
  isCurrentAdmin: boolean;
  onClose: () => void;
  onToggleBlock: (user: ManagedUser) => void;
  onRoleToggle: (user: ManagedUser) => void;
  isBlocking: boolean;
  isRoleUpdating: boolean;
}) => {
  if (!isOpen || !user) return null;

  const roleButtonLabel =
    user.role === "admin" ? "Remove Admin Access" : "Make Admin";

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-slate-900/60 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200'>
        <div className='p-8 border-b border-slate-100 flex justify-between items-start'>
          <div className='flex gap-4'>
            <div className='w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black overflow-hidden'>
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                user.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
              )}
            </div>
            <div>
              <h2 className='text-2xl font-black text-slate-900 tracking-tight'>
                {user.name}
              </h2>
              <div className='flex items-center gap-3 mt-1 flex-wrap'>
                <span className='text-sm text-slate-500 flex items-center gap-1'>
                  <Mail size={14} /> {user.email}
                </span>
                {user.phone && (
                  <span className='text-sm text-slate-500'>{user.phone}</span>
                )}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    user.status === "Active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {user.status}
                </span>
                <span className='px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600'>
                  {user.role}
                </span>
                {isCurrentAdmin && (
                  <span className='px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-900 text-white'>
                    Current Admin
                  </span>
                )}
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

        <div className='p-8 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1'>
              Account Profile
            </h3>
            <div className='bg-slate-50 p-5 rounded-2xl space-y-4'>
              <div>
                <p className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1'>
                  Joined
                </p>
                <p className='text-sm font-bold text-slate-900'>
                  {user.joinedDate}
                </p>
              </div>
              <div>
                <p className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1'>
                  Lifetime Spend
                </p>
                <p className='text-sm font-bold text-slate-900'>
                  {user.totalSpent}
                </p>
              </div>
              <div className='flex items-start gap-3'>
                <MapPin size={18} className='text-indigo-500 mt-0.5' />
                <div>
                  <p className='text-sm font-bold text-slate-900'>
                    {user.address?.address || "No saved address"}
                  </p>
                  <p className='text-sm text-slate-600'>
                    {user.address?.city || "No city"}
                    {user.address?.postalCode
                      ? ` • ${user.address.postalCode}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1'>
              Recent Orders
            </h3>
            <div className='space-y-4'>
              {user.orders.length > 0 ? (
                user.orders.map((order) => (
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
                  No orders found for this account yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='p-8 bg-slate-50 flex flex-col md:flex-row gap-3'>
          <button className='flex-1 py-4 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-colors shadow-sm'>
            Send Communication
          </button>
          <button
            onClick={() => onRoleToggle(user)}
            disabled={isBlocking || isRoleUpdating || isCurrentAdmin}
            className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 ${
              user.role === "admin"
                ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/10"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/10"
            }`}
          >
            {isRoleUpdating
              ? "Updating Role..."
              : isCurrentAdmin
                ? "Current Admin"
                : roleButtonLabel}
          </button>
          <button
            onClick={() => onToggleBlock(user)}
            disabled={isBlocking || isRoleUpdating || isCurrentAdmin}
            className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 ${
              user.isBlocked
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/10"
                : "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/10"
            }`}
          >
            {isBlocking
              ? "Updating..."
              : isCurrentAdmin
                ? "Current Admin"
                : user.isBlocked
                  ? "Unblock User"
                  : "Block User"}
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyDirectoryState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className='py-24 flex flex-col items-center justify-center text-center text-slate-400'>
    <Users size={40} className='mb-4 text-slate-300' />
    <p className='text-sm font-black uppercase tracking-widest text-slate-500'>
      {title}
    </p>
    <p className='mt-2 text-sm text-slate-400'>{description}</p>
  </div>
);

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [directoryUsers, setDirectoryUsers] = useState<BackendUser[]>([]);
  const [ordersData, setOrdersData] = useState<BackendOrder[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(false);
  const [directoryError, setDirectoryError] = useState("");
  const [directorySuccess, setDirectorySuccess] = useState("");
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [roleUpdatingUserId, setRoleUpdatingUserId] = useState<string | null>(
    null,
  );
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentAdminEmail, setCurrentAdminEmail] = useState("");

  const handleProtectedError = (error: unknown) => {
    if (isUnauthorizedError(error)) {
      clearAuthSession();
      router.push("/auth/login");
      router.refresh();
      return true;
    }

    return false;
  };

  const buildManagedUsers = (
    users: BackendUser[],
    orders: BackendOrder[],
  ): ManagedUser[] =>
    users.map((user) => {
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

      const joinedDate = new Date(user.createdAt);
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

      return {
        id: user.id,
        name: fullName || user.email.split("@")[0],
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        role: user.role,
        isBlocked: user.isBlocked,
        status: user.isBlocked ? "Blocked" : "Active",
        totalOrders: relatedOrders.length,
        totalSpent: `Rs. ${totalSpent.toLocaleString()}`,
        joinedDate: Number.isNaN(joinedDate.getTime())
          ? "Unknown"
          : joinedDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
        address: user.address,
        orders: relatedOrders.slice(0, 5).map((order) => ({
          id: order.orderId || order.id || "Order",
          date: new Date(order.orderDate || order.createdAt || 0).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            },
          ),
          amount: `Rs. ${Number(order.totalAmount || 0).toLocaleString()}`,
          status: order.status,
        })),
      };
    });

  const managedUsers = buildManagedUsers(directoryUsers, ordersData);
  const customerUsers = managedUsers.filter((user) => user.role !== "admin");
  const adminUsers = managedUsers.filter((user) => user.role === "admin");
  const activeCustomers = customerUsers.filter((user) => !user.isBlocked).length;

  const filterUsers = (users: ManagedUser[]) =>
    users.filter((user) =>
      [
        user.name,
        user.email,
        user.status,
        user.role,
        user.address?.city || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

  const filteredCustomers = filterUsers(customerUsers);
  const filteredAdmins = filterUsers(adminUsers);

  const handleUserDetail = (user: ManagedUser) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    clearAuthSession();
    router.push("/auth/login");
    router.refresh();
  };

  useEffect(() => {
    if (activeTab !== "customers" && activeTab !== "admins") {
      return;
    }

    const loadDirectoryData = async () => {
      try {
        setDirectoryLoading(true);
        setDirectoryError("");
        setDirectorySuccess("");

        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("token")
            : null;

        if (!token) {
          clearAuthSession();
          router.push("/auth/login");
          return;
        }

        const [usersResponse, ordersResponse, profileResponse] =
          await Promise.all([
            apiFetch<BackendUser[]>(apiUrl("/users/all"), {
              headers: getAuthHeaders(),
            }),
            apiFetch<BackendOrder[]>(apiUrl("/orders/getOrders"), {
              headers: getAuthHeaders(),
            }),
            apiFetch<any>(apiUrl("/users"), {
              headers: getAuthHeaders(),
            }),
          ]);

        const profile = profileResponse.data as { email?: string; role?: string };

        if (profile.role !== "admin") {
          setDirectoryError("Admin access required.");
          router.push("/profile");
          return;
        }

        setCurrentAdminEmail(profile.email || "");
        setDirectoryUsers(
          Array.isArray(usersResponse.data) ? usersResponse.data : [],
        );
        setOrdersData(
          Array.isArray(ordersResponse.data) ? ordersResponse.data : [],
        );
      } catch (error: unknown) {
        if (isUnauthorizedError(error)) {
          clearAuthSession();
          router.push("/auth/login");
          router.refresh();
          return;
        }

        setDirectoryError(
          getErrorMessage(error, "Failed to load admin records."),
        );
      } finally {
        setDirectoryLoading(false);
      }
    };

    void loadDirectoryData();
  }, [activeTab, router]);

  const updateSelectedUser = (updater: (user: ManagedUser) => ManagedUser) => {
    setSelectedUser((previous) => (previous ? updater(previous) : previous));
  };

  const handleToggleBlock = async (user: ManagedUser) => {
    try {
      setBlockingUserId(user.id);
      setDirectoryError("");
      setDirectorySuccess("");

      await apiFetch(
        apiUrl(`/users/block/${encodeURIComponent(user.email)}`),
        { method: "PUT", body: { isBlocked: !user.isBlocked }, headers: getAuthHeaders() },
      );

      setDirectoryUsers((previous) =>
        previous.map((entry) =>
          entry.id === user.id
            ? {
                ...entry,
                isBlocked: !entry.isBlocked,
              }
            : entry,
        ),
      );

      updateSelectedUser((previous) =>
        previous.id === user.id
          ? {
              ...previous,
              isBlocked: !previous.isBlocked,
              status: previous.isBlocked ? "Active" : "Blocked",
            }
          : previous,
      );

      setDirectorySuccess(
        user.isBlocked
          ? `${user.email} has been unblocked.`
          : `${user.email} has been blocked.`,
      );
    } catch (error: unknown) {
      if (handleProtectedError(error)) {
        return;
      }

      setDirectoryError(
        getErrorMessage(error, "Failed to update account access."),
      );
    } finally {
      setBlockingUserId(null);
    }
  };

  const handleRoleToggle = async (user: ManagedUser) => {
    const nextRole = user.role === "admin" ? "customer" : "admin";
    const actionLabel =
      nextRole === "admin" ? "make this user an admin" : "remove admin access";

    if (
      !window.confirm(`Are you sure you want to ${actionLabel} for ${user.email}?`)
    ) {
      return;
    }

    try {
      setRoleUpdatingUserId(user.id);
      setDirectoryError("");
      setDirectorySuccess("");

      await apiFetch(
        apiUrl(`/users/role/${encodeURIComponent(user.email)}`),
        { method: "PUT", body: { role: nextRole }, headers: getAuthHeaders() },
      );

      setDirectoryUsers((previous) =>
        previous.map((entry) =>
          entry.id === user.id
            ? {
                ...entry,
                role: nextRole,
              }
            : entry,
        ),
      );

      updateSelectedUser((previous) =>
        previous.id === user.id
          ? {
              ...previous,
              role: nextRole,
            }
          : previous,
      );

      setDirectorySuccess(
        nextRole === "admin"
          ? `${user.email} is now an admin.`
          : `${user.email} no longer has admin access.`,
      );
    } catch (error: unknown) {
      if (handleProtectedError(error)) {
        return;
      }

      setDirectoryError(
        getErrorMessage(error, "Failed to update the user role."),
      );
    } finally {
      setRoleUpdatingUserId(null);
    }
  };

  const renderDirectoryTable = (
    users: ManagedUser[],
    emptyTitle: string,
    emptyDescription: string,
  ) => (
    <div className='bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden'>
      {directoryError && (
        <div className='mx-6 mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600'>
          {directoryError}
        </div>
      )}
      {directorySuccess && (
        <div className='mx-6 mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700'>
          {directorySuccess}
        </div>
      )}
      <div className='overflow-x-auto'>
        {directoryLoading ? (
          <div className='py-24 flex flex-col items-center justify-center text-slate-400'>
            <Loader2
              size={40}
              className='animate-spin text-indigo-500 mb-4'
            />
            <p className='text-[10px] font-black tracking-widest uppercase'>
              Syncing Directory...
            </p>
          </div>
        ) : users.length === 0 ? (
          <EmptyDirectoryState
            title={emptyTitle}
            description={emptyDescription}
          />
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
              {users.map((user) => {
                const isCurrentAdmin =
                  currentAdminEmail.length > 0 &&
                  currentAdminEmail.toLowerCase() === user.email.toLowerCase();

                return (
                  <UserRow
                    key={user.id}
                    user={user}
                    isCurrentAdmin={isCurrentAdmin}
                    onDetailClick={handleUserDetail}
                    onToggleBlock={handleToggleBlock}
                    onRoleToggle={handleRoleToggle}
                    isBlocking={blockingUserId === user.id}
                    isRoleUpdating={roleUpdatingUserId === user.id}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const searchEnabled = activeTab === "customers" || activeTab === "admins";
  const pageTitle =
    activeTab === "dashboard"
      ? "The Dashboard."
      : activeTab === "inventory"
        ? "Inventory Master."
        : activeTab === "categories"
          ? "Categories Management."
          : activeTab === "orders"
            ? "Order Management."
            : activeTab === "customers"
              ? "Customer Directory."
              : "Admin Directory.";
  const searchPlaceholder =
    activeTab === "admins"
      ? "Search admins..."
      : activeTab === "customers"
        ? "Search customers..."
        : "Search directory...";
  const selectedUserIsCurrentAdmin =
    !!selectedUser &&
    currentAdminEmail.length > 0 &&
    selectedUser.email.toLowerCase() === currentAdminEmail.toLowerCase();

  return (
    <div className='min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900'>
      <UserDetailModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        isCurrentAdmin={selectedUserIsCurrentAdmin}
        onClose={() => setIsUserModalOpen(false)}
        onToggleBlock={handleToggleBlock}
        onRoleToggle={handleRoleToggle}
        isBlocking={blockingUserId === selectedUser?.id}
        isRoleUpdating={roleUpdatingUserId === selectedUser?.id}
      />

      {isMobileMenuOpen && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <div
            className='absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity'
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className='absolute left-0 top-0 bottom-0 w-64 bg-white p-6 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col h-full'>
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
                icon={Folder}
                label='Add Category'
                active={activeTab === "categories"}
                onClick={() => handleNavClick("categories")}
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
              <SidebarItem
                icon={ShieldCheck}
                label='Admins'
                active={activeTab === "admins"}
                onClick={() => handleNavClick("admins")}
              />
            </nav>

            <div className='pt-6 mt-6 border-t border-slate-100 space-y-2'>
              <SidebarItem icon={Settings} label='Settings' />
              <button
                onClick={handleLogout}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all'
              >
                <LogOut size={20} />
                <span className='font-semibold text-sm'>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
            icon={Folder}
            label='Add Category'
            active={activeTab === "categories"}
            onClick={() => setActiveTab("categories")}
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
          <SidebarItem
            icon={ShieldCheck}
            label='Admins'
            active={activeTab === "admins"}
            onClick={() => setActiveTab("admins")}
          />
        </nav>

        <div className='pt-6 mt-6 border-t border-slate-100'>
          <SidebarItem icon={Settings} label='Settings' />
          <button
            onClick={handleLogout}
            className='mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all'
          >
            <LogOut size={20} />
            <span className='font-semibold text-sm'>Logout</span>
          </button>
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

      <main className='flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full'>
        <header className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
          <div className='flex items-center gap-4'>
            <button
              className='lg:hidden p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors'
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            <h1 className='text-2xl md:text-3xl font-black text-slate-900 tracking-tight'>
              {pageTitle}
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
                placeholder={searchPlaceholder}
                disabled={!searchEnabled}
                className='pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium disabled:bg-slate-100 disabled:text-slate-400'
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
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
                title='Customers'
                value={customerUsers.length}
                change={`${activeCustomers} active`}
                isPositive={activeCustomers >= Math.max(customerUsers.length - activeCustomers, 0)}
                icon={Users}
              />
              <StatCard
                title='Admins'
                value={adminUsers.length}
                change='Access team'
                isPositive={true}
                icon={ShieldCheck}
              />
              <StatCard
                title='Orders'
                value={ordersData.length}
                change='Live sync'
                isPositive={true}
                icon={Package}
              />
              <StatCard
                title='Blocked Accounts'
                value={managedUsers.filter((user) => user.isBlocked).length}
                change='Review list'
                isPositive={false}
                icon={ShieldAlert}
              />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <h3 className='text-lg font-bold text-slate-900'>
                      Revenue Pulse
                    </h3>
                    <p className='text-sm text-slate-500'>
                      Weekly sales signal for the admin overview.
                    </p>
                  </div>
                  <TrendingUp size={18} className='text-indigo-500' />
                </div>
                <div className='h-[300px] w-full'>
                  <ResponsiveContainer width='100%' height={300} minWidth={0}>
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
                  Access Snapshot
                </h3>
                <div className='space-y-4'>
                  {[
                    {
                      label: "Customer accounts",
                      value: customerUsers.length,
                      badge: "Directory",
                    },
                    {
                      label: "Admin accounts",
                      value: adminUsers.length,
                      badge: "Privileged",
                    },
                    {
                      label: "Blocked accounts",
                      value: managedUsers.filter((user) => user.isBlocked).length,
                      badge: "Needs review",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className='flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors'
                    >
                      <div>
                        <p className='text-sm font-bold text-slate-900'>
                          {item.label}
                        </p>
                        <p className='text-xs text-slate-400'>{item.badge}</p>
                      </div>
                      <ChevronRight size={18} className='text-slate-300' />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && <OrdersPage />}

        {activeTab === "categories" && <CategoriesPage />}

        {activeTab === "inventory" && <InventoryPage />}

        {activeTab === "customers" &&
          renderDirectoryTable(
            filteredCustomers,
            "No Customers Found",
            searchQuery
              ? "No customers matched your search."
              : "Customer accounts will appear here once they register.",
          )}

        {activeTab === "admins" &&
          renderDirectoryTable(
            filteredAdmins,
            "No Admins Found",
            searchQuery
              ? "No admins matched your search."
              : "Promoted admin accounts will appear here.",
          )}
      </main>
    </div>
  );
}
