import React, { useState, useEffect } from 'react';
import rawData from '../data/unusualHolidays.json';

const UnusualHolidays: React.FC = () => {
  const [todayHolidays, setTodayHolidays] = useState<string[]>([]);
  const [currentDateKey, setCurrentDateKey] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    try {
      const today = new Date();
      // Format MM-DD (np. 12-25)
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateKey = `${month}-${day}`;
      setCurrentDateKey(dateKey);

      // --- KLUCZOWA POPRAWKA ---
      // Niektóre konfiguracje pakują JSON w pole .default, inne dają go bezpośrednio.
      // Sprawdzamy obie opcje:
      const data: any = rawData;
      const holidaysMap = data.default ? data.default : data;

      console.log('Klucz daty:', dateKey);
      console.log('Dostępne dane:', holidaysMap);

      if (!holidaysMap) {
        setDebugInfo('Błąd: Nie udało się odczytać struktury JSON.');
        return;
      }

      const holidays = holidaysMap[dateKey];

      if (holidays && Array.isArray(holidays)) {
        setTodayHolidays(holidays);
        setDebugInfo(''); // Czyścimy błędy, jeśli znaleziono
      } else {
        setTodayHolidays([]);
        setDebugInfo(`Brak świąt dla klucza: ${dateKey}.`);
      }

    } catch (err) {
      console.error(err);
      setDebugInfo('Wystąpił krytyczny błąd w komponencie.');
    }
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
      <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">
          📅 Święta Nietypowe
        </h3>
        <span className="text-xs text-gray-400 font-mono">{currentDateKey}</span>
      </div>

      {/* Wyświetlanie listy świąt */}
      {todayHolidays.length > 0 ? (
        <ul className="space-y-3">
          {todayHolidays.map((holiday, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-indigo-500 rounded-full flex-shrink-0"></span>
              <span className="text-gray-700 font-medium leading-tight">
                {holiday}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
           <p className="text-gray-500 italic mb-2">Dzisiaj brak nietypowych świąt.</p>
           {/* Wyświetl info debugowania tylko jeśli lista jest pusta, żebyś widział co jest grane */}
           <p className="text-xs text-red-400 bg-red-50 p-2 rounded border border-red-100">
             Debug: {debugInfo}
           </p>
        </div>
      )}
    </div>
  );
};

export default UnusualHolidays;