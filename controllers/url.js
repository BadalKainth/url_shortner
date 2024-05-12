const ShortId = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required" });
    const shortId = ShortId();

    await URL.create({
      shortId,
      redirectURL: body.url,
      visitHistory: [],
    });

    return res.render("home", { id: shortId });
  } catch (error) {
    res.status(500).send({
      error: "Short link generation failed." + error.message,
    });
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}
module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
