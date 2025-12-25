import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarGridProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarGrid = ({ currentDate, onDateSelect }: CalendarGridProps) => {
  const [viewDate, setViewDate] = React.useState(currentDate);

  React.useEffect(() => {
    setViewDate(currentDate);
  }, [currentDate]);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

  const changeMonth = (offset: number) => {
    setViewDate(addMonths(viewDate, offset));
  };

  return (
    // ZMIANA: Styl Glassmorphism
    <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[40px] shadow-xl border border-white/60 w-full max-w-md">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 px-2">
        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-full text-slate-500 hover:text-indigo-600 transition-colors">
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-xl font-serif font-bold capitalize text-indigo-950">
          {format(viewDate, 'MMMM yyyy', { locale: pl })}
        </h2>

        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-full text-slate-500 hover:text-indigo-600 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* DNI TYGODNIA */}
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold text-indigo-300 uppercase py-2 tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* SIATKA */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const isSelected = isSameDay(day, currentDate);
          const isCurrentMonth = isSameMonth(day, viewDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`
                h-10 w-10 mx-auto flex items-center justify-center rounded-full text-sm transition-all duration-300
                ${!isCurrentMonth ? 'text-slate-300 opacity-50' : 'text-slate-600'}
                ${isSelected 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110 font-bold' 
                  : 'hover:bg-white hover:text-indigo-600 hover:scale-105'
                }
                ${isToday && !isSelected ? 'border-2 border-indigo-400 text-indigo-600 font-bold' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;