import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, 
  Thermometer, Eye, Calendar, Clock, MapPin, Sunrise, Sunset
} from 'lucide-react';
import { Card } from '@/components/ui/PageWrapper';

interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  sunrise: string;
  sunset: string;
}

const mockWeatherData: WeatherData = {
  temp: 22,
  feelsLike: 20,
  description: 'Partly cloudy',
  icon: 'partly-cloudy',
  humidity: 65,
  windSpeed: 12,
  visibility: 10,
  sunrise: '06:23',
  sunset: '20:15'
};

const weatherIcons: Record<string, React.ReactNode> = {
  'clear': <Sun className="w-8 h-8 text-yellow-400" />,
  'partly-cloudy': <Cloud className="w-8 h-8 text-gray-400" />,
  'cloudy': <Cloud className="w-8 h-8 text-gray-500" />,
  'rain': <CloudRain className="w-8 h-8 text-blue-400" />,
  'snow': <CloudSnow className="w-8 h-8 text-blue-200" />
};

export const WeatherWidget: React.FC = () => {
  const [weather] = useState<WeatherData>(mockWeatherData);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayInfo = () => {
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    
    // Special days
    const specialDays: Record<string, string> = {
      '1-0': 'Nowy Rok 🎉',
      '14-1': 'Walentynki ❤️',
      '8-2': 'Dzień Kobiet 🌹',
      '1-4': 'Prima Aprilis 😄',
      '1-5': 'Dzień Pracy 🛠️',
      '3-5': 'Święto Konstytucji 3 Maja 🇵🇱',
      '26-5': 'Dzień Matki 👩',
      '23-5': 'Dzień Ojca 👨',
      '15-7': 'Święto Wojska Polskiego 🪖',
      '1-10': 'Wszystkich Świętych 🕯️',
      '11-10': 'Święto Niepodległości 🇵🇱',
      '24-11': 'Wigilia 🎄',
      '25-11': 'Boże Narodzenie 🎅',
      '31-11': 'Sylwester 🎊'
    };

    const key = `${day}-${month}`;
    return specialDays[key] || null;
  };

  return (
    <Card className="p-6" gradient>
      {/* Header with Time and Date */}
      <div className="mb-6 text-center">
        <motion.div
          key={currentTime.getSeconds()}
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold text-white mb-2 font-mono"
        >
          {formatTime(currentTime)}
        </motion.div>
        <div className="text-gray-400 capitalize">
          {formatDate(currentDate)}
        </div>
        {getDayInfo() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-purple-400 font-medium"
          >
            {getDayInfo()}
          </motion.div>
        )}
      </div>

      {/* Weather Info */}
      <div className="border-t border-zinc-700/50 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Gdańsk, Poland</span>
          </div>
          <div className="flex items-center gap-2">
            {weatherIcons[weather.icon]}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-3xl font-bold text-white">
              {weather.temp}°C
            </div>
            <div className="text-sm text-gray-400">
              Feels like {weather.feelsLike}°C
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg text-gray-300 capitalize">
              {weather.description}
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-zinc-700/30 rounded-lg p-3 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-gray-400">Humidity</span>
              <div className="text-white font-medium">{weather.humidity}%</div>
            </div>
          </div>
          
          <div className="bg-zinc-700/30 rounded-lg p-3 flex items-center gap-2">
            <Wind className="w-4 h-4 text-gray-400" />
            <div>
              <span className="text-gray-400">Wind</span>
              <div className="text-white font-medium">{weather.windSpeed} km/h</div>
            </div>
          </div>
          
          <div className="bg-zinc-700/30 rounded-lg p-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <div>
              <span className="text-gray-400">Visibility</span>
              <div className="text-white font-medium">{weather.visibility} km</div>
            </div>
          </div>
          
          <div className="bg-zinc-700/30 rounded-lg p-3 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <div>
              <span className="text-gray-400">Feels like</span>
              <div className="text-white font-medium">{weather.feelsLike}°C</div>
            </div>
          </div>
        </div>

        {/* Sunrise/Sunset */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-700/30">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-gray-300">{weather.sunrise}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sunset className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-300">{weather.sunset}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};