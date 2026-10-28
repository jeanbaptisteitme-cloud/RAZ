import React, { useState } from 'react';
import { X, Trophy, Flame } from 'lucide-react';
import { calculate1RM } from '../utils/progressiveOverload';

interface Props {
  initialWeight?: number;
  initialReps?: number;
  unit: 'kg' | 'lbs';
  onClose: () => void;
}

export const OneRepMaxModal: React.FC<Props> = ({
  initialWeight = 85,
  initialReps = 6,
  unit,
  onClose,
}) => {
  const [weight, setWeight] = useState<number>(initialWeight);
  const [reps, setReps] = useState<number>(initialReps);

  const oneRepMax = calculate1RM(weight, reps);

  const repPercentages = [
    { reps: 1, pct: 100 },
    { reps: 2, pct: 95 },
    { reps: 3, pct: 93 },
    { reps: 4, pct: 90 },
    { reps: 5, pct: 87 },
    { reps: 6, pct: 85 },
    { reps: 8, pct: 80 },
    { reps: 10, pct: 75 },
    { reps: 12, pct: 70 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">1RM Calculator</h3>
              <p className="text-xs text-slate-400">Epley & Brzycki estimation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Weight Lifted ({unit})
            </label>
            <input
              type="number"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-2xl px-4 py-3 text-xl font-bold text-white focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Reps Performed
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-2xl px-4 py-3 text-xl font-bold text-white focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Highlight 1RM */}
        <div className="bg-gradient-to-br from-amber-500/20 via-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl p-5 mb-6 text-center relative overflow-hidden">
          <div className="text-xs font-semibold uppercase text-amber-300 tracking-widest mb-1 flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            Estimated One-Rep Maximum (1RM)
          </div>
          <div className="text-4xl font-black text-amber-400 font-mono tracking-tight my-1">
            {oneRepMax} <span className="text-xl font-normal text-slate-300">{unit}</span>
          </div>
          <p className="text-xs text-slate-400">
            Calculated based on {weight}{unit} performed for {reps} reps to technical failure.
          </p>
        </div>

        {/* Training percentages table */}
        <div className="space-y-2 mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Target Rep Bracket Intensities:
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {repPercentages.map((item) => {
              const target = Math.round((oneRepMax * (item.pct / 100)) * 2) / 2;
              return (
                <div
                  key={item.reps}
                  className="flex items-center justify-between px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800 text-xs"
                >
                  <span className="font-medium text-slate-300">
                    {item.reps} Rep Max ({item.pct}%)
                  </span>
                  <span className="font-mono font-bold text-lime-400">
                    {target} {unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-2xl font-bold text-sm transition"
        >
          Close Calculator
        </button>
      </div>
    </div>
  );
};
