import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import { BookingPage } from './features/booking/BookingCalendar';
import { MaintenancePage } from './features/maintenance/MaintenanceKanban';
import { AuditDashboard } from './features/audit/AuditDashboard';
import { DiscrepancyReport } from './features/audit/DiscrepancyReport';
import { NotificationsPage } from './features/notifications/ActivityTimeline';
import { ReportsDashboard } from './features/reports/ReportsDashboard';
import { NotificationCenter } from './components/shared/NotificationCenter';
import { notificationApi, type Notification } from './api/api';
import { LayoutDashboard, Calendar, Wrench, ShieldCheck, Bell, Activity, FileWarning, Menu, X, Settings, Package, ArrowRightLeft, PieChart, User as UserIcon } from 'lucide-react';

const allNavLinks = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/organization', label: 'Organization setup', icon: <Settings size={18} /> },
  { to: '/assets', label: 'Assets', icon: <Package size={18} /> },
  { to: '/transfer', label: 'Allocation & Transfer', icon: <ArrowRightLeft size={18} /> },
  { to: '/booking', label: 'Resource Booking', icon: <Calendar size={18} /> },
  { to: '/maintenance', label: 'Maintenance', icon: <Wrench size={18} /> },
  { to: '/audit', label: 'Audit', icon: <ShieldCheck size={18} /> },
  { to: '/reports', label: 'Reports', icon: <PieChart size={18} /> },
  { to: '/notifications', label: 'Notifications', icon: <Activity size={18} /> },
];

const NavLink: React.FC<{ to: string; label: string; icon: React.ReactNode }> = ({ to, label, icon }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
      <span className={`flex items-center justify-center ${active ? 'text-primary-600' : 'text-slate-400'}`}>{icon}</span>
      {label}
    </Link>
  );
};

const Layout = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Role State
  const [role, setRole] = useState(localStorage.getItem('appRole') || 'ADMIN');

  useEffect(() => {
    notificationApi.getAll().then(setNotifications).catch(() => {});
  }, []);

  const unread = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    await notificationApi.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleRole = () => {
    const newRole = role === 'ADMIN' ? 'USER' : 'ADMIN';
    localStorage.setItem('appRole', newRole);
    setRole(newRole);
    window.location.href = '/'; // Reload to reset state and clear caches
  };

  const navLinks = role === 'ADMIN' 
    ? allNavLinks 
    : allNavLinks.filter(l => ['/', '/booking', '/maintenance', '/notifications'].includes(l.to));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed md:static z-40 inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-5 border-b border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">AssetFlow</h1>
            <span className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider">{role} PANEL</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map(l => <NavLink key={l.to} {...l} />)}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${role === 'ADMIN' ? 'bg-slate-800 text-white border-slate-900' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              {role === 'ADMIN' ? 'A' : 'U'}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">{role === 'ADMIN' ? 'Admin User' : 'Standard User'}</p>
              <p className="text-xs text-slate-500">{role === 'ADMIN' ? 'admin@assetflow.com' : 'user@assetflow.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm z-20">
          <button className="md:hidden p-2 text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-3 ml-auto">
            {/* Role Toggle */}
            <button 
              onClick={toggleRole}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            >
              <UserIcon size={14} />
              Switch to {role === 'ADMIN' ? 'User' : 'Admin'}
            </button>

            <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell size={18} className="text-slate-600" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-white text-[9px] flex items-center justify-center font-bold">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 mt-2 z-50 top-12">
                <NotificationCenter
                  notifications={notifications.map(n => ({ id: n.id, title: n.title, message: n.message, isRead: n.isRead, time: new Date(n.createdAt).toLocaleString() }))}
                  onMarkRead={handleMarkRead}
                  onMarkAllRead={handleMarkAllRead}
                />
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50" onClick={() => showNotifs && setShowNotifs(false)}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Placeholder for unimplemented pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full min-h-[60vh]">
    <div className="text-center text-slate-500">
      <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
      <p>This module is under development.</p>
    </div>
  </div>
);

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <div className="flex items-center justify-center h-full min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100">
                <LayoutDashboard className="text-primary-600" size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to AssetFlow</h2>
              <p className="text-slate-500 text-sm">Select a module from the sidebar to get started.</p>
            </div>
          </div>
        } />
        <Route path="organization" element={<Placeholder title="Organization Setup" />} />
        <Route path="assets" element={<Placeholder title="Assets" />} />
        <Route path="transfer" element={<Placeholder title="Allocation & Transfer" />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="audit" element={<AuditDashboard />} />
        <Route path="audit/discrepancies" element={<DiscrepancyReport />} />
        <Route path="reports" element={<ReportsDashboard />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
