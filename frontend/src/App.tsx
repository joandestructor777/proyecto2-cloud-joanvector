import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { ThreatOverview } from "./features/dashboard/components/ThreatOverview";
import { WebsiteAssistantView } from "./features/assistant-simulator/components/WebsiteAssistantView";
import { RuleTable } from "./features/security-rules/components/RuleTable";
import { AuditLogTable } from "./features/audit-logs/components/AuditLogTable";
import { useRules } from "./features/security-rules/hooks/useRules";
import { useAuditLogs } from "./features/audit-logs/hooks/useAuditLogs";
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

  const {
    rules,
    loading: rulesLoading,
    addRule,
    updateRule,
    toggleRuleActive,
    deleteRule,
    seedDefaults,
    refresh: refreshRules,
  } = useRules();

  const {
    logs,
    loading: logsLoading,
    refresh: refreshLogs,
  } = useAuditLogs();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiClient.get("/rules?limit=1");
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
              {currentTab === APP_ROUTES.DASHBOARD && "PANEL DE CONTROL FORENSE"}
              {currentTab === APP_ROUTES.SIMULATOR && "SANDBOX DE EVALUACIÓN HEURÍSTICA"}
              {currentTab === APP_ROUTES.RULES && "MATRIZ DE REGLAS Y POLÍTICAS"}
              {currentTab === APP_ROUTES.AUDIT && "REGISTRO DE AUDITORÍA Y TRAZABILIDAD"}
            </span>
          </div>
        </header>

        <main className="flex-1 p-6">
          {currentTab === APP_ROUTES.DASHBOARD && (
            <ThreatOverview logs={logs} onRefresh={refreshLogs} />
          )}

          {currentTab === APP_ROUTES.SIMULATOR && (
            <WebsiteAssistantView onNavigateToRules={() => setCurrentTab(APP_ROUTES.RULES)} />
          )}

          {currentTab === APP_ROUTES.RULES && (
            <RuleTable
              rules={rules}
              loading={rulesLoading}
              onAddRule={addRule}
              onUpdateRule={updateRule}
              onToggleActive={toggleRuleActive}
              onDeleteRule={deleteRule}
              onSeedDefaults={seedDefaults}
              onRefresh={refreshRules}
            />
          )}

          {currentTab === APP_ROUTES.AUDIT && (
            <AuditLogTable logs={logs} loading={logsLoading} onRefresh={refreshLogs} />
          )}
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
