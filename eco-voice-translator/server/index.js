const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // pour appeler LibreTranslate

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/translate", async (req, res) => {
  const { text, source, target } = req.body;

  if (!text || !source || !target) {
    return res.status(400).json({ error: "Missing text/source/target" });
  }

  try {
  const apiRes = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      source: source,
      target: target,
      format: "text",
    }),
  });

  if (!apiRes.ok) {
    console.error("LibreTranslate error status:", apiRes.status);
    const errorText = await apiRes.text();
    console.error("LibreTranslate error body:", errorText);
    return res
      .status(500)
      .json({ error: "Erreur lors de l'appel à LibreTranslate" });
  }

  const data = await apiRes.json();

  const translated =
    data.translatedText || data.translated_text || data.translation;

  if (!translated) {
    console.error("LibreTranslate unexpected response:", data);
    return res
      .status(500)
      .json({ error: "Réponse inattendue de LibreTranslate" });
  }

  res.json({ translatedText: translated });
} catch (err) {
  console.error("Erreur LibreTranslate:", err);
  res
    .status(500)
    .json({ error: "Erreur interne lors de la traduction" });
}

});

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
