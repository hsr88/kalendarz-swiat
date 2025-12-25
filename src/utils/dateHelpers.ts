// src/utils/dateHelpers.ts

export interface HolidayEvent {
  date: Date;
  name: string;
  isWorkFree: boolean;
}

// Lista świąt stałych w Polsce
const FIXED_HOLIDAYS = [
  { month: 0, day: 1, name: "Nowy Rok", isWorkFree: true },
  { month: 0, day: 6, name: "Trzech Króli", isWorkFree: true },
  { month: 4, day: 1, name: "Święto Pracy", isWorkFree: true },
  { month: 4, day: 3, name: "Święto Konstytucji 3 Maja", isWorkFree: true },
  { month: 7, day: 15, name: "Wniebowzięcie NMP", isWorkFree: true },
  { month: 10, day: 1, name: "Wszystkich Świętych", isWorkFree: true },
  { month: 10, day: 11, name: "Święto Niepodległości", isWorkFree: true },
  { month: 11, day: 25, name: "Boże Narodzenie (pierwszy dzień)", isWorkFree: true },
  { month: 11, day: 26, name: "Boże Narodzenie (drugi dzień)", isWorkFree: true },
];

/**
 * Pobiera listę nadchodzących świąt stałych na określoną liczbę dni w przód.
 */
export const getUpcomingHolidays = (startDate: Date, daysCount: number): HolidayEvent[] => {
  const upcoming: HolidayEvent[] = [];
  const endLimit = new Date(startDate);
  endLimit.setDate(startDate.getDate() + daysCount);

  // Sprawdzamy daty w bieżącym i przyszłym roku (dla przełomu grudnia/stycznia)
  [startDate.getFullYear(), startDate.getFullYear() + 1].forEach(year => {
    FIXED_HOLIDAYS.forEach(h => {
      const holidayDate = new Date(year, h.month, h.day);
      if (holidayDate >= startDate && holidayDate <= endLimit) {
        upcoming.push({
          date: holidayDate,
          name: h.name,
          isWorkFree: h.isWorkFree
        });
      }
    });
  });

  // Sortujemy chronologicznie
  return upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Pozostałe funkcje (jeśli ich używasz w innych plikach)
export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
};