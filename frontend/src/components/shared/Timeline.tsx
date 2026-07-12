import React from 'react';

interface TimelineItemProps {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItemProps[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="relative pl-6 border-l-2 border-slate-200 ml-4 py-2 space-y-6">
      {items.map((item) => (
        <div key={item.id} className="relative">
          <div className="absolute -left-[35px] top-1 bg-white p-1 rounded-full border-2 border-primary-500 text-primary-500 flex items-center justify-center w-6 h-6 shadow-sm">
            {item.icon || <div className="w-2 h-2 rounded-full bg-primary-500" />}
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-slate-800">{item.title}</h4>
              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{item.timestamp}</span>
            </div>
            <p className="text-sm text-slate-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
