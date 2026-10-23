import React, { useState, useMemo } from "react";
import { SecurityRule, SecurityRuleInput } from "../types/rule.types";
import { RuleFormModal } from "./RuleFormModal";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { getSeverityStyle } from "../../../shared/utils/formatters";
import { SECURITY_CATEGORIES } from "../../../constants/security.constants";

interface RuleTableProps {
  rules: SecurityRule[];
  loading: boolean;
  onAddRule: (rule: SecurityRuleInput) => Promise<any>;
  onUpdateRule: (id: number, rule: Partial<SecurityRuleInput>) => Promise<any>;
  onToggleActive: (id: number, currentActive: boolean) => Promise<any>;
  onDeleteRule: (id: number) => Promise<any>;
  onSeedDefaults: () => Promise<any>;
  onRefresh: () => void;
}

export const RuleTable: React.FC<RuleTableProps> = ({
  rules,
  loading,
  onAddRule,
  onUpdateRule,
  onToggleActive,
  onDeleteRule,
  onSeedDefaults,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SecurityRule | null>(null);

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchesSearch =
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rule.description && rule.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = categoryFilter === "ALL" || rule.category === categoryFilter;
      const matchesSev = severityFilter === "ALL" || rule.severity === severityFilter;

      return matchesSearch && matchesCat && matchesSev;
    });
  }, [rules, searchTerm, categoryFilter, severityFilter]);

  const handleOpenAdd = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rule: SecurityRule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (input: SecurityRuleInput) => {
    if (editingRule) {
      await onUpdateRule(editingRule.id, input);
    } else {
      await onAddRule(input);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[#070709] border border-zinc-800 w-full min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 bg-emerald-500 shrink-0" />
            <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
              DEFENSE POLICY MATRIX - CRUD
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight font-mono">
            POLÍTICAS DE DETECCIÓN & PALABRAS CLAVE
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-mono leading-relaxed">
            Gestión persistente de reglas. Cada término o patrón aquí listado es evaluado en tiempo real por el motor heurístico antes de que la consulta alcance el modelo.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0 flex-wrap">
          <Button
            variant="secondary"
            size="md"
            onClick={onSeedDefaults}
            className="font-mono text-xs"
          >
            <span>[RESTAURAR OWASP TOP 10]</span>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            className="font-mono text-xs px-5"
          >
            <span>[+ NUEVA PALABRA CLAVE]</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#09090b] border border-zinc-800 w-full min-w-0">
        <div className="w-full min-w-0">
          <input
            type="text"
            placeholder="Buscar por palabra clave, nombre o patrón..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/60 border border-zinc-800 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
          />
        </div>

        <div className="w-full min-w-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-black/60 border border-zinc-800 px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
          >
            <option value="ALL">TODAS LAS CATEGORÍAS ({rules.length})</option>
            {SECURITY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full min-w-0">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-black/60 border border-zinc-800 px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
          >
            <option value="ALL">TODAS LAS SEVERIDADES</option>
            <option value="CRITICAL">CRÍTICA (CRITICAL)</option>
            <option value="HIGH">ALTA (HIGH)</option>
            <option value="MEDIUM">MEDIA (MEDIUM)</option>
            <option value="LOW">BAJA (LOW)</option>
          </select>
        </div>
      </div>

      <div className="border border-zinc-800 bg-[#070709] w-full min-w-0">
        {loading && rules.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 text-xs font-mono">
            [RECUPERANDO REGLAS DE SEGURIDAD...]
          </div>
        ) : filteredRules.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 text-xs font-mono">
            No se encontraron políticas que coincidan con los filtros aplicados.
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[68vh] w-full">
            <table className="w-full text-left border-collapse text-xs min-w-[820px]">
              <thead className="sticky top-0 z-10 bg-[#0c0c0e] shadow-[0_1px_0_0_#27272a]">
                <tr className="border-b border-zinc-800 bg-[#0c0c0e] text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-3.5 w-24 font-semibold whitespace-nowrap">Estado</th>
                  <th className="py-3.5 px-3.5 min-w-[180px] font-semibold">Regla & Vector</th>
                  <th className="py-3.5 px-3.5 min-w-[190px] font-semibold">Término / Patrón</th>
                  <th className="py-3.5 px-3.5 font-semibold whitespace-nowrap">Categoría</th>
                  <th className="py-3.5 px-3.5 font-semibold whitespace-nowrap">Severidad</th>
                  <th className="py-3.5 px-3.5 font-semibold whitespace-nowrap">Acción</th>
                  <th className="py-3.5 px-3.5 text-right w-32 font-semibold whitespace-nowrap">Operaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-3.5 whitespace-nowrap align-middle">
                      <button
                        onClick={() => onToggleActive(rule.id, rule.is_active)}
                        className="cursor-pointer text-[11px] font-bold"
                        title="Alternar estado de regla"
                      >
                        {rule.is_active ? (
                          <span className="text-emerald-400">[● ACTIVA]</span>
                        ) : (
                          <span className="text-zinc-600">[○ INACTIVA]</span>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-3.5 max-w-[230px] min-w-[170px] align-middle">
                      <div className="font-semibold text-white tracking-tight truncate" title={rule.name}>
                        {rule.name}
                      </div>
                      {rule.description && (
                        <div
                          className="text-zinc-500 text-[11px] truncate mt-0.5"
                          title={rule.description}
                        >
                          {rule.description}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3.5 min-w-[190px] max-w-[260px] align-middle">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-1 bg-black border border-zinc-700 text-zinc-200 text-xs font-semibold break-words leading-snug inline-block max-w-full">
                          {rule.keyword}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase shrink-0 inline-block">
                          [{rule.pattern_type}]
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3.5 whitespace-nowrap align-middle">
                      <span className="text-[11px] text-zinc-300 font-medium px-2 py-0.5 bg-zinc-900/80 border border-zinc-800">
                        {rule.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5 whitespace-nowrap align-middle">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-bold border inline-block ${getSeverityStyle(
                          rule.severity
                        )}`}
                      >
                        {rule.severity} ({rule.risk_score}%)
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5 whitespace-nowrap align-middle">
                      <Badge variant={rule.action === "BLOCK" ? "danger" : "warning"}>
                        {rule.action}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-3.5 whitespace-nowrap text-right align-middle">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(rule)}
                          className="px-2.5 py-1 text-[11px] text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 bg-zinc-900 transition-colors cursor-pointer"
                          title="Modificar regla"
                        >
                          [EDIT]
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la regla "${rule.name}" permanentemente?`)) {
                              onDeleteRule(rule.id);
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] text-rose-400 hover:text-rose-200 border border-rose-900/60 hover:border-rose-700 bg-rose-950/30 transition-colors cursor-pointer"
                          title="Eliminar regla"
                        >
                          [DEL]
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-5 py-3 bg-[#0c0c0e] border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono flex-wrap gap-2">
          <span>Total de políticas registradas: {rules.length} (Mostrando: {filteredRules.length})</span>
          <span className="text-[11px] text-emerald-400/90">● INTERCEPTOR PERIMETRAL - ON</span>
        </div>
      </div>

      <RuleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialData={editingRule}
      />
    </div>
  );
};
