import React, { useState } from 'react';
import { X, Disc, RefreshCw } from 'lucide-react';
import { calculatePlates } from '../utils/progressiveOverload';

interface Props {
  initialWeight?: number;
  unit: 'kg' | 'lbs';
  onClose: () => void;
}

export const PlateCalculatorModal: React.FC<Props> = ({ initialWeight = 100, unit, onClose }) => {
  const [weight, setWeight] = useState<number>(initialWeight);
  const [barWeight, setBarWeight] = useState<number>(unit === 'kg' ? 20 : 45);

  const { plates, remaining } = calculatePlates(weight, barWeight);

  const getPlateColor = (plate: number) => {
    switch (plate) {
      case 25: return 'bg-red-600 border-red-400 text-white shadow-red-500/30';
      case 20: return 'bg-blue-600 border-blue-400 text-white shadow-blue-500/30';
      case 15: return 'bg-amber-500 border-amber-300 text-black shadow-amber-500/30';
      case 10: return 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/30';
      case 5: return 'bg-slate-200 border-slate-300 text-black shadow-white/20';
      case 2.5: return 'bg-neutral-800 border-neutral-600 text-white shadow-black/40';
      case 1.25: return 'bg-zinc-700 border-zinc-500 text-zinc-200 shadow-black/40';
      default: return 'bg-cyan-600 border-cyan-400 text-white';
    }
  };

  const getPlateHeight = (plate: number) => {
    switch (plate) {
      case 25: return 'h-28 w-7';
      case 20: return 'h-24 w-6';
      case 15: return 'h-20 w-5';
      case 10: return 'h-16 w-5';
      case 5: return 'h-13 w-4';
      case 2.5: return 'h-10 w-4';
      case 1.25: return 'h-8 w-3';
      default: return 'h-16 w-5';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/20">
              <Disc className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Barbell Plate Calculator</h3>
              <p className="text-xs text-slate-400">Load per side calculation ({unit})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input weight and bar toggle */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Target Barbell Total ({unit})
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.5"
                min={barWeight}
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-lime-400 rounded-2xl px-4 py-3 text-2xl font-black text-lime-400 focus:outline-none tracking-tight font-mono"
              />
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setWeight((w) => Math.max(barWeight, w + 2.5))}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  +2.5
                </button>
                <button
                  onClick={() => setWeight((w) => Math.max(barWeight, w - 2.5))}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  -2.5
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400">Barbell Weight:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setBarWeight(20)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                  barWeight === 20 ? 'bg-lime-400 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                20 {unit} (Standard)
              </button>
              <button
                onClick={() => setBarWeight(15)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                  barWeight === 15 ? 'bg-lime-400 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                15 {unit} (Women's)
              </button>
            </div>
          </div>
        </div>

        {/* Visual Barbell Rendering */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-5">
          <div className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider text-center">
            One Side of Barbell (Sleeve)
          </div>

          <div className="relative flex items-center justify-center min-h-[120px] overflow-x-auto py-2">
            {/* Barbell sleeve shaft */}
            <div className="absolute w-full h-4 bg-gradient-to-b from-slate-400 to-slate-600 rounded-sm z-0"></div>
            {/* Barbell collar stop */}
            <div className="absolute left-4 w-3 h-14 bg-slate-300 rounded-sm z-10 border border-slate-400"></div>

            {/* Plates on sleeve */}
            <div className="flex items-center gap-1 z-20 pl-8">
              {plates.flatMap(({ plate, countEachSide }) =>
                Array.from({ length: countEachSide }).map((_, i) => (
                  <div
                    key={`${plate}-${i}`}
                    className={`${getPlateHeight(plate)} ${getPlateColor(
                      plate
                    )} rounded border-2 shadow-md flex items-center justify-center text-[10px] font-black transform transition hover:scale-105`}
                    title={`${plate} ${unit}`}
                  >
                    <span className="[writing-mode:vertical-rl] rotate-180 tracking-tighter scale-75">
                      {plate}
                    </span>
                  </div>
                ))
              )}
              {plates.length === 0 && (
                <span className="text-xs text-slate-500 italic py-6">Empty Barbell (No plates required)</span>
              )}
            </div>
          </div>

          {remaining > 0 && (
            <div className="text-center text-xs text-amber-400 mt-2 font-mono">
              Note: {remaining} {unit} cannot be loaded with standard plates.
            </div>
          )}
        </div>

        {/* Plate Count Summary */}
        <div className="space-y-2 mb-6">
          <div className="text-xs font-semibold text-slate-400">Plates on EACH side:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {plates.map(({ plate, countEachSide }) => (
              <div
                key={plate}
                className="flex items-center justify-between p-2.5 bg-slate-800/70 rounded-xl border border-slate-700/60"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${getPlateColor(plate).split(' ')[0]}`} />
                  <span className="font-semibold text-white">{plate} {unit} plate</span>
                </div>
                <span className="font-mono font-bold text-lime-400">x {countEachSide}</span>
              </div>
            ))}
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
