import { StageId, StageInfo, DecisionEvent } from '../types/simulation';

export const STAGES: Record<StageId, StageInfo> = {
  primal: {
    id: 'primal',
    name: '原初の群れ',
    subtitle: '本能と警戒音の時代',
    description: '樹上からサバンナへと降り立った初期人類。肉食獣への恐怖、身振りと叫びによる危険伝達、木の実の採集が生活の中心。',
    requiredWisdom: 0,
    requiredPopulation: 6,
    unlockedFeatures: ['採集', '身振りコミュニケーション', '群れの形成'],
    historicalContext: '約300万〜200万年前。アウストラロピテクス期。道具はまだ粗雑な自然石。社会の規模はダンバー数以前の家族小集団（10〜20人）に限られていました。'
  },
  fire: {
    id: 'fire',
    name: '火と囲炉裏',
    subtitle: '加熱調理と夜の団欒',
    description: '落雷の火を採取・維持することに成功。食物を加熱することで消化エネルギーが激減し、脳の容量が飛躍的に拡大。夜の火を囲むことで会話の萌芽が生まれる。',
    requiredWisdom: 50,
    requiredPopulation: 10,
    unlockedFeatures: ['火の維持と調理', '夜の集会', '石器の初歩加工'],
    historicalContext: '約150万〜40万年前。ホモ・エレクトス期。火によって捕食者を撃退し、消化器官が縮小して脳へ大量のグルコースを供給可能になりました（リチャード・ランガムの料理仮説）。'
  },
  myth: {
    id: 'myth',
    name: '語りと神話',
    subtitle: '認知革命と虚構の力',
    description: '文法を持った言語の誕生。目の前にないもの（精霊、明日、約束）を語れるようになり、「神話」を共有することで見知らぬ他者とも数百人規模で協力可能になる。',
    requiredWisdom: 150,
    requiredPopulation: 16,
    unlockedFeatures: ['文法的発話', '精霊信仰と儀礼', '噂話による評判社会'],
    historicalContext: '約7万年前。ホモ・サピエンスの認知革命。単なる事実の伝達を超え、「目に見えない物語（フィクション）」を共有する能力が、サピエンスがネアンデルタール人を凌駕した最大の要因とされます。'
  },
  settlement: {
    id: 'settlement',
    name: '定住と分業',
    subtitle: '余剰食糧と役割の専門化',
    description: '採集から栽培・保存へ。生活拠点が定まり、全員が食糧を探す必要がなくなる。道具職人、守護者、知恵の継承者という「分業」が爆発的な生産性と技術革新をもたらす。',
    requiredWisdom: 350,
    requiredPopulation: 22,
    unlockedFeatures: ['道具の改良', '役割の専門化', '保存食と住居'],
    historicalContext: '約1万2000年前の新石器革命。定住により私有財産と家族制度、そして社会階層と専門職が成立。集団の知恵が「個人の頭脳」から「社会全体のネットワーク」へと移行しました。'
  },
  law: {
    id: 'law',
    name: '掟と文字',
    subtitle: '外部記憶と文明の成立',
    description: '記号を岩や粘土に刻み、掟（成文法）を布告。個人の死によって失われていた知識が「文字」として永遠に保存され、人類は真の知的生命体・文明へと到達する。',
    requiredWisdom: 650,
    requiredPopulation: 28,
    unlockedFeatures: ['成文法の制定', '文字と石碑の記録', '世代を超えた文明の継承'],
    historicalContext: '約5000年前のメソポタミア・エジプト。脳の生物学的限界を超え、社会制度と文字という「体外のハードディスク」を獲得したことで、人類は地球の生態系を超越する知的生命体となりました。'
  }
};

export const INITIAL_NAMES_MALE = ['オロ', 'カル', 'タム', 'ボア', 'エノ', 'アルク', 'シン', 'ロム'];
export const INITIAL_NAMES_FEMALE = ['メイ', 'ルナ', 'セラ', 'キナ', 'ミラ', 'ノア', 'アヤ', 'トモ'];

export const DECISION_EVENTS: DecisionEvent[] = [
  {
    id: 'primal_fruit_taste',
    title: '未知の木の実の発見',
    era: 'primal',
    question: '群れの仲間が、崖の向こうに群生する見たことのない鮮やかな赤色の木の実を見つけました。どうしますか？',
    context: '動物的本能は未知を恐れますが、好奇心は新しい栄養源と知恵をもたらします。リスクと報酬の最初の分岐点です。',
    triggerCondition: (s) => s.stage === 'primal' && s.year >= 1 && s.resources.wisdomStock >= 10,
    options: [
      {
        id: 'opt_taste_careful',
        label: '長老が少量だけ口にして確かめる',
        description: '好奇心旺盛な者が少量ずつ試して毒の有無を判別します。',
        effectDescription: '知恵 +15, 食糧 +20, 好奇心微増',
        effects: {
          wisdomChange: 15,
          foodChange: 20,
          curiosityBonus: 5,
        }
      },
      {
        id: 'opt_avoid',
        label: '危険を避け、慣れ親しんだ草の実だけを食べる',
        description: '安全を最優先にし、群れの生命を守ります。',
        effectDescription: '士気 +5, 知恵の変化なし',
        effects: {
          moraleChange: 5,
        }
      }
    ]
  },
  {
    id: 'primal_injured_kin',
    title: '骨折した仲間の保護',
    era: 'primal',
    question: '狩りの最中、若者が足を骨折して動けなくなりました。自然界の動物なら置き去りにして群れの移動を優先しますが、どうしますか？',
    context: '人類学者マーガレット・ミードは「文明の最初の兆候は、治癒した大腿骨の化石である」と語りました。他者を助ける共感こそが社会の原点です。',
    triggerCondition: (s) => s.stage === 'primal' && s.year >= 2 && s.resources.wisdomStock >= 25,
    options: [
      {
        id: 'opt_tend_kin',
        label: '群れ総出で看病し、食糧を分け与える',
        description: '移動速度は落ち、食糧消費が増えますが、絆と共感性が深まります。',
        effectDescription: '食糧 -25, 共感性 +15, 協調性 +10, 知恵 +20',
        effects: {
          foodChange: -25,
          empathyBonus: 15,
          cooperationBonus: 10,
          wisdomChange: 20,
        }
      },
      {
        id: 'opt_abandon',
        label: '生存を優先し、群れを急いで移動させる',
        description: '資源の無駄遣いを避け、群れ全体の絶滅リスクを減らします。',
        effectDescription: '食糧消費なし, 士気 -15, 共感性 -10',
        effects: {
          moraleChange: -15,
          empathyBonus: -10,
        }
      }
    ]
  },
  {
    id: 'fire_preserve_flame',
    title: '落雷の火種と夜の掟',
    era: 'fire',
    question: '乾燥した大木に落雷があり、燃え盛る火が現れました。煙を恐れず松明に移し替えることに成功しましたが、火を守り続けるには常に薪をくべる当番が必要です。',
    context: '火を操る唯一の動物が人類です。夜の闇を克服し、暖を取り、肉を焼くことで、人類の知性と胃袋は決定的に変わりました。',
    triggerCondition: (s) => s.stage === 'fire' && s.resources.fire <= 60,
    options: [
      {
        id: 'opt_establish_firekeeper',
        label: '「火の守り人」を指名し、絶やさぬ掟を作る',
        description: '労働力の一部を火の管理に専従させます。社会的な役割分担の第一歩です。',
        effectDescription: '火の勢い +40, 道具 -1, 知恵 +30, 火の番制度が施行',
        effects: {
          fireChange: 40,
          wisdomChange: 30,
          policyUpdate: { fireProtectionDuty: true }
        }
      },
      {
        id: 'opt_casual_fire',
        label: '消えたらまた自然の火を探せばよいと考える',
        description: '義務化せず、気ままに火を使います。',
        effectDescription: '火の勢い +10, 知恵 +5',
        effects: {
          fireChange: 10,
          wisdomChange: 5,
        }
      }
    ]
  },
  {
    id: 'myth_fireside_stories',
    title: '囲炉裏の語りと精霊の神話',
    era: 'myth',
    question: '満天の星空の下、長老が「あの輝く星々は、私たちを見守る先祖たちの目だ」と語り始めました。この空想の物語をどう扱いますか？',
    context: '客観的な事実（ライオンがいる）だけでなく、目に見えない虚構（先祖の霊・神・共同体）を信じることで、血縁を超えた数百人が団結できるようになります。',
    triggerCondition: (s) => s.stage === 'myth' && s.resources.wisdomStock >= 180,
    options: [
      {
        id: 'opt_embrace_myths',
        label: '先祖の物語を毎晩語り継ぎ、共通の信仰とする',
        description: '目に見えない絆が集団のモラルと規律を強化し、噂話から言語が発達します。',
        effectDescription: '士気 +25, 知恵 +40, 協調性 +15, 伝承制度が施行',
        effects: {
          moraleChange: 25,
          wisdomChange: 40,
          cooperationBonus: 15,
          policyUpdate: { oralHistoryTradition: true, communicationNorm: 'myths' }
        }
      },
      {
        id: 'opt_pragmatic_facts',
        label: '空想を退け、獲物の足跡など実用的な情報のみ話す',
        description: '現実的な情報伝達に徹します。生存効率は上がりますが、大きな理念の共有は遅れます。',
        effectDescription: '食糧 +30, 道具 +2, 知恵 +15',
        effects: {
          foodChange: 30,
          wisdomChange: 15,
        }
      }
    ]
  },
  {
    id: 'settlement_surplus_sharing',
    title: '余剰食糧と分配の正義',
    era: 'settlement',
    question: '畑と保存法により、その日に食べる量を超える「余剰食糧」が生まれました。この蓄えをどのように分配・管理しますか？',
    context: '余剰は富と格差の始まりであり、同時に専門職（職人・学者・指導者）を養う文明の基盤となります。',
    triggerCondition: (s) => s.stage === 'settlement' && s.resources.food >= 120,
    options: [
      {
        id: 'opt_equal_storage',
        label: '共同の蔵を作り、必要に応じて全員に平等配分する',
        description: '不満を最小化し、全員の健康を底上げします。',
        effectDescription: '共感性 +15, 協調性 +20, 士気 +20, 平等分配を施行',
        effects: {
          empathyBonus: 15,
          cooperationBonus: 20,
          moraleChange: 20,
          policyUpdate: { foodSharing: 'equal' }
        }
      },
      {
        id: 'opt_merit_crafters',
        label: '道具を作る職人や知恵の伝承者に多く報酬を与える',
        description: '専門職への投資により、技術と知恵の探求が急加速します。',
        effectDescription: '知恵 +60, 道具 +5, 協調性 -5',
        effects: {
          wisdomChange: 60,
          cooperationBonus: -5,
          policyUpdate: { foodSharing: 'need' }
        }
      }
    ]
  },
  {
    id: 'law_engrave_tablet',
    title: '掟の刻印 — 初めての文字',
    era: 'law',
    question: '長老たちが定めた社会の掟（人を傷つけてはならない、約束を守る、分業の権利）を、石碑に記号として刻む提案が出されました。',
    context: '口頭伝承は人の死や記憶の変容とともに消え去ります。記号・文字という「外部記憶」を得た瞬間、人類は生物の限界を超え、真の文明を築きます。',
    triggerCondition: (s) => s.stage === 'law' && s.resources.wisdomStock >= 450,
    options: [
      {
        id: 'opt_engrave_law',
        label: '中央広場に巨大な石碑を建て、成文法と記号を刻む',
        description: '掟を誰もが確認できる客観的事実とし、文字による教育を始めます。',
        effectDescription: '知恵 +100, 文明の礎が完成, 紛争解決が「法」へ進化',
        effects: {
          wisdomChange: 100,
          moraleChange: 15,
          policyUpdate: { conflictResolution: 'law', communicationNorm: 'symbols' }
        }
      },
      {
        id: 'opt_rely_on_elders',
        label: '文字刻印の手間を省き、これまで通り長老の口頭裁定に委ねる',
        description: '柔軟な裁量は残りますが、知恵の世代間蓄積速度は緩やかになります。',
        effectDescription: '食糧・道具の消費なし, 知恵 +20',
        effects: {
          wisdomChange: 20,
        }
      }
    ]
  }
];

export const ANTHROPOLOGY_GUIDES = [
  {
    title: '1. 火の調理仮説 (Cooking Hypothesis)',
    author: 'リチャード・ランガム (ハーバード大学人類学教授)',
    summary: '人類が他の霊長類と決定的に分かれた契機は「火による加熱調理」です。',
    detail: '生の食物を消化するには巨大な腸と数時間の咀嚼が必要でした。火で加熱することでカロリー吸収効率が劇的に高まり、不要になった消化管が縮小。その分の莫大なエネルギーが「脳」の肥大化（グルコース供給）に回されたとされています。'
  },
  {
    title: '2. 認知革命と虚構の共有 (Cognitive Revolution)',
    author: 'ユヴァル・ノア・ハラリ (『サピエンス全史』)',
    summary: '「実在しないもの」を信じる能力こそが、サピエンスを地球の覇者にしました。',
    detail: 'チンパンジーの群れは毛づくろいによる親密さに依存するため最大50頭程度しかまとめられません。しかし人類は「神」「掟」「国家」「通貨」といった架空の概念を信じることで、見ず知らずの何千人・何万人とも柔軟に協力できるようになりました。'
  },
  {
    title: '3. ダンバー数と噂話仮説 (Dunbar\'s Number & Gossip)',
    author: 'ロビン・ダンバー (オックスフォード大学進化心理学者)',
    summary: '言語は、毛づくろいの代わりに「誰が信頼できるか」を共有するために生まれた。',
    detail: '個体間の直接の毛づくろいでは時間が足りなくなったとき、人類は「言葉」で互いの評判を共有する「噂話」を始めました。これにより安定して関係を維持できる上限（ダンバー数＝約150人）まで集団を拡大させることが可能になりました。'
  },
  {
    title: '4. 協調の進化と自己家畜化 (Evolution of Cooperation)',
    author: 'マイケル・トマセロ (認知科学・発達心理学者)',
    summary: '個人の賢さではなく、「意図を共有して協調する」特有の能力（共同注意）。',
    detail: '人間の子どもは幼い頃から他者の困りごとに共感し、指差しで注意を共有します。暴力的で利己的な個体を群れ全体で制裁・排除（自己家畜化）してきたことで、共感と協調性に富む平和的な個体が生き残り、社会が形成されました。'
  },
  {
    title: '5. 文字による外部記憶化 (External Symbolic Storage)',
    author: 'マクドナルド研究所・考古学研究',
    summary: '脳の外に知識を置いた瞬間、人類の進化速度はDNAの更新速度を超越した。',
    detail: '生物の遺伝子は数万年単位でしか変わりません。しかし、壁画や文字によって知識を粘土板・石碑・書物に「外部記録」できるようになり、人類は前世代の知見の上に直接新たな知恵を積み上げる「累積的文化進化」を手に入れました。'
  }
];
