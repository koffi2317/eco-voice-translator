import { useState } from "react";
import createSpeechRecognition from "./SpeechRecognition";

function Translation() {
  const [originalText, setOriginalText] = useState("texte de base");
  const [translatedText, setTranslatedText] = useState("Texte traduit");
  const [micStatus, setMicStatus] = useState<"idle" | "granted" | "denied">("idle");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ original: string; translated: string }[]>([]);



  const recognition = createSpeechRecognition("fr-FR"); // peut être null si non supporté [web:226][web:231]

  function translateText(text: string): Promise<string> {
  // pour l’instant FAKE : on simule une API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(text + " (traduit)");
    }, 500);
  });
}


  function handleStartRecording() {
    // 1) Vérifier support Web Speech API
    if (!recognition) {
      alert("Le Web Speech API n'est pas supporté sur ce navigateur.");
      return;
    }

    // 2) Vérifier support getUserMedia
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

    // 3) Si déjà autorisé → on peut lancer l'écoute
    if (micStatus === "granted") {
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setOriginalText(text);
      };

      recognition.start(); // commence l'écoute [web:177][web:258]
      return;
    }

    // 4) Première fois : demander la permission, puis lancer l'écoute
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
      // micStatus === "denied"
      alert(
        "L'accès au microphone a été refusé. Vérifiez les paramètres de votre navigateur."
      );
    }
  }


async function handleTranslateClick() {
  // 1) Vérifier qu'on a bien du texte à traduire
  if (originalText.trim() === "") {
    alert("Veuillez prononcer ou écrire quelque chose avant de traduire.");
    return;
  }

  // 2) Mettre le state de chargement + reset erreur
  setIsTranslating(true);
  setTranslationError(null);

  try {
    // 3) Appeler la “fake API” de traduction
    const result = await translateText(originalText);
    setTranslatedText(result);
    setHistory((prev) => [...prev, { original: originalText, translated: result }]);

  } catch (error) {
    // 4) Gérer l’erreur
    setTranslationError(
      "Une erreur est survenue lors de la traduction. Veuillez réessayer."
    );
  } finally {
    // 5) Toujours arrêter le “loading”
    setIsTranslating(false);
  }
}


function handleSpeakTranslatedText() {  

    if (translatedText.trim() === "") {
        alert("Aucun texte traduit à prononcer.");
        return; 
    } 

    else if (!("speechSynthesis" in window)) { 

        alert("La synthèse vocale n'est pas supportée sur ce navigateur.");
        return;
    }   

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = "en-US"; // ou la langue de votre choix
    window.speechSynthesis.speak(utterance);
}

function calculateImpact(text:string): string {
  // FAKE : on simule une analyse d'impact environnemental
  const wordCount = text.trim().split(/\s+/).length;
  const impact = (wordCount * 0.05).toFixed(2); // 0.05g CO2 par mot
  const impactwater=(wordCount*0.5).toFixed(2); // 0.5ml d'eau par mot
  return `Cette traduction a généré environ ${impact}g de CO2 et ${impactwater}ml d'eau.`;
}


function calculateImpactValues(text:string): { co2: number; water: number } {
  const wordCount = text.trim().split(/\s+/).length;
  return {      co2: parseFloat((wordCount * 0.05).toFixed(2)), // 0.05g CO2 par mot
    water: parseFloat((wordCount * 0.5).toFixed(2)) // 0.5ml d'eau par mot
  };
}


function calculetotalImpact(history: { original: string; translated: string }[]): { totalCO2: number; totalWater: number } {
  return history.reduce(
    (totals, item) => {     
        const impact = calculateImpactValues(item.original);    
        return {
          totalCO2: totals.totalCO2 + impact.co2,
          totalWater: totals.totalWater + impact.water
        };
    },
    { totalCO2: 0, totalWater: 0 }
  );
}

const { totalCO2, totalWater } = calculetotalImpact(history);



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

      <button onClick={handleSpeakTranslatedText}>
        Parler
      </button>
      <button onClick={handleTranslateClick} disabled={isTranslating}>
  {    isTranslating ? "Traduction en cours..." : "Traduire"}
   </button>

      <div>
        <h3>Impact de cette traduction:</h3>
        <p>{calculateImpact(originalText)}</p>
      </div>

      <div>
        <h3>Historique et total de la session : </h3>

<p>
  Total estimé de la session : {totalCO2.toFixed(2)} g de CO2 et {totalWater.toFixed(2)} ml d'eau.
</p>


       { history.length === 0 ? (
        <p>Aucune traduction effectuée pour le moment.</p>
       ) : (
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <strong>Original:</strong> {item.original} | <strong>Traduit:</strong> {item.translated}
            </li>
          ))}
        </ul>
       )}
  

      </div>

      <div>
        <h3>Analyse environnementales de la journée: </h3>
      </div>

      <button onClick={() => (window.location.href = "/")}>
        Retour à la présentation
      </button>
    </>
  );
}

export default Translation;
