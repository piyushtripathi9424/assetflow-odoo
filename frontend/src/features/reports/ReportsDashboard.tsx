import React from 'react';
import { Download } from 'lucide-react';

export const ReportsDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reports & Analytics</h2>
          <p className="text-sm text-slate-500">Utilization, maintenance frequency, and most-used assets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization by department */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Utilization by department</h3>
          <div className="h-48 flex items-end justify-around gap-2 px-2 border-b border-l border-slate-200 pt-4">
            <div className="w-full bg-primary-600 rounded-t-sm hover:bg-primary-500 transition-colors cursor-pointer" style={{ height: '40%' }} title="IT"></div>
            <div className="w-full bg-primary-600 rounded-t-sm hover:bg-primary-500 transition-colors cursor-pointer" style={{ height: '70%' }} title="HR"></div>
            <div className="w-full bg-primary-600 rounded-t-sm hover:bg-primary-500 transition-colors cursor-pointer" style={{ height: '90%' }} title="Finance"></div>
            <div className="w-full bg-primary-600 rounded-t-sm hover:bg-primary-500 transition-colors cursor-pointer" style={{ height: '60%' }} title="Operations"></div>
            <div className="w-full bg-primary-600 rounded-t-sm hover:bg-primary-500 transition-colors cursor-pointer" style={{ height: '80%' }} title="Sales"></div>
          </div>
          <div className="flex justify-around mt-2 text-xs text-slate-500 font-medium">
            <span>IT</span><span>HR</span><span>Fin</span><span>Ops</span><span>Sales</span>
          </div>
        </div>

        {/* Maintenance Frequency */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Maintenance Frequency</h3>
          <div className="h-48 relative border-b border-l border-slate-200 pt-4">
            {/* Simple SVG Line Chart representation */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <polyline 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="2"
                points="0,80 20,60 40,70 60,30 80,45 100,10" 
              />
              <circle cx="0" cy="80" r="3" fill="#2563eb" className="hover:r-[5px] transition-all cursor-pointer" />
              <circle cx="20" cy="60" r="3" fill="#2563eb" className="hover:r-[5px] transition-all cursor-pointer" />
              <circle cx="40" cy="70" r="3" fill="#2563eb" className="hover:r-[5px] transition-all cursor-pointer" />
              <circle cx="60" cy="30" r="3" fill="#2563eb" className="hover:r-[5px] transition-all cursor-pointer" />
              <circle cx="80" cy="45" r="3" fill="#2563eb" className="hover:r-[5px] transition-all cursor-pointer" />
              <circle cx="100" cy="10" r="3" fill="#2563eb" className="hover:r-[5px] transition-all cursor-pointer" />
            </svg>
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most used assets */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Most used assets</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
              <span className="font-medium text-slate-700">Room B2</span>
              <span className="text-slate-500">34 bookings this month</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
              <span className="font-medium text-slate-700">Van AF-343</span>
              <span className="text-slate-500">21 trips this month</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">Projector AF-335</span>
              <span className="text-slate-500">18 uses</span>
            </div>
          </div>
        </div>

        {/* Idle assets */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Idle assets</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
              <span className="font-medium text-slate-700">Camera AF-0301</span>
              <span className="text-slate-500">unused 60+ days</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">Chair AF-0410</span>
              <span className="text-slate-500">unused 45 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assets due for maintenance / nearing retirement */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Assets due for maintenance / nearing retirement</h3>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
            <span className="font-medium text-slate-700">Forklift AF-0087</span>
            <span className="text-red-500 font-medium bg-red-50 px-2 py-1 rounded">service due in 5 days</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-slate-700">Laptop AF-0020</span>
            <span className="text-yellow-700 font-medium bg-yellow-50 px-2 py-1 rounded">4 years old : nearing retirement</span>
          </div>
        </div>
        
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Download size={16} /> Export report
        </button>
      </div>

    </div>
  );
};
