// api/chat.js — Card Vault AI chatbot via OpenRouter

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OPENROUTER_API_KEY not configured." });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "Invalid request" });

  try {
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
        max_tokens: 600,
        messages: [
          {
            role: "system",
            content: `You are Card Vault's helpful AI assistant. You help users with their sports card collection. You know about:
- Card grading (PSA, BGS, SGC)
- Parallels, refractors, chrome cards, prizm cards
- How to identify cards and their values
- eBay market pricing and sold comps
- Card condition assessment
- Sports (Football, Basketball, Baseball, Hockey, Soccer, Golf, Tennis, MMA)
- Major card brands (Panini, Topps, Bowman, Upper Deck, Donruss)
- Rookies, short prints, serial numbered cards, 1/1 superfractors
- Collecting strategies and tips

Be concise, friendly, and knowledgeable. Format responses clearly. If asked about a specific card's value, explain that live prices are fetched on scan but general market trends can be discussed.`
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API error" });
    }

    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ reply: text });

  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
