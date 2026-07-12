import React from 'react';

interface Column {
  id: string;
  title: string;
}

interface KanbanProps {
  columns: Column[];
  children: React.ReactNode;
}

export const KanbanBoard: React.FC<KanbanProps> = ({ columns, children }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 h-full">
      {columns.map(col => (
        <div key={col.id} className="min-w-[300px] w-full md:w-80 flex-shrink-0 bg-slate-100 rounded-lg flex flex-col max-h-full">
          <div className="p-3 border-b border-slate-200 font-semibold text-slate-700 bg-slate-50 rounded-t-lg">
            {col.title}
          </div>
          <div className="p-3 flex flex-col gap-3 overflow-y-auto flex-1">
            {/* Find children that belong to this column based on their status */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child) && (child.props as any).status === col.id) {
                return child;
              }
              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

interface KanbanCardProps {
  status: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ children, onClick }) => {
  return (
    <div 
      className={`bg-white p-4 rounded-md shadow-sm border border-slate-200 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
