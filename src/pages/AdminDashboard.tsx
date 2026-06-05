import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ScreenshotModal from '../components/ScreenshotModal';
import {
  LayoutDashboard,
  Receipt,
  Users,
  Radio,
  Settings,
  LogOut,
  Search,
  Bell,
  Check,
  X,
  Pencil,
  Trash2,
  TrendingUp,
  UserCheck,
  Clock,
  Zap,
} from 'lucide-react';

interface Transaction {
  id: string;
  playerId: string;
  amount: string;
  method: string;
  screenshot: string;
  status: 'pending' | 'verified' | 'rejected';
}

interface UserItem {
  id: string;
  name: string;
  accountId: string;
  balance: string;
  status: 'online' | 'offline';
  joined: string;
  initials: string;
}

interface LiveSession {
  id: string;
  name: string;
  initials: string;
  status: 'active';
  duration: string;
  ip: string;
  device: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 0 },
  { id: 'transactions', label: 'Transactions', icon: Receipt, badge: 3 },
  { id: 'users', label: 'Users', icon: Users, badge: 0 },
  { id: 'sessions', label: 'Live Sessions', icon: Radio, badge: 0 },
  { id: 'settings', label: 'Settings', icon: Settings, badge: 0 },
];

const initialTransactions: Transaction[] = [
  { id: '1', playerId: 'ACC-4821-7734', amount: '$250.00', method: 'Bank Transfer', screenshot: '/screenshot-mockup.jpg', status: 'pending' },
  { id: '2', playerId: 'ACC-2917-4452', amount: '$1,500.00', method: 'Crypto (USDT)', screenshot: '/screenshot-mockup.jpg', status: 'pending' },
  { id: '3', playerId: 'ACC-8834-1190', amount: '$75.00', method: 'E-Wallet', screenshot: '/screenshot-mockup.jpg', status: 'pending' },
  { id: '4', playerId: 'ACC-1156-9981', amount: '$500.00', method: 'Bank Transfer', screenshot: '/screenshot-mockup.jpg', status: 'verified' },
  { id: '5', playerId: 'ACC-7432-5567', amount: '$2,000.00', method: 'Crypto (BTC)', screenshot: '/screenshot-mockup.jpg', status: 'rejected' },
];

const initialUsers: UserItem[] = [
  { id: '1', name: 'John Smith', accountId: 'ACC-4821-7734', balance: '$1,250.00', status: 'online', joined: '2 days ago', initials: 'JS' },
  { id: '2', name: 'Sarah Chen', accountId: 'ACC-2917-4452', balance: '$3,400.00', status: 'online', joined: '1 week ago', initials: 'SC' },
  { id: '3', name: 'Mike Johnson', accountId: 'ACC-8834-1190', balance: '$450.00', status: 'offline', joined: '3 days ago', initials: 'MJ' },
  { id: '4', name: 'Emma Wilson', accountId: 'ACC-1156-9981', balance: '$5,100.00', status: 'online', joined: '2 weeks ago', initials: 'EW' },
  { id: '5', name: 'Alex Brown', accountId: 'ACC-7432-5567', balance: '$200.00', status: 'offline', joined: '1 day ago', initials: 'AB' },
];

const liveSessions: LiveSession[] = [
  { id: '1', name: 'John Smith', initials: 'JS', status: 'active', duration: '12m 34s', ip: '192.168.1.45', device: 'Chrome / Windows' },
  { id: '2', name: 'Sarah Chen', initials: 'SC', status: 'active', duration: '45m 12s', ip: '192.168.1.67', device: 'Safari / macOS' },
  { id: '3', name: 'Emma Wilson', initials: 'EW', status: 'active', duration: '2h 18m', ip: '192.168.1.89', device: 'Firefox / Linux' },
  { id: '4', name: 'David Lee', initials: 'DL', status: 'active', duration: '8m 45s', ip: '192.168.1.23', device: 'Chrome / Android' },
  { id: '5', name: 'Lisa Park', initials: 'LP', status: 'active', duration: '1h 32m', ip: '192.168.1.91', device: 'Safari / iOS' },
  { id: '6', name: 'Tom Harris', initials: 'TH', status: 'active', duration: '22m 07s', ip: '192.168.1.56', device: 'Edge / Windows' },
];

const stats = [
  { icon: TrendingUp, label: 'Total Deposits', value: '$48,290', change: '+12%', color: '#00D084', bgColor: 'rgba(0,208,132,0.1)' },
  { icon: UserCheck, label: 'Active Users', value: '1,247', change: '+8%', color: '#2B6AFF', bgColor: 'rgba(43,106,255,0.1)' },
  { icon: Clock, label: 'Pending Verifications', value: '23', change: '-3%', color: '#FFD700', bgColor: 'rgba(255,215,0,0.1)' },
  { icon: Zap, label: 'Live Sessions', value: '89', change: '+15%', color: '#FF2B2B', bgColor: 'rgba(255,43,43,0.1)' },
];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const handleVerify = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'verified' as const } : t))
    );
    addToast('Transaction verified', 'success');
  };

  const handleReject = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'rejected' as const } : t))
    );
    addToast('Transaction rejected', 'error');
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addToast('User removed', 'success');
  };

  const handleKickSession = (name: string) => {
    addToast(`Session for ${name} has been terminated`, 'success');
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="card-hover"
                  style={{
                    background: '#12162B',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: stat.bgColor }}
                    >
                      <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-md"
                      style={{
                        background: stat.change.startsWith('+') ? 'rgba(0,208,132,0.1)' : 'rgba(255,43,43,0.1)',
                        color: stat.change.startsWith('+') ? '#00D084' : '#FF2B2B',
                      }}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-white text-[28px] font-bold">{stat.value}</p>
                  <p className="text-[#94A3B8] text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Pending Transactions Preview */}
            <div
              className="mt-8 overflow-hidden"
              style={{
                background: '#12162B',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
              }}
            >
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                <h3 className="text-white text-lg font-semibold">Pending Verifications</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-sm font-medium transition-all"
                  style={{ color: '#2B6AFF' }}
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Player ID', 'Amount', 'Method', 'Screenshot', 'Status', 'Actions'].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-6 py-4"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter((t) => t.status === 'pending')
                      .slice(0, 3)
                      .map((t) => (
                        <tr
                          key={t.id}
                          className="transition-colors"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <td className="px-6 py-4 font-mono text-sm text-white">{t.playerId}</td>
                          <td className="px-6 py-4 text-sm text-white">{t.amount}</td>
                          <td className="px-6 py-4 text-sm text-[#94A3B8]">{t.method}</td>
                          <td className="px-6 py-4">
                            <img
                              src={t.screenshot}
                              alt="screenshot"
                              className="w-[60px] h-[40px] rounded-md object-cover cursor-pointer"
                              onClick={() => setSelectedScreenshot(t.screenshot)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className="status-pending text-xs font-medium px-3 py-1.5 rounded-lg">
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleVerify(t.id)}
                                className="p-2 rounded-lg transition-all"
                                style={{ background: 'rgba(0,208,132,0.1)', color: '#00D084' }}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(t.id)}
                                className="p-2 rounded-lg transition-all"
                                style={{ background: 'rgba(255,43,43,0.1)', color: '#FF2B2B' }}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {transactions.filter((t) => t.status === 'pending').length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[#64748B]">
                          No pending transactions
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'transactions':
        return (
          <div
            className="overflow-hidden"
            style={{
              background: '#12162B',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h3 className="text-white text-lg font-semibold">All Transactions</h3>
              <span className="text-[#64748B] text-sm">{transactions.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Player ID', 'Amount', 'Method', 'Screenshot', 'Status', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-6 py-4"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="transition-colors"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <td className="px-6 py-4 font-mono text-sm text-white">{t.playerId}</td>
                      <td className="px-6 py-4 text-sm text-white">{t.amount}</td>
                      <td className="px-6 py-4 text-sm text-[#94A3B8]">{t.method}</td>
                      <td className="px-6 py-4">
                        <img
                          src={t.screenshot}
                          alt="screenshot"
                          className="w-[60px] h-[40px] rounded-md object-cover cursor-pointer"
                          onClick={() => setSelectedScreenshot(t.screenshot)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
                            t.status === 'pending'
                              ? 'status-pending'
                              : t.status === 'verified'
                              ? 'status-verified'
                              : 'status-rejected'
                          }`}
                        >
                          {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {t.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVerify(t.id)}
                                className="p-2 rounded-lg transition-all"
                                style={{ background: 'rgba(0,208,132,0.1)', color: '#00D084' }}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(t.id)}
                                className="p-2 rounded-lg transition-all"
                                style={{ background: 'rgba(255,43,43,0.1)', color: '#FF2B2B' }}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {t.status !== 'pending' && (
                            <span className="text-[#64748B] text-xs">Completed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#64748B]">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'users':
        return (
          <div
            className="overflow-hidden"
            style={{
              background: '#12162B',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h3 className="text-white text-lg font-semibold">Users</h3>
              <button
                className="text-sm font-medium text-white px-5 py-2.5 rounded-lg transition-all"
                style={{ background: '#2B6AFF' }}
              >
                Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['User', 'Account ID', 'Balance', 'Status', 'Joined', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-6 py-4"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="transition-colors"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                            style={{
                              background: 'linear-gradient(135deg, #2B6AFF, #1E5AEE)',
                            }}
                          >
                            {u.initials}
                          </div>
                          <span className="text-white text-sm font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-[#94A3B8]">{u.accountId}</td>
                      <td className="px-6 py-4 text-sm text-white">{u.balance}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: u.status === 'online' ? '#00D084' : '#64748B',
                            }}
                          />
                          <span className="text-sm text-[#94A3B8]">
                            {u.status === 'online' ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#94A3B8]">{u.joined}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg transition-all"
                            style={{ background: 'rgba(43,106,255,0.1)', color: '#2B6AFF' }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-2 rounded-lg transition-all"
                            style={{ background: 'rgba(255,43,43,0.1)', color: '#FF2B2B' }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#64748B]">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'sessions':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-white text-2xl font-bold">Live Sessions</h2>
                <span
                  className="w-2 h-2 rounded-full animate-pulse-dot"
                  style={{ background: '#00D084' }}
                />
              </div>
              <span className="text-[#64748B] text-sm">{liveSessions.length} active</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {liveSessions.map((s) => (
                <div
                  key={s.id}
                  className="card-hover"
                  style={{
                    background: '#1A1F3A',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ background: 'linear-gradient(135deg, #2B6AFF, #1E5AEE)' }}
                    >
                      {s.initials}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{s.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: '#00D084' }}
                        />
                        <span className="text-[#00D084] text-xs">Active now</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-[#64748B] text-xs">Duration</span>
                      <span className="text-white text-xs font-mono">{s.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B] text-xs">IP Address</span>
                      <span className="text-[#94A3B8] text-xs font-mono">{s.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B] text-xs">Device</span>
                      <span className="text-[#94A3B8] text-xs">{s.device}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleKickSession(s.name)}
                    className="w-full py-2 rounded-lg text-xs font-medium transition-all"
                    style={{ background: 'rgba(255,43,43,0.1)', color: '#FF2B2B' }}
                  >
                    Kick Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div
            className="max-w-2xl"
            style={{
              background: '#12162B',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '32px',
            }}
          >
            <h2 className="text-white text-2xl font-bold mb-6">Settings</h2>
            <div className="space-y-6">
              {[
                { label: 'Notification Emails', desc: 'Receive email alerts for new transactions' },
                { label: 'Auto-Verify Small Amounts', desc: 'Automatically verify transactions under $100' },
                { label: 'Two-Factor Authentication', desc: 'Require 2FA for admin login' },
                { label: 'Session Timeout', desc: 'Automatically logout after 30 minutes of inactivity' },
              ].map((setting, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div>
                    <p className="text-white text-sm font-medium">{setting.label}</p>
                    <p className="text-[#64748B] text-xs mt-1">{setting.desc}</p>
                  </div>
                  <button
                    className="w-12 h-7 rounded-full relative transition-all"
                    style={{
                      background: i % 2 === 0 ? '#2B6AFF' : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <span
                      className="absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all"
                      style={{ left: i % 2 === 0 ? '22px' : '2px' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0B0E1A' }}>
      {/* Sidebar */}
      <aside
        className="h-screen sticky top-0 flex flex-col shrink-0 transition-all"
        style={{
          width: collapsed ? '80px' : '280px',
          background: '#12162B',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          padding: '24px',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          {!collapsed && (
            <>
              <span className="text-white font-extrabold text-xl tracking-tight">AGENCY</span>
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-md"
                style={{ background: 'rgba(43,106,255,0.15)', color: '#2B6AFF' }}
              >
                ADMIN
              </span>
            </>
          )}
          {collapsed && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ background: '#2B6AFF' }}
            >
              A
            </div>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-6 -right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs"
          style={{ background: '#1A1F3A', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}
        >
          {collapsed ? '>' : '<'}
        </button>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all relative"
              style={{
                background:
                  activeTab === item.id ? 'rgba(43,106,255,0.1)' : 'transparent',
                color: activeTab === item.id ? '#2B6AFF' : '#94A3B8',
              }}
            >
              {activeTab === item.id && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                  style={{
                    width: '3px',
                    height: '24px',
                    background: '#2B6AFF',
                    borderRadius: '0 3px 3px 0',
                  }}
                />
              )}
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
              {!collapsed && item.badge > 0 && (
                <span
                  className="ml-auto text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: '#FF2B2B' }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all"
          style={{ color: '#FF2B2B' }}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <div
          className="h-[72px] flex items-center justify-between px-8 sticky top-0 z-50"
          style={{
            background: 'rgba(18,22,43,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: '#64748B' }}
            />
            <input
              type="text"
              placeholder="Search..."
              className="text-white text-sm pl-10 pr-4 py-2.5 rounded-lg transition-all"
              style={{
                width: '360px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(43,106,255,0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Bell className="w-5 h-5" style={{ color: '#94A3B8' }} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: '#FF2B2B' }}
              />
            </button>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #2B6AFF, #1E5AEE)' }}
            >
              AD
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-white text-[32px] font-bold">Dashboard</h1>
              <button
                className="text-sm px-4 py-2 rounded-lg flex items-center gap-2"
                style={{
                  background: '#12162B',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#94A3B8',
                }}
              >
                Today
                <span className="text-xs">&#9662;</span>
              </button>
            </div>
          )}
          {activeTab !== 'dashboard' && activeTab !== 'settings' && (
            <h1 className="text-white text-[32px] font-bold mb-6">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          )}
          {renderContent()}
        </div>
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <ScreenshotModal
          imageUrl={selectedScreenshot}
          onClose={() => setSelectedScreenshot(null)}
          onVerify={() => {}}
          onReject={() => {}}
        />
      )}
    </div>
  );
}
