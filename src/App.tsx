import React, { useState, useEffect } from 'react';
import { 
  WorkoutSession, 
  Program, 
  ProgramDay, 
  WorkoutSet 
} from './types/training';
import { INITIAL_WORKOUTS } from './data/initialWorkouts';
import { DEFAULT_PROGRAMS } from './data/defaultPrograms';
import { EXERCISE_LIBRARY } from './data/exerciseLibrary';
import { MobileFrame } from './components/MobileFrame';
import { TopBar } from './components/TopBar';
import { BottomNav, TabType } from './components/BottomNav';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { WorkoutTab } from './components/WorkoutTab';
import { OverloadTab } from './components/OverloadTab';
import { ProgramsTab } from './components/ProgramsTab';
import { HistoryTab } from './components/HistoryTab';
import { AICoachModal } from './components/AICoachModal';
import { PlateCalculatorModal } from './components/PlateCalculatorModal';
import { OneRepMaxModal } from './components/OneRepMaxModal';
import { RestTimerFloating } from './components/RestTimerFloating';
import { soundManager } from './utils/audioTimer';

const STORAGE_KEYS = {
  WORKOUTS: 'apex_workouts_v1',
  ACTIVE_WORKOUT: 'apex_active_workout_v1',
  PROGRAMS: 'apex_programs_v1',
  ACTIVE_PROGRAM_ID: 'apex_active_program_id_v1',
  UNIT: 'apex_unit_v1',
  PHONE_FRAME: 'apex_phone_frame_v1',
};

export default function App() {
  // Load saved state or fallbacks
  const [workouts, setWorkouts] = useState<WorkoutSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
    } catch {
      return INITIAL_WORKOUTS;
    }
  });

  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [programs, setPrograms] = useState<Program[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      return saved ? JSON.parse(saved) : DEFAULT_PROGRAMS;
    } catch {
      return DEFAULT_PROGRAMS;
    }
  });

  const [activeProgramId, setActiveProgramId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROGRAM_ID) || DEFAULT_PROGRAMS[0].id;
    } catch {
      return DEFAULT_PROGRAMS[0].id;
    }
  });

  const [unit, setUnit] = useState<'kg' | 'lbs'>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.UNIT) as any) || 'kg';
    } catch {
      return 'kg';
    }
  });

  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHONE_FRAME);
      if (saved !== null) return saved === 'true';
      // Default to false if screen is narrow, true if wide
      return typeof window !== 'undefined' && window.innerWidth >= 768;
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('workout');

  // Rest Timer state
  const [restTimerState, setRestTimerState] = useState<{
    isActive: boolean;
    initialSeconds: number;
    exerciseName: string;
  }>({
    isActive: false,
    initialSeconds: 90,
    exerciseName: '',
  });

  // Modal states
  const [plateCalcWeight, setPlateCalcWeight] = useState<number | null>(null);
  const [oneRepMaxState, setOneRepMaxState] = useState<{ weight: number; reps: number } | null>(
    null
  );
  const [showAICoachModal, setShowAICoachModal] = useState<boolean>(false);

  // Persistence to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    } catch (e) {
      console.error('Failed to save workouts to localStorage', e);
    }
  }, [workouts]);

  useEffect(() => {
    try {
      if (activeWorkout) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(activeWorkout));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeWorkout]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROGRAM_ID, activeProgramId);
    } catch (e) {
      console.error(e);
    }
  }, [programs, activeProgramId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.UNIT, unit);
    } catch (e) {
      console.error(e);
    }
  }, [unit]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PHONE_FRAME, String(isPhoneFrame));
    } catch (e) {
      console.error(e);
    }
  }, [isPhoneFrame]);

  // Start an empty workout session
  const handleStartEmptyWorkout = () => {
    const newSession: WorkoutSession = {
      id: `workout-${Date.now()}`,
      date: new Date().toISOString(),
      startTime: Date.now(),
      title: 'Workout Log',
      totalVolumeKg: 0,
      totalSets: 0,
      exercises: [],
    };
    setActiveWorkout(newSession);
    setActiveTab('workout');
  };

  // Start workout from a specific Program Day
  const handleStartProgramWorkout = (program: Program, day: ProgramDay) => {
    const exercises = day.exerciseTemplates.map((template, idx) => {
      // Find matching historical sets if any
      const priorWorkout = workouts.find((w) =>
        w.exercises.some((e) => e.exerciseId === template.exerciseId)
      );
      const priorExercise = priorWorkout?.exercises.find(
        (e) => e.exerciseId === template.exerciseId
      );

      const targetRepsNum = parseInt(template.targetReps) || 8;
      const defaultWeight = template.category === 'Legs' ? 70 : 50;

      const sets: WorkoutSet[] = Array.from({ length: template.sets }).map((_, sIdx) => {
        const priorSet = priorExercise?.sets[sIdx];
        return {
          id: `set-${Date.now()}-${idx}-${sIdx + 1}`,
          setNumber: sIdx + 1,
          weight: priorSet ? priorSet.weight : defaultWeight,
          reps: priorSet ? priorSet.reps : targetRepsNum,
          rpe: template.targetRpe || 8,
          isCompleted: false,
          type: 'normal',
          previousWeight: priorSet?.weight,
          previousReps: priorSet?.reps,
        };
      });

      return {
        id: `we-${Date.now()}-${idx}`,
        exerciseId: template.exerciseId,
        exerciseName: template.exerciseName,
        category: template.category,
        sets,
        targetRestSeconds: template.restSeconds || 90,
      };
    });

    const newSession: WorkoutSession = {
      id: `workout-${Date.now()}`,
      date: new Date().toISOString(),
      startTime: Date.now(),
      title: `${day.title}`,
      routineId: program.id,
      totalVolumeKg: 0,
      totalSets: 0,
      exercises,
    };

    setActiveWorkout(newSession);
    setActiveTab('workout');
  };

  // Finish and save completed workout
  const handleFinishWorkout = (finished: WorkoutSession) => {
    const endTime = Date.now();
    const durationMinutes = Math.max(1, Math.round((endTime - finished.startTime) / (60 * 1000)));

    // Calculate completed sets and total volume
    let totalVolume = 0;
    let totalSets = 0;
    const records: string[] = [];

    finished.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.isCompleted) {
          totalVolume += s.weight * s.reps;
          totalSets += 1;
        }
      });
    });

    const completedSession: WorkoutSession = {
      ...finished,
      endTime,
      durationMinutes,
      totalVolumeKg: totalVolume,
      totalSets,
      personalRecords: records,
    };

    soundManager.playPRFanfare();

    setWorkouts((prev) => [completedSession, ...prev]);
    setActiveWorkout(null);
    setRestTimerState({ isActive: false, initialSeconds: 0, exerciseName: '' });
    setActiveTab('history');
  };

  const handleDiscardWorkout = () => {
    if (confirm('Are you sure you want to discard this active workout?')) {
      setActiveWorkout(null);
      setRestTimerState({ isActive: false, initialSeconds: 0, exerciseName: '' });
    }
  };

  const activeProgram =
    programs.find((p) => p.id === activeProgramId) || programs[0] || DEFAULT_PROGRAMS[0];

  return (
    <MobileFrame
      isPhoneFrame={isPhoneFrame}
      onToggleFrame={() => setIsPhoneFrame(!isPhoneFrame)}
    >
      {/* Top App Bar */}
      <TopBar
        unit={unit}
        onToggleUnit={() => setUnit(unit === 'kg' ? 'lbs' : 'kg')}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        onOpenPlateCalc={() => setPlateCalcWeight(100)}
        onOpen1RMCalc={() => setOneRepMaxState({ weight: 85, reps: 6 })}
        hasActiveRestTimer={restTimerState.isActive}
        restTimerSeconds={restTimerState.initialSeconds}
      />

      {/* APK / PWA Install Banner */}
      <PWAInstallBanner />

      {/* Main Content Area */}
      <main className="flex-1 p-4 max-w-4xl w-full mx-auto">
        {activeTab === 'workout' && (
          <WorkoutTab
            activeWorkout={activeWorkout}
            onStartEmptyWorkout={handleStartEmptyWorkout}
            onStartProgramWorkout={handleStartProgramWorkout}
            onUpdateWorkout={setActiveWorkout}
            onFinishWorkout={handleFinishWorkout}
            onDiscardWorkout={handleDiscardWorkout}
            activeProgram={activeProgram}
            allWorkouts={workouts}
            unit={unit}
            onStartRestTimer={(secs, name) =>
              setRestTimerState({ isActive: true, initialSeconds: secs, exerciseName: name })
            }
            onOpenPlateCalc={(w) => setPlateCalcWeight(w)}
            onOpen1RMCalc={(w, r) => setOneRepMaxState({ weight: w, reps: r })}
          />
        )}

        {activeTab === 'overload' && (
          <OverloadTab
            workouts={workouts}
            unit={unit}
            onOpenPlateCalc={(w) => setPlateCalcWeight(w)}
            onOpen1RMCalc={(w, r) => setOneRepMaxState({ weight: w, reps: r })}
          />
        )}

        {activeTab === 'programs' && (
          <ProgramsTab
            programs={programs}
            activeProgramId={activeProgramId}
            onSelectActiveProgram={setActiveProgramId}
            onStartWorkoutFromDay={handleStartProgramWorkout}
            onAddCustomProgram={(newProg) => setPrograms((prev) => [newProg, ...prev])}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            workouts={workouts}
            unit={unit}
            onDeleteWorkout={(id) => setWorkouts((prev) => prev.filter((w) => w.id !== id))}
            onImportWorkouts={(imported) => setWorkouts(imported)}
            onResetSampleData={() => setWorkouts(INITIAL_WORKOUTS)}
          />
        )}

        {activeTab === 'coach' && (
          <div className="py-4">
            <AICoachModal
              onClose={() => setActiveTab('workout')}
              activeContext={{
                recentWorkouts: workouts.slice(0, 3),
                activeProgram: activeProgram.name,
              }}
            />
          </div>
        )}
      </main>

      {/* Floating Rest Timer */}
      {restTimerState.isActive && (
        <RestTimerFloating
          initialSeconds={restTimerState.initialSeconds}
          exerciseName={restTimerState.exerciseName}
          soundEnabled={true}
          onFinish={() => {
            setRestTimerState((prev) => ({ ...prev, isActive: false }));
          }}
          onClose={() => {
            setRestTimerState((prev) => ({ ...prev, isActive: false }));
          }}
        />
      )}

      {/* Plate Calculator Modal */}
      {plateCalcWeight !== null && (
        <PlateCalculatorModal
          initialWeight={plateCalcWeight}
          unit={unit}
          onClose={() => setPlateCalcWeight(null)}
        />
      )}

      {/* 1RM Calculator Modal */}
      {oneRepMaxState !== null && (
        <OneRepMaxModal
          initialWeight={oneRepMaxState.weight}
          initialReps={oneRepMaxState.reps}
          unit={unit}
          onClose={() => setOneRepMaxState(null)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'coach') {
            setShowAICoachModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        hasActiveWorkout={Boolean(activeWorkout)}
      />

      {/* Full AI Coach Modal if triggered from nav or button */}
      {showAICoachModal && (
        <AICoachModal
          onClose={() => setShowAICoachModal(false)}
          activeContext={{
            recentWorkouts: workouts.slice(0, 3),
            activeProgram: activeProgram.name,
          }}
        />
      )}
    </MobileFrame>
  );
}
