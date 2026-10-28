import { WorkoutSession, WorkoutSet } from '../types/training';

// Epley formula: 1RM = Weight * (1 + Reps / 30)
export function calculate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  const epley = weight * (1 + reps / 30);
  return Math.round(epley * 10) / 10;
}

// Total volume in kg (Weight * Reps) for a set
export function calculateSetVolume(set: WorkoutSet): number {
  if (!set.isCompleted) return 0;
  return (set.weight || 0) * (set.reps || 0);
}

// Plate calculator for Olympic barbell (20kg / 45lbs)
export interface PlateCount {
  plate: number;
  countEachSide: number;
}

export function calculatePlates(targetWeight: number, barWeight: number = 20): { plates: PlateCount[]; remaining: number } {
  if (targetWeight <= barWeight) {
    return { plates: [], remaining: 0 };
  }

  const weightNeededEachSide = (targetWeight - barWeight) / 2;
  const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
  const plates: PlateCount[] = [];
  let currentNeeded = weightNeededEachSide;

  for (const plate of availablePlates) {
    const count = Math.floor(currentNeeded / plate);
    if (count > 0) {
      plates.push({ plate, countEachSide: count });
      currentNeeded = Math.round((currentNeeded - count * plate) * 100) / 100;
    }
  }

  return { plates, remaining: currentNeeded * 2 };
}

// Analyze historical performance of an exercise across sessions
export interface ExerciseHistoryAnalysis {
  exerciseId: string;
  exerciseName: string;
  sessionCount: number;
  latestSessionDate?: string;
  bestWeight: number;
  bestEstimated1RM: number;
  previousSets: WorkoutSet[];
  suggestedAction: {
    recommendedWeight: number;
    recommendedReps: number;
    rule: string;
    description: string;
    isDeload: boolean;
  };
}

export function analyzeExerciseHistory(exerciseId: string, workouts: WorkoutSession[]): ExerciseHistoryAnalysis | null {
  // Sort workouts by date ascending
  const sorted = [...workouts].sort((a, b) => a.startTime - b.startTime);
  
  const relevantSessions: { date: string; sets: WorkoutSet[]; title: string }[] = [];
  let bestWeight = 0;
  let best1RM = 0;
  let exerciseName = '';

  for (const session of sorted) {
    const foundExercise = session.exercises.find(e => e.exerciseId === exerciseId || e.exerciseName.toLowerCase() === exerciseId.toLowerCase());
    if (foundExercise && foundExercise.sets.some(s => s.isCompleted)) {
      exerciseName = foundExercise.exerciseName;
      const completedSets = foundExercise.sets.filter(s => s.isCompleted);
      relevantSessions.push({
        date: session.date,
        sets: completedSets,
        title: session.title
      });

      for (const set of completedSets) {
        if (set.weight > bestWeight) bestWeight = set.weight;
        const est1RM = calculate1RM(set.weight, set.reps);
        if (est1RM > best1RM) best1RM = est1RM;
      }
    }
  }

  if (relevantSessions.length === 0) return null;

  const lastSession = relevantSessions[relevantSessions.length - 1];
  const lastSets = lastSession.sets;
  const topSet = lastSets.reduce((max, s) => (s.weight > max.weight ? s : max), lastSets[0]);

  // Scientific Progressive Overload Analysis:
  // 1. Double Progression Method: If all working sets reached the upper rep range (e.g. >= 8-10 reps) at moderate RPE <= 8.5
  //    -> Add +2.5kg (micro-load) for next session.
  // 2. Rep Floor Expansion: If weight was recently increased or reps fell below target
  //    -> Keep weight, aim for +1 extra rep per set.
  // 3. Stagnation / Deload Check: If top set weight & reps haven't progressed in last 3 sessions and RPE >= 9.5
  //    -> Suggest a Deload Session (-10% weight, restorative).

  const last3 = relevantSessions.slice(-3);
  const isStalled = last3.length === 3 && last3.every(s => {
    const top = s.sets.reduce((m, x) => (x.weight > m.weight ? x : m), s.sets[0]);
    return Math.abs(top.weight - topSet.weight) < 1 && top.reps <= topSet.reps;
  });

  let recommendedWeight = topSet.weight;
  let recommendedReps = topSet.reps;
  let rule = 'Rep Increment (+1 Rep)';
  let description = `Keep load at ${topSet.weight}kg. Aim for ${topSet.reps + 1} reps on your first set before increasing load.`;
  let isDeload = false;

  if (isStalled) {
    isDeload = true;
    recommendedWeight = Math.round((topSet.weight * 0.9) * 2) / 2;
    recommendedReps = topSet.reps;
    rule = 'Deload Protocol (-10% Load)';
    description = `Performance has plateaued across 3 sessions. Perform a restorative deload at ${recommendedWeight}kg to allow neuromuscular and joint recovery.`;
  } else if (topSet.reps >= 8 && (!topSet.rpe || topSet.rpe <= 8.5)) {
    // Ready for load increase
    recommendedWeight = Math.round((topSet.weight * 1.025) * 2) / 2; // +2.5% rounded to 0.5kg
    recommendedReps = Math.max(6, topSet.reps - 2);
    rule = 'Micro-Load Progression (+2.5kg)';
    description = `You mastered ${topSet.weight}kg x ${topSet.reps} reps with good reserve! Advance to ${recommendedWeight}kg for ${recommendedReps}-${recommendedReps + 2} reps.`;
  }

  return {
    exerciseId,
    exerciseName: exerciseName || exerciseId,
    sessionCount: relevantSessions.length,
    latestSessionDate: lastSession.date,
    bestWeight,
    bestEstimated1RM: best1RM,
    previousSets: lastSets,
    suggestedAction: {
      recommendedWeight,
      recommendedReps,
      rule,
      description,
      isDeload
    }
  };
}

// Check if a completed set breaks a personal record
export function checkForNewPR(exerciseId: string, weight: number, reps: number, previousWorkouts: WorkoutSession[]): { isPR: boolean; details?: string } {
  if (weight <= 0 || reps <= 0) return { isPR: false };
  const current1RM = calculate1RM(weight, reps);
  let priorMaxWeight = 0;
  let priorMax1RM = 0;

  for (const session of previousWorkouts) {
    const exercise = session.exercises.find(e => e.exerciseId === exerciseId);
    if (exercise) {
      for (const set of exercise.sets) {
        if (set.isCompleted) {
          if (set.weight > priorMaxWeight) priorMaxWeight = set.weight;
          const e1rm = calculate1RM(set.weight, set.reps);
          if (e1rm > priorMax1RM) priorMax1RM = e1rm;
        }
      }
    }
  }

  if (priorMaxWeight === 0 && priorMax1RM === 0) {
    return { isPR: true, details: `Baseline set established: ${weight}kg x ${reps} reps` };
  }

  if (weight > priorMaxWeight) {
    return { isPR: true, details: `Heaviest Weight PR: ${weight}kg (+${Math.round((weight - priorMaxWeight) * 10) / 10}kg over previous best)` };
  }

  if (current1RM > priorMax1RM + 1) {
    return { isPR: true, details: `Estimated 1RM PR: ${current1RM}kg (${weight}kg x ${reps} reps)` };
  }

  return { isPR: false };
}
