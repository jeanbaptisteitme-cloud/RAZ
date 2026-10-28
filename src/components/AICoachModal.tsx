import React, { useState } from 'react';
import { X, Sparkles, Send, Brain, Dumbbell, ShieldAlert, Award } from 'lucide-react';

interface Props {
  onClose: () => void;
  activeContext?: any;
}

export const AICoachModal: React.FC<Props> = ({ onClose, activeContext }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hey lifter! I am your ApeX AI Training Coach. Ask me anything about Progressive Overload, busting through plateaus, optimal rest periods, deload timing, or exercise form cues!',
    },
  ]);

  const quickQuestions = [
    'How do I apply double progression to bench press?',
    'When should I schedule a deload week?',
    'How do I calculate volume load progression?',
    'Should I add weight or reps first for hypertrophy?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || question;
    if (!textToSend.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/ask-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          currentContext: activeContext,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer || 'Progressive overload requires tracking volume and gradually adding weight or reps.',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'To ensure progressive overload: When you can complete all prescribed sets at the top of your rep bracket with good technique, increase the load by 2.5% to 5% next workout.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-lime-500 to-emerald-400 text-black flex items-center justify-center font-black shadow-[0_0_15px_rgba(163,230,53,0.4)]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                ApeX AI Coach
                <span className="text-[10px] bg-lime-500/20 text-lime-400 font-mono px-1.5 py-0.5 rounded">
                  Gemini 3.8
                </span>
              </h3>
              <p className="text-xs text-slate-400">Scientific overload & program advisory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-lime-400 text-black font-medium shadow-md'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-lime-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-lime-400" />
                <span>Coach is analyzing your biomechanics...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 overflow-x-auto whitespace-nowrap flex gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 transition shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/90 flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your workout, overload math, or deload..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-lime-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!question.trim() || isLoading}
            className="bg-lime-400 hover:bg-lime-300 disabled:opacity-40 text-black p-2.5 rounded-xl font-bold transition shadow-md cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
