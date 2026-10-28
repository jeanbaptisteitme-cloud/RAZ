import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Dumbbell, 
  ChevronRight, 
  BarChart2, 
  ShieldCheck,
  Info,
  Calendar,
  Layers,
  Activity
} from 'lucide-react';
import { WorkoutSession, Exercise } from '../types/training';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { analyzeExerciseHistory, calculate1RM } from '../utils/progressiveOverload';

interface Props {
  workouts: WorkoutSession[];
  unit: 'kg' | 'lbs';
  onOpenPlateCalc: (weight: number) => void;
  onOpen1RMCalc: (weight: number, reps: number) => void;
}

export const OverloadTab: React.FC<Props> = ({
  workouts,
  unit,
  onOpenPlateCalc,
  onOpen1RMCalc,
}) => {
  // Find distinct exercises that user has logged
  const loggedExerciseIds = Array.from(
    new Set(
      workouts.flatMap((w) =>
        w.exercises.filter((e) => e.sets.some((s) => s.isCompleted)).map((e) => e.exerciseId)
      )
    )
  );

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    loggedExerciseIds[0] || 'bench-press-bb'
  );

  // AI Overload deep dive state
  const [aiAdvice, setAiAdvice] = useState<any | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const selectedExercise =
    EXERCISE_LIBRARY.find((e) => e.id === selectedExerciseId) || {
      id: selectedExerciseId,
      name: selectedExerciseId,
      category: 'Full Body',
      targetRepRange: '8-10',
      primaryMuscle: 'Compound',
      equipment: 'Barbell',
    };

  const analysis = analyzeExerciseHistory(selectedExerciseId, workouts);

  const handleFetchAiOverload = async () => {
    if (!analysis) return;
    setIsLoadingAi(true);

    try {
      const res = await fetch('/api/ai/progressive-overload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseName: analysis.exerciseName,
          currentSession: { sets: analysis.previousSets },
          history: workouts.map((w) => ({
            date: w.date,
            exercise: w.exercises.find((e) => e.exerciseId === selectedExerciseId),
          })),
        }),
      });

      const data = await res.json();
      setAiAdvice(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 text-left">
      {/* Tab Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-lime-500/20 text-lime-400">
            <TrendingUp className="w-4 h-4" />
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Progressive Overload Advisor
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Automated double-progression calculations, micro-loading targets, and deload prevention.
        </p>
      </div>

      {/* Overload Overview Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tracked Lifts
          </span>
          <div className="text-2xl font-black text-white font-mono">
            {loggedExerciseIds.length}
          </div>
          <span className="text-[10px] text-lime-400 flex items-center gap-1 mt-0.5 font-medium">
            <CheckCircle2 className="w-3 h-3" /> Double Progression
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Overload Rate
          </span>
          <div className="text-2xl font-black text-lime-400 font-mono">+2.5%</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Micro-load target</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Recovery Status
          </span>
          <div className="text-base font-black text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Optimal
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">0 Deloads pending</span>
        </div>
      </div>

      {/* Exercise Selector Chips */}
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Select Exercise to Inspect Progression:
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {loggedExerciseIds.map((exId) => {
            const exInfo = EXERCISE_LIBRARY.find((e) => e.id === exId);
            const name = exInfo ? exInfo.name : exId;
            const isSelected = exId === selectedExerciseId;
            return (
              <button
                key={exId}
                onClick={() => {
                  setSelectedExerciseId(exId);
                  setAiAdvice(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  isSelected
                    ? 'bg-lime-400 text-black border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Exercise Overload Card */}
      {analysis ? (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-lime-400">
                  {selectedExercise.category} &bull; {selectedExercise.equipment}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {analysis.sessionCount} sessions logged
                </span>
              </div>
              <h3 className="text-xl font-black text-white">{analysis.exerciseName}</h3>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Estimated 1RM</span>
              <span className="text-xl font-black text-lime-400 font-mono">
                {analysis.bestEstimated1RM} {unit}
              </span>
            </div>
          </div>

          {/* OVERLOAD ACTION BANNER (The Core Advice!) */}
          <div className={`p-4 rounded-2xl border mb-5 ${
            analysis.suggestedAction.isDeload
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'bg-lime-950/40 border-lime-500/40 text-lime-100'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                {analysis.suggestedAction.isDeload ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400">{analysis.suggestedAction.rule}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-lime-400" />
                    <span className="text-lime-400">{analysis.suggestedAction.rule}</span>
                  </>
                )}
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-white font-bold">
                Target: {analysis.suggestedAction.recommendedWeight} {unit} &times; {analysis.suggestedAction.recommendedReps} reps
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-200">
              {analysis.suggestedAction.description}
            </p>
          </div>

          {/* Previous Performance Breakdown */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Last Session Sets:</span>
              <span className="font-mono text-[11px] text-slate-500">
                {new Date(analysis.latestSessionDate || '').toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {analysis.previousSets.map((s, idx) => (
                <div
                  key={s.id || idx}
                  className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center"
                >
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    Set {s.setNumber || idx + 1}
                  </span>
                  <div className="font-mono font-black text-sm text-white">
                    {s.weight}{unit} &times; {s.reps}
                  </div>
                  {s.rpe && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      @ RPE {s.rpe}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Calculator Buttons */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => onOpenPlateCalc(analysis.suggestedAction.recommendedWeight)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Dumbbell className="w-3.5 h-3.5 text-lime-400" />
              Plate Breakdown ({analysis.suggestedAction.recommendedWeight}{unit})
            </button>
            <button
              onClick={() => onOpen1RMCalc(analysis.bestWeight, 6)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
              1RM Percentages
            </button>
          </div>

          {/* AI Progressive Overload Deep Dive */}
          <div className="pt-3 border-t border-slate-800/80">
            {!aiAdvice ? (
              <button
                onClick={handleFetchAiOverload}
                disabled={isLoadingAi}
                className="w-full bg-slate-950 hover:bg-slate-900 border border-lime-500/30 text-lime-400 hover:text-lime-300 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoadingAi ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing Fatigue & Joint Stress...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Get AI Biomechanical & Fatigue Analysis</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-slate-950 p-4 rounded-2xl border border-lime-500/30 space-y-2.5 text-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lime-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Coach Advice:
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    RPE Target: {aiAdvice.targetRpe || 8}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{aiAdvice.coachingAdvice}</p>

                {aiAdvice.formCues?.length > 0 && (
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Technique Cues for Next Session:
                    </span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {aiAdvice.formCues.map((cue: string, i: number) => (
                        <li key={i}>{cue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-slate-400">
          <p className="text-sm">Log at least one set of this exercise to view progression analysis.</p>
        </div>
      )}

      {/* Scientific Progressive Overload Primer (Double Progression Cheat Sheet) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-lime-400" />
          The 4 Pillars of Progressive Overload
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
            <strong className="text-lime-300 block mb-1">1. Double Progression (Gold Standard)</strong>
            <p className="text-slate-400 leading-relaxed">
              Pick a rep bracket (e.g. 6-8 reps). Keep the weight the same until you can perform 8 reps on ALL working sets. Then advance weight by +2.5kg and repeat from 6 reps.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
            <strong className="text-lime-300 block mb-1">2. Volume Density</strong>
            <p className="text-slate-400 leading-relaxed">
              Complete the exact same weight and reps in less overall time by reducing rest intervals from 2:30 down to 1:45 without losing reps.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
            <strong className="text-lime-300 block mb-1">3. Controlled Eccentric Tempo</strong>
            <p className="text-slate-400 leading-relaxed">
              Lowering the barbell for 3 controlled seconds rather than 1 second increases mechanical tension under stretch by over 40% with the same weight.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
            <strong className="text-lime-300 block mb-1">4. The Deload Safety Valve</strong>
            <p className="text-slate-400 leading-relaxed">
              If reps drop or joint fatigue spikes for 3 workouts in a row, reduce weight by 10% and sets by 30% for 1 week. You will return significantly stronger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
