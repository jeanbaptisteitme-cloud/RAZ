import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Gemini client server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Route: Progressive Overload Advisor
app.post('/api/ai/progressive-overload', async (req: Request, res: Response) => {
  try {
    const { exerciseName, currentSession, history, userGoal, trainingLevel } = req.body;

    if (!exerciseName) {
      return res.status(400).json({ error: 'Exercise name is required' });
    }

    if (!ai) {
      // Deterministic scientific fallback if API key is not present
      const lastSession = history && history.length > 0 ? history[history.length - 1] : null;
      let targetWeight = 0;
      let targetReps = 0;
      let message = 'Double progression: Increase weight by 2.5% once you reach target reps with RPE <= 8.';

      if (currentSession?.sets?.length) {
        const topSet = currentSession.sets.reduce((max: any, s: any) => (s.weight > (max?.weight || 0) ? s : max), currentSession.sets[0]);
        targetWeight = Math.round((topSet.weight * 1.025) * 2) / 2;
        targetReps = topSet.reps;
        message = `Based on your recent performance of ${topSet.weight}kg x ${topSet.reps} reps, target ${targetWeight}kg for ${Math.max(6, targetReps - 1)} reps or try 1 extra rep at current weight!`;
      }

      return res.json({
        recommendedWeight: targetWeight,
        recommendedReps: targetReps,
        targetRpe: 8,
        method: 'Weight Micro-Load (+2.5%)',
        coachingAdvice: message,
        deloadRecommended: false,
        fatigueWarning: false,
        formCues: ['Maintain 2-second controlled eccentric tempo', 'Brace core firmly before each repetition'],
      });
    }

    const prompt = `You are an elite strength & conditioning coach and biomechanics specialist.
Analyze this athlete's workout performance and provide precise, actionable Progressive Overload advice for their next training session.

Exercise: ${exerciseName}
User Goal: ${userGoal || 'Hypertrophy & Strength'}
Experience Level: ${trainingLevel || 'Intermediate'}
Current Session Logged: ${JSON.stringify(currentSession || {})}
Historical Sessions: ${JSON.stringify(history || [])}

Apply the scientific principles of progressive overload:
1. Micro-loading (load progression +1.25kg to +2.5kg if rep target hit with RPE <= 8)
2. Rep progression (if weight held constant, push +1-2 reps toward rep ceiling)
3. Set/volume density progression
4. Deload detection: if user failed rep targets or reported RPE 9.5-10 across 3 consecutive sessions, recommend a deload (-10% weight, -30% sets)

Respond ONLY with valid JSON conforming to this structure:
{
  "recommendedWeight": number,
  "recommendedReps": number,
  "targetRpe": number,
  "method": string (e.g. "Weight Micro-Load (+2.5kg)", "Rep Floor Expansion (+1-2 Reps)", "Volume Density (+1 Set)", "Technical Mastery"),
  "coachingAdvice": string (2-3 concise punchy sentences explaining the exact math and strategy for their next session),
  "deloadRecommended": boolean,
  "fatigueWarning": boolean,
  "formCues": string[] (2 practical cues)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating progressive overload advice:', error);
    return res.status(500).json({
      error: 'Failed to generate AI advice',
      coachingAdvice: 'Progressive Overload Rule: If you completed all prescribed sets with solid form, increase load by 2.5% or aim for 1 more rep next session.',
      recommendedWeight: 0,
      recommendedReps: 0,
    });
  }
});

// API Route: Training Program Recommender & Generator
app.post('/api/ai/recommend-program', async (req: Request, res: Response) => {
  try {
    const { experience, daysPerWeek, primaryGoal, equipment, sessionDuration, focusAreas } = req.body;

    if (!ai) {
      // Deterministic fallback templates
      return res.json({
        programName: `${daysPerWeek || 4}-Day Optimal Hypertrophy`,
        splitType: daysPerWeek >= 5 ? 'Push / Pull / Legs' : daysPerWeek >= 4 ? 'Upper / Lower' : 'Full Body 3x',
        overview: 'A balanced, time-tested periodized split tailored to your frequency and goals.',
        weeklySchedule: [
          { day: 'Day 1', focus: 'Upper Body A (Power & Heavy Compound)', exercises: ['Barbell Bench Press (4x6-8)', 'Chest Supported Row (3x8-10)', 'Overhead Dumbbell Press (3x8-10)', 'Biceps Cable Curl (3x10-12)'] },
          { day: 'Day 2', focus: 'Lower Body A (Quad & Squat Emphasis)', exercises: ['Barbell Back Squat (4x6-8)', 'Romanian Deadlift (3x8-10)', 'Leg Press (3x10-12)', 'Standing Calf Raise (4x12-15)'] },
          { day: 'Day 3', focus: 'Active Recovery & Core Mobility', exercises: ['Light cardio / walks', 'Hanging Leg Raises (3x12)'] },
          { day: 'Day 4', focus: 'Upper Body B (Hypertrophy & Pump)', exercises: ['Incline Dumbbell Press (3x8-10)', 'Lat Pulldown (3x10-12)', 'Lateral Raises (4x12-15)', 'Triceps Rope Pushdown (3x12-15)'] },
          { day: 'Day 5', focus: 'Lower Body B (Hamstring & Posterior Chain)', exercises: ['Conventional Deadlift (3x5)', 'Bulgarian Split Squats (3x10/leg)', 'Hamstring Leg Curls (3x10-12)', 'Seated Calf Raise (3x15)'] }
        ],
        overloadProtocol: 'Double progression: stay at same weight until hitting max rep bracket on all sets, then increase load 2.5kg next week.',
        recoveryTips: ['Aim for 7-9 hours sleep', 'Target 1.6 - 2.2g protein per kg of bodyweight']
      });
    }

    const prompt = `You are a world-class strength coach designing a customized training program.
User Profile:
- Experience: ${experience || 'Intermediate'}
- Available Days/Week: ${daysPerWeek || 4}
- Primary Goal: ${primaryGoal || 'Hypertrophy'}
- Equipment: ${equipment || 'Full Commercial Gym'}
- Session Duration: ${sessionDuration || '60 mins'}
- Focus Areas / Weak Points: ${focusAreas || 'General balanced physique & strength'}

Create a complete, realistic, science-backed workout program.
Output ONLY valid JSON with this exact schema:
{
  "programName": string,
  "splitType": string,
  "difficulty": string ("Beginner" | "Intermediate" | "Advanced"),
  "overview": string (short overview of why this matches their schedule and physiology),
  "weeklySchedule": [
    {
      "day": string (e.g. "Day 1 - Push Heavy"),
      "focus": string,
      "exercises": string[] (4-6 specific exercises with prescribed sets and rep ranges, e.g. "Barbell Bench Press - 4 sets x 6-8 reps")
    }
  ],
  "overloadProtocol": string (concrete progressive overload method for this program),
  "recoveryTips": string[] (2-3 crucial tips)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating program recommendation:', error);
    return res.status(500).json({ error: 'Failed to generate program recommendations' });
  }
});

// API Route: AI Training Coach Chat / Quick Advice
app.post('/api/ai/ask-coach', async (req: Request, res: Response) => {
  try {
    const { question, currentContext } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!ai) {
      return res.json({
        answer: 'Progressive overload requires tracking volume (Sets x Reps x Weight). If you can do 3 sets of 10 reps with good form, add 2.5kg next workout!'
      });
    }

    const prompt = `You are ApeX Coach, an encouraging, deeply knowledgeable strength & hypertrophy coach built into a training logger APK.
Answer the athlete's question concisely (under 120 words), providing practical gym tips, form cues, or progressive overload principles.
User Question: "${question}"
Current Context: ${JSON.stringify(currentContext || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Error answering coach question:', error);
    return res.status(500).json({
      answer: 'To ensure progressive overload, log every set carefully, focus on full range of motion, and incrementally increase weight or reps every 1-2 weeks.'
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ApeX Training Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
