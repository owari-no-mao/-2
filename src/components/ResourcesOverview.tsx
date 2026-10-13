import React from 'react';
import { Resources, SocietyPolicy, RoleType, Agent } from '../types/simulation';
import { Apple, Flame, Wrench, Trees, Sparkles, Users } from 'lucide-react';

interface ResourcesOverviewProps {
  resources: Resources;
  agents: Agent[];
  policy: SocietyPolicy;
  onUpdatePolicy: (policy: Partial<SocietyPolicy>) => void;
  onAssignRole: (agentId: string, role: RoleType) => void;
}

export const ResourcesOverview: React.FC<ResourcesOverviewProps> = ({
  resources,
  agents,
  policy,
  onUpdatePolicy,
}) => {
  const population = agents.length;
  const avgMorale = Math.round(agents.reduce((acc, a) => acc + a.morale, 0) / (population || 1));
  const avgWisdom = Math.round(agents.reduce((acc, a) => acc + a.wisdom, 0) / (population || 1));
  const foragers = agents.filter(a => a.role === 'forager').length;
  const explorers = agents.filter(a => a.role === 'explorer').length;
  const firekeepers = agents.filter(a => a.role === 'firekeeper').length;
  const crafters = agents.filter(a => a.role === 'crafter').length;
  const elders = agents.filter(a => a.role === 'elder').length;

  return (
    <div className="space-y-6">
      {/* 1. Resources Bar Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Food */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5 text-emerald-400" />
              食糧
            </span>
            <span className="tabular-nums">消費 ~{(population * 0.45).toFixed(1)}/日</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-100 tabular-nums">
            {Math.round(resources.food)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {resources.food < 15 ? '● 欠乏警報' : resources.food > 100 ? '● 豊かな備蓄' : '● 安定供給'}
          </div>
        </div>

        {/* Wood */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 text-amber-500" />
              薪・素材
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-100 tabular-nums">
            {Math.round(resources.wood)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            火の燃料・道具材料
          </div>
        </div>

        {/* Fire */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              火の維持
            </span>
            <span className="tabular-nums">{Math.round(resources.fire)}%</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-100 tabular-nums">
            {resources.fire > 75 ? '燃え盛る' : resources.fire > 25 ? '持続中' : resources.fire > 0 ? '消えかけ' : '鎮火'}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${resources.fire > 30 ? 'bg-orange-500' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(100, resources.fire)}%` }}
            />
          </div>
        </div>

        {/* Tools */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-indigo-400" />
              石器・道具
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-100 tabular-nums">
            {Math.round(resources.tools)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            採集・探索効率を向上
          </div>
        </div>

        {/* Wisdom Stock */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              知恵の蓄積
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-400 tabular-nums">
            {Math.round(resources.wisdomStock)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            世代間伝承ミーム
          </div>
        </div>

        {/* Population */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              集団規模
            </span>
            <span className="tabular-nums">平均士気 {avgMorale}</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-100 tabular-nums">
            {population}名
          </div>
          <div className="text-xs text-slate-500 mt-1">
            平均知識 {avgWisdom}
          </div>
        </div>
      </div>

      {/* 2. Division of Labor (Roles) & Social Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-base font-semibold text-slate-100 mb-1">
            労働の分業と役割配分
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            全員が同じ行動をする動物から、役割を分担する「社会」への構造化
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm py-2 border-b border-slate-800/80">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                採集者 (Foragers)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">毎日の木の実・食糧確保</span>
                <span className="font-semibold text-slate-100 tabular-nums">{foragers}名</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm py-2 border-b border-slate-800/80">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                探索者 (Explorers)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">好奇心で未知の領域を開拓</span>
                <span className="font-semibold text-slate-100 tabular-nums">{explorers}名</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm py-2 border-b border-slate-800/80">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                火の守り人 (Firekeepers)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">薪をくべ火種を維持</span>
                <span className="font-semibold text-slate-100 tabular-nums">{firekeepers}名</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm py-2 border-b border-slate-800/80">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                道具職人 (Crafters)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">石器・棒を加工し道具生産</span>
                <span className="font-semibold text-slate-100 tabular-nums">{crafters}名</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm py-2">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                長老・語り部 (Elders)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">知恵の継承・士気向上</span>
                <span className="font-semibold text-slate-100 tabular-nums">{elders}名</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4">
            ※個体の役割は、サバンナ生活圏の各人をタップして変更できます。
          </div>
        </div>

        {/* Social Policies & Institutions */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-base font-semibold text-slate-100 mb-1">
            社会の掟と制度 (Institutions)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            本能の支配を脱し、集団のルールで協調を維持するメカニズム
          </p>

          <div className="space-y-4">
            {/* Food Sharing */}
            <div>
              <div className="text-xs font-medium text-slate-300 mb-1.5">
                食糧の分配ルール
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onUpdatePolicy({ foodSharing: 'equal' })}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-left ${
                    policy.foodSharing === 'equal'
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">完全平等分配</div>
                  <div className="text-[10px] text-slate-500">共感性と結束を最重視</div>
                </button>
                <button
                  onClick={() => onUpdatePolicy({ foodSharing: 'need' })}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-left ${
                    policy.foodSharing === 'need'
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">貢献・必要度優先</div>
                  <div className="text-[10px] text-slate-500">職人・弱者へ重点配分</div>
                </button>
                <button
                  onClick={() => onUpdatePolicy({ foodSharing: 'hunter_first' })}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-left ${
                    policy.foodSharing === 'hunter_first'
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">獲得者優先 (動物的)</div>
                  <div className="text-[10px] text-slate-500">強い者が独占・不満増</div>
                </button>
              </div>
            </div>

            {/* Communication Medium */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>コミュニケーションの形態</span>
                <span className="text-amber-400 font-medium">
                  {policy.communicationNorm === 'gestures' && '身振りと警告音 (原初)'}
                  {policy.communicationNorm === 'spoken' && '発話言語 (噂話と意思疎通)'}
                  {policy.communicationNorm === 'myths' && '神話と言語 (虚構の共有)'}
                  {policy.communicationNorm === 'symbols' && '象形文字・成文法 (外部記録)'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                文明ステージが上がるにつれて高度化し、集団全体の知恵伝播速度が増加します。
              </p>
            </div>

            {/* Conflict resolution */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>紛争・もめごとの解決法</span>
                <span className="text-slate-200 font-medium">
                  {policy.conflictResolution === 'dominance' && '腕力・優位の暴力'}
                  {policy.conflictResolution === 'council' && '焚き火を囲む長老会議'}
                  {policy.conflictResolution === 'law' && '石碑に刻まれた掟（法）'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                暴力による制裁から、合意と客観的ルールへの移行が文明化の証拠です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
