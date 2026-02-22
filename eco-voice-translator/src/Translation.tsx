import { useState } from "react";




function Translation(){


const [originalText, setOriginalText] = useState("texte de base")
const [translatedText, setTranslatedText] = useState("Texte traduit")

return <> 

<h1>Voici la page pour la traduction IA</h1> 
<p>Cette page affiche les résultats de la traduction IA avec l'analyse de l'empreinte carbone.</p>

<button>Commencer a enregistrer votre voix</button>

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
