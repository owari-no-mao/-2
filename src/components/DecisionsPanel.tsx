import React from 'react';
import { DecisionEvent } from '../types/simulation';
import { Scale, CheckCircle2 } from 'lucide-react';

interface DecisionsModalProps {
  decision: DecisionEvent | null;
  onChooseOption: (decisionId: string, optionId: string) => void;
}

export const DecisionsModal: React.FC<DecisionsModalProps> = ({
  decision,
  onChooseOption,
}) => {
  if (!decision) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Glow header */}
        <div className="flex items-center gap-2.5 text-xs text-amber-400 font-semibold mb-2">
          <Scale className="w-4 h-4" />
          <span>知恵の実の選択 — 集団の合意形成</span>
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-2">
          {decision.title}
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {decision.question}
        </p>

        {/* Anthropological context callout */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 mb-5 leading-relaxed">
          <span className="font-semibold text-slate-300">文明の背景：</span>
          {decision.context}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {decision.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onChooseOption(decision.id, opt.id)}
              className="w-full text-left p-4 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/80 transition-all cursor-pointer group min-h-[48px]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {opt.label}
                </span>
                <span className="text-xs text-amber-400/90 font-medium">
                  選択する →
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">
                {opt.description}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>影響: {opt.effectDescription}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
