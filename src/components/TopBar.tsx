import React from 'react';
import { 
  Zap, 
  Smartphone, 
  Monitor, 
  Disc, 
  Award, 
  Volume2, 
  VolumeX, 
  Timer,
  Settings 
} from 'lucide-react';

interface Props {
  unit: 'kg' | 'lbs';
  onToggleUnit: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onOpenPlateCalc: () => void;
  onOpen1RMCalc: () => void;
  hasActiveRestTimer: boolean;
  restTimerSeconds: number;
}

export const TopBar: React.FC<Props> = ({
  unit,
  onToggleUnit,
  isPhoneFrame,
  onTogglePhoneFrame,
  onOpenPlateCalc,
  onOpen1RMCalc,
  hasActiveRestTimer,
  restTimerSeconds,
}) => {
  const formatSecs = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-lime-400 to-emerald-400 text-black flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(163,230,53,0.4)]">
            <Zap className="w-4 h-4 fill-black stroke-black" />
          </div>
          <div>
            <h1 className="font-black text-white text-base tracking-tight flex items-center gap-1.5 leading-none">
              ApeX <span className="text-lime-400 font-mono text-xs">LOG</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-mono block -mt-0.5">
              APK &bull; Overload Engine
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Active Rest Timer Pill */}
          {hasActiveRestTimer && (
            <div className="flex items-center gap-1 bg-lime-500/20 border border-lime-500/30 text-lime-400 px-2.5 py-1 rounded-xl text-xs font-mono font-bold animate-pulse">
              <Timer className="w-3.5 h-3.5" />
              <span>{formatSecs(restTimerSeconds)}</span>
            </div>
          )}

          {/* Plate Calc Trigger */}
          <button
            onClick={onOpenPlateCalc}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Barbell Plate Calculator"
          >
            <Disc className="w-4 h-4 text-lime-400" />
          </button>

          {/* 1RM Trigger */}
          <button
            onClick={onOpen1RMCalc}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="1RM Calculator"
          >
            <Award className="w-4 h-4 text-amber-400" />
          </button>

          {/* Unit Toggle Button */}
          <button
            onClick={onToggleUnit}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 rounded-xl border border-slate-700 transition"
            title="Toggle kg / lbs"
          >
            {unit.toUpperCase()}
          </button>

          {/* APK Phone Frame Toggle (Hidden on narrow real mobile screens) */}
          <button
            onClick={onTogglePhoneFrame}
            className="hidden sm:flex items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs font-medium"
            title={isPhoneFrame ? 'Switch to Full Screen View' : 'Switch to APK Phone View'}
          >
            {isPhoneFrame ? (
              <Monitor className="w-4 h-4 text-lime-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
