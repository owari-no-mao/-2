import React from 'react';
import { Agent, RoleType } from '../types/simulation';
import { getRoleLabel } from '../simulation/engine';
import { X, User, Heart, Sparkles, Smile, Shield } from 'lucide-react';

interface AgentDetailModalProps {
  agent: Agent | null;
  onClose: () => void;
  onRoleChange: (agentId: string, role: RoleType) => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  onClose,
  onRoleChange,
}) => {
  if (!agent) return null;

  const roles: { type: RoleType; label: string; desc: string }[] = [
    { type: 'forager', label: '採集者', desc: '食糧の果実・根菜を群れのために集める' },
    { type: 'explorer', label: '探索者', desc: '未知の地域へ足を踏み入れ新知識を探す' },
    { type: 'firekeeper', label: '火の守り人', desc: '薪をくべて火種を絶やさず管理する' },
    { type: 'crafter', label: '道具職人', desc: '石器や木製道具を製作し効率を高める' },
    { type: 'elder', label: '長老・語り部', desc: '群れの記憶を保ち、若者に知恵を伝える' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-100">{agent.name}</h3>
                <span className="text-xs text-slate-400">
                  {agent.gender === 'male' ? '男性' : '女性'} · {agent.age}歳 (第{agent.generation}世代)
                </span>
              </div>
              <p className="text-xs text-amber-400 mt-0.5">
                現在の役割: {getRoleLabel(agent.role)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vital Stats */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              生命力
            </div>
            <div className="text-lg font-bold tabular-nums text-slate-100">
              {Math.round(agent.health)}%
            </div>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              士気・感情
            </div>
            <div className="text-lg font-bold tabular-nums text-slate-100">
              {Math.round(agent.morale)}%
            </div>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              個人の知恵
            </div>
            <div className="text-lg font-bold tabular-nums text-sky-300">
              {Math.round(agent.wisdom)} pt
            </div>
          </div>
        </div>

        {/* Psychological & Cognitive Traits */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            人間性の特性値 (Traits)
          </h4>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>好奇心 (探索・新発見の原動力)</span>
                <span className="tabular-nums font-semibold text-slate-200">{agent.traits.curiosity}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: `${agent.traits.curiosity}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>共感性 (他者支援・痛みの理解)</span>
                <span className="tabular-nums font-semibold text-slate-200">{agent.traits.empathy}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-400 h-full" style={{ width: `${agent.traits.empathy}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>協調度 (群れのルールへの順応・分配)</span>
                <span className="tabular-nums font-semibold text-slate-200">{agent.traits.cooperation}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: `${agent.traits.cooperation}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>伝達力 (身振り・言語による意思疎通)</span>
                <span className="tabular-nums font-semibold text-slate-200">{agent.traits.communication}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full" style={{ width: `${agent.traits.communication}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Change Role Section */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 mb-2">役割の任命</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {roles.map((r) => {
              const isCurrent = agent.role === r.type;
              return (
                <button
                  key={r.type}
                  onClick={() => onRoleChange(agent.id, r.type)}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer min-h-[44px] ${
                    isCurrent
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="text-xs font-semibold flex items-center justify-between">
                    <span>{r.label}</span>
                    {isCurrent && <span className="text-[10px] text-amber-400">現職</span>}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{r.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
