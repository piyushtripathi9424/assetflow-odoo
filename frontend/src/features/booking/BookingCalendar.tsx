import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type Asset, assetApi, bookingApi, type Booking } from '../../api/api';
import { Calendar } from '../../components/shared/Calendar';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const bookingSchema = z.object({
  assetId: z.string().min(1, 'Asset is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(5, 'Provide a valid reason (min 5 chars)'),
});
type BookingFormValues = z.infer<typeof bookingSchema>;

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-slate-100 text-slate-600',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

export const BookingPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const watchedAsset = watch('assetId');

  useEffect(() => {
    assetApi.getAll().then(setAssets).catch(console.error);
  }, []);

  useEffect(() => {
    if (watchedAsset) {
      setSelectedAsset(watchedAsset);
      setLoading(true);
      bookingApi.getForAsset(watchedAsset)
        .then(setBookings)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [watchedAsset]);

  const calendarEvents = bookings.map(b => ({
    id: b.id,
    title: `${assets.find(a => a.id === b.assetId)?.name || 'Asset'} (${b.status})`,
    date: new Date(b.startDate),
    color: b.status === 'APPROVED' ? 'green' as const
      : b.status === 'PENDING' ? 'yellow' as const
      : b.status === 'CANCELLED' ? 'red' as const : 'blue' as const,
  }));

  const onSubmit = async (data: BookingFormValues) => {
    setSubmitState('loading');
    setErrorMsg('');
    try {
      await bookingApi.create(data);
      setSubmitState('success');
      reset();
      if (data.assetId) {
        const updated = await bookingApi.getForAsset(data.assetId);
        setBookings(updated);
      }
      setTimeout(() => setSubmitState('idle'), 3000);
    } catch (e: any) {
      setSubmitState('error');
      setErrorMsg(e.message);
      setTimeout(() => setSubmitState('idle'), 4000);
    }
  };

  const handleApprove = async (id: string) => {
    await bookingApi.approve(id);
    if (selectedAsset) {
      const updated = await bookingApi.getForAsset(selectedAsset);
      setBookings(updated);
    }
  };

  const handleCancel = async (id: string) => {
    await bookingApi.cancel(id);
    if (selectedAsset) {
      const updated = await bookingApi.getForAsset(selectedAsset);
      setBookings(updated);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Resource Booking</h2>
          <p className="text-sm text-slate-500">Book assets and view the availability calendar in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-1">New Booking Request</h3>
          <p className="text-xs text-slate-500 mb-5">Submit a request to reserve an asset.</p>

          {submitState === 'success' && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle size={16} /> Booking submitted successfully!
            </div>
          )}
          {submitState === 'error' && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <XCircle size={16} /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Asset</label>
              <select {...register('assetId')} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
                <option value="">Select an asset...</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.name} — {a.location}</option>
                ))}
              </select>
              {errors.assetId && <p className="text-red-500 text-xs mt-1">{errors.assetId.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input type="date" {...register('startDate')} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input type="date" {...register('endDate')} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Booking</label>
              <textarea {...register('reason')} rows={3} placeholder="Why do you need this asset?" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
              {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
            </div>
            <button type="submit" disabled={submitState === 'loading'} className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
              {submitState === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Calendar + bookings list */}
        <div className="xl:col-span-2 space-y-4">
          {selectedAsset && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h4 className="font-semibold text-slate-700 mb-3">Availability Calendar</h4>
              <Calendar currentDate={new Date()} events={calendarEvents} />
            </div>
          )}

          {/* Bookings list */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h4 className="font-semibold text-slate-700">
                {selectedAsset ? `Bookings for selected asset` : 'Select an asset to view bookings'}
              </h4>
            </div>
            {loading ? (
              <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
            ) : bookings.length === 0 && selectedAsset ? (
              <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                <AlertCircle className="text-slate-300" size={32} />
                No bookings found for this asset
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {bookings.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{b.reason || 'No reason given'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[b.status]}`}>{b.status}</span>
                      {b.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprove(b.id)} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded hover:bg-green-100 transition-colors">Approve</button>
                          <button onClick={() => handleCancel(b.id)} className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded hover:bg-red-100 transition-colors">Cancel</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
