import React from 'react';
import { ANTHROPOLOGY_GUIDES } from '../simulation/constants';
import { X, BookOpen, Sparkles } from 'lucide-react';
import heroImage from '../assets/images/hero_wisdom_tree_1791893717128.jpg';

interface AnthropologyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnthropologyGuideModal: React.FC<AnthropologyGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Hero Visual Header */}
        <div className="relative h-48 sm:h-60 w-full overflow-hidden shrink-0">
          <img
            src={heroImage}
            alt="知恵の樹と初期人類の集落"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>人類学・進化心理学の探求</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                どうやって人は動物から「文明」を作ったのか？
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-sm text-slate-300 leading-relaxed">
            人間は鋭い牙も頑強な皮膚も持たない、か弱いサルの一種でした。しかし「火」「コミュニケーション」「神話・掟」「文字」という一連のイノベーションの連鎖によって、地球上で唯一、生態系を大きく超える知的生命体へと進化しました。
          </p>

          <div className="space-y-4">
            {ANTHROPOLOGY_GUIDES.map((guide, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-300">
                    {guide.title}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {guide.author}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {guide.summary}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {guide.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
            <span className="font-bold">シミュレーションでの体験のコツ：</span>
            本ゲームでは、食糧の分配方法や火の維持、そして意思決定の掟を変えることで、群れの共感性や知恵の蓄積速度がどう変化するかを観察できます。人間の特性が社会をどう編み上げていくかを自由にお試しください。
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900/90">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer min-h-[44px]"
          >
            シミュレーターへ戻る
          </button>
        </div>
      </div>
    </div>
  );
};
