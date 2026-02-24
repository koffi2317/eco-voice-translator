const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/translate", async (req, res) => {
  const { text, source, target } = req.body;

  // 1. Mise à jour de l'URL et de l'Hôte pour l'API 113
  const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/text';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      // Remplace bien 'TA_CLE_ICI' par ta clé : 
      'x-rapidapi-key': 'TA_CLE_ICI', 
      'x-rapidapi-host': 'google-translate113.p.rapidapi.com'
    },
    // 2. Utilisation de 'from' et 'to' au lieu de 'source' et 'target'
    body: JSON.stringify({
      from: source,
      to: target,
      text: text
    })
  };

  try {
    const apiRes = await fetch(url, options);
    const data = await apiRes.json();

    // Debug pour voir la réponse dans ton terminal
    console.log("Réponse API:", data);

    // 3. Extraction sécurisée du texte traduit selon le format de cette API
    const translatedText = data.trans || data.translated_text || (data.data && data.data.translations && data.data.translations[0].translatedText);

    if (translatedText) {
      res.json({ 
        translatedText,
        impact: {
          water: 15, // Valeur de ton affiche
          co2: 0.4    // Valeur de ton affiche
        }
      });
    } else {
      throw new Error("Format de réponse Google invalide ou traduction vide");
    }

  } catch (err) {
    console.error("Erreur API:", err.message);
    res.status(500).json({ error: "La traduction a échoué", details: err.message });
  }
});

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});