import React, { useState } from 'react';
import { 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Calendar, 
  ArrowRight, 
  Lock, 
  HelpCircle,
  FileText,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGym } from '../context/GymContext';
import { MembershipPlan } from '../types';

interface MembershipScreenProps {
  onOpenAccessPass: () => void;
}

export const MembershipScreen: React.FC<MembershipScreenProps> = ({ onOpenAccessPass }) => {
  const { userProfile, updateUserPlan } = useAuth();
  const { plans } = useGym();
  
  const [selectedPlanToChange, setSelectedPlanToChange] = useState<MembershipPlan | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);

  const currentPlan = plans.find((p) => p.id === userProfile?.currentPlanId) || plans[0];

  const handleConfirmPlanChange = async () => {
    if (!selectedPlanToChange) return;
    setIsChanging(true);
    await updateUserPlan(selectedPlanToChange.id, selectedPlanToChange.name);
    setIsChanging(false);
    setChangeSuccess(true);
    setTimeout(() => {
      setChangeSuccess(false);
      setSelectedPlanToChange(null);
    }, 1800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#FF5E00] mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Membresía & Facturación</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
            GESTIÓN DE TU CUOTA DE SOCIO
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Consulta tu plan activo, tus beneficios contratados y los planes disponibles en Kinetic.
          </p>
        </div>

        {/* Digital Access Card Quick Trigger */}
        <button
          onClick={onOpenAccessPass}
          className="self-start sm:self-auto flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-[#1F242D] hover:bg-[#2A303C] border border-[#2D333F] text-[#F8FAFC] text-xs font-semibold transition-all active:scale-95 shadow-lg shadow-black/30"
        >
          <QrCode className="w-4 h-4 text-[#84CC16]" />
          <span>Ver Pase Digital de Acceso (Torno)</span>
        </button>
      </div>

      {/* Active Membership Hero Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#171A21] via-[#1A1E26] to-[#121418] border border-[#FF5E00]/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#FF5E00]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#84CC16]/20 text-[#84CC16] border border-[#84CC16]/40 flex items-center space-x-1.5 glow-lime">
                <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse"></span>
                <span>Cuota Activa y al Día</span>
              </span>
              <span className="text-xs font-mono text-[#94A3B8]">
                Nº Socio: <strong className="text-[#F8FAFC]">{userProfile?.membershipNumber || 'KP-0842'}</strong>
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[#94A3B8]">
                Plan Actual Contratado:
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F8FAFC] flex items-center space-x-3">
                <span>{userProfile?.planName || currentPlan?.name}</span>
                <Sparkles className="w-6 h-6 text-[#FF5E00]" />
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
              {currentPlan?.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <div className="flex items-center space-x-1.5 text-[#94A3B8]">
                <Calendar className="w-4 h-4 text-[#FF5E00]" />
                <span>Próxima renovación: <strong className="text-[#F8FAFC]">{userProfile?.planRenewalDate || '1 de Noviembre, 2026'}</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#94A3B8]">
                <Clock className="w-4 h-4 text-[#38BDF8]" />
                <span>Horario: <strong className="text-[#F8FAFC]">{currentPlan?.accessHours}</strong></span>
              </div>
            </div>
          </div>

          {/* Pricing & Digital Pass Column */}
          <div className="flex flex-col sm:items-end justify-between space-y-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-[#2D333F] md:pl-8">
            <div className="sm:text-right">
              <span className="text-xs uppercase tracking-wider text-[#94A3B8]">
                Precio de Cuota
              </span>
              <div className="flex items-baseline sm:justify-end space-x-1 mt-0.5">
                <span className="font-display text-4xl sm:text-5xl font-bold text-[#FF5E00] tnum">
                  {currentPlan?.price || 79}€
                </span>
                <span className="text-sm text-[#94A3B8]">/ mes</span>
              </div>
              <span className="text-[11px] text-[#84CC16] block mt-1">
                IVA incluido • Sin permanencia
              </span>
            </div>

            <button
              onClick={onOpenAccessPass}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#FF5E00] hover:bg-[#ff6e1a] text-[#0F1115] font-display text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-transform active:scale-95 glow-ignite"
            >
              <QrCode className="w-4 h-4 stroke-[2.5]" />
              <span>Abrir Pase para Torno</span>
            </button>
          </div>
        </div>

        {/* Highlighted Included Features */}
        <div className="relative z-10 mt-6 pt-6 border-t border-[#2D333F]/70 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {currentPlan?.features.slice(0, 3).map((feat, i) => (
            <div key={i} className="flex items-center space-x-2 text-xs text-[#F8FAFC]">
              <span className="w-4 h-4 rounded-full bg-[#84CC16]/20 text-[#84CC16] flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Plans Catalog Section */}
      <div className="space-y-4 pt-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
            <CreditCard className="w-4 h-4" />
            <span>Catálogo Completo</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
            PLANES Y TARIFAS DISPONIBLES
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Puedes cambiar de tarifa en cualquier momento. El cambio se guardará de inmediato en tu perfil.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isUserCurrent = (userProfile?.currentPlanId || 'plan-pro-unlimited') === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between p-5 transition-all duration-200 ${
                  isUserCurrent
                    ? 'bg-[#1F242D] border-2 border-[#84CC16] shadow-xl'
                    : plan.popular
                    ? 'bg-[#171A21] border border-[#FF5E00]/60 hover:border-[#FF5E00]'
                    : 'bg-[#171A21] border border-[#2D333F] hover:border-[#94A3B8]/40'
                }`}
              >
                {/* Header Tag */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        isUserCurrent
                          ? 'bg-[#84CC16]/20 text-[#84CC16] border-[#84CC16]/40'
                          : plan.popular
                          ? 'bg-[#FF5E00]/20 text-[#FF5E00] border-[#FF5E00]/40'
                          : 'bg-[#1F242D] text-[#94A3B8] border-[#2D333F]'
                      }`}
                    >
                      {isUserCurrent ? 'TU PLAN ACTUAL' : plan.badge}
                    </span>

                    {plan.popular && !isUserCurrent && (
                      <span className="text-[10px] text-[#FF5E00] font-bold uppercase tracking-wider flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Recomendado</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-[#F8FAFC]">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="py-2 border-y border-[#2D333F]/60">
                    <div className="flex items-baseline space-x-1">
                      <span className="font-display text-3xl font-bold text-[#F8FAFC] tnum">
                        {plan.price}€
                      </span>
                      <span className="text-xs text-[#94A3B8]">/ mes</span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8] block">
                      {plan.accessHours}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 pt-1">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-[#F8FAFC]">
                        <Check className="w-3.5 h-3.5 text-[#84CC16] flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Selection CTA */}
                <div className="pt-6 mt-4">
                  {isUserCurrent ? (
                    <div className="w-full py-2.5 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/40 text-[#84CC16] text-xs font-bold text-center uppercase tracking-wider font-display">
                      ✓ Plan Contratado
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedPlanToChange(plan)}
                      className="w-full py-2.5 rounded-xl bg-[#1F242D] hover:bg-[#FF5E00] hover:text-[#0F1115] border border-[#2D333F] text-xs font-bold uppercase tracking-wider text-[#F8FAFC] transition-all duration-150 font-display active:scale-95"
                    >
                      Cambiar a este Plan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Gateway Preparedness Notice */}
      <div className="rounded-2xl bg-[#171A21] border border-[#2D333F] p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center border border-[#38BDF8]/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[#F8FAFC] uppercase">
              Método de Pago & Pasarela Bancaria
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Módulo preparado para cobro recurrente automático (SEPA / Stripe / Pasarela de pago).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3.5 rounded-xl bg-[#1F242D] border border-[#2D333F] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8]">
              Método de cobro vinculado
            </span>
            <div className="flex items-center justify-between text-[#F8FAFC]">
              <span className="font-mono">•••• •••• •••• 4281 (Visa Débito)</span>
              <span className="text-[10px] text-[#84CC16] font-bold">ACTIVO</span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Próximo recibo programado para el 1 de Noviembre.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1F242D] border border-[#2D333F] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8]">
              Garantía Kinetic
            </span>
            <p className="text-[#F8FAFC] font-semibold">
              Sin permanencia ni costes de cancelación
            </p>
            <p className="text-[11px] text-[#94A3B8]">
              Puedes pausar o cambiar tu suscripción antes del día 25 de cada mes.
            </p>
          </div>
        </div>
      </div>

      {/* Plan Change Confirmation Modal */}
      {selectedPlanToChange && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#171A21] border border-[#2D333F] rounded-2xl p-6 max-w-md w-full space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#FF5E00]/20 text-[#FF5E00] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#F8FAFC] uppercase">
                  Confirmar Cambio de Cuota
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Actualización de tarifa para tu perfil de socio
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1F242D] border border-[#2D333F] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Plan actual:</span>
                <span className="text-[#F8FAFC] font-bold">{userProfile?.planName}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#2D333F]">
                <span className="text-[#FF5E00] font-bold">Nuevo plan:</span>
                <span className="text-sm font-bold text-[#FF5E00] font-display">
                  {selectedPlanToChange.name} ({selectedPlanToChange.price}€/mes)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0F1115] border border-[#2D333F] text-[11px] text-[#94A3B8] space-y-1">
              <p className="text-[#F8FAFC] font-semibold">ℹ️ Nota de Facturación:</p>
              <p>
                El cambio se guarda de inmediato en tu perfil de Firestore. El ajuste de cuota entrará en vigor en tu próxima mensualidad. El cobro definitivo se habilitará con la pasarela bancaria.
              </p>
            </div>

            {changeSuccess ? (
              <div className="p-3 rounded-xl bg-[#84CC16]/20 border border-[#84CC16] text-[#84CC16] text-xs font-bold text-center">
                ✓ ¡Plan actualizado con éxito en Firestore!
              </div>
            ) : (
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlanToChange(null)}
                  disabled={isChanging}
                  className="flex-1 py-2.5 rounded-lg bg-[#1F242D] hover:bg-[#2A303C] text-xs font-semibold text-[#F8FAFC]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPlanChange}
                  disabled={isChanging}
                  className="flex-1 py-2.5 rounded-lg bg-[#FF5E00] hover:bg-[#ff6e1a] text-xs font-display font-bold uppercase text-[#0F1115] transition-transform active:scale-95"
                >
                  {isChanging ? 'Guardando...' : 'Confirmar Cambio'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
