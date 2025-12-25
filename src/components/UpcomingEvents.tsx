import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { getUpcomingHolidays, type HolidayEvent } from '../utils/dateHelpers';

// Dodajemy interfejs dla propsów
interface UpcomingEventsProps {
  onSelectDate?: (date: Date) => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ onSelectDate }) => {
  const [events, setEvents] = useState<HolidayEvent[]>([]);

  useEffect(() => {
    // Pobieramy święta na najbliższe 30 dni
    const upcoming = getUpcomingHolidays(new Date(), 30);
    setEvents(upcoming);
  }, []);

  // Funkcja pomocnicza do obsługi kliknięcia
  const handleJumpToDate = (date: Date) => {
    if (onSelectDate) {
      onSelectDate(date);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
          <CalendarIcon size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Nadchodzące Święta</h3>
          <p className="text-xs text-slate-500">Najbliższe 30 dni</p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div 
              key={index} 
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer"
              onClick={() => handleJumpToDate(event.date)} // Kliknięcie w cały wiersz też zadziała
            >
              <div className="flex gap-4 items-center">
                {/* Kostka z datą */}
                <div className="flex flex-col items-center justify-center bg-white border border-slate-200 rounded-lg w-12 h-12 shadow-sm flex-shrink-0 group-hover:border-indigo-200 group-hover:shadow-md transition-all">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {event.date.toLocaleDateString('pl-PL', { month: 'short' }).replace('.', '')}
                  </span>
                  <span className="text-lg font-bold text-slate-800 leading-none">
                    {event.date.getDate()}
                  </span>
                </div>
                
                {/* Nazwa święta */}
                <div>
                  <h4 className="font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                    {event.name}
                  </h4>
                  <p className="text-xs text-slate-400 capitalize">
                    {event.date.toLocaleDateString('pl-PL', { weekday: 'long' })}
                    {event.isWorkFree && <span className="text-red-400 ml-2 font-semibold">• Wolne od pracy</span>}
                  </p>
                </div>
              </div>

              {/* Strzałka nawigacji */}
              <button 
                className="text-slate-300 group-hover:text-indigo-500 transition-colors p-2"
                title="Przejdź do daty"
                onClick={(e) => {
                  e.stopPropagation(); // Żeby nie klikało się podwójnie
                  handleJumpToDate(event.date);
                }}
              >
                <ArrowRight size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400">
            Brak nadchodzących świąt w najbliższym czasie.
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 text-xs text-slate-400 text-center">
        Kliknij na święto, aby przejść do kalendarza
      </div>
    </div>
  );
};

export default UpcomingEvents;