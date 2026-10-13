export type StageId = 'primal' | 'fire' | 'myth' | 'settlement' | 'law';

export interface StageInfo {
  id: StageId;
  name: string;
  subtitle: string;
  description: string;
  requiredWisdom: number;
  requiredPopulation: number;
  unlockedFeatures: string[];
  historicalContext: string;
}

export type RoleType = 'forager' | 'explorer' | 'firekeeper' | 'crafter' | 'elder';

export interface AgentTraits {
  curiosity: number;    // 0 - 100: 好奇心（探索・技術発見）
  empathy: number;      // 0 - 100: 共感（他者支援・争い抑止）
  cooperation: number;  // 0 - 100: 協調性（分配・チーム行動）
  communication: number;// 0 - 100: 伝達能力（言語・ミーム拡散）
}

export interface Agent {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;          // 年齢（寿命はおよそ50〜65）
  generation: number;   // 世代
  health: number;       // 0 - 100
  hunger: number;       // 0 - 100 (0=満腹, 100=飢餓)
  morale: number;       // 0 - 100 (幸福度・精神状態)
  wisdom: number;       // 個人の蓄積知識
  traits: AgentTraits;
  role: RoleType;
  x: number;            // Canvas座標
  y: number;
  targetX: number;
  targetY: number;
  currentAction: 'wandering' | 'gathering' | 'resting' | 'talking' | 'crafting' | 'tending_fire';
  speechBubble?: {
    icon: string;
    text: string;
    duration: number;
  };
}

export interface Resources {
  food: number;         // 食糧
  wood: number;         // 薪・素材
  tools: number;        // 石器・道具
  fire: number;         // 火の勢い (0 - 100%)
  wisdomStock: number;  // 蓄積された知恵・ミーム
}

export interface SocietyPolicy {
  foodSharing: 'equal' | 'need' | 'hunter_first'; // 分配ルール
  communicationNorm: 'gestures' | 'spoken' | 'myths' | 'symbols'; // コミュニケーション形態
  conflictResolution: 'dominance' | 'council' | 'law'; // 紛争解決手法
  fireProtectionDuty: boolean; // 火の番制度
  oralHistoryTradition: boolean; // 語り部による伝承制度
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  effectDescription: string;
  wisdomCost?: number;
  effects: {
    wisdomChange?: number;
    moraleChange?: number;
    foodChange?: number;
    fireChange?: number;
    curiosityBonus?: number;
    empathyBonus?: number;
    cooperationBonus?: number;
    policyUpdate?: Partial<SocietyPolicy>;
  };
}

export interface DecisionEvent {
  id: string;
  title: string;
  era: StageId;
  question: string;
  context: string;
  options: DecisionOption[];
  triggerCondition: (state: SimulationState) => boolean;
}

export interface LogEntry {
  id: string;
  year: number;
  season: '春' | '夏' | '秋' | '冬';
  text: string;
  type: 'milestone' | 'discovery' | 'crisis' | 'birth' | 'death' | 'decision';
}

export interface SimulationStats {
  births: number;
  deaths: number;
  discoveries: number;
  decisionsMade: number;
  historyTimeline: {
    year: number;
    population: number;
    wisdom: number;
    food: number;
  }[];
}

export interface SimulationState {
  stage: StageId;
  year: number;
  day: number;
  season: '春' | '夏' | '秋' | '冬';
  speed: 0 | 1 | 2 | 5; // 0=停止, 1=等速, 2=倍速, 5=高速
  resources: Resources;
  agents: Agent[];
  policy: SocietyPolicy;
  stats: SimulationStats;
  logs: LogEntry[];
  activeDecision: DecisionEvent | null;
  resolvedDecisionIds: string[];
}
