import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

// Importy komponentów
import DailyCard from './components/DailyCard';
import CalendarGrid from './components/CalendarGrid';
import NameSearch from './components/NameSearch';
import UpcomingEvents from './components/UpcomingEvents';
import UnusualHolidays from './components/UnusualHolidays';
import Layout, { type ViewState } from './components/Layout';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('home');

  // Stan opcji astro
  const [viewOptions, setViewOptions] = useState({
    showMoon: false,
    showZodiac: false,
    showSun: false,
  });

  // --- LOGIKA TRYBU CIEMNEGO ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  // -----------------------------

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
      <div className="flex flex-col items-center gap-6 w-full">
        
        {currentView === 'home' && (
          <div className="w-full flex flex-col items-center gap-8 animate-in fade-in duration-300">
            
            {/* Pasek Daty */}
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
                <DailyCard currentDate={currentDate} options={viewOptions} />
              </div>
              
              {showCalendar && (
                <div className="w-full flex justify-center animate-in slide-in-from-bottom-4 duration-500 fade-in">
                  <CalendarGrid currentDate={currentDate} onDateSelect={(date) => setCurrentDate(date)} />
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
             <div className="text-center mt-8">
                <button onClick={() => setCurrentView('home')} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline p-2 transition-colors">
                  Wróć do kalendarza
                </button>
             </div>
          </div>
        )}

        {currentView === 'unusual' && (
          <div className="w-full max-w-3xl mx-auto px-4 animate-in slide-in-from-right-8 duration-300 pt-4">
             <UnusualHolidays />
             <div className="text-center mt-8">
                <button onClick={() => setCurrentView('home')} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline p-2 transition-colors">
                  Wróć do kalendarza
                </button>
             </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;