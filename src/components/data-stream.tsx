"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { continents } from "@/lib/map-data";

interface DataEntry {
  id: number;
  title: string;
  field: string;
  color: string;
  time: string;
  type: "论文" | "数据" | "学者";
}

// Simulated real-time data stream
const sampleTitles = [
  "基于Transformer的蛋白质结构预测新方法",
  "高温超导体临界温度突破记录",
  "大语言模型在代码生成中的应用评估",
  "CRISPR基因编辑在遗传病治疗中的临床试验",
  "固态电池循环寿命超过10000次",
  "南极冰芯数据揭示百万年气候周期",
  "新型钙钛矿太阳能电池效率达33.7%",
  "脑机接口实现高速文字输入",
  "量子纠错码在超导量子比特上的实验验证",
  "引力波探测器灵敏度提升一个数量级",
  "图神经网络在药物发现中的突破应用",
  "海洋微塑料对浮游生物影响的全球评估",
  "联邦学习在医疗数据隐私保护中的应用",
  "系外行星大气层首次检测到生物标志物",
  "行为经济学模型预测消费者决策偏差",
  "碳捕获技术成本降至50美元/吨以下",
  "软体机器人实现自主水下探测",
  "mRNA技术在罕见病治疗中的新进展",
  "暗物质直接探测实验新结果",
  "计算社会学方法分析社交网络传播模式",
];

function generateEntry(id: number): DataEntry {
  const continent = continents[Math.floor(Math.random() * continents.length)];
  const node =
    continent.nodes[Math.floor(Math.random() * continent.nodes.length)];
  const types: DataEntry["type"][] = ["论文", "数据", "学者"];
  const now = new Date();
  now.setMinutes(now.getMinutes() - Math.floor(Math.random() * 60));
  return {
    id,
    title: sampleTitles[Math.floor(Math.random() * sampleTitles.length)],
    field: node.name,
    color: node.color,
    time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
    type: types[Math.floor(Math.random() * types.length)],
  };
}

export function DataStream() {
  const [entries, setEntries] = useState<DataEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  // Generate initial data only on client to avoid hydration mismatch
  useEffect(() => {
    setEntries(Array.from({ length: 10 }, (_, i) => generateEntry(i)));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setEntries((prev) => {
        const next = [generateEntry(Date.now()), ...prev.slice(0, 19)];
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [mounted]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border/50 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-xs font-medium">实时数据流</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="px-2.5 py-2 rounded-md hover:bg-accent/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1 py-0 h-4"
                  style={{
                    backgroundColor: `${entry.color}20`,
                    color: entry.color,
                  }}
                >
                  {entry.type}
                </Badge>
                <span className="text-[10px] text-muted-foreground ml-auto font-mono">
                  {entry.time}
                </span>
              </div>
              <p className="text-xs leading-relaxed line-clamp-2 group-hover:text-foreground text-muted-foreground">
                {entry.title}
              </p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                {entry.field}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
