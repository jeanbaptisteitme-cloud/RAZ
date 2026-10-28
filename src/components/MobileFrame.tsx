import React from 'react';
import { Smartphone, Monitor, Wifi, BatteryCharging, Signal } from 'lucide-react';

interface Props {
  isPhoneFrame: boolean;
  onToggleFrame: () => void;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<Props> = ({ isPhoneFrame, onToggleFrame, children }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isPhoneFrame) {
    return (
      <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04060a] flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4">
      {/* Device Bezel / Phone Mockup */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[880px] sm:max-h-[92vh] bg-[#090d16] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(163,230,53,0.15)] flex flex-col relative overflow-hidden">
        
        {/* Android Punch Hole & Status Bar */}
        <div className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md px-6 py-2.5 flex items-center justify-between text-[11px] text-slate-300 font-mono select-none border-b border-slate-800/40">
          <span>{currentTime}</span>

          {/* Front Camera Punch Hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>

          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-lime-400">
              <span>98%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-lime-400" />
            </div>
          </div>
        </div>

        {/* Scrollable App Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          {children}
        </div>

        {/* Android Bottom Gesture Navigation Pill */}
        <div className="sticky bottom-0 z-50 bg-[#090d16] py-1.5 flex justify-center items-center pointer-events-none">
          <div className="w-32 h-1 bg-slate-600 rounded-full opacity-60" />
        </div>
      </div>
    </div>
  );
};
