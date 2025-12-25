import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Calendar as CalendarIcon, 
  Search, 
  Clock, 
  Moon, 
  Sun, 
  Star,
  Gift 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

export type ViewState = 'home' | 'search' | 'upcoming' | 'unusual';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: ViewState) => void;
  options: {
    showMoon: boolean;
    showZodiac: boolean;
    showSun: boolean;
  };
  toggleOption: (key: 'showMoon' | 'showZodiac' | 'showSun') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onNavigate, 
  options, 
  toggleOption,
  isDarkMode,
  toggleDarkMode
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (view: ViewState) => {
    onNavigate(view);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col">
      
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-40 flex items-center justify-between px-4 shadow-sm transition-colors">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* LOGO: święta.mobi - Poprawiony kontrast w trybie jasnym */}
        <div className="font-black text-xl flex items-center gap-0 select-none tracking-tighter">
          <span className="text-indigo-900 dark:text-indigo-400">święta</span>
          <span className="text-slate-500 dark:text-slate-500 font-bold">.mobi</span>
        </div>

        <div className="w-6" />
      </div>

      {/* OVERLAY */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col border-r border-transparent dark:border-slate-700",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-indigo-50/50 dark:bg-indigo-900/20 h-16 transition-colors">
          <div className="font-black text-xl flex items-center gap-0 select-none tracking-tighter">
            <span className="text-indigo-900 dark:text-indigo-300">święta</span>
            <span className="text-indigo-600 dark:text-indigo-500 font-bold">.mobi</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-3 text-base h-12 dark:text-slate-500 dark:hover:bg-slate-200" onClick={() => handleNavigate('home')}>
              <CalendarIcon size={20} className="text-slate-500 dark:text-slate-400" /> Strona Główna
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-base h-12 dark:text-slate-500 dark:hover:bg-slate-200" onClick={() => handleNavigate('search')}>
              <Search size={20} className="text-slate-500 dark:text-slate-400" /> Szukaj Imienin
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-base h-12 dark:text-slate-500 dark:hover:bg-slate-200" onClick={() => handleNavigate('upcoming')}>
              <Clock size={20} className="text-slate-500 dark:text-slate-400" /> Nadchodzące
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-base h-12 dark:text-slate-500 dark:hover:bg-slate-200" onClick={() => handleNavigate('unusual')}>
              <Gift size={20} className="text-slate-500 dark:text-slate-400" /> Święta Nietypowe
            </Button>
          </div>
          
          <div className="my-6 border-t border-slate-100 dark:border-slate-700" />
          
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">
            Wygląd
          </div>
          <button 
            onClick={() => toggleDarkMode()}
            className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Sun size={18} className="text-orange-400" /> : <Moon size={18} className="text-indigo-400" />}
              <span>{isDarkMode ? 'Tryb Jasny' : 'Tryb Ciemny'}</span>
            </div>
            <div className={cn(
              "w-10 h-5 rounded-full relative transition-colors duration-300",
              isDarkMode ? "bg-indigo-600" : "bg-slate-300"
            )}>
              <div className={cn(
                "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
                isDarkMode ? "left-6" : "left-1"
              )} />
            </div>
          </button>

          <div className="my-6 border-t border-slate-100 dark:border-slate-700" />
          
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">
            Dodatki Astro
          </div>
          <div className="space-y-2">
            <OptionBtn active={options.showMoon} onClick={() => toggleOption('showMoon')} icon={<Moon size={18} />} label="Fazy Księżyca" colorClass="bg-indigo-500" />
            <OptionBtn active={options.showSun} onClick={() => toggleOption('showSun')} icon={<Sun size={18} />} label="Wschód / Zachód" colorClass="bg-orange-500" />
            <OptionBtn active={options.showZodiac} onClick={() => toggleOption('showZodiac')} icon={<Star size={18} />} label="Znak Zodiaku" colorClass="bg-purple-500" />
          </div>
        </nav>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-xs text-center text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700 transition-colors">
          święta.mobi • {new Date().getFullYear()}
        </div>
      </div>

      <main className="flex-1 min-h-screen pt-16">
        <div className="h-full w-full max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const OptionBtn = ({ active, onClick, icon, label, colorClass }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all border",
      active 
        ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm border-slate-200 dark:border-slate-600 font-medium" 
        : "bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
    )}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    <div className={cn("w-2.5 h-2.5 rounded-full transition-colors", active ? colorClass : "bg-slate-200 dark:bg-slate-600")} />
  </button>
);

export default Layout;