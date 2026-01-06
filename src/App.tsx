import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useDrag } from '@use-gesture/react';
import { useAnimation, motion } from 'framer-motion';

// Importy komponentów
import DailyCard from './components/DailyCard';
import CalendarGrid from './components/CalendarGrid';
import NameSearch from './components/NameSearch';
import UpcomingEvents from './components/UpcomingEvents';
import UnusualHolidays from './components/UnusualHolidays';
import Layout, { type ViewState } from './components/Layout';
import { Preferences } from '@capacitor/preferences';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

function App() {
  // Stan daty i kalendarza
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  
  // Stan widoku
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [showCookieNote, setShowCookieNote] = useState(!localStorage.getItem('cookieConsent'));

  // Animacje dla gestu
  const controls = useAnimation();

  // Opcje Astro
  const [viewOptions, setViewOptions] = useState({
    showMoon: false,
    showZodiac: false,
    showSun: false,
  });

  // --- LOGIKA GESTU PULL-TO-REFRESH ---
  const bind = useDrag(({ active, movement: [, y], last }) => {
    // Aktywuj tylko w widoku domowym i przy ruchu w dół
    if (currentView === 'home' && y > 0) {
      // Efekt "gumy" (opór przy ciągnięciu)
      controls.start({ y: active ? y / 2.5 : 0 });

      // Jeśli puszczono palec (last) i przeciągnięto więcej niż 150px
      if (last && y > 150) {
        // Reset do dzisiaj
        const today = new Date();
        setCurrentDate(today);
        
        // Pokaż kalendarz jeśli był ukryty
        setShowCalendar(true);
        
        // Wibracja (Haptic Feedback)
        if (window.navigator.vibrate) window.navigator.vibrate(15);
      }
    }
  }, { 
    axis: 'y',       // Wykrywaj tylko ruch pionowy
    filterTaps: true, // Ignoruj zwykłe kliknięcia
    pointer: { touch: true } 
  });

  // --- LOGIKA TRYBU CIEMNEGO ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // --- FUNKCJA WIDŻETU ---
  const updateWidgetData = async (date: Date, names: string, holiday: string) => {
    try {
      await Preferences.set({ key: 'widget_day', value: format(date, 'd') });
      await Preferences.set({ key: 'widget_month', value: format(date, 'MMMM', { locale: pl }) });
      await Preferences.set({ key: 'widget_names', value: names });
      await Preferences.set({ key: 'widget_holiday', value: holiday || format(date, 'EEEE', { locale: pl }) });
    } catch (error) {
      console.error("Błąd aktualizacji widżetu:", error);
    }
  };
  
  const toggleOption = (key: keyof typeof viewOptions) => {
    setViewOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleNavigateToDate = (date: Date) => {
    setCurrentDate(date);
    setCurrentView('home'); 
  };

  return (
    <Layout 
      onNavigate={setCurrentView} 
      options={viewOptions} 
      toggleOption={toggleOption}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    >
      {/* GŁÓWNY KONTENER Z ANIMACJĄ 
          Dodano {...bind()} do obsługi dotyku oraz animate={controls} do ruchu
      */}
      <motion.div 
        {...(bind() as any)} 
        animate={controls}
        className="flex flex-col items-center gap-6 w-full min-h-[calc(100vh-200px)] touch-pan-y"
      >
        
        {currentView === 'home' && (
          <div className="w-full flex flex-col items-center gap-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 md:gap-4 bg-white dark:bg-slate-800 p-1.5 md:p-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 mt-4 transition-colors">
              <button onClick={() => changeDate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors">
                <ChevronLeft size={24} />
              </button>
              
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  showCalendar ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <CalendarIcon size={16} />
                <span className="capitalize">
                  {currentDate.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}
                </span>
              </button>
              
              <button onClick={() => changeDate(1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-10 items-center justify-center w-full max-w-3xl">
              <div className="w-full flex justify-center">
                <DailyCard 
                  currentDate={currentDate} 
                  options={viewOptions} 
                  onDataLoaded={updateWidgetData}
                />
              </div>

              {showCalendar && (
                <div className="w-full flex justify-center animate-in slide-in-from-bottom-4 duration-500 fade-in pb-10">
                  <CalendarGrid 
                    currentDate={currentDate} 
                    onDateSelect={(date) => setCurrentDate(date)} 
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'search' && (
          <div className="w-full max-w-2xl px-4 animate-in slide-in-from-right-8 duration-300 pt-4">
             <NameSearch onSelectDate={handleNavigateToDate} />
          </div>
        )}

        {currentView === 'upcoming' && (
          <div className="w-full max-w-2xl px-4 animate-in slide-in-from-right-8 duration-300 pt-4">
             <UpcomingEvents onSelectDate={handleNavigateToDate} />
             <div className="text-center mt-12 pb-10">
                <button 
                  onClick={() => setCurrentView('home')}
                  className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 active:scale-95"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative flex items-center gap-2">
                    <ChevronLeft size={18} className="text-indigo-600 dark:text-indigo-400 group-hover:-translate-x-1 transition-transform" />
                    <span className="bg-gradient-to-r from-indigo-900 to-indigo-700 dark:from-indigo-200 dark:to-slate-100 bg-clip-text text-transparent font-bold uppercase tracking-widest text-xs">
                      Wróć do kalendarza
                    </span>
                  </div>
                </button>
             </div>
          </div>
        )}

        {currentView === 'unusual' && (
          <div className="w-full max-w-3xl mx-auto px-4 animate-in slide-in-from-right-8 duration-300 pt-4">
             <UnusualHolidays />
             <div className="text-center mt-12 pb-10">
                <button 
                  onClick={() => setCurrentView('home')}
                  className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 active:scale-95"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative flex items-center gap-2">
                    <ChevronLeft size={18} className="text-indigo-600 dark:text-indigo-400 group-hover:-translate-x-1 transition-transform" />
                    <span className="bg-gradient-to-r from-indigo-900 to-indigo-700 dark:from-indigo-200 dark:to-slate-100 bg-clip-text text-transparent font-bold uppercase tracking-widest text-xs">
                      Wróć do kalendarza
                    </span>
                  </div>
                </button>
             </div>
          </div>
        )}
      </motion.div>

      {/* BANNER COOKIES - NAPRAWIONY POZYCJONOWANIE */}
      {showCookieNote && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-4 z-[999] animate-in slide-in-from-bottom-full">
          <div className="max-w-4xl mx-auto flex flex-col md:row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center md:text-left">
              Nasza strona korzysta z plików cookies w celu analizy ruchu. 
              Szczegóły znajdziesz w Polityce Prywatności.
            </p>
            <button 
              onClick={() => {
                localStorage.setItem('cookieConsent', 'true');
                setShowCookieNote(false);
              }}
              className="whitespace-nowrap px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
            >
              Akceptuję
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;