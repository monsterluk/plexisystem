// components/crm/LeadScoreWidget.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, AlertCircle, Zap } from 'lucide-react';
import { Client } from '@/types/Client';

interface LeadScore {
  score: number;
  factors: {
    companySize: number;
    previousOrders: number;
    responseTime: number;
    budgetMatch: number;
    industryFit: number;
  };
  recommendation: 'hot' | 'warm' | 'cold';
  nextBestAction: string;
  insights: string[];
}

interface Props {
  client: Client;
  onActionClick?: (action: string) => void;
}

export const LeadScoreWidget: React.FC<Props> = ({ client, onActionClick }) => {
  const [score, setScore] = useState<LeadScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateScore();
  }, [client]);

  const calculateScore = async () => {
    setLoading(true);
    
    // Symulacja obliczeń - w przyszłości integracja z AI
    const mockScore: LeadScore = {
      score: 75,
      factors: {
        companySize: 80,
        previousOrders: 60,
        responseTime: 90,
        budgetMatch: 70,
        industryFit: 85
      },
      recommendation: 'hot',
      nextBestAction: 'Zadzwoń w ciągu 24h - klient wykazuje duże zainteresowanie',
      insights: [
        'Klient odpowiada szybko na wiadomości',
        'Branża idealnie pasuje do naszej oferty',
        'Potencjał na długoterminową współpracę'
      ]
    };
    
    setTimeout(() => {
      setScore(mockScore);
      setLoading(false);
    }, 500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'hot':
        return <Zap className="w-5 h-5 text-red-500" />;
      case 'warm':
        return <Target className="w-5 h-5 text-yellow-500" />;
      case 'cold':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatFactorName = (key: string) => {
    const names: Record<string, string> = {
      companySize: 'Wielkość firmy',
      previousOrders: 'Historia zamówień',
      responseTime: 'Czas odpowiedzi',
      budgetMatch: 'Dopasowanie budżetu',
      industryFit: 'Dopasowanie branżowe'
    };
    return names[key] || key;
  };

  if (loading) {
    return (
      <div className="bg-zinc-800 rounded-xl p-6 animate-pulse">
        <div className="h-8 bg-zinc-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-zinc-700 rounded"></div>
          <div className="h-4 bg-zinc-700 rounded"></div>
          <div className="h-4 bg-zinc-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!score) return null;

  return (
    <div className="bg-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Potencjał klienta
            {getRecommendationIcon(score.recommendation)}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{client.name}</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreColor(score.score)}`}>
            {score.score}
          </div>
          <p className="text-xs text-gray-400">/ 100</p>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="space-y-3 mb-6">
        {Object.entries(score.factors).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">{formatFactorName(key)}</span>
              <span className="text-gray-300">{value}%</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  value >= 70 ? 'bg-green-500' : 
                  value >= 40 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-orange-400 mb-1">
          Rekomendowana akcja:
        </p>
        <p className="text-white">{score.nextBestAction}</p>
        {onActionClick && (
          <button
            onClick={() => onActionClick(score.nextBestAction)}
            className="mt-3 text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            Wykonaj akcję →
          </button>
        )}
      </div>

      {/* Insights */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-400">Kluczowe informacje:</p>
        {score.insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
            <p className="text-sm text-gray-300">{insight}</p>
          </div>
        ))}
      </div>

      {/* Trend indicator */}
      <div className="mt-4 pt-4 border-t border-zinc-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-xs text-gray-400">
            Score wzrósł o 5 pkt w ostatnim tygodniu
          </span>
        </div>
        <button className="text-xs text-orange-400 hover:text-orange-300">
          Zobacz historię →
        </button>
      </div>
    </div>
  );
};