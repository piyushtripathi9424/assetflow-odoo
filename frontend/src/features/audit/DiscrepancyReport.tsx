import React from 'react';

export const DiscrepancyReport: React.FC = () => {
  const discrepancies = [
    { id: '1', asset: 'MacBook Pro 14"', issue: 'MISSING', notes: 'Not found at desk 42', auditor: 'Alice W.', date: 'Oct 2, 2023' },
    { id: '2', asset: 'Projector', issue: 'DAMAGED', notes: 'Lens is cracked', auditor: 'Bob S.', date: 'Oct 3, 2023' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Discrepancy Report</h2>
        <p className="text-sm text-slate-500">Review assets with issues found during audits.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Issue Type</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4">Auditor</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {discrepancies.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{d.asset}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      d.issue === 'MISSING' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {d.issue}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={d.notes}>{d.notes}</td>
                  <td className="px-6 py-4">{d.auditor}</td>
                  <td className="px-6 py-4">{d.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary-600 hover:text-primary-800 font-medium">Resolve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
