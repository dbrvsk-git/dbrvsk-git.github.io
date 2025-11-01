export default async function handler(req, res) {
  const apiKey2 = process.env.NEWSDATA_API_KEY;

  try {
    const response = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey2}&category=sports&language=cs&size=5&removeduplicate=1`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("NewsData API error:", err);
    res.status(500).json({ error: "Chyba při načítání sportovních zpráv" });
  }
}
