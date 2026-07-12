import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { assetApi, maintenanceApi, type MaintenanceRequest, type Asset } from '../../api/api';
import { KanbanBoard, KanbanCard } from '../../components/shared/Kanban';
import { Loader2, CheckCircle, Wrench } from 'lucide-react';

const requestSchema = z.object({
  assetId: z.string().min(1, 'Asset is required'),
  issue: z.string().min(10, 'Describe the issue in detail (min 10 chars)'),
});
type RequestFormValues = z.infer<typeof requestSchema>;

const resolveSchema = z.object({
  resolution: z.string().min(5, 'Describe resolution'),
  cost: z.string().optional(),
});
type ResolveFormValues = z.infer<typeof resolveSchema>;

const statusBadge: Record<string, string> = {
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export const MaintenancePage: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [resolveId, setResolveId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
  });
  const resolveForm = useForm<ResolveFormValues>({ resolver: zodResolver(resolveSchema) });

  const load = async () => {
    setLoading(true);
    const [reqs, ass] = await Promise.all([maintenanceApi.getAll(), assetApi.getAll()]);
    setRequests(reqs);
    setAssets(ass);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { id: 'PENDING_APPROVAL', title: '🟡 Pending Approval' },
    { id: 'APPROVED', title: '🔵 Approved' },
    { id: 'IN_PROGRESS', title: '🔧 In Progress' },
    { id: 'RESOLVED', title: '✅ Resolved' },
  ];

  const onSubmit = async (data: RequestFormValues) => {
    await maintenanceApi.create(data);
    reset();
    setShowForm(false);
    load();
  };

  const handleApprove = async (id: string) => {
    await maintenanceApi.approve(id);
    load();
  };

  const handleResolve = async (data: ResolveFormValues) => {
    if (!resolveId) return;
    await maintenanceApi.resolve(resolveId, data.resolution, data.cost ? parseFloat(data.cost) : undefined);
    setResolveId(null);
    resolveForm.reset();
    load();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full p-20 text-slate-400">
      <Loader2 className="animate-spin mr-2" /> Loading maintenance board...
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Maintenance Board</h2>
          <p className="text-sm text-slate-500">Track asset maintenance from request to resolution.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          {showForm ? '✕ Close' : '+ Raise Request'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-lg">
          <h3 className="font-bold text-slate-800 mb-4">Raise Maintenance Request</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Asset</label>
              <select {...register('assetId')} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500 bg-white">
                <option value="">Select asset...</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              {errors.assetId && <p className="text-red-500 text-xs mt-1">{errors.assetId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Describe the Issue</label>
              <textarea {...register('issue')} rows={3} placeholder="What is wrong with the asset?" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none" />
              {errors.issue && <p className="text-red-500 text-xs mt-1">{errors.issue.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Wrench size={16} />} Submit Request
            </button>
          </form>
        </div>
      )}

      {resolveId && (
        <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm max-w-lg">
          <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2"><CheckCircle size={18} /> Resolve Maintenance</h3>
          <form onSubmit={resolveForm.handleSubmit(handleResolve)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Resolution Notes</label>
              <textarea {...resolveForm.register('resolution')} rows={3} placeholder="What was done to fix this?" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              {resolveForm.formState.errors.resolution && <p className="text-red-500 text-xs mt-1">{resolveForm.formState.errors.resolution.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Repair Cost (optional)</label>
              <input type="number" step="0.01" {...resolveForm.register('cost')} placeholder="0.00" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors">Mark Resolved</button>
              <button type="button" onClick={() => setResolveId(null)} className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <KanbanBoard columns={columns}>
          {requests.map(req => (
            <KanbanCard key={req.id} status={req.status} onClick={() => setSelectedId(selectedId === req.id ? null : req.id)}>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge[req.status]}`}>{req.status.replace('_', ' ')}</span>
                  <span className="text-xs text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="font-semibold text-slate-800 text-sm">{req.asset?.name || req.assetId}</p>
                <p className="text-xs text-slate-500 line-clamp-2">{req.issue}</p>
                {selectedId === req.id && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {req.status === 'PENDING_APPROVAL' && (
                      <button onClick={() => handleApprove(req.id)} className="w-full text-xs bg-blue-50 text-blue-700 border border-blue-200 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                        <CheckCircle size={12} /> Approve Request
                      </button>
                    )}
                    {req.status === 'IN_PROGRESS' && (
                      <button onClick={() => setResolveId(req.id)} className="w-full text-xs bg-green-50 text-green-700 border border-green-200 py-1.5 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-1">
                        <CheckCircle size={12} /> Mark as Resolved
                      </button>
                    )}
                    {req.resolution && (
                      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                        <span className="font-semibold">Resolution:</span> {req.resolution}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </KanbanCard>
          ))}
        </KanbanBoard>
      </div>
    </div>
  );
};
