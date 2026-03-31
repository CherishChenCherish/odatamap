// Mock data for papers, scholars, and directions
// In production, this would come from a real API/database

export interface Paper {
  id: string;
  title: string;
  titleEn: string;
  authors: { id: string; name: string; institution: string }[];
  abstract: string;
  field: string;
  fieldId: string;
  year: number;
  citations: number;
  doi: string;
  journal: string;
  keywords: string[];
}

export interface Scholar {
  id: string;
  name: string;
  nameEn: string;
  institution: string;
  country: string;
  hIndex: number;
  papers: number;
  citations: number;
  fields: { name: string; percentage: number; color: string }[];
  recentPapers: { id: string; title: string; year: number; citations: number }[];
  bio: string;
}

export interface Direction {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  overview: string;
  maturity: "emerging" | "growing" | "mature" | "declining";
  trendScore: number; // -100 to 100
  topScholars: { id: string; name: string; hIndex: number }[];
  topPapers: { id: string; title: string; year: number; citations: number }[];
  relatedFields: { id: string; name: string }[];
  stats: {
    totalPapers: number;
    totalScholars: number;
    avgCitationsPerPaper: number;
    yearlyGrowth: number;
    fundingLevel: "low" | "medium" | "high";
  };
  timeline: { year: number; papers: number }[];
}

const MOCK_PAPERS: Record<string, Paper> = {
  "p1": {
    id: "p1",
    title: "基于Transformer架构的蛋白质结构预测：从序列到三维构象的端到端学习",
    titleEn: "Transformer-based Protein Structure Prediction: End-to-End Learning from Sequence to 3D Conformation",
    authors: [
      { id: "s1", name: "张伟", institution: "清华大学" },
      { id: "s2", name: "李明", institution: "北京大学" },
      { id: "s3", name: "Sarah Chen", institution: "Stanford University" },
    ],
    abstract: "蛋白质结构预测是生物学中最重要的问题之一。本文提出了一种基于Transformer的端到端框架，能够直接从氨基酸序列预测蛋白质的三维结构。我们的方法在CASP15基准测试中达到了最先进的性能，GDT-TS分数比现有方法提高了12.3%。关键创新包括：(1) 多尺度注意力机制，能够捕获局部和全局的残基间相互作用；(2) 物理约束引导的损失函数，确保预测结构的物理合理性；(3) 进化信息增强模块，有效利用多序列比对信息。实验结果表明，该方法在不同蛋白质家族上均展现出强大的泛化能力。",
    field: "蛋白质折叠",
    fieldId: "l4",
    year: 2025,
    citations: 347,
    doi: "10.1038/s41586-025-00123-4",
    journal: "Nature",
    keywords: ["蛋白质结构预测", "Transformer", "深度学习", "CASP15", "结构生物学"],
  },
  "p2": {
    id: "p2",
    title: "室温超导体的实验验证：氮掺杂镥氢化物在1GPa下的超导转变",
    titleEn: "Experimental Verification of Room-Temperature Superconductor: Superconducting Transition in N-doped Lutetium Hydride at 1 GPa",
    authors: [
      { id: "s4", name: "王强", institution: "中国科学院物理研究所" },
      { id: "s5", name: "刘洋", institution: "中国科学技术大学" },
    ],
    abstract: "室温超导体的发现将彻底改变能源传输和量子计算等领域。本研究报告了在氮掺杂镥氢化物（Lu-N-H）体系中观察到的近室温超导现象。在约1GPa的压力下，样品在291K（18°C）展现出零电阻和完全抗磁性。通过系统的成分优化和结构表征，我们确定了最佳掺杂比例和晶体结构。多个独立实验室的重复实验证实了这一发现的可靠性。这一突破性成果为开发实用化的室温超导材料奠定了基础。",
    field: "超导材料",
    fieldId: "m3",
    year: 2026,
    citations: 892,
    doi: "10.1126/science.abx1234",
    journal: "Science",
    keywords: ["室温超导", "氢化物超导体", "高压物理", "镥", "超导转变"],
  },
  "p3": {
    id: "p3",
    title: "千万参数量级大语言模型的高效训练：稀疏混合专家架构与知识蒸馏",
    titleEn: "Efficient Training of 10M-Parameter LLMs: Sparse Mixture-of-Experts Architecture and Knowledge Distillation",
    authors: [
      { id: "s6", name: "陈晓", institution: "上海交通大学" },
      { id: "s7", name: "赵磊", institution: "浙江大学" },
    ],
    abstract: "大语言模型的训练成本持续增长，成为AI民主化的主要障碍。本文提出了一种结合稀疏混合专家（SMoE）架构和渐进式知识蒸馏的训练框架，能够在消费级GPU上高效训练千万参数量级的语言模型。实验表明，我们的方法在保持95%以上性能的同时，将训练成本降低了8倍。这一方法使得学术研究者和小型企业能够负担得起高质量语言模型的训练。",
    field: "大语言模型",
    fieldId: "a1",
    year: 2026,
    citations: 234,
    doi: "10.48550/arXiv.2026.01234",
    journal: "NeurIPS 2026",
    keywords: ["大语言模型", "混合专家", "知识蒸馏", "高效训练", "模型压缩"],
  },
};

const MOCK_SCHOLARS: Record<string, Scholar> = {
  "s1": {
    id: "s1",
    name: "张伟",
    nameEn: "Wei Zhang",
    institution: "清华大学生命科学学院",
    country: "中国",
    hIndex: 67,
    papers: 234,
    citations: 28900,
    fields: [
      { name: "蛋白质折叠", percentage: 45, color: "#10b981" },
      { name: "基因编辑", percentage: 25, color: "#10b981" },
      { name: "计算生物学", percentage: 20, color: "#3b82f6" },
      { name: "其他", percentage: 10, color: "#6b7280" },
    ],
    recentPapers: [
      { id: "p1", title: "基于Transformer架构的蛋白质结构预测", year: 2025, citations: 347 },
      { id: "p10", title: "CRISPR-Cas12a介导的碱基编辑效率优化", year: 2025, citations: 156 },
      { id: "p11", title: "深度学习在药物-蛋白质相互作用预测中的应用", year: 2024, citations: 289 },
    ],
    bio: "清华大学生命科学学院教授、博导。主要研究方向为计算结构生物学和AI驱动的药物设计。在Nature、Science、Cell等顶级期刊发表论文50余篇。国家杰出青年基金获得者。",
  },
  "s4": {
    id: "s4",
    name: "王强",
    nameEn: "Qiang Wang",
    institution: "中国科学院物理研究所",
    country: "中国",
    hIndex: 82,
    papers: 312,
    citations: 45600,
    fields: [
      { name: "超导材料", percentage: 55, color: "#8b5cf6" },
      { name: "凝聚态物理", percentage: 30, color: "#8b5cf6" },
      { name: "量子材料", percentage: 15, color: "#8b5cf6" },
    ],
    recentPapers: [
      { id: "p2", title: "室温超导体的实验验证", year: 2026, citations: 892 },
      { id: "p20", title: "铁基超导体新家族的发现", year: 2025, citations: 567 },
      { id: "p21", title: "拓扑超导态的实验观测", year: 2024, citations: 423 },
    ],
    bio: "中国科学院物理研究所研究员。长期从事高温超导和量子材料研究。在室温超导领域取得突破性进展，相关成果入选年度十大科学进展。中国科学院院士。",
  },
  "s6": {
    id: "s6",
    name: "陈晓",
    nameEn: "Xiao Chen",
    institution: "上海交通大学计算机系",
    country: "中国",
    hIndex: 54,
    papers: 189,
    citations: 19800,
    fields: [
      { name: "大语言模型", percentage: 40, color: "#3b82f6" },
      { name: "强化学习", percentage: 30, color: "#3b82f6" },
      { name: "自然语言处理", percentage: 20, color: "#3b82f6" },
      { name: "其他", percentage: 10, color: "#6b7280" },
    ],
    recentPapers: [
      { id: "p3", title: "千万参数量级大语言模型的高效训练", year: 2026, citations: 234 },
      { id: "p30", title: "基于人类反馈的强化学习在对话系统中的应用", year: 2025, citations: 312 },
      { id: "p31", title: "多模态大模型的统一架构设计", year: 2025, citations: 198 },
    ],
    bio: "上海交通大学计算机系教授。研究兴趣集中在高效AI训练和自然语言处理。提出了多种模型压缩和加速方法，被工业界广泛采用。ACM杰出会员。",
  },
};

const MOCK_DIRECTIONS: Record<string, Direction> = {
  "quantum-computing": {
    id: "quantum-computing",
    name: "量子计算",
    nameEn: "Quantum Computing",
    description: "利用量子力学原理进行信息处理和计算的跨学科研究领域",
    overview: "量子计算是利用量子比特（qubit）的叠加态和纠缠特性进行计算的新范式。相比经典计算机，量子计算机在特定问题上具有指数级的加速潜力。当前主要技术路线包括超导量子比特、离子阱、光量子和拓扑量子比特。IBM、Google、中国科大等机构在量子优越性验证方面取得了里程碑式进展。量子纠错是实现通用量子计算的关键挑战，近年来在表面码和级联码方面取得显著进步。量子计算的应用前景包括药物分子模拟、材料设计、密码破解和优化问题求解。",
    maturity: "growing",
    trendScore: 78,
    topScholars: [
      { id: "sq1", name: "潘建伟", hIndex: 112 },
      { id: "sq2", name: "John Preskill", hIndex: 98 },
      { id: "sq3", name: "陆朝阳", hIndex: 87 },
    ],
    topPapers: [
      { id: "pq1", title: "量子计算优越性的实验验证", year: 2025, citations: 1200 },
      { id: "pq2", title: "逻辑量子比特的容错操作", year: 2025, citations: 890 },
      { id: "pq3", title: "量子纠错阈值的突破", year: 2026, citations: 567 },
    ],
    relatedFields: [
      { id: "m5", name: "量子光学" },
      { id: "m3", name: "超导材料" },
      { id: "a4", name: "密码学" },
    ],
    stats: {
      totalPapers: 12840,
      totalScholars: 3200,
      avgCitationsPerPaper: 18.5,
      yearlyGrowth: 23,
      fundingLevel: "high",
    },
    timeline: [
      { year: 2020, papers: 1800 },
      { year: 2021, papers: 2200 },
      { year: 2022, papers: 2800 },
      { year: 2023, papers: 3500 },
      { year: 2024, papers: 4200 },
      { year: 2025, papers: 5100 },
    ],
  },
  "gene-editing": {
    id: "gene-editing",
    name: "基因编辑",
    nameEn: "Gene Editing",
    description: "利用核酸酶工具精准修改基因组序列的革命性生物技术",
    overview: "基因编辑技术以CRISPR-Cas系统为代表，能够精准地在活细胞中修改DNA序列。2020年CRISPR的两位发明者获得诺贝尔化学奖后，该领域进入快速发展期。当前主要进展包括：碱基编辑（Base Editing）可以不切割双链DNA即实现单碱基替换；先导编辑（Prime Editing）实现了更精准的基因修改；体内基因编辑疗法已进入临床试验阶段。镰刀细胞病和地中海贫血的基因疗法已获批上市。伦理和安全问题仍是该领域的重要议题。",
    maturity: "mature",
    trendScore: 65,
    topScholars: [
      { id: "sg1", name: "张锋", hIndex: 134 },
      { id: "sg2", name: "刘如谦", hIndex: 118 },
      { id: "sg3", name: "Jennifer Doudna", hIndex: 125 },
    ],
    topPapers: [
      { id: "pg1", title: "新一代碱基编辑器的开发与应用", year: 2025, citations: 980 },
      { id: "pg2", title: "体内CRISPR基因治疗的临床I期结果", year: 2025, citations: 756 },
      { id: "pg3", title: "CRISPR-Cas12f微型编辑器的结构与功能", year: 2026, citations: 423 },
    ],
    relatedFields: [
      { id: "l3", name: "神经科学" },
      { id: "l5", name: "肿瘤免疫" },
      { id: "l7", name: "干细胞" },
    ],
    stats: {
      totalPapers: 18900,
      totalScholars: 4800,
      avgCitationsPerPaper: 24.3,
      yearlyGrowth: 15,
      fundingLevel: "high",
    },
    timeline: [
      { year: 2020, papers: 2100 },
      { year: 2021, papers: 2600 },
      { year: 2022, papers: 3100 },
      { year: 2023, papers: 3400 },
      { year: 2024, papers: 3700 },
      { year: 2025, papers: 4000 },
    ],
  },
  "llm": {
    id: "llm",
    name: "大语言模型",
    nameEn: "Large Language Models",
    description: "基于深度学习的大规模语言模型的训练、优化和应用研究",
    overview: "大语言模型（LLM）是当前AI领域最活跃的研究方向。从GPT系列到国产大模型（DeepSeek、通义千问等），模型能力持续突破。研究热点包括：高效训练方法（MoE架构、低秩适配）、推理加速（量化、蒸馏）、多模态融合、工具使用和Agent能力、安全对齐、长上下文处理等。该领域竞争极为激烈，但在垂直应用（医疗、法律、科研）和端侧部署方面仍有大量创新空间。",
    maturity: "growing",
    trendScore: 95,
    topScholars: [
      { id: "sl1", name: "Ilya Sutskever", hIndex: 108 },
      { id: "sl2", name: "梁文锋", hIndex: 45 },
      { id: "sl3", name: "Jason Wei", hIndex: 62 },
    ],
    topPapers: [
      { id: "pl1", title: "DeepSeek-V3: 高效开源大语言模型", year: 2025, citations: 1500 },
      { id: "pl2", title: "思维链推理的理论分析", year: 2025, citations: 890 },
      { id: "pl3", title: "千万参数量级大语言模型的高效训练", year: 2026, citations: 234 },
    ],
    relatedFields: [
      { id: "a2", name: "计算机视觉" },
      { id: "a3", name: "强化学习" },
      { id: "a6", name: "自动驾驶" },
    ],
    stats: {
      totalPapers: 28000,
      totalScholars: 7200,
      avgCitationsPerPaper: 15.2,
      yearlyGrowth: 45,
      fundingLevel: "high",
    },
    timeline: [
      { year: 2020, papers: 1200 },
      { year: 2021, papers: 2100 },
      { year: 2022, papers: 4500 },
      { year: 2023, papers: 8200 },
      { year: 2024, papers: 12000 },
      { year: 2025, papers: 16000 },
    ],
  },
};

export function getPaper(id: string): Paper | undefined {
  return MOCK_PAPERS[id];
}

export function getScholar(id: string): Scholar | undefined {
  return MOCK_SCHOLARS[id];
}

export function getDirection(id: string): Direction | undefined {
  return MOCK_DIRECTIONS[id];
}

export function getAllPapers(): Paper[] {
  return Object.values(MOCK_PAPERS);
}

export function getAllScholars(): Scholar[] {
  return Object.values(MOCK_SCHOLARS);
}

export function getAllDirections(): Direction[] {
  return Object.values(MOCK_DIRECTIONS);
}
