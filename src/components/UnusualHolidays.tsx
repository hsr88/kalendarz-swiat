import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import rawData from '../data/unusualHolidays.json';

const UnusualHolidays: React.FC = () => {
  const [todayHolidays, setTodayHolidays] = useState<string[]>([]);
  const [currentDateKey, setCurrentDateKey] = useState<string>('');

  useEffect(() => {
    try {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateKey = `${month}-${day}`;
      setCurrentDateKey(dateKey);

      const data: any = rawData;
      const holidaysMap = data.default ? data.default : data;
      const holidays = holidaysMap[dateKey];

      if (holidays && Array.isArray(holidays)) {
        setTodayHolidays(holidays);
      } else {
        setTodayHolidays([]);
      }
    } catch (err) {
      console.error(err);
      setTodayHolidays([]);
    }
  }, []);

  return (
    // Styl karty identyczny jak UpcomingEvents (biała, cień, border)
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
      
      {/* Nagłówek karty */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
          <Gift size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Święta Nietypowe</h3>
          <p className="text-xs text-slate-500">Na dzień {currentDateKey.replace('-', '.')}</p>
        </div>
      </div>

      {/* Treść karty */}
      <div className="p-4">
        {todayHolidays.length > 0 ? (
          <ul className="space-y-3">
            {todayHolidays.map((holiday, index) => (
              <li key={index} className="flex items-start group">
                <span className="inline-block w-2 h-2 mt-2 mr-3 bg-indigo-400 rounded-full flex-shrink-0 group-hover:bg-indigo-600 transition-colors"></span>
                <span className="text-slate-700 font-medium leading-tight group-hover:text-slate-900 transition-colors">
                  {holiday}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-slate-400">
             <Gift className="w-12 h-12 mx-auto mb-2 opacity-20" />
             <p className="italic">Dzisiaj brak świąt nietypowych.</p>
          </div>
        )}
      </div>
      
      {/* Stopka z ciekawostką lub źródłem (opcjonalnie) */}
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 text-xs text-slate-400 text-center">
        Codziennie nowa dawka dziwnych okazji!
      </div>
    </div>
  );
};

export default UnusualHolidays;