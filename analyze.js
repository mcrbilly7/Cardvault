// api/analyze.js — Vercel serverless function
// Proxies image analysis through OpenRouter (avoids browser CORS)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "OPENROUTER_API_KEY not set. Add it in Vercel → Settings → Environment Variables."
    });
  }

  try {
    const { content } = req.body;
    if (!content || !Array.isArray(content)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // OpenRouter uses OpenAI-compatible format
    // Convert Anthropic content blocks to OpenAI format
    const openaiContent = content.map(block => {
      if (block.type === "image") {
        return {
          type: "image_url",
          image_url: {
            url: `data:${block.source.media_type};base64,${block.source.data}`
          }
        };
      }
      if (block.type === "text") {
        return { type: "text", text: block.text };
      }
      return block;
    });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://card-vault.vercel.app",
        "X-Title": "Card Vault"
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4-5",
        max_tokens: 900,
        messages: [
          { role: "user", content: openaiContent }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data.error?.message || data.message || ("OpenRouter error " + response.status);
      return res.status(response.status).json({ error: msg });
    }

    // Convert OpenAI response format back to Anthropic format
    // so the frontend code doesn't need changing
    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({
      content: [{ type: "text", text }]
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
