export default async function handler(req, res) {
  // === FULL CORS ===
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const baseUrl = process.env.FERDEV_BASE_URL;
    const apiKey = process.env.FERDEV_API_KEY;

    // ambil path target
    // contoh: /api/proxy?path=/downloader/ytmp4&link=xxxx
    const { path, ...params } = req.query;

    if (!path) {
      return res.status(400).json({
        status: false,
        message: "path parameter required",
      });
    }

    // inject API KEY (hidden)
    params.apikey = apiKey;

    // build query string
    const queryString = new URLSearchParams(params).toString();

    const targetUrl = `${baseUrl}${path}?${queryString}`;

    const response = await fetch(targetUrl);
    const data = await response.json();

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
}
