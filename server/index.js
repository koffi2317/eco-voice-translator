const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/translate", (req, res) => {

     console.log("POST /api/translate called with body:", req.body);
  const { text, source, target } = req.body;

  // TODO: ici plus tard on mettra l'appel à Google Translate.
  // Pour l’instant, on renvoie une fake traduction en anglais.
  const fakeEnglish =
    "This is a fake English translation of: " + text;

  res.json({ translatedText: fakeEnglish });
});


app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
