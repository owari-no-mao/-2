import React, { useState } from 'react';
import { SimulationState } from '../types/simulation';
import { Download, Upload, Sliders, RefreshCw, Check } from 'lucide-react';

interface SandboxControlsProps {
  state: SimulationState;
  onLoadState: (newState: SimulationState) => void;
  onReset: () => void;
}

export const SandboxControls: React.FC<SandboxControlsProps> = ({
  state,
  onLoadState,
  onReset,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Local storage save
  const handleSaveToLocal = () => {
    try {
      localStorage.setItem('fruit_of_wisdom_save', JSON.stringify(state));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      alert('保存に失敗しました。');
    }
  };

  // Local storage load
  const handleLoadFromLocal = () => {
    try {
      const saved = localStorage.getItem('fruit_of_wisdom_save');
      if (saved) {
        const parsed = JSON.parse(saved);
        onLoadState(parsed);
        setLoadError(null);
      } else {
        setLoadError('保存データが見つかりません。');
      }
    } catch {
      setLoadError('セーブデータの読み込みに失敗しました。');
    }
  };

  // JSON Export
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fruit_of_wisdom_year${state.year}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // JSON Import
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onLoadState(json);
        setLoadError(null);
      } catch {
        setLoadError('無効なJSONファイルです。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-slate-100">
            社会シミュレーション実験サンドボックス
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          条件を変えて人類の文明成立条件をテストできます。GitHub上での共有や、将来Android端末へ移行した際にも状態を保存・復元できます。
        </p>

        {/* Save & Load Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={handleSaveToLocal}
            className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-colors cursor-pointer min-h-[44px]"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
              <span>ブラウザに即時保存</span>
              {saveSuccess && <Check className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="text-[11px] text-slate-400">
              LocalStorageに現在の文明状態を記録
            </div>
          </button>

          <button
            onClick={handleLoadFromLocal}
            className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-colors cursor-pointer min-h-[44px]"
          >
            <div className="text-xs font-semibold text-slate-200 mb-1">
              保存データから再開
            </div>
            <div className="text-[11px] text-slate-400">
              直近に保存した文明を読み込む
            </div>
          </button>

          <button
            onClick={handleExportJSON}
            className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-colors cursor-pointer min-h-[44px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
              <span>JSONで書き出し</span>
              <Download className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-[11px] text-slate-400">
              研究データ・バックアップとして保存
            </div>
          </button>

          <label className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-colors cursor-pointer min-h-[44px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
              <span>JSONから復元</span>
              <Upload className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-[11px] text-slate-400">
              外部ファイルをアップロードして実行
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>

        {loadError && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {loadError}
          </div>
        )}
      </div>

      {/* Reset Caution */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">
            シミュレーション初期化
          </h4>
          <p className="text-xs text-slate-400">
            群れを最初の第1年・原初の群れ（6名）の状態にリセットします。
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4" />
          最初からやり直す
        </button>
      </div>
    </div>
  );
};
