import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

interface CalendarProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ currentDate, events, onDateClick, onEventClick }) => {
  const startDate = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const colors = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {days.map(day => (
          <div key={day.toISOString()} className="p-2 text-center text-sm font-semibold text-slate-600">
            {format(day, 'EEE')}
          </div>
        ))}
      </div>
      
      {/* 4 weeks view for simplicity in this mock */}
      {Array.from({ length: 4 }).map((_, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 border-b last:border-0 border-slate-100">
          {days.map((day) => {
            const currentCellDate = addDays(day, weekIndex * 7);
            const dayEvents = events.filter(e => isSameDay(e.date, currentCellDate));

            return (
              <div 
                key={currentCellDate.toISOString()} 
                className="min-h-[100px] p-2 border-r last:border-0 border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col gap-1"
                onClick={() => onDateClick?.(currentCellDate)}
              >
                <div className={`text-sm ${isSameDay(currentCellDate, new Date()) ? 'font-bold text-primary-600' : 'text-slate-500'}`}>
                  {format(currentCellDate, 'd')}
                </div>
                {dayEvents.map(event => (
                  <div 
                    key={event.id}
                    onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                    className={`text-xs p-1 rounded border truncate ${colors[event.color || 'blue']}`}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
