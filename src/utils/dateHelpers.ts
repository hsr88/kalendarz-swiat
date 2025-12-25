// src/utils/dateHelpers.ts
import nameDaysData from '../data/namedays.json';

// Mówimy TypeScriptowi, że kluczami są stringi, a wartościami tablice stringów
const nameDays: Record<string, string[]> = nameDaysData;

export const getNameDaysForDate = (date: Date): string[] => {
  // 1. Pobierz miesiąc (dodaj +1, bo JS liczy od 0) i sformatuj do dwóch cyfr (np. "01")
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // 2. Pobierz dzień i sformatuj do dwóch cyfr
  const day = date.getDate().toString().padStart(2, '0');
  
  // 3. Złóż klucz "MM-DD"
  const key = `${month}-${day}`;
  
  // 4. Pobierz z JSON lub zwróć pustą tablicę, jeśli nie znaleziono (safety check)
  return nameDays[key] || [];
};