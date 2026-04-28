// api/prices.js — Fetch real eBay sold prices for a card using AI + web search

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OPENROUTER_API_KEY not configured." });

  const { player, year, brand, type, parallel, serialNum, grade, graded, condition } = req.body;
  if (!player) return res.status(400).json({ error: "Missing card info" });

  // Build a precise search query matching the exact card
  const parallelStr = parallel && parallel !== "Base" ? parallel + " Parallel" : "";
  const gradedStr = graded && grade ? grade : "";
  const serialStr = serialNum ? `#${serialNum}` : "";

  const cardDescription = [year, player, brand, type, parallelStr, gradedStr, serialStr]
    .filter(Boolean).join(" ").trim();

  const prompt = `Search eBay SOLD listings for this exact sports card: "${cardDescription}"

Find the most recent completed/sold listings on eBay matching this EXACT card.
Be strict about matching: same player, same year, same brand, same parallel color if specified, same grade if graded.

Return ONLY a JSON object with no markdown:
{
  "found": true,
  "lowPrice": 45,
  "avgPrice": 67,
  "highPrice": 89,
  "salesCount": 8,
  "priceDate": "last 30 days",
  "searchQuery": "the exact query used",
  "confidence": "high|medium|low",
  "note": "brief note about the data or any caveats"
}

If no matching sales found, return:
{"found": false, "note": "why no results were found"}

Base prices on ACTUAL sold listings only, not active listings. Be accurate - collectors rely on this data.`;

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
        max_tokens: 400,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API error", found: false });
    }

    // Extract text from response (may have tool use blocks)
    const textContent = (data.choices?.[0]?.message?.content || "");
    const text = typeof textContent === "string"
      ? textContent
      : Array.isArray(textContent)
        ? textContent.filter(b => b.type === "text").map(b => b.text).join("")
        : "";

    if (!text) return res.status(200).json({ found: false, note: "No response from AI" });

    // Parse JSON from response
    const clean = text.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(200).json({ found: false, note: "Could not parse price data" });

    const priceData = JSON.parse(jsonMatch[0]);
    return res.status(200).json(priceData);

  } catch (err) {
    return res.status(500).json({ found: false, error: "Server error: " + err.message });
  }
}
