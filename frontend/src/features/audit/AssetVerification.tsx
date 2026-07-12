import React, { useState } from 'react';

export const AssetVerification: React.FC = () => {
  const [status, setStatus] = useState<'VERIFIED' | 'DISCREPANCY' | null>(null);

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-10">
      <div className="mb-6">
        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full mb-2 inline-block">Audit: Q3 IT Assets</span>
        <h2 className="text-2xl font-bold text-slate-800">Verify Asset</h2>
        <p className="text-sm text-slate-500">Scan or search for an asset to verify its physical presence.</p>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
        <h3 className="font-semibold text-slate-800 mb-2">Asset Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-slate-500 text-xs">Name</span>
            <span className="font-medium">MacBook Pro 16"</span>
          </div>
          <div>
            <span className="block text-slate-500 text-xs">Serial Number</span>
            <span className="font-medium">C02DG43LMD6R</span>
          </div>
          <div>
            <span className="block text-slate-500 text-xs">Expected Location</span>
            <span className="font-medium">HQ - Floor 3</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">Verification Status</label>
        <div className="flex gap-4">
          <button 
            onClick={() => setStatus('VERIFIED')}
            className={`flex-1 py-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-colors ${
              status === 'VERIFIED' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Verified (Present & OK)
          </button>
          <button 
            onClick={() => setStatus('DISCREPANCY')}
            className={`flex-1 py-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-colors ${
              status === 'DISCREPANCY' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Discrepancy Found
          </button>
        </div>

        {status === 'DISCREPANCY' && (
          <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discrepancy Type</label>
              <select className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none">
                <option value="MISSING">Asset Missing</option>
                <option value="DAMAGED">Asset Damaged</option>
                <option value="LOCATION_MISMATCH">Location Mismatch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea rows={3} className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Provide additional details..." />
            </div>
          </div>
        )}

        <button 
          disabled={!status}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors mt-6"
        >
          Save Verification
        </button>
      </div>
    </div>
  );
};
