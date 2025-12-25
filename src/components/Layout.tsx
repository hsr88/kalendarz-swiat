import React, { useState } from 'react';
import { Menu, X, Calendar, Search, Moon, Sun, Star, Clock, ChevronRight, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// AKTUALIZACJA TYPU WIDOKU (dodano 'unusual')
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
}

const Layout = ({ children, onNavigate, options, toggleOption }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-200">
      
      {/* NAVBAR GLASS */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm transition-all">
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
          
          {/* Logo */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Ikona Logo - Gradient */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <Calendar size={20} className="drop-shadow-sm" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 font-serif">
              Kalendarz<span className="text-indigo-600">.PL</span>
            </span>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 text-slate-600 bg-white/50 hover:bg-white hover:text-indigo-600 rounded-xl border border-transparent hover:border-indigo-100 transition-all shadow-sm active:scale-95"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* SIDEBAR GLASS */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[3px] z-50"
            />

            {/* Panel Boczny */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white/90 backdrop-blur-2xl z-50 shadow-2xl flex flex-col border-l border-white/60"
            >
              {/* Header Menu */}
              <div className="p-6 flex justify-between items-center border-b border-indigo-50/50">
                <span className="font-serif font-bold text-2xl text-slate-800 tracking-tight">Menu</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Treść */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Sekcja: Widoki */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Nawigacja</p>
                  
                  {[
                    { 
                      id: 'home', 
                      label: 'Kalendarz Główny', 
                      icon: Calendar, 
                      color: 'text-indigo-600', 
                      bg: 'bg-indigo-50' 
                    },
                    { 
                      id: 'search', 
                      label: 'Wyszukiwarka Imienin', 
                      icon: Search, 
                      color: 'text-purple-600', 
                      bg: 'bg-purple-50' 
                    },
                    { 
                      id: 'upcoming', 
                      label: 'Najbliższe Święta', 
                      icon: Clock, 
                      color: 'text-rose-600', 
                      bg: 'bg-rose-50' 
                    },
                    // NOWA POZYCJA
                    { 
                      id: 'unusual', 
                      label: 'Święta Nietypowe', 
                      icon: PartyPopper, 
                      color: 'text-amber-600', 
                      bg: 'bg-amber-50' 
                    },
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => handleNav(item.id as ViewState)}
                      className="group flex items-center justify-between w-full p-3 rounded-2xl bg-white/60 hover:bg-white border border-white/60 hover:border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        {/* Ikona na pastelowym tle z kolorem */}
                        <div className={`p-2.5 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon size={20} />
                        </div>
                        <span className="text-slate-700 font-medium group-hover:text-slate-900 group-hover:font-semibold transition-all">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </button>
                  ))}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                {/* Sekcja: Dodatki */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Personalizacja widoku</p>
                  
                  {/* Fazy Księżyca */}
                  <div className="group flex items-center justify-between p-3 rounded-2xl bg-white/40 hover:bg-white/80 border border-transparent hover:border-indigo-100 transition-all shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Moon size={18}/>
                      </div>
                      <span className="font-medium text-slate-700 text-sm">Fazy Księżyca</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={options.showMoon} onChange={() => toggleOption('showMoon')} className="sr-only peer" />
                      <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Znaki Zodiaku */}
                  <div className="group flex items-center justify-between p-3 rounded-2xl bg-white/40 hover:bg-white/80 border border-transparent hover:border-purple-100 transition-all shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Star size={18}/>
                      </div>
                      <span className="font-medium text-slate-700 text-sm">Zodiak</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={options.showZodiac} onChange={() => toggleOption('showZodiac')} className="sr-only peer" />
                      <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {/* Słońce */}
                  <div className="group flex items-center justify-between p-3 rounded-2xl bg-white/40 hover:bg-white/80 border border-transparent hover:border-amber-100 transition-all shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <Sun size={18}/>
                      </div>
                      <span className="font-medium text-slate-700 text-sm">Słońce</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={options.showSun} onChange={() => toggleOption('showSun')} className="sr-only peer" />
                      <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-indigo-50/50 bg-white/30 text-center">
                 <p className="text-xs text-slate-400 font-medium">
                   Zaprojektowano z <span className="text-rose-400">❤</span> dla Ciebie
                 </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="container max-w-5xl mx-auto px-4 py-6 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;