export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const API_KEY = process.env.FERDEV_API_KEY;
    const BASE_URL = "https://api.ferdev.my.id";

    let { path, ...params } = req.query;

    if (!path) {
      return res.status(400).json({ status: false, error: "path required" });
    }

    // 🔥 pastikan path SELALU diawali /
    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    params.apikey = API_KEY;

    const qs = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${path}?${qs}`;

    // DEBUG (opsional)
    console.log("Proxy to:", url);

    const response = await fetch(url);
    const text = await response.text();

    // auto parse
    try {
      return res.status(200).json(JSON.parse(text));
    } catch {
      return res.status(200).send(text);
    }

  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err.message,
    });
  }
}
