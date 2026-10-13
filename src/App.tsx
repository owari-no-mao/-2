/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  createInitialSimulation,
  stepSimulation,
  applyDecision,
} from './simulation/engine';
import { STAGES } from './simulation/constants';
import { SimulationState, Agent, RoleType, SocietyPolicy } from './types/simulation';
import { Header } from './components/Header';
import { WorldCanvas } from './components/WorldCanvas';
import { ResourcesOverview } from './components/ResourcesOverview';
import { AgentDetailModal } from './components/AgentDetailModal';
import { DecisionsModal } from './components/DecisionsPanel';
import { TimelineStages } from './components/TimelineStages';
import { AnthropologyGuideModal } from './components/AnthropologyGuideModal';
import { SandboxControls } from './components/SandboxControls';
import { BottomNav } from './components/BottomNav';
import { Sparkles, Milestone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  const [simulationState, setSimulationState] = useState<SimulationState>(createInitialSimulation);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'world' | 'resources' | 'evolution' | 'sandbox'>('world');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Tick loop reference
  const stateRef = useRef(simulationState);
  stateRef.current = simulationState;

  // Step ticker
  useEffect(() => {
    if (simulationState.speed === 0 || simulationState.activeDecision !== null) {
      return;
    }

    const intervalMs = simulationState.speed === 1 ? 1200 : simulationState.speed === 2 ? 600 : 250;
    const timer = setInterval(() => {
      setSimulationState((prev) => stepSimulation(prev));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [simulationState.speed, simulationState.activeDecision]);

  const handleSpeedChange = (speed: 0 | 1 | 2 | 5) => {
    setSimulationState((prev) => ({ ...prev, speed }));
  };

  const handleReset = useCallback(() => {
    if (window.confirm('シミュレーションを初期状態（第1年・原初の群れ）に戻しますか？')) {
      setSimulationState(createInitialSimulation());
      setSelectedAgentId(null);
    }
  }, []);

  const handleSelectAgent = (agent: Agent | null) => {
    setSelectedAgentId(agent ? agent.id : null);
  };

  const handleRoleChange = (agentId: string, role: RoleType) => {
    setSimulationState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => (a.id === agentId ? { ...a, role } : a)),
    }));
  };

  const handleUpdatePolicy = (newPolicy: Partial<SocietyPolicy>) => {
    setSimulationState((prev) => ({
      ...prev,
      policy: { ...prev.policy, ...newPolicy },
      logs: [
        {
          id: `log_policy_${Date.now()}`,
          year: prev.year,
          season: prev.season,
          text: `掟の更新が行われました。社会制度が再編されました。`,
          type: 'decision' as const,
        },
        ...prev.logs,
      ].slice(0, 40),
    }));
  };

  const handleChooseDecisionOption = (decisionId: string, optionId: string) => {
    setSimulationState((prev) => applyDecision(prev, decisionId, optionId));
  };

  const selectedAgent = simulationState.agents.find((a) => a.id === selectedAgentId) || null;
  const currentStageInfo = STAGES[simulationState.stage];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      {/* 1. Header (Top Bar Contract) */}
      <Header
        currentStage={simulationState.stage}
        year={simulationState.year}
        season={simulationState.season}
        day={simulationState.day}
        speed={simulationState.speed}
        onSpeedChange={handleSpeedChange}
        onReset={handleReset}
        onOpenGuide={() => setIsGuideOpen(true)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
      />

      {/* 2. Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner: Current Epoch Context Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
              <Milestone className="w-4 h-4" />
              <span>文明段階：{currentStageInfo.name}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300 font-normal">{currentStageInfo.subtitle}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {currentStageInfo.description}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
              <span className="text-slate-500 mr-1.5">蓄積された知恵</span>
              <span className="font-bold text-amber-400 tabular-nums">
                {Math.round(simulationState.resources.wisdomStock)} pt
              </span>
            </div>
            <button
              onClick={() => setActiveTab('evolution')}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>進化マップ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Tab Contents */}
        {activeTab === 'world' && (
          <div className="space-y-6">
            {/* Split layout: Canvas + Real-time Tribe Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left: 2-column wide interactive canvas */}
              <div className="lg:col-span-2">
                <WorldCanvas
                  agents={simulationState.agents}
                  stage={simulationState.stage}
                  fireIntensity={simulationState.resources.fire}
                  season={simulationState.season}
                  selectedAgentId={selectedAgentId}
                  onSelectAgent={handleSelectAgent}
                />
              </div>

              {/* Right: Real-time quick state & latest events */}
              <div className="space-y-4">
                {/* Compact Tribe Summary */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    群れの現況・生存基盤
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                      <span className="text-slate-500 block mb-0.5">食糧の備蓄</span>
                      <span className="text-base font-bold text-slate-100 tabular-nums">
                        {Math.round(simulationState.resources.food)}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                      <span className="text-slate-500 block mb-0.5">火の勢い</span>
                      <span className="text-base font-bold text-orange-400 tabular-nums">
                        {Math.round(simulationState.resources.fire)}%
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                      <span className="text-slate-500 block mb-0.5">道具・石器</span>
                      <span className="text-base font-bold text-slate-100 tabular-nums">
                        {Math.round(simulationState.resources.tools)}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                      <span className="text-slate-500 block mb-0.5">知恵の蓄積</span>
                      <span className="text-base font-bold text-amber-400 tabular-nums">
                        {Math.round(simulationState.resources.wisdomStock)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>個体数: {simulationState.agents.length}名</span>
                    <button
                      onClick={() => setActiveTab('resources')}
                      className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                    >
                      制度・役割を調整 →
                    </button>
                  </div>
                </div>

                {/* Recent Event Stream */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    直近の出来事
                  </h3>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {simulationState.logs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/60 text-xs text-slate-300 leading-relaxed"
                      >
                        <span className="text-[11px] text-slate-500 mr-1.5 tabular-nums">
                          第{log.year}年 {log.season}
                        </span>
                        {log.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Resources Overview Strip */}
            <ResourcesOverview
              resources={simulationState.resources}
              agents={simulationState.agents}
              policy={simulationState.policy}
              onUpdatePolicy={handleUpdatePolicy}
              onAssignRole={handleRoleChange}
            />
          </div>
        )}

        {activeTab === 'resources' && (
          <ResourcesOverview
            resources={simulationState.resources}
            agents={simulationState.agents}
            policy={simulationState.policy}
            onUpdatePolicy={handleUpdatePolicy}
            onAssignRole={handleRoleChange}
          />
        )}

        {activeTab === 'evolution' && (
          <TimelineStages
            currentStage={simulationState.stage}
            wisdomStock={simulationState.resources.wisdomStock}
            population={simulationState.agents.length}
            logs={simulationState.logs}
          />
        )}

        {activeTab === 'sandbox' && (
          <SandboxControls
            state={simulationState}
            onLoadState={(newState) => setSimulationState(newState)}
            onReset={handleReset}
          />
        )}
      </main>

      {/* 3. Decision Modal (Tribal Council) */}
      <DecisionsModal
        decision={simulationState.activeDecision}
        onChooseOption={handleChooseDecisionOption}
      />

      {/* 4. Agent Detail Inspector Modal */}
      <AgentDetailModal
        agent={selectedAgent}
        onClose={() => setSelectedAgentId(null)}
        onRoleChange={handleRoleChange}
      />

      {/* 5. Anthropology & History Guide Modal */}
      <AnthropologyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* 6. Mobile Bottom Navigation (Android / Touch PWA friendly) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />
    </div>
  );
}
