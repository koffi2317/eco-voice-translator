import { useState } from "react";
import createSpeechRecognition from "./SpeechRecognition";

function Translation() {
  const [originalText, setOriginalText] = useState("texte de base");
  const [translatedText, setTranslatedText] = useState("Texte traduit");
  const [micStatus, setMicStatus] =
    useState<"idle" | "granted" | "denied">("idle");

  const recognition = createSpeechRecognition("fr-FR"); // peut être null si non supporté [web:226][web:231]

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

      <button onClick={() => setOriginalText("test du bouton original")}>
        Parler
      </button>
      <button
        onClick={() =>
          setTranslatedText("text traduit test pour le bouton traduction ")
        }
      >
        Traduction
      </button>

      <div>
        <h3>Impact de cette traduction:</h3>
      </div>

      <div>
        <h3>Historique et total de la session : </h3>
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
