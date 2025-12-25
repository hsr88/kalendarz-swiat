import React, { useEffect, useState } from 'react';
import { format, addDays, isWithinInterval, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { CalendarDays, ArrowRight, Loader2, PartyPopper } from 'lucide-react';

interface HolidayEvent {
  date: string;
  localName: string;
  name: string;
}

const UpcomingEvents = () => {
  const [events, setEvents] = useState<HolidayEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingHolidays = async () => {
      const today = new Date();
      const nextMonth = addDays(today, 30);
      const currentYear = today.getFullYear();
      const nextYear = nextMonth.getFullYear();
      let allHolidays: HolidayEvent[] = [];

      try {
        const res1 = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/PL`);
        if (res1.ok) allHolidays = [...allHolidays, ...await res1.json()];

        if (nextYear !== currentYear) {
          const res2 = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${nextYear}/PL`);
          if (res2.ok) allHolidays = [...allHolidays, ...await res2.json()];
        }

        const upcoming = allHolidays.filter((holiday) => {
            return isWithinInterval(parseISO(holiday.date), { start: today, end: nextMonth });
        });

        const uniqueUpcoming = Array.from(new Set(upcoming.map(e => JSON.stringify(e))))
            .map(e => JSON.parse(e));

        setEvents(uniqueUpcoming);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchUpcomingHolidays();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/60 overflow-hidden flex flex-col min-h-[400px]">
      
      {/* HEADER */}
      <div className="p-8 border-b border-rose-100/50 bg-white/40">
        <h2 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-rose-100 rounded-xl text-rose-600 shadow-sm">
            <CalendarDays size={24} />
          </div>
          Najbliższe Święta
        </h2>
        <p className="text-slate-500 text-sm mt-2 ml-14">
          Wykaz dni wolnych i świąt na najbliższe 30 dni.
        </p>
      </div>

      {/* TREŚĆ */}
      <div className="flex-1 p-4">
        {loading ? (
          <div className="h-40 flex items-center justify-center text-rose-400 gap-3">
            <Loader2 className="animate-spin" /> Pobieranie danych...
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => {
              const eventDate = parseISO(event.date);
              const daysLeft = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={event.date} className="group p-4 bg-white/40 hover:bg-white/80 rounded-3xl border border-transparent hover:border-rose-100 transition-all flex items-center gap-5 shadow-sm hover:shadow-md">
                  
                  {/* Kostka z datą */}
                  <div className="flex flex-col items-center justify-center bg-white w-16 h-16 rounded-2xl shadow-sm text-slate-700 group-hover:scale-105 transition-transform border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-rose-400 tracking-wider">
                      {format(eventDate, 'MMM', { locale: pl })}
                    </span>
                    <span className="text-2xl font-serif font-bold text-slate-800 leading-none mt-1">
                      {format(eventDate, 'd')}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-rose-600 transition-colors font-serif">
                      {event.localName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-white bg-rose-400 px-2 py-0.5 rounded-full">
                        {daysLeft === 0 ? "To dzisiaj!" : `za ${daysLeft} dni`}
                      </span>
                      <span className="text-slate-400 text-sm capitalize">
                        {format(eventDate, 'EEEE', { locale: pl })}
                      </span>
                    </div>
                  </div>
                  
                  <ArrowRight className="text-rose-200 group-hover:text-rose-500 transition-colors mr-2" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-60 flex flex-col items-center justify-center text-slate-400 opacity-60">
             <PartyPopper size={64} className="mb-4 text-slate-300" />
             <p className="text-lg font-medium">Brak świąt w najbliższym czasie.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;