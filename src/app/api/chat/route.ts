export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "DEEPSEEK_API_KEY not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const msgs = body.messages || [];

    // Convert UIMessages to OpenAI format
    const messages = [
      {
        role: "system",
        content: `你是「科研数据地图」的AI研究助手。你的职责是帮助用户：
1. 分析研究方向的前景和风险
2. 解读研究领域的竞争格局
3. 建议交叉学科的突破点
4. 提供论文和学者推荐
5. 回答关于科研方法论的问题

回答风格：用中文回答，专业但易懂，给出具体数据支撑，主动指出风险和机会，简洁精炼。`,
      },
      ...msgs.map(
        (m: {
          role: string;
          parts?: { type: string; text: string }[];
          content?: string;
        }) => ({
          role: m.role,
          content:
            m.parts
              ?.filter((p) => p.type === "text")
              .map((p) => p.text)
              .join("") ||
            m.content ||
            "",
        })
      ),
    ];

    // Call DeepSeek API directly with streaming
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        stream: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json(
        { error: "DeepSeek API error", status: res.status, detail: errText },
        { status: 502 }
      );
    }

    // Transform DeepSeek SSE stream to UI message stream format
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Send start
        controller.enqueue(
          encoder.encode('data: {"type":"start"}\n\n')
        );

        const reader = res.body!.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(
                      `data: {"type":"text","text":${JSON.stringify(content)}}\n\n`
                    )
                  );
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        } catch (e) {
          controller.enqueue(
            encoder.encode(
              `data: {"type":"error","errorText":${JSON.stringify(String(e))}}\n\n`
            )
          );
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    return Response.json(
      { error: "Chat failed", detail: String(e) },
      { status: 500 }
    );
  }
}
