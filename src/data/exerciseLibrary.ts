import { Exercise } from '../types/training';

export const EXERCISE_LIBRARY: Exercise[] = [
  // Chest
  {
    id: 'bench-press-bb',
    name: 'Barbell Flat Bench Press',
    category: 'Chest',
    equipment: 'Barbell',
    targetRepRange: '6-8',
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Triceps', 'Anterior Deltoid'],
    instructions: 'Retract scapulae, touch mid-sternum, press powerfully with slight arc.'
  },
  {
    id: 'incline-db-press',
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    equipment: 'Dumbbell',
    targetRepRange: '8-10',
    primaryMuscle: 'Upper Chest (Clavicular)',
    secondaryMuscles: ['Front Deltoids', 'Triceps'],
    instructions: 'Set bench to 30 degrees, flare elbows 45 degrees, full stretch at bottom.'
  },
  {
    id: 'dips-chest',
    name: 'Chest Dips (Bodyweight/Weighted)',
    category: 'Chest',
    equipment: 'Bodyweight',
    targetRepRange: '8-12',
    primaryMuscle: 'Lower Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    instructions: 'Lean forward 30 degrees, flare elbows slightly, dip until 90-degree arm bend.'
  },
  {
    id: 'cable-fly-mid',
    name: 'Standing Cable Flye',
    category: 'Chest',
    equipment: 'Cable',
    targetRepRange: '10-15',
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Anterior Deltoid'],
    instructions: 'Maintain slight elbow bend, hug around a tree, squeeze hard at peak contraction.'
  },
  {
    id: 'machine-chest-press',
    name: 'Converging Machine Chest Press',
    category: 'Chest',
    equipment: 'Machine',
    targetRepRange: '8-12',
    primaryMuscle: 'Chest',
    instructions: 'Adjust seat so handles align with mid-chest. Control 2-sec eccentric.'
  },

  // Back
  {
    id: 'deadlift-barbell',
    name: 'Conventional Barbell Deadlift',
    category: 'Back',
    equipment: 'Barbell',
    targetRepRange: '5',
    primaryMuscle: 'Erector Spinae & Hamstrings',
    secondaryMuscles: ['Lats', 'Glutes', 'Traps', 'Forearms'],
    instructions: 'Bar over midfoot, brace core, pull slack out of bar, drive feet through floor.'
  },
  {
    id: 'barbell-row',
    name: 'Bent Over Barbell Row',
    category: 'Back',
    equipment: 'Barbell',
    targetRepRange: '6-8',
    primaryMuscle: 'Mid-Back / Rhomboids',
    secondaryMuscles: ['Lats', 'Biceps', 'Rear Deltoids'],
    instructions: 'Hinge hips to 45 degrees, pull barbell towards belly button with tucked elbows.'
  },
  {
    id: 'lat-pulldown',
    name: 'Wide-Grip Lat Pulldown',
    category: 'Back',
    equipment: 'Cable',
    targetRepRange: '8-12',
    primaryMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps', 'Teres Major'],
    instructions: 'Grip wider than shoulders, pull collarbone-high while depressing scapulae.'
  },
  {
    id: 'pull-ups',
    name: 'Overhand Pull-ups',
    category: 'Back',
    equipment: 'Bodyweight',
    targetRepRange: '6-10',
    primaryMuscle: 'Lats',
    secondaryMuscles: ['Biceps', 'Core'],
    instructions: 'Dead hang at bottom, drive elbows down to your pockets to clear chin.'
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row (Neutral Grip)',
    category: 'Back',
    equipment: 'Cable',
    targetRepRange: '10-12',
    primaryMuscle: 'Mid Back & Lats',
    instructions: 'Upright posture, stretch shoulders forward slightly, row and squeeze shoulder blades.'
  },

  // Legs
  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    category: 'Legs',
    equipment: 'Barbell',
    targetRepRange: '6-8',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Adductors', 'Core'],
    instructions: 'Rest bar on traps, brace 360, squat down below parallel, drive up explosively.'
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'Legs',
    equipment: 'Barbell',
    targetRepRange: '8-10',
    primaryMuscle: 'Hamstrings & Glutes',
    secondaryMuscles: ['Lower Back', 'Grip'],
    instructions: 'Soft knee bend, push hips far back until deep hamstring stretch, thrust forward.'
  },
  {
    id: 'leg-press-45',
    name: '45-Degree Leg Press',
    category: 'Legs',
    equipment: 'Machine',
    targetRepRange: '10-12',
    primaryMuscle: 'Quadriceps & Glutes',
    instructions: 'Feet shoulder-width on platform, lower until knees at 90 degrees without rounding tailbone.'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'Legs',
    equipment: 'Dumbbell',
    targetRepRange: '8-12',
    primaryMuscle: 'Quads & Glute Max',
    instructions: 'Rear foot elevated on bench, drop back knee straight down, keep front heel planted.'
  },
  {
    id: 'lying-leg-curl',
    name: 'Lying Hamstring Leg Curl',
    category: 'Legs',
    equipment: 'Machine',
    targetRepRange: '10-15',
    primaryMuscle: 'Hamstrings',
    instructions: 'Pad just below calves, curl heels toward glutes, 3-second negative.'
  },
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    category: 'Legs',
    equipment: 'Machine',
    targetRepRange: '12-15',
    primaryMuscle: 'Gastrocnemius',
    instructions: 'Pause 2 seconds at deep stretch, rise onto big toes, squeeze 1 second.'
  },

  // Shoulders
  {
    id: 'overhead-press-bb',
    name: 'Standing Barbell Overhead Press',
    category: 'Shoulders',
    equipment: 'Barbell',
    targetRepRange: '5-8',
    primaryMuscle: 'Anterior & Lateral Deltoid',
    secondaryMuscles: ['Triceps', 'Upper Traps', 'Core'],
    instructions: 'Squeeze glutes, press vertically clearing face, lock out overhead with head through.'
  },
  {
    id: 'db-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'Shoulders',
    equipment: 'Dumbbell',
    targetRepRange: '12-15',
    primaryMuscle: 'Lateral Deltoid',
    instructions: 'Slight torso forward lean, lead with elbows, raise to parallel, control eccentric.'
  },
  {
    id: 'cable-face-pull',
    name: 'Rope Cable Face Pull',
    category: 'Shoulders',
    equipment: 'Cable',
    targetRepRange: '12-15',
    primaryMuscle: 'Rear Deltoids & Rotator Cuff',
    instructions: 'Pull rope toward eye level, rotate knuckles back into a double bicep pose.'
  },

  // Arms
  {
    id: 'barbell-bicep-curl',
    name: 'EZ-Bar Bicep Curl',
    category: 'Arms',
    equipment: 'Barbell',
    targetRepRange: '8-12',
    primaryMuscle: 'Biceps Brachii',
    instructions: 'Keep elbows pinned to ribcage, squeeze biceps at top without swinging hips.'
  },
  {
    id: 'incline-db-curl',
    name: 'Incline Dumbbell Curl',
    category: 'Arms',
    equipment: 'Dumbbell',
    targetRepRange: '10-12',
    primaryMuscle: 'Biceps Long Head',
    instructions: 'Sit on 45-degree incline, let arms hang completely vertical for maximum stretch.'
  },
  {
    id: 'triceps-rope-pushdown',
    name: 'Triceps Rope Pushdown',
    category: 'Arms',
    equipment: 'Cable',
    targetRepRange: '10-15',
    primaryMuscle: 'Triceps Lateral & Medial Heads',
    instructions: 'Pin elbows to flanks, push rope downward and flare ends outward at bottom.'
  },
  {
    id: 'skull-crushers',
    name: 'EZ-Bar Skull Crushers (Lying Triceps Ext)',
    category: 'Arms',
    equipment: 'Barbell',
    targetRepRange: '8-12',
    primaryMuscle: 'Triceps Long Head',
    instructions: 'Lower bar toward forehead/behind crown, hinge purely at elbow joint.'
  },

  // Core
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg / Knee Raise',
    category: 'Core',
    equipment: 'Bodyweight',
    targetRepRange: '10-15',
    primaryMuscle: 'Rectus Abdominis & Hip Flexors',
    instructions: 'Avoid swinging momentum, tilt pelvis upward to engage lower abdominals.'
  },
  {
    id: 'cable-woodchopper',
    name: 'High-to-Low Cable Woodchopper',
    category: 'Core',
    equipment: 'Cable',
    targetRepRange: '12-15',
    primaryMuscle: 'Obliques',
    instructions: 'Rotate through torso while keeping hips stable, pivot back foot slightly.'
  }
];
