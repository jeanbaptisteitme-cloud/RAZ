import { WorkoutSession } from '../types/training';

const now = Date.now();
const oneDayMs = 24 * 60 * 60 * 1000;

export const INITIAL_WORKOUTS: WorkoutSession[] = [
  {
    id: 'workout-prev-3',
    date: new Date(now - 6 * oneDayMs).toISOString(),
    startTime: now - 6 * oneDayMs,
    endTime: now - 6 * oneDayMs + 52 * 60 * 1000,
    title: 'Push Day A - Chest & Delts',
    routineId: 'ppl-6day',
    totalVolumeKg: 7840,
    totalSets: 14,
    rating: 5,
    notes: 'Felt explosive on bench press! Paused at the chest on last rep.',
    personalRecords: ['Barbell Flat Bench Press - 85kg x 7 (New 1RM: 102kg)'],
    durationMinutes: 52,
    exercises: [
      {
        id: 'we-p1-1',
        exerciseId: 'bench-press-bb',
        exerciseName: 'Barbell Flat Bench Press',
        category: 'Chest',
        sets: [
          { id: 's1', setNumber: 1, weight: 80, reps: 8, rpe: 7.5, isCompleted: true, type: 'normal', previousWeight: 77.5, previousReps: 8 },
          { id: 's2', setNumber: 2, weight: 82.5, reps: 8, rpe: 8, isCompleted: true, type: 'normal', previousWeight: 80, previousReps: 8 },
          { id: 's3', setNumber: 3, weight: 85, reps: 7, rpe: 8.5, isCompleted: true, type: 'normal', previousWeight: 82.5, previousReps: 7 },
          { id: 's4', setNumber: 4, weight: 85, reps: 6, rpe: 9, isCompleted: true, type: 'normal', previousWeight: 82.5, previousReps: 6 }
        ]
      },
      {
        id: 'we-p1-2',
        exerciseId: 'incline-db-press',
        exerciseName: 'Incline Dumbbell Press',
        category: 'Chest',
        sets: [
          { id: 's5', setNumber: 1, weight: 28, reps: 10, rpe: 8, isCompleted: true, type: 'normal', previousWeight: 26, previousReps: 10 },
          { id: 's6', setNumber: 2, weight: 28, reps: 9, rpe: 8.5, isCompleted: true, type: 'normal', previousWeight: 28, previousReps: 8 },
          { id: 's7', setNumber: 3, weight: 28, reps: 8, rpe: 9, isCompleted: true, type: 'normal', previousWeight: 28, previousReps: 8 }
        ]
      },
      {
        id: 'we-p1-3',
        exerciseId: 'db-lateral-raise',
        exerciseName: 'Dumbbell Lateral Raise',
        category: 'Shoulders',
        sets: [
          { id: 's8', setNumber: 1, weight: 12, reps: 15, rpe: 8.5, isCompleted: true, type: 'normal', previousWeight: 12, previousReps: 14 },
          { id: 's9', setNumber: 2, weight: 12, reps: 14, rpe: 9, isCompleted: true, type: 'normal', previousWeight: 12, previousReps: 13 },
          { id: 's10', setNumber: 3, weight: 12, reps: 13, rpe: 9.5, isCompleted: true, type: 'normal', previousWeight: 12, previousReps: 12 }
        ]
      },
      {
        id: 'we-p1-4',
        exerciseId: 'triceps-rope-pushdown',
        exerciseName: 'Triceps Rope Pushdown',
        category: 'Arms',
        sets: [
          { id: 's11', setNumber: 1, weight: 25, reps: 12, rpe: 8, isCompleted: true, type: 'normal', previousWeight: 22.5, previousReps: 12 },
          { id: 's12', setNumber: 2, weight: 25, reps: 12, rpe: 8.5, isCompleted: true, type: 'normal', previousWeight: 25, previousReps: 11 },
          { id: 's13', setNumber: 3, weight: 27.5, reps: 10, rpe: 9, isCompleted: true, type: 'normal', previousWeight: 25, previousReps: 10 },
          { id: 's14', setNumber: 4, weight: 20, reps: 15, rpe: 10, isCompleted: true, type: 'dropset' }
        ]
      }
    ]
  },
  {
    id: 'workout-prev-2',
    date: new Date(now - 4 * oneDayMs).toISOString(),
    startTime: now - 4 * oneDayMs,
    endTime: now - 4 * oneDayMs + 58 * 60 * 1000,
    title: 'Pull Day A - Lats & Biceps',
    routineId: 'ppl-6day',
    totalVolumeKg: 9120,
    totalSets: 13,
    rating: 4,
    notes: 'Heavy deadlifts moved smoothly. Kept grip double overhand.',
    personalRecords: ['Conventional Barbell Deadlift - 140kg x 5'],
    durationMinutes: 58,
    exercises: [
      {
        id: 'we-p2-1',
        exerciseId: 'deadlift-barbell',
        exerciseName: 'Conventional Barbell Deadlift',
        category: 'Back',
        sets: [
          { id: 's15', setNumber: 1, weight: 120, reps: 5, rpe: 7, isCompleted: true, type: 'warmup' },
          { id: 's16', setNumber: 2, weight: 135, reps: 5, rpe: 8, isCompleted: true, type: 'normal', previousWeight: 130, previousReps: 5 },
          { id: 's17', setNumber: 3, weight: 140, reps: 5, rpe: 8.5, isCompleted: true, type: 'normal', previousWeight: 135, previousReps: 5 }
        ]
      },
      {
        id: 'we-p2-2',
        exerciseId: 'lat-pulldown',
        exerciseName: 'Wide-Grip Lat Pulldown',
        category: 'Back',
        sets: [
          { id: 's18', setNumber: 1, weight: 65, reps: 10, rpe: 8, isCompleted: true, type: 'normal', previousWeight: 60, previousReps: 10 },
          { id: 's19', setNumber: 2, weight: 65, reps: 10, rpe: 8.5, isCompleted: true, type: 'normal', previousWeight: 65, previousReps: 9 },
          { id: 's20', setNumber: 3, weight: 70, reps: 8, rpe: 9, isCompleted: true, type: 'normal', previousWeight: 65, previousReps: 8 }
        ]
      },
      {
        id: 'we-p2-3',
        exerciseId: 'barbell-row',
        exerciseName: 'Bent Over Barbell Row',
        category: 'Back',
        sets: [
          { id: 's21', setNumber: 1, weight: 70, reps: 8, rpe: 8, isCompleted: true, type: 'normal', previousWeight: 67.5, previousReps: 8 },
          { id: 's22', setNumber: 2, weight: 70, reps: 8, rpe: 8.5, isCompleted: true, type: 'normal', previousWeight: 70, previousReps: 7 },
          { id: 's23', setNumber: 3, weight: 72.5, reps: 7, rpe: 9, isCompleted: true, type: 'normal', previousWeight: 70, previousReps: 7 }
        ]
      },
      {
        id: 'we-p2-4',
        exerciseId: 'barbell-bicep-curl',
        exerciseName: 'EZ-Bar Bicep Curl',
        category: 'Arms',
        sets: [
          { id: 's24', setNumber: 1, weight: 32.5, reps: 10, rpe: 8, isCompleted: true, type: 'normal', previousWeight: 30, previousReps: 10 },
          { id: 's25', setNumber: 2, weight: 32.5, reps: 10, rpe: 8.5, isCompleted: true, type: 'normal', previousWeight: 32.5, previousReps: 9 },
          { id: 's26', setNumber: 3, weight: 35, reps: 8, rpe: 9.5, isCompleted: true, type: 'normal', previousWeight: 32.5, previousReps: 8 }
        ]
      }
    ]
  },
  {
    id: 'workout-prev-1',
    date: new Date(now - 2 * oneDayMs).toISOString(),
    startTime: now - 2 * oneDayMs,
    endTime: now - 2 * oneDayMs + 62 * 60 * 1000,
    title: 'Legs Day A - Quads & Hamstrings',
    routineId: 'ppl-6day',
    totalVolumeKg: 10450,
    totalSets: 14,
    rating: 5,
    notes: 'Squats hit depth effortlessly. Ready to push for 112.5kg on squats next week!',
    personalRecords: ['Barbell Back Squat - 110kg x 7 reps'],
    durationMinutes: 62,
    exercises: [
      {
        id: 'we-p3-1',
        exerciseId: 'barbell-back-squat',
        exerciseName: 'Barbell Back Squat',
        category: 'Legs',
        sets: [
          { id: 's27', setNumber: 1, weight: 100, reps: 8, rpe: 7.5, isCompleted: true, type: 'normal', previousWeight: 97.5, previousReps: 8 },
          { id: 's28', setNumber: 2, weight: 105, reps: 8, rpe: 8, isCompleted: true, type: 'normal', previousWeight: 102.5, previousReps: 8 },
          { id: 's29', setNumber: 3, weight: 110, reps: 7, rpe: 8.5, isCompleted: true, type: 'normal', previousWeight: 105, previousReps: 7 },
          { id: 's30', setNumber: 4, weight: 110, reps: 6, rpe: 9, isCompleted: true, type: 'normal', previousWeight: 105, previousReps: 6 }
        ]
      },
      {
        id: 'we-p3-2',
        exerciseId: 'romanian-deadlift',
        exerciseName: 'Romanian Deadlift (RDL)',
        category: 'Legs',
        sets: [
          { id: 's31', setNumber: 1, weight: 90, reps: 10, rpe: 8, isCompleted: true, type: 'normal', previousWeight: 85, previousReps: 10 },
          { id: 's32', setNumber: 2, weight: 95, reps: 9, rpe: 8.5, isCompleted: true, type: 'normal', previousWeight: 90, previousReps: 9 },
          { id: 's33', setNumber: 3, weight: 95, reps: 8, rpe: 9, isCompleted: true, type: 'normal', previousWeight: 90, previousReps: 8 }
        ]
      },
      {
        id: 'we-p3-3',
        exerciseId: 'standing-calf-raise',
        exerciseName: 'Standing Calf Raise',
        category: 'Legs',
        sets: [
          { id: 's34', setNumber: 1, weight: 70, reps: 15, rpe: 8.5, isCompleted: true, type: 'normal', previousWeight: 65, previousReps: 15 },
          { id: 's35', setNumber: 2, weight: 75, reps: 14, rpe: 9, isCompleted: true, type: 'normal', previousWeight: 70, previousReps: 14 },
          { id: 's36', setNumber: 3, weight: 75, reps: 13, rpe: 9.5, isCompleted: true, type: 'normal', previousWeight: 75, previousReps: 12 }
        ]
      }
    ]
  }
];
