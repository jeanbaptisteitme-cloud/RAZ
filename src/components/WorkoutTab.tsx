import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Plus, 
  Trash2, 
  Check, 
  Timer, 
  Dumbbell, 
  Flame, 
  Award, 
  AlertCircle, 
  ChevronRight, 
  RotateCcw, 
  Sparkles,
  Disc,
  Clock,
  Layers,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { 
  WorkoutSession, 
  WorkoutExercise, 
  WorkoutSet, 
  Program, 
  ProgramDay,
  Exercise 
} from '../types/training';
import { ExerciseSelectorModal } from './ExerciseSelectorModal';
import { soundManager } from '../utils/audioTimer';
import { checkForNewPR, calculateSetVolume, analyzeExerciseHistory } from '../utils/progressiveOverload';

interface Props {
  activeWorkout: WorkoutSession | null;
  onStartEmptyWorkout: () => void;
  onStartProgramWorkout: (program: Program, day: ProgramDay) => void;
  onUpdateWorkout: (workout: WorkoutSession) => void;
  onFinishWorkout: (workout: WorkoutSession) => void;
  onDiscardWorkout: () => void;
  activeProgram: Program;
  allWorkouts: WorkoutSession[];
  unit: 'kg' | 'lbs';
  onStartRestTimer: (seconds: number, exerciseName: string) => void;
  onOpenPlateCalc: (weight: number) => void;
  onOpen1RMCalc: (weight: number, reps: number) => void;
}

export const WorkoutTab: React.FC<Props> = ({
  activeWorkout,
  onStartEmptyWorkout,
  onStartProgramWorkout,
  onUpdateWorkout,
  onFinishWorkout,
  onDiscardWorkout,
  activeProgram,
  allWorkouts,
  unit,
  onStartRestTimer,
  onOpenPlateCalc,
  onOpen1RMCalc,
}) => {
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activePRNotice, setActivePRNotice] = useState<string | null>(null);

  // Quick past workout logger state
  const [showPastLogModal, setShowPastLogModal] = useState(false);
  const [pastTitle, setPastTitle] = useState('Upper Body Heavy');
  const [pastDate, setPastDate] = useState(new Date().toISOString().slice(0, 10));

  // Elapsed timer for active workout
  useEffect(() => {
    if (!activeWorkout) {
      setElapsedSeconds(0);
      return;
    }
    const updateElapsed = () => {
      const now = Date.now();
      const secs = Math.floor((now - activeWorkout.startTime) / 1000);
      setElapsedSeconds(secs);
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  const formatElapsed = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Add exercise to active workout
  const handleAddExercise = (exercise: Exercise) => {
    if (!activeWorkout) return;

    // Check if there was historical performance for this exercise to auto-populate previous sets
    const analysis = analyzeExerciseHistory(exercise.id, allWorkouts);
    const previousSets = analysis?.previousSets || [];

    const defaultSets: WorkoutSet[] = [
      {
        id: `set-${Date.now()}-1`,
        setNumber: 1,
        weight: previousSets[0]?.weight || (exercise.category === 'Legs' ? 60 : 40),
        reps: previousSets[0]?.reps || 8,
        rpe: 8,
        isCompleted: false,
        type: 'normal',
        previousWeight: previousSets[0]?.weight,
        previousReps: previousSets[0]?.reps,
      },
      {
        id: `set-${Date.now()}-2`,
        setNumber: 2,
        weight: previousSets[1]?.weight || (exercise.category === 'Legs' ? 60 : 40),
        reps: previousSets[1]?.reps || 8,
        rpe: 8,
        isCompleted: false,
        type: 'normal',
        previousWeight: previousSets[1]?.weight,
        previousReps: previousSets[1]?.reps,
      },
      {
        id: `set-${Date.now()}-3`,
        setNumber: 3,
        weight: previousSets[2]?.weight || (exercise.category === 'Legs' ? 60 : 40),
        reps: previousSets[2]?.reps || 8,
        rpe: 8.5,
        isCompleted: false,
        type: 'normal',
        previousWeight: previousSets[2]?.weight,
        previousReps: previousSets[2]?.reps,
      },
    ];

    const newExercise: WorkoutExercise = {
      id: `we-${Date.now()}`,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      sets: defaultSets,
      targetRestSeconds: 90,
    };

    onUpdateWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newExercise],
    });

    setShowExerciseModal(false);
  };

  // Toggle set completed
  const handleToggleSetComplete = (exerciseIdx: number, setIdx: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const targetExercise = updatedExercises[exerciseIdx];
    const targetSet = targetExercise.sets[setIdx];

    const newStatus = !targetSet.isCompleted;
    targetSet.isCompleted = newStatus;

    // If marked completed, check for PR and trigger rest timer!
    if (newStatus) {
      // PR Check
      const prResult = checkForNewPR(
        targetExercise.exerciseId,
        targetSet.weight,
        targetSet.reps,
        allWorkouts
      );

      if (prResult.isPR) {
        soundManager.playPRFanfare();
        setActivePRNotice(`🏆 NEW PR: ${targetExercise.exerciseName} - ${prResult.details}`);
        setTimeout(() => setActivePRNotice(null), 6000);
      } else {
        soundManager.playTick();
      }

      // Start Rest Timer
      onStartRestTimer(targetExercise.targetRestSeconds || 90, targetExercise.exerciseName);
    }

    // Recompute total volume and sets
    let totalVolume = 0;
    let totalSets = 0;
    updatedExercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.isCompleted) {
          totalVolume += calculateSetVolume(s);
          totalSets += 1;
        }
      });
    });

    onUpdateWorkout({
      ...activeWorkout,
      exercises: updatedExercises,
      totalVolumeKg: totalVolume,
      totalSets,
    });
  };

  // Update set weight / reps / RPE
  const handleUpdateSet = (
    exerciseIdx: number,
    setIdx: number,
    field: 'weight' | 'reps' | 'rpe' | 'type',
    value: any
  ) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIdx].sets[setIdx] = {
      ...updatedExercises[exerciseIdx].sets[setIdx],
      [field]: value,
    };

    // Recompute total volume
    let totalVolume = 0;
    updatedExercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.isCompleted) totalVolume += calculateSetVolume(s);
      });
    });

    onUpdateWorkout({
      ...activeWorkout,
      exercises: updatedExercises,
      totalVolumeKg: totalVolume,
    });
  };

  // Add set to exercise
  const handleAddSetToExercise = (exerciseIdx: number) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    const sets = updatedExercises[exerciseIdx].sets;
    const lastSet = sets[sets.length - 1];

    const newSet: WorkoutSet = {
      id: `set-${Date.now()}-${sets.length + 1}`,
      setNumber: sets.length + 1,
      weight: lastSet ? lastSet.weight : 40,
      reps: lastSet ? lastSet.reps : 8,
      rpe: 8,
      isCompleted: false,
      type: 'normal',
      previousWeight: lastSet?.previousWeight,
      previousReps: lastSet?.previousReps,
    };

    updatedExercises[exerciseIdx].sets.push(newSet);
    onUpdateWorkout({
      ...activeWorkout,
      exercises: updatedExercises,
    });
  };

  // Remove set from exercise
  const handleRemoveSet = (exerciseIdx: number, setIdx: number) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIdx].sets.splice(setIdx, 1);
    // Renumber
    updatedExercises[exerciseIdx].sets.forEach((s, idx) => {
      s.setNumber = idx + 1;
    });

    onUpdateWorkout({
      ...activeWorkout,
      exercises: updatedExercises,
    });
  };

  // Remove entire exercise
  const handleRemoveExercise = (exerciseIdx: number) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises.splice(exerciseIdx, 1);
    onUpdateWorkout({
      ...activeWorkout,
      exercises: updatedExercises,
    });
  };

  // ----------------------------------------------------
  // VIEW: NO ACTIVE WORKOUT
  // ----------------------------------------------------
  if (!activeWorkout) {
    const nextProgramDay = activeProgram.days[0];

    return (
      <div className="space-y-6 pb-24 text-left">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-md">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30 uppercase tracking-wider inline-block mb-3">
              Ready to Overload
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
              Log Your Next Training Session
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Every set is matched against your historical best with automated double-progression targets and audio rest intervals.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={onStartEmptyWorkout}
                className="bg-lime-400 hover:bg-lime-300 text-black px-5 py-3 rounded-2xl font-black text-sm shadow-[0_0_25px_rgba(163,230,53,0.4)] transition cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Start Empty Workout
              </button>

              {nextProgramDay && (
                <button
                  onClick={() => onStartProgramWorkout(activeProgram, nextProgramDay)}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-3 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 text-lime-400 fill-lime-400" />
                  <span>Start {nextProgramDay.title}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Program Routine Quick Launch */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-lime-400" />
              Active Split: {activeProgram.name}
            </h3>
            <span className="text-xs text-lime-400 font-mono font-semibold">
              {activeProgram.days.length} Routines Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeProgram.days.map((day) => (
              <div
                key={day.dayId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-4 transition flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-lime-300 transition">
                    {day.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{day.focus}</p>
                  <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                    {day.exerciseTemplates.length} exercises planned
                  </span>
                </div>
                <button
                  onClick={() => onStartProgramWorkout(activeProgram, day)}
                  className="bg-slate-800 group-hover:bg-lime-400 group-hover:text-black text-slate-300 p-3 rounded-2xl transition cursor-pointer"
                  title="Launch this workout"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tools Row (Plate Calculator & 1RM Calculator) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onOpenPlateCalc(100)}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-lime-500/40 rounded-3xl text-left transition group cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-lime-500/10 text-lime-400 w-fit mb-2 group-hover:bg-lime-400 group-hover:text-black transition">
              <Disc className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Plate Calculator</h4>
            <p className="text-xs text-slate-400 mt-0.5">Calculate barbell disc loads per side</p>
          </button>

          <button
            onClick={() => onOpen1RMCalc(85, 6)}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl text-left transition group cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-2 group-hover:bg-amber-400 group-hover:text-black transition">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">1RM Calculator</h4>
            <p className="text-xs text-slate-400 mt-0.5">Determine maximal single-rep capacity</p>
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: ACTIVE WORKOUT IN PROGRESS
  // ----------------------------------------------------
  return (
    <div className="space-y-6 pb-32 text-left">
      {/* Floating PR Alert banner */}
      {activePRNotice && (
        <div className="sticky top-2 z-30 bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-4 py-2.5 rounded-2xl shadow-2xl font-black text-xs flex items-center justify-between animate-bounce">
          <span>{activePRNotice}</span>
          <button onClick={() => setActivePRNotice(null)} className="text-black/70 hover:text-black">
            &times;
          </button>
        </div>
      )}

      {/* Active Workout Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-lime-500/40 rounded-3xl p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"></span>
              </span>
              <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest font-mono">
                Workout in Progress
              </span>
            </div>
            <input
              type="text"
              value={activeWorkout.title}
              onChange={(e) => onUpdateWorkout({ ...activeWorkout, title: e.target.value })}
              className="text-2xl font-black text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-lime-400 focus:outline-none tracking-tight"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Elapsed</span>
              <span className="font-mono font-black text-lg text-lime-400">
                {formatElapsed(elapsedSeconds)}
              </span>
            </div>

            <button
              onClick={() => onFinishWorkout(activeWorkout)}
              className="bg-lime-400 hover:bg-lime-300 text-black px-4 py-3 rounded-2xl font-black text-xs shadow-[0_0_20px_rgba(163,230,53,0.4)] transition cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Finish
            </button>
          </div>
        </div>

        {/* Session Stats Banner */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Volume</span>
            <span className="font-mono font-bold text-white text-sm">
              {activeWorkout.totalVolumeKg} {unit}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Sets Done</span>
            <span className="font-mono font-bold text-lime-400 text-sm">
              {activeWorkout.totalSets || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Exercises</span>
            <span className="font-mono font-bold text-white text-sm">
              {activeWorkout.exercises.length}
            </span>
          </div>
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-4">
        {activeWorkout.exercises.map((exercise, exIdx) => {
          const analysis = analyzeExerciseHistory(exercise.exerciseId, allWorkouts);

          return (
            <div
              key={exercise.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4 relative"
            >
              {/* Exercise Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-lime-400 uppercase">
                      {exercise.category}
                    </span>
                    {analysis?.suggestedAction && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-500/20 text-lime-300 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Target: {analysis.suggestedAction.recommendedWeight}{unit} &times; {analysis.suggestedAction.recommendedReps}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-lg text-white">{exercise.exerciseName}</h4>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const topSet = exercise.sets.find((s) => s.weight > 0) || exercise.sets[0];
                      onOpenPlateCalc(topSet?.weight || 80);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Calculate Barbell Plates"
                  >
                    <Disc className="w-4 h-4 text-lime-400" />
                  </button>
                  <button
                    onClick={() => handleRemoveExercise(exIdx)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                    title="Remove Exercise"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Previous History Highlight (For direct progressive overload comparison!) */}
              {analysis && analysis.previousSets.length > 0 && (
                <div className="bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800/80 text-xs flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-slate-300">Previous Session Best:</span>
                  <span className="font-mono text-lime-300">
                    {analysis.previousSets.map((s) => `${s.weight}${unit} &times; ${s.reps}`).join(' | ')}
                  </span>
                </div>
              )}

              {/* Sets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800/80">
                      <th className="pb-2 text-center w-10">Set</th>
                      <th className="pb-2 text-left">Previous</th>
                      <th className="pb-2 text-center w-24">{unit}</th>
                      <th className="pb-2 text-center w-20">Reps</th>
                      <th className="pb-2 text-center w-16">RPE</th>
                      <th className="pb-2 text-center w-12">&#10003;</th>
                      <th className="pb-2 text-center w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {exercise.sets.map((set, setIdx) => (
                      <tr
                        key={set.id}
                        className={`transition ${
                          set.isCompleted ? 'bg-lime-500/5' : 'hover:bg-slate-800/30'
                        }`}
                      >
                        {/* Set # */}
                        <td className="py-2.5 text-center font-bold text-slate-400">
                          {set.setNumber}
                        </td>

                        {/* Previous */}
                        <td className="py-2.5 text-slate-500 font-mono text-[11px]">
                          {set.previousWeight
                            ? `${set.previousWeight}${unit} \u00D7 ${set.previousReps}`
                            : '-'}
                        </td>

                        {/* Weight Input */}
                        <td className="py-2.5 px-1 text-center">
                          <input
                            type="number"
                            step="0.5"
                            value={set.weight}
                            onChange={(e) =>
                              handleUpdateSet(
                                exIdx,
                                setIdx,
                                'weight',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className={`w-20 text-center font-mono font-bold rounded-xl py-1.5 border transition ${
                              set.isCompleted
                                ? 'bg-slate-950 text-slate-300 border-slate-800'
                                : 'bg-slate-950 text-white border-slate-700 focus:border-lime-400'
                            }`}
                          />
                        </td>

                        {/* Reps Input */}
                        <td className="py-2.5 px-1 text-center">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={set.reps}
                            onChange={(e) =>
                              handleUpdateSet(
                                exIdx,
                                setIdx,
                                'reps',
                                parseInt(e.target.value) || 0
                              )
                            }
                            className={`w-16 text-center font-mono font-bold rounded-xl py-1.5 border transition ${
                              set.isCompleted
                                ? 'bg-slate-950 text-slate-300 border-slate-800'
                                : 'bg-slate-950 text-white border-slate-700 focus:border-lime-400'
                            }`}
                          />
                        </td>

                        {/* RPE Selector */}
                        <td className="py-2.5 px-1 text-center">
                          <select
                            value={set.rpe || 8}
                            onChange={(e) =>
                              handleUpdateSet(exIdx, setIdx, 'rpe', parseFloat(e.target.value))
                            }
                            className="bg-slate-950 border border-slate-700 rounded-xl px-2 py-1 text-xs text-slate-300 font-mono focus:border-lime-400"
                          >
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="7.5">7.5</option>
                            <option value="8">8</option>
                            <option value="8.5">8.5</option>
                            <option value="9">9</option>
                            <option value="9.5">9.5</option>
                            <option value="10">10 (Fail)</option>
                          </select>
                        </td>

                        {/* Complete Checkmark */}
                        <td className="py-2.5 text-center">
                          <button
                            onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer ${
                              set.isCompleted
                                ? 'bg-lime-400 text-black shadow-[0_0_12px_rgba(163,230,53,0.5)]'
                                : 'bg-slate-800 text-slate-500 hover:border-lime-400 hover:text-white border border-slate-700'
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                        </td>

                        {/* Remove Set */}
                        <td className="py-2.5 text-center">
                          <button
                            onClick={() => handleRemoveSet(exIdx, setIdx)}
                            className="text-slate-600 hover:text-red-400 p-1"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Set Button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => handleAddSetToExercise(exIdx)}
                  className="bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Set
                </button>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-lime-400" />
                  Rest: {exercise.targetRestSeconds || 90}s
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Exercise & Discard Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => setShowExerciseModal(true)}
            className="w-full bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-lime-400 text-white py-3.5 rounded-3xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-lime-400" />
            Add Another Exercise
          </button>

          <button
            onClick={onDiscardWorkout}
            className="text-xs text-red-400 hover:text-red-300 py-2 px-4 rounded-xl transition cursor-pointer"
          >
            Discard Workout
          </button>
        </div>
      </div>

      {/* Exercise Modal */}
      {showExerciseModal && (
        <ExerciseSelectorModal
          onSelectExercise={handleAddExercise}
          onClose={() => setShowExerciseModal(false)}
        />
      )}
    </div>
  );
};
