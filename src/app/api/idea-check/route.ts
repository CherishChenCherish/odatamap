export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { idea, field } = await req.json();
    if (!idea) {
      return Response.json({ error: "Missing 'idea' field" }, { status: 400 });
    }

    const prompt = `你是一位资深科研战略顾问，拥有跨学科视野和丰富的科研评审经验。请对以下研究想法进行全面、专业的评估。

## 用户的研究想法
${idea}
${field ? `\n所属领域: ${field}` : ""}

## 请按以下 JSON 格式严格输出评估结果

请直接输出 JSON，不要加任何 markdown 标记或解释文字：

{
  "summary": "一句话总结这个研究想法（20字以内）",
  "scores": {
    "novelty": { "score": 0-100, "label": "高/中/低", "reason": "为什么给这个分（1-2句话）" },
    "feasibility": { "score": 0-100, "label": "高/中/低", "reason": "为什么给这个分" },
    "impact": { "score": 0-100, "label": "高/中/低", "reason": "为什么给这个分" },
    "saturation": { "score": 0-100, "label": "饱和/中等/蓝海", "reason": "当前该方向的拥挤程度" }
  },
  "overall_verdict": "值得投入 / 需要调整 / 建议放弃",
  "competing_work": [
    { "title": "相关竞争研究1", "threat": "高/中/低", "detail": "简要说明" },
    { "title": "相关竞争研究2", "threat": "高/中/低", "detail": "简要说明" },
    { "title": "相关竞争研究3", "threat": "高/中/低", "detail": "简要说明" }
  ],
  "risks": [
    "风险1：具体描述",
    "风险2：具体描述",
    "风险3：具体描述"
  ],
  "optimization_paths": [
    { "direction": "优化方向1", "detail": "具体建议", "difficulty": "高/中/低" },
    { "direction": "优化方向2", "detail": "具体建议", "difficulty": "高/中/低" },
    { "direction": "优化方向3", "detail": "具体建议", "difficulty": "高/中/低" }
  ],
  "suggested_keywords": ["关键词1", "关键词2", "关键词3", "关键词4", "关键词5"],
  "recommended_journals": ["期刊1", "期刊2", "期刊3"],
  "timeline_estimate": "预估研究周期（如：12-18个月）",
  "one_line_advice": "给研究者最重要的一句建议"
}`;

    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      return Response.json({ error: "DeepSeek API error" }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response, with fallback cleanup
    let parsed;
    try {
      // Try direct parse
      parsed = JSON.parse(content);
    } catch {
      // Try extracting JSON from markdown code blocks
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          return Response.json({ raw: content, error: "Failed to parse AI response" }, { status: 200 });
        }
      } else {
        return Response.json({ raw: content, error: "No JSON in response" }, { status: 200 });
      }
    }

    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
