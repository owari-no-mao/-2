import React from 'react';
import { Compass, Users, Milestone, Sliders, BookOpen } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenGuide: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenGuide,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 items-center h-16 pb-safe">
      <button
        onClick={() => onTabChange('world')}
        className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'world' ? 'text-amber-400 font-semibold' : 'text-slate-400'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] mt-1">生活圏</span>
      </button>

      <button
        onClick={() => onTabChange('resources')}
        className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'resources' ? 'text-amber-400 font-semibold' : 'text-slate-400'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px] mt-1">社会・掟</span>
      </button>

      <button
        onClick={() => onTabChange('evolution')}
        className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'evolution' ? 'text-amber-400 font-semibold' : 'text-slate-400'
        }`}
      >
        <Milestone className="w-5 h-5" />
        <span className="text-[10px] mt-1">文明段階</span>
      </button>

      <button
        onClick={() => onTabChange('sandbox')}
        className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'sandbox' ? 'text-amber-400 font-semibold' : 'text-slate-400'
        }`}
      >
        <Sliders className="w-5 h-5" />
        <span className="text-[10px] mt-1">実験</span>
      </button>

      <button
        onClick={onOpenGuide}
        className="flex flex-col items-center justify-center h-full min-h-[44px] text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
      >
        <BookOpen className="w-5 h-5 text-amber-400" />
        <span className="text-[10px] mt-1">知見</span>
      </button>
    </nav>
  );
};
