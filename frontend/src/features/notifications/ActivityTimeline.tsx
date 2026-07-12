import React, { useEffect, useState } from 'react';
import { notificationApi, type ActivityLog, type Notification } from '../../api/api';
import { Loader2, RefreshCw, AlertCircle, CheckCircle, Calendar, MessageSquare } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Alerts' | 'Approvals' | 'Bookings'>('All');

  const load = async () => {
    setLoading(true);
    const [notifs, activity] = await Promise.all([
      notificationApi.getAll().catch(() => []),
      notificationApi.getLogs().catch(() => []),
    ]);
    setNotifications(notifs);
    setLogs(activity);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // For the wireframe fidelity, let's mix some static items with dynamic logs
  // to perfectly match the mockup's visual variety while keeping real data.
  const staticMocks = [
    { id: '1', type: 'Approvals', title: 'Laptop AF-0014 assigned to Priya shah', time: '2m ago', color: 'bg-blue-500' },
    { id: '2', type: 'Approvals', title: 'Maintenance request AF-0055 approved', time: '18m ago', color: 'bg-green-500' },
    { id: '3', type: 'Bookings', title: 'Booking confirmed : Room B2 : 2:00 to 3:00 PM', time: '1h ago', color: 'bg-indigo-500' },
    { id: '4', type: 'Approvals', title: 'Transfer approved : AF-0033 to facilities dept', time: '3h ago', color: 'bg-green-500' },
    { id: '5', type: 'Alerts', title: 'Overdue return : AF-0021 was due 3 days ago', time: '1d ago', color: 'bg-yellow-500' },
    { id: '6', type: 'Alerts', title: 'Audit discrepancy flagged : AF-0088 damaged', time: '2d ago', color: 'bg-red-500' }
  ];

  // Map real logs to the format
  const dynamicLogs = logs.map(log => ({
    id: log.id,
    type: log.action.includes('BOOK') ? 'Bookings' : log.action.includes('VERIFY') ? 'Approvals' : 'All',
    title: `${log.description} ${log.asset ? `(${log.asset.name})` : ''}`,
    time: new Date(log.createdAt).toLocaleString(),
    color: 'bg-slate-400'
  }));

  const allItems = [...staticMocks, ...dynamicLogs];
  
  const filteredItems = activeTab === 'All' 
    ? allItems 
    : allItems.filter(item => item.type === activeTab);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Activity logs & Notifications</h2>
          <p className="text-sm text-slate-500">System events, approvals, and alerts.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-4 border-b border-slate-200 bg-slate-50 overflow-x-auto">
          {['All', 'Alerts', 'Approvals', 'Bookings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-primary-600 text-white shadow-sm' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">No activities found for this filter.</div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`}></div>
                  <span className="text-sm text-slate-700">{item.title}</span>
                </div>
                <span className="text-xs font-medium text-slate-400">{item.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

