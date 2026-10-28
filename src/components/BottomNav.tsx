import React from 'react';
import { Dumbbell, TrendingUp, BookOpen, Calendar, Brain, Flame } from 'lucide-react';

export type TabType = 'workout' | 'overload' | 'programs' | 'history' | 'coach';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasActiveWorkout: boolean;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onTabChange, hasActiveWorkout }) => {
  const tabs = [
    {
      id: 'workout' as TabType,
      label: 'Workout',
      icon: Dumbbell,
      badge: hasActiveWorkout ? 'Active' : undefined,
    },
    {
      id: 'overload' as TabType,
      label: 'Overload',
      icon: TrendingUp,
    },
    {
      id: 'programs' as TabType,
      label: 'Programs',
      icon: BookOpen,
    },
    {
      id: 'history' as TabType,
      label: 'History',
      icon: Calendar,
    },
    {
      id: 'coach' as TabType,
      label: 'AI Coach',
      icon: Brain,
    },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer relative ${
                isActive
                  ? 'text-lime-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.badge && (
                <span className="absolute top-1 right-2 sm:right-5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                </span>
              )}

              <div
                className={`p-1 rounded-xl transition ${
                  isActive ? 'bg-lime-500/10' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
