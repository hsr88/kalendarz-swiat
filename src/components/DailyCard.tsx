import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Moon, Star, Sunrise, Sunset, Quote } from 'lucide-react';
import namedaysData from '../data/namedays.json';
import quotesData from '../data/quotes.json'; // <--- NOWY IMPORT BAZY CYTATÓW
import { getMoonPhase, getZodiacSign, getSunTimes } from '../utils/astroHelpers';

// --- TYPY ---
interface DailyData {
  date: Date;
  holidays: string[];
  nameDays: string;
  quote: { text: string; author: string };
  astro: {
    moon: string;
    zodiac: string;
    sun: { sunrise: string, sunset: string };
  }
}

// --- HELPERY ---
const getNameDay = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const key = `${month}-${day}`;
  const data = namedaysData as Record<string, string>;
  return data[key] || "Brak danych";
};

const fetchHolidaysAPI = async (date: Date): Promise<string[]> => {
  const year = date.getFullYear();
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/PL`);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    const todayStr = format(date, 'yyyy-MM-dd');
    return data.filter((h: any) => h.date === todayStr).map((h: any) => h.localName);
  } catch (error) { return []; }
};

interface DailyCardProps {
  currentDate: Date;
  options: { showMoon: boolean; showZodiac: boolean; showSun: boolean; };
}

// --- KOMPONENT ---
const DailyCard = ({ currentDate, options }: DailyCardProps) => {
  const [data, setData] = useState<DailyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      const nameDays = getNameDay(currentDate);
      
      // NOWE: Losowanie z dużej bazy JSON
      const randomQuote = quotesData[Math.floor(Math.random() * quotesData.length)];
      
      const holidays = await fetchHolidaysAPI(currentDate);
      
      const astroData = {
        moon: getMoonPhase(currentDate),
        zodiac: getZodiacSign(currentDate),
        sun: getSunTimes(currentDate)
      };

      setData({ date: currentDate, holidays, nameDays, quote: randomQuote, astro: astroData });
      setLoading(false);
    };
    loadData();
  }, [currentDate]);

  if (loading) {
    return (
      <div className="w-full max-w-md h-[500px] flex items-center justify-center bg-white/40 backdrop-blur-xl rounded-[40px] shadow-xl border border-white/50">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            <span className="text-indigo-900/50 text-sm font-medium tracking-widest uppercase">Ładowanie...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const dayName = format(data.date, 'EEEE', { locale: pl });
  const dayNumber = format(data.date, 'd', { locale: pl });
  const monthName = format(data.date, 'MMMM', { locale: pl });
  const year = format(data.date, 'yyyy', { locale: pl });
  const showAstroSection = options.showMoon || options.showZodiac || options.showSun;

  return (
    <motion.div 
      key={currentDate.toISOString()} 
      initial={{ opacity: 0, y: 20, rotateX: -5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative w-full max-w-md group"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-[45px] blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>

      {/* Główna Karta */}
      <div className="relative bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-xl overflow-hidden border border-white/60">
        
        {/* HEADER */}
        <div className="pt-10 pb-6 px-8 text-center relative">
          <span className="block text-indigo-900/40 text-sm font-bold tracking-[0.3em] uppercase mb-2">{year}</span>
          
          <div className="relative inline-block">
            {/* Solidny kolor dla czytelności */}
            <h1 className="text-[8rem] leading-[0.8] font-serif text-indigo-900 drop-shadow-md select-none">
              {dayNumber}
            </h1>
            <span className="absolute top-2 -right-4 text-5xl text-indigo-400 font-serif opacity-60"></span>
          </div>
          
          <div className="mt-4">
            <h2 className="text-3xl text-indigo-950 font-serif capitalize tracking-wide">{monthName}</h2>
            <p className="text-indigo-600/80 font-medium capitalize mt-2 flex items-center justify-center gap-3 text-sm">
              <span className="w-6 h-[1px] bg-indigo-300"></span>
              {dayName}
              <span className="w-6 h-[1px] bg-indigo-300"></span>
            </p>
          </div>
        </div>

        {/* TREŚĆ */}
        <div className="px-8 pb-10 space-y-8">
          
          {/* Sekcja Astro */}
          {showAstroSection && (
            <div className="grid grid-cols-2 gap-3 bg-white/40 p-4 rounded-3xl border border-white/40 shadow-sm">
               {options.showMoon && (
                  <div className="flex flex-col items-center p-2">
                     <Moon size={18} className="text-indigo-500 mb-1" />
                     <span className="text-[10px] uppercase tracking-widest text-slate-500">Księżyc</span>
                     <span className="text-sm font-semibold text-slate-700 text-center leading-tight">{data.astro.moon}</span>
                  </div>
               )}
               {options.showZodiac && (
                  <div className="flex flex-col items-center p-2 border-l border-indigo-100/50">
                     <Star size={18} className="text-purple-500 mb-1" />
                     <span className="text-[10px] uppercase tracking-widest text-slate-500">Zodiak</span>
                     <span className="text-sm font-semibold text-slate-700">{data.astro.zodiac}</span>
                  </div>
               )}
               {options.showSun && (
                 <div className="col-span-2 flex justify-between items-center px-4 pt-2 border-t border-indigo-100/50 mt-1">
                    <div className="flex items-center gap-2">
                      <Sunrise size={16} className="text-amber-500"/>
                      <span className="text-sm text-slate-600 font-medium">{data.astro.sun.sunrise}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 font-medium">{data.astro.sun.sunset}</span>
                      <Sunset size={16} className="text-indigo-400"/>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* Święta */}
          <div className="relative group/holiday">
             <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-amber-300/50 group-hover/holiday:bg-amber-400 transition-colors"></div>
             <div className="pl-8">
                <h3 className="flex items-center gap-2 text-amber-600/80 font-bold text-xs uppercase tracking-widest mb-2">
                  <Sparkles size={14} /> Okazje
                </h3>
                {data.holidays.length > 0 ? (
                  data.holidays.map((h, i) => (
                    <p key={i} className="text-lg font-serif text-slate-800 leading-tight mb-1">{h}</p>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm italic">Dzień bez świąt oficjalnych</p>
                )}
             </div>
          </div>

          {/* Imieniny */}
          <div className="relative group/name">
             <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-emerald-300/50 group-hover/name:bg-emerald-400 transition-colors"></div>
             <div className="pl-8">
                <h3 className="flex items-center gap-2 text-emerald-600/80 font-bold text-xs uppercase tracking-widest mb-2">
                  <Gift size={14} /> Solenizanci
                </h3>
                <p className="text-slate-700 text-md leading-relaxed">
                   {data.nameDays.split(',').join(' • ')}
                </p>
             </div>
          </div>

          {/* Cytat */}
          <div className="bg-indigo-50/40 p-6 rounded-3xl border border-indigo-100/30 relative">
            <Quote className="absolute top-4 left-4 text-indigo-300 w-6 h-6 opacity-40 transform -scale-x-100" />
            <p className="text-center text-indigo-900/90 italic font-serif text-lg leading-relaxed pt-2">
              "{data.quote.text}"
            </p>
            <p className="text-center text-indigo-400 text-[10px] font-bold uppercase mt-4 tracking-[0.2em]">
              {data.quote.author}
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default DailyCard;