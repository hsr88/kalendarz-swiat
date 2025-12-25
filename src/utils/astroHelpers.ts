// src/utils/astroHelpers.ts

// 1. ZNAKI ZODIAKU
export const getZodiacSign = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Wodnik";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Ryby";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Baran";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Byk";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Bliźnięta";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Rak";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Lew";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Panna";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Waga";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Skorpion";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Strzelec";
  return "Koziorożec";
};

// 2. FAZA KSIĘŻYCA (Uproszczony algorytm)
export const getMoonPhase = (date: Date): string => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 3) { year--; month += 12; }
  const c = 365.25 * year;
  const e = 30.6 * month;
  const jd = c + e + day - 694039.09; // Julian Date approximation
  let b = jd / 29.5305882; // Cykl księżyca
  b -= Math.floor(b); // Zostawiamy ułamek (0.0 - 0.99)
  
  const phase = Math.round(b * 8);

  if (phase === 0 || phase === 8) return "Nów";
  if (phase === 1) return "Sierp przybywający";
  if (phase === 2) return "Pierwsza kwadra";
  if (phase === 3) return "Księżyc garbaty (rosnący)";
  if (phase === 4) return "Pełnia";
  if (phase === 5) return "Księżyc garbaty (malejący)";
  if (phase === 6) return "Ostatnia kwadra";
  return "Sierp malejący";
};

// 3. WSCHÓD / ZACHÓD (Przybliżenie dla Polski - Warszawa)
// Bez zewnętrznego API to jest symulacja zależna od miesiąca
export const getSunTimes = (date: Date): { sunrise: string, sunset: string } => {
  // Prosta tabela przybliżona dla środka każdego miesiąca
  const times = [
    { s: "07:42", e: "15:45" }, // Styczeń
    { s: "06:55", e: "16:40" }, // Luty
    { s: "05:55", e: "17:35" }, // Marzec
    { s: "05:40", e: "19:30" }, // Kwiecień (zmiana czasu uwzgl. w uproszczeniu)
    { s: "04:45", e: "20:20" }, // Maj
    { s: "04:15", e: "21:00" }, // Czerwiec
    { s: "04:35", e: "20:50" }, // Lipiec
    { s: "05:15", e: "20:00" }, // Sierpień
    { s: "06:05", e: "18:50" }, // Wrzesień
    { s: "07:00", e: "17:40" }, // Październik
    { s: "07:00", e: "15:50" }, // Listopad
    { s: "07:40", e: "15:25" }, // Grudzień
  ];
  return {
    sunrise: times[date.getMonth()].s,
    sunset: times[date.getMonth()].e
  };
};