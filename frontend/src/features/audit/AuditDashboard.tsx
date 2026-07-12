import React, { useEffect, useState } from 'react';
import { auditApi, assetApi, type Audit, type AuditItem, type Asset } from '../../api/api';
import { Loader2, CheckCircle, Lock, AlertTriangle, Plus } from 'lucide-react';

export const AuditDashboard: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const [a, ass] = await Promise.all([auditApi.getAll(), assetApi.getAll()]);
    setAudits(a);
    setAssets(ass);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStart = async () => {
    if (!newName || selectedAssets.length === 0) return;
    setCreating(true);
    await auditApi.start({ name: newName, assetIds: selectedAssets });
    setNewName('');
    setSelectedAssets([]);
    setShowNew(false);
    setCreating(false);
    load();
  };

  const handleClose = async (id: string) => {
    await auditApi.close(id);
    setSelectedAudit(null);
    load();
  };

  const handleVerify = async (itemId: string, status: 'VERIFIED' | 'DISCREPANCY', discrepancyType?: string) => {
    await auditApi.verify(itemId, { status, discrepancyType });
    if (selectedAudit) {
      const fresh = await auditApi.getDetails(selectedAudit.id);
      setSelectedAudit(fresh);
    }
    load();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full p-20 text-slate-400">
      <Loader2 className="animate-spin mr-2" /> Loading audits...
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Audit Management</h2>
          <p className="text-sm text-slate-500">Create audits, verify assets, and generate discrepancy reports.</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} /> {showNew ? 'Cancel' : 'Start New Audit'}
        </button>
      </div>

      {showNew && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-lg space-y-4">
          <h3 className="font-bold text-slate-800">Create New Audit</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Audit Name</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Q4 IT Assets Audit" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Assets to Audit</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {assets.map(a => (
                <label key={a.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                  <input type="checkbox" value={a.id} checked={selectedAssets.includes(a.id)}
                    onChange={e => setSelectedAssets(prev => e.target.checked ? [...prev, a.id] : prev.filter(x => x !== a.id))}
                    className="rounded" />
                  {a.name} <span className="text-slate-400 text-xs">({a.location})</span>
                </label>
              ))}
            </div>
          </div>
          <button onClick={handleStart} disabled={creating || !newName || selectedAssets.length === 0}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            {creating ? <Loader2 size={16} className="animate-spin" /> : null} Start Audit
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Audit cards */}
        <div className="space-y-4">
          {audits.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">
              No audits yet. Start your first audit above.
            </div>
          )}
          {audits.map(audit => {
            const total = (audit._count?.items ?? 0);
            return (
              <div key={audit.id} onClick={() => auditApi.getDetails(audit.id).then(setSelectedAudit)}
                className={`bg-white rounded-xl border p-5 shadow-sm cursor-pointer hover:shadow-md transition-all ${selectedAudit?.id === audit.id ? 'border-primary-400 ring-2 ring-primary-100' : 'border-slate-200'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{audit.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Auditor: {audit.auditor?.name || 'Admin User'}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${audit.status === 'CLOSED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {audit.status === 'CLOSED' ? <Lock size={10} /> : null} {audit.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{total} asset(s) in scope · Started {new Date(audit.startDate).toLocaleDateString()}</p>
                {audit.status === 'IN_PROGRESS' && (
                  <button onClick={e => { e.stopPropagation(); handleClose(audit.id); }} className="mt-3 text-xs bg-slate-50 border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 px-3 py-1 rounded-lg transition-colors">
                    Close Audit
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Audit detail: verify items */}
        {selectedAudit && selectedAudit.items && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Asset Verification — {selectedAudit.name}</h3>
            </div>
            <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
              {selectedAudit.items.map((item: AuditItem) => (
                <div key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{item.asset?.name}</p>
                      <p className="text-xs text-slate-400">{item.asset?.serialNumber} · {item.asset?.location}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : item.status === 'DISCREPANCY' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.status === 'UNVERIFIED' && selectedAudit.status === 'IN_PROGRESS' && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleVerify(item.id, 'VERIFIED')} className="flex-1 text-xs bg-green-50 border border-green-200 text-green-700 py-1.5 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-1">
                        <CheckCircle size={12} /> Verified OK
                      </button>
                      <button onClick={() => handleVerify(item.id, 'DISCREPANCY', 'MISSING')} className="flex-1 text-xs bg-red-50 border border-red-200 text-red-700 py-1.5 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                        <AlertTriangle size={12} /> Mark Missing
                      </button>
                      <button onClick={() => handleVerify(item.id, 'DISCREPANCY', 'DAMAGED')} className="flex-1 text-xs bg-orange-50 border border-orange-200 text-orange-700 py-1.5 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-1">
                        <AlertTriangle size={12} /> Mark Damaged
                      </button>
                    </div>
                  )}
                  {item.discrepancyType && <p className="text-xs mt-1 text-red-600 font-medium">Discrepancy: {item.discrepancyType}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
