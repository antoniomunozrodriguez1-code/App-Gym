import React, { useState, useEffect } from 'react';
import { X, QrCode, ShieldCheck, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AccessPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessPassModal: React.FC<AccessPassModalProps> = ({ isOpen, onClose }) => {
  const { userProfile } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-ES', { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanned(true);
    setTimeout(() => {
      setScanned(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="bg-[#171A21] border border-[#2D333F] rounded-2xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-[#FF5E00]" />
            <span className="font-display text-base font-bold text-[#F8FAFC] tracking-wider uppercase">
              Pase Digital de Torno
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1F242D] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital Gym Pass Card */}
        <div className="rounded-xl bg-[#0F1115] border border-[#FF5E00]/40 p-5 space-y-4 text-center relative overflow-hidden">
          
          {/* Top Pass Details */}
          <div className="flex items-center justify-between text-left">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#94A3B8]">
                Socio Kinetic
              </p>
              <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                {userProfile?.name}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#84CC16]/20 text-[#84CC16] border border-[#84CC16]/40">
              {userProfile?.membershipNumber || 'KP-0842'}
            </span>
          </div>

          {/* QR Code Graphic */}
          <div className="p-4 bg-white rounded-xl inline-block shadow-inner mx-auto my-2">
            {/* Visual SVG QR representation */}
            <svg className="w-36 h-36" viewBox="0 0 100 100" fill="black">
              {/* Corner position markers */}
              <rect x="0" y="0" width="28" height="28" fill="black" />
              <rect x="4" y="4" width="20" height="20" fill="white" />
              <rect x="8" y="8" width="12" height="12" fill="black" />

              <rect x="72" y="0" width="28" height="28" fill="black" />
              <rect x="76" y="4" width="20" height="20" fill="white" />
              <rect x="80" y="8" width="12" height="12" fill="black" />

              <rect x="0" y="72" width="28" height="28" fill="black" />
              <rect x="4" y="76" width="20" height="20" fill="white" />
              <rect x="8" y="80" width="12" height="12" fill="black" />

              {/* Data matrix dots */}
              <rect x="36" y="8" width="8" height="8" />
              <rect x="52" y="16" width="8" height="8" />
              <rect x="40" y="28" width="8" height="8" />
              <rect x="12" y="40" width="8" height="8" />
              <rect x="24" y="48" width="8" height="8" />
              <rect x="36" y="44" width="8" height="8" />
              <rect x="48" y="40" width="8" height="8" />
              <rect x="64" y="44" width="8" height="8" />
              <rect x="76" y="36" width="8" height="8" />
              <rect x="84" y="48" width="8" height="8" />
              <rect x="36" y="60" width="8" height="8" />
              <rect x="48" y="68" width="8" height="8" />
              <rect x="64" y="72" width="8" height="8" />
              <rect x="76" y="64" width="8" height="8" />
              <rect x="88" y="80" width="8" height="8" />
              <rect x="56" y="84" width="8" height="8" />
            </svg>
          </div>

          {/* Barcode Graphic */}
          <div className="space-y-1">
            <div className="h-8 flex justify-center space-x-0.5 opacity-80">
              {Array.from({ length: 38 }).map((_, i) => (
                <div
                  key={i}
                  className={`bg-[#F8FAFC] h-full ${
                    i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-0.5' : 'w-1.5'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] font-mono tracking-widest text-[#94A3B8]">
              {userProfile?.membershipNumber || 'KP-0842'}-2026-AUTH
            </p>
          </div>

          {/* Live Clock & Status */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2D333F] text-xs">
            <div className="flex items-center space-x-1 text-[#84CC16]">
              <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse"></span>
              <span className="font-semibold text-[11px]">Acceso Autorizado</span>
            </div>
            <span className="font-mono text-[#F8FAFC] font-bold tnum">
              {currentTime}
            </span>
          </div>
        </div>

        {/* Scan Feedback Feedback Alert */}
        {scanned ? (
          <div className="p-3 rounded-xl bg-[#84CC16]/20 border border-[#84CC16] text-[#84CC16] text-xs font-bold text-center flex items-center justify-center space-x-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-[#84CC16]" />
            <span>¡TORNO DESBLOQUEADO! BIENVENIDO AL BOX</span>
          </div>
        ) : (
          <button
            onClick={handleSimulateScan}
            className="w-full py-3 rounded-xl bg-[#1F242D] hover:bg-[#2A303C] border border-[#2D333F] text-xs font-bold uppercase tracking-wider text-[#F8FAFC] transition-colors"
          >
            Simular Escaneo en Torno
          </button>
        )}
      </div>
    </div>
  );
};
