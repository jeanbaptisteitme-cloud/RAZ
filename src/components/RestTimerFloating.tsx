import React, { useEffect, useState } from 'react';
import { Timer, Plus, Minus, X, Bell, BellOff, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audioTimer';

interface Props {
  initialSeconds: number;
  exerciseName?: string;
  onFinish: () => void;
  onClose: () => void;
  soundEnabled: boolean;
}

export const RestTimerFloating: React.FC<Props> = ({
  initialSeconds,
  exerciseName,
  onFinish,
  onClose,
  soundEnabled,
}) => {
  const [totalSeconds, setTotalSeconds] = useState<number>(initialSeconds);
  const [remaining, setRemaining] = useState<number>(initialSeconds);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [sound, setSound] = useState<boolean>(soundEnabled);

  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setRemaining(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (remaining <= 0) {
      if (sound) soundManager.playTimerDone();
      onFinish();
      return;
    }

    if (remaining <= 3 && sound) {
      soundManager.playTick();
    }

    const timer = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, sound, onFinish]);

  const addTime = (seconds: number) => {
    setRemaining((r) => {
      const next = Math.max(0, r + seconds);
      if (next > totalSeconds) setTotalSeconds(next);
      return next;
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-20 right-4 z-40 bg-slate-900 border-2 border-lime-400 text-white rounded-full px-4 py-2.5 shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition transform hover:scale-105"
      >
        <Timer className="w-4 h-4 text-lime-400 animate-pulse" />
        <span className="font-mono font-black text-sm text-lime-400">{formatTime(remaining)}</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 w-80 bg-slate-900/95 backdrop-blur-md border border-lime-500/40 rounded-3xl p-4 shadow-2xl text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-lime-500/20 text-lime-400">
            <Timer className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-200 truncate max-w-[140px]">
            {exerciseName ? `Rest: ${exerciseName}` : 'Rest Timer'}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSound(!sound)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={sound ? 'Mute audio cues' : 'Enable audio cues'}
          >
            {sound ? <Volume2 className="w-3.5 h-3.5 text-lime-400" /> : <BellOff className="w-3.5 h-3.5 text-slate-500" />}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 transition"
          >
            Minimize
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Countdown Display & Ring */}
      <div className="relative py-2 flex flex-col items-center justify-center">
        <div className="font-mono font-black text-4xl text-lime-400 tracking-wider">
          {formatTime(remaining)}
        </div>
        <span className="text-[11px] text-slate-400 mt-1">
          {remaining <= 3 ? 'Get Ready!' : 'Catch breath & hydrate'}
        </span>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="bg-lime-400 h-full transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(163,230,53,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-1.5 mt-3 pt-2 border-t border-slate-800 text-xs">
        <button
          onClick={() => addTime(-15)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 py-1.5 rounded-xl font-bold text-slate-300 transition flex items-center justify-center gap-1 cursor-pointer"
        >
          <Minus className="w-3 h-3" /> 15s
        </button>
        <button
          onClick={() => addTime(30)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 py-1.5 rounded-xl font-bold text-slate-300 transition flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus className="w-3 h-3" /> 30s
        </button>
        <button
          onClick={() => {
            onFinish();
            onClose();
          }}
          className="flex-1 bg-lime-400 hover:bg-lime-300 text-black py-1.5 rounded-xl font-black transition cursor-pointer"
        >
          Skip
        </button>
      </div>
    </div>
  );
};
