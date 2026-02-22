import { useState } from "react";




function Translation(){


const [originalText, setOriginalText] = useState("texte de base")
const [translatedText, setTranslatedText] = useState("Texte traduit")
const [micStatus, setMicStatus] = useState<"idle" | "granted" | "denied">("idle")

 function handleStartRecording() {
    // 1) Vérifier le support du navigateur
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

    // 2) Si déjà autorisé, pour l’instant on ne fait rien de plus
    if (micStatus === "granted") {
      return;
    }

    // 3) Si c’est la première fois, demander la permission
    if (micStatus === "idle") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setMicStatus("granted");
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

return <> 

<h1>Voici la page pour la traduction IA</h1> 
<p>Cette page affiche les résultats de la traduction IA avec l'analyse de l'empreinte carbone.</p>

<button onClick={handleStartRecording}>Commencer a enregistrer votre voix</button>

<div>
<h3>Le text original</h3>
<p>{originalText}</p> 



</div>

<div>  
<h3>Le text traduit</h3>
<p>{translatedText}</p>

</div>


<button onClick={()=>setOriginalText("test du bouton original")}>Parler</button> 
<button onClick={()=>setTranslatedText("text traduit test pour le bouton traduction ")}>Traduction</button>

<div>
<h3>Impact de cette traduction:</h3>

</div>


<div>
<h3>Historique et total de la session : </h3>

</div>


<div>
<h3>Analyse environnementales de la journée: </h3>

</div>


<button onClick={() => window.location.href = "/"}>Retour à la présentation</button>


</>


} export default Translation;
