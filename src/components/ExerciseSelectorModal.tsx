import React, { useState } from 'react';
import { X, Search, Plus, Dumbbell, Filter } from 'lucide-react';
import { Exercise, MuscleGroup } from '../types/training';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

interface Props {
  onSelectExercise: (exercise: Exercise) => void;
  onClose: () => void;
}

export const ExerciseSelectorModal: React.FC<Props> = ({ onSelectExercise, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<MuscleGroup>('Chest');

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  const filteredExercises = EXERCISE_LIBRARY.filter((ex) => {
    const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateCustom = () => {
    if (!customName.trim()) return;
    const newEx: Exercise = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      equipment: 'Barbell',
      targetRepRange: '8-12',
      primaryMuscle: customCategory,
    };
    onSelectExercise(newEx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[650px] max-h-[90vh] overflow-hidden text-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-lime-500/20 text-lime-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Select Exercise</h3>
              <p className="text-xs text-slate-400">Add movements to your active workout</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercise (e.g. Bench, Squat, Cable...)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-lime-400 text-black border-lime-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => onSelectExercise(ex)}
              className="p-3 bg-slate-950/60 hover:bg-slate-800/80 rounded-2xl border border-slate-800/80 hover:border-lime-500/40 transition cursor-pointer flex items-center justify-between group"
            >
              <div>
                <h4 className="font-bold text-xs text-white group-hover:text-lime-300 transition">
                  {ex.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="text-lime-400 font-medium">{ex.category}</span>
                  <span>&bull;</span>
                  <span>{ex.equipment}</span>
                  <span>&bull;</span>
                  <span>Target: {ex.targetRepRange} reps</span>
                </div>
              </div>
              <button className="bg-slate-800 group-hover:bg-lime-400 group-hover:text-black text-slate-300 p-2 rounded-xl transition">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}

          {filteredExercises.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-xs">
              No matching exercises found. You can create a custom one below.
            </div>
          )}
        </div>

        {/* Create Custom Exercise Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Or Add Custom Exercise:
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Custom Exercise Name..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
            />
            <select
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value as MuscleGroup)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Legs">Legs</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Arms">Arms</option>
              <option value="Core">Core</option>
            </select>
            <button
              onClick={handleCreateCustom}
              disabled={!customName.trim()}
              className="bg-lime-400 hover:bg-lime-300 disabled:opacity-40 text-black px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
