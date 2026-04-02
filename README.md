# 🗺️ 科研数据地图 (ODataMap CN)

**实验前，先看全景。** AI 驱动的全球科研数据可视化平台。

🔗 **在线体验**: [odatamap.cherishchen2510.workers.dev](https://odatamap.cherishchen2510.workers.dev)

![论文数据](https://img.shields.io/badge/论文数据-2.5亿+-blue) ![学者数据](https://img.shields.io/badge/学者数据-9000万+-green) ![中国可访问](https://img.shields.io/badge/中国大陆-无需VPN-red) ![License](https://img.shields.io/badge/license-MIT-yellow)

---

## 这是什么？

科研数据地图是一个交互式的科研全景可视化工具，灵感来自 [O-DataMap](https://o-datamap.oall.com/)，专为中国用户优化：

- 🗺️ **交互式 2D 地图** — 7 大知识大陆、45 个研究方向，可缩放拖拽
- 🔍 **实时论文搜索** — 接入 OpenAlex（2.5 亿+论文），中英文搜索
- 🤖 **AI 研究助手** — DeepSeek 驱动，分析方向、竞争格局、蓝海机会
- 📊 **研究方向分析** — 趋势图、顶尖学者、热度评分
- 👨‍🔬 **学者主页** — H-Index、领域分布、代表论文
- 📱 **移动端适配** — 手机流畅使用
- 🇨🇳 **中国可用** — Cloudflare Workers 部署，无需 VPN

## 七大知识大陆

| 大陆 | 研究尺度 | 代表方向 |
|------|---------|---------|
| 🟣 物质与微观 | 亚原子 → 纳米 | 量子计算、粒子物理、超导材料 |
| 🟢 生命与健康 | 分子 → 细胞 | 基因编辑、神经科学、肿瘤免疫 |
| 🔵 数学与智能 | 信息/抽象 | 大语言模型、计算机视觉、强化学习 |
| 🟡 工程技术 | 工程尺度 | 固态电池、光伏技术、芯片制造 |
| 🔵 地球与环境 | 地球尺度 | 气候模型、碳捕获、遥感技术 |
| 🟣 宇宙 | 宇宙尺度 | 暗物质、引力波、系外行星 |
| 🔴 社会与人文 | 跨尺度 | 行为经济学、认知心理学、教育技术 |

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 16 | 全栈框架 |
| D3.js | 交互式地图可视化 |
| Tailwind + shadcn/ui | UI 组件 |
| OpenAlex API | 学术数据（免费，2.5亿+论文） |
| DeepSeek API | AI 研究助手（低成本） |
| Cloudflare Workers | 部署（中国可访问） |

## 快速开始

```bash
git clone https://github.com/CherishChenCherish/odatamap.git
cd odatamap
npm install

# 配置 DeepSeek API Key（可选，AI 助手需要）
echo "DEEPSEEK_API_KEY=your_key_here" > .env.local

npm run dev
```

## 部署到 Cloudflare Workers

```bash
npm run build:cf
npx wrangler deploy
echo "your_key" | npx wrangler secret put DEEPSEEK_API_KEY
```

## Roadmap

- [x] Phase 1: 交互式科研地图（7大陆 45方向）
- [x] Phase 2: 论文/学者详情 + AI 助手 + OpenAlex 数据
- [ ] Phase 3: 用户注册、收藏、关注
- [ ] 更多数据源（Semantic Scholar、PubMed）
- [ ] 真实数据驱动地图节点
- [ ] 自定义域名 + SEO

## 灵感来源

受 [O-DataMap](https://o-datamap.oall.com/) 启发（OALL 开发的"科研领域的 Google Maps"）。本项目目标：更好的中文版，中国无需 VPN。

## License

MIT
