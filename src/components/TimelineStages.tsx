import React from 'react';
import { StageId, LogEntry } from '../types/simulation';
import { STAGES } from '../simulation/constants';
import { CheckCircle2, Lock, Milestone, History } from 'lucide-react';

interface TimelineStagesProps {
  currentStage: StageId;
  wisdomStock: number;
  population: number;
  logs: LogEntry[];
}

export const TimelineStages: React.FC<TimelineStagesProps> = ({
  currentStage,
  wisdomStock,
  population,
  logs,
}) => {
  const stageKeys: StageId[] = ['primal', 'fire', 'myth', 'settlement', 'law'];
  const currentIndex = stageKeys.indexOf(currentStage);

  return (
    <div className="space-y-8">
      {/* 1. Evolutionary Stages Roadmap */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Milestone className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-slate-100">
            文明の5大進化段階 (Stages of Civilization)
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          人類が動物から知的生命体へと飛躍する過程を、知恵の蓄積と集団規模の拡大によって段階的に推進します。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stageKeys.map((key, idx) => {
            const info = STAGES[key];
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isLocked = idx > currentIndex;

            return (
              <div
                key={key}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-slate-900 border-amber-400/80 shadow-lg shadow-amber-400/5'
                    : isCompleted
                    ? 'bg-slate-900/60 border-slate-700/60 opacity-90'
                    : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-400">STAGE 0{idx + 1}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="text-amber-400 font-bold text-[11px]">現在到達</span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mb-0.5">
                    {info.name}
                  </h4>
                  <div className="text-xs text-amber-400/90 font-medium mb-2">
                    {info.subtitle}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-3">
                    {info.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div>
                    条件: 知恵 <span className="text-slate-200 font-medium tabular-nums">{info.requiredWisdom}</span>
                  </div>
                  <div>
                    条件: 人口 <span className="text-slate-200 font-medium tabular-nums">{info.requiredPopulation}人</span>
                  </div>
                  {isCurrent && idx < stageKeys.length - 1 && (
                    <div className="mt-2 text-amber-400 text-[10px]">
                      次段階まであと: 知恵 {Math.max(0, STAGES[stageKeys[idx + 1]].requiredWisdom - Math.round(wisdomStock))}pt
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Detailed Era Chronicle and Context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Era Anthropological Profile */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h4 className="text-sm font-semibold text-slate-200 mb-1">
            現在の時代背景：{STAGES[currentStage].name}
          </h4>
          <p className="text-xs text-slate-400 mb-4">
            {STAGES[currentStage].historicalContext}
          </p>

          <div className="space-y-2 text-xs">
            <span className="font-medium text-slate-300">解放された特性・技術：</span>
            <ul className="space-y-1.5 text-slate-400 pl-4 list-disc">
              {STAGES[currentStage].unlockedFeatures.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Historical Chronicles (Logs) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[320px]">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-200">
              群れの年代記 (Chronicle Log)
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-2">
            {logs.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">記録はありません</div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs flex items-start gap-2.5"
                >
                  <span className="text-slate-500 shrink-0 tabular-nums">
                    第{log.year}年 {log.season}
                  </span>
                  <span className="text-slate-300 flex-1 leading-relaxed">
                    {log.text}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
