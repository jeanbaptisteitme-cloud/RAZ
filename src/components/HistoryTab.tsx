import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Award, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Upload, 
  Dumbbell, 
  Flame, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { WorkoutSession } from '../types/training';

interface Props {
  workouts: WorkoutSession[];
  unit: 'kg' | 'lbs';
  onDeleteWorkout: (id: string) => void;
  onImportWorkouts: (imported: WorkoutSession[]) => void;
  onResetSampleData: () => void;
}

export const HistoryTab: React.FC<Props> = ({
  workouts,
  unit,
  onDeleteWorkout,
  onImportWorkouts,
  onResetSampleData,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(workouts[0]?.id || null);

  const totalVolume = workouts.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
  const totalSets = workouts.reduce((sum, w) => sum + (w.totalSets || 0), 0);
  const allPRs = workouts.flatMap((w) => w.personalRecords || []);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(workouts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `apex_training_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportWorkouts(parsed);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-24 text-left">
      {/* Header & Export/Import Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Workout History</span>
            <span className="text-xs bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full">
              {workouts.length} Logged
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Review past session volumes, set reps, PR milestones, and export training data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            title="Export workout logs to JSON"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>

          <label className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            Import
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Tonnage
          </span>
          <div className="text-2xl font-black text-white font-mono">
            {Math.round(totalVolume / 1000 * 10) / 10} <span className="text-xs text-lime-400">Tonnes</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{totalSets} total completed sets</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Personal Records
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1.5">
            <Award className="w-5 h-5 fill-amber-400/20" />
            {allPRs.length}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Lifetime PR milestones</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Avg Duration
          </span>
          <div className="text-2xl font-black text-lime-400 font-mono">57 <span className="text-xs text-slate-400">min</span></div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Optimal training window</span>
        </div>
      </div>

      {/* PR Trophy Showcase (if any) */}
      {allPRs.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-3xl p-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            Recent Personal Records (PRs)
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {allPRs.map((pr, idx) => (
              <div
                key={idx}
                className="bg-black/40 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs text-amber-200 font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                {pr}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout Sessions List */}
      <div className="space-y-3">
        {workouts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
            <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No workouts logged yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Complete your first workout to see progressive overload trends!</p>
            <button
              onClick={onResetSampleData}
              className="bg-lime-400 hover:bg-lime-300 text-black px-4 py-2 rounded-xl text-xs font-bold transition"
            >
              Load Sample History
            </button>
          </div>
        ) : (
          workouts.map((workout) => {
            const isExpanded = expandedId === workout.id;
            const dateStr = new Date(workout.startTime || workout.date).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={workout.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : workout.id)}
                  className="p-4 cursor-pointer flex items-center justify-between gap-3 hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-lime-500/10 border border-lime-500/20 text-lime-400 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      {workout.durationMinutes || 50}m
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{workout.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {dateStr}
                        </span>
                        <span>&bull;</span>
                        <span>{workout.exercises.length} Exercises</span>
                        <span>&bull;</span>
                        <span className="text-lime-400 font-mono font-semibold">
                          {workout.totalVolumeKg} {unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {workout.personalRecords && workout.personalRecords.length > 0 && (
                      <span className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                        <Award className="w-3 h-3 text-amber-400" />
                        {workout.personalRecords.length} PR
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 bg-slate-950/50 space-y-3">
                    {workout.notes && (
                      <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                        <FileText className="w-3.5 h-3.5 text-lime-400 mt-0.5 shrink-0" />
                        <span>{workout.notes}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {workout.exercises.map((ex, exIdx) => (
                        <div key={ex.id || exIdx} className="bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
                          <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                            <span>{ex.exerciseName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {ex.sets.filter((s) => s.isCompleted).length} sets completed
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            {ex.sets.map((s, sIdx) => (
                              <div
                                key={s.id || sIdx}
                                className={`text-[11px] p-1.5 rounded-lg border font-mono flex items-center justify-between ${
                                  s.isCompleted
                                    ? 'bg-slate-950 text-slate-200 border-slate-800'
                                    : 'bg-slate-900 text-slate-500 border-slate-800/40'
                                }`}
                              >
                                <span className="text-slate-500 text-[10px]">#{s.setNumber || sIdx + 1}</span>
                                <span className="font-bold text-lime-400">
                                  {s.weight}{unit} &times; {s.reps}
                                </span>
                                {s.rpe ? <span className="text-[10px] text-slate-400">RPE{s.rpe}</span> : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => onDeleteWorkout(workout.id)}
                        className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Workout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
