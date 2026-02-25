import { useState } from "react";
import createSpeechRecognition from "./SpeechRecognition";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Translation() {
  const [originalText, setOriginalText] = useState("texte de base");
  const [translatedText, setTranslatedText] = useState("Texte traduit");
  const [micStatus, setMicStatus] = useState<"idle" | "granted" | "denied">(
    "idle"
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { original: string; translated: string }[]
  >([]);

  const recognition = createSpeechRecognition("fr-FR");

  // appel au backend pour la traduction du texte
  async function handleTranslateClick() {
    if (originalText.trim() === "") {
      alert("Veuillez prononcer ou écrire quelque chose avant de traduire.");
      return;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      const res = await fetch("http://localhost:4000/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: originalText,
          source: "fr",
          target: "en",
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur HTTP " + res.status);
      }

      const data = await res.json();
      setTranslatedText(data.translatedText);
      setHistory((prev) => [
        ...prev,
        { original: originalText, translated: data.translatedText },
      ]);
    } catch (error) {
      console.error(error);
      setTranslationError(
        "Une erreur est survenue lors de la traduction. Veuillez réessayer."
      );
    } finally {
      setIsTranslating(false);
    }
  }

  // gestion de l'enregistrement vocal
  function handleStartRecording() {
    if (!recognition) {
      alert("Le Web Speech API n'est pas supporté sur ce navigateur.");
      return;
    }

    if (
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      setMicStatus("denied");
      alert(
        "Votre navigateur ne supporte pas l'accès au microphone. Essayez avec un autre navigateur."
      );
      return;
    }

    if (micStatus === "granted") {
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setOriginalText(text);
      };

      recognition.start();
      return;
    }

    if (micStatus === "idle") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setMicStatus("granted");

          recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setOriginalText(text);
          };

          recognition.start();
        })
        .catch(() => {
          setMicStatus("denied");
          alert(
            "L'accès au microphone a été refusé. Veuillez autoriser l'accès pour utiliser la traduction vocale."
          );
        });
    } else {
      alert(
        "L'accès au microphone a été refusé. Vérifiez les paramètres de votre navigateur."
      );
    }
  }

  // synthèse vocale du texte traduit
  function handleSpeakTranslatedText() {
    if (translatedText.trim() === "") {
      alert("Aucun texte traduit à prononcer.");
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("La synthèse vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }

  // calculs d'impact
  function calculateImpact(text: string): string {
    const wordCount = text.trim().split(/\s+/).length;
    const impact = (wordCount * 0.05).toFixed(2);
    const impactwater = (wordCount * 0.5).toFixed(2);
    return `Cette traduction a généré environ ${impact}g de CO2 et ${impactwater}ml d'eau.`;
  }

  function calculateImpactValues(
    text: string
  ): { co2: number; water: number } {
    const wordCount = text.trim().split(/\s+/).length;
    return {
      co2: parseFloat((wordCount * 0.05).toFixed(2)),
      water: parseFloat((wordCount * 0.5).toFixed(2)),
    };
  }

  function calculateTotalImpact(
    history: { original: string; translated: string }[]
  ): { totalCO2: number; totalWater: number } {
    return history.reduce(
      (totals, item) => {
        const impact = calculateImpactValues(item.original);
        return {
          totalCO2: totals.totalCO2 + impact.co2,
          totalWater: totals.totalWater + impact.water,
        };
      },
      { totalCO2: 0, totalWater: 0 }
    );
  }

  // série pour le graphique (eau par traduction)
  function buildWaterSeries(
    history: { original: string; translated: string }[]
  ) {
    return history.map((item, index) => {
      const impact = calculateImpactValues(item.original);
      return {
        index: index + 1,
        water: impact.water,
        co2: impact.co2,
      };
    });
  }

  const { totalCO2, totalWater } = calculateTotalImpact(history);
  const waterSeries = buildWaterSeries(history);

  // rendu
  return (
    <>
      <h1>Voici la page pour la traduction IA</h1>
      <p>
        Cette page affiche les résultats de la traduction IA avec l'analyse de
        l'empreinte carbone.
      </p>

      <button onClick={handleStartRecording}>
        Commencer à enregistrer votre voix
      </button>

      <div>
        <h3>Le texte original</h3>
        <p>{originalText}</p>
      </div>

      <div>
        <h3>Le texte traduit</h3>
        <p>{translatedText}</p>
      </div>

      <button onClick={handleSpeakTranslatedText}>Parler</button>

      <button onClick={handleTranslateClick} disabled={isTranslating}>
        {isTranslating ? "Traduction en cours..." : "Traduire"}
      </button>

      {translationError && (
        <p style={{ color: "red" }}>{translationError}</p>
      )}

      <div>
        <h3>Impact de cette traduction:</h3>
        <p>{calculateImpact(originalText)}</p>
      </div>

      <div>
        <h3>Historique et total de la session :</h3>
        <p>
          Total estimé de la session : {totalCO2.toFixed(2)} g de CO2 et{" "}
          {totalWater.toFixed(2)} ml d'eau.
        </p>

        {history.length === 0 ? (
          <p>Aucune traduction effectuée pour le moment.</p>
        ) : (
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                <strong>Original:</strong> {item.original} |{" "}
                <strong>Traduit:</strong> {item.translated}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3>Évolution de l'eau utilisée (ml) par traduction</h3>
        {waterSeries.length === 0 ? (
          <p>Aucune donnée pour l’instant.</p>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={waterSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="index"
                  label={{
                    value: "Traduction #",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Eau (ml)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="water"
                  stroke="#0088FE"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div>
        <h3>Analyse environnementale de la journée:</h3>
      </div>

      <button onClick={() => (window.location.href = "/")}>
        Retour à la présentation
      </button>
    </>
  );
}

export default Translation;
