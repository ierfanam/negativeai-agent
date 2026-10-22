"use client";

import { useState, useEffect } from "react";
import { NOTRACK_PROVIDERS, NotrackModelConfig } from "@/lib/notrack";
import { Button } from "@/components/ui/button";
import { KeyIcon, ExternalLinkIcon, CheckIcon, CpuIcon, ShieldAlertIcon, SparklesIcon, SearchIcon, BarChart2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export interface SelectedModelSelection {
  providerId: string;
  model: string;
  baseUrl: string;
  apiKey: string;
}

export function NotrackSelector({
  selected,
  onSelect,
}: {
  readonly selected: SelectedModelSelection;
  readonly onSelect: (sel: SelectedModelSelection) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customKeys, setCustomKeys] = useState<Record<string, string>>({});
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("notrack_custom_keys");
      if (saved) {
        setCustomKeys(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const getApiKey = (provider: NotrackModelConfig) => {
    return customKeys[provider.id] !== undefined ? customKeys[provider.id] : provider.defaultApiKey;
  };

  const handleSaveKey = (providerId: string, key: string) => {
    const updated = { ...customKeys, [providerId]: key };
    setCustomKeys(updated);
    try {
      localStorage.setItem("notrack_custom_keys", JSON.stringify(updated));
    } catch {}
    setEditingProviderId(null);

    if (selected.providerId === providerId) {
      onSelect({ ...selected, apiKey: key });
    }
  };

  const currentProvider = NOTRACK_PROVIDERS.find((p) => p.id === selected.providerId) || NOTRACK_PROVIDERS[0];

  // Calculate total models and stats for dashboard
  const totalModels = NOTRACK_PROVIDERS.reduce((acc, p) => acc + p.models.length, 0);
  const categoryCounts = [
    { name: "Uncensored", count: NOTRACK_PROVIDERS.find(p => p.category === "uncensored")?.models.length || 0, color: "#f59e0b" },
    { name: "Vision", count: NOTRACK_PROVIDERS.find(p => p.category === "vision")?.models.length || 0, color: "#3b82f6" },
    { name: "Media", count: NOTRACK_PROVIDERS.find(p => p.category === "media")?.models.length || 0, color: "#a855f7" },
    { name: "Search", count: NOTRACK_PROVIDERS.find(p => p.category === "search")?.models.length || 0, color: "#10b981" },
    { name: "Free Tier", count: NOTRACK_PROVIDERS.find(p => p.category === "free")?.models.length || 0, color: "#6366f1" },
  ];

  return (
    <div className="relative flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowDashboard(false);
        }}
        className="flex items-center gap-2 font-medium text-xs bg-card hover:bg-muted/50 border-border shadow-sm"
      >
        <CpuIcon className="size-3.5 text-primary" />
        <span className="truncate max-w-[120px] sm:max-w-[160px]">{currentProvider.name}</span>
        <span className="text-muted-foreground font-mono text-[10px]">({selected.model})</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 sm:w-[420px] rounded-2xl border border-border bg-card p-4 shadow-2xl z-50 animate-in fade-in-80">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground">NoTrack Model Catalog & Hub</h3>
              <p className="text-xs text-muted-foreground">Total {totalModels} models available across endpoints</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant={showDashboard ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowDashboard(!showDashboard)}
                className="h-7 px-2 text-xs gap-1"
              >
                <BarChart2Icon className="size-3.5" /> Stats
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-7 w-7 p-0">
                ✕
              </Button>
            </div>
          </div>

          {showDashboard ? (
            <div className="space-y-4 py-2">
              <div className="rounded-xl border border-border p-3 bg-muted/30">
                <h4 className="font-medium text-xs mb-1 text-foreground">Model Distribution by Category</h4>
                <p className="text-[11px] text-muted-foreground mb-3">Breakdown of available cloud and uncensored models.</p>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryCounts}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {categoryCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => setShowDashboard(false)}>
                Back to Model List
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Search input field */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search models by name, capability..."
                  className="w-full bg-muted/40 border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                {NOTRACK_PROVIDERS.map((provider) => {
                  const filteredModels = provider.models.filter(
                    (m) =>
                      m.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      provider.description.toLowerCase().includes(searchQuery.toLowerCase())
                  );

                  if (filteredModels.length === 0) return null;

                  return (
                    <div key={provider.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          {provider.category === "uncensored" && <ShieldAlertIcon className="size-3 text-amber-500" />}
                          {provider.category === "vision" && <CpuIcon className="size-3 text-blue-500" />}
                          {provider.category === "media" && <SparklesIcon className="size-3 text-purple-500" />}
                          {provider.category === "search" && <SearchIcon className="size-3 text-emerald-500" />}
                          {provider.category === "free" && <CheckIcon className="size-3 text-indigo-500" />}
                          {provider.name}
                        </span>
                        {provider.freeKey && (
                          <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-semibold px-1.5 py-0.5 rounded normal-case">
                            Free Tier
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {filteredModels.map((modelName) => {
                          const isSelected = selected.providerId === provider.id && selected.model === modelName;
                          const activeKey = getApiKey(provider);

                          return (
                            <div
                              key={modelName}
                              className={cn(
                                "rounded-lg border p-2.5 transition-all flex items-center justify-between gap-2",
                                isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-background hover:bg-muted/30"
                              )}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-mono font-medium text-xs text-foreground truncate">{modelName}</div>
                                <p className="text-[10px] text-muted-foreground truncate">{provider.description}</p>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <Button
                                  size="sm"
                                  variant={isSelected ? "default" : "outline"}
                                  className="h-6 px-2 text-[11px]"
                                  onClick={() => {
                                    onSelect({
                                      providerId: provider.id,
                                      model: modelName,
                                      baseUrl: provider.baseUrl,
                                      apiKey: activeKey,
                                    });
                                    setIsOpen(false);
                                  }}
                                >
                                  {isSelected && <CheckIcon className="size-3 mr-1" />}
                                  {isSelected ? "Active" : "Select"}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Provider Key & URL management */}
                      <div className="flex items-center justify-between text-[11px] px-1 pt-1">
                        <a
                          href={provider.keyGenUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          Get Key Portal <ExternalLinkIcon className="size-2.5" />
                        </a>
                        <button
                          onClick={() => setEditingProviderId(editingProviderId === provider.id ? null : provider.id)}
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <KeyIcon className="size-3" /> {editingProviderId === provider.id ? "Close Key" : "Configure Key"}
                        </button>
                      </div>

                      {editingProviderId === provider.id && (
                        <div className="pt-1 flex items-center gap-2">
                          <input
                            type="password"
                            defaultValue={getApiKey(provider)}
                            id={`key-input-${provider.id}`}
                            placeholder="Enter API key..."
                            className="flex-1 bg-muted/50 border border-input rounded px-2 py-1 text-xs text-foreground font-mono"
                          />
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              const inputEl = document.getElementById(`key-input-${provider.id}`) as HTMLInputElement;
                              if (inputEl) handleSaveKey(provider.id, inputEl.value);
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
