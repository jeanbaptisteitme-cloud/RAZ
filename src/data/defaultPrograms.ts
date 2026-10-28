import { Program } from '../types/training';

export const DEFAULT_PROGRAMS: Program[] = [
  {
    id: 'ppl-6day',
    name: 'Push / Pull / Legs (PPL)',
    splitType: 'PPL 6-Day',
    description: 'The golden standard bodybuilding split for intermediate to advanced lifters seeking maximal hypertrophy and symmetrical muscle growth.',
    frequencyDays: 6,
    level: 'Intermediate',
    targetGoal: 'Hypertrophy',
    progressionModel: 'Double Progression: Hit top rep bracket across all sets, then increase weight by 2.5kg the following week.',
    days: [
      {
        dayId: 'push-a',
        title: 'Push Day A (Chest & Triceps Focus)',
        focus: 'Heavy Horizontal Press & Anterior Delts',
        exerciseTemplates: [
          { exerciseId: 'bench-press-bb', exerciseName: 'Barbell Flat Bench Press', category: 'Chest', sets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 150 },
          { exerciseId: 'incline-db-press', exerciseName: 'Incline Dumbbell Press', category: 'Chest', sets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'dips-chest', exerciseName: 'Chest Dips (Bodyweight/Weighted)', category: 'Chest', sets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'db-lateral-raise', exerciseName: 'Dumbbell Lateral Raise', category: 'Shoulders', sets: 4, targetReps: '12-15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'triceps-rope-pushdown', exerciseName: 'Triceps Rope Pushdown', category: 'Arms', sets: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 60 }
        ]
      },
      {
        dayId: 'pull-a',
        title: 'Pull Day A (Back Width & Biceps)',
        focus: 'Vertical Pulling, Heavy Rows & Rear Delts',
        exerciseTemplates: [
          { exerciseId: 'deadlift-barbell', exerciseName: 'Conventional Barbell Deadlift', category: 'Back', sets: 3, targetReps: '5', targetRpe: 8, restSeconds: 180 },
          { exerciseId: 'lat-pulldown', exerciseName: 'Wide-Grip Lat Pulldown', category: 'Back', sets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'barbell-row', exerciseName: 'Bent Over Barbell Row', category: 'Back', sets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'cable-face-pull', exerciseName: 'Rope Cable Face Pull', category: 'Shoulders', sets: 3, targetReps: '12-15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'barbell-bicep-curl', exerciseName: 'EZ-Bar Bicep Curl', category: 'Arms', sets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 75 }
        ]
      },
      {
        dayId: 'legs-a',
        title: 'Legs Day A (Quad Domination)',
        focus: 'Squat Heavy, Quads & Calves',
        exerciseTemplates: [
          { exerciseId: 'barbell-back-squat', exerciseName: 'Barbell Back Squat', category: 'Legs', sets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 180 },
          { exerciseId: 'romanian-deadlift', exerciseName: 'Romanian Deadlift (RDL)', category: 'Legs', sets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'leg-press-45', exerciseName: '45-Degree Leg Press', category: 'Legs', sets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'standing-calf-raise', exerciseName: 'Standing Calf Raise', category: 'Legs', sets: 4, targetReps: '12-15', targetRpe: 9, restSeconds: 60 }
        ]
      }
    ]
  },
  {
    id: 'upper-lower-4day',
    name: 'Upper / Lower Athletic Power',
    splitType: 'Upper / Lower 4-Day',
    description: 'The optimal balance between recovery, intensity, and muscle protein synthesis frequency. High efficiency for athletes and busy lifters.',
    frequencyDays: 4,
    level: 'Intermediate',
    targetGoal: 'Powerbuilding',
    progressionModel: 'Linear Periodization: 4-week wave loading (Week 1: 8 reps, Week 2: 7 reps +2.5kg, Week 3: 6 reps +2.5kg, Week 4: Deload).',
    days: [
      {
        dayId: 'ul-upper-1',
        title: 'Upper Body Power (Day 1)',
        focus: 'Heavy Horizontal Press & Primary Back Compound',
        exerciseTemplates: [
          { exerciseId: 'bench-press-bb', exerciseName: 'Barbell Flat Bench Press', category: 'Chest', sets: 4, targetReps: '5-6', targetRpe: 8, restSeconds: 150 },
          { exerciseId: 'barbell-row', exerciseName: 'Bent Over Barbell Row', category: 'Back', sets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'overhead-press-bb', exerciseName: 'Standing Barbell Overhead Press', category: 'Shoulders', sets: 3, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'pull-ups', exerciseName: 'Overhand Pull-ups', category: 'Back', sets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'skull-crushers', exerciseName: 'EZ-Bar Skull Crushers (Lying Triceps Ext)', category: 'Arms', sets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 75 }
        ]
      },
      {
        dayId: 'ul-lower-1',
        title: 'Lower Body Quad & Core (Day 2)',
        focus: 'Squat Heavy & Anterior Leg Chain',
        exerciseTemplates: [
          { exerciseId: 'barbell-back-squat', exerciseName: 'Barbell Back Squat', category: 'Legs', sets: 4, targetReps: '5-6', targetRpe: 8, restSeconds: 180 },
          { exerciseId: 'romanian-deadlift', exerciseName: 'Romanian Deadlift (RDL)', category: 'Legs', sets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'bulgarian-split-squat', exerciseName: 'Bulgarian Split Squat', category: 'Legs', sets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'hanging-leg-raise', exerciseName: 'Hanging Leg / Knee Raise', category: 'Core', sets: 3, targetReps: '12-15', targetRpe: 8, restSeconds: 60 }
        ]
      },
      {
        dayId: 'ul-upper-2',
        title: 'Upper Body Hypertrophy & Volume (Day 3)',
        focus: 'Incline Chest, Lats & Arm Pump',
        exerciseTemplates: [
          { exerciseId: 'incline-db-press', exerciseName: 'Incline Dumbbell Press', category: 'Chest', sets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'lat-pulldown', exerciseName: 'Wide-Grip Lat Pulldown', category: 'Back', sets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'cable-fly-mid', exerciseName: 'Standing Cable Flye', category: 'Chest', sets: 3, targetReps: '12-15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'db-lateral-raise', exerciseName: 'Dumbbell Lateral Raise', category: 'Shoulders', sets: 4, targetReps: '12-15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'incline-db-curl', exerciseName: 'Incline Dumbbell Curl', category: 'Arms', sets: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 60 }
        ]
      },
      {
        dayId: 'ul-lower-2',
        title: 'Lower Body Posterior & Deadlift (Day 4)',
        focus: 'Deadlift Power, Hamstrings & Calves',
        exerciseTemplates: [
          { exerciseId: 'deadlift-barbell', exerciseName: 'Conventional Barbell Deadlift', category: 'Back', sets: 3, targetReps: '5', targetRpe: 8.5, restSeconds: 180 },
          { exerciseId: 'leg-press-45', exerciseName: '45-Degree Leg Press', category: 'Legs', sets: 4, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'lying-leg-curl', exerciseName: 'Lying Hamstring Leg Curl', category: 'Legs', sets: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'standing-calf-raise', exerciseName: 'Standing Calf Raise', category: 'Legs', sets: 4, targetReps: '15', targetRpe: 9, restSeconds: 60 }
        ]
      }
    ]
  },
  {
    id: 'full-body-3day',
    name: 'Full Body 3-Day Foundation',
    splitType: 'Full Body 3x',
    description: 'High frequency compound training for maximum strength, time efficiency, and steady neuromuscular adaptations.',
    frequencyDays: 3,
    level: 'Beginner',
    targetGoal: 'Strength',
    progressionModel: 'Linear Progression: Add 2.5kg to upper body lifts every 2 weeks, add 5kg to squat and deadlift each month.',
    days: [
      {
        dayId: 'fb-day1',
        title: 'Full Body Workout A (Squat & Press)',
        focus: 'Squats, Bench & Vertical Pull',
        exerciseTemplates: [
          { exerciseId: 'barbell-back-squat', exerciseName: 'Barbell Back Squat', category: 'Legs', sets: 3, targetReps: '6-8', targetRpe: 7.5, restSeconds: 150 },
          { exerciseId: 'bench-press-bb', exerciseName: 'Barbell Flat Bench Press', category: 'Chest', sets: 3, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'lat-pulldown', exerciseName: 'Wide-Grip Lat Pulldown', category: 'Back', sets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'db-lateral-raise', exerciseName: 'Dumbbell Lateral Raise', category: 'Shoulders', sets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        dayId: 'fb-day2',
        title: 'Full Body Workout B (Hinge & Overhead)',
        focus: 'Deadlifts, Overhead Press & Horizontal Row',
        exerciseTemplates: [
          { exerciseId: 'deadlift-barbell', exerciseName: 'Conventional Barbell Deadlift', category: 'Back', sets: 3, targetReps: '5', targetRpe: 8, restSeconds: 180 },
          { exerciseId: 'overhead-press-bb', exerciseName: 'Standing Barbell Overhead Press', category: 'Shoulders', sets: 3, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'barbell-row', exerciseName: 'Bent Over Barbell Row', category: 'Back', sets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'hanging-leg-raise', exerciseName: 'Hanging Leg / Knee Raise', category: 'Core', sets: 3, targetReps: '12', targetRpe: 8, restSeconds: 60 }
        ]
      },
      {
        dayId: 'fb-day3',
        title: 'Full Body Workout C (Hypertrophy Circuit)',
        focus: 'Incline Press, Leg Press & Arm Finisher',
        exerciseTemplates: [
          { exerciseId: 'leg-press-45', exerciseName: '45-Degree Leg Press', category: 'Legs', sets: 3, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'incline-db-press', exerciseName: 'Incline Dumbbell Press', category: 'Chest', sets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'pull-ups', exerciseName: 'Overhand Pull-ups', category: 'Back', sets: 3, targetReps: '6-8', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'barbell-bicep-curl', exerciseName: 'EZ-Bar Bicep Curl', category: 'Arms', sets: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 60 }
        ]
      }
    ]
  },
  {
    id: 'arnold-split-6day',
    name: 'Arnold Golden Era Split',
    splitType: 'Chest/Back, Shoulders/Arms, Legs',
    description: 'Antagonist superset principles with legendary upper body pump volume. Great for lifters wanting specialized chest, back, and arm thickness.',
    frequencyDays: 6,
    level: 'Advanced',
    targetGoal: 'Hypertrophy',
    progressionModel: 'Volume Density: Increase total weekly sets by 1 per muscle every 3 weeks, then execute a 1-week reload.',
    days: [
      {
        dayId: 'arnold-cb',
        title: 'Chest & Back (Antagonist Supersets)',
        focus: 'Pecs & Lat Expansion',
        exerciseTemplates: [
          { exerciseId: 'bench-press-bb', exerciseName: 'Barbell Flat Bench Press', category: 'Chest', sets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'barbell-row', exerciseName: 'Bent Over Barbell Row', category: 'Back', sets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'incline-db-press', exerciseName: 'Incline Dumbbell Press', category: 'Chest', sets: 4, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'lat-pulldown', exerciseName: 'Wide-Grip Lat Pulldown', category: 'Back', sets: 4, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'cable-fly-mid', exerciseName: 'Standing Cable Flye', category: 'Chest', sets: 3, targetReps: '12-15', targetRpe: 9, restSeconds: 60 }
        ]
      },
      {
        dayId: 'arnold-sa',
        title: 'Shoulders & Arms Gun Show',
        focus: 'Delts, Biceps & Triceps Bloodflow',
        exerciseTemplates: [
          { exerciseId: 'overhead-press-bb', exerciseName: 'Standing Barbell Overhead Press', category: 'Shoulders', sets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'db-lateral-raise', exerciseName: 'Dumbbell Lateral Raise', category: 'Shoulders', sets: 4, targetReps: '12-15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'barbell-bicep-curl', exerciseName: 'EZ-Bar Bicep Curl', category: 'Arms', sets: 4, targetReps: '8-10', targetRpe: 8.5, restSeconds: 75 },
          { exerciseId: 'skull-crushers', exerciseName: 'EZ-Bar Skull Crushers (Lying Triceps Ext)', category: 'Arms', sets: 4, targetReps: '8-10', targetRpe: 8.5, restSeconds: 75 },
          { exerciseId: 'cable-face-pull', exerciseName: 'Rope Cable Face Pull', category: 'Shoulders', sets: 3, targetReps: '12-15', targetRpe: 9, restSeconds: 60 }
        ]
      },
      {
        dayId: 'arnold-legs',
        title: 'Legs & Core Destruction',
        focus: 'Quads, Hamstrings & Calves',
        exerciseTemplates: [
          { exerciseId: 'barbell-back-squat', exerciseName: 'Barbell Back Squat', category: 'Legs', sets: 4, targetReps: '8-10', targetRpe: 8.5, restSeconds: 150 },
          { exerciseId: 'romanian-deadlift', exerciseName: 'Romanian Deadlift (RDL)', category: 'Legs', sets: 3, targetReps: '10-12', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'leg-press-45', exerciseName: '45-Degree Leg Press', category: 'Legs', sets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'standing-calf-raise', exerciseName: 'Standing Calf Raise', category: 'Legs', sets: 4, targetReps: '15-20', targetRpe: 9, restSeconds: 60 }
        ]
      }
    ]
  }
];
