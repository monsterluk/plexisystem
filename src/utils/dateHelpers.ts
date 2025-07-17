// Funkcje pomocnicze do formatowania dat w polskiej strefie czasowej

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Opcje dla polskiej strefy czasowej
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Warsaw'
    };
    
    return dateObj.toLocaleString('pl-PL', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatDateOnly = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Europe/Warsaw'
    };
    
    return dateObj.toLocaleDateString('pl-PL', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatTime = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Warsaw'
    };
    
    return dateObj.toLocaleTimeString('pl-PL', options);
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

// Funkcja do konwersji czasu UTC na polski czas lokalny
export const toPolishTime = (utcDate: string | Date): Date => {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  
  // Pobierz offset dla strefy czasowej Europe/Warsaw
  const formatter = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  
  const parts = formatter.formatToParts(date);
  const values: any = {};
  
  parts.forEach(part => {
    values[part.type] = part.value;
  });
  
  return new Date(
    parseInt(values.year),
    parseInt(values.month) - 1,
    parseInt(values.day),
    parseInt(values.hour),
    parseInt(values.minute),
    parseInt(values.second)
  );
};

// Funkcja do porównywania dat
export const isDateExpired = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return dateObj < now;
};

// Funkcja do obliczania różnicy dni
export const getDaysDifference = (date1: string | Date, date2: string | Date): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Funkcja do formatowania względnego czasu
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'przed chwilą';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min temu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} godz. temu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dni temu`;
  
  return formatDateOnly(date);
};
