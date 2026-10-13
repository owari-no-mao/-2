import React from 'react';
import { Play, Pause, FastForward, RotateCcw, BookOpen } from 'lucide-react';
import { StageId } from '../types/simulation';
import { STAGES } from '../simulation/constants';

interface HeaderProps {
  currentStage: StageId;
  year: number;
  season: '春' | '夏' | '秋' | '冬';
  day: number;
  speed: 0 | 1 | 2 | 5;
  onSpeedChange: (speed: 0 | 1 | 2 | 5) => void;
  onReset: () => void;
  onOpenGuide: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  year,
  season,
  day,
  speed,
  onSpeedChange,
  onReset,
  onOpenGuide,
  activeTab,
  onTabChange,
}) => {
  const stageInfo = STAGES[currentStage];

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-slate-900 border-b border-slate-800 text-slate-100">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="text-xl font-bold tracking-tight text-amber-400 whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors">
          知恵の実
        </a>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span>{stageInfo.name}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">第{year}年 {season} ({day}日)</span>
        </div>
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onTabChange('world')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${activeTab === 'world' ? 'text-amber-400 font-semibold' : ''}`}
        >
          サバンナ生活圏
        </button>
        <button
          onClick={() => onTabChange('resources')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${activeTab === 'resources' ? 'text-amber-400 font-semibold' : ''}`}
        >
          社会とリソース
        </button>
        <button
          onClick={() => onTabChange('evolution')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${activeTab === 'evolution' ? 'text-amber-400 font-semibold' : ''}`}
        >
          文明の進化段階
        </button>
        <button
          onClick={() => onTabChange('sandbox')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${activeTab === 'sandbox' ? 'text-amber-400 font-semibold' : ''}`}
        >
          実験・管理
        </button>
      </nav>

      {/* Zone 3: 1 primary action cluster (Simulation playback & guide trigger) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="人類学・文明の起源ガイド"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">文明の知見</span>
        </button>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => onSpeedChange(speed === 0 ? 1 : 0)}
            className={`p-1.5 rounded transition-colors cursor-pointer ${speed === 0 ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
            title={speed === 0 ? '再開' : '一時停止'}
          >
            {speed === 0 ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onSpeedChange(1)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${speed === 1 ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            1x
          </button>
          <button
            onClick={() => onSpeedChange(2)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${speed === 2 ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            2x
          </button>
          <button
            onClick={() => onSpeedChange(5)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${speed === 5 ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            <FastForward className="w-3.5 h-3.5 inline mr-0.5" />
            5x
          </button>
        </div>

        <button
          onClick={onReset}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
          title="シミュレーションを初期状態にリセット"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
