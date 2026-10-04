import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { useUserProfile } from "./shared/hooks/useUserProfile";
import { UserProfileModal } from "./components/layout/UserProfileModal";
import { APP_ROUTES, AppTab } from "./constants/routes.constants";
import { apiClient } from "./shared/api/axiosClient";
import { ACTIVE_TAB_STORAGE_KEY } from "./constants/security.constants";

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(() => {
    try {
      const saved = sessionStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
      if (saved && Object.values(APP_ROUTES).includes(saved as any)) {
        return saved as AppTab;
      }
    } catch {}
    return APP_ROUTES.DASHBOARD;
  });
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(ACTIVE_TAB_STORAGE_KEY, currentTab);
    } catch {}
  }, [currentTab]);

  const { profile, updateProfile, uploadCustomImage, removeAvatar } = useUserProfile();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiClient.get("/health");
        setBackendOnline(true);
      } catch (err) {
        setBackendOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050507] text-[#f4f4f5] flex font-sans selection:bg-white selection:text-black">
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        backendOnline={backendOnline}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="border-b border-zinc-800/80 bg-[#070709]/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 uppercase tracking-wider">SUBSYSTEM:</span>
            <span className="text-zinc-200 font-semibold tracking-wide">
              BASE INICIAL DEL PROYECTO
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="max-w-md p-6 border border-zinc-800 bg-[#09090c] text-center font-mono">
            <div className="w-3 h-3 bg-emerald-500 mx-auto mb-4 animate-ping"></div>
            <h2 className="text-sm font-bold text-white mb-2">JOANVECTOR SOC - BASE LISTA</h2>
            <p className="text-xs text-zinc-400 mb-4">
              La estructura base del proyecto está inicializada. Los módulos de telemetría, reglas, sandbox y portal corporativo se integrarán progresivamente a través de las ramas de desarrollo por cada Historia de Usuario (Sprint 1 a Sprint 3).
            </p>
            <span className="text-[10px] text-zinc-500">Esperando despliegue de Sprint 1...</span>
          </div>
        </main>
      </div>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={updateProfile}
        onUploadCustomImage={uploadCustomImage}
        onRemoveAvatar={removeAvatar}
      />
    </div>
  );
};
