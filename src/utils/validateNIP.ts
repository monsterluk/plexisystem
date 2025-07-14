/**
 * Waliduje polski numer NIP
 * @param nip - numer NIP do walidacji
 * @returns true jeśli NIP jest poprawny
 */
export const validateNIP = (nip: string): boolean => {
  // Usuń wszystkie znaki oprócz cyfr
  const cleanNip = nip.replace(/[^0-9]/g, '');
  
  // NIP musi mieć dokładnie 10 cyfr
  if (cleanNip.length !== 10) {
    return false;
  }
  
  // Wagi dla poszczególnych cyfr NIP
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  
  // Oblicz sumę kontrolną
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanNip[i]) * weights[i];
  }
  
  // Cyfra kontrolna
  const checksum = sum % 11;
  const lastDigit = parseInt(cleanNip[9]);
  
  // NIP jest poprawny jeśli cyfra kontrolna zgadza się z ostatnią cyfrą
  // Uwaga: jeśli reszta wynosi 10, NIP jest niepoprawny
  return checksum === lastDigit && checksum !== 10;
};

/**
 * Formatuje NIP do formatu XXX-XXX-XX-XX
 * @param nip - numer NIP do sformatowania
 * @returns sformatowany NIP
 */
export const formatNIP = (nip: string): string => {
  const cleanNip = nip.replace(/[^0-9]/g, '');
  
  if (cleanNip.length !== 10) {
    return nip;
  }
  
  return `${cleanNip.slice(0, 3)}-${cleanNip.slice(3, 6)}-${cleanNip.slice(6, 8)}-${cleanNip.slice(8, 10)}`;
};

/**
 * Sprawdza czy NIP należy do listy testowych NIP-ów używanych w środowisku deweloperskim
 * @param nip - numer NIP do sprawdzenia
 * @returns true jeśli NIP jest testowy
 */
export const isTestNIP = (nip: string): boolean => {
  const testNIPs = [
    '5881967231', // PlexiSystem
    '1234567890', // Przykładowa firma
    '5252344078', // Testowy poprawny NIP
    '7542457068', // Testowy poprawny NIP
  ];
  
  const cleanNip = nip.replace(/[^0-9]/g, '');
  return testNIPs.includes(cleanNip);
};