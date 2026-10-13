import {
  SimulationState,
  Agent,
  RoleType,
  StageId,
  LogEntry
} from '../types/simulation';
import {
  STAGES,
  INITIAL_NAMES_MALE,
  INITIAL_NAMES_FEMALE,
  DECISION_EVENTS
} from './constants';

export function createInitialAgent(id: string, name: string, gender: 'male' | 'female', age: number, role: RoleType): Agent {
  return {
    id,
    name,
    gender,
    age,
    generation: 1,
    health: 90 + Math.floor(Math.random() * 10),
    hunger: 20 + Math.floor(Math.random() * 20),
    morale: 75 + Math.floor(Math.random() * 20),
    wisdom: 5 + Math.floor(Math.random() * 10),
    traits: {
      curiosity: 40 + Math.floor(Math.random() * 30),
      empathy: 45 + Math.floor(Math.random() * 30),
      cooperation: 50 + Math.floor(Math.random() * 25),
      communication: 35 + Math.floor(Math.random() * 30),
    },
    role,
    x: 400 + (Math.random() - 0.5) * 200,
    y: 260 + (Math.random() - 0.5) * 160,
    targetX: 400 + (Math.random() - 0.5) * 200,
    targetY: 260 + (Math.random() - 0.5) * 160,
    currentAction: 'wandering',
  };
}

export function createInitialSimulation(): SimulationState {
  const initialAgents: Agent[] = [
    createInitialAgent('agent_1', 'オロ', 'male', 28, 'explorer'),
    createInitialAgent('agent_2', 'メイ', 'female', 26, 'forager'),
    createInitialAgent('agent_3', 'カル', 'male', 42, 'elder'),
    createInitialAgent('agent_4', 'ルナ', 'female', 21, 'forager'),
    createInitialAgent('agent_5', 'タム', 'male', 19, 'forager'),
    createInitialAgent('agent_6', 'セラ', 'female', 35, 'firekeeper'),
  ];

  return {
    stage: 'primal',
    year: 1,
    day: 1,
    season: '春',
    speed: 1,
    resources: {
      food: 60,
      wood: 25,
      tools: 4,
      fire: 40,
      wisdomStock: 15,
    },
    agents: initialAgents,
    policy: {
      foodSharing: 'equal',
      communicationNorm: 'gestures',
      conflictResolution: 'council',
      fireProtectionDuty: false,
      oralHistoryTradition: false,
    },
    stats: {
      births: 0,
      deaths: 0,
      discoveries: 1,
      decisionsMade: 0,
      historyTimeline: [
        { year: 1, population: 6, wisdom: 15, food: 60 }
      ],
    },
    logs: [
      {
        id: 'log_init',
        year: 1,
        season: '春',
        text: '知恵の実シミュレーション開始。サバンナの木陰で、原初の群れ（6名）が互いの身振りと言葉を探り合っています。',
        type: 'milestone'
      }
    ],
    activeDecision: null,
    resolvedDecisionIds: [],
  };
}

export function stepSimulation(prev: SimulationState): SimulationState {
  // If paused or decision is awaiting response, hold engine
  if (prev.speed === 0 || prev.activeDecision !== null) {
    return prev;
  }

  const next = { ...prev };
  next.resources = { ...prev.resources };
  next.policy = { ...prev.policy };
  next.stats = { ...prev.stats };
  const newLogs: LogEntry[] = [...prev.logs];

  // Advance time
  let nextDay = prev.day + 1;
  let nextYear = prev.year;
  let nextSeason = prev.season;

  if (nextDay > 30) {
    nextDay = 1;
    if (prev.season === '春') nextSeason = '夏';
    else if (prev.season === '夏') nextSeason = '秋';
    else if (prev.season === '秋') nextSeason = '冬';
    else {
      nextSeason = '春';
      nextYear += 1;
      // Record history timeline point
      next.stats.historyTimeline = [
        ...next.stats.historyTimeline.slice(-30),
        {
          year: nextYear,
          population: prev.agents.length,
          wisdom: Math.round(next.resources.wisdomStock),
          food: Math.round(next.resources.food),
        }
      ];
    }
  }

  next.day = nextDay;
  next.year = nextYear;
  next.season = nextSeason;

  // Fire dynamics
  const fireKeepersCount = prev.agents.filter(a => a.role === 'firekeeper').length;
  if (fireKeepersCount > 0) {
    if (next.resources.wood >= 0.5) {
      next.resources.wood = Math.max(0, next.resources.wood - 0.2 * fireKeepersCount);
      next.resources.fire = Math.min(100, next.resources.fire + 1.2 * fireKeepersCount);
    } else {
      next.resources.fire = Math.max(0, next.resources.fire - 0.8);
    }
  } else {
    // Natural decay of fire
    next.resources.fire = Math.max(0, next.resources.fire - 1.0);
  }

  // Food consumption based on population
  const population = prev.agents.length;
  const foodConsumed = population * 0.45;
  next.resources.food = Math.max(0, next.resources.food - foodConsumed);

  // Check starvation crisis
  const isStarving = next.resources.food <= 0;

  // Update Agents
  let updatedAgents: Agent[] = [];
  let birthsCount = 0;
  let deathsCount = 0;

  for (const agent of prev.agents) {
    const updated = { ...agent, traits: { ...agent.traits } };

    // Ageing (approximately 1 year every 120 days)
    if (nextDay === 1 && nextSeason === '春') {
      updated.age += 1;
    }

    // Hunger and health
    if (isStarving) {
      updated.hunger = Math.min(100, updated.hunger + 8);
      updated.health = Math.max(0, updated.health - 6);
      updated.morale = Math.max(0, updated.morale - 8);
    } else {
      updated.hunger = Math.max(0, updated.hunger - 1);
      if (updated.health < 100) updated.health = Math.min(100, updated.health + 1);
    }

    // Role specific contributions
    if (updated.role === 'forager') {
      // Gather food based on season and cooperation
      const seasonalMultiplier = nextSeason === '秋' ? 1.4 : nextSeason === '冬' ? 0.6 : 1.0;
      const gathered = (1.2 + (updated.traits.cooperation / 100) * 0.8) * seasonalMultiplier;
      next.resources.food += gathered;

      if (Math.random() < 0.15) {
        next.resources.wood += 0.4;
      }
    } else if (updated.role === 'explorer') {
      // Curiosity-driven discoveries
      if (Math.random() < updated.traits.curiosity / 350) {
        const foundWisdom = 1.2;
        next.resources.wisdomStock += foundWisdom;
        updated.wisdom += 1;
        if (Math.random() < 0.3) {
          next.resources.tools += 0.2;
        }
      }
    } else if (updated.role === 'crafter') {
      if (next.resources.wood >= 1) {
        next.resources.wood -= 0.3;
        next.resources.tools += 0.2;
        next.resources.wisdomStock += 0.4;
      }
    } else if (updated.role === 'elder') {
      // Elder preserves morale, transmits wisdom to tribe
      next.resources.wisdomStock += 0.6 + (updated.traits.communication / 100) * 0.8;
      updated.morale = Math.min(100, updated.morale + 0.5);
    }

    // Fire impact on morale and wisdom
    if (next.resources.fire > 50) {
      updated.morale = Math.min(100, updated.morale + 0.4);
      // Fire cooking increases wisdom gain
      next.resources.wisdomStock += 0.1;
    } else if (next.resources.fire < 10 && nextSeason === '冬') {
      updated.health = Math.max(0, updated.health - 2);
      updated.morale = Math.max(0, updated.morale - 2);
    }

    // Movement & Speech behavior
    if (Math.random() < 0.08 || (Math.abs(updated.x - updated.targetX) < 5 && Math.abs(updated.y - updated.targetY) < 5)) {
      // Pick new wander target near center (tree & fire)
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 180;
      updated.targetX = Math.max(60, Math.min(740, 400 + Math.cos(angle) * distance));
      updated.targetY = Math.max(60, Math.min(420, 240 + Math.sin(angle) * distance));

      // Decide action
      if (next.resources.fire > 20 && Math.random() < 0.35) {
        updated.currentAction = 'tending_fire';
      } else if (updated.role === 'forager' && Math.random() < 0.4) {
        updated.currentAction = 'gathering';
      } else if (Math.random() < 0.3) {
        updated.currentAction = 'talking';
      } else {
        updated.currentAction = 'wandering';
      }
    }

    // Smooth movement towards target
    const dx = updated.targetX - updated.x;
    const dy = updated.targetY - updated.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 3) {
      const speed = 1.6;
      updated.x += (dx / dist) * speed;
      updated.y += (dy / dist) * speed;
    }

    // Communication bubbles
    if (updated.speechBubble) {
      updated.speechBubble.duration -= 1;
      if (updated.speechBubble.duration <= 0) {
        delete updated.speechBubble;
      }
    } else if (Math.random() < 0.015) {
      // Generate bubble based on era and traits
      let icon = '💬';
      let text = '…';
      if (next.stage === 'primal') {
        const primalSounds = ['ウー！', 'ガッ！', '木の実！', '危険！', '火？'];
        text = primalSounds[Math.floor(Math.random() * primalSounds.length)];
        icon = text === '危険！' ? '⚠️' : '🍎';
      } else if (next.stage === 'fire') {
        const fireTopics = ['暖かい', '肉が柔らかい', '火を守ろう', '夜が怖くない'];
        text = fireTopics[Math.floor(Math.random() * fireTopics.length)];
        icon = '🔥';
      } else if (next.stage === 'myth') {
        const mythTopics = ['空の精霊', '昨日の夢', '星の神話', '明日の約束'];
        text = mythTopics[Math.floor(Math.random() * mythTopics.length)];
        icon = '✨';
      } else if (next.stage === 'settlement') {
        const settleTopics = ['畑の収穫', '新しい石斧', '家を建てよう', '保存食'];
        text = settleTopics[Math.floor(Math.random() * settleTopics.length)];
        icon = '🌾';
      } else {
        const lawTopics = ['掟を刻もう', '知恵の石碑', '正義の裁定', '未来へ'];
        text = lawTopics[Math.floor(Math.random() * lawTopics.length)];
        icon = '📜';
      }

      updated.speechBubble = { icon, text, duration: 45 };
      // Communication spreads wisdom among peers
      next.resources.wisdomStock += 0.2;
    }

    // Life and death check
    const isOld = updated.age > 50 && Math.random() < (updated.age - 50) * 0.0008;
    if (updated.health <= 0 || isOld) {
      deathsCount += 1;
      // Leaving legacy wisdom
      next.resources.wisdomStock += updated.wisdom * 0.4;
      newLogs.unshift({
        id: `log_death_${Date.now()}_${updated.id}`,
        year: nextYear,
        season: nextSeason,
        text: `${updated.name}（${updated.age}歳・${getRoleLabel(updated.role)}）が生涯を終えました。その知恵は群れの記憶として刻まれました。`,
        type: 'death'
      });
    } else {
      updatedAgents.push(updated);
    }
  }

  // Birth mechanism (when food is abundant, high morale, and below population cap)
  const canReproduce = next.resources.food > updatedAgents.length * 5 && updatedAgents.length < 35 && updatedAgents.length >= 2;
  if (canReproduce && Math.random() < 0.035) {
    const parentA = updatedAgents[Math.floor(Math.random() * updatedAgents.length)];
    const parentB = updatedAgents[Math.floor(Math.random() * updatedAgents.length)];
    const gender: 'male' | 'female' = Math.random() > 0.5 ? 'male' : 'female';
    const namePool = gender === 'male' ? INITIAL_NAMES_MALE : INITIAL_NAMES_FEMALE;
    const name = namePool[Math.floor(Math.random() * namePool.length)] + (nextYear > 1 ? `二世` : '');

    const child: Agent = {
      id: `agent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      gender,
      age: 1,
      generation: Math.max(parentA.generation, parentB.generation) + 1,
      health: 100,
      hunger: 10,
      morale: 90,
      wisdom: Math.floor((parentA.wisdom + parentB.wisdom) * 0.25) + 5,
      traits: {
        curiosity: Math.min(100, Math.max(10, Math.round((parentA.traits.curiosity + parentB.traits.curiosity) / 2 + (Math.random() - 0.5) * 15))),
        empathy: Math.min(100, Math.max(10, Math.round((parentA.traits.empathy + parentB.traits.empathy) / 2 + (Math.random() - 0.5) * 15))),
        cooperation: Math.min(100, Math.max(10, Math.round((parentA.traits.cooperation + parentB.traits.cooperation) / 2 + (Math.random() - 0.5) * 15))),
        communication: Math.min(100, Math.max(10, Math.round((parentA.traits.communication + parentB.traits.communication) / 2 + (Math.random() - 0.5) * 15))),
      },
      role: 'forager',
      x: parentA.x + (Math.random() - 0.5) * 20,
      y: parentA.y + (Math.random() - 0.5) * 20,
      targetX: 400,
      targetY: 240,
      currentAction: 'resting',
      speechBubble: { icon: '🌱', text: '新しい命', duration: 40 }
    };

    birthsCount += 1;
    updatedAgents.push(child);
    next.resources.food -= 10;
    newLogs.unshift({
      id: `log_birth_${Date.now()}`,
      year: nextYear,
      season: nextSeason,
      text: `新たな命【${child.name}】が誕生しました！群れの未来を担う世代です。`,
      type: 'birth'
    });
  }

  next.agents = updatedAgents;
  next.stats.births += birthsCount;
  next.stats.deaths += deathsCount;

  // Stage Advancement Check
  const currentStageInfo = STAGES[next.stage];
  const stageOrder: StageId[] = ['primal', 'fire', 'myth', 'settlement', 'law'];
  const currentIndex = stageOrder.indexOf(next.stage);

  if (currentIndex < stageOrder.length - 1) {
    const nextStageId = stageOrder[currentIndex + 1];
    const nextStageInfo = STAGES[nextStageId];

    if (
      next.resources.wisdomStock >= nextStageInfo.requiredWisdom &&
      next.agents.length >= nextStageInfo.requiredPopulation
    ) {
      next.stage = nextStageId;
      newLogs.unshift({
        id: `log_stage_${nextStageId}_${Date.now()}`,
        year: nextYear,
        season: nextSeason,
        text: `【文明の飛躍】集団は新たな時代『${nextStageInfo.name} — ${nextStageInfo.subtitle}』へと進化しました！`,
        type: 'milestone'
      });
    }
  }

  // Trigger Decision Events
  if (!next.activeDecision) {
    for (const evt of DECISION_EVENTS) {
      if (!next.resolvedDecisionIds.includes(evt.id) && evt.triggerCondition(next)) {
        next.activeDecision = evt;
        break;
      }
    }
  }

  // Cap logs to most recent 40 items
  next.logs = newLogs.slice(0, 40);

  return next;
}

export function getRoleLabel(role: RoleType): string {
  switch (role) {
    case 'forager': return '採集者';
    case 'explorer': return '探索者';
    case 'firekeeper': return '火の守り人';
    case 'crafter': return '道具職人';
    case 'elder': return '長老・語り部';
  }
}

export function applyDecision(
  state: SimulationState,
  decisionId: string,
  optionId: string
): SimulationState {
  const event = DECISION_EVENTS.find(e => e.id === decisionId);
  if (!event) return state;

  const option = event.options.find(o => o.id === optionId);
  if (!option) return state;

  const next = { ...state };
  next.resources = { ...state.resources };
  next.policy = { ...state.policy, ...(option.effects.policyUpdate || {}) };
  next.resolvedDecisionIds = [...state.resolvedDecisionIds, decisionId];
  next.activeDecision = null;
  next.stats.decisionsMade += 1;

  if (option.effects.wisdomChange) {
    next.resources.wisdomStock = Math.max(0, next.resources.wisdomStock + option.effects.wisdomChange);
  }
  if (option.effects.foodChange) {
    next.resources.food = Math.max(0, next.resources.food + option.effects.foodChange);
  }
  if (option.effects.fireChange) {
    next.resources.fire = Math.min(100, Math.max(0, next.resources.fire + option.effects.fireChange));
  }

  // Modify agents traits
  if (option.effects.curiosityBonus || option.effects.empathyBonus || option.effects.cooperationBonus || option.effects.moraleChange) {
    next.agents = next.agents.map(a => ({
      ...a,
      morale: Math.min(100, Math.max(0, a.morale + (option.effects.moraleChange || 0))),
      traits: {
        ...a.traits,
        curiosity: Math.min(100, Math.max(0, a.traits.curiosity + (option.effects.curiosityBonus || 0))),
        empathy: Math.min(100, Math.max(0, a.traits.empathy + (option.effects.empathyBonus || 0))),
        cooperation: Math.min(100, Math.max(0, a.traits.cooperation + (option.effects.cooperationBonus || 0))),
      }
    }));
  }

  next.logs = [
    {
      id: `log_decision_${Date.now()}`,
      year: state.year,
      season: state.season,
      text: `【掟の議決】『${event.title}』にて「${option.label}」が採択されました。(${option.effectDescription})`,
      type: 'decision' as const
    },
    ...state.logs
  ].slice(0, 40);

  return next;
}
