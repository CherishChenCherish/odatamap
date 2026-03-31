// Seven knowledge continents with their research clusters
// Each continent maps to a region on the 2D map:
//   X axis = scale of research object (subatomic → universe)
//   Y axis = maturity (basic research → applied → commercialized)

export interface ResearchNode {
  id: string;
  name: string;
  nameEn: string;
  continent: string;
  x: number; // normalized 0-1
  y: number; // normalized 0-1
  size: number; // researcher concentration (1-5)
  papers: number;
  scholars: number;
  color: string;
  children?: ResearchNode[];
}

export interface Continent {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  description: string;
  xRange: [number, number];
  yRange: [number, number];
  nodes: ResearchNode[];
}

// Color palette for continents
const COLORS = {
  matter: "#8b5cf6", // violet
  life: "#10b981", // emerald
  math: "#3b82f6", // blue
  engineering: "#f59e0b", // amber
  earth: "#06b6d4", // cyan
  universe: "#6366f1", // indigo
  society: "#ec4899", // pink
};

export const continents: Continent[] = [
  {
    id: "matter",
    name: "物质与微观",
    nameEn: "Matter & Microcosm",
    color: COLORS.matter,
    description: "粒子物理、量子力学、材料科学、化学",
    xRange: [0.02, 0.18],
    yRange: [0.15, 0.85],
    nodes: [
      { id: "m1", name: "量子计算", nameEn: "Quantum Computing", continent: "matter", x: 0.08, y: 0.55, size: 4, papers: 12840, scholars: 3200, color: COLORS.matter },
      { id: "m2", name: "粒子物理", nameEn: "Particle Physics", continent: "matter", x: 0.05, y: 0.25, size: 3, papers: 28500, scholars: 5100, color: COLORS.matter },
      { id: "m3", name: "超导材料", nameEn: "Superconductors", continent: "matter", x: 0.12, y: 0.65, size: 3, papers: 8900, scholars: 2100, color: COLORS.matter },
      { id: "m4", name: "纳米技术", nameEn: "Nanotechnology", continent: "matter", x: 0.14, y: 0.72, size: 4, papers: 34200, scholars: 8400, color: COLORS.matter },
      { id: "m5", name: "量子光学", nameEn: "Quantum Optics", continent: "matter", x: 0.06, y: 0.4, size: 2, papers: 6700, scholars: 1500, color: COLORS.matter },
      { id: "m6", name: "凝聚态物理", nameEn: "Condensed Matter", continent: "matter", x: 0.1, y: 0.35, size: 5, papers: 45000, scholars: 11000, color: COLORS.matter },
      { id: "m7", name: "有机化学", nameEn: "Organic Chemistry", continent: "matter", x: 0.15, y: 0.6, size: 4, papers: 52000, scholars: 14000, color: COLORS.matter },
    ],
  },
  {
    id: "life",
    name: "生命与健康",
    nameEn: "Life & Health",
    color: COLORS.life,
    description: "基因组学、药物研发、神经科学、公共卫生",
    xRange: [0.2, 0.38],
    yRange: [0.1, 0.9],
    nodes: [
      { id: "l1", name: "基因编辑", nameEn: "Gene Editing", continent: "life", x: 0.25, y: 0.45, size: 5, papers: 18900, scholars: 4800, color: COLORS.life },
      { id: "l2", name: "mRNA疫苗", nameEn: "mRNA Vaccines", continent: "life", x: 0.3, y: 0.78, size: 4, papers: 9200, scholars: 2300, color: COLORS.life },
      { id: "l3", name: "神经科学", nameEn: "Neuroscience", continent: "life", x: 0.22, y: 0.3, size: 5, papers: 67000, scholars: 16000, color: COLORS.life },
      { id: "l4", name: "蛋白质折叠", nameEn: "Protein Folding", continent: "life", x: 0.28, y: 0.5, size: 3, papers: 7800, scholars: 1900, color: COLORS.life },
      { id: "l5", name: "肿瘤免疫", nameEn: "Immuno-Oncology", continent: "life", x: 0.33, y: 0.68, size: 5, papers: 42000, scholars: 10500, color: COLORS.life },
      { id: "l6", name: "微生物组", nameEn: "Microbiome", continent: "life", x: 0.26, y: 0.55, size: 3, papers: 15600, scholars: 3800, color: COLORS.life },
      { id: "l7", name: "干细胞", nameEn: "Stem Cells", continent: "life", x: 0.35, y: 0.6, size: 4, papers: 38000, scholars: 9200, color: COLORS.life },
      { id: "l8", name: "脑机接口", nameEn: "Brain-Computer Interface", continent: "life", x: 0.24, y: 0.7, size: 2, papers: 3400, scholars: 850, color: COLORS.life },
    ],
  },
  {
    id: "math",
    name: "数学与智能",
    nameEn: "Mathematics & Intelligence",
    color: COLORS.math,
    description: "人工智能、机器学习、密码学、优化理论",
    xRange: [0.4, 0.55],
    yRange: [0.1, 0.9],
    nodes: [
      { id: "a1", name: "大语言模型", nameEn: "Large Language Models", continent: "math", x: 0.47, y: 0.65, size: 5, papers: 28000, scholars: 7200, color: COLORS.math },
      { id: "a2", name: "计算机视觉", nameEn: "Computer Vision", continent: "math", x: 0.5, y: 0.72, size: 5, papers: 56000, scholars: 14000, color: COLORS.math },
      { id: "a3", name: "强化学习", nameEn: "Reinforcement Learning", continent: "math", x: 0.45, y: 0.5, size: 4, papers: 19000, scholars: 4800, color: COLORS.math },
      { id: "a4", name: "密码学", nameEn: "Cryptography", continent: "math", x: 0.42, y: 0.55, size: 3, papers: 12000, scholars: 3000, color: COLORS.math },
      { id: "a5", name: "图神经网络", nameEn: "Graph Neural Networks", continent: "math", x: 0.48, y: 0.58, size: 3, papers: 8500, scholars: 2100, color: COLORS.math },
      { id: "a6", name: "自动驾驶", nameEn: "Autonomous Driving", continent: "math", x: 0.52, y: 0.82, size: 4, papers: 15000, scholars: 3800, color: COLORS.math },
      { id: "a7", name: "联邦学习", nameEn: "Federated Learning", continent: "math", x: 0.44, y: 0.6, size: 2, papers: 5200, scholars: 1300, color: COLORS.math },
    ],
  },
  {
    id: "engineering",
    name: "工程技术",
    nameEn: "Engineering Technology",
    color: COLORS.engineering,
    description: "能源、机器人、半导体、航空航天",
    xRange: [0.57, 0.72],
    yRange: [0.15, 0.88],
    nodes: [
      { id: "e1", name: "固态电池", nameEn: "Solid-State Batteries", continent: "engineering", x: 0.62, y: 0.65, size: 4, papers: 11000, scholars: 2800, color: COLORS.engineering },
      { id: "e2", name: "光伏技术", nameEn: "Photovoltaics", continent: "engineering", x: 0.65, y: 0.78, size: 5, papers: 45000, scholars: 11000, color: COLORS.engineering },
      { id: "e3", name: "芯片制造", nameEn: "Chip Manufacturing", continent: "engineering", x: 0.6, y: 0.82, size: 4, papers: 8900, scholars: 2200, color: COLORS.engineering },
      { id: "e4", name: "软体机器人", nameEn: "Soft Robotics", continent: "engineering", x: 0.68, y: 0.5, size: 2, papers: 4500, scholars: 1100, color: COLORS.engineering },
      { id: "e5", name: "3D打印", nameEn: "3D Printing", continent: "engineering", x: 0.7, y: 0.75, size: 4, papers: 32000, scholars: 8000, color: COLORS.engineering },
      { id: "e6", name: "核聚变", nameEn: "Nuclear Fusion", continent: "engineering", x: 0.58, y: 0.35, size: 3, papers: 7800, scholars: 1900, color: COLORS.engineering },
      { id: "e7", name: "氢能源", nameEn: "Hydrogen Energy", continent: "engineering", x: 0.63, y: 0.7, size: 3, papers: 14000, scholars: 3500, color: COLORS.engineering },
    ],
  },
  {
    id: "earth",
    name: "地球与环境",
    nameEn: "Earth & Environment",
    color: COLORS.earth,
    description: "气候变化、海洋学、生态保护、地质学",
    xRange: [0.74, 0.88],
    yRange: [0.2, 0.85],
    nodes: [
      { id: "r1", name: "气候模型", nameEn: "Climate Modeling", continent: "earth", x: 0.78, y: 0.4, size: 4, papers: 23000, scholars: 5800, color: COLORS.earth },
      { id: "r2", name: "碳捕获", nameEn: "Carbon Capture", continent: "earth", x: 0.82, y: 0.7, size: 3, papers: 9800, scholars: 2400, color: COLORS.earth },
      { id: "r3", name: "海洋酸化", nameEn: "Ocean Acidification", continent: "earth", x: 0.8, y: 0.35, size: 2, papers: 4200, scholars: 1000, color: COLORS.earth },
      { id: "r4", name: "生物多样性", nameEn: "Biodiversity", continent: "earth", x: 0.76, y: 0.5, size: 4, papers: 38000, scholars: 9500, color: COLORS.earth },
      { id: "r5", name: "遥感技术", nameEn: "Remote Sensing", continent: "earth", x: 0.85, y: 0.65, size: 4, papers: 28000, scholars: 7000, color: COLORS.earth },
      { id: "r6", name: "水资源", nameEn: "Water Resources", continent: "earth", x: 0.77, y: 0.6, size: 3, papers: 15000, scholars: 3700, color: COLORS.earth },
    ],
  },
  {
    id: "universe",
    name: "宇宙",
    nameEn: "Universe",
    color: COLORS.universe,
    description: "天体物理、宇宙学、系外行星、暗物质",
    xRange: [0.9, 0.98],
    yRange: [0.15, 0.7],
    nodes: [
      { id: "u1", name: "暗物质", nameEn: "Dark Matter", continent: "universe", x: 0.93, y: 0.25, size: 3, papers: 12000, scholars: 3000, color: COLORS.universe },
      { id: "u2", name: "引力波", nameEn: "Gravitational Waves", continent: "universe", x: 0.95, y: 0.35, size: 2, papers: 5400, scholars: 1350, color: COLORS.universe },
      { id: "u3", name: "系外行星", nameEn: "Exoplanets", continent: "universe", x: 0.92, y: 0.45, size: 3, papers: 8900, scholars: 2200, color: COLORS.universe },
      { id: "u4", name: "黑洞", nameEn: "Black Holes", continent: "universe", x: 0.96, y: 0.3, size: 3, papers: 11000, scholars: 2700, color: COLORS.universe },
      { id: "u5", name: "宇宙微波背景", nameEn: "CMB", continent: "universe", x: 0.94, y: 0.2, size: 2, papers: 3800, scholars: 950, color: COLORS.universe },
    ],
  },
  {
    id: "society",
    name: "社会与人文",
    nameEn: "Society & Humanities",
    color: COLORS.society,
    description: "经济学、心理学、教育、语言学",
    xRange: [0.4, 0.72],
    yRange: [0.02, 0.12],
    nodes: [
      { id: "s1", name: "行为经济学", nameEn: "Behavioral Economics", continent: "society", x: 0.45, y: 0.08, size: 3, papers: 14000, scholars: 3500, color: COLORS.society },
      { id: "s2", name: "认知心理学", nameEn: "Cognitive Psychology", continent: "society", x: 0.5, y: 0.05, size: 4, papers: 32000, scholars: 8000, color: COLORS.society },
      { id: "s3", name: "数字人文", nameEn: "Digital Humanities", continent: "society", x: 0.55, y: 0.1, size: 2, papers: 4500, scholars: 1100, color: COLORS.society },
      { id: "s4", name: "计算社会学", nameEn: "Computational Sociology", continent: "society", x: 0.6, y: 0.07, size: 2, papers: 3200, scholars: 800, color: COLORS.society },
      { id: "s5", name: "教育技术", nameEn: "EdTech", continent: "society", x: 0.65, y: 0.09, size: 3, papers: 18000, scholars: 4500, color: COLORS.society },
    ],
  },
];

export function getAllNodes(): ResearchNode[] {
  return continents.flatMap((c) => c.nodes);
}

export function getNodeById(id: string): ResearchNode | undefined {
  return getAllNodes().find((n) => n.id === id);
}

export function searchNodes(query: string): ResearchNode[] {
  const q = query.toLowerCase();
  return getAllNodes().filter(
    (n) =>
      n.name.toLowerCase().includes(q) ||
      n.nameEn.toLowerCase().includes(q)
  );
}
