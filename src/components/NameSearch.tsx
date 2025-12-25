import React from 'react';
import { Search, ArrowRight, User, Sparkles } from 'lucide-react';
import namedaysData from '../data/namedays.json';

const parseDateKey = (key: string) => {
  const [month, day] = key.split('-');
  const date = new Date();
  date.setMonth(parseInt(month) - 1);
  date.setDate(parseInt(day));
  return date;
};

interface NameSearchProps {
  onSelectDate: (date: Date) => void;
}

const NameSearch = ({ onSelectDate }: NameSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ date: string; names: string }[]>([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = Object.entries(namedaysData).filter(([_, names]) => {
      return (names as string).toLowerCase().includes(lowerQuery);
    }).map(([dateKey, names]) => ({
      date: dateKey,
      names: names as string
    }));
    setResults(filtered);
  }, [query]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/60 overflow-hidden flex flex-col min-h-[500px]">
      
      {/* HEADER */}
      <div className="p-8 border-b border-indigo-100/50 bg-white/40">
        <h2 className="text-2xl font-serif font-bold text-indigo-950 mb-6 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
            <Search size={24} />
          </div>
          Znajdź imieniny
        </h2>
        
        <div className="relative group">
          <input
            type="text"
            placeholder="Wpisz imię (np. Anna)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/80 border border-indigo-100 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all text-lg text-slate-700 placeholder:text-slate-400 shadow-sm group-hover:shadow-md"
            autoFocus
          />
          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-300" size={24} />
        </div>
      </div>

      {/* LISTA WYNIKÓW */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((item) => {
              const dateObj = parseDateKey(item.date);
              const dateLabel = dateObj.toLocaleDateString('pl-PL', { month: 'long', day: 'numeric' });

              return (
                <button
                  key={item.date}
                  onClick={() => onSelectDate(dateObj)}
                  className="w-full text-left bg-white/40 hover:bg-white/90 p-5 rounded-2xl border border-transparent hover:border-indigo-100 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
                >
                  <div>
                    <span className="block font-serif font-bold text-indigo-900 capitalize text-xl mb-1 group-hover:text-indigo-600 transition-colors">
                      {dateLabel}
                    </span>
                    <span className="text-slate-500 text-sm line-clamp-1 group-hover:text-slate-700">
                      {item.names}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-full text-indigo-200 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                    <ArrowRight size={20} />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-10 text-center opacity-60">
            {query.length > 0 ? (
              <>
                <Search size={64} className="mb-4 text-indigo-200" />
                <p className="text-lg">Nie znaleziono imienia <span className="font-bold text-indigo-400">"{query}"</span></p>
              </>
            ) : (
              <>
                <Sparkles size={64} className="mb-4 text-indigo-200" />
                <p className="text-lg">Zacznij wpisywać, aby znaleźć datę</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NameSearch;