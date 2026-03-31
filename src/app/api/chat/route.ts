import { streamText, convertToModelMessages } from "ai";
import { deepseek } from "@/lib/ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: `你是「科研数据地图」的AI研究助手。你的职责是帮助用户：

1. 分析研究方向的前景和风险
2. 解读研究领域的竞争格局
3. 建议交叉学科的突破点
4. 提供论文和学者推荐
5. 回答关于科研方法论的问题

回答风格：
- 用中文回答，专业但易懂
- 给出具体的数据和事实支撑
- 主动指出潜在的风险和机会
- 适当引用相关的研究趋势
- 回答简洁精炼，避免空话套话`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
