import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="relative w-6 h-6">
          {/* Słońce */}
          <Sun className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300 ${
            theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          }`} />
          
          {/* Księżyc */}
          <Moon className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${
            theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          }`} />
        </div>
      </button>

      {/* Tooltip z animacją */}
      <div className={`absolute right-0 top-12 bg-gray-800 dark:bg-gray-700 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap transition-all duration-200 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}>
        {theme === 'light' ? 'Włącz ciemny motyw' : 'Włącz jasny motyw'}
        <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-800 dark:bg-gray-700 rotate-45"></div>
      </div>
    </div>
  );
}

// Komponent z animowanym tłem dla efektu przejścia
export function ThemeTransition({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <div className="relative">
      {/* Warstwa przejścia */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-300 ${
        isTransitioning ? 'opacity-20' : 'opacity-0'
      }`}>
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-blue-600 to-purple-700' 
            : 'bg-gradient-to-br from-yellow-400 to-orange-500'
        }`} />
      </div>
      
      {/* Zawartość */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
