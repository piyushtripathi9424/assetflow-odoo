import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const requestSchema = z.object({
  assetId: z.string().min(1, 'Asset is required'),
  issue: z.string().min(10, 'Please provide more details about the issue'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export const MaintenanceRequestForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
  });

  const onSubmit = (data: RequestFormValues) => {
    console.log('Submit maintenance request:', data);
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-1">Raise Maintenance Request</h3>
      <p className="text-xs text-slate-500 mb-6">Report a broken or malfunctioning asset.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Asset</label>
          <select 
            {...register('assetId')} 
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          >
            <option value="">Select an asset...</option>
            <option value="1">MacBook Pro 16" - IT Dept</option>
            <option value="2">Sony A7IV Camera - Marketing</option>
          </select>
          {errors.assetId && <p className="text-red-500 text-xs mt-1">{errors.assetId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Describe the Issue</label>
          <textarea 
            {...register('issue')} 
            rows={4}
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="What seems to be the problem?"
          />
          {errors.issue && <p className="text-red-500 text-xs mt-1">{errors.issue.message}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};
