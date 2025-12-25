import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

// Importy komponentów
import DailyCard from './components/DailyCard';
import CalendarGrid from './components/CalendarGrid';
import NameSearch from './components/NameSearch';
import UpcomingEvents from './components/UpcomingEvents';
import UnusualHolidays from './components/UnusualHolidays';
import Layout, { type ViewState } from './components/Layout';

function App() {
  // Stan daty i kalendarza
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  
  // Stan widoku (domyślnie strona główna)
  const [currentView, setCurrentView] = useState<ViewState>('home');

  // Opcje Astro (przekazywane z Layoutu do DailyCard)
  const [viewOptions, setViewOptions] = useState({
    showMoon: false,
    showZodiac: false,
    showSun: false,
  });

  // --- FUNKCJE POMOCNICZE ---

  const toggleOption = (key: keyof typeof viewOptions) => {
    setViewOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleDateSelectFromSearch = (date: Date) => {
    setCurrentDate(date);
    setCurrentView('home'); // Powrót do głównego widoku po wybraniu daty
  };

  // --- RENDEROWANIE ---

  return (
    <Layout 
      onNavigate={setCurrentView} 
      options={viewOptions} 
      toggleOption={toggleOption}
    >
      <div className="flex flex-col items-center gap-6 pt-4 pb-20 w-full">
        
        {/* === WIDOK 1: STRONA GŁÓWNA (KALENDARZ) === */}
        {currentView === 'home' && (
          <div className="w-full flex flex-col items-center gap-8 animate-in fade-in duration-300">
            
            {/* Pasek Daty ze strzałkami */}
            <div className="flex items-center gap-2 md:gap-4 bg-white p-1.5 md:p-2 rounded-full shadow-sm border border-slate-200">
              <button onClick={() => changeDate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                <ChevronLeft size={24} />
              </button>
              
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  showCalendar ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CalendarIcon size={16} />
                <span className="capitalize">
                  {currentDate.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}
                </span>
              </button>
              
              <button onClick={() => changeDate(1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Główna sekcja: Karta + Kalendarz Siatkowy */}
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-5xl">
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <DailyCard 
                  currentDate={currentDate} 
                  options={viewOptions} 
                />
              </div>
              
              {showCalendar && (
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                  <CalendarGrid 
                    currentDate={currentDate} 
                    onDateSelect={(date) => setCurrentDate(date)} 
                  />
                </div>
              )}
            </div>

            {/* === NOWA SEKCJA: ŚWIĘTA NIETYPOWE === */}
            <div className="w-full max-w-5xl px-4 lg:px-0">
               <UnusualHolidays />
            </div>

          </div>
        )}

        {/* === WIDOK 2: WYSZUKIWARKA IMIENIN === */}
        {currentView === 'search' && (
          <div className="w-full px-4 animate-in slide-in-from-right-8 duration-300">
             <NameSearch onSelectDate={handleDateSelectFromSearch} />
          </div>
        )}

        {/* === WIDOK 3: NAJBLIŻSZE ŚWIĘTA === */}
        {currentView === 'upcoming' && (
          <div className="w-full px-4 animate-in slide-in-from-right-8 duration-300 pt-4">
             <UpcomingEvents />
             
             <div className="text-center mt-8">
                <button 
                  onClick={() => setCurrentView('home')}
                  className="text-indigo-600 font-medium hover:underline p-2"
                >
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