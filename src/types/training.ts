export type MuscleGroup = 
  | 'Chest' 
  | 'Back' 
  | 'Legs' 
  | 'Shoulders' 
  | 'Arms' 
  | 'Core' 
  | 'Cardio' 
  | 'Full Body';

export type Equipment = 
  | 'Barbell' 
  | 'Dumbbell' 
  | 'Machine' 
  | 'Cable' 
  | 'Bodyweight' 
  | 'Kettlebell'
  | 'Smith Machine';

export type SetType = 'normal' | 'warmup' | 'dropset' | 'failure';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  equipment: Equipment;
  targetRepRange: string;
  primaryMuscle: string;
  secondaryMuscles?: string[];
  instructions?: string;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
  isCompleted: boolean;
  type: SetType;
  previousWeight?: number;
  previousReps?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  category: MuscleGroup;
  sets: WorkoutSet[];
  notes?: string;
  targetRestSeconds?: number;
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO date string
  startTime: number;
  endTime?: number;
  title: string;
  routineId?: string;
  exercises: WorkoutExercise[];
  totalVolumeKg: number;
  totalSets: number;
  notes?: string;
  rating?: number; // 1-5
  personalRecords?: string[];
  durationMinutes?: number;
}

export interface ExerciseTemplate {
  exerciseId: string;
  exerciseName: string;
  category: MuscleGroup;
  sets: number;
  targetReps: string;
  targetRpe?: number;
  restSeconds?: number;
}

export interface ProgramDay {
  dayId: string;
  title: string;
  focus: string;
  exerciseTemplates: ExerciseTemplate[];
}

export interface Program {
  id: string;
  name: string;
  splitType: string;
  description: string;
  frequencyDays: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  targetGoal: 'Hypertrophy' | 'Strength' | 'Powerbuilding' | 'Athletic' | 'Fat Loss';
  days: ProgramDay[];
  progressionModel: string;
  isCustom?: boolean;
}

export interface OverloadRecommendation {
  exerciseName: string;
  currentWeight: number;
  currentReps: number;
  recommendedWeight: number;
  recommendedReps: number;
  targetRpe: number;
  method: string;
  coachingAdvice: string;
  deloadRecommended: boolean;
  fatigueWarning: boolean;
  formCues: string[];
}

export interface UserProfile {
  name: string;
  weightUnit: 'kg' | 'lbs';
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  activeProgramId?: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  restTimerAutoStart: boolean;
  defaultRestSeconds: number;
}
