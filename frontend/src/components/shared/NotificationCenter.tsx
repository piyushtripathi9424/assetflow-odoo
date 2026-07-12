import React from 'react';
import { Bell, Check, Clock } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  time: string;
}

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onMarkRead, onMarkAllRead }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden w-full max-w-sm flex flex-col max-h-[500px]">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-700" />
          <h3 className="font-semibold text-slate-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={onMarkAllRead} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            <Check className="w-3 h-3" /> Mark all read
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm">
            No new notifications
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`p-4 transition-colors hover:bg-slate-50 ${!notif.isRead ? 'bg-primary-50/50' : 'bg-white'}`}
              onClick={() => !notif.isRead && onMarkRead(notif.id)}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                  {notif.title}
                </h4>
                {!notif.isRead && <div className="w-2 h-2 rounded-full bg-primary-500 mt-1" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">{notif.message}</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <Clock className="w-3 h-3" />
                {notif.time}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
