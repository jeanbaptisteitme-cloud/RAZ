import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-lime-950/80 via-slate-900 to-emerald-950/80 border-b border-lime-500/30 px-3 py-2 text-xs flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-lime-400 text-black flex items-center justify-center font-black text-xs shadow-[0_0_10px_rgba(163,230,53,0.5)]">
            APK
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lime-300 flex items-center gap-1.5">
              ApeX Training APK &bull; Mobile App
              <span className="px-1.5 py-0.2 bg-lime-500/20 text-lime-400 text-[10px] rounded font-mono">v2.4</span>
            </span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Install as native standalone Android APK / PWA for offline gym logging
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable ? (
            <button
              onClick={install}
              className="flex items-center gap-1.5 bg-lime-400 hover:bg-lime-300 text-black px-3 py-1.5 rounded-lg font-bold text-xs shadow-[0_0_15px_rgba(163,230,53,0.4)] transition cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Install APK
            </button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-lime-400 border border-lime-500/40 px-3 py-1.5 rounded-lg font-medium text-xs transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              APK Install Guide
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="text-slate-500 hover:text-slate-300 p-1 rounded transition"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-lime-500/40 rounded-2xl p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-lime-400 flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(163,230,53,0.5)]">
                APK
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Install ApeX Training</h3>
                <p className="text-xs text-lime-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Progressive Web APK &bull; Offline Ready
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              ApeX runs as a full-featured Android APK/PWA. When installed on your phone, it functions with zero latency, full offline workout logging, background rest timer audio, and haptic feedback.
            </p>

            <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 mb-5 text-xs text-slate-300">
              {isAndroid || !isIOS ? (
                <>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Android Chrome / Browser:</strong>
                      <p className="text-slate-400 mt-0.5">Tap the browser menu (<span className="text-white font-mono">&vellip;</span>) and select <span className="text-lime-300 font-semibold">"Install app"</span> or <span className="text-lime-300 font-semibold">"Add to Home screen"</span>.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Stand-alone APK Experience:</strong>
                      <p className="text-slate-400 mt-0.5">Launches full screen with no browser address bars, native notifications, and offline cached databases.</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">iOS Safari:</strong>
                    <p className="text-slate-400 mt-0.5">Tap the <strong>Share button</strong> in Safari toolbar, scroll down and tap <span className="text-lime-300 font-semibold">"Add to Home Screen"</span>.</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (isInstallable) install();
                setShowModal(false);
              }}
              className="w-full bg-lime-400 hover:bg-lime-300 text-black py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(163,230,53,0.4)] transition cursor-pointer"
            >
              {isInstallable ? 'Install ApeX Now' : 'Got it, let\'s train!'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
