export default async function handler(req, res) {
  const apiKey = process.env.WORLDNEWS_API_KEY;

  try {
    const response = await fetch(`https://api.worldnewsapi.com/search-news?api-key=${apiKey}&language=cs&number=10`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("WorldNews API error:", err);
    res.status(500).json({ error: "Chyba při načítání zpráv" });
  }
}
