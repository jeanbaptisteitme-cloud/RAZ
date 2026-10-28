import React, { useState } from 'react';
import { 
  Dumbbell, 
  Sparkles, 
  Calendar, 
  CheckCircle, 
  Flame, 
  ChevronRight, 
  BookOpen, 
  Plus, 
  RotateCcw,
  Zap,
  Target,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Program, ProgramDay } from '../types/training';
import { DEFAULT_PROGRAMS } from '../data/defaultPrograms';

interface Props {
  programs: Program[];
  activeProgramId: string;
  onSelectActiveProgram: (programId: string) => void;
  onStartWorkoutFromDay: (program: Program, day: ProgramDay) => void;
  onAddCustomProgram: (program: Program) => void;
}

export const ProgramsTab: React.FC<Props> = ({
  programs,
  activeProgramId,
  onSelectActiveProgram,
  onStartWorkoutFromDay,
  onAddCustomProgram,
}) => {
  const [selectedProgramModal, setSelectedProgramModal] = useState<Program | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState<boolean>(false);

  // AI Generator form state
  const [experience, setExperience] = useState('Intermediate');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [primaryGoal, setPrimaryGoal] = useState('Hypertrophy');
  const [equipment, setEquipment] = useState('Full Commercial Gym');
  const [sessionDuration, setSessionDuration] = useState('60 mins');
  const [focusAreas, setFocusAreas] = useState('Chest & Back width');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiProgramResult, setAiProgramResult] = useState<any | null>(null);

  const activeProgram = programs.find((p) => p.id === activeProgramId) || programs[0];

  const handleGenerateAIProgram = async () => {
    setIsGenerating(true);
    setAiProgramResult(null);

    try {
      const res = await fetch('/api/ai/recommend-program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience,
          daysPerWeek,
          primaryGoal,
          equipment,
          sessionDuration,
          focusAreas,
        }),
      });

      const data = await res.json();
      setAiProgramResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAIProgramToLibrary = () => {
    if (!aiProgramResult) return;

    const days: ProgramDay[] = (aiProgramResult.weeklySchedule || []).map((s: any, idx: number) => ({
      dayId: `ai-day-${idx + 1}`,
      title: s.day || `Day ${idx + 1}`,
      focus: s.focus || 'Target Hypertrophy',
      exerciseTemplates: (s.exercises || []).map((exStr: string, exIdx: number) => {
        const parts = exStr.split('-');
        const name = parts[0]?.trim() || exStr;
        return {
          exerciseId: `ai-ex-${idx}-${exIdx}`,
          exerciseName: name,
          category: 'Full Body' as const,
          sets: 3,
          targetReps: '8-12',
          targetRpe: 8,
          restSeconds: 90,
        };
      }),
    }));

    const newProgram: Program = {
      id: `ai-program-${Date.now()}`,
      name: aiProgramResult.programName || 'AI Custom Hybrid Program',
      splitType: aiProgramResult.splitType || `${daysPerWeek}-Day Tailored Split`,
      description: aiProgramResult.overview || 'Custom AI program engineered for your specific frequency and goal.',
      frequencyDays: daysPerWeek,
      level: (aiProgramResult.difficulty as any) || (experience as any),
      targetGoal: (primaryGoal as any) || 'Hypertrophy',
      progressionModel: aiProgramResult.overloadProtocol || 'Double progression with weekly overload.',
      days,
      isCustom: true,
    };

    onAddCustomProgram(newProgram);
    onSelectActiveProgram(newProgram.id);
    setShowAIGenerator(false);
    setAiProgramResult(null);
  };

  return (
    <div className="space-y-6 pb-24 text-left">
      {/* Header & AI Suggestion Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Training Programs</span>
            <span className="text-xs bg-lime-500/20 text-lime-400 font-mono px-2 py-0.5 rounded-full border border-lime-500/30">
              {programs.length} Routines
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Switch your split or generate a personalized routine with progressive overload schemes.
          </p>
        </div>

        <button
          onClick={() => setShowAIGenerator(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-black px-4 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(163,230,53,0.3)] transition cursor-pointer active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Program Advisor</span>
        </button>
      </div>

      {/* Active Program Card */}
      {activeProgram && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-lime-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-lime-400 text-black uppercase tracking-wider">
                  Active Program
                </span>
                <span className="text-xs text-slate-400">{activeProgram.splitType}</span>
              </div>
              <h3 className="text-xl font-black text-white">{activeProgram.name}</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-lime-400 font-mono">
                {activeProgram.frequencyDays}
              </span>
              <span className="text-[11px] text-slate-400 block -mt-1">days / week</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            {activeProgram.description}
          </p>

          <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800/80 mb-4 text-xs">
            <div className="text-[11px] font-bold text-lime-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Built-In Overload Protocol:
            </div>
            <p className="text-slate-300">{activeProgram.progressionModel}</p>
          </div>

          {/* Program Days list */}
          <div className="space-y-2 mb-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Routine Days ({activeProgram.days.length} workouts):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeProgram.days.map((day, idx) => (
                <div
                  key={day.dayId}
                  className="bg-slate-800/50 hover:bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 transition flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-lime-300 transition">
                      {day.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {day.focus} &bull; {day.exerciseTemplates.length} Exercises
                    </p>
                  </div>
                  <button
                    onClick={() => onStartWorkoutFromDay(activeProgram, day)}
                    className="bg-lime-400/10 hover:bg-lime-400 text-lime-400 hover:text-black p-2 rounded-xl border border-lime-500/20 transition cursor-pointer text-xs font-bold shrink-0"
                    title="Start workout now"
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Program Catalog / Switcher */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-lime-400" />
          Explore & Switch Programs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((prog) => {
            const isActive = prog.id === activeProgramId;
            return (
              <div
                key={prog.id}
                className={`rounded-3xl p-5 border transition text-left flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 border-lime-500/60 shadow-[0_0_15px_rgba(163,230,53,0.1)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                      {prog.level} &bull; {prog.targetGoal}
                    </span>
                    <span className="text-xs font-mono font-bold text-lime-400">
                      {prog.frequencyDays} Days/Wk
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-white mb-1">{prog.name}</h4>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{prog.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProgramModal(prog)}
                    className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 transition"
                  >
                    <span>View {prog.days.length} Days</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {isActive ? (
                    <span className="flex items-center gap-1.5 text-xs text-lime-400 font-bold px-3 py-1.5 bg-lime-500/10 rounded-xl border border-lime-500/30">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectActiveProgram(prog.id)}
                      className="text-xs font-bold bg-slate-800 hover:bg-lime-400 hover:text-black text-white px-3 py-1.5 rounded-xl border border-slate-700 hover:border-lime-400 transition cursor-pointer"
                    >
                      Set Active
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Program Detail Modal */}
      {selectedProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-left relative">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-lime-400 uppercase">
                  {selectedProgramModal.splitType} &bull; {selectedProgramModal.level}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedProgramModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProgramModal(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4">{selectedProgramModal.description}</p>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 mb-5 text-xs">
              <strong className="text-lime-400 block mb-1">Progression & Overload Strategy:</strong>
              <p className="text-slate-300">{selectedProgramModal.progressionModel}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Full Weekly Split:
              </div>
              {selectedProgramModal.days.map((d, i) => (
                <div key={d.dayId} className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-xs text-white">{d.title}</h5>
                    <button
                      onClick={() => {
                        onStartWorkoutFromDay(selectedProgramModal, d);
                        setSelectedProgramModal(null);
                      }}
                      className="text-[11px] font-bold bg-lime-400 hover:bg-lime-300 text-black px-2.5 py-1 rounded-lg transition"
                    >
                      Start Routine
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">{d.focus}</p>
                  <div className="space-y-1">
                    {d.exerciseTemplates.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-slate-300 pl-2 border-l border-slate-700">
                        <span>{t.exerciseName}</span>
                        <span className="font-mono text-slate-400">{t.sets} sets &times; {t.targetReps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onSelectActiveProgram(selectedProgramModal.id);
                  setSelectedProgramModal(null);
                }}
                className="flex-1 bg-lime-400 hover:bg-lime-300 text-black py-3 rounded-2xl font-bold text-xs transition"
              >
                Set As Active Program
              </button>
              <button
                onClick={() => setSelectedProgramModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-2xl font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Program Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-lime-500/20 text-lime-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Program Generator</h3>
                  <p className="text-xs text-slate-400">Personalized to your schedule, gear, and overload goals</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIGenerator(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl"
              >
                &times;
              </button>
            </div>

            {!aiProgramResult ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Experience Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setExperience(lvl)}
                        className={`py-2 rounded-xl text-xs font-bold transition border ${
                          experience === lvl
                            ? 'bg-lime-400 text-black border-lime-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Days Available per Week: <span className="text-lime-400 font-bold">{daysPerWeek} Days</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                    className="w-full accent-lime-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>2 (Express)</span>
                    <span>3 (Full Body)</span>
                    <span>4 (Upper/Lower)</span>
                    <span>5 (Hybrid)</span>
                    <span>6 (PPL/Arnold)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Primary Goal</label>
                    <select
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-lime-400"
                    >
                      <option value="Hypertrophy">Muscle Hypertrophy (Size)</option>
                      <option value="Max Strength">Max Strength / Powerlifting</option>
                      <option value="Powerbuilding">Powerbuilding (Hybrid)</option>
                      <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                      <option value="Athletic Performance">Athletic Performance</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Equipment</label>
                    <select
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-lime-400"
                    >
                      <option value="Full Commercial Gym">Full Commercial Gym</option>
                      <option value="Barbell & Rack Home Gym">Barbell & Squat Rack</option>
                      <option value="Dumbbells Only">Dumbbells & Bench</option>
                      <option value="Calisthenics & Pullup Bar">Calisthenics & Pullup Bar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Focus Areas / Target Lagging Muscles</label>
                  <input
                    type="text"
                    value={focusAreas}
                    onChange={(e) => setFocusAreas(e.target.value)}
                    placeholder="e.g. Chest thickness, Shoulder caps, Squat depth..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <button
                  onClick={handleGenerateAIProgram}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 disabled:opacity-50 text-black py-3 rounded-2xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Program with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Custom Program</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-lime-500/10 border border-lime-500/30 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-lime-400 uppercase">
                      {aiProgramResult.difficulty} &bull; {aiProgramResult.splitType}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white">{aiProgramResult.programName}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{aiProgramResult.overview}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <strong className="text-lime-400 block mb-1">Progression Scheme:</strong>
                  <p className="text-slate-300">{aiProgramResult.overloadProtocol}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase">Generated Schedule:</div>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {(aiProgramResult.weeklySchedule || []).map((s: any, idx: number) => (
                      <div key={idx} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs">
                        <strong className="text-white block">{s.day}: {s.focus}</strong>
                        <ul className="list-disc list-inside text-slate-400 mt-1 space-y-0.5">
                          {(s.exercises || []).map((ex: string, i: number) => (
                            <li key={i}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveAIProgramToLibrary}
                    className="flex-1 bg-lime-400 hover:bg-lime-300 text-black py-3 rounded-2xl font-bold text-xs transition"
                  >
                    Save & Set as Active Program
                  </button>
                  <button
                    onClick={() => setAiProgramResult(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-2xl font-bold text-xs transition"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
