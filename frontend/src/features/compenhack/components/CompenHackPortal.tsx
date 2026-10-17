import React from "react";
import { FloatingChatWidget } from "./FloatingChatWidget";

interface CompenHackPortalProps {
  onBackToSOC: () => void;
}

export const CompenHackPortal: React.FC<CompenHackPortalProps> = ({ onBackToSOC }) => {
  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#383B3B] font-sans relative selection:bg-[#FF6600] selection:text-white flex flex-col justify-between">
      <div className="bg-[#111114] text-zinc-300 text-xs py-2 px-6 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2 font-mono">
          <span className="w-2 h-2 bg-emerald-400 inline-block animate-pulse"></span>
          <span className="text-[11px] text-zinc-400">SIMULACIÓN WEB EMPRESA - PORTAL COMPENHACK</span>
        </div>
        <button
          onClick={onBackToSOC}
          className="px-3 py-1 font-mono text-[11px] bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 transition-colors cursor-pointer"
        >
          [← VOLVER A CONSOLA SOC JOANVECTOR]
        </button>
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#FF6600] flex items-center justify-center text-white font-bold text-xl tracking-tight shadow-sm">
              C
            </div>
            <div>
              <div className="font-extrabold text-xl text-[#383B3B] tracking-tight leading-none">
                Compen<span className="text-[#FF6600]">Hack</span>
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5 font-medium">
                Caja de Compensación Familiar
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600">
            <a href="#salud" className="hover:text-[#FF6600] transition-colors">Salud</a>
            <a href="#subsidios" className="hover:text-[#FF6600] transition-colors">Subsidios</a>
            <a href="#recreacion" className="hover:text-[#FF6600] transition-colors">Recreación</a>
            <a href="#vivienda" className="hover:text-[#FF6600] transition-colors">Vivienda</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-[#FF6600] uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded">
              Portal Transaccional Seguro
            </span>
            <h1 className="text-3xl font-extrabold text-[#383B3B] mt-3 leading-tight">
              Bienestar integral y protección para ti y tu familia
            </h1>
            <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">
              Consulta el estado de tu subsidio cuota monetaria, agenda citas médicas prioritarias y accede a descuentos exclusivos en centros recreacionales protegidos con inteligencia artificial perimetral.
            </p>
          </div>
          <div className="w-full md:w-80 p-5 bg-orange-50/50 rounded-lg border border-orange-100 flex flex-col gap-3">
            <div className="font-bold text-sm text-[#FF6600]">Trámites Rápidos</div>
            <div className="text-xs text-gray-600 space-y-2">
              <div className="flex items-center gap-2">✓ Agendamiento de citas médicas</div>
              <div className="flex items-center gap-2">✓ Certificados de afiliación</div>
              <div className="flex items-center gap-2">✓ Consulta de cuota monetaria</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
            <div className="text-xs font-bold text-[#FF6600] uppercase tracking-wider mb-2">Salud y Prevención</div>
            <h3 className="font-bold text-base text-[#383B3B] mb-2">Citas Médicas en Línea</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Accede a medicina general, pediatría y odontología en nuestra red de sedes con tarifas subsidiadas por categoría.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
            <div className="text-xs font-bold text-[#FF6600] uppercase tracking-wider mb-2">Subsidios y Apoyo</div>
            <h3 className="font-bold text-base text-[#383B3B] mb-2">Subsidio Familiar</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Consulta las fechas de consignación y requisitos para recibir el giro mensual de la cuota monetaria en tu cuenta registrada.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
            <div className="text-xs font-bold text-[#FF6600] uppercase tracking-wider mb-2">Turismo y Deporte</div>
            <h3 className="font-bold text-base text-[#383B3B] mb-2">Sedes Recreativas</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Reserva pasadías y hospedaje en Girardot y centros campestres familiares con tarifas especiales para afiliados A y B.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        CompenHack © 2026 - Plataforma Corporativa Simulada con Protección Perimetral JoanVector Guardrail.
      </footer>

      {/* Widget flotante protegido desarrollado por Juan (HU-08) */}
      <FloatingChatWidget />
    </div>
  );
};
